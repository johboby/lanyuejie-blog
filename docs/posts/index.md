---
title: 文章列表
layout: page
---

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { POSTS } from '../posts-list.generated.js'
import { withBase } from 'vitepress'
import { CONTENT_AXES, AXIS_QUERY, findAxis, matchAxes, countByAxis } from '../.vitepress/lib/content-axes.js'

// 唯一数据源：构建期列表兜底，客户端由 Layout.vue 注入 posts.json 后替换。
// 首页与归档页必须用同一份数据，否则同一篇文章在两边的分类归属会不一致。
const sourcePosts = ref(POSTS)

const PAGE_SIZE = 6
const query = ref('')
const category = ref('')
const activeTag = ref('')
const axis = ref('')
const page = ref(1)

function toStrArray(v) {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  if (typeof v === 'string') return v.split(/[,/]/).map(s => s.trim()).filter(Boolean)
  return []
}

const localPosts = computed(() => sourcePosts.value.map(normalize))

function normalize(p) {
  if (!p) return { title: '', url: '', date: null, readTime: '', excerpt: '', description: '', tags: [], categories: [], hasLongContent: false }
  const date = p.date ? fmtDate(p.date) : null
  return {
    title: p.title,
    url: withBase(p.url),
    date,
    readTime: p.readTime || (p.wordCount ? `${Math.max(1, Math.ceil(p.wordCount / 500))} 分钟` : ''),
    excerpt: p.excerpt || p.description || '',
    description: p.description || '',
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
    const set = new Set(p.categories || [])
    if (set.size === 0) set.add('未分类')
    set.forEach(c => map.set(c, (map.get(c) || 0) + 1))
  })
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})

const VISIBLE_CATEGORIES = 12
const categoriesExpanded = ref(false)
const visibleCategories = computed(() => categoriesExpanded.value ? categories.value : categories.value.slice(0, VISIBLE_CATEGORIES))
const hasMoreCategories = computed(() => categories.value.length > VISIBLE_CATEGORIES)
function toggleCategories() { categoriesExpanded.value = !categoriesExpanded.value }

// 内容轴：与首页分类卡片共用同一套规则与计数，保证两边数字一致
const axisOptions = computed(() => {
  const counts = countByAxis(localPosts.value)
  return CONTENT_AXES.map(a => ({ ...a, count: counts[a.key] || 0 }))
})

const axisLabel = computed(() => {
  const a = findAxis(axis.value)
  return a ? a.label : ''
})

function postHasCategory(p, cat) {
  return (p.categories || []).includes(cat)
}

function syncAxisQuery() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (axis.value) url.searchParams.set(AXIS_QUERY, axis.value)
  else url.searchParams.delete(AXIS_QUERY)
  window.history.replaceState({}, '', url.pathname + url.search + url.hash)
}

function selectAxis(key) {
  axis.value = axis.value === key ? '' : key
  // 内容轴是粗粒度入口，切换时清掉更细的分类/标签，避免叠加出空结果
  category.value = ''
  activeTag.value = ''
  page.value = 1
  syncAxisQuery()
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  if (axis.value) list = list.filter(p => matchAxes(p).includes(axis.value))
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
// 结果条数：让「当前筛选命中多少篇」直接可见，首页卡片数字也以此为准
const resultCount = computed(() => filteredPosts.value.length)
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

function onSearchInput() {
  page.value = 1
}

function goPage(p) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilter() {
  axis.value = ''
  category.value = ''
  activeTag.value = ''
  query.value = ''
  page.value = 1
  syncAxisQuery()
}

function toggleTags() {
  tagsExpanded.value = !tagsExpanded.value
}

const filterActive = computed(() => axis.value || category.value || activeTag.value || query.value.trim())
const filterLabel = computed(() => {
  const parts = []
  if (axis.value) parts.push(axisLabel.value)
  if (category.value) parts.push((parts.length ? ' · ' : '') + category.value)
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

onMounted(() => {
  // 深链筛选：首页分类卡片跳过来时带上 ?axis=AI
  if (typeof window !== 'undefined') {
    const key = new URLSearchParams(window.location.search).get(AXIS_QUERY)
    if (key && findAxis(key)) axis.value = key

    // 运行时数据（posts.json）与首页同源
    const apply = (posts) => {
      if (posts && posts.length) sourcePosts.value = posts
    }
    if (window.__VP_POSTS__ && window.__VP_POSTS__.length) apply(window.__VP_POSTS__)
    window.addEventListener('vp-posts-ready', (e) => apply((e && e.detail) || window.__VP_POSTS__))
  }
})

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
        // 内容轴筛选（与首页分类卡片同源同规则）
        h('div', { class: 'sidebar-section' }, [
          h('h3', { class: 'sidebar-title' }, '内容轴'),
          h('div', { class: 'cat-list' },
            axisOptions.value.map(a =>
              h('button', {
                key: a.key,
                class: ['cat-item', { active: axis.value === a.key }],
                onClick: () => selectAxis(a.key),
              }, [
                h('span', null, a.label),
                h('span', { class: 'cat-count' }, String(a.count)),
              ])
            )
          ),
        ]),
        // 分类筛选（真实 categories，不再与 tags 混合出 700+ 条目）
        h('div', { class: 'sidebar-section' }, [
          h('h3', { class: 'sidebar-title' }, '分类'),
          h('div', { class: 'cat-list' },
            visibleCategories.value.map(c =>
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
          hasMoreCategories.value
            ? h('button', { class: 'tags-toggle', onClick: toggleCategories },
                categoriesExpanded.value ? '收起分类' : `展开 ${categories.value.length - VISIBLE_CATEGORIES} 个分类`)
            : null,
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
          h('span', { class: 'result-count', 'aria-live': 'polite' }, `共 ${resultCount.value} 篇`),
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
