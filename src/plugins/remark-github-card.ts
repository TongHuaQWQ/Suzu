/**
 * Satteri MDAST 插件：处理 ::github{repo="user/repo"} 指令
 * 将其转换为 <github-card> 自定义元素
 */
export function remarkGithubCard() {
  return {
    name: "github-card",
    leafDirective(node: any) {
      if (node.name !== "github") return;
      const repo = node.attributes?.repo;
      if (!repo) return;

      return {
        rawHtml: `<github-card repo="${repo}"></github-card>`,
      };
    },
    containerDirective(node: any) {
      if (node.name !== "github") return;
      const repo = node.attributes?.repo;
      if (!repo) return;

      return {
        rawHtml: `<github-card repo="${repo}"></github-card>`,
      };
    },
  };
}
