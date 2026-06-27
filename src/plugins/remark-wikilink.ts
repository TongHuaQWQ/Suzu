/**
 * Satteri HAST 插件：将 [[wikilinks]] 转换为链接
 */
export function remarkWikilink() {
  return {
    name: "wikilink",
    element: {
      filter: ["p", "li", "td", "th", "blockquote"],
      visit(node: any, ctx: any) {
        if (!node.children) return;

        const textNodes = node.children
          .filter((c: any) => c.type === "text" && c.value.includes("[["))
          .slice();

        for (const textNode of textNodes) {
          const parts = parseWikilinks(textNode.value);
          if (parts.length <= 1) continue;

          // 逐个插入新节点
          for (let i = 0; i < parts.length; i++) {
            ctx.insertBefore(textNode, parts[i]);
          }
          ctx.removeNode(textNode);
        }
      },
    },
  };
}

function parseWikilinks(text: string): any[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const parts: any[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    const slug = match[1].trim();
    parts.push({
      type: "element",
      tagName: "a",
      properties: { href: `/posts/${slug}`, className: ["wikilink"] },
      children: [{ type: "text", value: slug }],
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts;
}
