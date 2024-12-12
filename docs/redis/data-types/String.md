---
prev:
  text: 'Redis 数据类型'
  link: 'redis/data-types'
next:
  text: '数据类型 - List'
  link: '/redis/data-types/List'
---
# String  <Badge type="tip" text="Redis String" />

Redis String 类型，存储字节，包括文本，序列化对象和二进制数组，因此 ***String是Redis最基本的数据类型*** 。通常用于**缓存**，而且Redis支持其他功能，允许实现**计数器**并执行按位运算.

由于Redis中key是一个字符串，因此Redis使用String数据类型作为key的值.

Stirng最大为512MB，可以通过配置项`proto-max-bulk-len`进行修改.

## String 适用场景

使用场景：一般用来存放字节数据、文本数据、序列化后的对象数据.

1. 缓存场景：Value存Json字符串等信息.
2. 计数场景：因为Redis处理命令是单线程，所以执行命令的过程是原子的，因此String数据类型适合计数场景.

## String 命令

常用操作：创建、查询、更新、删除
- 创建 --> `set`, `setnx`
  - SET key value  # 设置一个key值为特定的value
  set命令扩展参数：EX（键过期时间秒）、PX（键过期时间毫秒）、NX（只有键不存在时才对键进行操作，基本替代下面的SETNX操作）、XX（键存在时才对键进行操作）
  - SETNX key value # 用于在指定的key不存在时，为key设置指定的值
- 查询 --> `get`, `mget`
  - Get key # 查询某个key，存在就返回对应的value，不存在返回nil
  - Mget key [key ...] # 一次查询多个key，如果某个key不存在，对应位置返回nil
- 更新 --> `set`
  - 见上面的set
- 删除 --> `del`
  - DEL key [key ...] # 删除对象，返回值为删除成功了几行

## String 编码(底层实现)

Redis String类型，底层实现是使用C语言的`sds`字符串类型，sds类型是Redis自己实现的一种动态字符串类型，它比C语言的`string`类型多了一个指针，指向字符串的结尾，方便在字符串末尾追加数据。

- String的三种编码方式:
  - `INT`: 存放整形，可以用long表示的整数
  - `EMBSTR`: 如果字符串小于等于(<=)阈值字节(redis > 3.2 ? 44 : 39)，使用EMBSTR编码
  - `RAW`: 字符串大于(>)阈值字节，使用RAW编码

> 阈值字节: 在源码中使用OBJ_ENCODING_EMBSTR_SIZE_LIMIT宏定义，默认为44字节，在Redis 3.2版本中，该阈值是39字节.

`EMBSTR`和`RAW`是由redisObject和`sds`两个结果组成，两者差异在于`EMBSTR`编码下redisObject和sds是连续的内存，RAW编码下redisObject和SDS的内存是分开的.

EMBSTR的优缺点：
  1. 优点：一次性分配内存，redisObject和SDS两个结构一次性分配内存
  2. 缺点：重新分配空间时，整体需要重新再分配
  3. EMBSTR设计为只读，任何写操作之后EMBSTR都会变成RAW

编码转化的可能：
1. INT -> RAW: 当内存不再是整形，或者大小超过了long
2. EMBSTR -> RAW: 任何写操作之后EMBSTR都会变成RAW

## String sds源码分析

sds(Simple Synamic String)，简单动态字符串，是redis内部作为基石的字符串封装（很重要）

sds是redis封装字符串结构，用以解决字符串追加和长度计算操作来带的性能瓶颈问题

redis中SDS分为sdshdr8、sdshdr16、sdshdr32、sdshdr64，字段属性一致，区别再对应不同大小的字符串

```c
struct __attribute__((__packed__)) sdshdr8 {
    uint8_t len;   // 使用了多少内部
    uint8_t alloc; // 分配了多少内存
    unsigned char flags; // 标记是什么分类 例如： #define SDS_TYPE_8 1
    char buf[];
}
```

从上面的结构可以看出SDS是怎么解决问题的：
1. 增加len字段，快速返回长度
2. 增加空余空间(alloc - len)，为后续追加数据留余地
3. 不要以'\0'作为判断标准，二进制安全

SDS预留空间大小的规则：alloc = min(len, 1M) + len：
   - len小于1M的情况下，alloc=2*len, 预留len大小的空间
   - len大于1M的情况下，alloc=1M+lne, 预留1M大小的空间