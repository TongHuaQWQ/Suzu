// src/pages/atom.xml.ts
import { getAtomString } from "astrojs-atom";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

import { site } from "../site.config";

const md = new MarkdownIt();

export async function GET(context: any) {
  // 1. 获取所有文章
  const posts = await getCollection("posts");

  // 2. 过滤掉没有日期的文章，并按日期排序（最新的在前）
  const sortedPosts = posts
    .filter((post) => post.data.date)
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    );

  // 3. 生成 Atom XML 字符串
  const atomXml = await getAtomString({
    // -------- Feed 必填元数据 --------
    title: site.title,
    id: site.url, // 通常是网站根 URL
    updated: new Date().toISOString(), // Feed 更新时间（RFC 3339）

    // -------- Feed 选填元数据 --------
    subtitle: site.description,
    lang: site.lang,
    author: [{ name: site.profile?.name || "Author" }],
    // 如果有需要，可以添加自定义样式表
    // stylesheet: "/atom-styles.xsl",

    // -------- 文章条目 --------
    entry: sortedPosts.map((post) => ({
      title: post.data.title,
      id: `${site.url}posts/${post.id}/`, // 文章的唯一标识符（永久链接）
      updated: new Date(post.data.date).toISOString(), // 文章更新时间（RFC 3339）
      published: new Date(post.data.date).toISOString(), // 文章发布时间（可选）
      link: [{ href: `${site.url}posts/${post.id}/`, rel: "alternate" }],
      // 内容：这里使用 post.body（原始 Markdown）
      // 如果你想渲染成 HTML，需要用 markdown-it 等工具
      content: {
        type: "html" as const,
        value: sanitizeHtml(md.render(post.body || ""), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
      },
      summary: post.data.description || "",
    })),
  });

  // 4. 返回 Response，设置正确的 Content-Type
  return new Response(atomXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8", // ← 改成 application/xml
    },
  });
}
