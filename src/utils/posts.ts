import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"posts">;

/**
 * 获取排序后的博客文章（置顶优先，然后按日期倒序）
 */
export async function getSortedPosts(filter?: (post: BlogPost) => boolean) {
  const allPosts = await getCollection("posts");
  const posts = filter ? allPosts.filter(filter) : allPosts;

  const pinned = posts
    .filter((p) => p.data.pinned)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  const normal = posts
    .filter((p) => !p.data.pinned)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return [...pinned, ...normal];
}
