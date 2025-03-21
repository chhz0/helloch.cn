# 更新日志 <Badge type="tip" text="Log" />

> [!NOTE] 
> 日志记录由 [git_commit_2md.py](https://github.com/chhz0/helloch.cn/blob/blog/tools/git_commit_2md.py) 生成，其中部分内部md链接可能因为md文件的删除或者移动导致失效，推荐使用`Ctrl K`搜索文档. 

## `2025-03-21`

### Commit SHA: `251fe29`

**Message**: docs: 新增并更新多个后端文档页面

- 新增 Kafka、Linux、Git 等相关文档页面
- 更新 .gitignore 文件，添加 .obsidian 忽略项
- 优化导航栏配置，调整部分链接路径
- 新增 Git 相关命令和提交规范文档
- 更新 changelog.md，记录最新提交信息
- Markdown Added:
  - [archive/index.md](/archive/)
  - [backend/git/git-README.md](/backend/git/git-README)
  - [backend/git/git-commands.md](/backend/git/git-commands)
  - [backend/git/git-commit-message.md](/backend/git/git-commit-message)
  - [backend/git/index.md](/backend/git/)
  - [backend/linux/index.md](/backend/linux/)
  - [backend/mq/kafka/index.md](/backend/mq/kafka/)
- Markdown Modified:
  - [about/changelog.md](/about/changelog)
  - [backend/algo/index.md](/backend/algo/)
  - [index.md](/)
  - [test.md](/test)

## `2025-03-17`

### Commit SHA: `bc1d328`

**Message**: docs: 重构 Redis 文档结构并优化内容

- 更新文档结构，使其更加清晰和有组织
- 优化标题层级，提高可读性
- 添加新章节，覆盖更多 Redis 相关主题
- 调整内容格式，符合 VitePress 文档规范
- Markdown Added:
  - [backend/redis/arch/multi-thread.md](/backend/redis/arch/multi-thread)
  - [backend/redis/data-types/Hash.md](/backend/redis/data-types/Hash)
  - [backend/redis/data-types/List.md](/backend/redis/data-types/List)
  - [backend/redis/data-types/Set.md](/backend/redis/data-types/Set)
  - [backend/redis/data-types/String.md](/backend/redis/data-types/String)
  - [backend/redis/data-types/encoding/hashtable.md](/backend/redis/data-types/encoding/hashtable)
  - [backend/redis/data-types/encoding/index.md](/backend/redis/data-types/encoding/)
  - [backend/redis/data-types/encoding/sds.md](/backend/redis/data-types/encoding/sds)
  - [backend/redis/data-types/encoding/skiplist.md](/backend/redis/data-types/encoding/skiplist)
  - [backend/redis/data-types/encoding/ziplist.md](/backend/redis/data-types/encoding/ziplist)
- Markdown Modified:
  - [backend/redis/arch/LRU-LFU.md](/backend/redis/arch/LRU-LFU)
  - [backend/redis/arch/index.md](/backend/redis/arch/)
  - [backend/redis/arch/redisDb.md](/backend/redis/arch/redisDb)
  - [backend/redis/arch/single-thread.md](/backend/redis/arch/single-thread)
  - [backend/redis/data-types/Stream.md](/backend/redis/data-types/Stream)
  - [backend/redis/data-types/ZSet.md](/backend/redis/data-types/ZSet)
  - [backend/redis/data-types/index.md](/backend/redis/data-types/)
  - [backend/redis/index.md](/backend/redis/)
  - [index.md](/)
- Markdown Deleted:
  - [backend/redis/arch/multi-thread-persistence.md](/backend/redis/arch/multi-thread-persistence)
  - [backend/redis/data-types/Hashes.md](/backend/redis/data-types/Hashes)
  - [backend/redis/data-types/Lists.md](/backend/redis/data-types/Lists)
  - [backend/redis/data-types/Sets.md](/backend/redis/data-types/Sets)
  - [backend/redis/data-types/Strings.md](/backend/redis/data-types/Strings)
  - [backend/redis/data-types/chhz0.md](/backend/redis/data-types/chhz0)
  - [backend/redis/data-types/encoding-hashtable.md](/backend/redis/data-types/encoding-hashtable)
  - [backend/redis/data-types/encoding-sds.md](/backend/redis/data-types/encoding-sds)
  - [backend/redis/data-types/encoding-skip-list.md](/backend/redis/data-types/encoding-skip-list)
  - [backend/redis/data-types/encoding-zip-list.md](/backend/redis/data-types/encoding-zip-list)

### Commit SHA: `934aaed`

**Message**: feat(docs): 重构首页并添加 TODO 列表

- 重新设计了首页布局，增加了 Projects in Github 和 TODO List 两个新部分
- 添加了新的 GithubRepoCard 组件用于展示 Github 项目
- 实现了可折叠的 TODO 列表，支持多级任务和链接跳转
- 更新了 logo 图片，增加了暗黑模式支持
- 优化了样式，提高了移动端适配性
- Markdown Modified:
  - [index.md](/)
  - [test.md](/test)
- Markdown Deleted:
  - [github.repo.md](/github.repo)

### Commit SHA: `eaf14d0`

**Message**: feat(Caddyfile): update

### Commit SHA: `d9b8188`

**Message**: feat(docs): update

## `2025-03-12`

### Commit SHA: `ea31399`

**Message**: feat(docs): 优化 GitHub Repo Card 组件中的编程语言展示

- 移除编程语言的颜色块，替换为对应的语言图标
- 新增编程语言图标 SVG 文件
- 调整编程语言名称的显示逻辑
- Markdown Modified:
  - [test.md](/test)

## `2025-03-11`

### Commit SHA: `2b415e7`

**Message**: docs: update changelog.md
- Markdown Modified:
  - [about/changelog.md](/about/changelog)

### Commit SHA: `9bb655f`

**Message**: refactor(docs): 重构文档结构并优化主题样式

- 重新整理文档目录结构，将算法、后端等分类调整到合适的位置
- 删除未使用的 ArchiveTimeline 组件
- 新增 TodoList 组件和多个测试组件
- 更新 GithubRepoCard 组件样式
- 引入 tailwindcss 并调整全局样式
- 移除不必要的配置和导入
- Markdown Added:
  - [backend/algo/graph.md](/backend/algo/graph)
  - [backend/algo/index.md](/backend/algo/)
  - [backend/algo/linkedlist.md](/backend/algo/linkedlist)
  - [backend/algo/queue.md](/backend/algo/queue)
  - [backend/algo/stack.md](/backend/algo/stack)
  - [backend/algo/tree.md](/backend/algo/tree)
  - [backend/cangjie/basic-data-type.md](/backend/cangjie/basic-data-type)
  - [backend/cangjie/func.md](/backend/cangjie/func)
  - [backend/cangjie/index.md](/backend/cangjie/)
  - [backend/docker/docker-compose.md](/backend/docker/docker-compose)
  - [backend/docker/docker-deploy.md](/backend/docker/docker-deploy)
  - [backend/docker/docker.md](/backend/docker/docker)
  - [backend/docker/dockerfile-learn.md](/backend/docker/dockerfile-learn)
  - [backend/docker/index.md](/backend/docker/)
  - [backend/golang/grammar/index.md](/backend/golang/grammar/)
  - [backend/golang/index.md](/backend/golang/)
  - [backend/golang/principles/index.md](/backend/golang/principles/)
  - [backend/mysql/index.md](/backend/mysql/)
  - [backend/mysql/mysql-arch.md](/backend/mysql/mysql-arch)
  - [backend/mysql/mysql-buffer-pool.md](/backend/mysql/mysql-buffer-pool)
  - [backend/mysql/mysql-index.md](/backend/mysql/mysql-)
  - [backend/mysql/mysql-lock.md](/backend/mysql/mysql-lock)
  - [backend/mysql/mysql-log.md](/backend/mysql/mysql-log)
  - [backend/mysql/mysql-transaction.md](/backend/mysql/mysql-transaction)
  - [backend/redis/arch/LRU-LFU.md](/backend/redis/arch/LRU-LFU)
  - [backend/redis/arch/index.md](/backend/redis/arch/)
  - [backend/redis/arch/multi-thread-persistence.md](/backend/redis/arch/multi-thread-persistence)
  - [backend/redis/arch/redisDb.md](/backend/redis/arch/redisDb)
  - [backend/redis/arch/single-thread.md](/backend/redis/arch/single-thread)
  - [backend/redis/data-types/Hashes.md](/backend/redis/data-types/Hashes)
  - [backend/redis/data-types/Lists.md](/backend/redis/data-types/Lists)
  - [backend/redis/data-types/Sets.md](/backend/redis/data-types/Sets)
  - [backend/redis/data-types/Stream.md](/backend/redis/data-types/Stream)
  - [backend/redis/data-types/Strings.md](/backend/redis/data-types/Strings)
  - [backend/redis/data-types/ZSet.md](/backend/redis/data-types/ZSet)
  - [backend/redis/data-types/chhz0.md](/backend/redis/data-types/chhz0)
  - [backend/redis/data-types/encoding-hashtable.md](/backend/redis/data-types/encoding-hashtable)
  - [backend/redis/data-types/encoding-sds.md](/backend/redis/data-types/encoding-sds)
  - [backend/redis/data-types/encoding-skip-list.md](/backend/redis/data-types/encoding-skip-list)
  - [backend/redis/data-types/encoding-zip-list.md](/backend/redis/data-types/encoding-zip-list)
  - [backend/redis/data-types/index.md](/backend/redis/data-types/)
  - [backend/redis/index.md](/backend/redis/)
  - [backend/redis/interview/index.md](/backend/redis/interview/)
  - [backend/rust/index.md](/backend/rust/)
  - [frontend/vitepress/api-examples.md](/frontend/vitepress/api-examples)
  - [frontend/vitepress/index.md](/frontend/vitepress/)
  - [frontend/vitepress/markdown-examples.md](/frontend/vitepress/markdown-examples)
  - [frontend/vitepress/template-frontmatter.md](/frontend/vitepress/template-frontmatter)
- Markdown Modified:
  - [github.repo.md](/github.repo)
  - [test.md](/test)
- Markdown Deleted:
  - [algo/graph.md](/algo/graph)
  - [algo/index.md](/algo/)
  - [algo/linkedlist.md](/algo/linkedlist)
  - [algo/queue.md](/algo/queue)
  - [algo/stack.md](/algo/stack)
  - [algo/tree.md](/algo/tree)
  - [cangjie/basic-data-type.md](/cangjie/basic-data-type)
  - [cangjie/func.md](/cangjie/func)
  - [cangjie/index.md](/cangjie/)
  - [docker/docker-compose.md](/docker/docker-compose)
  - [docker/docker-deploy.md](/docker/docker-deploy)
  - [docker/docker.md](/docker/docker)
  - [docker/dockerfile-learn.md](/docker/dockerfile-learn)
  - [docker/index.md](/docker/)
  - [golang/grammar/index.md](/golang/grammar/)
  - [golang/index.md](/golang/)
  - [golang/principles/index.md](/golang/principles/)
  - [mysql/index.md](/mysql/)
  - [mysql/mysql-arch.md](/mysql/mysql-arch)
  - [mysql/mysql-buffer-pool.md](/mysql/mysql-buffer-pool)
  - [mysql/mysql-index.md](/mysql/mysql-)
  - [mysql/mysql-lock.md](/mysql/mysql-lock)
  - [mysql/mysql-log.md](/mysql/mysql-log)
  - [mysql/mysql-transaction.md](/mysql/mysql-transaction)
  - [redis/arch/LRU-LFU.md](/redis/arch/LRU-LFU)
  - [redis/arch/index.md](/redis/arch/)
  - [redis/arch/multi-thread-persistence.md](/redis/arch/multi-thread-persistence)
  - [redis/arch/redisDb.md](/redis/arch/redisDb)
  - [redis/arch/single-thread.md](/redis/arch/single-thread)
  - [redis/data-types/Hashes.md](/redis/data-types/Hashes)
  - [redis/data-types/Lists.md](/redis/data-types/Lists)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/Stream.md](/redis/data-types/Stream)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
  - [redis/data-types/ZSet.md](/redis/data-types/ZSet)
  - [redis/data-types/chhz0.md](/redis/data-types/chhz0)
  - [redis/data-types/encoding-hashtable.md](/redis/data-types/encoding-hashtable)
  - [redis/data-types/encoding-sds.md](/redis/data-types/encoding-sds)
  - [redis/data-types/encoding-skip-list.md](/redis/data-types/encoding-skip-list)
  - [redis/data-types/encoding-zip-list.md](/redis/data-types/encoding-zip-list)
  - [redis/data-types/index.md](/redis/data-types/)
  - [redis/index.md](/redis/)
  - [redis/interview/index.md](/redis/interview/)
  - [rust/index.md](/rust/)
  - [vitepress/api-examples.md](/vitepress/api-examples)
  - [vitepress/index.md](/vitepress/)
  - [vitepress/markdown-examples.md](/vitepress/markdown-examples)
  - [vitepress/template-frontmatter.md](/vitepress/template-frontmatter)
  - [guide/index.md](/guide/)

