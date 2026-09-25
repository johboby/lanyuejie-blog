<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import PostFeatures from './components/PostFeatures.vue'
import ReadingEnhance from './components/ReadingEnhance.vue'
import PostBreadcrumb from './components/PostBreadcrumb.vue'
import DocSidebar from './components/DocSidebar.vue'

const { Layout } = DefaultTheme
const { page } = useData()

const isPost = computed(() => {
  const path = page.value?.relativePath || ''
  return path.startsWith('posts/') && !path.endsWith('index.md')
})

// 预加载 data/posts.json：SSR 阶段 createContentLoader 数据为空，
// 客户端启动时把构建产物中的文章数据内联注入到 window.__VP_POSTS__，
// 让 index.md / posts/index.md 在 hydration 之前就能拿到真实文章列表。
const dataLoading = ref(true)

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.__VP_POSTS__) {
    dataLoading.value = false
    return
  }
  const url = withBase('/data/posts.json')
  fetch(url)
    .then(res => res.ok ? res.json() : [])
    .then(posts => {
      window.__VP_POSTS__ = Array.isArray(posts) ? posts : []
      dataLoading.value = false
    })
    .catch(() => {
      window.__VP_POSTS__ = []
      dataLoading.value = false
    })
})

onBeforeUnmount(() => {
  // noop: fetch 是 fire-and-forget，由 window 持有引用
})
</script>

<template>
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
