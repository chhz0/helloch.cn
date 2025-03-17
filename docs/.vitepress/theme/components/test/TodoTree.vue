<script setup lang="ts">
interface TodoItem {
  text: string
  done: boolean
  expanded?: boolean
  children?: TodoItem[]
}

const props = defineProps<{
  todos: TodoItem[]
}>()

import { reactive } from 'vue'

const toggleChildren = (todo: TodoItem) => {
  if (todo.children) {
    console.log('当前展开状态:', todo.expanded)
    const reactiveTodo = reactive({
      ...todo,
      expanded: !!todo.expanded,
      children: todo.children.map(child => reactive(child))
    })
    Object.assign(todo, reactiveTodo)
    todo.expanded = reactiveTodo.expanded
    todo.expanded = !todo.expanded
    reactiveTodo.expanded = todo.expanded
    console.log('更新后状态:', todo.expanded, reactiveTodo.expanded)
  }
}
</script>

<template>
  <ul class="space-y-1">
    <li v-for="todo in props.todos" :key="todo.text" class="group">
      <div class="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2">
        <button
          v-if="todo.children"
          @click="toggleChildren(todo)"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-transform duration-200 ease-linear"
          :class="{ 'rotate-90': todo.expanded }"
        >
          <svg class="w-4 h-4" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M6.293 11.707a1 1 0 0 1 0-1.414L9.586 7L6.293 3.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z"
            />
          </svg>
        </button>
        <input
          v-model="todo.done"
          type="checkbox"
          class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
        />
        <span
          class="text-sm font-medium"
          :class="{
            'text-gray-900 dark:text-gray-100': !todo.done,
            'line-through text-gray-400 dark:text-gray-500': todo.done
          }"
        >
          {{ todo.text }}
        </span>
      </div>
      <div
        v-if="todo.children && todo.expanded"
        class="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
      >
        <TodoTree :todos="todo.children.map(child => reactive(child)) as TodoItem[]" />
      </div>
    </li>
  </ul>
</template>