## `2025-03-08`

### Commit SHA: `b1708bf`

**Message**: docs(README): 更新项目说明和链接
- Markdown Modified:
  - [README.md](/README)

### Commit SHA: `f3fb510`

**Message**: test: github action
- Markdown Modified:
  - [test.md](/test)

### Commit SHA: `36d0e7c`

**Message**: chore: update
- Markdown Modified:
  - [github.repo.md](/github.repo)
  - [golang/index.md](/golang/)
  - [test.md](/test)

## `2025-02-18`

### Commit SHA: `7e904b7`

**Message**: docs: 重构文档结构并优化主题配置

- 将配置文件和自定义组件移至 theme 目录
- 新增自动侧边栏功能
- 更新导航栏和侧边栏配置
- 优化 Algolia 搜索配置
- 调整文档样式和布局
- 新增项目仓库页面
- 更新首页内容
- Markdown Added:
  - [github.repo.md](/github.repo)
  - [test.md](/test)
  - [vitepress/template-frontmatter.md](/vitepress/template-frontmatter)
- Markdown Modified:
  - [index.md](/)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
- Markdown Deleted:
  - [template-readme.md](/template-readme)

## `2025-02-10`

### Commit SHA: `2f719f8`

**Message**: chore: 删除虚拟环境文件和配置

