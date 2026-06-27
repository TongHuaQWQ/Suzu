import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 独立页面（关于、联系）
const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    avatar: z.string().optional(),
    signature: z.string().optional(),
  }),
});

// 博客文章
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    pinned: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    series: z.string().optional(),
  }),
});

// 项目笔记
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    category: z.enum(["web", "mobile", "desktop", "other"]).default("other"),
    techStack: z.array(z.string()).default([]),
    status: z
      .enum(["completed", "in-progress", "planned"])
      .default("completed"),
    liveDemo: z.string().optional(),
    sourceCode: z.string().optional(),
    tags: z.array(z.string()).optional(),
    visitUrl: z.string().optional(),
  }),
});

// 个人装备
const backpack = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/backpack" }),
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    year: z.number(),
    status: z.enum(["使用中", "闲置"]),
    description: z.string(),
    reason: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = { pages, posts, projects, backpack };
