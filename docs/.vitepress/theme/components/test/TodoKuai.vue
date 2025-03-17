<script setup lang="ts">
type TodoItem = {
  text: string
  done: boolean
  children?: TodoItem[]
}
const props = defineProps<{
  todos: Array<{
    text: string
    done: boolean
    children?: TodoItem[]
  }>
}>()

</script>

<template>
  <div class="VPTodoList">
    <div v-for="(todo, index) in $props.todos" :key="index" class="todo-item">
      <input type="checkbox" :checked="todo.done">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>

      <div v-if="todo.children" class="child-item">
        <div class="sub-todos">
          <TodoKuai :todos="todo.children"/>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.VPTodoList {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0px 0;
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

.sub-todos {
  margin-left: 12px;
  border-left: 2px solid var(--vp-c-divider);
  padding-left: 24px;
}

.sub-todos .todo-item {
  padding-left: 12px;
}

.child-item {
  opacity: 0.9;
  transform: scale(0.96);
  padding: 1px 0;
}
</style>