### Commit SHA: `f8870a1`

**Message**: feat: 新增python虚拟环境&修改makefile
- Markdown Modified:
  - [about/changelog.md](/about/changelog)

### Commit SHA: `72a9010`

**Message**: build: 优化构建流程并添加自动化生成日志功能

- 新增 py-gen-log 目标到 Makefile，用于自动生成日志
- 更新 docs/.vitepress/config.mts，优化导航和侧边栏配置
- 移除 @heroicons/vue 依赖
- 重构 build.sh 脚本，改为 dockerup.sh，简化构建流程

### Commit SHA: `24d7dd9`

**Message**: feat: 生成更新日志工具

- 新增git commit转为md文件的py工具
- 优化更新日志页面，记录所有提交信息
- Markdown Added:
  - [about/changelog.md](/about/changelog)
- Markdown Deleted:
  - [about/log.md](/about/log)

## `2025-02-08`

### Commit SHA: `fa7a7da`

**Message**: feat(docs): 添加个人开发项目展示

- 在首页添加个人开发项目展示区域
- 新增 GithubRepoCard 组件用于展示 GitHub 仓库信息
- 优化站点主题样式，支持暗黑模式
- 添加环境变量配置，支持 VitePress 相关设置
- 更新 .gitignore 文件，忽略敏感信息
- Markdown Modified:
  - [index.md](/)

