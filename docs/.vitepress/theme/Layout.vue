<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import PostFeatures from './components/PostFeatures.vue'
import ReadingEnhance from './components/ReadingEnhance.vue'
import PostBreadcrumb from './components/PostBreadcrumb.vue'
import DocSidebar from './components/DocSidebar.vue'

const { Layout } = DefaultTheme
const { page, title } = useData()

const isPost = computed(() => {
  const path = page.value?.relativePath || ''
  return path.startsWith('posts/') && !path.endsWith('index.md')
})

// 暗黑模式 | Dark mode toggle
const isDark = ref(false)
const prefersDark = computed(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-vp-theme', 'dark')
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.removeAttribute('data-vp-theme')
    document.documentElement.classList.remove('dark')
  }
  try {
    if (window.localStorage) {
      localStorage.setItem('theme-preference', isDark.value ? 'dark' : 'light')
    }
  } catch (e) {}
}

onMounted(() => {
  try {
    const stored = localStorage.getItem('theme-preference')
    isDark.value = stored === 'dark' || (!stored && prefersDark.value)
    if (isDark.value) {
      document.documentElement.setAttribute('data-vp-theme', 'dark')
      document.documentElement.classList.add('dark')
    }
  } catch (e) {}

  // 文章数据：SSR 阶段 createContentLoader 数据为空，客户端启动时加载
  if (typeof window === 'undefined') return
  if (window.__VP_POSTS__) return
  const url = withBase('/data/posts.json')
  fetch(url)
    .then(res => res.ok ? res.json() : [])
    .then(posts => {
      window.__VP_POSTS__ = Array.isArray(posts) ? posts : []
    })
    .catch(() => { window.__VP_POSTS__ = [] })
})

onBeforeUnmount(() => {})

// 阅读进度条 | Reading Progress Bar
const progressWidth = ref(0)
let scrollListener = null
onMounted(() => {
  const onScroll = () => {
    if (typeof window === 'undefined') return
    const doc = document.documentElement
    const scrollTop = doc.scrollTop || document.body.scrollTop
    const documentHeight = doc.scrollHeight - doc.clientHeight
    const pct = documentHeight > 0 ? Math.min(100, (scrollTop / documentHeight) * 100) : 0
    progressWidth.value = pct
  }
  scrollListener = onScroll
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && scrollListener) window.removeEventListener('scroll', scrollListener)
})

// 回到顶部 | Back to top
const showBackToTop = ref(false)
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
onMounted(() => {
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    showBackToTop.value = scrollTop > 400
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})
</script>

<template>
  <!-- 阅读进度条 | Reading Progress -->
  <div class="reading-progress" aria-hidden="true">
    <div :style="{ width: progressWidth + '%' }" style="height: 100%; transition: width 0.1s;"></div>
  </div>

  <!-- 主题切换 | Theme Toggle -->
  <button class="theme-toggle" aria-label="切换主题" @click="toggleTheme" type="button">
    <svg v-if="!isDark" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    <svg v-else aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  </button>

  <!-- 回到顶部 | Back to Top -->
  <button type="button" class="back-to-top" :class="{ visible: showBackToTop }" :aria-hidden="showBackToTop ? 'false' : 'true'" aria-label="回到顶部" @click="scrollToTop">
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>

  <Layout>
    <template #doc-before>
      <PostBreadcrumb v-if="isPost" />
      <ReadingEnhance v-if="isPost" />
    </template>
    <template #doc-bottom>
      <PostFeatures v-if="isPost" />
    </template>
    <template #doc-sidebar>
      <DocSidebar v-if="isPost" />
    </template>
  </Layout>
</template>
