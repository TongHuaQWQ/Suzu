# Suzu

> 基于 Astro + Sätteri 的个人博客系统。

## Tech Stack

- **Framework:** Astro 7
- **Markdown/MDX:** Sätteri processor (`@astrojs/markdown-satteri`)
- **CSS:** Tailwind CSS 4 + `@tailwindcss/typography`
- **Content:** Astro Content Collections（5 个 collection）
- **Package manager:** pnpm
- **Runtime:** Node.js >=22.12.0
- **MDX:** `@astrojs/mdx`

## Commands

```bash
pnpm dev                    # 启动开发服务器
pnpm run build              # 构建生产版本
pnpm run preview            # 预览构建结果
pnpm run astro              # 执行 Astro CLI 命令
```

## Project Structure

```
src/
├── content/                # Content collections
│   ├── posts/              #   博客文章 (md/mdx)
│   ├── pages/              #   独立页面（关于等）
│   ├── projects/           #   项目笔记
│   ├── backpack/           #   个人装备
│   └── albums/             #   相册 (md)
├── components/             # UI 组件
│   ├── backpack/           #   装备页面组件
│   ├── blog/               #   博客组件（文章卡片、图谱等）
│   ├── layout/             #   布局相关组件（Header, Footer 等）
│   ├── sidebar/            #   侧边栏组件
│   └── ui/                 #   通用 UI 组件
├── layouts/                # 页面布局
│   ├── BaseLayout.astro    #   基础布局（HTML shell）
│   ├── SidebarLayout.astro #   带侧边栏的布局
│   └── PageLayout.astro    #   页面布局
├── pages/                  # 路由（文件路由）
│   ├── index.astro         #   首页
│   ├── [...slug].astro     #   动态路由
│   ├── archives/           #   归档
│   ├── posts/              #   文章列表/分页
│   ├── tags/               #   标签页面
│   ├── categories/         #   分类页面
│   ├── projects/           #   项目页面
│   ├── backpack/           #   装备页面
│   ├── albums/             #   相册页面
│   ├── page/               #   分页
│   ├── rss.xml.js          #   RSS Feed
│   ├── atom.xml.ts         #   Atom Feed
│   └── sitemap.xml.ts      #   Sitemap
├── plugins/                # Sätteri MDAST/HAST 插件
│   ├── remark-callout.ts   #   Callout 支持
│   ├── remark-figcaption.ts #   图片标题
│   ├── remark-github-card.ts #  GitHub 仓库卡片
│   ├── remark-heading-anchor.ts # 标题锚点
│   ├── remark-wikilink.ts  #   Wiki 链接 [[link]]
│   └── theme-icons.ts      #   主题图标
├── utils/                  # 工具函数
│   ├── posts.ts            #   文章查询/排序/分页
│   ├── time.ts             #   时间格式化
│   ├── reading.ts          #   阅读时间计算
│   ├── image.ts            #   图片处理
│   ├── graph.ts            #   知识图谱
│   ├── github.ts           #   GitHub API 数据获取
│   └── callout-css.ts      #   Callout CSS 生成
├── scripts/                # 客户端脚本
├── assets/                 # 静态资源（图片）
│   ├── devices/            #   设备图
│   ├── posts/              #   文章配图
│   ├── projects/           #   项目配图
│   └── albums/             #   相册图片 (slug 子目录)
├── styles/                 # 全局样式
│   ├── global.css          #   全局 CSS
│   ├── callout.css         #   Callout 样式（构建生成）
│   └── github-card.css     #   GitHub 卡片样式
├── site.config.ts          # 站点配置文件
└── content.config.ts       # Content Collections 定义
```

## Content Collections 字段

### posts（博客文章）
```yaml
title: string            # 标题
date: string             # 日期 (YYYY-MM-DD)
description?: string     # 描述
image?: string           # 封面图
pinned?: boolean         # 是否置顶
tags?: string[]          # 标签
categories?: string[]    # 分类
series?: string          # 系列
```

### pages（独立页面）
```yaml
title: string            # 标题
description?: string     # 描述
avatar?: string          # 头像
signature?: string       # 签名
```

