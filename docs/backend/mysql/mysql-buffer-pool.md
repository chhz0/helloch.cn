---
prev:
  text: 'MySQL - 日志'
  link: '/mysql/mysql-log'
next:
  text: 'MySQL - 逻辑架构'
  link: '/mysql/mysql-arch'
---
# MySQL内存 <Badge type="tip" text="MySQL Buffer Pool" />

## 为什么要有Buffer Pool

MySQL的数据存储在磁盘的，如果每次都从磁盘里面读取数据，这样性能是很差的

提高性能，就需要加入缓存。当数据从磁盘中取出来之后，缓存内存中，下次查询同样的数据，直接从内存中读取

为此InnoDB存储引擎设计了**一个缓存池（Buffer Pool），来提高数据库的读写性能**

有了缓冲池后：
- 读取数据时，如果数据存在于Buffer Pool中，客户端就会直接读取Buffer Pool中的数据，否则再去磁盘中读取
- 当修改数据时，首先修改Buffer Pool中数据所在的数据页，然后将该页设置为脏页，最后由后台线程将脏页写入到磁盘
## Buffer Pool有多大？

Buffer Pool在MySQL启动的时候，向操作系统申请的一片连续的内存空间，默认配置下Buffer Pool只有`128MB`

可以通过调整`innodb_buffer_pool_size` 参数来设置Buffer Pool的大小，一般建议设置为可用物理内存的60%~80%

## Buffer Pool缓存什么？

InnoDB会把存储的数据分为若干个**页**，以页作为磁盘和内存交互的基本单位，一个页的默认大小为**16kb，**因此Buffer Pool同样需要按页来划分

在MySQL启动的时候，**InnoDB会为Buffer Pool申请一片连续的****内存****空间，然后按照默认的16****kb****的大小划分出一个个的页，Buffer Pool中的页就叫做缓存页。**这些缓存页都是空的，之后随着程序的运行，才会有磁盘上的页被缓存到Buffer Pool中

所以，MySQL刚启动的时候，其使用的虚拟内存空间很大，而使用到的物理内存空间很小，这时因为这些虚拟内存被访问后，操作系统才会触发缺页中断，接着将虚拟地址和物理地址建立映射关系

Buffer Pool缓存了以下的：
- 索引页
- 数据页
- 插入缓存页
- Undo页
- 自适应哈希索引
- 锁信息

为了更好管理Buffer Pool中的缓存页，InnoDB为每一个缓存页都创建了一个**控制块，**控制块包括缓存页的表空间，页号，缓存页地址，链表节点等，控制块也占据内存空间，它是在Buffer Pool的最前面，接着才是缓存页

暂时无法在飞书文档外展示此内容

上面的控制块和缓存页之间的空白空间称为**碎片空间**

> 碎片空间：每一个控制块对应一个缓存页，在分配足够多的控制块和缓存页后，可能剩余的空间不足够一个控制块和缓存页的大小，那么这块空间就不被使用，剩下的这块空间就被称为碎片
>
> 当Buffer Pool的大小设置的刚刚好，就不会产生碎片

查询一条记录时，InnoDB会把整个页的数据加载到Buffer Pool中，通过索引只能定位到磁盘中的页，而不能定位到页中一条记录。

[mp.weixin.qq.com](https://mp.weixin.qq.com/s/A5gNVXMNE-iIlY3oofXtLw)(从数据页的角度看B+树——InnoDB存储引擎)

记录是按照行来存储的，但是数据库的读取并不是以**行**为单位，否则一次读取（一次IO操作）只能处理一行数据，效率会非常低，因此，**InnoDB的数据是按照数据页为单位来读写的**

数据页的结构分为7个部分

|                         |                          |
| ----------------------- | ------------------------ |
| File Header(38)         | 文件头，表示页的信息               |
| Page Header(56)         | 页头，表示页的状态信息              |
| infimum+supermun(26)    | 两个虚拟伪记录，分别表示页中最小记录和最大记录  |
| User Records(unclear)   | 存储行记录内容                  |
| Free Space(unclear)     | 页中还没被使用的                 |
| Page Directory(unclear) | 页目录，存储用户记录的相对位置，对记录起索引作用 |
| File Tailer(8)          | 校验页是否完整                  |

其中，行记录由`infimum+supremum` 和 `User Records`构成

在`File Header` 中有两个指针，分别指向上一个数据页和下一个数据页，连接起来的页相当于一个双向链表

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=NmFkOTdjOTNkNzBmNGQ3ZmRiODRjNjk0ZGQ2YWRhMzhfSUZVZkZ1c3hOdjZtejZvaFBzRHBQbDdqZVZFYnExZGpfVG9rZW46Q3R6TmJEMnNmb1Ewc2p4bEVwa2N1UW9TbmliXzE3MjE4NDExNDM6MTcyMTg0NDc0M19WNA)

采用链表结构是让**数据页之间不需要物理上的连续，而是逻辑上的连续**

### 数据页中User Records是怎么组织数据的？

