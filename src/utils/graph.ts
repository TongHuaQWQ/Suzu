import { getCollection } from "astro:content";

export interface GraphNode {
  id: string;
  title: string;
  slug: string;
  tags: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  backlinks: Record<string, string[]>;
  outgoing: Record<string, string[]>;
}

/**
 * 从文章内容中提取 [[wikilinks]]
 */
function extractWikilinks(content: string): string[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return links;
}

/**
 * 构建知识图谱数据（节点 + 边 + 反向链接）
 */
export async function buildGraphData(): Promise<GraphData> {
  const posts = await getCollection("posts");

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const backlinks: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};

  // 构建 slug -> post 映射
  const slugMap = new Map<string, (typeof posts)[number]>();
  // 初始化
  for (const post of posts) {
    slugMap.set(post.id, post);
    backlinks[post.id] = [];
    outgoing[post.id] = [];
  }

  // 生成节点
  for (const post of posts) {
    nodes.push({
      id: post.id,
      title: post.data.title,
      slug: `/posts/${post.id}`,
      tags: post.data.tags ?? [],
    });
  }

  // 提取出链，构建边和反向链接
  for (const post of posts) {
    const links = extractWikilinks(post.body ?? "");
    for (const target of links) {
      // 1. 优先完全匹配
      if (slugMap.has(target)) {
        edges.push({ source: post.id, target });
        backlinks[target].push(post.id);
        outgoing[post.id].push(target);
        continue;
      }

      // 2. 如果完全匹配失败，尝试按文件名匹配（忽略目录）
      let matchedId: string | undefined;
      for (const [id] of slugMap) {
        // id 格式如 "sql/API"，target 是 "API"
        if (id.endsWith(`/${target}`) || id === target) {
          matchedId = id;
          break;
        }
      }
      if (matchedId) {
        edges.push({ source: post.id, target: matchedId });
        backlinks[matchedId].push(post.id);
        outgoing[post.id].push(matchedId);
      }
    }
  }

  return { nodes, edges, backlinks, outgoing };
}
