---
title: just Redis
navbar: true
aside: true
---
<h1 style="color:var(--vp-c-text-1)">Redis</h1>

[[toc]]

---

# Redis 简介 <Badge type="tip" text="Redis" />

Redis是一个内存数据库、一个Key/Value存储系统，支持多种数据结构，包括字符串、哈希、列表、集合、有序集合等。

常用于缓存、消息中转、数据流引擎和分布式锁等

在Redis官方Docs中，可以看到Redis可以用作数据库、缓存、流式处理引擎、消息代理等。还提供了根据不同场景的使用指南

::: tip 推荐阅读
- [Redis官方文档](https://redis.io/docs/latest/)
- [小林coding/图解Redis](https://xiaolincoding.com/redis/)
- [Redis中文网](https://www.redis.net.cn/)
:::

---

<!--@include: ./data-types/index.md-->
<!--@include: ./data-types/String.md-->
<!--@include: ./data-types/List.md-->
<!--@include: ./data-types/Set.md-->
<!--@include: ./data-types/Hash.md-->
<!--@include: ./data-types/ZSet.md-->
<!--@include: ./data-types/Stream.md-->
<!--@include: ./data-types/encoding/sds.md-->
<!--@include: ./data-types/encoding/ziplist.md-->
<!--@include: ./data-types/encoding/hashtable.md-->
<!--@include: ./data-types/encoding/skiplist.md-->

---

<!--@include:./arch/index.md-->
<!--@include:./arch/redisDB.md-->
<!--@include:./arch/single-thread.md-->
<!--@include:./arch/multi-thread.md-->
<!--@include:./arch/LRU-LFU.md-->
