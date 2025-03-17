<template>
  <div class="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
    <div class="flex gap-2 mb-6">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="添加新任务"
        class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        @click="addTask"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        添加
      </button>
    </div>

    <ul class="space-y-2">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="group flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <label class="flex items-center flex-1 cursor-pointer">
          <input
            type="checkbox"
            v-model="task.completed"
            class="hidden"
          />
          <div class="w-6 h-6 border-2 rounded-md mr-3 transition-colors"
               :class="{
                 'border-blue-500': task.completed,
                 'border-gray-300': !task.completed
               }">
            <svg
              v-show="task.completed"
              class="w-full h-full text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span
            class="flex-1 transition-all"
            :class="{
              'line-through text-gray-400': task.completed,
              'text-gray-700': !task.completed
            }">
            {{ task.text }}
          </span>
        </label>
        <button
          @click="removeTask(index)"
          class="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface TodoTask {
  text: string
  completed: boolean
}

const newTask = ref('')
const tasks = ref<TodoTask[]>([])

// 初始化时从localStorage加载数据
onMounted(() => {
  const saved = localStorage.getItem('todo-list')
  if (saved) {
    tasks.value = JSON.parse(saved)
  }
})

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.unshift({
      text: newTask.value.trim(),
      completed: false
    })
    newTask.value = ''
    saveToLocalStorage()
  }
}

const removeTask = (index: number) => {
  tasks.value.splice(index, 1)
  saveToLocalStorage()
}

const saveToLocalStorage = () => {
  localStorage.setItem('todo-list', JSON.stringify(tasks.value))
}
</script>