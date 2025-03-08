// .vitepress/theme/components/ArchiveTimeline.vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

interface FrontMatter {
  archived?: boolean
  date?: string
  title?: string
}

interface FileData {
  url: string
  frontmatter: FrontMatter
}

interface ArchiveItem {
  title: string
  url: string
  date: Date
}

interface GroupedArchives {
  [year: string]: {
    [month: string]: ArchiveItem[]
  }
}

const { isDark } = useData()
const allFiles = ref<FileData[]>([])

// 获取所有文档数据
onMounted(() => {
  const files = import.meta.glob('../../docs/**/*.md', {
    eager: true,
    import: 'frontmatter',
    query: { meta: true }
  })

  const routes = Object.entries(files).map(([path, data]) => ({
    url: path.replace('../../docs', '').replace('.md', ''),
    frontmatter: (data as any).frontmatter
  }))

  allFiles.value = routes
})

// 处理归档数据
const groupedArchives = computed(() => {
  const items = allFiles.value
    .filter(file => file.frontmatter?.archived)
    .map(file => ({
      title: file.frontmatter.title || 'Untitled',
      url: file.url,
      date: new Date(file.frontmatter.date || '1970-01-01')
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return items.reduce((groups: GroupedArchives, item) => {
    const year = item.date.getFullYear().toString()
    const month = (item.date.getMonth() + 1).toString().padStart(2, '0')

    if (!groups[year]) groups[year] = {}
    if (!groups[year][month]) groups[year][month] = []

    groups[year][month].push(item)
    return groups
  }, {})
})

// 月份名称映射
const monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]
</script>

<template>
  <div class="archive-container" :class="{ 'dark': isDark }">
    <div v-for="(yearMonths, year) in groupedArchives" :key="year" class="year-group">
      <h2 class="year-title">{{ year }}</h2>

      <div v-for="(items, month) in yearMonths" :key="month" class="month-group">
        <div class="month-header">
          <span class="month-line"></span>
          <span class="month-name">{{ monthNames[parseInt(month.toString()) - 1] }}</span>
        </div>

        <div class="archive-items">
          <a
            v-for="item in items"
            :key="item.url"
            :href="item.url"
            class="archive-item"
          >
            <span class="item-date">
              {{ new Date(item.date).getDate().toString().padStart(2, '0') }}
            </span>
            <span class="item-title">{{ item.title }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive-container {
  --timeline-color: #e5e7eb;
  --text-color: var(--vp-c-text-1);
  --bg-color: var(--vp-c-bg);
  --hover-bg: var(--vp-c-default-soft);
  padding: 2rem 1rem;
}

.dark {
  --timeline-color: #374151;
}

.year-group {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 2rem;
}

.year-title {
  color: var(--text-color);
  font-size: 1.5rem;
  margin: 0 0 1rem;
  padding-left: 1.5rem;
}

.month-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.month-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.month-line {
  width: 2px;
  height: 1.5rem;
  background: var(--timeline-color);
  margin-right: 1rem;
}

.month-name {
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 500;
}

.archive-items {
  padding-left: 2.5rem;
}

.archive-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  color: var(--text-color);
  text-decoration: none;
  transition: background 0.2s;
}

.archive-item:hover {
  background: var(--hover-bg);
}

.item-date {
  font-family: monospace;
  margin-right: 1rem;
  color: var(--vp-c-text-2);
}

.item-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .year-group {
    padding-left: 0;
  }

  .archive-items {
    padding-left: 1rem;
  }
}
</style>