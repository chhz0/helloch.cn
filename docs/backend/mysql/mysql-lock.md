---
prev:
  text: 'MySQL - 事务'
  link: '/mysql/mysql-transaction'
next:
  text: 'MySQL - 日志'
  link: '/mysql/mysql-log'
---

# MySQL锁 <Badge type="tip" text="MySQL Lock" />

## 锁的类型

Mysql的锁，根据加锁的范围可以分为全局锁、表级锁和行锁三类

### 全局锁

要使用全局锁，执行下面这条命令：

```C
flush tables with read lock
```

执行之后，整个数据库就处于只读状态，这时其他线程执行以下操作，就会被阻塞

- 对数据的增删改，比如insert、delete、update等

- 对表结构的更改操作，比如alter table、drop table等


要释放全局锁，执行下面的命令：

```C
unlock tables
```

> 全局锁的应用场景：
>
> 全局锁主要用于做**全库逻辑备份**，这样在备份数据库期间，不会因为数据或者结构的更新，而出现备份文件的数据与预期的不一样

加全局锁带来的缺点：会导致业务停滞，因为加全局锁之后，整个数据库都只是只读状态，不能更新数据

可以通过开启事务，在可重复读的隔离级别下，即使其他事务更新了表的数据，也不会影响备份数据库时的Read View，

备份数据库的工具是`mysqldump` ，在使用mysqldump时加上`-single-transaction` 参数的时候，就会在备份数据库之前开启事务

### 表级锁

MySQL里面表级锁有以下几种：

- 表锁

- 元数据锁（MDL）

- 意向锁

- AUTO-INC锁


#### 表锁

使用下面的命令对表加锁和释放锁

```C
// 加读锁
lock tables <table_name> read;
// 写锁
lock tables <table_name> write;

// 释放锁
unlock tables;
```

表锁会影响别的线程和本线程的读写操作

#### 元数据锁（MDL）

对于MDL，我们不需要显示使用，因为当我们在对数据库进行操作时，会自动给这个表上加MDL：

- 对一张表进行CURD操作时，加的是MDL读锁

- 对一张表做结构变更操作的时候，加的是MDL写锁


MDL是为了保证当前用户对表执行CRUD操作时，防止其他线程对这个表结构做了变更

MDL是在事务提交之后才会释放，这意味着**事务执行期间，MDL是一直持有**

需要注意的是，在事务启用之后，如果事务A没有提交，此时如果有表结构的修改请求发起，就会发生阻塞，这个阻塞也会导致其他CURD的请求被阻塞住

这是因为申请MDL锁的操作会形成一个队列，队列中**写锁****获取优先级大于****读锁**，一旦出现MDL写锁等待，会阻塞该表后续的CRUD操作

#### 意向锁

- 在使用InnoDB引擎的表里对某些记录加上共享锁之前，需要先在表级别加上一个意向共享锁

- 在使用InnoDB引擎的表里对某些记录加上独占锁之前，需要先在表级别加上一个意向独占锁


在执行insert、update、delete操作时，需要先对表上加 意向独占锁，然后对该记录加独占锁

而普通的select是不会加行级锁，普通的select语句是利用MVCC实现一致性读，是无锁的

```C
// select也是可以对记录加共享锁和独占锁，

// 先在表上加上意向共享锁，然后对读取的记录加共享锁
select ... lock in share mode;
// 先表上加上意向锁，然后再读取记录加独占锁
select ... for update
```

意向锁的目的是为了快速判断表里是否有记录被加锁

#### AUTO-INC锁

表里面的主键通常设置成自增的，在插入数据时，可以不指定主键的值，数据库会自动给主键赋值递增的值，这主要是通过**AUTO-INC锁**实现的

Auto-Inc锁是特殊的表锁机制，不是在一个事务提交后才释放，而是再执行完插入语句后就会立即释放



### 行级锁

InnoDB引擎是支持行级锁的，而MyISAM引擎并不支持行级锁

行级锁的类型主要有三类：

- Record Lock，记录锁，也就是仅仅一条记录锁上

- Gap Lock，间隙锁，锁定一个范围，但不包含记录本身

- Next-key Lock，Rocord Lock + Gap Lock的组合，锁定一个范围，并且锁定记录本身


#### Record Lock 记录锁

Record Lock称为记录锁，锁住的是一条记录。而且记录锁也有s锁和x锁之分

#### Gap Lock 间隙锁

Gap Lock称为i而间隙锁，只存在于可重复隔离级别，目的是为了解决可重复读级别下幻读的现象

间隙锁之间是兼容的，即两个事务可以同时持有包含共同间隙范围的间隙锁，并不会存在互斥关系，因为间隙锁的目的是防止插入幻影记录而提出

#### Next-key

Next-key Lock成为临键锁，是Record Lock + Gap Lock的组合，锁定一个范围，并且锁定记录本身

