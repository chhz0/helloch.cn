import { DefaultTheme, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh',
  title: "Hello KonwStack",
  // titleTemplate: 'KonwStack',
  description: "A VitePress Site",
  head: [],
  base: '/',
  cleanUrls: true,
  themeConfig: {
    logo: '/kd-sleep.svg',
    siteTitle: "KnowStack",
    lastUpdated: {
      text: '最近更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    },
    search: {
      provider: 'local',
      // options: searchAlgolia(),
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      '/guide/':[{ text: '导航', items: sidebarGuide() }],
      '/algo/':[{ text: '算法', base: '/algo/', items: sidebarAlgo() }],
      '/redis/':[{ text: 'Redis', base: '/redis/', link: '/', items: sidebarRedis(), }],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chhz0/helloch.cn/tree/blog' }
    ],

    editLink: {
      pattern: 'https://github.com/chhz0/helloch.cn/edit/blog/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    footer: {
      message: 'Released under the <a href="https://github.com/chhz0/helloch.cn/blob/main/LICENSE">MIT License</a>.',
      copyright: `Copyright © 2024-${new Date().getFullYear()} chhz0 | <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备2024347558号</a>`
    }
  }
})

function nav(): DefaultTheme.NavItem[]{
  return [
    { text: '导航', link: '/guide' },
    { text: '算法', link: '/algo' },
    {
      text: '计算机',
      items: [
        { text: 'Linux', link: '/linux', activeMatch: '/linux/*' },
        { text: 'Network', link: '/network', activeMatch: '/network/*' },
        { text: 'Shell', link: '/shell' },
        { text: 'Nginx', link: '/nginx' },
        { text: 'Git', link: '/git' },
        { text: 'Docker', link: '/docker' },
      ]
    },
    {
      text: '编程语言',
      items: [
        { text: 'Golang', link: '/golang', activeMatch: '/golang/*' },
        { text: 'Java', link: '/java', activeMatch: '/java/*' },
        { text: 'JavaScript', link: '/javascript', activeMatch: '/javascript/*' },
      ]
    },
    {
      text: '前端',
      items: [
        { text: 'Vue', link: '/vue', activeMatch: '/vue/*' },
        { text: 'React', link: '/react', activeMatch: '/react/*' },
      ]
    },
    {
      text: '数据库',
      items: [
        { text: 'MySQL', link: '/mysql', activeMatch: '/mysql/*' },
        { text: 'Redis', link: '/redis', activeMatch: '/redis/*' },
        { text: 'MongoDB', link: '/mongodb', activeMatch: '/mongodb/*' },
        { text: "MariaDB", link: '/mariadb', activeMatch: '/mariadb/*' }
      ]
    },
    { text: '关于',
      items: [
        { text: '本站', link: '/about/site' },
        { text: '日志', link: '/about/log' },
      ]
    },
  ]
}

function sidebarAlgo(): DefaultTheme.SidebarItem[] {
  return [
    { text: '栈', link: '/algo/stack' },
    { text: '队列', link: '/algo/queue' },
    { text: '链表', link: '/algo/linkedlist' },
    { text: '树', link: '/algo/tree' },
    { text: '图', link: '/algo/graph' },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '计算机',
      items:[
        { text: 'Git', link: '/git' },
        { text: 'Linux', link: '/linux' },
        { text: 'Nginx', link: '/nginx' },
        { text: 'Shell', link: '/shell' },
        { text: 'Docker', link: '/docker' },
      ],
      collapsed: false,
    },
    {
      text: '数据库',
      items:[
        { text: 'Redis', link: '/redis' },
        { text: 'MySQL', link: '/mysql' },
      ],
      collapsed: false,
    },
  ]
}

function sidebarRedis(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '数据类型',
      link: '/',
      base: '/redis/data-types/',
      collapsed: false,
      items:[
        { text: 'String', link: '/String' },
        { text: 'List', link: '/List' },
        { text: 'Sets', link: '/Sets' },
        { text: 'Hash', link: '/Hash' },
        { text: 'ZSet', link: '/ZSet' },
      ],
    },
  ]
}

function searchAlgolia(): DefaultTheme.AlgoliaSearchOptions {
  return {
    appId: 'ZGJJJJ',
    apiKey: 'f7c9e9f4c7c5c6e7d8a9b7a6f5e4d3c2',
    indexName: 'knowstack',
    locales: {
      zh: {
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          }
        }
      }
    }
  }
}