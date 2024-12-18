---
prev:
  text: 'Redis - 架构'
  link: '/redis/arch'
next:
  text: '架构 - 单线程模型'
  link: 'redis/arch/single-thread'
---
# Redis 数据库结构 <Badge type="tip" text="Redis redisDb" />

Redis是一个基于内存的数据库，数据存储在内存中，以键值对的形式存储.

Redis的数据库结构：
```c
// redisDb 结构
type struct redisDb {
    dict *dict;           //字典
    dict *expires;        // 过期键
    dict *blocking_keys;
    dict *ready_keys;
    dict *watched_keys;
    int id;
    long long avg_ttl;
    list *defrag_later;
} redisDb;

// dict 结构
typedef struct dict {
    dictType *type;
    void *privdata;
    dictht ht[2];
    long rehashidx;
    unsigned long iterators;
} dict;
```

`redisDb` 代表Redis数据库结构，各种操作对象，都存储在dict数据结构里.
- `dict` 是Redis的字典结构，存储键值对.
- `expires` 是Redis的过期键字典结构，存储过期键.

![redis-redisDb-struct](../../public/redis/redis-redisDb-struct.drawio.svg)

## 操作Redis在内存中的表现

- `添加数据` # 即添加键值对，添加到dict结构字典中，Key必须为String对象，value为任何类型的对象，添加数据后，会在redisDb里字段dict上添加dict对象
- `查询数据` # 直接在dict找到对应的key，即完成查询
- `更新数据` # 对已经Key对象的任何变更操作，都是更新
- `删除数据` # 删除即把key和value从dict结构里删除

## 关于过期键 expiresKey

Redis可以设置过期键，到达一定时间，这些对象会被自动过期并回收

过期键存储在`expires`字典上，expires字典中，value就是过期时间

在redisDb中，dict和expires中Key对象，实际都是存储**String对象指针**，两个的key都会指向内存相应的字符串地址

:::tip 链接
- [过期键清除策略](../data-types/#过期键清除策略)
:::