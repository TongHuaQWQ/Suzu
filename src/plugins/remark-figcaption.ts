/**
 * Satteri HAST 插件：将单张图片的 <p> 替换为 <figure><img><figcaption></figure>
 */
export function remarkFigcaption() {
  return {
    name: "figcaption",
    element: {
      filter: ["img"],
      visit(node: any, ctx: any) {
        const alt = node.properties?.alt ?? "";
        if (!alt || !node.properties?.src) return;

        const parent = ctx.parent(node);
        if (!parent || parent.tagName !== "p") return;

        // 跳过含多个子节点的段落
        const children = parent.children?.filter(
          (c: any) => c.type === "element" || c.type === "text",
        );
        if (!children || children.length !== 1) return;

        const figure = {
          type: "element",
          tagName: "figure",
          properties: {},
          children: [
            node,
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [{ type: "text", value: alt }],
            },
          ],
        };

        ctx.insertBefore(parent, figure);
        ctx.removeNode(parent);
      },
    },
  };
}
