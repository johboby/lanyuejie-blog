---
title: 分类
---

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref({})

onMounted(async () => {
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
        tags: fm.tags || [],
      })
    })
  })
  categories.value = catMap
})
</script>

<div class="categories-page">
  <h1 class="page-title">分类</h1>
  <p class="page-desc">按研究领域浏览文章</p>

  <div class="category-grid">
    <div v-for="(posts, cat) in categories" :key="cat" class="category-card">
      <div class="category-header">
        <h2 class="category-name">{{ cat }}</h2>
        <span class="category-count">{{ posts.length }} 篇</span>
      </div>
      <ul class="category-posts">
        <li v-for="post in posts" :key="post.link">
          <a :href="post.link" class="post-link">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-meta-row">
              <span v-if="post.date" class="post-date">{{ post.date }}</span>
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="post-tag">{{ tag }}</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

<style scoped>
.categories-page { max-width: 780px; margin: 0 auto; }
.page-title { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
.page-desc { color: var(--vp-c-text-2); font-size: 15px; margin-bottom: 2rem; }

.category-grid { display: grid; gap: 20px; }

.category-card {
  border: 1px solid var(--vp-c-divider); border-radius: 14px;
  padding: 24px; transition: border-color 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.category-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.category-name { font-size: 1.1rem; font-weight: 700; margin: 0; }

.category-count {
  font-size: 12px; color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft); padding: 2px 10px; border-radius: 10px;
}

.category-posts { list-style: none; padding: 0; margin: 0; }

.category-posts li {
  border-top: 1px solid var(--vp-c-divider);
}

.category-posts li:first-child { border-top: none; }

.post-link {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; text-decoration: none; color: inherit;
  transition: color 0.15s;
}

.post-link:hover { color: var(--vp-c-brand-1); }

.post-title { font-size: 15px; font-weight: 500; flex: 1; min-width: 0; }

.post-meta-row {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: 16px;
}

.post-date { font-size: 12px; color: var(--vp-c-text-3); }

.post-tag {
  font-size: 11px; padding: 1px 8px; border-radius: 10px;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .post-link { flex-direction: column; align-items: flex-start; gap: 6px; }
  .post-meta-row { margin-left: 0; }
}
</style>