**数据页中的记录按照****主键****顺序组成****单向链表****，**单向链表的特点是插入、删除非常方便，但是检索效率不高

因此，在数据页中有一个页目录（Page Directory），起记录的索引作用，可以快速找到记录

页目录创建过程如下：

1. 将所有记录划分为几个组，这些记录包括最小记录和最大记录，但不包括标记已删除的记录

2. 每个记录组的最后一条记录是组内最大的那条记录，并且**最后一条记录**的头信息都会存储该组一共多少条记录，作为n_owned字段

3. 页目录用来存储每组最后一条记录的地址偏移量，这些地址偏移量会按照先后顺序存储起来，每组的地址偏移量也被称为槽（slot），每个槽相当于指针指向了不同组的最后一个记录


**页目录就是由多个槽组成，槽相当于分组记录的索引**。因为**记录是按照****主键****值大小从小到大排序，所以通过槽查找记录时，可以使用****二分查找****法快速定位要查询的记录在哪个槽（哪个记录分组），定位到槽后，在遍历槽内的所有记录，找到对应的记录**

> InnoDB里的B+树中的每个节点都是一个数据页

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGU2NWUzOWYzYTM2OTI4Mzk4MTZhMjU5ODIzNmE0NzVfREdRU1pMcDFsWm9iQk9oV2doWnFxWjlGYzJaOWlIRXdfVG9rZW46V0VHcGJ4WnhBb1UzdkZ4dzU0ZGNzanh1bk5xXzE3MjE4NDExNDM6MTcyMTg0NDc0M19WNA)

InnoDB对每个分组中的记录条数是有规定的，槽内的记录就有几条：

- 第一个分组中的记录只能由1条

- 最后一个分组的记录条数范围只能在1-8条之间

- 剩下的分组中记录条数范围只能在4-8条之间


## 如何管理Buffer Pool？

1. ### 空闲页的管理


为了能够快速找到空闲的缓存页，可以使用链表结构，**将空闲缓存页的****控制块****作为链表的节点**，这个链表称为**Free链表**（空闲链表）

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=OWViYTY2N2U4YWZkMDJhZTVjMWJiZTBhYzNhYTE3MjBfVkRuWkh6OFdqME9TdG84SlJxbFp0N0dKVXNPZEUzNWxfVG9rZW46RGxDcWI1RnBOb3RNUzh4U0dTbGM4Q0hxbjBjXzE3MjE4NDExNDM6MTcyMTg0NDc0M19WNA)

Free链表上除了控制块，还有一个**头结点**，该头结点包含该链表的头结点地址，尾节点地址，以及当前链表中节点的数量等信息

Free链表节点是一个个的控制块，而每个控制块包含着对应缓存页的地址，所以相当于Free链表节点都对应一个空闲缓存页

有了Free链表后，每当需要从磁盘中加载一个页到Buffer Pool中，就从Free链表中取一个空闲的缓存页，并且把该缓存页对应的控制块的信息填上，然后把该缓存页对应的控制块从Free链表中移除

2. ### 脏页的管理


Buffer Pool除了提高读性能，还能提高写性能，就是更新数据的时候，不需要每次都写入磁盘，而将Buffer Pool对应的缓存页标记为**脏页**，然后由后台线程将脏页写入到磁盘

innodb设计出了Flush链表，跟Free链表类似，链表的节点是控制块，区别是Flush链表的元素是脏页

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=NWU2YzcyZmEwY2QzOWJlMTMwY2ViZTQ2Njg3M2RmNTZfWnpuN3Vpd1hsN01KeGNicVpTem5na3I1ckxURkhFcjVfVG9rZW46WERkVGJlTTM3b0dXU3N4MHZDNGN3YTlRbnFlXzE3MjE4NDExNDM6MTcyMTg0NDc0M19WNA)

有了Flush链表，后台线程可以遍历Flush链表，将脏页写入磁盘

## 如何提高缓存命中率

Buffer Pool的大小是有限的，所以需要使用一些策略，保证常用数据留在Buffer Pool，少用的数据在某个时机可以淘汰掉

最常见的是**LRU算法（Least recently used）**

这个算法的思路是，链表头部的节点是最近使用的，而链表末尾的节点是最久没有使用的，那么当空间不够时，就淘汰最久没有使用的节点

简短的LRU算法实现思路如下：

- 当访问的页在Buffer Pool中，就直接将该页对于的LRU链表节点移动到链表的头部

- 当访问的页不在Buffer Pool中，除了把页放入到LRU链表的头部，还要淘汰LRU链表末尾的节点


至此，Buffer Pool里有三种页和链表来管理数据：

- Free Page（空闲页）：表示此页未被使用，位于Free链表

- Clean Page（干净页）：表示此页已经被使用，但是页面未发生修改，位于LRU链表

- Dirty Page（脏页）：表示此页已经被修改，其数据和磁盘上的数据已经不一致。当脏页上的数据写入磁盘后，内存数据和磁盘数据一致，那么该页就变成干净页。脏页同时存在于LRU链表和FLUSH链表


