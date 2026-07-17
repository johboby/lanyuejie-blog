---
title: 文章列表
---

<script setup>
import { ref, onMounted, computed } from 'vue'

const posts = ref([])
const selectedCategory = ref('全部')

onMounted(async () => {
  try {
    const res = await fetch('/api/posts')
    if (res.ok) {
      posts.value = await res.json()
      return
    }
  } catch {}
  const modules = import.meta.glob('../posts/*.md', { eager: true })
  const items = Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || {}
      return {
        title: fm.title || path.split('/').pop().replace('.md', ''),
        date: fm.date ? new Date(fm.date).toLocaleDateString('zh-CN') : '',
        rawDate: fm.date || '',
        tags: fm.tags || [],
        categories: fm.categories || [],
        excerpt: fm.description || '',
        link: path.replace('../', '/').replace('.md', ''),
      }
    })
    .sort((a, b) => (a.rawDate > b.rawDate ? -1 : 1))
  posts.value = items
})

const allCategories = computed(() => {
  const cats = new Set()
  posts.value.forEach(p => p.categories.forEach(c => cats.add(c)))
  return ['全部', ...cats]
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === '全部') return posts.value
  return posts.value.filter(p => p.categories.includes(selectedCategory.value))
})
</script>

<div class="posts-page">
  <h1 class="page-title">文章</h1>

  <div v-if="allCategories.length > 1" class="category-filter">
    <button
      v-for="cat in allCategories"
      :key="cat"
      :class="['filter-btn', { active: selectedCategory === cat }]"
      @click="selectedCategory = cat"
    >{{ cat }}</button>
  </div>

  <div v-if="filteredPosts.length" class="post-list">
    <a v-for="post in filteredPosts" :key="post.link" :href="post.link" class="post-item">
      <div class="post-item-main">
        <div class="post-item-title">{{ post.title }}</div>
        <div v-if="post.excerpt" class="post-item-excerpt">{{ post.excerpt }}</div>
        <div class="post-item-meta">
          <span v-if="post.date" class="meta-date">{{ post.date }}</span>
          <span v-for="tag in post.tags" :key="tag" class="meta-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="post-item-arrow">→</div>
    </a>
  </div>

  <div v-else class="empty-state">
    <p>暂无文章</p>
  </div>
</div>

<style scoped>
.posts-page {
  max-width: 720px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
}

.post-item:hover {
  background: var(--vp-c-default-soft);
}

.post-item-main {
  flex: 1;
  min-width: 0;
}

.post-item-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.post-item-excerpt {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.post-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.meta-tag {
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.post-item-arrow {
  font-size: 18px;
  color: var(--vp-c-text-3);
  margin-left: 16px;
  transition: transform 0.15s, color 0.15s;
}

.post-item:hover .post-item-arrow {
  transform: translateX(4px);
  color: var(--vp-c-brand-1);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .post-item { padding: 16px 8px; }
  .post-item-title { font-size: 15px; }
}
</style>
