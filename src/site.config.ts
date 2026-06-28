export const site = {
  // ── 基本信息 ──
  title: "Suzu",
  description: "我的个人博客",
  url: "https://suzu.24862648.xyz/", // 部署后替换
  lang: "zh-CN",

  // ── 个人信息 ──
  profile: {
    name: "童话",
    avatar:
      "http://q.qlogo.cn/headimg_dl?dst_uin=2489196089&spec=640&img_type=jpg",
    signature: "Hello Suzu",
  },

  // ── 导航栏 ──
  nav: [
    { label: "首页", href: "/" },
    { label: "归档", href: "/archives" },
    { label: "项目", href: "/projects" },
    { label: "关于", href: "/about" },
  ],

  // ── 社交链接 ──
  social: [
    {
      name: "GitHub",
      icon: "mingcute:github-line",
      url: "https://github.com/TongHuaQWQ",
    },
    // { name: "Bilibili", icon: "mingcute:play-line", url: "https://bilibili.com" },
  ],

  // ── SEO ──
  seo: {
    ogImage: "/og-image.png", // Open Graph 图片（放在 public/）
    favicon: "/favicon.svg", // 网站图标（放在 public/）
    twitterCard: "summary_large_image" as "summary" | "summary_large_image",
  },

  // ── 特殊功能开关 ──
  featurePages: {
    projects: true, // 项目页面（制作中）
    backpack: true, // 背包页面，是否开启关于头像导航
  },

  // ── 功能开关 ──
  features: {
    toc: true, // 文章目录
    wordCount: true, // 字数统计
    postMeta: true, // 发布时间详情卡片
    postNav: true, // 上一篇/下一篇导航
    backToTop: false, // 回到顶部按钮（预留）
    search: true, // 搜索功能
    graph: true, // 图谱
    backlinks: true, // 文章链接
  },

  // ── 阅读设置 ──
  reading: {
    enable: true, // 阅读时间
    zhWpm: 400, // 中文阅读速度（字/分钟）
    enWpm: 200, // 英文阅读速度（词/分钟）
  },

  // ── 侧边栏设置 ──
  sidebar: {
    categoryRows: 3, // 分类卡片默认显示行数
    tagRows: 3, // 标签卡片默认显示行数
  },

  // ── 项目配置 ──
  projects: {
    // 额外分类（会追加到内置分类后面）
    extraCategories: [] as Array<{
      value: string;
      label: string;
      icon: string;
    }>,
    // 额外状态
    extraStatuses: [] as Array<{ value: string; label: string; color: string }>,
  },

  // ── UI 设置 ──
  ui: {
    navbarHeight: 80, // 导航栏高度（px），用于滚动偏移
    sidebarWidth: "18rem", // 侧边栏宽度
    animationDuration: 400, // 页面动画时长（ms）
  },

  // ── 版权声明 ──
  license: {
    enable: true, // 文章底部版权信息
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  // ── MD3 色彩种子 ──
  // 修改这里 → 重新生成 CSS 变量即可换肤
  theme: {
    seedColor: "#f472b6", // pink-400，Material Theme Builder 生成
    // 以下为生成的主色，改种子色后同步更新
    primary: "#8b2671",
    primaryContainer: "#ffd7ee",
    onPrimaryContainer: "#38002d",
  },
} as const;

// 导出类型供其他文件使用
export type SiteConfig = typeof site;
export type NavItem = (typeof site.nav)[number];
export type SocialLink = (typeof site.social)[number];
