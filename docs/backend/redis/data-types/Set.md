---
prev:
  text: 'Redis - List'
  link: '/backend/redis/data-types/List'
next:
  text: 'Redis - Hash'
  link: '/backend/redis/data-types/Hash'
---
## Redis< Set > <Badge type="tip" text="Redis Set" />

Redis Set是一个唯一字符串的集合

适用于：
1. 跟踪唯一目标(e.g., 跟踪访问给定博客的所有唯一IP地址)
2. 表示关系(e.g., 具有给定角色的所有用户集合)
3. 执行常见的集合运算(e.g., 根据集合运算能力获取不同用户的共同信息)

> Redis Set的最大大小为2^32-1(4294967295)

### Set 命令

Set的基本操作有：
- 创建：`SADD`
  - `SADD key member [member ...]` # 添加元素，返回值为成功添加了几个元素
- 查询：`SISMEMBR`, `SCARD`, `SMEMBERS`, `SSCAN`, `SINTER`, `SUNION`, `SDIFF`
  - `SISMEMBER key member` # 查询元素是否存在
  - `SCARD key` # 查询集合元素个数
  - `SMEMBERS key` # 查看集合的所有元素
  - `SSCAN key cursor[MATCH pattern][COUNT count]` # 查看集合元素，可以理解为指定游标进行查询，可以指定个数，默认为10
  - `SINTER key [key ...]` # 返回在第一个集合，同时在后面所有集合都存在元素
  - `SUNION key [key ...]` # 返回所有集合的并集，集合个数大于等于2
  - `SDIFF key [key ...]` # 返回第一个集合有，且后续集合中不存在的元素，结合个数大于等于2，注意
- 更新：`SADD`, `SREM`
  - `SADD` -- > 参考上文
  - `SREM key  member [member ...]` # 删除元素，返回值为成功删除几个元素
- 删除：`DEL`
  - `DEL key` 删除元素

::: tip 详细Set命令
🔗 [Set命令列表](https://redis.io/docs/latest/commands/?group=set)
:::

### Set 编码(底层实现)

Redis Set的底层编码是: `INTSET`, `HASHTABLE`

- `INTSET`：存储元素为整数，且元素数量不超过52个，其结构如下
```text
<encoding> <length> <contents>

<contents> --> <value1><value2>...
```
可以看到`INTSET`的结构排列紧凑，内存占用少，查询的时候使用**二分查找**，之所以使用二分查找是因为`INTSET`存储的元素是排序的，且元素个数不多，但是对于Redis Set来说，应该将`INTSET`编码下的元素视为无序，不应该依赖其有序性，整体上应该当初无序来使用

- `HASHTABLE`：是一个哈希表，查询一个元素的性能很高，在O(1)时间复杂度情况下返回元素.

> 值得注意的是Redis Hash使用的底层编码也有`HASHTABLE`

Set 使用`HASHTABLE`编码时，只存储键，不存储值，因而其key永远指向`NULL`
![redis-encoding-hashtable](/redis/redis-encoding-hashtable.drawio.svg)

> [!NOTE] 编码详解
> 🔗 [查看HASHTABLE编码](./encoding/hashtable.md)