## `2025-02-07`

### Commit SHA: `e3348f2`

**Message**: docs(helloch): 更新文档站点配置和样式

- 修改站点标题为 "HelloCH"
- 更新站点描述为 "知识库：学习|记录|随笔"
- 添加自定义 logo
- 调整导航栏和侧边栏内容
- 更新首页布局和样式
- 添加自定义主题样式
- Markdown Added:
  - [tmp/emoji.md](/tmp/emoji)
  - [vitepress/api-examples.md](/vitepress/api-examples)
  - [vitepress/index.md](/vitepress/)
  - [vitepress/markdown-examples.md](/vitepress/markdown-examples)
- Markdown Modified:
  - [README.md](/README)
  - [about/site.md](/about/site)
  - [index.md](/)
- Markdown Deleted:
  - [api-examples.md](/api-examples)
  - [markdown-examples.md](/markdown-examples)

### Commit SHA: `6da3636`

**Message**: docs: 更新导航栏和首页内容

- 在导航栏中添加 Cangjie 语言的链接
- 更新首页 featured 项目，替换为 goiam 和 go-component-base
- 移除 gobitcask 项目
- 修正 Redis 相关文档中的图片路径
- Markdown Added:
  - [cangjie/basic-data-type.md](/cangjie/basic-data-type)
  - [cangjie/func.md](/cangjie/func)
  - [cangjie/index.md](/cangjie/)
