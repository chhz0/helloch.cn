---
prev:
  text: '数据类型 - Hash'
  link: 'redis/data-types/Hashes'
next:
  text: '数据类型 - ZSet'
  link: '/redis/data-types/ZSet'
---
# HashTable <Badge type="tip" text="Redis Encoding HASHTABLE" />

通过`HASHTABLE`可以使用O(1)时间复杂度能够快速找到key对应的value，简单理解，`HASHTABLE`是一个目录，可以帮助我们快速找到需要内容

`HASHTABLE`的结构
```c
typedef struct dictht {
    dictEntry **table;
    unsigned long size;
    unsigned long sizemask;
    unsigned long used;
} dictht;
```

最外层封装一个dictht结构，字段含义如下：
- `Table`: 指向实际hash存储。存储可以看做一个数组
- `Size`: 哈希表大小，实际就是dictEntry有多少元素空间
- `Sizemask`: 哈希表大小的掩码表示，总是等于size-1. 这个属性和哈希值一起决定一个键应该放到table数组的那个索引上面，规则Index=hash&sizemask.
- `Used`: 表示已经使用的节点数量。通过这个字段可以查询目前HASHTABLE元素总量

![redis-encodng-hashtable-struct](../../public/redis/redis-encoding-hashtable-struct.drawio.svg)

## Hash 渐进式扩容/缩容

渐进式扩容就是一点一点扩大`HASHTABLE`的容量，默认值为4 (#define DICT_HT_INTTIAL_SIZE 4)
为了实现渐进式扩容，Redis没有直接把dictht暴露给上层，而是再封装了一层

```c
typedef struct dict {
    dictType *type;
    void *privdata;
    dictht ht[2];
    long rehashidx;
    unsigned long iterators;
} dict;
```

`dict`结构里面，包含了2个dictht结构，也就是2个HASHTABLE结构。

`dictEntry`是链表结构，用拉链法解决Hash冲突，用的是头插法

实际上，平时使用的时候就是一个`HASHTABLE`，在触发扩容之后，就会有两个`HASHTABLE`同时使用，详细过程如下：
当向字典添加元素时，需要扩容时会进行rehash

::: info Rehash流程分以下三步：
1. 为新Hash表ht[1]分配空间，新表大小为第一个大于等于原表ht[0]的2倍used的2次幂。例如，原表used=500，2*used=1000，第一个大于1000的2次幂为1024，因此新表的大小为1024. 此时，字典同时持有ht[0]和ht[1]两个哈希表，字典的偏移索引rehashidx从静默状态-1，设置为0，表示Rehash正式开始工作。
2. 迁移ht[0]数据到ht[1]在Rehash进行期间，每次对字典执行增删改查操作，程序会顺带迁移当前rehashidx在ht[0]上的对应数据，并更新偏移索引(rehashidx)。
3. 随着字典操作的不断执行，最终在某个节点，ht[0]的所有键值对会被Rehash到ht[1]，此时再将ht[1]和ht[0]两个指针对象互换，同时把偏移索引的值设置为-1，表示Rehash操作已经完成。
小总结：渐进式扩容的核心是操作时顺带迁移
:::

扩容时机
redis提出一个负载因子的概念，负载因子表示目前Redia HASHTABLE的负载情况

用k表示负载因子：`k=ht[0].used/ht[0].size`，也就是使用空间和总空间大小的比例，redis会根据负载因子的情况来扩容：

1. 负载因子 **k大于1** 时，说明此时空间非常紧张，新数据在链表上叠加，越来越多的数据导致查询无法在O(1)时间复杂度找到，还要遍历链表，如果此时服务器没有执行BGSAVE或BGREWRITEAOF两个命令，就会发生扩容。
2. 负载因子 **k大于5** 时，说明HASHTABLE已经不堪重负，此时即使有复制命令在，也要进行扩容

### 缩容
当有了多余的空间，如果不释放，就会导致多余的空间被浪费

缩容过程和扩容是相似的，也是渐进式缩容，同样缩容时机也是用负载因子来控制的

当负载因子小于0.1，此时进行缩容，新表的大小为第一个大于等于used的2次幂

使用`BGSAVE`或`BGREWRITEAOF`两个复制命令，缩容也会受影响，不会进行