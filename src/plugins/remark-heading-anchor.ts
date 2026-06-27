/**
 * Satteri HAST 插件：为标题添加锚点链接
 */
export function remarkHeadingAnchor() {
  return {
    name: "heading-anchor",
    element: {
      filter: ["h1", "h2", "h3", "h4"],
      visit(node: any, ctx: any) {
        const text = ctx.textContent(node);
        if (!text) return;

        // 生成 id（Satteri 的 headingIds 插件可能还未运行）
        const id =
          node.properties?.id ||
          text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w一-鿿-]/g, "");

        if (!node.properties?.id) {
          ctx.setProperty(node, "id", id);
        }

        ctx.appendChild(node, {
          type: "element",
          tagName: "a",
          properties: {
            className: ["heading-anchor"],
            href: `#${id}`,
            "aria-label": "Link to this section",
          },
          children: [{ type: "text", value: "#" }],
        });
      },
    },
  };
}
