<script setup>
import { computed, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
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

// BUILD_POSTS 已随 SSR HTML 内联，index.md / posts/index.md 直接读取即可。
// 这里仅在客户端挂载时把 window.__VP_POSTS__ 广播为事件，供同页监听者热更新。
onMounted(() => {
  if (typeof window === 'undefined') return
  const posts = Array.isArray(window.__VP_POSTS__) ? window.__VP_POSTS__ : []
  window.dispatchEvent(new CustomEvent('vp-posts-ready', { detail: posts }))
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
