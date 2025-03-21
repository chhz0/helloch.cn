---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Hello CH 📖✏️"
  text: "学习 | 记录 | 随笔"
  tagline: 该站点计划构建一个知识库站点，记录学习、记录随笔、分享知识，同时作为个人博客的归档站点...
  image:
    light: '/logo/kd-sleep.svg'
    dark: '/logo/kd-sleep-light.svg'

  actions:
    - theme: alt
      text: Github/chhz0
      link: https://github.com/chhz0/
    - theme: brand
      text: 关于本站
      link: /about/site
# features:
#   - icon: ⚡️
#     title: gomall
#     details: 使用kitex和hertz搭建的mall项目
#     link: https://github.com/chhz0/go-mall-kitex
#     linkText: 访问
#   - icon: 🎟️
#     title: goiam
#     details: 由Go语言构建的身份和访问管理服务
#     link: https://github.com/chhz0/goiam
#     linkText: 访问
#   - icon: 🍬
#     title: go-component-base
#     details: go组件库
#     link: https://github.com/chhz0/go-component-base
#     linkText: 访问
  # - icon: ⚡️
  #   title: gobitcask
  #   details: 基于bitcask实现的kv存储
  #   link: https://github.com/chhz0/go-bitDB/README.md
---

## Projects in Github <Badge type="tip" text="what I'm doing" />

<div class="card-grid">
  <img  src="https://github-readme-stats.vercel.app/api/top-langs/?username=chhz0&layout=compact&theme=tokyonight" />
  <!-- <img  src="https://github-readme-stats.vercel.app/api?username=chhz0&show_icons=true&theme=radical" /> -->
</div>


<h3 style="color:#00ADD8">Golang  <Badge type="tip" text="Proj" /></h3>
<div class="card-grid">
  <GithubRepoCard
    v-for="repo in golangRepos"
    :owner="repo.owner"
    :repo="repo.repoName" />
</div>

<h3 style="color:#3178c6">TypeScript  <Badge type="tip" text="Proj" /></h3>
<div class="card-grid">
  <GithubRepoCard
    v-for="repo in tsRepos"
    :owner="repo.owner"
    :repo="repo.repoName" />
</div>

## TODO <Badge type="tip" text="TODO List" />

<TodoList :todos="todos" />

## 更新日志 <Badge type="tip" text="Log" />

::: tip
请前往[关于/日志](/about/changelog)查看
:::

<script setup lang="ts">
import { ref } from "vue";
import { GithubIcon } from ".vitepress/theme/components/svg/icons.ts"
const golangRepos = ref([
  { owner: "chhz0", repoName: "goiam" },
  { owner: "chhz0", repoName: "gojob" },
  { owner: "chhz0", repoName: "gokit" },
  { owner: "chhz0", repoName: "go-bitcask" }
]);
const tsRepos = ref([
  { owner: "vuejs", repoName: "vitepress" },
]);

const todos = [
  {
    id: '1',
    text: 'Redis',
    done: false,
    expanded: false,
    link: '/backend/redis',
    children: [
      {
        id: '1-1',
        text: '数据结构',
        done: true,
        link: '/backend/redis/#redis-数据结构',
        children: [
          { id: '1-1-1', text: 'string', done: true, link: '/backend/redis/#redis-string' },
          { id: '1-1-2', text: 'list', done: true, link: '/backend/redis/#redis-list' },
          { id: '1-1-3', text: 'set', done: true, link: '/backend/redis/#redis-set' },
          { id: '1-1-4', text:'hash', done: true, link: '/backend/redis/#redis-hash' },
          { id: '1-1-5', text:'zset', done: true, link: '/backend/redis/#redis-zset' },
          { id: '1-1-6', text:'stream && other', done: true, link: '/backend/redis/#redis-stream' },
          { id: '1-1-6', text: '编码', done: true,
            children: [
              { id: '1-1-6-1', text: 'sds', done: true, link: '/backend/redis/#redis-enc-sds' },
              { id: '1-1-6-2', text: 'ziplist', done: true, link: '/backend/redis/#redis-enc-ziplist' },
              { id: '1-1-6-3', text: 'hashtable', done: true, link: '/backend/redis/#redis-enc-hashtable' },
              { id: '1-1-6-4', text:'skiplist', done: true, link: '/backend/redis/#redis-enc-skiplist' },
            ]
          }
        ]
      },
      { id: '1-2', text: '架构', done: false },
      { id: '1-3', text: '持久化', done: false },
      { id: '1-4', text: '应用场景', done: false },
      { id: '1-5', text: '命令', done: false },
    ]
  },
  {
    id: '2',
    text: 'Mysql - innodb',
    done: false,
    expanded: false,
    children: [
      { id: '2-1', text: '索引', done: false },
      { id: '2-2', text: '事务', done: false },
      { id: '2-3', text: '锁', done: false },
      { id: '2-4', text: '内存', done: false },
      { id: '2-5', text: '日志', done: false },
      { id: '2-6', text: '逻辑架构', done: false },
    ]
  },
  {
    id: '3',
    text: 'golang',
    done: false,
    expanded: false,
    children: [
      { id: '3-1', text: '基础', done: false },
      { id: '3-2', text: '原理', done: false },
      { id: '3-3', text: '实践', done: false },
    ]
  },
  { id: '4', text: 'java', done: false },
  { id: '5', text: 'linux', done: false },
  { id: '6', text: 'network', done: false },
  { id: '7', text: 'algo', done: false },
  { id: '8', text: 'docker', done: false },
  { id: '9', text: 'git', done: false },
  { id: '10', text: 'vue', done: false },
]

</script>

<style>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>
