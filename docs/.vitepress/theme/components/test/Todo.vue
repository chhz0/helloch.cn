<script setup lang="ts">

const props = defineProps<{
  todos: Array<{
    text: string
    done: boolean
  }>
}>()
</script>

<template>
  <div v-for="(todo, index) in $props.todos" :key="index" class="todo-item">
    <input type="checkbox" :checked="todo.done" >
    <span :class="{ done: todo.done }">{{ todo.text }}</span>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.todo-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.done {
  text-decoration: line-through;
  opacity: 0.7;
}
</style>