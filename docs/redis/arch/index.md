---
prev:
  text: '编码 - SKIPLIST'
  link: '/redis/data-types/encoding-skip-list'
next:
  text: '架构 - redisDb'
  link: 'redis/arch/redisDb'
---
# Redis 架构 <Badge type="tip" text="Redis Arch" />

Redis的架构：
- `单线程模型`
- `Reactor`
- `多线程优化解包`
- `多进程处理持久化任务`
- `过期淘汰算法`

通过了解Redis的架构，我们可以更好地理解Redis的工作原理，了解其执行流程，对后续的Redis持久化、应用场景等有更好的理解。