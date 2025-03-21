---
layout: doc
title: 文章归档
posts:
  - title: Redis
    url: /backend/redis
    tags: [数据库, Redis]
    date: 2024-02-15
    description: 深入解析Redis核心数据结构实现原理
  - title: mysql
    url: /backend/mysql
    tags: [数据库, Mysql]
    date: 2024-02-15
    description: 深入解析Mysql核心实现原理
  # 其他文章配置...
---

<script setup>
import { useData } from 'vitepress'  // 添加useData导入

const { frontmatter } = useData()
</script>

# 文章归档

<ArchivePage :posts="frontmatter.posts" />