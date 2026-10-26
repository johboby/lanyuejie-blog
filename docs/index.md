---
title: 揽月界科技
description: 揽月界科技聚焦人工智能与风险控制的前沿研究，覆盖大模型与智能体、AI 工程实战、遥感气象预测与行业深度分析，输出可复用的方法论与工具链。
layout: page
pageClass: home-page
head:
  -
    - meta
    - name: theme-color
      content: '#050507'
---

<main class="home">
  <!-- Hero: centered cover, no side panel -->
  <section class="hero reveal visible" data-part="hero" aria-label="品牌介绍">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-inner">
      <header>
        <p class="hero-badge">AI × 风险控制 · 农业</p>
        <h1 class="hero-title">揽月界科技</h1>
        <p class="hero-tagline">精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
        <p class="hero-desc">
          把卫星、遥感与机器学习落到农田与牧场上。已落地三个产品：生猪养殖风险监测、牦牛监测与智能保险、农业标准化基础数据库——让数据先于灾害到达。
        </p>
        <div class="hero-actions">
          <a class="btn btn-solid" href="#contact" data-part="hero-cta">联系合作</a>
          <a class="btn btn-outline" href="/lanyuejie-blog/posts/" data-part="hero-nav">浏览研究</a>
        </div>
      </header>
    </div>
  </section>

  <!-- Metrics bar: values are computed refs, SSR emits real text, no FOUC -->
  <section class="metrics reveal reveal-delay-1 visible" data-part="metrics" aria-label="研究数据">
    <div class="metrics-inner">
      <dl class="metric">
        <dt class="metric-num">{{ articleCount }}</dt>
        <dd class="metric-label">研究文章</dd>
      </dl>
      <dl class="metric">
        <dt class="metric-num">{{ wordCountText }}</dt>
        <dd class="metric-label">总字数</dd>
      </dl>
      <dl class="metric">
        <dt class="metric-num">{{ tagCount }}</dt>
        <dd class="metric-label">研究标签</dd>
      </dl>
    </div>
  </section>

  <!-- Category Quick Nav: counts are reactive, no "— 篇" placeholder -->
  <nav class="section cat-nav reveal reveal-delay-1" data-part="cat-nav" aria-label="分类导航">
    <div class="section-inner">
      <div class="cat-nav-grid">
        <a
          v-for="axis in axes"
          :key="axis.key"
          :href="withBase(axisHref(axis.key))"
          class="cat-nav-card"
          data-part="cat-card"
        >
          <span class="cat-nav-glyph" aria-hidden="true">{{ axis.glyph }}</span>
          <span class="cat-nav-name">{{ axis.label }}</span>
          <span class="cat-nav-count">{{ categoryCounts[axis.key] }} 篇</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- Featured post: reactive, no "加载中…" FOUC -->
  <article class="section featured-section reveal reveal-delay-2" data-part="featured" aria-label="精选研究">
    <div class="section-inner">
      <header class="section-head">
        <span class="eyebrow">FEATURED</span>
        <h2 class="section-title">精选研究</h2>
      </header>
      <a :href="featuredUrl" class="featured-card" data-part="featured-card">
        <div class="featured-body">
          <h3 class="featured-title">{{ featuredTitle }}</h3>
          <p class="featured-excerpt">{{ featuredExcerpt }}</p>
          <div class="featured-meta">
            <span class="featured-tag">{{ featuredTag }}</span>
            <time v-if="featuredDate" class="featured-date" :datetime="featuredDatetime">{{ featuredDate }}</time>
            <span class="featured-cta">阅读全文 <span class="featured-arrow" aria-hidden="true">→</span></span>
          </div>
        </div>
      </a>
    </div>
  </article>

  <!-- Latest articles grid: rendered by v-for, no empty container -->
  <section class="section articles-section reveal reveal-delay-3" data-part="articles" aria-label="最新研究">
    <div class="section-inner">
      <header class="section-head">
        <span class="eyebrow">LATEST</span>
        <h2 class="section-title">最新研究</h2>
      </header>
      <div class="post-grid">
        <article v-for="p in latestPosts" :key="p.url" class="post-card" data-part="post-card">
          <a :href="withBase(p.url)" :aria-label="p.title">
            <h3 class="post-card-title">{{ p.title }}</h3>
            <p v-if="p.excerpt || p.description" class="post-excerpt">{{ p.excerpt || p.description }}</p>
          </a>
          <time v-if="p.date" class="post-card-date" :datetime="isoDate(p.date)">{{ formatDate(p.date) }}</time>
        </article>
      </div>
      <div class="posts-more">
        <a href="/lanyuejie-blog/posts/" class="btn btn-outline" data-part="articles-more">查看全部 {{ articleCount }} 篇研究<span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <!-- Follow channels (no fake-submit email form; real RSS + WeChat only) -->
  <section class="section subscribe reveal reveal-delay-3" data-part="subscribe" aria-label="跟进更新">
    <div class="subscribe-card">
      <span class="eyebrow">STAY UPDATED</span>
      <h2 class="section-title">跟进研究更新</h2>
      <p class="section-subtitle">通过 RSS 或微信公众号接收最新文章</p>
      <div class="follow-channels" data-part="follow-channels">
        <a class="follow-channel" href="/lanyuejie-blog/feed.xml" data-part="rss-link">
          <span class="follow-icon" aria-hidden="true">RSS</span>
          <span class="follow-body">
            <span class="follow-label">RSS 订阅</span>
            <span class="follow-hint">通用阅读器：Inoreader / NetNewsWire / Feedly</span>
          </span>
        </a>
        <a class="follow-channel" href="https://mp.weixin.qq.com/" target="_blank" rel="noopener noreferrer" data-part="wechat-link">
          <span class="follow-icon" aria-hidden="true">微信</span>
          <span class="follow-body">
            <span class="follow-label">微信公众号</span>
            <span class="follow-hint">尘渊文化 · 每篇研究同步推送</span>
          </span>
        </a>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="section contact reveal reveal-delay-4" data-part="contact" aria-label="联系方式" id="contact">
    <div class="contact-card">
      <header class="section-head">
        <span class="eyebrow">CONTACT</span>
        <h2 class="section-title">联系我们</h2>
      </header>
      <div class="contact-grid">
        <div class="contact-item" data-part="contact-item">
          <span class="contact-label">邮箱</span>
          <a href="mailto:samhoclub@163.com" class="contact-link">samhoclub@163.com</a>
        </div>
        <div class="contact-item" data-part="contact-item">
          <span class="contact-label">微信</span>
          <span class="contact-value">cy321one</span>
        </div>
        <div class="contact-item" data-part="contact-item">
          <span class="contact-label">公众号</span>
          <span class="contact-value">尘渊文化</span>
        </div>
      </div>
    </div>
  </section>
