---
title: 文章列表
---

<script setup>
import { ref, onMounted, computed } from 'vue'
import { withBase } from 'vitepress'

const posts = ref([])
const selectedCategory = ref('全部')
const searchQuery = ref('')

onMounted(async () => {
  const modules = import.meta.glob('../posts/*.md', { eager: true })
  const items = Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || {}
      const slug = path.replace(/^\.\.\/posts\//, '').replace(/\.md$/, '')
      return {
        title: fm.title || slug,
        date: fm.date ? new Date(fm.date).toLocaleDateString('zh-CN') : '',
        rawDate: fm.date || '',
        tags: fm.tags || [],
        categories: fm.categories || [],
        excerpt: fm.description || '',
        link: withBase('/posts/' + slug),
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
  let result = posts.value
  if (selectedCategory.value !== '全部') {
    result = result.filter(p => p.categories.includes(selectedCategory.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  return result
})
</script>

<div class="posts-page">
  <h1 class="page-title">文章</h1>
  <p class="page-desc">探索AI、风控与产业智能的前沿研究</p>

  <div class="search-box">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input v-model="searchQuery" type="text" placeholder="搜索文章..." class="search-input" />
  </div>

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
          <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="meta-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="post-item-arrow">→</div>
    </a>
  </div>

  <div v-else class="empty-state">
    <p>暂无匹配文章</p>
  </div>
</div>

<style scoped>
.posts-page { max-width: 720px; margin: 0 auto; }
.page-title { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
.page-desc { color: var(--vp-c-text-2); font-size: 15px; margin-bottom: 1.5rem; }

.search-box { position: relative; margin-bottom: 1.5rem; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--vp-c-text-3); pointer-events: none; }

.search-input {
  width: 100%; padding: 10px 14px 10px 40px; border-radius: 10px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
  font-size: 14px; color: var(--vp-c-text-1); outline: none;
  transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
}

.search-input:focus { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 3px var(--vp-c-brand-soft); }
.search-input::placeholder { color: var(--vp-c-text-3); }

.category-filter { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 2rem; }

.filter-btn {
  padding: 4px 14px; border-radius: 20px;
  border: 1px solid var(--vp-c-divider); background: transparent;
  color: var(--vp-c-text-2); font-size: 13px; cursor: pointer; transition: all 0.2s;
}

.filter-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.filter-btn.active { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }

.post-list { display: flex; flex-direction: column; gap: 2px; }

.post-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 16px; border-radius: 10px; text-decoration: none; color: inherit; transition: background 0.15s;
}

.post-item:hover { background: var(--vp-c-default-soft); }
.post-item-main { flex: 1; min-width: 0; }
.post-item-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; letter-spacing: -0.01em; }

.post-item-excerpt {
  font-size: 14px; color: var(--vp-c-text-2); margin-bottom: 8px;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  overflow: hidden; line-height: 1.5;
}

.post-item-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.meta-date { font-size: 13px; color: var(--vp-c-text-3); }
.meta-tag { font-size: 12px; padding: 1px 8px; border-radius: 10px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }

.post-item-arrow { font-size: 18px; color: var(--vp-c-text-3); margin-left: 16px; transition: transform 0.15s, color 0.15s; }
.post-item:hover .post-item-arrow { transform: translateX(4px); color: var(--vp-c-brand-1); }

.empty-state { text-align: center; padding: 4rem 0; color: var(--vp-c-text-3); }

@media (max-width: 640px) {
  .post-item { padding: 16px 8px; }
  .post-item-title { font-size: 15px; }
}
</style>
