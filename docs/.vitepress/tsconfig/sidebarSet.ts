import { DefaultTheme } from 'vitepress'

const sidebarConfig: DefaultTheme.Sidebar = {
  '/algo/':[{
    text: '算法',
    base: '/algo/',
    items: sidebarAlgo(),
    collapsed: false,
  }],
  '/redis/':[{
    text: 'Redis',
    base: '/redis/',
    items: sidebarRedis(),
    collapsed: false,
  }],
  '/mysql/':[{
    text: 'MySQL',
    base: '/mysql/',
    items: sidebarMySQL(),
    collapsed: false,
  }],
  '/golang/':[{
    text: 'Golang',
    base: '/golang/',
    link: '/',
    items: sidebarGo(),
    collapsed: false,
  }],
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
    { text: 'Redis 简介', link: '/' },
    {
      text: 'Redis - 数据类型',
      base: '/redis/data-types/',
      link: '/',
      collapsed: false,
      items:[
        { text: 'Strings - 字符串', link: 'Strings' },
        { text: 'Lists - 列表', link: 'Lists' },
        { text: 'Sets - 集合', link: 'Sets' },
        { text: 'Hashes - 哈希', link: 'Hashes' },
        { text: 'ZSet - 有序集合', link: 'ZSet' },
        { text: 'Stream - 流', link: 'Stream' },
        { text: 'encoding - 编码',
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
        { text: '数据库结构', link: 'redisDb' },
        { text: '单线程模型', link: 'single-thread' },
        { text: '多线程持久化', link:'multi-thread-persistence' },
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
    { text: 'Redis-interview', link: 'interview' }
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

function sidebarGo(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Golang - 语法', link: '/principles' },
    { text: 'Golang - 原理', link: '/principles' },
  ]
}

export default sidebarConfig;