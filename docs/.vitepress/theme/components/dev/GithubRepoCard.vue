<template>
  <div class="github-card" @mouseover="hover = true" @mouseleave="hover = false">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">Loading...</div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">Error: {{ error }}</div>

    <!-- 正常显示 -->
    <a
      v-else-if="repoData"
      :href="repoData.html_url"
      target="_blank"
      rel="noopener"
      class="card-content"
    >
      <!-- 左侧信息区 -->
      <div class="repo-info">
        <h3 class="repo-name">
          <!-- <RepositoryIcon class="icon" /> -->
          <svg class="icon" viewBox="0 0 16 16" width="16" height="16">
            <path :d="RepoIcon" />
          </svg>
          {{ owner }}/{{ repoData.name }}
        </h3>
        <p class="repo-description">{{ repoData.description || 'No description provided' }}</p>
        <div class="repo-meta">
          <span v-if="repoData.language" class="language">
            <span
              class="language-color"
              :style="{ backgroundColor: getLanguageColor(repoData.language) }"
            />
            {{ repoData.language }}
          </span>
          <span class="stars">
            <!-- <StarIcon class="icon" /> -->
            <svg class="icon" viewBox="0 0 16 16" width="16" height="16">
              <path :d="StarIcon" />
            </svg>
            {{ formatNumber(repoData.stargazers_count) }}
          </span>
          <span class="updated">
            Updated {{ formatDate(repoData.updated_at) }}
          </span>
        </div>
      </div>

      <!-- 右侧统计区 -->
      <div class="repo-stats">
        <div class="stat-item">
          <span class="stat-number">{{ formatNumber(repoData.forks_count) }}</span>
          <span class="stat-label">Forks</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ formatNumber(repoData.open_issues_count) }}</span>
          <span class="stat-label">Issues</span>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// 在模板中直接使用 SVG
const RepoIcon = `M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z`
const StarIcon = `M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 5.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z`

interface RepoData {
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  updated_at: string
}

interface CachedRepoData {
  data: RepoData
  timestamp: number
}

const props = defineProps({
  owner: {
    type: String,
    default: ''
  },
  repo: {
    type: String,
    default: ''
  },
  repoData: {
    type: Object as () => RepoData,
    default: null
  }
})

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
const hover = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const repoData = ref<RepoData | null>(props.repoData || null)
const cache = new Map<string, CachedRepoData>()
const CACHE_TTL = 30 * 60 * 1000 // 30 分钟

// 获取语言颜色（扩展了更多语言支持）
const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'Vue': '#41b883',
    'CSS': '#563d7c',
    'HTML': '#e34c26',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584'
  }
  return colors[language] || '#cccccc'
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

// 获取仓库数据
const fetchRepoData = async () => {
  if (import.meta.env.SSR) return

  loading.value = true
  error.value = null
  const cacheKey = `${props.owner}/${props.repo}`
  // console.log('GithubToken:'+GITHUB_TOKEN);

  try {
    const cachedRepoData = cache.get(cacheKey)
    if (cachedRepoData && Date.now() - cachedRepoData.timestamp < CACHE_TTL) {
      repoData.value = cachedRepoData.data
      return
    }

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, 5000)

    const response = await fetch(
      `https://api.github.com/repos/${props.owner}/${props.repo}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
          'User-Agent': 'GitHub-Repo-Card-Widget'
        },
        signal: abortController.signal
      }
    )

    clearTimeout(timeoutId)

    // TODO: 处理速率限制

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch repository data')
    }

    const data = await response.json()
    // 更新缓存
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    repoData.value = data


  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : 'Failed to fetch repository data'
  } finally {
    loading.value = false
  }
}

// 自动清理过期缓存
const cleanupCache = () => {
  const now = Date.now()
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}

// 每10分钟执行一次清理
setInterval(cleanupCache, 10 * 60 * 1000)

// 监听prop变化
watch(
  () => props.repoData,
  (newVal) => {
    if (newVal) repoData.value = newVal
  },
  { immediate: true }
)

onMounted(() => {
  if (!props.repoData) {
    if (!props.owner || !props.repo) {
      error.value = 'Missing owner or repository name'
      return
    }
    fetchRepoData()
  }
})
</script>

<style scoped>
/* 优化后的样式 */
.github-card {
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #fff;
  min-height: 120px;
  position: relative;
  overflow: hidden;
}

.github-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
}

.repo-info {
  flex: 1;
  min-width: 0;
}

.repo-name {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0969da;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-name .icon {
  flex-shrink: 0;
}

.repo-description {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #57606a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #57606a;
  flex-wrap: wrap;
}

/* 如果文字仍然有轻微偏移 */
.repo-meta span {
  line-height: 1;
}


.stars {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* 更精确控制图标位置 */
.stars svg {
  position: relative;
  top: -0.05em; /* 微调图标位置 */
}

.language-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.25rem;
  vertical-align: middle;
}

.repo-stats {
  display: flex;
  gap: 1.5rem;
  padding-left: 1rem;
  border-left: 1px solid #e1e4e8;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
}

.stat-number {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.25;
}

.stat-label {
  font-size: 0.75rem;
  color: #57606a;
}

.icon {
  color: #6a737d;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  flex-shrink: 0;
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

.loading {
  color: #57606a;
}

.error {
  color: #cf222e;
}

@media (max-width: 480px) {
  .card-content {
    flex-direction: column;
  }

  .repo-stats {
    border-left: none;
    border-top: 1px solid #e1e4e8;
    padding-left: 0;
    padding-top: 1rem;
    justify-content: space-around;
  }
}
</style>