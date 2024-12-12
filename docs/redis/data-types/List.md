---
prev:
  text: '数据类型 - String'
  link: 'redis/data-types/String'
next:
  text: '数据类型 - Set'
  link: '/redis/data-types/Set'
---
# List <Badge type="tip" text="Redis List" />

Redis List是一组了解起来的字符串集合，作为一个列表存储，属于比较底层的数据结构，可以使用的场景非常多，比如存储一批任务数据，存储一批消息.

## List 命令

常用操作：创建、查询、更新、删除
- 创建 --> `LPUSH`, `RPUSH`
  - LPUSH key value [value ...] 从头部增加元素，返回List中元素总数
  - RPUSH key value [value ...] 从尾部增加元素，返回List中元素总数
- 查询 --> `LLEN`, `LRANGE`
  - LLEN 查看List的长度，即List中元素的总数
  - LRANGE key start stop 查看start到stop为角标的元素
- 更新 --> `LPUSH`, `RPUSH`, `LPOP`, `RPOP`, `LREM`
  - LPOP key 移除并获取列表的第一个元素
  - RPOP key 移除并获取列表的第一个元素
  - LREM key count value 移除值等于value的元素
    count = 0 ，则移除所有等于value的元素；
    count > 0 ，则从左到右开始移除count个value元素；
    Count < 0，则从右往左移除count个元素
- 删除 --> `DEL`, `UNLINK`
  - DEL key [key ...] 删除对象，返回值为删除成功了几个键
  - UNLIKN key [key ...] 删除对象，返回值为删除成功了几个键

> del命令与unlink命令均为删除对象，不同的是del命令是同步删除目录，会阻塞客户端，直到删除完成；
>
> unlink命令是异步删除命令，只是取消key在键空间的关联，让其不在能查到，删除是异步进行，所以不会阻塞客户端

## List 编码(底层实现)