import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
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
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '导航', link: '/guide' },
      { text: '算法', link: '/algo' },
      {
        text: '计算机',
        items: [
          { text: 'Linux', link: '/linux' },
          { text: 'Network', link: '/network' },
          { text: 'Shell', link: '/shell' },
          { text: 'Nginx', link: '/nginx' },
          { text: 'Git', link: '/git' },
          { text: 'Docker', link: '/docker' },
        ]
      },
      {
        text: '编程语言',
        items: [
          { text: 'Golang', link: '/golang' },
          { text: 'Java', link: '/java' },
          { text: 'JavaScript', link: '/javascript' },
        ]
      },
      {
        text: '前端',
        items: [
          { text: 'Vue', link: '/vue' },
          { text: 'React', link: '/react' },
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'MySQL', link: '/mysql' },
          { text: 'Redis', link: '/redis' },
          { text: 'MongoDB', link: '/mongodb' },
          { text: "MariaDB", link: '/mariadb' }
        ]
      },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/guide/':[{
        text: '导航',
        items: [
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
        ]
      }]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chhz0/helloch.cn/tree/blog' }
    ],

    editLink: {
      pattern: 'https://github.com/chhz0/helloch.cn/edit/blog/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: 'Released under the <a href="https://github.com/chhz0/helloch.cn/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2024-present chhz0 | <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备2024347558号</a>'
    }
  }
})
