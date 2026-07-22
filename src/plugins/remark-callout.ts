/**
 * Satteri MDAST 插件：将 > [!NOTE] / :::tip 语法转换为 callout 容器。
 * 图标由构建时 CSS（mask-image）注入，本插件只输出 class + 标题文字。
 *
 * 返回结构化 MDAST 节点，不走 Rust 重解析，避免 {slug} 中的 { 和 } 
 * 被当作 MDX 模板定界符转义。
 */

const CALLOUT_PREFIX = /^\s*\[!(\w+)([+-])?\]\s*/i;
const CALLOUT_NAMES: Record<string, string> = {
  note: "Note", info: "Info", todo: "Todo", tip: "Tip", hint: "Hint",
  important: "Important", success: "Success", check: "Check", done: "Done",
  question: "Question", help: "Help", faq: "FAQ",
  warning: "Warning", caution: "Caution", attention: "Attention",
  danger: "Danger", error: "Error", bug: "Bug",
  example: "Example", quote: "Quote", cite: "Cite",
  abstract: "Abstract", summary: "Summary", tldr: "TL;DR",
  failure: "Failure", fail: "Fail", missing: "Missing",
};

function getCalloutName(name: string) {
  return CALLOUT_NAMES[name.toLowerCase()] ?? null;
}

// ── MDAST 节点构建（完全避免 data.hProperties，用原生 HAST 属性通道） ──

/** 创建带 class 的 blockquote */
function makeCalloutBlockquote(type: string, children: any[]): any {
  return {
    type: "blockquote",
    data: {
      hProperties: {
        className: ["callout", `callout-${type}`],
        "data-callout": type,
      },
    },
    children,
  };
}

/** 创建简单 div 包装器 */
function makeDiv(className: string, children: any[]): any {
  return {
    type: "paragraph",
    data: {
      hName: "div",
      hProperties: { className: [className] },
    },
    children,
  };
}

/** 创建简单 span 包装器 */
function makeSpan(className: string, children: any[]): any {
  return {
    type: "emphasis",
    data: {
      hName: "span",
      hProperties: { className: [className] },
    },
    children,
  };
}

/** 构建完整 callout 节点 */
function buildCalloutNode(type: string, title: string, children: any[]): any {
  return makeCalloutBlockquote(type, [
    makeDiv("callout-title", [
      makeSpan("callout-title-text", [
        { type: "text", value: title },
      ]),
    ]),
    makeDiv("callout-content", children),
  ]);
}

/** 构建可折叠 callout 节点（details/summary） */
function buildCollapsibleCalloutNode(
  type: string,
  title: string,
  children: any[],
  defaultOpen: boolean,
): any {
  return {
    type: "paragraph",
    data: {
      hName: "details",
      hProperties: {
        className: ["callout", `callout-${type}`],
        "data-callout": type,
        ...(defaultOpen ? { open: true } : {}),
      },
    },
    children: [
      {
        type: "paragraph",
        data: {
          hName: "summary",
          hProperties: { className: ["callout-title"] },
        },
        children: [
          makeSpan("callout-title-text", [
            { type: "text", value: title },
          ]),
        ],
      },
      ...(children.length > 0
        ? [makeDiv("callout-content", children)]
        : []),
    ],
  };
}

/** 检测并转换 > [!NOTE] blockquote */
function detectCallout(node: any): any | null {
  const p = node.children?.[0];
  if (p?.type !== "paragraph") return null;
  const tn = p.children?.[0];
  if (tn?.type !== "text") return null;
  const m = tn.value.match(CALLOUT_PREFIX);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const label = getCalloutName(m[1]);
  if (!label) return null;
  const collapsible = m[2] != null;
  const defaultOpen = m[2] !== "-";
  const titleLine = tn.value.slice(m[0].length).split("\n")[0].trim();
  const title = titleLine || label;

  // 去掉前缀和标题行，只保留内容
  const afterMarker = tn.value.slice(m[0].length);
  const firstNewline = afterMarker.indexOf("\n");
  const strippedValue = firstNewline >= 0
    ? afterMarker.slice(firstNewline + 1)
    : "";

  if (strippedValue.trim() === "" && p.children.length === 1) {
    // 首段空了，跳过
    return buildCalloutNode(type, title, node.children.slice(1));
  }

  const newFirstP = {
    type: "paragraph",
    children: p.children.map((child: any) =>
      child === tn
        ? { type: "text", value: strippedValue }
        : child,
    ),
  };
  const newChildren = [newFirstP, ...node.children.slice(1)];

  return collapsible
    ? buildCollapsibleCalloutNode(type, title, newChildren, defaultOpen)
    : buildCalloutNode(type, title, newChildren);
}

// ── MDAST Plugin: > [!NOTE] blockquote 语法 ──

export function remarkCallout() {
  return {
    name: "remark-callout",
    blockquote(node: any) {
      const result = detectCallout(node);
      if (result) return result;
    },
  };
}

// ── MDAST Plugin: :::tip 指令语法 ──

export function remarkCalloutDirective() {
  return {
    name: "remark-callout-directive",
    containerDirective(node: any) {
      const label = getCalloutName(node.name);
      if (!label) return;
      const type = node.name.toLowerCase();
      const title = node.attributes?.label ?? label;

      return buildCalloutNode(type, title, node.children ?? []);
    },
  };
}
