// @ts-check
import { defineConfig } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import { remarkHeadingAnchor } from './src/plugins/remark-heading-anchor';
import { remarkWikilink } from './src/plugins/remark-wikilink';
import { remarkGithubCard } from './src/plugins/remark-github-card';
import { remarkCallout, remarkCalloutDirective } from './src/plugins/remark-callout';
import { remarkFigcaption } from './src/plugins/remark-figcaption';
import { generateGitHubCache } from './src/utils/github';
import { generateCalloutCSS } from './src/utils/callout-css';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLanguageBadge } from 'expressive-code-language-badge';
import { site } from './src/site.config.ts';
import { oddmisc } from 'oddmisc/astro';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';

import pagefind from 'astro-pagefind';
// 构建前预取 GitHub 仓库数据
await generateGitHubCache();

// 构建时将配置的 Callout 主题 CSS 写入 callout.css
await generateCalloutCSS(site.callout.theme);

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["q.qlogo.cn"],
  },
  integrations: [expressiveCode({
    themes: ['catppuccin-latte'],

    plugins: [
      pluginLineNumbers(),
      pluginCollapsibleSections(),
      pluginLanguageBadge({
        textTransform: 'lowercase',
        excludeLanguages: ['txt'],
      }),
    ],
    defaultProps: {
      wrap: true,
      collapseStyle: 'collapsible-start',
    },
    styleOverrides: {
      borderRadius: '0.75rem',

      codeFontFamily: "'Maple Mono', monospace",
      languageBadge: {
        fontSize: '0.7rem',
        fontColor: '#8b2671',
        fontWeight: '500',
        background: '#ffd7ee',
        borderRadius: '0.375rem',
      },
    },
  }), swup({
    theme: false,
    animationClass: 'transition-slide-up',
  }), icon(), mdx(), pagefind(), sitemap({
    filter: (page) => !/\/posts\/.+\/.+/.test(new URL(page).pathname),
  }),
  oddmisc({
    umami: {
      shareUrl: 'https://u.24862648.xyz/share/v5w9uTESRticZn1T'
    }
  })],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [remarkGithubCard(), remarkCalloutDirective(), remarkCallout()],
      hastPlugins: [remarkHeadingAnchor(), remarkWikilink(), remarkFigcaption()],
    }),
  },
  site: site.url,
  devToolbar: {
    enabled: true
  }
});