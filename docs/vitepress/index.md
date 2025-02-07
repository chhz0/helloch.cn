## 关于vitepress

::: details 点击查看vitepress相关
## 开始使用 vitepress
本站目前使用vitpress的默认主题.

> 推荐阅读
> [vitepress文档](https://vitepress.dev/zh/guide)

## vite 文件结构

```text
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```
`docs`目录是VitePress站点的根目录，文章内容将存放在此。`vitepress`配置文件在`docs/.vitepress`目录下，该目录下包含配置文件`config.js`或者`config.mts`，该文件是VitePress站点的配置文件，以及开发服务器的缓存、构建输出和可选主题自定义代码的位置。

在`docs`目录下的每个`.md`文件，都会在相同的路径下被编译成`.html`文件，`docs`目录将作为根路径`/`

## vitepress 路由

vitepress的路由是基于文件的路由，根据docs目录下的md文件映射对应的路由。
不同的目录层级，其下的`index.md`将作为该目录的'首页'，例如路径为`/docs/guide/index.md`将解析为`/guide/`即可访问

生成后的HTML可以托管在任何支持静态文件的Web服务器上


### 项目根目录 && 源目录
路由的映射规则依赖于`项目根目录`，也就是`.vitepress`目录，启动vitepress项目时，使用命令`vitepress dev docs`，将会以`docs`目录为项目根目录，寻找到`.vitepress`目录，启动服务，`docs`作为路由的根路径`/`

源目录是`md`源文件所处的位置。默认情况下其与项目根目录一致，但可以通过`srcDir`配置项来修改源目录，配置后将以`srcDir`配置项的值作为路由的根路径`/`

## vitepress cli
> 推荐阅读
> [vitepress/cli文档](https://vitepress.dev/zh/reference/cli)

## 配置文件-config.js

> 推荐阅读
> [vitepress/site-config文档](https://vitepress.dev/zh/reference/site-config)

:::