</main>

<script setup>
// 首页数据渲染：全部走 Vue 响应式 + 构建期内联数据，SSR 输出真实文本，
// 客户端 hydration 首帧即真实值——彻底消除 metrics / featured / grid 的 FOUC。
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { POSTS as BUILD_POSTS } from './posts-list.generated.js'
import { CONTENT_AXES, axisHref, countByAxis } from './.vitepress/lib/content-axes.js'

// 分类卡片与归档页筛选共用同一套「内容轴」规则，卡片上的「N 篇」
// 与归档页按轴筛选后的条数永远一致。
const axes = CONTENT_AXES

// 当前数据源：优先 BUILD_POSTS（构建期注入），运行时 fetch 到更新数据后 ref 会重设。
const posts = ref(Array.isArray(BUILD_POSTS) ? BUILD_POSTS.slice() : [])

// 按时间倒序：SSR / 客户端算出来的顺序一致，Featured = 最新一篇，Grid = 次新四篇。
const sortedPosts = computed(() =>
  posts.value.slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
)

// ---- 顶部指标（Georgia 数字条）----
const articleCount = computed(() => sortedPosts.value.length)

const totalWords = computed(() =>
  sortedPosts.value.reduce((sum, p) => sum + (p.wordCount || 0), 0)
)
const wordCountText = computed(() => totalWords.value.toLocaleString('en-US'))

const tagCount = computed(() => {
  const s = new Set()
  for (const p of sortedPosts.value) {
    for (const t of (p.tags || [])) s.add(t)
  }
  return s.size
})

// 分类卡片计数：与归档页共用 countByAxis，卡片数字 == 归档页按轴筛选后的条数
const categoryCounts = computed(() => countByAxis(sortedPosts.value))

// ---- 精选文章（最新一篇）----
const featured = computed(() => sortedPosts.value[0] || null)
const featuredTitle = computed(() => (featured.value && featured.value.title) || '暂无文章')
const featuredExcerpt = computed(() =>
  (featured.value && (featured.value.excerpt || featured.value.description)) || ''
)
const featuredTag = computed(() =>
  (featured.value && featured.value.tags && featured.value.tags[0]) || ''
)
const featuredDate = computed(() => (featured.value && featured.value.date) ? formatDate(featured.value.date) : '')
const featuredDatetime = computed(() => (featured.value && featured.value.date) ? isoDate(featured.value.date) : '')
const featuredUrl = computed(() => (featured.value && featured.value.url) ? withBase(featured.value.url) : withBase('/posts/'))

// ---- 最新文章网格（次新四篇）----
const latestPosts = computed(() => sortedPosts.value.slice(1, 5))

// ---- 日期工具 ----
function formatDate(value) {
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function isoDate(value) {
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toISOString()
}

// BUILD_POSTS 是构建期唯一数据源；Layout.vue 会广播 'vp-posts-ready'
// 事件（当前不携带新数据，仅为同页监听者提供同步挂载点）。
onMounted(() => {
  // 滚动揭示：区块顶边进入视口即显示。
  // 不用纯 IntersectionObserver：被瞬间滚动 / 锚点跳过的区块，其交叉比始终为 0，
  // IO 不会触发回调，会永久停在 opacity:0（整块空白）。这里直接按位置判定，
  // 滚动、跳转、浏览器恢复滚动位置都能正确显示。
  const pending = Array.from(document.querySelectorAll('.reveal:not(.visible)'))
  let ticking = false
  const revealCheck = () => {
    ticking = false
    const limit = window.innerHeight - 40
    for (let i = pending.length - 1; i >= 0; i--) {
      if (pending[i].getBoundingClientRect().top < limit) {
        pending[i].classList.add('visible')
        pending.splice(i, 1)
      }
    }
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(revealCheck)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  revealCheck()

  const apply = (incoming) => {
    if (Array.isArray(incoming) && incoming.length) posts.value = incoming
  }
  if (window.__VP_POSTS__ && window.__VP_POSTS__.length) apply(window.__VP_POSTS__)
  window.addEventListener('vp-posts-ready', (e) => apply((e && e.detail) || window.__VP_POSTS__))
})
</script>
