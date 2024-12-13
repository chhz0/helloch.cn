---
prev:
  text: '数据类型 - String'
  link: 'redis/data-types/String'
next:
  text: '数据类型 - List'
  link: '/redis/data-types/List'
---
# SDS <Badge type="tip" text="Redis Encoding SDS" />

sds(Simple Synamic String)，简单动态字符串，是redis内部作为基石的字符串封装（很重要）

sds是redis封装字符串结构，用以解决字符串追加和长度计算操作来带的性能瓶颈问题

redis中SDS分为sdshdr8、sdshdr16、sdshdr32、sdshdr64，字段属性一致，区别再对应不同大小的字符串

```c
struct __attribute__((__packed__)) sdshdr8 {
    uint8_t len;   // 使用了多少内部
    uint8_t alloc; // 分配了多少内存
    unsigned char flags; // 标记是什么分类 例如： #define SDS_TYPE_8 1
    char buf[];
}
```

从上面的结构可以看出SDS是怎么解决问题的：
1. 增加len字段，快速返回长度
2. 增加空余空间(alloc - len)，为后续追加数据留余地
3. 不要以'\0'作为判断标准，二进制安全

SDS预留空间大小的规则：alloc = min(len, 1M) + len：
   - len小于1M的情况下，alloc=2*len, 预留len大小的空间
   - len大于1M的情况下，alloc=1M+lne, 预留1M大小的空间