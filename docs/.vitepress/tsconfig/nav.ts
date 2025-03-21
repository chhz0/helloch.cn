import { link } from 'fs'
import { version } from 'os'
import { text } from 'stream/consumers'
import { DefaultTheme } from 'vitepress'

const navConfig: DefaultTheme.NavItem[] = [
  {
    text: '后端',
    activeMatch: '/backend/*',
    items: [
      { text: 'Linux', link: '/backend/linux', activeMatch: '/linux/*' },
      { text: 'Network', link: '/network', activeMatch: '/network/*' },
      {
        text: 'langs',
        items: [
          {  text: 'Golang ', link: '/backend/golang', activeMatch: '/golang/*' },
          { text: 'Java ', link: '/backend/java', activeMatch: '/java/*' },
          // { text: 'Cangjie', link: '/cangjie', activeMatch: '/cangjie/*' },
          // { text: 'JavaScript', link: '/javascript', activeMatch: '/javascript/*' },
          // { text: 'Rust', link: '/rust', activeMatch: '/rust/*' },
        ]
      },
      {
        text: 'database',
        items: [
          { text: 'MySQL', link: '/backend/mysql', activeMatch: '/mysql/*' },
          { text: 'Redis', link: '/backend/redis', activeMatch: '/redis/*' },
          // { text: 'MongoDB', link: '/mongodb', activeMatch: '/mongodb/*' },
          // { text: "MariaDB", link: '/mariadb', activeMatch: '/mariadb/*' }
        ]
      },
      { text: 'message queue',
        items: [
          // { text: 'RabbitMQ', link: '/backend/rabbitmq', activeMatch: '/backend/rabbitmq/*' },
          { text: 'Kafka', link: '/backend/mq/kafka', activeMatch: '/kafka/*' },
          // { text: 'NATS', link: '/backend/nats', activeMatch: '/backend/nats/*' },
          // { text: 'RocketMQ', link: '/backend/rocketmq', activeMatch: '/backend/rocketmq/*' },
          // { text: 'Pulsar', link: '/backend/pulsar', activeMatch: '/backend/pulsar/*' },
        ]
      },
      { text: 'Git', link: '/backend/git', activeMatch: '/backend/git/*'  },
      { text: 'Docker', link: '/backend/docker', activeMatch: '/backend/docker/*'  },
      // { text: 'http代理',
      //   items: [
        //     { text: 'Nginx', link: '/backend/nginx', activeMatch: '/backend/nginx/*'  },
        //     { text: 'Caddy', link: '/backend/caddy', activeMatch: '/backend/caddy/*'  },
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