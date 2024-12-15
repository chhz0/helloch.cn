import { DefaultTheme, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh',
  title: "Hello KonwStack",
  // titleTemplate: 'KonwStack',
  description: "A VitePress Site",
  head: [['link', { rel: 'icon', href: '/kd-sleep.svg' }]],
  base: '/',
  cleanUrls: true,
  themeConfig: {
    // logo: '/kd-sleep.svg',
    siteTitle: "KnowStack",
    lastUpdated: {
      text: '最近更新于',
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
    nav: nav(),

    sidebar: {
      '/guide/':[{ text: '导航', items: sidebarGuide() }],
      '/algo/':[{ text: '算法', base: '/algo/', link: '/', items: sidebarAlgo() }],
      '/redis/':[{ base: '/redis/', items: sidebarRedis(), }],
      '/mysql/':[{ text: 'MySQL', base: '/mysql/', link: '/', items: sidebarMySQL(), }],
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
    { text: '导航', link: '/guide', activeMatch: '/guide/*' },
    { text: '算法', link: '/algo', activeMatch: '/algo/*' },
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
        { text: 'Rust', link: '/rust', activeMatch: '/rust/*' },
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
        { text: '本站', link: '/about/site', activeMatch: '/about/site/*' },
        { text: '日志', link: '/about/log', activeMatch: '/about/log/*' },
      ]
    },
  ]
}

function sidebarAlgo(): DefaultTheme.SidebarItem[] {
  return [
    { text: '栈', link: '/stack' },
    { text: '队列', link: '/queue' },
    { text: '链表', link: '/linkedlist' },
    { text: '树', link: '/tree' },
    { text: '图', link: '/graph' },
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
    { text: 'Redis intro', link: '/' },
    {
      text: 'Redis - 数据类型',
      base: '/redis/data-types/',
      link: '/',
      collapsed: false,
      items:[
        { text: 'Strings', link: 'Strings' },
        { text: 'Lists', link: 'Lists' },
        { text: 'Sets', link: 'Sets' },
        { text: 'Hashes', link: 'Hashes' },
        { text: 'ZSet', link: 'ZSet' },
        { text: 'Stream', link: 'Stream' },
        { text: 'encoding', 
          items: [
            { text: 'SDS', link: 'encoding-sds' },
            { text: 'ZIPLIST', link: 'encoding-zip-list' },
            { text: 'HASHTABLE', link: 'encoding-hashtable' },
            { text: 'SKIPLIST', link: 'encoding-skip-list' },
          ]
        },
      ],
    },
    {
      text: 'Redis - 架构',
      base: '/redis/arch/',
      link: '/',
      collapsed: false,
      items:[
        { text: '单线程模型', link: 'single-thread' },
        { text: '过期淘汰算法', link: 'LRU-LFU' },
      ]
    },
    {
      text: 'Redis - 持久化',
      base: '/redis/persistence/',
      link: '/',
      collapsed: false,
      items:[
        { text: 'RDB - 数据快照', link: 'RDB' },
        { text: 'AOF - 日志记录', link: 'AOF' },
        { text: 'AOF&RDB - 混合持久化', link: 'AOF&RDB' },
      ]
    },
    {
      text: 'Redis - 应用场景',
      base: '/redis/application/',
      link: '/',
      collapsed: false,
      items:[
        { text: '缓存', link: 'cache' },
        {
          text: '分布式锁',
          link: 'lock',
          items: [{text: 'Go实现分布式锁', link: 'go-redis-lock'}]
        },
      ]
    },
    {
      text: 'Redis - 集群',
      base: '/redis/cluster/',
      link: '/',
      collapsed: false,
      items:[
        { text: '集群介绍', link: 'intro' },
      ]
    },
    {
      text: 'Redis - 命令',
      base: '/redis/command/',
      link: '/',
      collapsed: false,
      items:[
        { text: 'Redis 键(keys)', link: 'keys' }
      ]
    },
    { text: 'interview', link: 'interview' }
  ]
}

function sidebarMySQL(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'MySQL索引类型', link: '/mysql-index' },
    { text: 'MySQL事务', link: '/mysql-transaction' },
    { text: 'MySQL锁', link: '/mysql-lock' },
    { text: 'MySQL日志', link: '/mysql-log' },
    { text: 'MySQL内存', link: '/mysql-buffer-pool' },
    { text: 'MySQL逻辑架构', link: '/mysql-arch' },
  ]
}

function searchAlgolia(): DefaultTheme.AlgoliaSearchOptions {
  return {
    appId: 'YLWOYZ6XJI',
    apiKey: 'd46c412d53ca0c1ec4aad7ffaf858a09',
    indexName: 'helloch',
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
    },
  }
}