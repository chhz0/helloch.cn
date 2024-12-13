---
prev:
  text: 'MySQL - 锁'
  link: '/mysql/mysql-lock'
next:
  text: 'MySQL - 内存'
  link: '/mysql/mysql-buffer-pool'
---

# MySQL日志 <Badge type="tip" text="MySQL Log" />

先理解执行一条sql语句，在mysql内部会发生什么？

以执行一条`update` 语句为例：

- 客户端会先通过连接器建立连接，连接器会判断用户身份

- 这里是一条update语句，所以不需要经过查询缓存（注意，当表上有更新语句，会把整个查询缓存清空，所以在Mysql8.0这个功能就被移除了）

- 解析器会通过词法分析识别出关键字，构建出语法树，接着做语法分析，判断输入的语句是否符合MySQL语法

- 预处理器会判断表和字段是否存在

- 优化器确定执行计划（使用索引或者全表查询）

- 执行器负责具体执行，找到这一行然后更新


不过，更新语句的流程会涉及到**undo** **log****，redo log，binlog**三种日志：

- undo log（回滚日志）：是InnoDB存储引擎生成的日志，实现了事务中的**原子性**，主要用于事务回滚和MVCC

- redo log（重做日志）：是InnoDB存储引擎生成的日志，实现了事务中的**持久性**，主要用于掉电等故障恢复

- bing log（归档日志）：是Server层生成的日志，主要用于数据备份和主从复制


## 1.为什么需要undo log？

在执行一条“增删改”语句的时候，MySQL会隐式开启事务，执行完后自动提交事务

> MySQL中执行一条语句后是否自动提交事务，是由`autocommit` 参数来决定的，默认是开启的

当事务执行过程中，都记录下回滚时需要的信息到一个日志中，那么在事务执行过程中发生MySQL崩溃后，可以通过这个日志回滚到事务之前的数据

实现这一机制就是 **undo** **log****（回滚日志），它保证了事务的****ACID****特性中的原子性**

每当InnoDB引擎对每种操作进行回滚时，进行相反操作就行：

- 插入 - 删除

- 删除 - 插入

- 更新 - 更新为旧值


一条记录每次进行操作产生的undo log格式都有一个roll_pointer和一个trx_id事务id：

- trx_id：记录该记录是被哪些事务修改的

- roll_pointer：指针可以将这些undo log串成一个链表，这个链表被称为版本链


![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=N2UyNDE0NmNmNDU2N2UyY2Q5NDJkYzZiNzAwMzY3OTRfUjh5Zmw4d3VoWFI5VGZnaFR2a0NsVWk0bVdPTEM2WW5fVG9rZW46V3FmemIzbkhQb1BkRjB4UGFLbWNwR2RpbkRLXzE3MjE4NDExMjk6MTcyMTg0NDcyOV9WNA)

另外，undo log可以跟Read View一起实现MVCC（多版本并发控制）：

对于 **读提交** 和 **可重复读** 隔离级别的事务来说，它们的快照读（普通select语句）是通过Read View + undo log来实现的，区别在于创建Read View的时机不同

- 读提交：是在每一个select都会生成一个新的Read View，也意味着事务期间的多次读取同一数据，前后两次读的数据可能会出现不一致（不可重复读）

- 可重复读：是在启动事务时生成一个Read View，然后整个事务期间都在用这个Read View，这样保证了事务期间读到的数据都是事务启动时的记录


这两个隔离级别实现是通过事务的Read View里的字段和记录两个隐藏列trx_id和roll_pointer的对比