- Markdown Modified:
  - [index.md](/)
  - [redis/arch/redisDb.md](/redis/arch/redisDb)
  - [redis/arch/single-thread.md](/redis/arch/single-thread)

## `2025-01-04`

### Commit SHA: `0cbc88c`

**Message**: docs: 更新图片路径
- Markdown Modified:
  - [redis/data-types/Lists.md](/redis/data-types/Lists)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
  - [redis/data-types/encoding-hashtable.md](/redis/data-types/encoding-hashtable)
  - [redis/data-types/index.md](/redis/data-types/)

## `2024-12-18`

### Commit SHA: `1de1012`

**Message**: Merge pull request #3 from chhz0/blog

Blog
- Markdown Added:
  - [golang/grammar/index.md](/golang/grammar/)
  - [golang/principles/index.md](/golang/principles/)
  - [redis/arch/LRU-LFU.md](/redis/arch/LRU-LFU)
  - [redis/arch/multi-thread-persistence.md](/redis/arch/multi-thread-persistence)
  - [redis/arch/redisDb.md](/redis/arch/redisDb)
  - [redis/arch/single-thread.md](/redis/arch/single-thread)
  - [redis/data-types/chhz0.md](/redis/data-types/chhz0)
  - [rust/index.md](/rust/)
- Markdown Modified:
  - [about/log.md](/about/log)
  - [index.md](/)
  - [redis/arch/index.md](/redis/arch/)
  - [redis/data-types/encoding-skip-list.md](/redis/data-types/encoding-skip-list)

### Commit SHA: `5079eba`

**Message**: docs: 更新redis/arch 内容

- caddyfile 添加blog.helloch.cn重定向
- 主页修改log -light -dark
- Markdown Added:
  - [golang/grammar/index.md](/golang/grammar/)
  - [golang/principles/index.md](/golang/principles/)
  - [redis/arch/LRU-LFU.md](/redis/arch/LRU-LFU)
  - [redis/arch/multi-thread-persistence.md](/redis/arch/multi-thread-persistence)
  - [redis/arch/redisDb.md](/redis/arch/redisDb)
  - [redis/arch/single-thread.md](/redis/arch/single-thread)
  - [rust/index.md](/rust/)
- Markdown Modified:
  - [about/log.md](/about/log)
  - [index.md](/)
  - [redis/arch/index.md](/redis/arch/)
  - [redis/data-types/encoding-skip-list.md](/redis/data-types/encoding-skip-list)

## `2024-12-17`

### Commit SHA: `14e9478`

**Message**: Merge pull request #2 from chhz0/blog

Blog
- Markdown Added:
  - [redis/data-types/Stream.md](/redis/data-types/Stream)
  - [redis/data-types/encoding-hashtable.md](/redis/data-types/encoding-hashtable)
  - [redis/data-types/encoding-skip-list.md](/redis/data-types/encoding-skip-list)
- Markdown Modified:
  - [about/log.md](/about/log)
  - [index.md](/)
  - [redis/data-types/Hashes.md](/redis/data-types/Hashes)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
  - [redis/data-types/ZSet.md](/redis/data-types/ZSet)
  - [redis/data-types/encoding-sds.md](/redis/data-types/encoding-sds)
  - [redis/data-types/encoding-zip-list.md](/redis/data-types/encoding-zip-list)
  - [redis/data-types/index.md](/redis/data-types/)

## `2024-12-15`

### Commit SHA: `ff262f4`

**Message**: chore: chhz0
- Markdown Added:
  - [redis/data-types/chhz0.md](/redis/data-types/chhz0)

### Commit SHA: `3b4914d`

