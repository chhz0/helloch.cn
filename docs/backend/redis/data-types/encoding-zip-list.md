---
prev:
  text: '编码 - SDS'
  link: 'redis/data-types/encoding-sds'
next:
  text: '编码 - HASHTABLE'
  link: '/redis/data-types/encoding-hashtable'
---
# ZIPLIST <Badge type="tip" text="Redis Encoding ZIPLIST" />

`ZIPLIST`压缩列表，是排列紧凑的列表，为Redis供紧凑型的数据存储方式，能节约内存（节省链表指针的开销），数据量小的时候遍历访问性能好（连续+缓存命中率友好）

关于`LISTPACK`是Redis 5.0引入，Redis 7.0完全替代`ZIPLIST`.

## ZIPLSIT 整体结构

```text{3}
// redis代码注释，描述了ZIPLIST的结构

 <zlbytes> <zltail> <zllen> <entry> <entry> ... <entry> <zlend>
```
各字段定义：
- `zlbytes`: 表示该ZIPLIST一共占了多少字节，这个数字是包含zlbytes本身占据的字节的
- `zltail`: ZIPLIST尾巴节点，相对于ZIPLIST的开头，偏移的字节数
- `zllen`: 表示有多少个数据节点
- `entry`: 表示压缩列表的数据节点
- `zlend`: 一个特殊的entry节点，为1个字节`11111111`即255占据，表示ZIPLIST的结束

### ZIPLIST 节点结构 - entrys

其定义如下
```text
 * <prevlen> <encoding> <entry-data>
```
各字段含义：
- `prevlen`: 表示前一个节点的长度。通过该节点定位到前一个节点的起始地址，如果前一个节点是压缩列表的开头，那么这个字段的值为0，通过该字段，可以实现往前操作，即`ZIPLIST`可以从后往前遍历.
  > 有关上一个`entry`的长度，从`prevlen`字段可以获得，根据`entry`的大小，`prevlen`所占字节也会有所变化:
  > - entry < 254 : `prevlen`为1字节，(值得注意的是255在entry中是个特殊数字，被`zlend`使用，表示`ZIPLIST`的结束)
  > - entry >= 254 : `prevlen`为5字节，在这5个字节中，第一个字节作为标志位，固定为`11111110`，表示`prevlen`是5个字节，后面4个字节才是`prevlen`记录的上一个节点长度.

- `encoding`: 编码类型，包含了entry的长度信息，用于正序遍历.
  > encoding是一个整型数据，其二进制数据由`entry-data`的类型和字节长度组成
  > - 如果是string类型，那么encoding由两部分，前几位为标识位、后几位标识长度
  > - 如果是int类型，整体1字节编码，那么仅标识类型，根据不同的int类型，确定其长度，例如int32就是32位，4字节


- `entry-data`: 实际的数据

## ZIPLIST 查询数据

- 获取节点数量
`ZIPLIST`可以在O(1)时间复杂度返回节点数量，因为其header定义了记录节点数量的`zllen`，但是`zllen`仅占2字节长度，最大记录**65534**，当节点数量超过65535时，就需要通过遍历节点获取节点数量.

之所以zllen是2个字节，原因是redis中应用ZIPLIST是为了节点个数少的场景，所以将zllen设计得比较小，节约内存空间

- 查询指定数据的节点

在`ZIPLIST`中查询指定数据的节点，需要遍历压缩列表，平均时间复杂度为O(N)

## ZIPLIST 更新数据

`ZIPLIST`的更新就是增加、删除数据，ZIPLIST提供头尾增减的能力，平均时间复杂度O(N)，因为在头部增加一个节点会导致后面节点都往后移动，所以更新平均时间复杂度O(N).

更新操作可能带来连锁更新，连锁更新是指节点后移发生不止一次，而是多次

连锁更新的触发条件是：插入一个大于254字节的元素时，如果记录新元素的长度的下一节点的`prevlen`原本为1字节，但是因为新元素的长度大于254字节，导致`prevlen`需要变成5字节，导致后面节点的`prevlen`可能需要跟着变化，这就是`ZIPLIST`的连锁更新.

尽管连锁更新可能导致性能问题，但实际上这种情况发生的概率较低。因为要发生连锁更新，需要ZipList中有连续多个长度刚好为250到253字节的节点，这种情况在实际应用中并不常见.

## LISTPACK 优化

`LISTPACK`是为了解决`ZIPLIST`最大的痛点——连锁更新

> ZIPLIST需要支持LIST，LIST是一种双端访问的结构，所以需要能从后往前遍历
ZIPLIST的数据节点：`prevlen` `encoding` `entry-data`
其中，prevlen表示上个节点的数据长度，通过这个字段可以定位上一个节点的数据
连锁更新的问题，就是因为prevlen导致的

`LISTPACK`以一种不记录prevlen，并且还能找到上一个节点的起始位置的节点结构，解决`ZIPLIST`存在的连锁更新问题

```text
<encoding-type> <element-data> <element-tot-len>
```

- `encoding-type`是编码类型，`element-data`是数据内容，`element-tot-len`存储整个节点除了它自身之外的长度即`element-type`和`element-data`的长度之和
- `element-tot-len`所占用的每个字节的第一个bit用于标识是否结束，第一个bit `0` 是结束 `1` 是继续，剩下7个bit来存储数据大小

