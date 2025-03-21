<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vitepress'

interface Post {  // 添加明确的接口定义
  title: string
  url: string
  tags: string[]
  date: string
  description?: string
}

const props = defineProps<{
  posts: Post[]  // 使用接口类型
}>()

const router = useRouter()

// 根据主题配置中的posts生成分类数据
// const tagMap = computed(() => {
//   const map = new Map<string, Post[]>()
//   props.posts?.forEach((post: Post) => {
//     post.tags?.forEach(tag => {
//       if (!map.has(tag)) map.set(tag, [])
//       map.get(tag)?.push(post)
//     })
//   })
//   return map
// })
// 替换tagMap为直接排序的文章列表
const sortedPosts = computed(() => {
  return [...props.posts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})
// 在脚本部分添加日期格式化函数
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const tagColors = {
  '数据库': '#60a5fa',
  '缓存': '#fbbf24',
  '前端': '#f472b6',       // 粉色
  '后端': '#4f46e5',       // 靛蓝
  'DevOps': '#10b981',    // 翠绿
  '架构': '#8b5cf6',       // 紫色
  '算法': '#ef4444',       // 红色
  'JavaScript': '#f59e0b', // 琥珀色
  'TypeScript': '#3178c6', // TS官方蓝
  'React': '#61dafb',      // React标志性青色
  'Vue': '#42b883',        // Vue官方绿色
  'Node.js': '#689f63',    // Node绿
  'Git': '#f14e32',        // Git官方橙红
  'Go': '#00ADD8',          // Golang官方蓝
  'Golang': '#00ADD8',       // 别名
  'Java': '#E76F00',        // Java官方橙
  'MySQL': '#FF6600',       // MySQL橙色
  'PostgreSQL': '#336791',  // PG深蓝
  'MongoDB': '#4DB33D',     // MongoDB绿
  'Redis': '#DC382C',       // Redis红
  'Kafka': '#231F20',       // Kafka黑
  'Linux': '#FCC624',       // Linux黄
  'Docker': '#2496ED',      // Docker蓝
  'Kubernetes': '#326CE5',  // K8s蓝
}

</script>

<template>
  <div class="archive-container">
    <!-- 移除标签分组循环 -->
    <div class="flex flex-col gap-6">
      <div
        v-for="post in sortedPosts"
        :key="post.url"
        class="post-card w-full"
        @click="router.go(post.url)"
      >
        <div class="card-content">
          <h3 class="text-lg font-medium"> # {{ post.title }}</h3>
          <p class="text-sm text-muted mt-2">{{ post.description }}</p>

          <div class="mt-3 flex justify-between items-center">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="text-xs px-2 py-1 rounded-md bg-opacity-20"
                :style="{
                  backgroundColor: `${tagColors[tag] || '#e5e7eb'}33`,
                  color: tagColors[tag] || '#374151'
                }"
              >
                {{ tag }}
              </span>
            </div>
            <time
              class="text-xs text-muted-foreground shrink-0"
              :datetime="post.date"
            >
              {{ formatDate(post.date) }}
            </time>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.post-card {
  background-color: var(--vp-c-bg-soft);
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--vp-c-divider);
}

.post-card:hover {
  background-color: var(--vp-c-default-soft);
  transform: translateX(8px) translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

.post-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.border-divider {
  border-color: var(--vp-c-divider);
}

/* 保留原有卡片悬停效果 */
.post-card:hover {
  transform: translateX(8px);
}
</style>