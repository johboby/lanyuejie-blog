---
title: 文章列表
layout: page
---

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { data as loaderPosts } from '../.vitepress/posts.data.js'
import { POSTS } from '../posts-list.generated.js'
import { withBase } from 'vitepress'

function getSourcePosts() {
  if (typeof window !== 'undefined' && window.__VP_POSTS__ && window.__VP_POSTS__.length) {
    return window.__VP_POSTS__
  }
  if (POSTS.length) return POSTS
  return loaderPosts.value || []
}

const PAGE_SIZE = 6
const query = ref('')
const category = ref('')
const activeTag = ref('')
const page = ref(1)
const total = ref(0)

function toStrArray(v) {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  if (typeof v === 'string') return v.split(/[,/]/).map(s => s.trim()).filter(Boolean)
  return []
}

const localPosts = computed(() => getSourcePosts().map(normalize))

function normalize(p) {
  if (!p) return { title: '', url: '', date: null, readTime: '', excerpt: '', tags: [], categories: [], hasLongContent: false }
  const date = p.date ? fmtDate(p.date) : null
  return {
    title: p.title,
    url: withBase(p.url),
    date,
    readTime: p.readTime || (p.wordCount ? `${Math.max(1, Math.ceil(p.wordCount / 500))} 分钟` : ''),
    excerpt: p.excerpt || p.description || '',
    tags: toStrArray(p.tags),
    categories: toStrArray(p.categories),
    hasLongContent: p.hasLongContent !== undefined ? p.hasLongContent : (p.wordCount || 0) > 3000,
  }
}