[事务隔离级别是怎么实现的？](https://xiaolincoding.com/mysql/transaction/mvcc.html#%E4%BA%8B%E5%8A%A1%E7%9A%84%E9%9A%94%E7%A6%BB%E7%BA%A7%E5%88%AB%E6%9C%89%E5%93%AA%E4%BA%9B)

因此，undo log两大作用：

- 实现事务回滚，保障事务的原子性

- 实现MVCC（多版本并发控制）关键因素之一


> Undo log是如何刷盘？
>
> Undo log和数据页的刷盘策略是一样的，都需要通过redo log保证持久化
>
> Buffer pool中有undo 页，对undo页的修改都会被记录到redo log。redo log每秒刷盘，提交事务时也会刷盘，数据页和undo 页都是靠这个机制保证持久化

## 2.为什么需要Buffer Pool？

MySQL的数据都是存储在磁盘中的，那么我们更新一条记录，得先从磁盘读取该记录，然后在内存中修改记录，修改完之后并不会直接写回磁盘，而是缓存起来，这样下次查询语句命中这条记录，就不需要从磁盘读取数据

为此，InnoDB存储引擎设计了一个**缓冲池****Buffer Pool，**来提高数据库的读写性能

暂时无法在飞书文档外展示此内容

有了Buffer Pool后：

- 当读取数据时，如果数据存在于Buffer Pool中，客户端会直接读取Buffer Pool中的数据，否则再去磁盘中读取

- 当修改数据时，如果数据存在Buffer Pool中，那么直接修改Buffer Pool中数据所在的页，然后将页设置为**脏页****（**该页上的数据和磁盘上的不一样**）**，为了减少磁盘I/O，不会立即将脏页写入磁盘，后续由后台线程选择以一个合适的时机将脏页写入到磁盘


### Buffer Pool缓冲了什么？

InnoDB会把存储的数据划分为若干个页，以页为磁盘和内存交互的基本单位，一个页的默认大小为**16K**

Buffer Pool同样按 页 来划分

在MySQL启动的时候，**InnoDB会为Buffer Pool申请一片连续的****内存****空间，然后按照默认的****`16k`** **的大小划分一个个的页，Buffer Pool中的页叫做缓冲页**。

Buffer Pool除了缓存索引页和数据页，还包括Undo页，插入缓存，自适应哈希索引，锁信息等

> Undo 页是记录什么？

开启事务后，InnoDB层更新记录前，首先要记录相应的undo log，如果是更新操作，需要把被更新的列的旧值记下来，也就是生成一个undo log，undo log会写入到undo页面

> 查询一条记录，就只需要缓存一条记录吗？

不是，当查询一条记录的时候，InnoDB会将整个页的数据加载到Buffer Pool中，将页加载到Buffer Pool后，再通过页里的页目录去定位到某条具体的记录 [换一个角度看B+树](https://mp.weixin.qq.com/s/A5gNVXMNE-iIlY3oofXtLw)



## 3.为什么需要 redo log？

Buffer Pool是提高了读写效率，但是Buffer Pool是基于内存的，而内存总是不可靠，出现断电重启时内存里没来得及落盘的脏页数据就会丢失

为了防止断电导致数据丢失，当一条记录需要更新，InnoDB就会先更新内存（同时标记为脏读页），然后将本次对这个页的修改以redo log的形式记录下来，这时候才算更新完成

后续，InnoDB引擎会在适合的适合，由后台线程将Buffer Pool的脏页刷新到磁盘里，这个就是**WAL****（Write-Ahead-Logging）技术**

WAL技术指的是，MySQL的写操作并不是立刻写到磁盘上面，而是先写日志，然后在合适的时间再写到磁盘上。

### 什么是redo log？

redo log是物理日志，记录了某个数据页做了什么修改，每当执行一个事务就会产生这样的一条或者多条物理日志

在事务提交的时候，只要先将redo log持久化到磁盘即可，可以不需要等待到将缓存在Buffer Pool里的脏页数据持久化到磁盘

当系统崩溃时，虽然脏页数据没有持久化，但是redo log语句持久化了，接着Mysql重启后，可以根据redo log的内容，将所有数据恢复到最新的状态

### 被修改undo页面，需要记录对应redo log吗？

需要的。

开启事务后，InnoDB层要更新记录前，首先要记录相应的undo log，如果是更新操作，需要把被更新的列的旧值记下来，也就是生成一条undo log，undo log会写入Buffer Pool中的Undo页面

不过，在内存修改该undo页面后，需要记录对应的redo log

### redo log和undo log区别在哪里？

这两种日志都是InnoDB引擎下的日志，它们的区别在于：

- redo log记录了事务完成后的数据状态，记录的是更新**之后**的值；

- undo log记录了事务开始前的数据状态，记录的是更新**之前**的值；


当事务提交之前发生崩溃，重启后会通过undo log回滚事务，事务提交之后发生崩溃，重启后会通过redo log恢复事务

暂时无法在飞书文档外展示此内容

有了redo log，再通过WAL技术，InnoDB可以保证即使数据库发生异常重启后，之前已提交的记录都不会丢失，这个能力就是 **crash-safe（崩溃恢复）**

**redo** **log****保证了事务四大特性中的持久性**

### redo log要写磁盘，数据也要写磁盘，为什么要多次一举？

写入redo log的方式是由了追加操作，所以磁盘操作是**顺序写**，而写入数据需要先找到写入位置，然后才写到磁盘，所以磁盘操作是**随机写**

磁盘的顺序写比随机写要高效得多，因此redo log写入磁盘的开销更小

> 可以说，这是WAL技术的另外一个优点：**MySQL****的写操作从磁盘的随机写变成了顺序写**

至此，针对为什么需要redo log这个问题我们有两个答案：

- 实现事务的持久性，让MySQL有crash-safe能力

- 将写操作从随机写到顺序写，提高MySQL写入磁盘的性能


### 产生的redo log是直接写入磁盘的吗

不是，redo log也有自己的缓存——redo log buffer，每当产生redo log时，会先写入到redo log buffer，后续再持久化到磁盘：

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=NWZkOGM0MWMyMWYxMjhkZWI5NTY0NzllOGRhNjIwMmRfZk9LZ1FlN0FwR2I3d1lGMVQ1dHNsdTBqTUpUOGp0ZE5fVG9rZW46WGdITGJ4U3RNb1NtQXp4NkRrR2NwMGJJbk9HXzE3MjE4NDExMjk6MTcyMTg0NDcyOV9WNA)

Redo log buffer默认的大小是16MB，可以通过`innodb_log_Buffer_size` 参数动态的调整大小，增大它的大小可以让MySQL处理大事务时不必写入磁盘，进而提高IO性能

### redo log什么时候刷盘？

缓存在redo log buffer里的redo log还是在内存中，它会在以下的时机刷新到磁盘

1. MySQL正常关闭时

2. 当redo log buffer中记录的写入量大于redo log buffer内存空间一半时，就会触发落盘

3. InnoDB的后台线程每隔1s，将redo log buffer持久到磁盘

4. 每次事务提交时都将缓存在redo log buffer里的redo log直接持久化到磁盘（这个策略可以通过`innodb_flush_log_at_trx_commit` 参数控制）


#### `innodb_flush_log_at_trx_commit` 参数控制的时候什么？

1. 设置**参数为0**时，表示每次事务提交时，还是将redo log留在redo log buffer，该模式下事务提交时不主动触发写入到磁盘的操作

2. 设置**参数为1**时，表示每次事务提交时，都将缓存在redo log buffer里的redo log直接持久化到磁盘，这样可以保证MySQL异常重启之后的数据不会丢失

3. 设置**参数为2**时，表示每次事务提交时，都只是缓存在redo log buffer里的redo log写到redo log文件，注意写入到 redo log文件并不意味着写入到了磁盘，而是写入到了Page Cache，就行写入到了操作系统的文件缓存


#### `innodb_flush_log_at_trx_commit` 为0和2时，什么时候才将redo log写入磁盘？

InnoDB的后台线程每隔1s：

- 针对参数0：会把缓存在redo log buffer中的redo log，通过write()写到操作系统的Page cache，然后调用`fsync()` 持久化到磁盘。所以参数为0的策略，MySQL进程崩溃会导致上一秒所有事务数据的丢失

- 正对参数2：调用`fsync()` ，将缓存在操作系统中Page Cache里的redo log持久化到磁盘，所以参数为2的策略，较取值为0情况下更安全，因为MySQL进程的崩溃并不会丢失数据，只有在操作系统崩溃或者系统断电的情况下，上一秒所有的事务数据才可能丢失


#### `innodb_flush_log_at_trx_commit` 三个参数的应用场景是什么？



### redo log 文件写满了怎么办？

默认情况下，innoDB存储引擎有一个重做日志文件组（redo log Group），重做日志文件组由2个redo log文件组成，这两个redo 日志的文件名叫：`ib_logfile0` 和`ib_logfile1`

在重做日志组中，每个redo log file的大小都是固定且一致的

重做日志组是以**循环写**的方式工作，从头开始写，写到末尾就回到开头，相当于一个环形

InnoDB存储引擎会先写ib_logfile0文件，当ib_logfile0文件被写满的时候，会切换至ib_logfile1文件，1写满时会被切换到0文件

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjdjMzNlNWY1NWM3ODY5M2E4YjcyMGNmZTAzMjE5YjNfSWVEbHpwZGNLMjA5NDBVTjd6YTQxbVd1QUw1UHRKSWVfVG9rZW46Tk5oQmJjNU5mb3F0RUd4djR3SWMwaGZQbmZkXzE3MjE4NDExMjk6MTcyMTg0NDcyOV9WNA)

