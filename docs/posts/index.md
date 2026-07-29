---
title: 文章列表
---

<script setup>
import { ref, computed, onMounted } from 'vue'
import { data as allPosts } from '../.vitepress/posts.data.js'
import { withBase } from 'vitepress'

// 静态站点（GitHub Pages）没有后端，所有筛选/搜索均基于 SSG 注入的本地数据，
// 保证生产环境零网络依赖、稳定可用。
const PAGE_SIZE = 6

const query = ref('')
const category = ref('')
const activeTag = ref('')
const page = ref(1)
const total = ref(0)

// Local data (from SSG content loader)
const localPosts = computed(() => (allPosts || []).map(normalize))

function normalize(p) {
  const date = p.date ? new Date(p.date).toLocaleDateString('zh-CN') : null
  return {
    title: p.title,
    url: withBase(p.url),
    date,
    readTime: p.readTime || (p.wordCount ? `${Math.max(1, Math.ceil(p.wordCount / 500))} 分钟` : ''),
    excerpt: p.excerpt || p.description || '',
    tags: p.tags || [],
    categories: p.categories || [],
    hasLongContent: (p.wordCount || 0) > 3000,
  }
}

// Unique tags for filter bar (sorted by frequency, most useful first)
const allTags = computed(() => {
  const set = new Map()
  localPosts.value.forEach(p => (p.tags || []).forEach(t => set.set(t, (set.get(t) || 0) + 1)))
  return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
})
const VISIBLE_TAGS = 12
const tagsExpanded = ref(false)
const visibleTags = computed(() =>
  tagsExpanded.value ? allTags.value : allTags.value.slice(0, VISIBLE_TAGS)
)
const hasMoreTags = computed(() => allTags.value.length > VISIBLE_TAGS)

// Categories, sorted by frequency; foldable panel collapsed by default
const categories = computed(() => {
  const map = new Map()
  localPosts.value.forEach(p => (p.categories || ['未分类']).forEach(c => map.set(c, (map.get(c) || 0) + 1)))
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})
const catsExpanded = ref(false)
const activeCatLabel = computed(() => category.value || '全部分类')
function toggleCats() { catsExpanded.value = !catsExpanded.value }

// Posts currently shown — always filtered locally for consistency across dev/prod
const filteredPosts = computed(() => {
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
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)))
const displayPosts = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})
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
  debounceTimer = setTimeout(() => { total.value = filteredPosts.value.length }, 200)
}

function selectCategory(cat) {
  category.value = category.value === cat ? '' : cat
  page.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function selectTag(tag) {
  activeTag.value = activeTag.value === tag ? '' : tag
  page.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
    <button
      class="filter-toggle"
      :class="{ active: category }"
      @click="toggleCats"
      :aria-expanded="catsExpanded"
      aria-label="按分类筛选"
    >
      <span>{{ activeCatLabel }}</span>
      <svg class="chevron" :class="{ open: catsExpanded }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
  </div>

  <div class="cat-panel" v-show="catsExpanded" v-if="categories.length">
    <button
      v-for="c in categories"
      :key="c.name"
      class="cat-chip"
      :class="{ active: category === c.name }"
      @click="selectCategory(c.name)"
      :aria-pressed="category === c.name"
    >{{ c.name }} <span class="cat-count">{{ c.count }}</span></button>
  </div>

  <div class="tag-bar" v-if="allTags.length">
    <button
      v-for="tag in visibleTags"
      :key="tag"
      class="tag-chip"
      :class="{ active: activeTag === tag }"
      @click="selectTag(tag)"
      :aria-pressed="activeTag === tag"
    >{{ tag }}</button>
    <button v-if="hasMoreTags" class="tag-chip tag-more" @click="tagsExpanded = !tagsExpanded">
      {{ tagsExpanded ? '收起' : `更多 ${allTags.length - VISIBLE_TAGS} 个` }}
    </button>
  </div>

  <div class="filter-status" v-if="category || activeTag || query.trim()">
    <span>已筛选：<template v-if="category">{{ category }}</template><template v-if="activeTag"> · {{ activeTag }}</template><template v-if="query.trim()"> · “{{ query.trim() }}”</template></span>
    <button class="clear-filter" @click="category='';activeTag='';query='';page=1;total=filteredPosts.length">清除筛选</button>
  </div>

  <div v-if="displayPosts.length" class="post-list">
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
