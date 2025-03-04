---
prev:
  text: 'MySQL - 索引类型'
  link: '/mysql/mysql-index'
next:
  text: 'MySQL - 锁'
  link: '/mysql/mysql-lock'
---

# MySQL事务 <Badge type="tip" text="MySQL Transaction" />

## 1.事务有哪些特征

原子性，隔离性，一致性，持久性

- 原子性：要么全做，要么全不做

- 隔离性：保证其它的状态转换不会影响到本次状态的转

- 一致性：数据全部符合现实世界的约束

- 持久性： 更新后的数据存储到磁盘


InnoDB引擎通过以下技术来保证事务的四个特性

1. 持久性是通过 redo log（重做日志）来保证

2. 原子性是通过 undo log（回滚日志）来保证

3. 隔离性是通过 mvcc（多版本并发控制）或者锁机制来保证

4. 一致性是通过持久性+原子性+隔离性来保证


## 2.并发事务会引发的问题

MySQL服务端是允许多个客户端连接，这意味着MySQL会出现同时处理多个事务的情况

在同时处理多个事务的时候，可能会出现脏读、不可重复读、幻读的问题

- 脏读：一个事务读到了另一个**未提交事务修改过**的数据

- 不可重复读：在一个事务中多次读取同一个**数据**，出现前后两次读到的数据不一样的情况

- 幻读：在一个事务中多次查询某个符合查询条件的**记录数量**，如果出现前后两次查询到的记录数据不一样的情况


以上三个现象，问题的严重性是 脏读 > 不可重复读 > 幻读

## 3.事务的隔离级别

四种隔离级别：

1. 读未提交：指一个事务还没有提交时，它做的变更就能被其他事务看到

2. 读提交：指一个事务提交之后，它做的变更才能被其他事务看到

3. 可重复读：指一个事务执行过程中看到的数据，一直跟这个事务启动时看到的数据是一致的，**MySQL** **InnoDB引擎的默认隔离级别**

4. 串行化：对记录加上读写锁，在多个事务对这条记录进行读写操作时，如果发生读写冲突的时候，后访问的事务必须等前一个事务执行完成


> 按隔离水平高低排序如下：
>
> 串行化 > 可重复读 > 读已提交 > 读未提交

针对不同的隔离级别：并发事务时可能发生的现象也不同

- 读未提交：脏读、不可重复读、幻读

- 读提交：不可重复读、幻读

- 可重复读：幻读

- 串行化：


可重复读的隔离级别下，可以**很大程度上避免**幻读现象的发生，所以MySQL不使用串行化隔离级别来避免幻读现象的发生，因为**串行化隔离级别会影响性能**

InnoDB在默认隔离级别：**可重复读**的情况下很大程度上解决幻读现象的解决方案有两种：

- 针对**快照读（普通 select 语句），**是通过MVCC方式解决幻读

- 针对**当前读（select ... for update），**通过next-key lock（记录锁+间隙锁）方式解决了幻读


四种隔离事务是怎么实现的

- 对于读未提交：可以读到未提交事务修改的数据，所以直接读取就行

- 对于串行化，通过加读写锁的方式来避免并行访问

- 对于读提交和可重复读这两种隔离级别的事务，是通过Read View来实现的，它们的区别是在于创建Read View时，读提交隔离级别是在每个语句执行之前都会重新生成一个Read View；而可重复读隔离级别是启动事务时生成一个Read View，然后整个事务都在用这个Read View


在执行开启事务命令，并不意味着启动了事务：

在MySQL中，开启事务有两种命令，分别是：

- `begin/start transaction`，执行命令后，并不意味着事务启动，只有执行了第一条select语句，才是事务真正启动的时机

- `start transaction with consistent snapshot`，马上启动事务


## Read View在MVCC中是如何工作的？

Read View的四个字段

```Plain
<creator_trx_id> <m_ids> <min_trx_id> <max_trx_id>
```

- `creator_trx_id`:创建该Read View的事务的事务id

- `m_ids`:指创建Read View时，当前数据库中活跃事务的事务id列表

- `min_trx_id`:生成ReadView时系统中活跃的事务中最小的事务id，即`m_ids`中的最小的事务id，也是表示活跃的事务最早的那个

- `max_trx_id`:表示生成ReadView时系统中应该分配给下一个事务的id值


这里还需要了解聚簇索引记录中的两个隐藏列，`trx_id`和`roll_pointer`

- `trx_id`，当一个事务对某条聚簇索引进行改动时，会把该事务的事务id记录在`trx_id`隐藏列中

- `roll_pointer`，这个隐藏列是指针，指向每一个旧版本记录


有了ReadView，以及undo log，在访问某条记录的时，按照以下步骤进行判断：

1. `trx_id` == `creator_trx_id` ，意味着当前事务在访问自己修改过的记录，可以访问

2. `trx_id` < `min_trx_id` ，表明生成该版本的事务在当前事务生成Read View前已经提交，可以访问

3. `trx_id` > `max_trx_id` ，表明生成该版本的事务在当前事务生成Read View后才开启，不可以访问

4. `min_trx_id` < `trx_id` < `max_trx_ix` ，还需要再进一步判断

    1. `trx_id` 存在 `m_ids` 中，说明创建Read View时生成该版本的事务还是活跃的，不可以访问

    2. `trx_id` 不在 `m_ids` 中，说明创建Read View时生成该版本的事务已经提交了，可以访问


> Read COMMITTD、REPETABLE READ这两种隔离级别的一个很大不同：生成ReadView的时机不同，REAED COMMITTD在每一次进行普通select操作前都会生成一个ReadView，而REPEATABLE READ只在第一次进行普通SELECT操作前生成一个ReadView，之后的查询操作都重复使用这个ReadView，不会再生成一个新的ReadView

这种通过「版本链」来控制并发事务访问同一个记录时的行为就叫 MVCC（多版本并发控制）。

## 可重复读是如何工作的？

可重复读隔离级别是启动事务时生成一个Read View，然后整个事务期间都在用这个Read View

如果某个事物开启后，去读取记录，发现记录的`trx_id` 比自己事物id小且在活跃的事物id列表里面有该事务id，那么该事务不会读取该版本的记录，而是沿着undo log链条往下找旧版本的记录，直到找到trx_id比事务b小的min_trx_id值的第一条记录

## 读提交是如何工作的？

读提交隔离事件在每次读取数据的时候，都会生成一个新的Read View