### projects（项目笔记）
```yaml
title: string            # 标题
date: string             # 日期
description?: string     # 描述
image?: string           # 封面图
category: "web"|"mobile"|"desktop"|"other"  # 分类
techStack?: string[]     # 技术栈
status: "completed"|"in-progress"|"planned" # 状态
liveDemo?: string        # 演示地址
sourceCode?: string      # 源代码
tags?: string[]          # 标签
visitUrl?: string        # 访问链接
```

### backpack（个人装备）
```yaml
title: string            # 装备名称
image?: string           # 图片
year: number             # 年份
status: "使用中"|"闲置" # 状态
description: string      # 描述
reason?: string          # 选择理由
category?: string        # 分类
```

### albums（相册）
```yaml
title: string            # 相册标题
date: string             # 日期 (YYYY-MM)
description?: string     # 描述
cover?: string           # 封面图路径（本地路径或外部 URL）
tags?: string[]          # 标签
location?: string|string[]  # 地点
mode?: string            # 设置为 "external" 时列表页显示「外链」徽章
hidden?: boolean         # 设为 true 时在列表页隐藏
photos?: string[]        # 外部图片 URL 数组
```

## Conventions

- **博客文章：** 放在 `src/content/posts/` 下，md/mdx 均可
- **图片：** 放在 `src/assets/posts/<post-slug>/`，用相对路径引用
- **标签/分类：** 在 frontmatter 中定义，自动生成标签页/分类页
- **组件命名：** PascalCase（`BlogCard.astro`）
- **文件名：** kebab-case（`my-first-post.md`）
- **工具函数：** camelCase（`formatDate.ts`）
- **Sätteri 插件：** 在 `src/plugins/` 下，MDAST 插件用 `remark-` 前缀，HAST 插件同上（经 satteri 配置）
- **Callout：** 在 markdown/mdx 中使用 `> [!NOTE]` / `> [!WARNING]` 等 GitHub Alerts 语法或 `:::tip` 容器语法
- **Wiki 链接：** 使用 `[[文章标题]]` 语法创建内部链接
- **GitHub 卡片：** 使用 `github: 用户名/仓库` 语法嵌入仓库信息卡片
- **相册：** `src/content/albums/{slug}.md` 即一个相册，图片放在 `src/assets/albums/{slug}/`（优化）或 `public/photos/{slug}/`（原图），封面图自动选择 cover 字段 → 本地第一张 → 外部第一张 URL
- **站点配置：** 所有站点级配置在 `src/site.config.ts` 中统一管理
- **代码风格：** 遵循 Astro 官方风格（`astro/tsconfigs/strict`）
- **构建时：** `generateGitHubCache()` 预取 GitHub 数据；`generateCalloutCSS()` 生成 Callout CSS

## 内容管理

- **新建文章：** 在 `src/content/posts/` 或 `src/content/pages/` 下创建 `.md` 或 `.mdx` 文件
- **新建项目：** 在 `src/content/projects/` 下创建
- **新建相册：** 在 `src/content/albums/` 下创建 `.md` 文件，图片放在 `src/assets/albums/{slug}/`（优化）或 `public/photos/{slug}/`（原图），也支持 `photos` 字段写外部链接
- **图片优化：** 使用 `src/utils/image.ts` 中的工具函数
- **图谱数据：** `src/utils/graph.ts` 通过 Content Collections API 生成节点和边数据

## 插件开发

Sätteri 插件位于 `src/plugins/` 目录：

- **MDAST 插件：** 通过 `satteri()` 配置的 `mdastPlugins` 数组注册，操作 Markdown AST
- **HAST 插件：** 通过 `satteri()` 配置的 `hastPlugins` 数组注册，操作 HTML AST
- **插件工厂：** 返回函数的闭包模式 vs 直接传插件对象
- **参考文档：** https://satteri.bruits.org/docs/plugin-api/

## External Services

- **Umami Analytics:** 通过 `oddmisc` 集成，分享链接在 `astro.config.ts` 中配置
- **GitHub API:** 构建时预取公开仓库数据
- **Search:** 使用 Pagefind 实现静态搜索
- **SWUP:** 页面切换动画（View Transitions 降级方案）
