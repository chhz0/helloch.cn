---
prev:
  text: 'Redis 初识'
  link: '/redis'
next:
  text: '数据类型 - String'
  link: '/redis/data-types/Strings'
---
# Redis 数据类型 <Badge type="tip" text="Redis Data Types" />

Redis是一个数据结构服务，核心是提供一组原生的数据类型帮助服务应用解决各种问题，从缓存到队列到事件处理，都有适用的数据类型.

其核心数据类型有：
- `String`: 字符串，是Redis中最基本的数据类型.
- `List`: 列表，按照插入顺序排序的字符串列表.
- `Sets`: 无序集合，是唯一字符串的无序集合.
- `Hash`: 哈希表，是字段-值集合的记录类型.
- `ZSet`: 有序集合，是唯一字符串的有序集合.
- `Stream`: 流，其作用类似于仅追加的日志，有助于按事件发生的顺序记录事件.
- `BitMap`: 位图，允许对字符串执行按位运算.
- `Bitfield`: 位域，可以有效将多个计数器编码位字符串.
- `Geospatial`: 地理空间，用于存储和查询地理空间数据.

扩展数据类型：
- `Json`: 提供与流行的 JSON 文本文件格式匹配的结构化分层数组和键值对象.
- `Probabilistic data types`: 允许以近似但高效的方式收集和计算统计数据.
- `Time series`: 允许存储和查询带时间戳的数据点.

对于Redis详细的数据类型，可以参考[Redis/data-types](https://redis.io/docs/latest/develop/data-types/).

## Redis Object

Redis是kv存储，key和value在Redis中被抽象成对于(Object)，key只能是**String**对象，value支持丰富的对象类型，即上述的Redis数据类型.

RedisObject的结构:
```c
#define LRU_BITS 24

typedef struct reidsObject {
    unsigned type:4;
    unsigned encoding:4;
    unsigned lru:LRU_BITS; /* LRU time or
                            * lFU data */
    int refcount;
    void *ptr;
} robj;
```

- `type`: RedisObject的类型，如String、List、Hash等，对应上述数据类型.
- `encoding`: RedisObject的编码，表示了哪种底层编码.
- `lru`: 记录RedisObject被访问的时间，用于LRU算法.
- `refcount`: RedisObject的引用计数，表示了RedisObject被引用的次数，即有多少指针指向该对象
- `ptr`: RedisObject的指针，指向RedisObject对应的数据结构.

RedisObject和不同的数据类型及其编码的关系图:

![redisObject-dependence](../../public/redis/redis-object-not.drawio.svg)
