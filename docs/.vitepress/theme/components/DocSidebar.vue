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

function refreshObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSlug.value = entry.target.id
      }
    })
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 })

  headings.value.forEach(h => {
    const el = document.getElementById(h.slug)
    if (el) observer.observe(el)
  })
}

onMounted(() => {
  // Small delay to ensure DOM is rendered
  setTimeout(refreshObserver, 300)
  window.addEventListener('scroll', refreshObserver, { passive: true })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  window.removeEventListener('scroll', refreshObserver)
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