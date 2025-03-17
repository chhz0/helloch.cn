<template>
  <div
    class="border rounded-lg p-4 transition-all duration-300 ease-in-out"
    :class="[
      'bg-white dark:bg-gray-900',
      'border-gray-200 dark:border-gray-700',
      'hover:shadow-lg hover:-translate-y-1'
    ]"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="text-gray-500 dark:text-gray-400 p-4 text-center">
      Loading...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-red-500 dark:text-red-400 p-4 text-center">
      Error: {{ error }}
    </div>

    <!-- 正常显示 -->
    <a
      v-else-if="repoData"
      :href="repoData.html_url"
      target="_blank"
      rel="noopener"
      class="flex gap-3 no-underline text-gray-800 dark:text-gray-200 hover:text-inherit"
    >
      <div class="flex-3 min-w-0">
        <div class="flex items-baseline gap-3 mb-1">
          <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16">
            <path :d="RepoIcon" fill="currentColor" />
          </svg>
          <h3 class="text-base font-medium truncate" :style="{ color: repoData.language ? getLanguageColor(repoData.language) : 'inherit' }">
            {{ owner }}/{{ repoData.name }}
          </h3>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 h-[3.5em] overflow-hidden leading-snug">
          {{ repoData.description || 'No description provided' }}
        </p>

        <div class="flex flex-wrap gap-4 items-center text-sm min-h-[24px]">
          <span
            v-if="repoData.language"
            class="flex items-center gap-1 flex-shrink-0"
            :style="{ color: getLanguageColor(repoData.language) }"
          >
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getLanguageColor(repoData.language) }"
            />
            {{ repoData.language }}
          </span>

          <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 16 16">
              <path :d="StarIcon" fill="currentColor" />
            </svg>
            {{ formatNumber(repoData.stargazers_count) }}
          </span>

          <span class="text-gray-500 dark:text-gray-400">
            Updated {{ formatDate(repoData.updated_at) }}
          </span>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

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
const loading = ref(false)
const error = ref<string | null>(null)
const repoData = ref<RepoData | null>(props.repoData || null)
const cache = new Map<string, CachedRepoData>()
const CACHE_TTL = 30 * 60 * 1000 // 30 分钟

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

const fetchRepoData = async () => {
  if (import.meta.env.SSR) return

  loading.value = true
  error.value = null
  const cacheKey = `${props.owner}/${props.repo}`

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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to fetch repository data')
    }

    const data = await response.json()
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

const cleanupCache = () => {
  const now = Date.now()
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}

setInterval(cleanupCache, 10 * 60 * 1000)

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