Next-key Lock是包含间隙锁+记录锁，如果一个事务获取了X型的next-key lock，那么另外一个事务在获取相同范围的X型的next-key lock时，是会被阻塞的

#### 插入意向锁

在一个事务插入一条记录的时候，需要判断插入的位置释放已被其他事务加了间隙锁（next-key lock 也包含间隙锁）。

如果有，插入操作就会阻塞，直到间隙锁被释放，在此期间会生成一个插入意向锁，表明有事务想在某区域插入新记录，但是处于等待状态



## MySQL加锁

InnoDB引擎是支持行级锁，而MyISAM是不支持行级锁，了解Mysql是怎么加行级锁，其实也是说InnoDB引擎是怎么加锁的。

普通select语句是不会对记录加锁（除了串行化隔离级别），因为它属于快照读，是通过MVCC（多版本并发控制）实现的

对查询时对记录加行级锁，可以使用下面两种方式，这两种查询会加锁的语句叫做锁定读

```C
// s lock
select ... lock in share mode;
// x lock
select ... for update;
```

上面两个语句必须在事务中，因为当事务提交了，锁就释放。

除了上面两条锁定读语句会加行级锁之外，update和delete操作都会加行级锁，且锁定类型都是独占锁(X)

```C
update table ...
delete from table ...
```

x型锁和s型锁之间的兼容型未读读共享，读写互斥

|   |   |   |
|---|---|---|
||X|S|
|X|不兼容|不兼容|
|S|不兼容|兼容|

- 行级锁

    - 读已提交隔离级别下，行级锁的种类只有记录锁，也就是仅仅一条记录锁上

    - 可重复读隔离级别下，行级锁的种类除了记录锁，还有间隙锁（目前是为了避免幻读


在执行commit后，事务过程中生成的锁都会被释放

### MySQL是怎么加行级锁的？

行级锁加锁规则复杂，目前仅保留了解程度

