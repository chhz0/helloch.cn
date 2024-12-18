---
prev:
  text: '编码 - HASHTABLE'
  link: '/redis/data-types/encoding-hashtable'
next:
  text: 'Redis 架构'
  link: 'redis/arch'
---
# SKIPLIST <Badge type="tip" text="Redis Encoding SKIPLIST" />

跳表是Redis有序集合ZSet底层的数据结构

redis中跳表的两处应用：

    1. 实现有序集合键
    2. 在集群节点中作为内部数据结构

从本质上看是链表，这种结构虽然简单清晰，但是查询某个节点的效率比较低，而在有序集合场景，无论是查找还是添加删除元素，我们是需要快速通过score定位到具体位置，如果是链表的话时间复杂度是O(N)

为了提高查找的性能，Redis引入跳表，跳表在链表的基础上，给链表增加了多级的索引，通过索引可以一次实现多个节点的跳跃，提高性能

## SKIPLIST 结构

Redis `SKIPLIST` 单节点的结构:
```c
typedef struct zskiplistNode {
    sds ele;
    double score;
    struct zskiplistNode *backward;
    struct zskiplistLevel {
        struct zskiplistNode *forward;
        unsigned long span;
    } level[];
} zskiplistNode;
```

字段的定义：
- `Ele`: SDS结构，用来存储数据
- `Score`: 节点的分数，浮点型数据
- `Backward`: 指向上一个节点的回退指针，支持从表尾向表头遍历，也就是ZREVRANGE这个命令
- `level`: 是个zskiplistLevel结构体数组，包含两个字段，一个是forward，指向该层下个能跳到的节点，span记录距离下个节点的步数，数组结构表示每个节点可能是多层结构

> 在标准的跳表中，score值是不可重复的，但是在Redis ZIPLIST中，score值是可重复的，增加了回退指针

## SKIPLIST 细节

- Redis跳表单个节点有几层？

层次的决定，需要比较随机，才能在各个场景表现出较平均的性能，这里Redis使用概率均衡的思路来确定插入节点的层数：

Redis跳表决定每一个节点，是否能增加一层的概率为25%，而最大层数限制在Redis 5.0是64层，在Redis 7.0是32层

- Redis跳表的性能优化了多少？

平均时间复杂度为O(log(n))，跳表的最坏平均时间复杂度是O(N)，当然实际的生产过程中，体现出来的基本是跳表的平均时间复杂度