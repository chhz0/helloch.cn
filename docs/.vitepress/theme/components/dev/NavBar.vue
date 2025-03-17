<script setup lang="ts">
import { useRouter } from 'vitepress'
import { computed } from 'vue'

const router = useRouter()

interface NavItem {
  svgPath: string
  text: string
  link: string
}

const props = defineProps<{
  items: NavItem[]
}>()

const currentPath = computed(() => router.route.path)

const navigate = (link: string) => {
  if (link.startsWith('http')) {
    window.open(link, '_blank')
  } else {
    router.go(link)
  }
}
</script>

<template>
  <div class="VpNavBar">
    <div
      v-for="item in items"
      :key="item.link"
      class="nav-item"
      :class="{ active: currentPath === item.link }"
      @click="navigate(item.link)"
    >
      <img class="icon" :src="item.svgPath" />
      <span class="text">{{ item.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.VpNavBar {
  display: flex;
  gap: 1rem;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s;
  color: var(--vp-c-text-2);
}

.nav-item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.nav-item.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.icon {
  flex-shrink: 0;
}

.text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}
</style>