---
layout: doc
title: 文章归档
posts:
  - title: Redis
    url: /backend/redis
    tags: [数据库, Redis]
    date: 2024-02-15
    description: 深入解析Redis核心数据结构实现原理
  - title: Mysql
    url: /backend/mysql
    tags: [数据库, Mysql]
    date: 2024-02-15
    description: 深入解析Mysql核心实现原理
  - title: Network
    url: /backend/net
    tags: [后端]
    date: 2024-03-15
    description: 深入解析计算机网络协议
  - title: Git
    url: /backend/git
    tags: [后端, Git]
    date: 2024-03-23
    description: 深入Git规范
  - title: Docker
    url: /backend/docker
    tags: [后端, Docker]
    date: 2024-03-26
    description: 深入Docker原理
  # 其他文章配置...
---

<!--
const tagColors = {
  '数据库': '#60a5fa',
  '缓存': '#fbbf24',
  '前端': '#f472b6',       // 粉色
  '后端': '#4f46e5',       // 靛蓝
  'DevOps': '#10b981',    // 翠绿
  '架构': '#8b5cf6',       // 紫色
  '算法': '#ef4444',       // 红色
  'JavaScript': '#f59e0b', // 琥珀色
  'TypeScript': '#3178c6', // TS官方蓝
  'React': '#61dafb',      // React标志性青色
  'Vue': '#42b883',        // Vue官方绿色
  'Node.js': '#689f63',    // Node绿
  'Git': '#f14e32',        // Git官方橙红
  'Go': '#00ADD8',          // Golang官方蓝
  'Golang': '#00ADD8',       // 别名
  'Java': '#E76F00',        // Java官方橙
  'MySQL': '#FF6600',       // MySQL橙色
  'PostgreSQL': '#336791',  // PG深蓝
  'MongoDB': '#4DB33D',     // MongoDB绿
  'Redis': '#DC382C',       // Redis红
  'Kafka': '#231F20',       // Kafka黑
  'Linux': '#FCC624',       // Linux黄
  'Docker': '#2496ED',      // Docker蓝
  'Kubernetes': '#326CE5',  // K8s蓝
}
 -->

<script setup>
import { useData } from 'vitepress'  // 添加useData导入

const { frontmatter } = useData()
</script>

<TitleSvgIcon svg-path="/svg/icons/archive.svg" title="归档文章"/>

<ArchivePage :posts="frontmatter.posts" />