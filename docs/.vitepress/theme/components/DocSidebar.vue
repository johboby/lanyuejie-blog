<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const headings = computed(() => {
  const h = page.value?.headings || []
  // Only h2 and h3 for outline
  return h.filter(x => x.level === 2 || x.level === 3).map(h => ({
    text: h.text,
    level: h.level,
    slug: h.slug || h.text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/(^-|-$)/g, '')
  }))
})

const activeSlug = ref('')
let observer = null

// 一次性挂载 IntersectionObserver；不要挂在 scroll 上——之前每个 tick 都
// disconnect + 重建 observer，导致 CPU 抖动、滚动卡顿、IO 事件流错乱。
// IntersectionObserver 本身就是为 scroll-spy 设计的（观察元素进出视口），
// 滚动只是自然触发 IO 回调的方式，不需要 JS 侧再监听。
function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeSlug.value = entry.target.id
    }
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 })

  for (const h of headings.value) {
    const el = document.getElementById(h.slug)
    if (el) observer.observe(el)
  }
}

onMounted(() => {
  // 页面渲染后再挂一次：VitePress 的 h2/h3 由 Vue 动态插入 DOM，
  // setTimeout 保证 DOM 已经就位再抓 element 引用。
  setTimeout(setupObserver, 300)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  observer = null
})

// 页面路由切换时 VitePress 会重跑 watch + headings 会变化；重新建 observer。
watch(headings, () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  setTimeout(setupObserver, 300)
})

function scrollTo(slug) {
  const el = document.getElementById(slug)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeSlug.value = slug
  }
}

const isVisible = computed(() => headings.value.length > 0)
</script>

<template>
  <aside v-if="isVisible" class="doc-sidebar" aria-label="页面大纲">
    <h4 class="doc-sidebar-title">页面大纲</h4>
    <nav class="doc-sidebar-nav">
      <a
        v-for="h in headings"
        :key="h.slug"
        :href="'#' + h.slug"
        class="doc-sidebar-link"
        :class="{ active: activeSlug === h.slug, 'doc-sidebar-link-h3': h.level === 3 }"
        @click.prevent="scrollTo(h.slug)"
      >{{ h.text }}</a>
    </nav>
  </aside>
</template>