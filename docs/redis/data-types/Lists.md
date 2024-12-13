---
prev:
  text: '数据类型 - String'
  link: 'redis/data-types/Strings'
next:
  text: '数据类型 - Sets'
  link: '/redis/data-types/Sets'
---
# Lists <Badge type="tip" text="Redis List" />

Redis List是一组连续的字符串值**链表**，这意味着向List的头部或者尾部中添加新元素的操作会在恒定的时间内完成，
无论其已经存储了多少元素，但是缺点是访问元素的操作则需要遍历List，时间复杂度为O(N)

Redis List经常用于:
- 实现堆栈和队列
- 为后台系统构建队列管理

## Lists 命令

常用命令:
- 创建 --> `LPUSH`, `RPUSH`
  - `LPUSH key value [value ...]` # 从头部增加元素，返回List中元素总数
  - `RPUSH key value [value ...]` # 从尾部增加元素，返回List中元素总数
- 查询 --> `LLEN`, `LRANGE`
  - `LLEN` # 查看List的长度，即List中元素的总数
  - `LRANGE key start stop` # 查看start到stop为角标的元素
- 更新 --> `LPUSH`, `RPUSH`, `LPOP`, `RPOP`, `LREM`
  - `LPOP key` # 移除并获取列表的第一个元素
  - `RPOP key` # 移除并获取列表的第一个元素
  - `LREM key count value` # 移除值等于value的元素
    - count = 0 ，则移除所有等于value的元素；
    - count > 0 ，则从左到右开始移除count个value元素；
    - count < 0，则从右往左移除count个元素
- 删除 --> `DEL`, `UNLINK`
  - `DEL key [key ...]` # 删除对象，返回值为删除成功了几个键
  - `UNLIKN key [key ...]` # 删除对象，返回值为删除成功了几个键

> del命令与unlink命令均为删除对象，不同的是del命令是同步删除目录，会阻塞客户端，直到删除完成；
> unlink命令是异步删除命令，只是取消key在键空间的关联，让其不在能查到，删除是异步进行，所以不会阻塞客户端.

List还支持多个阻塞命令：`BLPOP`, `BLMOVE`...
- `BLPOP` # 从列表头部删除并返回一个元素。如果列表为空，则该命令将阻塞，直到有元素可用或达到指定的超时为止.
- `BMOVE` # 以原子方式将元素从源列表移动到目标列表。如果源列表为空，该命令将阻塞，直到有新元素可用.

::: tip 详细List命令
🔗 [Lists命令列表](https://redis.io/docs/latest/commands/?group=list)
:::

## Lists 编码(底层实现)

在`Redis.Version < 3.2`时，List的编码为`ZIPLIST`或`LINKEDLIST`，在`Redis.Version >= 3.2`时，List的编码为`QUICKLIST`，当`Redis.Version >= 7.0`后，`ZIPLIST`优化为`LISTPACK`，其本质也是一种压缩列表.

List对象保存的所有字符串长度都小于64字节，且对象元素个数少于512个时，使用`ZIPLIST`编码，否则使用`LINKEDLIST`编码.

ZIPLIST的底层使用压缩列表实现，内存排序紧凑，可以有效节省内存空间.

> [!NOTE] 编码详解
> 🔗 [查看ZIPLIST编码](./encoding-zip-list.md)

如果使用`LINKEDLIST`编码，是以链表的形式连接，在内存上不如`ZIPLIST`紧凑，所以只有在List元素个数或者节点长度比较大的时候，才会使用`LINKEDLIST`编码.

`LINKEDLIST`是以牺牲内存换取更快的处理性能.

```c
typedef struct list {
    listNode *head;
    listNode *tail;
    void *(*dup)(void *ptr);
    void (*free)(void *ptr);
    int (*match)(void *ptr, void *key);
    unsigned long len;
} list;
```

在Redis 3.2版本只会，引入了`QUICKLIST`编码. `QUICKLIST`编码是`ZIPLIST`和`LINKEDLIST`的结合体，`LINKEDLIST`原先的节点存放数据，现在单个节点存放的是一个`ZIPLIST`.

- 当数据较少时，`QUICKLIST`的节点只有一个，相当于一个`ZIPLIST`.
- 当数据较多时，则同时利用`ZIPLIST`和`LINKEDLIST`的优点.

![redis-quicklist-map](../../public/redis/redis-quicklist-map.drawio.svg)