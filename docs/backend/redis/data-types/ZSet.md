---
prev:
  text: 'Redis - Hash'
  link: '/backend/redis/data-types/Hashes'
next:
  text: 'Redis - Stream'
  link: '/backend/redis/data-types/Stream'
---
## Redis< ZSet > <Badge type="tip" text="Redis Sorted Set" />

Redis ZSet 是一个关联分数排序的唯一字符串集合. 当多个字符串具有相同分数时，字符串会按照字典顺序排列。

`ZSet`可以适用于:
- 排行榜. 使用ZSet维护大型游戏中最高分数的有序列表.
- 速率限制器. 使用ZSet构建滑动窗口速率限制器，以防止过多的API请求.

`ZSet`可以视为是集合和哈希的混合，一方面，其与集合类似，由唯一的、不重复的字符串元素组成；另一方面，集合内元素没有排序，但是排序集合中每个元素都和一个浮点值相关联，也就是类似于哈希，每个元素映射一个值

此外，排序集中的元素是按顺序获取的，这个顺序遵守以下规则：
1. 如果 B 和 A 是具有不同分数的两个元素，则如果 A.score 是 > B.score，则 A > B.
2. 如果 B 和 A 的分数完全相同，则如果 A 字符串按字典顺序大于 B 字符串，则 A > B。 B 和 A 字符串不能相等，因为排序集仅具有唯一元素

### ZSet 命令

ZSet常见命令：
- 创建：`ZADD`
  - `ZADD key score member [score member]` # 向Sorted Set增加数据，如果key已经存在的Key，则更新对应的数据
    - 扩展参数：XX, NX, LT, GT
- 查询：`ZRANGE`, `ZCOUNT`, `ZRANK`, `ZCARD`, `ZSCORE`
  - `ZCARD key` # 查看ZSet中的成员
  - `ZRANGE key start stop [WITHSCORES]` # 查询从start到stop范围的ZSet数据，WITHSCORES选填，不写输出里只有key，没有score值
  - `ZREVRANGE key start stop [WITHSCORES]` # 即reverse range，从大到小遍历，WITHSCORES选项，不写不会输出score
  - `ZCOUNT key min max` # 计算min-max积分范围的成员
  - `ZRANK key member` # 查看ZSet中member的排名索引，索引从0开始，所以排名是第一，索引就是0
  - `ZSCORE key member` # 查询ZSet成员的分数
- 更新：`ZADD`, `ZREM`
  - `ZREM key member [member ...]` # 删除ZSet中的元素
- 删除：`DEL`, `UNLINK`

::: tip 详细ZSet命令
🔗 [ZSets命令列表](https://redis.io/docs/latest/commands/?group=sorted-set)
:::

### ZSet 编码(底层实现)

ZSet底层编码有两种：`ZIPLIST`， `SKIPLIST`+`HASHTABLE`

- `ZIPLIST`
  - 列表对象保存的所有字符串对象长度都小于64字节，且列表对象元素个数少于128个
  - 使用`ZIPLIST`的目的是在数据量小的时候节省内存，在紧凑的结构中以`value`+`score`的形式存放进`ziplist.entry`

当上述条件不符合的时候，编码使用`SKIPLIST`+`HASHTABLE`

SKIPLIST是一种可以快速查找的多级链表结构，通过SKIPLIST可以快速定位到数据所在，它的排名操作、范围查询性能都很高

> [!NOTE] 编码详解
> 🔗 [查看SKIPLIST编码](./encoding/ziplist.md)