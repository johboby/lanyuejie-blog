<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter } = useData()
const base = import.meta.env.BASE_URL

const date = computed(() => {
  if (!frontmatter.value.date) return ''
  return new Date(frontmatter.value.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const tags = computed(() => frontmatter.value.tags || [])
const categories = computed(() => frontmatter.value.categories || [])
</script>

<template>
  <div v-if="frontmatter.title && frontmatter.date" class="post-header">
    <h1 class="post-title">{{ frontmatter.title }}</h1>
    <div class="post-info">
      <span v-if="date" class="info-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        {{ date }}
      </span>
      <a v-for="cat in categories" :key="cat" :href="base + 'categories/'" class="info-item info-category">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        {{ cat }}
      </a>
    </div>
    <div v-if="tags.length" class="post-tags">
      <a v-for="tag in tags" :key="tag" :href="base + 'tags/#' + encodeURIComponent(tag)" class="tag">{{ tag }}</a>
    </div>
  </div>
</template>

<style scoped>
.post-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.post-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.info-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.info-item svg { color: var(--vp-c-text-3); }

.info-category {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: opacity 0.2s;
}

.info-category:hover { opacity: 0.8; }

.post-tags { display: flex; gap: 6px; flex-wrap: wrap; }

.tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.tag:hover { background: var(--vp-c-brand-1); color: #fff; }

@media (max-width: 640px) {
  .post-title { font-size: 1.5rem; }
}
</style>
