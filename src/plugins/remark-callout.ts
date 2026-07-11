/**
 * Satteri MDAST 插件：将 > [!NOTE] / :::tip 语法转换为 callout 容器。
 * 图标由构建时 CSS（mask-image）注入，本插件只输出 class + 标题文字。
 */

const CALLOUT_PREFIX = /^\s*\[!(\w+)([+-])?\]\s*/i;
const CALLOUT_NAMES: Record<string, string> = {
  note: "Note",
  info: "Info",
  todo: "Todo",
  tip: "Tip",
  hint: "Hint",
  important: "Important",
  success: "Success",
  check: "Check",
  done: "Done",
  question: "Question",
  help: "Help",
  faq: "FAQ",
  warning: "Warning",
  caution: "Caution",
  attention: "Attention",
  danger: "Danger",
  error: "Error",
  bug: "Bug",
  example: "Example",
  quote: "Quote",
  cite: "Cite",
  abstract: "Abstract",
  summary: "Summary",
  tldr: "TL;DR",
  failure: "Failure",
  fail: "Fail",
  missing: "Missing",
};

function getCalloutName(name: string) {
  return CALLOUT_NAMES[name.toLowerCase()] ?? null;
}

// ── MDAST → HTML 序列化 ──

function serializeInline(node: any): string {
  switch (node.type) {
    case "text":
      return escapeHtml(node.value);
    case "inlineCode":
      return `<code>${escapeHtml(node.value)}</code>`;
    case "strong":
      return `<strong>${walkChildren(node)}</strong>`;
    case "emphasis":
      return `<em>${walkChildren(node)}</em>`;
    case "link":
      return `<a href="${escapeHtml(node.url)}">${walkChildren(node)}</a>`;
    case "image":
      return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(node.alt ?? "")}" />`;
    case "delete":
      return `<del>${walkChildren(node)}</del>`;
    default:
      return walkChildren(node);
  }
}

function walkChildren(node: any): string {
  return node.children?.map(serializeInline).join("") ?? "";
}

/** 检测 blockquote 节点是否是 callout，是则返回 callout HTML，否则返回 null */
function buildCalloutHtml(node: any): string | null {
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

  const inner = node.children
    .map(serializeBlock)
    .join("")
    .replace(/^<p>\s*\[!\w+[+-]?\][^\n]*\n?/, "<p>")
    .replace(/^<p>\s*<\/p>$/m, "")
    .trim();

  const head = collapsible
    ? `<details class="callout callout-${type}" data-callout="${type}"${defaultOpen ? " open" : ""}>` +
      `<summary class="callout-title"><span class="callout-title-text">${escapeHtml(title)}</span></summary>`
    : `<blockquote class="callout callout-${type}" data-callout="${type}">` +
      `<div class="callout-title"><span class="callout-title-text">${escapeHtml(title)}</span></div>`;
  const foot = collapsible ? `</details>` : `</blockquote>`;
  return (
    head + (inner ? `<div class="callout-content">${inner}</div>` : "") + foot
  );
}

function serializeBlock(node: any): string {
  // 嵌套 callout 检测
  if (node.type === "blockquote") {
    const r = buildCalloutHtml(node);
    if (r) return r;
  }
  switch (node.type) {
    case "paragraph":
      return `<p>${walkChildren(node)}</p>\n`;
    case "list": {
      const tag = node.ordered ? "ol" : "ul";
      return `<${tag}>\n${(node.children ?? []).map((item: any) => `<li>${walkChildren(item)}</li>\n`).join("")}</${tag}>\n`;
    }
    case "code":
      return `<pre><code${node.lang ? ` class="language-${escapeHtml(node.lang)}"` : ""}>${escapeHtml(node.value)}</code></pre>\n`;
    case "heading":
      return `<h${node.depth || 2}>${walkChildren(node)}</h${node.depth || 2}>\n`;
    case "blockquote":
      return `<blockquote>${node.children?.map(serializeBlock).join("") ?? ""}</blockquote>\n`;
    case "thematicBreak":
      return "<hr>\n";
    default:
      return walkChildren(node);
  }
}

// ── MDAST Plugin: > [!NOTE] blockquote 语法 ──

export function remarkCallout() {
  return {
    name: "remark-callout",
    blockquote(node: any) {
      const html = buildCalloutHtml(node);
      if (html) return { rawHtml: html };
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

      const inner = (node.children ?? []).map(serializeBlock).join("");

      return {
        rawHtml:
          `<blockquote class="callout callout-${type}" data-callout="${type}">` +
          `<div class="callout-title"><span class="callout-title-text">${escapeHtml(title)}</span></div>` +
          (inner ? `<div class="callout-content">${inner}</div>` : "") +
          `</blockquote>`,
      };
    },
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
