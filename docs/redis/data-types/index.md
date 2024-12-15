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

## Redis Object 结构

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

对于Redis在不同场景下使用不同的数据类型，数据类型又有不同的编码，其一般会使用如下规则：

  1. **当数据量较少时**，尽量使用紧凑结构的编码方式，以节省内存空间，而且因为数据量较少，在性能上不会有太大的影响.
  2. **当数据量较大时**，将以空间换时间的方式，使用高效的数据编码，以提高性能.

## Redis Object 过期时间

Redis的过期时间给一个Key，指定一个时间，当到达这个时间时，Redis会自动删除这个Key.

设置过期时间的目的是可以有效地节省内存，而且在某些场景里，过期时间可以用于实现一些功能，如缓存、限流等.

## 过期时间的设置

通过以下方法可以设置过期时间:
- SET key value EX seconds；
- SET key value PX milliseconds；设置毫秒
- TTL key；查看还有多少时间过期

在设置过期时间后，会有专门的字典记录key和过期时间.

## 过期键清除策略

过期之后的键实际上不是立即删除的，一般过期键清除策略有三种：
1. 定时删除
2. 定期删除
3. 惰性删除

- `定时删除`
是在设置键的过期时间的时候，创建一个定时器，让定时器在键过期时间立即执行对键删除操作，定时删除对内存友好，但是对CPU不友好，如果某个时间段比较多的Key过期，可能会影响命令处理性能

- `惰性删除`
是指使用的时候，发现key过期了，此时再进行删除，这个策略的思路是对应用而言，只要不访问，过期不过期业务都无所谓，但是这样的代价是如果某些key一直不访问，那些本该过期的key变成了常驻的key。这种策略对CPU最友好，但是对内存不太友好

- `定期删除`
每过一段时间，程序就对数据库进行一次检查，每次删除一部分过期键，这属于一种渐进式兜底策略
  - 定期删除的频率：决定于Redis周期任务的执行频率，周期任务里面会关闭过期客户端、删除过期key的一系列任务，可以用INFO查看周期任务
  - 每次删除的数量: 每次检查的数量是写死在代码里面的，每次20个，但是会有一个循环会检查过期key数量占比，大于25%，则再抽查20个来检查，同时Redis为了保证定期不会出现循环过度，导致线程卡死，为此增加了了定期删除循环流程的时间上限，默认不超过25ms

**Redis过期键采用的是惰性删除+定期删除二者结合的方式进行删除**