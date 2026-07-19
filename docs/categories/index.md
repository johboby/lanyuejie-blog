---
title: 分类
---

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref({})

onMounted(async () => {
  try {
    const res = await fetch('/api/categories')
    if (res.ok) {
      categories.value = await res.json()
      return
    }
  } catch {}
  const base = import.meta.env.BASE_URL
  const modules = import.meta.glob('../posts/*.md', { eager: true })
  const catMap = {}
  Object.entries(modules).forEach(([path, mod]) => {
    if (path.endsWith('/index.md')) return
    const fm = mod.frontmatter || {}
    const cats = fm.categories || ['未分类']
    cats.forEach(cat => {
      if (!catMap[cat]) catMap[cat] = []
      catMap[cat].push({
        title: fm.title || path.split('/').pop().replace('.md', ''),
        link: base + path.replace('../', '').replace('.md', ''),
        date: fm.date ? new Date(fm.date).toLocaleDateString('zh-CN') : '',
      })
    })
  })
  categories.value = catMap
})
</script>

<div class="categories-page">
  <h1 class="page-title">分类</h1>

  <div class="category-grid">
    <div v-for="(posts, cat) in categories" :key="cat" class="category-card">
      <div class="category-header">
        <h2 class="category-name">{{ cat }}</h2>
        <span class="category-count">{{ posts.length }} 篇</span>
      </div>
      <ul class="category-posts">
        <li v-for="post in posts" :key="post.link">
          <a :href="post.link" class="post-link">{{ post.title }}</a>
          <span v-if="post.date" class="post-date">{{ post.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</div>

<style scoped>
.categories-page {
  max-width: 720px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
}

.category-grid {
  display: grid;
  gap: 24px;
}

.category-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px 24px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.category-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

.category-count {
  font-size: 13px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
  padding: 2px 10px;
  border-radius: 10px;
}

.category-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-posts li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.category-posts li + li {
  border-top: 1px solid var(--vp-c-divider);
}

.post-link {
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-size: 15px;
  transition: color 0.15s;
}

.post-link:hover {
  color: var(--vp-c-brand-1);
}

.post-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-left: 16px;
}
</style>
