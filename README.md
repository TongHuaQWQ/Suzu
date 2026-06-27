# Suzu

一个现代化、功能丰富的静态博客模板，基于[Astro](https://astro.build/)构建

[**🖥️ 在线演示**](https://suzu.24862648.xyz/)
> [!CAUTION]
> 项目功能并未完全，思考后在确定使用

> [!WARNING]
> 本项目仍在积极开发中，部分功能可能发生变化。

> [!TIP]
> 本项目参考了[Fuwari](https://github.com/saicaca/fuwari)的页面设计和[Mizuki](https://github.com/LyraVoid/Mizuki)的功能，可以使用这个项目


## ✨ 功能特性

### 🎨 设计与界面

- [x] 基于 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- [x] [Material Design 3](https://m3.material.io/) 设计语言，种子色一键换肤
- [x] 流畅的页面动画
- [x] 自定义主题色
- [x] 全设备响应式设计

### 🔍 内容与导航

- [ ] 搜索入口（UI 已就绪，后端逻辑待接入）
- [x] 文内目录，支持自动滚动高亮
- [x] 交互式知识图谱，文章关联可视化
- [x] 反向链接，显示引用当前文章的其他文章
- [x] 文章分类和标签系统
- [x] 阅读时间估算（中英文分开统计）
- [x] 置顶文章
- [x] 上一篇 / 下一篇导航

### ✍️ Markdown 增强

- [x] [Sätteri](https://satteri.dev/) 处理器，Rust 驱动，性能优秀
- [x] `[[wikilink]]` 语法关联文章
- [x] 标题锚点链接
- [x] `::github{repo="user/repo"}` 嵌入 GitHub 仓库卡片
- [x] 增强代码块（行号、折叠、语言徽标）
- [x] GFM 支持（表格、任务列表、删除线等）

### 📄 特色页面

- [x] **项目页** — 卡片展示，支持分类/状态筛选
- [x] **背包页** — 设备/好物展示


### 🛠 技术特性

- [x] [Expressive Code](https://expressive-code.com/) 代码块渲染
- [x] SEO 优化（Open Graph、Twitter Card、Canonical URL）
- [x] 图片优化（Astro 内置 Image 组件）
- [x] 版权声明（支持 CC 协议）

### 🚧 开发中 / 计划中

- [ ] 亮色 / 暗色模式切换
- [ ] 全文搜索
- [ ] 评论系统
- [ ] RSS / Atom 订阅
- [ ] 站点地图
- [ ] 回到顶部按钮

```bash
# 克隆项目
git clone https://github.com/TongHuaQWQ/Suzu.git
cd Suzu

# 如果没有安装 pnpm，先安装
npm install -g pnpm

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:4321`

## ⚙️ 配置

所有站点配置集中在 `src/site.config.ts`：

```ts
export const site = {
  title: "你的博客名",
  description: "博客描述",
  url: "https://example.com",
  profile: {
    name: "你的名字",
    avatar: "头像URL",
    signature: "个性签名",
  },
  // 功能开关、主题色、社交链接等...
}
```

> [!TIP]
> 想改博客名？只需修改 `site.config.ts` 中的 `title` 字段，所有页面的 `<title>` 标签会自动同步。

## 📝 添加内容

### 博客文章

在 `src/content/posts/` 创建 `.md` 或 `.mdx` 文件：

```yaml
---
title: "文章标题"
date: "2026-06-23"
description: "文章描述"
tags: ["Astro", "CSS"]
categories: ["技术"]
pinned: true    # 可选，置顶
image: "../../assets/cover.png"  # 可选，封面图
---
```

### 项目展示

在 `src/content/projects/` 创建 `.md` 文件：

```yaml
---
title: "项目名称"
date: "2026-06-23"
category: "web"          # web / mobile / desktop / other
techStack: ["Astro", "Tailwind CSS"]
status: "completed"      # completed / in-progress / planned
sourceCode: "https://github.com/..."
---
```

## 🧩 自定义 Markdown 插件

支持通过 Sätteri 的插件系统扩展 Markdown 语法：

- **[[wikilink]]** — `[[slug]]` 链接到其他文章
- **标题锚点** — 自动生成锚点链接
- **GitHub 卡片** — `::github{repo="user/repo"}` 嵌入仓库信息

## 📦 技术栈

- [Astro](https://astro.build/) — 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) — 原子化 CSS
- [Sätteri](https://satteri.dev/) — Rust 驱动的 Markdown 处理器
- [Force Graph](https://github.com/vasturiano/force-graph) — 知识图谱可视化
- [Expressive Code](https://expressive-code.com/) — 代码块渲染


## 🙏 致谢

- 灵感参考自 [Fuwari](https://github.com/saicaca/fuwari) 和 模板 [Navfolio](https://github.com/dodolalorc/astro-navfolio)
- 部分设计灵感来源于 [Mizuki](https://github.com/LyraVoid/Mizuki)
- 图标来自 [Iconify](https://iconify.design/)

