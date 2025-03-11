---
prev:
  text: 'Redis 数据类型'
  link: 'redis/data-types'
next:
  text: '数据类型 - List'
  link: '/redis/data-types/Lists'
---
# Strings  <Badge type="tip" text="Redis Strings" />

Redis String 类型，存储字节，包括文本，序列化对象和二进制数组，因此 ***String是Redis最基本的数据类型*** 。通常用于**缓存**，而且Redis支持其他功能，允许实现**计数器**并执行按位运算.

由于Redis中key是一个字符串，因此Redis使用String数据类型作为key的值.

在默认情况下，Stirng最大为512MB，可以通过配置项`proto-max-bulk-len`进行修改.

## Strings 适用场景
使用场景：一般用来存放字节数据、文本数据、序列化后的对象数据.

1. 缓存场景：Value存Json字符串等信息.
2. 计数场景：因为Redis处理命令是单线程，所以执行命令的过程是原子的，因此String数据类型适合计数场景.

## Strings 命令

常用命令:
- 创建 --> `set`, `setnx`, `getset`
  - `SET key value`  # 设置一个key值为特定的value
  > set命令扩展参数：
    EX（键过期时间秒）、PX（键过期时间毫秒）、NX（只有键不存在时才对键进行操作，基本替代下面的SETNX操作）、XX（键存在时才对键进行操作）
  - `SETNX key value` # 用于在指定的key不存在时，为key设置指定的值，对于实现锁很有用
  - `GETSET key value` # 设置一个key的值，并返回原来的值
- 查询 --> `get`, `mget`
  - `Get key` # 查询某个key，存在就返回对应的value，不存在返回nil
  - `Mget key [key ...]` # 一次查询多个key，如果某个key不存在，对应位置返回nil
- 更新 --> `set`
  - 见上面的set命令
- 删除 --> `del`
  - `DEL key [key ...]` # 删除对象，返回值为删除成功了几行

其他命令：`incr`, `incrby`, `incrbyfloat`
- `INCR key [increment]` # 以原子方式将给定键中存储的计数器加 1
- `INCRBY key increment` # 以原子方式将给定键中存储的计数器加上指定的增量值
- `INCRBYFLOAT key increment` # 以原子方式将给定键中存储的计数器加上指定的浮点数增量值

::: info 🔗 [Strings命令列表](https://redis.io/docs/latest/commands/?group=Strings)
:::


## Strings 编码(底层实现)

Redis String类型，底层实现是使用C语言的`SDS`字符串类型，sds类型是Redis自己实现的一种动态字符串类型，它比C语言的`Strings`类型多了一个指针，指向字符串的结尾，方便在字符串末尾追加数据。

- Strings的三种编码方式:
  - `INT`: 存放整形，可以用long表示的整数以该编码存储；
  - `EMBSTR`: 如果字符串 <= 阈值字节(redis.version > 3.2 ? 44 : 39)，使用EMBSTR编码
  - `RAW`: 字符串大于 > 阈值字节(redis.version > 3.2 ? 44 : 39)，使用RAW编码

::: details 点击查看EMBSTR的阈值为什么是44？
> 阈值字节: 在源码中使用OBJ_ENCODING_EMBSTR_SIZE_LIMIT宏定义，默认为44字节，在Redis 3.2版本中，该阈值是39字节.

1. Redis默认使用jemalloc作为内存分配器
2. jemalloc是以**64字节**作为内存单元做内存分配，如果超出了64个字节就超过了一个内存单元. 在内存分配时，RedisObject会尽量在一个内存单元，是为了减少内存寻址，又不会消耗分配过多没用到的内存，
3. 围绕64字节的关键分界分析版本变化，Redis的字符串对象是由一个`RedisObject`+`sdshdr`两部分组成，
   - RedisObject大小为`4+4+24+32+64 = 128bits = 16bytes`，其中的ptr是64，是为了方便各种编译器和目标平台上使用
   - sdshdr8占用内存大小: 1byte + 1byte + 1byte + 内联数组的大小，由于内联数组中还有一个'\0'占位一个字符，所以能用的大小为64-16(redisObject)-3(sdshdr非内容属性)-1('\0')=44

RedisObject Struct:
```c
#define LRU_BITS 24

typedef struct reidsObject {
    unsigned type:4;        // 4 bit
    unsigned encoding:4;    // 4 bit
    unsigned lru:LRU_BITS;  // 24 bit

    int refcount;           // 32 bit
    void *ptr;              // 64 bit
} robj;                     // 128 bit == 16 bytes
```

sdshdr Struct:
```c
struct __attribute__((__packed__)) sdshdr8 {
    uint8_t len;          // 1 byte
    uint8_t alloc;        // 1 byte
    unsigned char flags;  // 1 byte
    char buf[];           // '\0' 占位符 1 byte
}
```
:::

`EMBSTR`和`RAW`是由redisObject和`SDS`两个结构组成，两者差异在于`EMBSTR`编码下redisObject和SDS是连续的内存，RAW编码下redisObject和SDS的内存是分开的.

![redis-string-embstr-raw](/redis/redis-string-embstr-raw.drawio.svg)

EMBSTR的优缺点：
  1. 优点：一次性分配内存，redisObject和SDS两个结构一次性分配内存
  2. 缺点：重新分配空间时，整体需要重新再分配
  3. EMBSTR设计为只读，任何写操作之后EMBSTR都会变成RAW

编码转化的可能：
1. INT -> RAW: 当内存不再是整形，或者大小超过了long
2. EMBSTR -> RAW: 任何写操作之后EMBSTR都会变成RAW

> [!NOTE] SDS解释
> 🔗 [查看SDS](./encoding-sds.md)