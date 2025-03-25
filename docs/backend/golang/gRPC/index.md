## gRPC

> gRPC 可以使用协议缓冲区作为其接口定义语言(IDL)以及其底层消息交换格式

官方文档 ==> [grpc.io/docs](https://grpc.io/docs/)

### gRPC 简介

gRPC 是一个高性能、开源和通用的 RPC 框架，可用于开发连接任何计算机的应用程序。
它基于 HTTP/2 协议，使用 Protocol Buffers 作为其接口定义语言(IDL)以及其底层消息交换格式。
在 gRPC 中，客户端可以直接调用位于不同机器上的服务器应用程序，就像它是本地应用程序一样。
这使得构建分布式应用程序变得容易，同时也提高了开发效率和可维护性

与许多RPC系统一样，gRPC基于定义服务、指定可以远程调用的方法机器参数和返回类型

gRPC客户端和服务端可以在各种环境中运行和相互通信，即使使用了不同的编程语言

默认情况下，gRPC使用 Protocol Buffers 作为其接口定义语言(IDL)以及其底层消息交换格式，这是以一个`.proto`扩展名的普通文本中实现：

1. 定义想要序列化的数据定义结构

```proto
message Person {
  string name = 1;
  int32 id = 2;
  bool has_ponycopter = 3;
}
```

2. 定义gRPC服务，将RPC方法参数和返回类型映射到数据定义结构

```proto
// The greeter service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

gRPC 使用 protoc 与特殊的 gRPC 插件来从 proto 文件生成代码


### gRPC 核心概念