简短LRU算法没有被MySQL使用，因为简短LRU算法无法避免一些两个问题：

- 预读失效

- Buffer Pool污染


### 怎么解决预读失效而导致缓存命中率减低的问题？

> 预读失效：
>
> MySQL的预读机制。程序有空间局部性，靠近当前被访问数据的数据，在未来大概率被访问
>
> MySQL在加载数据页的时候，会提前把相邻的数据页一并加载，减少磁盘IO
>
> 但是这些被提前加载进来的数据页，并没有被访问，相当于预读是白做，这个就是**预读失效**
>
> 如果使用简单的LRU算法，就会把预读页放到LRU链表头部，而当Buffer Pool空间不够，还需要淘汰末尾的页
>
> 这里会出现一个奇怪的问题，预读页可能一直不会被访问到，却会占用LRU链表前排的位置，而末尾淘汰的页可能是频繁访问的页，这样就大大降低了缓存命中率

避免预读失效带来的影响，最好就是**让预读的页停留在Buffer Pool里时间尽可能的短，让真正被访问的页才移动到LRU****链表****的头部，从而保证真正被读取的热数据留在Buffer Pool里的时间尽可能长**

MySQL做了以下修改：将LRU划分了2个区域：**old区域和young区域**

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=OTVjZDQ2MjUxMzExMWEzMjQ0YmYzODA5NzUyNzBkMzZfWWdta2ZyelFMNTBIS2NpMTcxaU1jQ0Z4THFQOVUwUnZfVG9rZW46Ull4amJuZ213b3pqSk94VHBZN2NteGVZbjRJXzE3MjE4NDExNDM6MTcyMTg0NDc0M19WNA)

young区域在LRU链表的前半部分，old区域则是在后半部分，old区域占整个LRU链表长度比例可以通过`innodb_old_blocks_pct` 参数来设置，默认是37，代表整个LRU链表中young区域和old区域比例是63:37

**划分两个区域后，预读的页只需要加入到old区域的头部，当页被真正访问到时候，才将页插入到young区域。**

MySQL改进后的LRU算法，通过划分young区域和old区域避免了预读失效带来的影响，但是没有解决Buffer Pool污染的问题

### 怎么解决出现Buffer Pool污染而导致缓存命中率减低的问题？

> Buffer Pool污染：
>
> 当某个SQL语句扫描了大量的数据，在Buffer Pool空间比较有限的情况下，可能会将**Buffer Pool里的所有页都替换出去，导致大量热数据被淘汰**，等这些热数据又再被访问的时候，由于缓存未命中，就会产生大量的磁盘IO，MySQL性能就会急剧下降，这个过程为**Buffer Pool污染**

像全表扫描的查询，很多缓存页其实只会被访问一次，但是它却因为被访问一次而进入到young区域，从而导致热点数据被替换

为了解决这个问题，MySQL提高了进入young区域的门槛，这样就能有效保障young区域里的热点数据不会被替换掉

**想要进去young区域条件增加了一个停留在old区域的时间判断**

具体过程如下，在对某个处在old区域的缓存页进行第一次访问时，就在它对应的控制块中记录下来这个访问时间：

- 如果后续的访问时间与第一次访问的时间在**某个时间间隔内**，那么**该缓存页就不会被从old区域移动到young区域的头部**
- 如果后续的访问时间与第一次访问的时间**不在某个时间间隔内**，那么**该缓存页移动到young区域的头部**

这个间隔时间是由`innodb_old_blocks_time` 控制的，默认是1000ms

也就是说，只有同时满足**被访问**与**old区域停留时间超过1s**两个条件，才会被插入到young区域的头部，这样就解决了Buffer Pool污染问题

另外，MySQL针对young区域其实做了一个优化，为了防止young区域节点频繁移动到头部，young区域前面1/4被访问不会移动到链表头部，只有后面的3/4被访问了才会

## 脏页什么时候会被刷入磁盘？

引入Buffer Pool后，当修改数据时，首先修改Buffer Pool中数据所在的页，然后将其页设置为脏页，但是磁盘中还是原数据

因此，脏页需要刷入磁盘，保证缓存和磁盘数据一致，但是若每次修改数据都刷入磁盘，则性能会变差，因此一般都会在一定时机进行批量刷盘

但是如果脏页在还没来得急刷入磁盘时，MySQL宕机了，数据会丢失吗？

不会，InnoDB的更新操作采用的是Write Ahead Log策略，即先写日志，在写入磁盘，通过redo log日志让MySQL拥有崩溃恢复能力

下面几种情况会触发脏页的刷新：

- 当redo log日志满了的情况下，会主动触发脏页刷新到磁盘
- Buffer Pool空间不足时，需要将一部分数据页淘汰掉，如果淘汰的脏页，需要先将脏页同步到磁盘
- MySQL认为空闲时，后台线程会定期将适量的脏页刷入到磁盘
- MySQL正常关闭时，会把所有的脏页刷入磁盘