redo log是为了防止Buffer Pool中的脏页丢失而设计的，那么随着系统运行，Buffer Pool的脏页刷新到了磁盘，那么redo log对应的记录也就没有了

redo log是循环写的方式，相当于一个环形，InnoDB用Write pos表示redo log当前记录写到的位置，用checkpoint表示当前要擦除的位置

- write pos和check point的移动都是顺时针方向

- write pos ~ check point之间的部分（红色），用来记录新的更新记录

- check point ~ write pos 之间的部分（蓝色），待落盘的脏数据页记录


如果write pos追上checkpoint，就意味着redo log文件满了，这时MySQL不能再执行新的更新操作，也就是MySQL会发生阻塞（因此针对并发量大的系统，适当增大redo log文件的大小非常重要），此时会停下来将Buffer Pool中的脏页刷新到磁盘中，然后标记redo log哪些记录可以被擦除，接着对旧的redo log记录进行擦除，等擦除完旧记录腾出空间，checkpoint就会往后移动，MySQL恢复正常运行，继续执行新的更新操作

## 4.为什么需要binlog？

前面的undo log和redo log都是InnoDB存储引擎生成的日志

MySQL在完成一条更新操作后，Server层还会生成一条binlog，等之后事务提交的时候，会将事务执行过程中产生的所有binlog统一写入binlog文件