[MySQL 是怎么加锁的？](https://xiaolincoding.com/mysql/lock/how_to_lock.html#mysql-%E6%98%AF%E6%80%8E%E4%B9%88%E5%8A%A0%E8%A1%8C%E7%BA%A7%E9%94%81%E7%9A%84)

总结1：在能够使用记录锁或者间隙锁就能避免幻读的现象的场景下，next-key lock就会退化成为记录锁或间隙锁



## Mysql死锁

使用引擎为InnoDB，隔离级别为可重复读（RR）

### 死锁的发生

有表如下：

```SQL
create table `t_order` (
    `id` int not null auto_increment,
    `order_no` int default null,
    `create_date` datetime default null,
    primary key(`id`),
    key `index_order` (`order_no`) using btree
) engine = InnoDB;
```

有两个事务，一个事务要插入订单1007，另外一个事务也要插入订单1008，因为需要对订单做幂等性校验，所以两个事务先要查询订单是否存在，不存在才插入记录

![](https://rt5bap83jl.feishu.cn/space/api/box/stream/download/asynccode/?code=MmJiOGNmNWJiMTM5NzQyMTY0ODkzMmVhZDA1YmExYThfb3lZOUdkVWNia0FMOFllSWlMWnlUM3dKY2JUekFvVDJfVG9rZW46UGl6aGJaY0Izb2JzNFF4SUVGWWNKWnB4bkF6XzE3MjE4NDExMTQ6MTcyMTg0NDcxNF9WNA)

这里两个事务都陷入阻塞（_**前提是没有打开死锁检测**_），也就是发生了死锁，都在互相等待对方释放锁

### 死锁的产生

可重复隔离级别下，是存在幻读的问题

InnoDB引擎为了解决可重复读隔离级别下的幻读问题，就引出了next-key锁，它是**记录锁和间隙锁的组合**

- Record Lock，记录锁，锁的是记录本身

- Gap Lock，间隙锁，锁的是两个值之间的空隙，以防止其他事务在这个空隙间插入新的数据，从而避免幻读


普通的select是通过mvcc实现的快照读，不会对记录进行加锁，如果要在查询的时候加行锁，可以使用下面的两种方式

```Plain
 begin;
 // 对读取的记录加共享锁
 select ... lock in share mode;
 commit;

 begin;
 // 对读取的记录加排他锁
 select ... for update;
 commit;
```

**行锁的释放时机是在事务提交（commit）后，锁才会释放**，并不是在一条语句执行完毕之后释放锁

```SQL
select * from performance_schema.data_lock\G;
```

执行以上的语句，可以查看事务执行SQL过程中加了什么锁

`LOCK_TYPE` 中的RECORD表示行级锁，通过`LOCK_MODE` 可以确认是next-key锁，间隙锁还是记录锁

- LOCK_MODE: `X` ，说明是X型的next-key锁；

- LOCK_MODE: `X, REC_NOT_GAP` ，说明是X型的记录锁；

- LOCK_MODE: `X, GAP` ，说明是X型的间隙锁；


当事务B往事务A next-key锁的范围插入记录时，就会被锁住

**执行插入语句时，会在插入间隙上获取插入****意向锁****，而插入意向锁与间隙锁是冲突的，所以当其它事务持有该间隙的间隙锁时，需要等待其它事务释放间隙锁之后，才能获取到插入意向锁。而间隙锁与间隙锁之间是兼容的，所以两个事务中****`select ... for update`** **语句并不会相互影响。**

这样，事务A和事务B在执行完`select ... for update` 语句之后都持有了间隙锁，而接下来的`insert` 操作为了获取到插入意向锁，都在等待对方事务的间隙锁释放，于是就造成了循环等待，导致死锁。

> 为什么间隙锁和间隙锁之间是兼容的？
>
> MySQL官网上有描述：
>
> _Gap_ _locks in InnoDB are “purely inhibitive”, which means that their only purpose is to prevent other transactions from Inserting to the gap. Gap locks can co-exist. A gap lock taken by one transaction does not prevent another transaction from taking a gap lock on the same gap. There is no difference between shared and exclusive gap locks. They do not conflict with each other, and they perform the same function._
>
> 间隙锁的意义只在于阻止区间被插入，因此可以共存。**一个事务获取的间隙锁不会阻止另外一个事务获取同一个间隙范围的间隙锁，**共享和排他的间隙锁是没有区别的，它们相互不冲突，且功能相同，即两个事务可以共同持有包含共同间隙的间隙锁

共同间隙包括两种场景：

- 两个间隙锁的间隙区间完全一样

- 一个间隙包含的间隙区间是另外一个间隙锁区间的子集


注意：next-key lock是包含间隙锁+记录锁的，如果一个事务获取了X型的next-key lock，那么另外一个事务在获取相同范围的X型的next-key lock时，是会被阻塞的

再注意：对于右区间为+∞的next-key lock，因为+∞并不是一个真实的记录，所以我不需要考虑X型和S型

> 插入意向锁是什么？
>
> MySQL的描述：
>
> _An Insert_ _intention lock_ _is a type of gap lock set by Insert operations prior to row Insertion. This lock signals the intent to Insert in such a way that multiple transactions Inserting into the same index gap need not wait for each other if they are not Inserting at the same position within the gap. Suppose that there are index records with values of 4 and 7. Separate transactions that attempt to Insert values of 5 and 6, respectively, each lock the gap between 4 and 7 with Insert intention locks prior to obtaining the exclusive lock on the Inserted row, but do not block each other because the rows are nonconflicting._
>
> 这段话表明尽管**插入****意向锁****是一种特殊的间隙锁，但不同于间隙锁的是，该锁只用于并发插入操作。**
>
> 如果说间隙锁锁住的是一个区间，那么插入意向锁锁住的是一个点，因而从这个角度来说，插入意向锁确实是一种特殊的间隙锁

插入意向锁的生成时机：

- 每插入一条新纪录，都需要看一下待插入记录的下一条记录上是否已经被加了间隙锁，如果已加间隙锁，此时会生成一个插入意向锁，如何锁的状态设置为等待状态，现象就是Insert语句会被阻塞（_PS：__MySQL_ _加锁时，是先生成锁结构，然后设置锁的状态，如果锁状态是等待状态，并不是意味着事务成功获取到了锁，只有当锁状态为正常状态时，才代表事务成功获取到了锁_）


### Insert语句是怎么加行级锁的？

Insert语句在正常执行时是不会生成锁结构的，它是靠聚簇索引记录自待的`trx_id` 隐藏列来作为**隐式锁**来保护记录的

> 什么是隐式锁？

当事务需要加锁时，如果这个锁不可能发生冲突，InnoDB会跳过加锁环节，这种机制称为隐式锁

隐式锁是InnoDB实现的一种延迟加锁机制

### 如何避免死锁？

死锁的四个必要条件：

- 互斥

- 占有且等待

- 不可强占用

- 循环等待


只要发生死锁，这些条件必然成立，但是只要破环其中一个条件死锁就不会成立

在数据库层面，有两种策略通过打破循环等待条件来解除死锁状态：

- 设置事务等待锁的超时时间：当一个事务的等待时间超过该值后，就对这个事务进行混滚，于是锁就释放了，另外一个事务就可以继续执行了。在InnoDB中，参数`innodb_lock_wait_timeout` 是用来设置超时时间的，默认时间为50s

- 开启主动死锁检测：主动死锁检测在发现死锁后，主动回滚死锁链条中的某一个事务，让其他事务得以继续执行。将`innodb_deadlock_detect` 设置为on，表示开启这个逻辑，默认就开启。
