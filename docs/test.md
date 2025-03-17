---
title: 测试页面
layout: home
aside: false
sidebar: false
---
<script setup>
const todos = [
  {
    id: '1',
    text: '项目计划',
    done: false,
    children: [
      {
        id: '1-1',
        text: '需求分析',
        done: true,
        children: [
          { id: '1-1-1', text: '用户调研', done: true },
          { id: '1-1-2', text: '原型设计', done: false }
        ]
      },
      { id: '1-2', text: '技术方案设计', done: false }
    ]
  },
  {
    id: '2',
    text: '开发阶段',
    done: false,
    expanded: true,
    children: [
      { id: '2-1', text: '前端开发', done: false },
      { id: '2-2', text: '后端开发', done: false }
    ]
  }
]
</script>

# vitepress组件测试
<TodoList :todos="todos" />