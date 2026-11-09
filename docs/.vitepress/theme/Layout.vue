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
    <span v-if="!isDark" aria-hidden="true">🌙</span>
    <span v-else aria-hidden="true">☀️</span>
  </button>

  <!-- 回到顶部 | Back to Top -->
  <div class="back-to-top" :class="{ visible: showBackToTop }" aria-hidden="true" @click="scrollToTop">
    <span>↑</span>
  </div>

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
