<script setup>
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import PostFeatures from './components/PostFeatures.vue'

const { Layout } = DefaultTheme
const { page } = useData()

const isPost = computed(() => {
  const path = page.value?.relativePath || ''
  return path.startsWith('posts/') && !path.endsWith('index.md')
})
</script>

<template>
  <Layout>
    <template #doc-bottom>
      <PostFeatures v-if="isPost" />
    </template>
  </Layout>
</template>
