---
title: 项目仓库
layout: home
aside: false
sidebar: false
---
<script setup lang="ts">
  import { ref } from "vue";
  const golangRepos = ref([
    { owner: "chhz0", repoName: "goiam" },
    { owner: "chhz0", repoName: "gojob" },
    { owner: "chhz0", repoName: "framego" },
    { owner: "chhz0", repoName: "go-bitcask" }
  ]);
  const vueRepos = ref([
    { owner: "unovue", repoName: "shadcn-vue" },
  ]);
</script>

<style>
.repo-grid {
    display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .repo-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>

# 项目仓库

## golang
<div class="repo-grid">
  <GithubRepoCard
    v-for="repo in golangRepos"
    :owner="repo.owner"
    :repo="repo.repoName" />
</div>

## vue

<div class="repo-grid">
  <GithubRepoCard
    v-for="repo in vueRepos"
    :owner="repo.owner"
    :repo="repo.repoName" />
</div>

-- TODO

<!-- ## java -->

<!-- TODO -->

<!-- ## cangjie -->

<!-- TODO -->