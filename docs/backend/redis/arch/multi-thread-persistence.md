# Redis 多线程持久化 <Badge type="tip" text="Redis Multi Thread Persistence" />

Redis多线程模型

redis一开始就是基于单线程模型，Redis里所有的数据结构都是非线程安全，规避了数据竞争问题，使得Redis对各种数据结构的操作非常简单

> redis选择单线程的核心原因是Redis都是内存操作，CPU处理都非常快，瓶颈更容易出现在I/O而不是CPU，所以选择了单线程模型

随着数据量的增大，redis的瓶颈更容易出现在I/O而不是CPU

因为上述情况，Redis选择了引入多线程来处理网络I/O，这样即保持了Redis核心的单线程处理价格，又引入了多线程解决提高网络I/O的性能