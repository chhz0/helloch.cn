import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

// import tailwindcss from '@tailwindcss/vite'

import sidebarConfig from './tsconfig/sidebarSet'
import navConfig from './tsconfig/nav'
import searchAlgolia from './tsconfig/searchAlgolia'

const SITE_BASE = '/'
const GITHUB_REPO_EDIT = 'https://github.com/chhz0/helloch.cn/edit/blog/docs/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh',
  title: "HelloCH",
  titleTemplate: 'HelloCH',
  description: "知识库：学习|记录|随笔",
  head: [['link', { rel: 'icon', href: '/kd-sleep copy.svg' }]],
  base: SITE_BASE,
  cleanUrls: true,
  ignoreDeadLinks: true,

  themeConfig: {
    // siteTitle: "HelloCH",
    lastUpdated: {
      text: '最近更新时间',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    },
    search: {
      provider: 'algolia',
      options: searchAlgolia(),
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: navConfig,
    sidebar: sidebarConfig,
    // sidebar: autoSidebar('/docs'),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/chhz0/helloch.cn/tree/blog' },
    ],

    editLink: {
      pattern: GITHUB_REPO_EDIT+':path',
      text: '修改此页ԅ(¯﹃¯ԅ)'
    },

    docFooter: {
      prev: 'Prev',
      next: 'Next'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    externalLinkIcon: true,

    footer: {
      message: 'Released under the <a href="https://github.com/chhz0/helloch.cn/blob/main/LICENSE">MIT License</a>.',
      copyright: `Copyright © 2024-${new Date().getFullYear()} chhz0 | <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备2024347558号</a>`
    },
  },

  markdown: {
    toc: {
      level: [2, 3],
      listTag: "ul"
    },
  },

  vite: {
    plugins: [
      // tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./docs/.vitepress/theme', import.meta.url)),
      }
    }
  }
})
