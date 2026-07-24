---
title: 文章列表
---

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { data as allPosts } from '../.vitepress/posts.data.js'
import { withBase } from 'vitepress'

const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE || 'http://localhost:3001')
const PAGE_SIZE = 6

const query = ref('')
const category = ref('')
const activeTag = ref('')
const page = ref(1)
const loading = ref(false)
const error = ref('')
const total = ref(0)
const remotePosts = ref(null)

// Local fallback data (from SSG content loader)
const localPosts = computed(() => allPosts || [])

// Unique tags for filter bar
const allTags = computed(() => {
  const set = new Map()
  localPosts.value.forEach(p => (p.tags || []).forEach(t => set.set(t, (set.get(t) || 0) + 1)))
  return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
})

const categories = computed(() => {
  const map = new Map()
  localPosts.value.forEach(p => (p.categories || ['未分类']).forEach(c => map.set(c, (map.get(c) || 0) + 1)))
  return [...map.entries()].map(([name, count]) => ({ name, count }))
})

// Posts currently shown (remote if available, else local filtered)
const displayPosts = computed(() => {
  if (remotePosts.value) return remotePosts.value
  let list = localPosts.value
  if (category.value) list = list.filter(p => (p.categories || []).includes(category.value))
  if (activeTag.value) list = list.filter(p => (p.tags || []).includes(activeTag.value))
  if (query.value.trim()) {
    const q = query.value.toLowerCase()
    list = list.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }
  total.value = list.length
  const start = (page.value - 1) * PAGE_SIZE
  return list.slice(start, start + PAGE_SIZE)
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const pageNumbers = computed(() => {
  const t = totalPages.value
  const cur = page.value
  const out = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(t, cur + 2); i++) out.push(i)
  return out
})

let debounceTimer = null
function onSearchInput() {
  page.value = 1
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchFromApi, 350)
}

async function fetchFromApi() {
  // Only call backend when filters are active; otherwise rely on SSG data
  const hasFilters = query.value.trim() || category.value || activeTag.value
  if (!hasFilters) {
    remotePosts.value = null
    error.value = ''
    total.value = localPosts.value.length
    return
  }
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams()
    if (query.value.trim()) params.set('q', query.value.trim())
    if (category.value) params.set('category', category.value)
    if (activeTag.value) params.set('tag', activeTag.value)
    params.set('page', String(page.value))
    params.set('pageSize', String(PAGE_SIZE))
    const res = await fetch(`${API_BASE}/posts?${params.toString()}`)
    if (!res.ok) throw new Error('请求失败')
    const data = await res.json()
    remotePosts.value = (data.posts || []).map(normalize)
    total.value = data.total || remotePosts.value.length
  } catch (e) {
    // Graceful fallback: filter locally
    remotePosts.value = null
    error.value = ''
  } finally {
    loading.value = false
  }
}

function normalize(p) {
  const date = p.date ? new Date(p.date).toLocaleDateString('zh-CN') : null
  return {
    title: p.title,
    url: withBase(`/posts/${p.slug}.html`),
    date,
    readTime: p.readTime || (p.wordCount ? `${Math.max(1, Math.ceil(p.wordCount / 500))} 分钟` : ''),
    excerpt: p.description || p.excerpt || '',
    tags: p.tags || [],
    hasLongContent: (p.wordCount || 0) > 3000,
  }
}

function selectCategory(cat) {
  category.value = category.value === cat ? '' : cat
  page.value = 1
  fetchFromApi()
}
function selectTag(tag) {
  activeTag.value = activeTag.value === tag ? '' : tag
  page.value = 1
  fetchFromApi()
}
function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  fetchFromApi()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function retry() { fetchFromApi() }

watch([category, activeTag], () => { /* handled in select fns */ })
onMounted(() => { total.value = localPosts.value.length })
</script>

<div class="archive">
  <div class="archive-head">
    <h1 class="archive-title">研究文章</h1>
    <p class="archive-sub">行业深度报告、技术前沿洞察与跨领域研究合集</p>
  </div>

  <div class="archive-toolbar">
    <div class="search-box">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        type="search"
        v-model="query"
        @input="onSearchInput"
        placeholder="搜索标题、标签或摘要…"
        aria-label="搜索文章"
      />
    </div>
    <select class="filter-select" :value="category" @change="selectCategory($event.target.value)" aria-label="按分类筛选">
      <option value="">全部分类</option>
      <option v-for="c in categories" :key="c.name" :value="c.name">{{ c.name }} ({{ c.count }})</option>
    </select>
  </div>

  <div class="tag-bar" v-if="allTags.length">
    <button
      v-for="tag in allTags"
      :key="tag"
      class="tag-chip"
      :class="{ active: activeTag === tag }"
      @click="selectTag(tag)"
      :aria-pressed="activeTag === tag"
    >{{ tag }}</button>
  </div>

  <div v-if="loading" class="state-loading" role="status" aria-live="polite">正在加载…</div>

  <div v-else-if="displayPosts.length" class="post-list">
    <a v-for="post in displayPosts" :key="post.url" :href="post.url" class="post-row">
      <h2 class="post-row-title">{{ post.title }}</h2>
      <div class="post-row-meta">
        <span v-if="post.date">{{ post.date }}</span>
        <span v-if="post.readTime">{{ post.readTime }}</span>
        <span v-if="post.hasLongContent" class="post-badge">长文</span>
      </div>
      <p v-if="post.excerpt" class="post-row-excerpt">{{ post.excerpt }}</p>
      <div v-if="post.tags && post.tags.length" class="post-row-tags">
        <span v-for="tag in post.tags.slice(0,4)" :key="tag" class="post-row-tag">{{ tag }}</span>
      </div>
    </a>
  </div>

  <div v-else class="state-empty">
    <p>没有找到匹配的文章。</p>
    <p>试试调整关键词或清除筛选条件。</p>
  </div>

  <nav class="pagination" v-if="totalPages > 1" aria-label="分页">
    <button class="page-btn" @click="goPage(page - 1)" :disabled="page === 1" aria-label="上一页">‹</button>
    <button
      v-for="n in pageNumbers"
      :key="n"
      class="page-btn"
      :class="{ active: n === page }"
      @click="goPage(n)"
      :aria-current="n === page ? 'page' : undefined"
    >{{ n }}</button>
    <button class="page-btn" @click="goPage(page + 1)" :disabled="page === totalPages" aria-label="下一页">›</button>
  </nav>
</div>
