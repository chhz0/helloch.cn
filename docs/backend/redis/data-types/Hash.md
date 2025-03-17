---
prev:
  text: 'Redis - Sets'
  link: '/backend/redis/data-types/Sets'
next:
  text: 'Redis - ZSet'
  link: '/backend/redis/data-types/ZSet'
---
## Redis< Hash > <Badge type="tip" text="Redis Hash" />

Redis Hash 是结构化为字段值(field)->值(value)集合的记录类型. 可以使用`Hash`来表示基础对象并存储计数器分组.

> 创建的`Hash`数量没有实际限制，除了受到可用内存的限制，
> 但是每个`Hash`最多可以存储 4,294,967,295 (2^32 - 1) 个字段值对

`Hash`可以很方便的表示对象

### Hash 命令

Hash常用命令：

- 创建：`HSET`, `HSETNX`
  - `HSET key field value` # 为集合对于field设置value，可以一次设置多个field-value
  - `HSETNX key field value` # 如果field不存在，则为集合对应field设置value数据
- 查询：`HGETALL`, `HGET`, `HLEN`, `HSCAN`
  - `HGETALL key` # 查找全部数据
  - `HGET key field` # 查找某个key（field）
  - `HLEN key` # 查找Hash中元素总数
  - `HSCAN key cursor [MATCH pattern] [COUNT count]` # 从指定位置查询一定数量的数据，这里注意如果是小数据量下，处于ZIPLIST时，COUNT不管填多少，都是返回全部，因为ZIPLIST本身就用于小集合，没必要切分几段返回
- 更新：`HSET`, `HSETNX`, `HDEL`
  - `HDEL key field [field ...]` # 删除指定field，可以一次删除多个
- 删除：`DEL`
  - `DEL key [key ...]` # 删除Hash对象

### Hash 编码(底层实现)

Hash底层有两个编码方式：`ZIPLIST`, `HASHTABLE`

- `ZIPLIT`编码需要满足以下条件:
  - Hash对象保存的所有值和键的长度都小于64字节
  - Hash对象保存元素对象小于512个

当Hash的底层编码为`ZIPLIST`时，即数量较少时将数据紧凑排列，对应到Hash，就是将`field-value`当作`entry`存放进`ZIPLIST`.

如果Hash的底层编码为`HASHTABLE`时，与上面的Set（无序列表）使用HASHTABLE，区别在于在Set中Value始终为null，但是在Hash中，具有对应的值.

> [!NOTE] 编码详解
> 🔗 [查看HASHTABLE编码](./encoding/hashtable.md)