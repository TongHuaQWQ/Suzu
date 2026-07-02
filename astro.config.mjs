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
import { generateGitHubCache } from './src/utils/github';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLanguageBadge } from 'expressive-code-language-badge';
import { site } from './src/site.config.ts';
import { oddmisc } from 'oddmisc/astro';
import sitemap from '@astrojs/sitemap';

// 构建时预取 GitHub 仓库数据

// 构建前预取 GitHub 仓库数据
await generateGitHubCache();

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
  }), icon(), mdx(), sitemap({
    filter: (page) => !/\/posts\/.+\/.+/.test(new URL(page).pathname),
  }),
  oddmisc({
    umami: {
      shareUrl: 'https://u.24862648.xyz/share/v5w9uTESRticZn1T'
    }
  })],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [remarkGithubCard()],
      hastPlugins: [remarkHeadingAnchor(), remarkWikilink()],
    }),
  },
  site: site.url,
  devToolbar: {
    enabled: true
  }
});