function fmtDate(d) {
  if (!d) return null
  const t = new Date(d)
  if (Number.isNaN(t.getTime())) return String(d)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

const allTags = computed(() => {
  const set = new Map()
  localPosts.value.forEach(p => (p.tags || []).forEach(t => set.set(t, (set.get(t) || 0) + 1)))
  return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
})
const VISIBLE_TAGS = 12
const tagsExpanded = ref(false)
const visibleTags = computed(() => tagsExpanded.value ? allTags.value : allTags.value.slice(0, VISIBLE_TAGS))
const hasMoreTags = computed(() => allTags.value.length > VISIBLE_TAGS)

const categories = computed(() => {
  const map = new Map()
  localPosts.value.forEach(p => {
    const set = new Set([...(p.categories || []), ...(p.tags || [])])
    if (set.size === 0) set.add('未分类')
    set.forEach(c => map.set(c, (map.get(c) || 0) + 1))
  })
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})

function postHasCategory(p, cat) {
  return [...(p.categories || []), ...(p.tags || [])].includes(cat)
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

const filteredPosts = computed(() => {
  let list = localPosts.value
  if (category.value) list = list.filter(p => postHasCategory(p, category.value))
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

function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilter() {
  category.value = ''
  activeTag.value = ''
  query.value = ''
  page.value = 1
  total.value = filteredPosts.value.length
}

function toggleTags() {
  tagsExpanded.value = !tagsExpanded.value
}

const filterActive = computed(() => category.value || activeTag.value || query.value.trim())
const filterLabel = computed(() => {
  const parts = []
  if (category.value) parts.push(category.value)
  if (activeTag.value) parts.push(' · ' + activeTag.value)
  if (query.value.trim()) parts.push(' · "' + query.value.trim() + '"')
  return '已筛选：' + parts.join('')
})

// 总目录折叠状态
const tocCollapsed = ref(false)
function toggleToc() { tocCollapsed.value = !tocCollapsed.value }

// 按年份分组总目录
const tocByYear = computed(() => {
  const map = new Map()
  localPosts.value.forEach(p => {
    const y = p.date ? p.date.slice(0, 4) : '未标注'
    if (!map.has(y)) map.set(y, [])
    map.get(y).push(p)
  })
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})

onMounted(() => { total.value = localPosts.value.length })

// 内联组件：render function 构建，规避 markdown 模板编译分裂
const ArchiveList = {
  name: 'ArchiveList',
  setup() {
    return () => h('div', { class: 'archive-layout' }, [
      // 侧边栏
      h('aside', { class: 'archive-sidebar' }, [
        // 总目录（最上层）— 可折叠
        h('div', { class: ['sidebar-section', 'toc-section', { collapsed: tocCollapsed.value }] }, [
          h('button', {
            class: 'toc-toggle',
            onClick: toggleToc,
            'aria-expanded': !tocCollapsed.value,
          }, [
            h('span', { class: 'toc-toggle-label' }, '总目录'),
            h('span', { class: ['toc-chevron', { open: !tocCollapsed.value }], 'aria-hidden': 'true' }, '▾'),
          ]),
          h('div', { class: 'toc-list' },
            tocByYear.value.map(([year, posts]) =>
              h('div', { key: year, class: 'toc-year' }, [
                h('span', { class: 'toc-year-label' }, year + ' 年'),
                h('div', { class: 'toc-year-items' },
                  posts.map(p =>
                    h('a', {
                      key: p.url, href: p.url, class: 'toc-item',
                      onClick: (e) => { e.preventDefault(); window.location.href = p.url },
                    }, p.title)
                  )
                ),
              ])
            )
          ),
        ]),
        // 分类筛选
        h('div', { class: 'sidebar-section' }, [
          h('h3', { class: 'sidebar-title' }, '分类'),
          h('div', { class: 'cat-list' },
            categories.value.map(c =>
              h('button', {
                key: c.name,
                class: ['cat-item', { active: category.value === c.name }],
                onClick: () => selectCategory(c.name),
              }, [
                h('span', null, c.name),
                h('span', { class: 'cat-count' }, String(c.count)),
              ])
            )
          ),
        ]),
        allTags.value.length
          ? h('div', { class: 'sidebar-section' }, [
              h('h3', { class: 'sidebar-title' }, '标签'),
              h('div', { class: 'tag-list' },
                visibleTags.value.map(tag =>
                  h('button', {
                    key: tag,
                    class: ['tag-item', { active: activeTag.value === tag }],
                    onClick: () => selectTag(tag),
                  }, tag)
                )
              ),
              hasMoreTags.value
                ? h('button', { class: 'tags-toggle', onClick: toggleTags },
                    tagsExpanded.value ? '收起标签' : `展开 ${allTags.value.length - VISIBLE_TAGS} 个标签`)
                : null,
            ])
          : null,
      ]),
      // 主区
      h('main', { class: 'archive-main' }, [
        h('div', { class: 'archive-head' }, [
          h('h1', { class: 'archive-title' }, '研究文章'),
          h('p', { class: 'archive-sub' }, '行业深度报告、技术前沿洞察与跨领域研究合集'),
        ]),
        h('div', { class: 'archive-toolbar' }, [
          h('div', { class: 'search-box' }, [
            h('svg', {
              class: 'search-icon', width: '16', height: '16', viewBox: '0 0 24 24',
              fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
              'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
            }, [
              h('circle', { cx: '11', cy: '11', r: '8' }),
              h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
            ]),
            h('input', {
              type: 'search', value: query.value,
              onInput: e => { query.value = e.target.value; onSearchInput() },
              placeholder: '搜索标题、标签或摘要…', 'aria-label': '搜索文章',
            }),
          ]),
        ]),
        filterActive.value
          ? h('div', { class: 'filter-status' }, [
              h('span', null, filterLabel.value),
              h('button', { class: 'clear-filter', onClick: clearFilter }, '清除筛选'),
            ])
          : null,
        displayPosts.value.length
          ? h('div', { class: 'post-cards' },
              displayPosts.value.map(post =>
                h('article', { class: 'post-card-article' }, [
                  h('div', { class: 'post-card-article-head' }, [
                    post.date
                      ? h('time', { class: 'post-card-date', datetime: post.date }, post.date)
                      : null,
                    post.readTime ? h('span', { class: 'post-card-read' }, post.readTime) : null,
                    post.hasLongContent ? h('span', { class: 'post-badge' }, '长文') : null,
                  ]),
                  h('h3', { class: 'post-card-title' },
                    h('a', { href: post.url, onClick: (e) => { e.preventDefault(); window.location.href = post.url } }, post.title)
                  ),
                  post.excerpt ? h('p', { class: 'post-card-excerpt' }, post.excerpt) : null,
                  (post.tags && post.tags.length)
                    ? h('div', { class: 'post-card-tags' },
                        post.tags.slice(0, 3).map(t => h('span', { key: t, class: 'post-card-tag' }, t)))
                    : null,
                  h('a', { href: post.url, class: 'post-card-link', onClick: (e) => { e.preventDefault(); window.location.href = post.url } }, '阅读全文 →'),
                ])
              )
            )
          : h('div', { class: 'state-empty' }, [
              h('p', null, '没有找到匹配的文章。'),
              h('p', null, '试试调整关键词或清除筛选条件。'),
            ]),
        totalPages.value > 1
          ? h('nav', { class: 'pagination', 'aria-label': '分页' }, [
              h('button', {
                class: 'page-btn', disabled: page.value === 1, 'aria-label': '上一页',
                onClick: () => goPage(page.value - 1),
              }, '‹'),
              pageNumbers.value.map(n =>
                h('button', {
                  key: n,
                  class: ['page-btn', { active: n === page.value }],
                  onClick: () => goPage(n),
                  'aria-current': n === page.value ? 'page' : undefined,
                }, String(n))
              ),
              h('button', {
                class: 'page-btn', disabled: page.value === totalPages.value, 'aria-label': '下一页',
                onClick: () => goPage(page.value + 1),
              }, '›'),
            ])
          : null,
      ]),
    ])
  },
}
</script>

<ArchiveList />
