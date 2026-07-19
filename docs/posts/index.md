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

const tagMap = computed(() => {
  const map = {}
  posts.value.forEach(p => {
    p.tags.forEach(t => {
      map[t] = (map[t] || 0) + 1
    })
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
})

const categoryStats = computed(() => {
  const map = {}
  posts.value.forEach(p => {
    p.categories.forEach(c => {
      map[c] = (map[c] || 0) + 1
    })
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
})

const totalPosts = computed(() => posts.value.length)

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

<div class="posts-layout">
  <div class="posts-main">
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

  <aside class="posts-aside">
    <div class="widget">
      <h3 class="widget-title">统计</h3>
      <div class="stat-row">
        <span class="stat-num">{{ totalPosts }}</span>
        <span class="stat-text">篇文章</span>
      </div>
      <div class="stat-row">
        <span class="stat-num">{{ categoryStats.length }}</span>
        <span class="stat-text">个分类</span>
      </div>
      <div class="stat-row">
        <span class="stat-num">{{ tagMap.length }}</span>
        <span class="stat-text">个标签</span>
      </div>
    </div>

    <div v-if="categoryStats.length" class="widget">
      <h3 class="widget-title">分类</h3>
      <div class="cat-list">
        <a
          v-for="[cat, count] in categoryStats"
          :key="cat"
          :class="['cat-item', { active: selectedCategory === cat }]"
          @click="selectedCategory = selectedCategory === cat ? '全部' : cat"
        >
          <span class="cat-name">{{ cat }}</span>
          <span class="cat-count">{{ count }}</span>
        </a>
      </div>
    </div>

    <div v-if="tagMap.length" class="widget">
      <h3 class="widget-title">标签</h3>
      <div class="tag-cloud">
        <a
          v-for="[tag, count] in tagMap"
          :key="tag"
          :href="withBase('/tags/#' + encodeURIComponent(tag))"
          class="cloud-tag"
        >{{ tag }}</a>
      </div>
    </div>

    <div class="widget">
      <h3 class="widget-title">联系合作</h3>
      <a href="mailto:samhoclub@163.com" class="contact-btn">samhoclub@163.com</a>
    </div>
  </aside>
</div>

<style scoped>
.posts-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 2rem;
  max-width: 1080px;
  margin: 0 auto;
}

.posts-main { min-width: 0; }
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

.posts-aside {
  position: sticky;
  top: 72px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
}

.widget-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  letter-spacing: 0.02em;
}

.stat-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
}

.stat-row:last-child { margin-bottom: 0; }

.stat-num {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-text {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
}

.cat-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
  color: inherit;
}

.cat-item:hover { background: var(--vp-c-default-soft); }

.cat-item.active {
  background: var(--vp-c-brand-soft);
}

.cat-name {
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.cat-item.active .cat-name { color: var(--vp-c-brand-1); }

.cat-count {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
  padding: 1px 6px;
  border-radius: 8px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cloud-tag {
  font-size: 0.78rem;
  padding: 2px 10px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.cloud-tag:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.contact-btn {
  display: block;
  text-align: center;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: opacity 0.2s;
}

.contact-btn:hover { opacity: 0.85; }

@media (max-width: 900px) {
  .posts-layout {
    grid-template-columns: 1fr;
  }
  .posts-aside {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .post-item { padding: 16px 8px; }
  .post-item-title { font-size: 15px; }
  .posts-aside {
    grid-template-columns: 1fr;
  }
}
</style>
