---
title: "MDX 写作指南"
date: "2026-06-13"
pubDate: "2026-06-13"
description: "本博客支持的 Markdown / MDX 语法一览"
image: "../../assets/posts/2026.jpg"
tags: ["Markdown", "MDX", "教程"]
categories: ["指南"]
---

这篇文章展示了本博客支持的所有 Markdown 和 MDX 语法，方便写作时参考。

## 标题

支持六级标题，文章中常用 `##` 到 `####`。

# qwq

## 二级标题

### 三级标题示例

#### 四级标题示例

## 文本样式

**粗体文字**、_斜体文字_、~~删除线~~、`行内代码`。

也可以组合使用：**_粗体加斜体_**。

## 链接

普通链接：[Astro 官网](https://astro.build)

自动链接：https://github.com

## 列表

### 无序列表

- 第一项
- 第二项
  - 嵌套 A
  - 嵌套 B
- 第三项

### 有序列表

1. 步骤一
2. 步骤二
3. 步骤三

### 任务列表

- [x] 搭建博客
- [x] 配置主题
- [ ] 写更多文章

## 引用块

> 好的工具不会取代创意，而是让创意更容易实现。
>
> —— 某位程序员

## 代码块

### JavaScript

```javascript
function greet(name) {
  return `你好，${name}！欢迎来到 Suzu 博客。`;
}

console.log(greet("世界"));
```

### 折叠

```js collapse={1-2}
// 这部分会被折叠
import { ... } from '...'

// 这部分正常显示
doSomething()
```

### TypeScript

```typescript
interface Post {
  title: string;
  date: string;
  tags?: string[];
  pinned?: boolean;
}

const posts: Post[] = [
  { title: "第一篇", date: "2026-06-08", tags: ["Astro"], pinned: true },
  { title: "第二篇", date: "2026-06-10", tags: ["CSS"] },
];
```

### CSS

```css
:root {
  --md-primary: #8b2671;
  --md-surface: #fff8f8;
}

.card {
  background: var(--md-surface);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Shell

```bash
pnpm create astro@latest
pnpm dev
pnpm build
```

### 代码编辑器框架

```js title="my-test-file.js"
console.log("Title attribute example");
```

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```

### 行内代码

使用 `pnpm dev` 启动开发服务器，访问 `localhost:4321` 预览。

## 表格

| 功能 | 语法          | 示例                        |
| ---- | ------------- | --------------------------- |
| 粗体 | `**text**`    | **粗体**                    |
| 斜体 | `*text*`      | _斜体_                      |
| 代码 | `` `code` ``  | `code`                      |
| 链接 | `[text](url)` | [链接](https://astro.build) |

| Left | Center | Right |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

## 分隔线

用三个 `-` 创建分隔线：

---

## 图片

在 frontmatter 中设置 `image` 字段即可显示封面图：

```yaml
---
title: "文章标题"
image: "../../assets/cover.jpg"
---
```

正文中的图片：

```markdown
![描述](图片路径)
```

## Frontmatter 字段说明

```yaml
---
title: "文章标题" # 必填
date: "2026-06-13" # 必填，发布日期
description: "文章简介" # 可选，卡片显示
image: "../../assets/x.png" # 可选，封面图
pinned: true # 可选，置顶文章
tags: ["标签1", "标签2"] # 可选，标签
categories: ["分类"] # 可选，分类
series: "系列名" # 可选，系列
---
```

## 写作建议

- 每篇文章都写 `description`，方便在卡片中预览
- 合理使用 `tags` 和 `categories`，方便归档检索
- 重要内容用 `pinned: true` 置顶
- 代码块标注语言类型以获得语法高亮
