<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vitepress'
import { ref } from 'vue'
import { LinkIcon } from '../svg/icons'
const router = useRouter()
interface TodoItem {
  id: string
  text: string
  done: boolean
  expanded?: boolean
  link?: string
  children?: TodoItem[]
}

const props = defineProps<{
  todos: TodoItem[]
  depth?: number
}>()

const localTodos = ref(props.todos)

const toggleExpand = (todo: TodoItem) => {
  if (todo.children) {
    todo.expanded = !todo.expanded
  }
}
</script>

<template>
  <ul class="space-y-1">
    <li v-for="todo in localTodos" :key="todo.id" class="group relative">
      <div class="flex items-center gap-2 hover:bg-indigo-400 rounded-lg p-2 transition-colors">
        <button v-if="todo.children" @click="toggleExpand(todo)"
          class="h-5 w-5 flex items-center justify-center transition-transform duration-200" :class="{
            'rotate-90': todo.expanded,
            // 'invisible': !todo.children
          }" aria-label="Toggle children">
          <ChevronRight class="w-4 h-4 text-muted-foreground" />
        </button>

        <input v-model="todo.done" type="checkbox"
          class="h-4 w-4 rounded border-primary text-primary focus:ring-primary" />

        <span
          class="text-sm font-medium"
          :class="{
            'line-through text-muted-foreground': todo.done,
            'text-foreground': !todo.done
          }"
          @click="todo.link && router.go(todo.link)"
        >
          <template v-if="todo.link">
            <div :to="todo.link" class="hover:underline hover:text-primary flex items-center gap-1">
              {{ todo.text }}
              <svg viewBox="0 0 1024 1024" width="14" height="14" class="shrink-0">
              <path
                :d="LinkIcon"
                :fill="'var(--vp-c-text-1)'"
                class="stroke-current text-muted-foreground"
                stroke-width="20"
                stroke-linecap="round"
              />
            </svg>
            </div>
          </template>
          <template v-else>
            {{ todo.text }}
          </template>
        </span>
      </div>

      <div v-if="todo.children && todo.expanded" class="ml-4 border-l-2 border-border pl-4">
        <TodoList :todos="todo.children" :depth="(depth || 0) + 1" />
      </div>
    </li>
  </ul>
</template>