**binlog文件记录了所有数据库表结构变更和表数据修改的日志，不会记录查询类的操作**

> 为什么有了binlog，还要redo log？
>
> 因为最开始MySQL只有MyISAM引擎，没有InnoDB引擎，但是MyISAM没有crash-safe的能力，binlog日志只能用于归档
>
> 而InnoDB是另外一个公司以插件的形式引入MySQL的，既然只依靠binlog是没有crash-safe能力的，所以InnoDB使用redo log来实现crash-safe能力

### redolog 和 binlog有什么区别？

Redolog 和 binlog有四个区别：

1. 适用对象不同：

    1. binlog 是MySQL的Server层实现的日志，所有的引擎都可以使用

    2. redolog 是InnoDB存储引擎实现的日志

2. 文件格式不同：

    1. binlog有3种格式类型，分别是STATEMENT、ROW、MIXED区别如下：

        1. STATEMENT：每一条修改数据的SQL都会记录到binlog中（相当于记录了逻辑操作，所以针对这种格式，binlog可以称为逻辑日志）

        2. ROW：

        3. MIXED：

    2. redolog是物理日志，记录的是在某个数据页做了什么修改。

3. 写入方式不同：

    1. binlog是追加写，写满一个文件，就创建一个新文件继续写，不会覆盖以前的日志，保存的是全量的日志

    2. redolog是循环写，日志空间大小是固定的，全部写满从头开始，保存未被刷入磁盘的脏页日志

4. 用途不同：

    1. binlog用于备份恢复，主从复制

    2. redolog用于掉电等故障恢复


> 不小心整个数据库的数据删除了，能用redo log文件恢复数据吗？

不可以使用redo log文件恢复，只能使用binlog文件恢复

因为redo log文件是循环写，是会边写边擦日志的，只记录未被刷入磁盘的数据的物理日志，已经刷入磁盘的数据都会被从redolog文件里擦除

binlog文件保存的是全量的日志，也就是保存了所有数据变更的情况，理论上只要记录在binlog上的数据，都可以恢复

### 主从复制是怎么实现的？

MySQL的主从复制依赖于binlog，记录MySQL上的所有变化以二进制形式保存在磁盘上，复制的过程就是将binlog中的数据从主库传输到从库上

这个过程一般是**异步的**

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=MDY1NzhiNGE0NTI2OTVmZWRhMzAyNTBhMzA5MDk2MjZfNzR1V3ZUR1JJdEUyZVd0WGFJSDVvQjJ2aFJadnhjWmlfVG9rZW46UWFwTGJoaldrb1NSV0Z4SFp0bWNIZkU3bkNnXzE3MjE4NDExMjk6MTcyMTg0NDcyOV9WNA)

MySQL集群的主从复制过程大致三阶段：

- 写入binlog：主库写binlog日志，提交事务，并更新本地存储数据

- 同步binlog：把binlog复制到所有从库上，每个从库把binlog写到暂存日志中

- 回放binlog：回放binlog，并更新存储引擎中的数据


具体详细过程如下：

- MySQL 主库在收到客户端提交事务的请求之后，会先写入 binlog，再提交事务，更新存储引擎中的数据，事务提交完成后，返回给客户端“操作成功”的响应。

- 从库会创建一个专门的 I/O 线程，连接主库的 log dump 线程，来接收主库的 binlog 日志，再把 binlog 信息写入 relay log 的中继日志里，再返回给主库“复制成功”的响应。

- 从库会创建一个用于回放 binlog 的线程，去读 relay log 中继日志，然后回放 binlog 更新存储引擎中的数据，最终实现主从的数据一致性。


![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmY5YWQzYmMzOTExMzJhNThjODQ5YmZiYzI2ZDI2MDhfanhNN1VMQUFueUNoQmdUSW81eGRlVFlIWmxVSlhrTTBfVG9rZW46R3E3SmJ3TjdYb21hTTB4SnBjaGNYTHpVblJlXzE3MjE4NDExMjk6MTcyMTg0NDcyOV9WNA)



> 从库是不是越多越好

不是，从库的数据增加，从库连接上来的I/O线程就越多，**主库建立同样多的log dump线程来处理复制的请求，对主库资源消耗比较高，同时还限制于主库的网络带宽**

在实际使用中，一般一主跟2~3从库

> MySQL主从复制还有哪些模型

- 同步复制

- 异步复制

- 半同步复制


### binlog是什么时候刷盘？





## 5.为什么需要两阶段提交？



### 两阶段提交的过程是怎样的？



### 重启异常会出现什么现象？