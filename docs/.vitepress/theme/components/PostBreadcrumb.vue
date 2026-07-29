<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, frontmatter } = useData()

const postTitle = computed(() => frontmatter.value?.title || page.value?.title || '')
const categories = computed(() => frontmatter.value?.categories || [])
const postDate = computed(() => {
  const d = frontmatter.value?.date
  if (!d) return ''
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return String(d)
  return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`
})
</script>

<template>
  <div class="post-head">
    <nav class="post-breadcrumb" aria-label="面包屑导航">
      <a :href="withBase('/')" class="crumb">首页</a>
      <span class="crumb-sep" aria-hidden="true">›</span>
      <a :href="withBase('/posts/')" class="crumb">文章</a>
      <span class="crumb-sep" aria-hidden="true">›</span>
      <span class="crumb crumb-current" aria-current="page">{{ postTitle }}</span>
    </nav>

    <div v-if="categories.length || postDate" class="post-meta-line">
      <a
        v-for="cat in categories"
        :key="cat"
        :href="withBase('/posts/')"
        class="post-cat-chip"
      >{{ cat }}</a>
      <span v-if="postDate" class="post-date">{{ postDate }}</span>
    </div>
  </div>
</template>

<style scoped>
.post-head { margin-bottom: 1.2rem; }
.post-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 0.7rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
}
.crumb {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.18s var(--easing);
}
.crumb:hover {
  color: var(--brand-primary);
}
.crumb-sep {
  color: var(--vp-c-divider);
}
.crumb-current {
  color: var(--vp-c-text-3);
  max-width: 60vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.post-meta-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.post-cat-chip {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.18rem 0.6rem;
  border-radius: var(--radius-full);
  background: var(--vp-c-brand-soft);
  color: var(--brand-primary);
  text-decoration: none;
  transition: background 0.18s var(--easing);
}
.post-cat-chip:hover {
  background: var(--brand-accent-soft);
}
.post-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
</style>
