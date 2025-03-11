import { DefaultTheme } from 'vitepress'

const navConfig: DefaultTheme.NavItem[] = [
  // { text: '算法', link: '/algo', activeMatch: '/algo/*' },
  {
    text: '后端',
    items: [
      { text: 'Linux', link: '/linux', activeMatch: '/linux/*' },
      { text: 'Network', link: '/network', activeMatch: '/network/*' },
      {
        text: 'langs',
        items: [
          {
            text: 'Golang ',
            link: '/golang',
            activeMatch: '/golang/*',
          },
          { text: 'Java ☕', link: '/java', activeMatch: '/java/*' },
          { text: 'Cangjie ✨', link: '/cangjie', activeMatch: '/cangjie/*' },
          // { text: 'JavaScript', link: '/javascript', activeMatch: '/javascript/*' },
          // { text: 'Rust', link: '/rust', activeMatch: '/rust/*' },
        ]
      },
      {
        text: 'database',
        items: [
          { text: 'MySQL ✨', link: '/mysql', activeMatch: '/mysql/*' },
          { text: 'Redis ✨', link: '/redis', activeMatch: '/redis/*' },
          // { text: 'MongoDB', link: '/mongodb', activeMatch: '/mongodb/*' },
          // { text: "MariaDB", link: '/mariadb', activeMatch: '/mariadb/*' }
        ]
      },
      { text: 'message queue',
        items: [
          // { text: 'RabbitMQ', link: '/middleware/rabbitmq', activeMatch: '/middleware/rabbitmq/*' },
          { text: 'Kafka ✨', link: '/middleware/kafka', activeMatch: '/middleware/kafka/*' },
          // { text: 'NATS', link: '/middleware/nats', activeMatch: '/middleware/nats/*' },
          // { text: 'RocketMQ', link: '/middleware/rocketmq', activeMatch: '/middleware/rocketmq/*' },
          // { text: 'Pulsar', link: '/middleware/pulsar', activeMatch: '/middleware/pulsar/*' },
        ]
      },
      { text: 'Git ✨', link: '/middleware/git', activeMatch: '/middleware/git/*'  },
      { text: 'Docker ✨', link: '/middleware/docker', activeMatch: '/middleware/docker/*'  },
      // { text: 'http代理',
      //   items: [
        //     { text: 'Nginx', link: '/middleware/nginx', activeMatch: '/middleware/nginx/*'  },
        //     { text: 'Caddy', link: '/middleware/caddy', activeMatch: '/middleware/caddy/*'  },
        //   ]
        // }
      ]
  },
  {
    text: '前端',
    items: [
      { text: 'Vue', link: '/vue', activeMatch: '/vue/*' },
      { text: 'React', link: '/react', activeMatch: '/react/*' },
    ]
  },
  { text: '项目', link: '/github.repo', activeMatch: '/github.repo/*' },
  {
    text: '归档',
    link: '/archive',
    activeMatch: '/archive/*'
  },
  { text: '关于',
    items: [
      { text: '本站', link: '/about/site', activeMatch: '/about/site/*' },
      { text: '日志', link: '/about/changelog', activeMatch: '/about/log/*' },
    ]
  },
]

export default navConfig