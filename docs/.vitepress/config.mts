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
    logo: '',
    siteTitle: 'KonwStack',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '导航', link: '/guide' },
      { text: '算法', link: '/algo' },
      {
        text: '计算机',
        items: [
          { text: 'Linux', link: '/linux' },
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
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'MySQL', link: '/mysql' },
          { text: 'Redis', link: '/redis' },
          { text: 'MongoDB', link: '/mongodb' },
        ]
      },
      { text: '关于', link: '/about' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chhz0/helloch.cn/tree/blog' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present chhz0 | <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备2024347558号</a>'
    }
  }
})
