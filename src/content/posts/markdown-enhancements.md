---
title: "Suzu 的 Markdown 增强功能"
date: "2026-06-27"
pubDate: "2026-06-27"
description: "本博客独有的 Markdown 增强语法：WikiLink、GitHub 卡片、标题锚点、增强代码块等"
tags: ["Markdown", "教程", "Suzu"]
categories: ["指南"]
---

这篇教程介绍 Suzu 博客在标准 Markdown 之外的**独家增强功能**，善用它们可以让文章更生动、关联更紧密。

## [[WikiLink]] — 文章链接

用 `[[slug]]` 语法快速链接到博客中的其他文章，不需要写完整 URL：

```markdown
推荐阅读 [[文章文件名]] 了解更多 Markdown 语法。
```

效果：推荐阅读 [[mdx-guide]] 了解更多 Markdown 语法。

WikiLink 会在构建时自动解析，并在**知识图谱**中建立文章之间的关联关系。

## ::github — GitHub 仓库卡片

用 `::github` 指令在正文中嵌入 GitHub 仓库信息卡片：

```markdown
::github{repo="withastro/astro"}
```

效果：

::github{repo="withastro/astro"}

卡片会自动显示仓库的描述、星标数、语言等信息，适合在介绍项目时使用。

## 标题锚点

文章中的 `h2`、`h3`、`h4` 标题在鼠标悬停时会自动显示 `#` 锚点链接，点击可复制链接到当前标题位置：

```markdown
## 这是一个标题
```

将鼠标悬停在本页面的任意标题上试试。

## 增强代码块

本博客使用 Expressive Code 渲染代码块，支持多种增强功能。

### 行号

所有代码块自动显示行号：

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

### 代码折叠

用 `collapse={行号范围}` 属性将不需要展示的代码行折叠起来：

```js collapse={1-3}
// 这段导入代码会被折叠
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

// 这段正常显示
export default defineConfig({
  vite: { plugins: [tailwind()] },
});
```

### 文件名标题

用 `title` 属性显示文件名：

```js title="src/config.js"
export const site = {
  title: "Suzu",
};
```

### 语言徽标

代码块右上角自动显示语言类型徽标：

```bash
pnpm dev
```

```python
print("Hello, Suzu!")
```

## 知识图谱

本博客使用 Force Graph 可视化文章之间的链接关系。当你使用 WikiLink 或普通链接引用其他文章时，这些关系会自动出现在侧边栏的**知识图谱**中，形成一个网状的知识结构。


## 写作建议

- 善用 `[[wikilink]]` 关联相关文章，构建知识网络
- 介绍开源项目时使用 `::github` 卡片，信息更直观
- 较长的代码块用 `collapse` 折叠无关紧要的部分
- 复杂代码标注 `title` 方便读者理解上下文
