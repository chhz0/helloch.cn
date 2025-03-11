---
prev:
  text: '数据类型 - ZSet'
  link: 'redis/data-types/ZSet'
next:
  text: '编码 - SDS'
  link: '/redis/data-types/encoding-sds'
---
# Stream <Badge type="tip" text="Redis Stream" />

Redis Stream是一种数据结构，其作用类似于仅追加日志，但也实现了多种操作克服典型的仅追加日志的限制. 包括O(1)时间内的随机访问和复杂的消费策略

Stream的使用示例：

    1. 事件溯源(追踪用户操作、点击)；
    2. 传感器健康;
    3. 通知(将每个用户的通知存储在单独的流中)

Redis为每个流条目生成一个唯一ID，可以使用这些ID检索其关联条目或读取并处理流中的所有后续条目

Redis支持多种修剪策略和多种消费策略

## Stream 命令
- `XADD` # 将新条目添加到流中
- `XREAD` # 读取一个或多个条目，从给定位置开始并及时向前移动
- `XRANGE` # 返回两个提供的条目ID之间的条目范围
- `XLEN` # 返回流的长度


> [!TIP]
> Redis Stream 详细请阅读
> [Redis Stream](https://redis.io/docs/latest/develop/data-types/streams/)
