---
title: "Suzu 的 相册 功能"
date: "2026-07-15"
pubDate: "2026-07-15"
description: "相册功能提供两级结构的图片展示页面：首页展示所有相册封面卡片，点击进入相册详情页查看照片（瀑布流布局"
tags: ["Markdown", "教程", "Suzu"]
categories: ["指南"]
---

## 相册（Albums）

基于 Astro Content Collections 的相册功能。支持三种图片来源：本地优化图、本地原图、外部 URL。
片放在 "public/photos/{相册id}/" 或者"assets/albums/{相册id}/" 目录下，构建时自动扫描发现，无需逐张配置图片。

## 目录结构

```
src/
├── content/
│   └── albums/
│       ├── 动漫图片.md             ← 相册元数据
│       └── 日常随拍.md
│
├── assets/
│   └── albums/
│       ├── 动漫图片/               ← 优化图片（可选）
│       │   ├── DSC001.jpg          ← 经过 <Image /> 压缩/转 WebP
│       │   └── DSC002.jpg
│       └── 日常随拍/
│
├── public/
│   └── photos/
│       ├── 动漫图片/               ← 原图（可选）
│       │   └── DSC003.jpg          ← 原样输出，不走构建
│       └── 日常随拍/
│
└── pages/
    └── albums/
        ├── index.astro             ← 列表页 /albums/
        └── [...slug].astro         ← 详情页 /albums/:slug/
```

## 添加相册

### 1. 创建元数据文件

在 `src/content/albums/` 下创建 `.md` 文件：

```yaml
---
title: "上海 2025"           # 必填 - 相册标题
date: "2025-04"                 # 必填 - 日期（YYYY-MM）
description: "2025年上海旅行记录"    # 可选 - 描述
cover: ""                       # 可选 - 封面图路径
tags: ["旅行", "上海"]           # 可选 - 标签
location: ["外滩", "南京路步行街"]       # 可选 - 地点，支持数组
hidden: false                   # 可选 - true 时在列表页隐藏
photos:                         # 可选 - 外部图片 URL
  - "https://img.example.com/1.jpg"
  - "https://img.example.com/2.jpg"
---
```

### 2. 放入照片

三种方式可混用，最终自动合并：

```bash
# 方式一：优化图片（推荐封面/少量图）
src/assets/albums/上海旅行/IMG_001.jpg

# 方式二：原图（推荐大量照片）
public/photos/上海旅行/IMG_002.jpg

# 方式三：外部链接
# 在 frontmatter 的 photos 字段写 URL，不需要建文件夹
```

### 3. 文件命名匹配

| 元数据文件 | 对应图片路径 |
|-----------|-------------|
| `上海旅行.md` | `src/assets/albums/上海旅行/` |
| | `public/photos/上海旅行/` |

支持的图片格式：`jpg`, `jpeg`, `png`, `webp`。

## 图片来源

三种来源自动合并，同名文件不重复：

| 来源 | 说明 | 渲染 |
|------|------|------|
| `src/assets/albums/{slug}/` | 本地优化图片 | `<Image />` 压缩/WebP |
| `public/photos/{slug}/` | 本地原图 | `<img>` 原样 |
| `photos` 字段 | 外部 URL | `<img>` 加载 |

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 相册标题 |
| `date` | string | 是 | 日期，格式 `YYYY-MM` |
| `description` | string | 否 | 描述 |
| `cover` | string | 否 | 封面图路径（本地路径或外部 URL） |
| `tags` | string[] | 否 | 标签 |
| `location` | string / string[] | 否 | 地点，支持 `"广州"` 或 `["广州","福州"]` |
| `hidden` | boolean | 否 | `true` 时在列表页隐藏 |
| `photos` | string[] | 否 | 外部图片 URL 数组，和本地图片合并展示 |
| `mode` | `"external"` | 否 | 仅用作样式标记，不影响行为 |

### `mode: "external"`

这个字段只控制列表页显示「外链」徽章，不改变任何行为：

```yaml
---
title: "外部图床相册"
date: "2025-12"
cover: "https://img.example.com/cover.jpg"
mode: "external"
photos:
  - "https://img.example.com/1.jpg"
  - "https://img.example.com/2.jpg"
---
```

- 列表页 → 显示「外链」徽章，点击进入详情页
- 详情页 → 正常展示封面 + 照片网格 + Fancybox 灯箱

没有 `photos` 字段时也可以通过 `mode: "external"` 显示徽章，适用于纯外部链接收藏。



## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/albums/` | 相册列表 | 卡片网格，按日期倒序，`hidden` 的相册不出现 |
| `/albums/东京旅行/` | 相册详情 | 照片瀑布流 + Fancybox 灯箱 |

## 封面图

优先级：
1. `frontmatter.cover` 指定的路径
2. `src/assets/albums/{slug}/` 第一张图
3. `public/photos/{slug}/` 第一张图
4. `photos[0]` 第一张外部 URL

## 设计规范

- 列表封面图 `aspect-3/2`，hover 放大
- 详情页瀑布流：CSS `columns: 2`，图片保持原始宽高比
- `src/assets/` 的图用 `<Image />` 优化，其余用 `<img>`
- 前 6 张 eager 加载，其余 lazy 加载
- 有外部图片的相册在列表页显示「外链」徽章

:::tip
 - 每新建一个 .md 文件 `位于 src/content/albums/` 就相当于添加一个相册，文件名即相册 URL 路径
 - 图片文件夹必须与 .md 文件名完全一致（支持中文），可放在 `src/assets/albums/{slug}/`（优化）或 `public/photos/{slug}/`（原图），也支持在 `photos` 字段写外部链接
 - 封面图自动选择：优先 cover 字段 → 本地第一张图 → 外部第一张 URL，无需手动配置
 - 详情页照片点击后自动开启 Fancybox 灯箱，支持左右滑动浏览，无需额外 JS
 - 列表页的标签筛选根据各相册的 tags 字段自动生成，无需单独维护
 - `cover` 和 `photos` 都支持外部 HTTPS 链接，直接填写(`https://...`)
:::