**Message**: docs: redis/data-types/* 基本更新完成
- Markdown Added:
  - [redis/data-types/Stream.md](/redis/data-types/Stream)
  - [redis/data-types/encoding-skip-list.md](/redis/data-types/encoding-skip-list)
- Markdown Modified:
  - [about/log.md](/about/log)
  - [index.md](/)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/ZSet.md](/redis/data-types/ZSet)
  - [redis/data-types/encoding-hashtable.md](/redis/data-types/encoding-hashtable)
  - [redis/data-types/encoding-sds.md](/redis/data-types/encoding-sds)
  - [redis/data-types/encoding-zip-list.md](/redis/data-types/encoding-zip-list)
  - [redis/data-types/index.md](/redis/data-types/)

## `2024-12-14`

### Commit SHA: `7bc67e1`

**Message**: docs(vitepress): 更新导航配置和 Redis 文档

- 在导航栏中添加 activeMatch 属性，以优化导航项的高亮显示
- 更新 Redis 文档侧边栏，增加集群和命令相关章节
- 新增 Redis 数据类型和编码方式相关文档
- 更新网站日志
- Markdown Added:
  - [redis/data-types/encoding-hashtable.md](/redis/data-types/encoding-hashtable)
- Markdown Modified:
  - [about/log.md](/about/log)
  - [redis/data-types/Hashes.md](/redis/data-types/Hashes)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
  - [redis/data-types/encoding-sds.md](/redis/data-types/encoding-sds)

## `2024-12-13`

### Commit SHA: `537bf31`

**Message**: Merge pull request #1 from chhz0/blog

Blog
- Markdown Added:
  - [about/log.md](/about/log)
  - [about/site.md](/about/site)
  - [algo/graph.md](/algo/graph)
  - [algo/index.md](/algo/)
  - [algo/linkedlist.md](/algo/linkedlist)
  - [algo/queue.md](/algo/queue)
  - [algo/stack.md](/algo/stack)
  - [algo/tree.md](/algo/tree)
  - [api-examples.md](/api-examples)
  - [docker/docker-compose.md](/docker/docker-compose)
  - [docker/docker-deploy.md](/docker/docker-deploy)
  - [docker/docker.md](/docker/docker)
  - [docker/dockerfile-learn.md](/docker/dockerfile-learn)
  - [docker/index.md](/docker/)
  - [golang/index.md](/golang/)
  - [guide/index.md](/guide/)
  - [index.md](/)
  - [markdown-examples.md](/markdown-examples)
  - [mysql/index.md](/mysql/)
  - [mysql/mysql-arch.md](/mysql/mysql-arch)
  - [mysql/mysql-buffer-pool.md](/mysql/mysql-buffer-pool)
  - [mysql/mysql-index.md](/mysql/mysql-)
  - [mysql/mysql-lock.md](/mysql/mysql-lock)
  - [mysql/mysql-log.md](/mysql/mysql-log)
  - [mysql/mysql-transaction.md](/mysql/mysql-transaction)
  - [redis/arch/index.md](/redis/arch/)
  - [redis/data-types/Hashes.md](/redis/data-types/Hashes)
  - [redis/data-types/Lists.md](/redis/data-types/Lists)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
  - [redis/data-types/ZSet.md](/redis/data-types/ZSet)
  - [redis/data-types/encoding-sds.md](/redis/data-types/encoding-sds)
  - [redis/data-types/encoding-zip-list.md](/redis/data-types/encoding-zip-list)
  - [redis/data-types/index.md](/redis/data-types/)
  - [redis/index.md](/redis/)
  - [redis/interview/index.md](/redis/interview/)
  - [template-readme.md](/template-readme)

### Commit SHA: `0c6e444`

**Message**: docs: 更新和优化文档

- 新增 MySQL 相关文档
- 更新 Redis 文档结构
- 优化算法文档格式
- 添加 Docker 和 Golang 新建文档
- 更新 VitePress 配置
- Markdown Added:
  - [docker/docker-compose.md](/docker/docker-compose)
  - [docker/docker-deploy.md](/docker/docker-deploy)
  - [docker/docker.md](/docker/docker)
  - [docker/dockerfile-learn.md](/docker/dockerfile-learn)
  - [docker/index.md](/docker/)
  - [golang/index.md](/golang/)
  - [mysql/index.md](/mysql/)
  - [mysql/mysql-arch.md](/mysql/mysql-arch)
  - [mysql/mysql-buffer-pool.md](/mysql/mysql-buffer-pool)
  - [mysql/mysql-index.md](/mysql/mysql-)
  - [mysql/mysql-lock.md](/mysql/mysql-lock)
  - [mysql/mysql-log.md](/mysql/mysql-log)
  - [mysql/mysql-transaction.md](/mysql/mysql-transaction)
  - [redis/arch/index.md](/redis/arch/)
  - [redis/data-types/Hashes.md](/redis/data-types/Hashes)
  - [redis/data-types/Lists.md](/redis/data-types/Lists)
  - [redis/data-types/Strings.md](/redis/data-types/Strings)
  - [redis/data-types/encoding-sds.md](/redis/data-types/encoding-sds)
  - [redis/data-types/encoding-zip-list.md](/redis/data-types/encoding-zip-list)
  - [redis/interview/index.md](/redis/interview/)
- Markdown Modified:
  - [about/log.md](/about/log)
  - [algo/graph.md](/algo/graph)
  - [algo/index.md](/algo/)
  - [algo/linkedlist.md](/algo/linkedlist)
  - [algo/queue.md](/algo/queue)
  - [algo/stack.md](/algo/stack)
  - [algo/tree.md](/algo/tree)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/ZSet.md](/redis/data-types/ZSet)
  - [redis/data-types/index.md](/redis/data-types/)
  - [redis/index.md](/redis/)
- Markdown Deleted:
  - [redis/data-types/Hash.md](/redis/data-types/Hash)
  - [redis/data-types/List.md](/redis/data-types/List)
  - [redis/data-types/String.md](/redis/data-types/String)

## `2024-12-12`

### Commit SHA: `a5f51a0`

**Message**: docs(log): 更新日志中的 Redis 相关文档路径

- 将 Redis 相关文档的路径从绝对路径修改为相对路径
- 修正了 Redis 数据类型文档的链接格式
- Markdown Modified:
  - [about/log.md](/about/log)

### Commit SHA: `c6a1c99`

**Message**: feat(docs): 优化导航栏和侧边栏配置

- 重构导航栏和侧边栏的配置，使用函数进行模块化管理
- 新增 Redis、算法等文档内容
- 添加关于本站和更新日志页面
- 优化首页内容，包括 TODO 列表和更新日志链接
- 引入 Algolia 搜索配置
- Markdown Added:
  - [about/log.md](/about/log)
  - [about/site.md](/about/site)
  - [algo/graph.md](/algo/graph)
  - [algo/index.md](/algo/)
  - [algo/linkedlist.md](/algo/linkedlist)
  - [algo/queue.md](/algo/queue)
  - [algo/stack.md](/algo/stack)
  - [algo/tree.md](/algo/tree)
  - [redis/data-types/Hash.md](/redis/data-types/Hash)
  - [redis/data-types/List.md](/redis/data-types/List)
  - [redis/data-types/Sets.md](/redis/data-types/Sets)
  - [redis/data-types/String.md](/redis/data-types/String)
  - [redis/data-types/ZSet.md](/redis/data-types/ZSet)
  - [redis/data-types/index.md](/redis/data-types/)
  - [redis/index.md](/redis/)
- Markdown Modified:
  - [index.md](/)

## `2024-12-11`

### Commit SHA: `9f41e05`

**Message**: build: 更新 build.sh 脚本

### Commit SHA: `a71d80c`

**Message**: docs: 基本完成网站配置和内容结构

- 添加新 logo 和 修改网站标题
- 增加最后更新时间和本地搜索功能
- 扩展导航栏，添加新的分类和链接
- 更新侧边栏结构，增加计算机相关子目录
- 添加 GitHub 编辑链接
- 更新底部版权信息，增加 MIT License 链接
- Markdown Added:
  - [guide/index.md](/guide/)
  - [template-readme.md](/template-readme)
- Markdown Modified:
  - [index.md](/)
- Markdown Deleted:
  - [vitepress-readme.md](/vitepress-readme)

### Commit SHA: `8234d30`

**Message**: feat: build.sh update

### Commit SHA: `4fc561b`

**Message**: docs: 完善网站配置并添加导航栏
- Markdown Modified:
  - [index.md](/)

### Commit SHA: `b554e4e`

**Message**: feat: add Caddy docker config

## `2024-12-10`

### Commit SHA: `313abe9`

**Message**: Update README.md
- Markdown Modified:
  - [README.md](/README)

### Commit SHA: `ab8a1ff`

**Message**: docs: 初始化 VitePress 项目结构和配置
- Markdown Added:
  - [api-examples.md](/api-examples)
  - [index.md](/)
  - [markdown-examples.md](/markdown-examples)
  - [vitepress-readme.md](/vitepress-readme)

### Commit SHA: `a2688c3`

**Message**: Initial commit
- Markdown Added:
  - [README.md](/README)

