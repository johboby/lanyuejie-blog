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

  <!-- Metrics bar -->
  <section class="metrics reveal reveal-delay-1 visible" data-part="metrics" aria-label="研究数据">
    <div class="metrics-inner">
      <dl class="metric">
        <dt class="metric-num" id="post-count">—</dt>
        <dd class="metric-label">研究文章</dd>
      </dl>
      <dl class="metric">
        <dt class="metric-num" id="word-count">—</dt>
        <dd class="metric-label">总字数</dd>
      </dl>
      <dl class="metric">
        <dt class="metric-num" id="tag-count">—</dt>
        <dd class="metric-label">研究标签</dd>
      </dl>
    </div>
  </section>

  <!-- Category Quick Nav -->
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
          <span class="cat-nav-count" :id="'cat-' + axis.slug + '-count'">— 篇</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- Featured post -->
  <article class="section featured-section reveal reveal-delay-2" data-part="featured" aria-label="精选研究">
    <div class="section-inner">
      <header class="section-head">
        <span class="eyebrow">FEATURED</span>
        <h2 class="section-title">精选研究</h2>
      </header>
      <a href="/lanyuejie-blog/posts/" class="featured-card" data-part="featured-card">
        <div class="featured-body">
          <h3 class="featured-title" id="featured-title">加载中…</h3>
          <p class="featured-excerpt" id="featured-excerpt"></p>
          <div class="featured-meta">
            <span class="featured-tag" id="featured-tag"></span>
            <time class="featured-date" id="featured-date" datetime=""></time>
            <span class="featured-cta">阅读全文 <span class="featured-arrow" aria-hidden="true">→</span></span>
          </div>
        </div>
      </a>
    </div>
  </article>

  <!-- Latest articles grid -->
  <section class="section articles-section reveal reveal-delay-3" data-part="articles" aria-label="最新研究">
    <div class="section-inner">
      <header class="section-head">
        <span class="eyebrow">LATEST</span>
        <h2 class="section-title">最新研究</h2>
      </header>
      <div class="post-grid" id="post-grid">
        <!-- 动态填充 -->
      </div>
      <div class="posts-more">
        <a href="/lanyuejie-blog/posts/" class="btn btn-outline" data-part="articles-more">查看全部研究 →</a>
      </div>
    </div>
  </section>

  <!-- Subscribe -->
  <section class="section subscribe reveal reveal-delay-3" data-part="subscribe" aria-label="订阅更新">
    <div class="subscribe-card">
      <div class="subscribe-inner">
        <span class="eyebrow">STAY UPDATED</span>
        <h2 class="section-title">订阅研究更新</h2>
        <p class="section-subtitle">每月一封，精选 AI 与风险控制的深度研究</p>
        <form class="subscribe-form" data-part="subscribe-form" novalidate>
          <label for="subscribe-email" class="sr-only">邮箱地址</label>
          <input type="email" id="subscribe-email" class="subscribe-input" placeholder="you@example.com" aria-label="邮箱地址" required />
          <button type="submit" class="subscribe-btn" data-part="subscribe-btn">订阅</button>
        </form>
        <p class="subscribe-feedback" aria-live="polite" hidden></p>
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
// 首页数据渲染：SSR 安全 + 客户端挂载后填充
import { onMounted } from 'vue'
import { withBase } from 'vitepress'
import { POSTS as BUILD_POSTS } from './posts-list.generated.js'
import { CONTENT_AXES, axisHref, countByAxis } from './.vitepress/lib/content-axes.js'

// 分类卡片与归档页筛选共用同一套「内容轴」规则，卡片上的「N 篇」
// 与归档页按轴筛选后的条数永远一致。
const axes = CONTENT_AXES

function formatDate(value) {
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function renderHome(posts) {
  if (!posts || !posts.length) return
  const sorted = posts.slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))

  const setText = (id, text) => {
    const el = document.getElementById(id)
    if (el) el.textContent = text
  }

  // 指标
  setText('post-count', sorted.length)
  const totalWords = sorted.reduce((sum, p) => sum + (p.wordCount || 0), 0)
  setText('word-count', totalWords.toLocaleString('en-US'))
  const allTags = new Set()
  sorted.forEach((p) => (p.tags || []).forEach((t) => allTags.add(t)))
  setText('tag-count', allTags.size)

  // 分类计数：与归档页共用 countByAxis，卡片数字 == 归档页按该轴筛选后的条数
  const catCounts = countByAxis(sorted)
  axes.forEach((axis) => setText(`cat-${axis.slug}-count`, `${catCounts[axis.key]} 篇`))

  // 精选文章（最新一篇）
  const fp = sorted[0]
  const featTitle = document.getElementById('featured-title')
  const featCard = document.querySelector('.featured-card')
  const featTag = document.getElementById('featured-tag')
  const featExcerpt = document.getElementById('featured-excerpt')
  const featDate = document.getElementById('featured-date')
  if (featTitle) featTitle.textContent = fp.title || '暂无文章'
  if (featCard && fp.url) featCard.href = withBase(fp.url)
  if (featExcerpt) featExcerpt.textContent = fp.excerpt || fp.description || ''
  if (featDate && fp.date) {
    featDate.textContent = formatDate(fp.date)
    featDate.setAttribute('datetime', new Date(fp.date).toISOString())
  }
  if (featTag && fp.tags && fp.tags.length) featTag.textContent = fp.tags[0]

  // 文章网格（次新四篇）
  const grid = document.getElementById('post-grid')
  if (grid) {
    grid.innerHTML = ''
    for (let i = 1; i <= 4 && sorted[i]; i++) {
      const p = sorted[i]
      const card = document.createElement('article')
      card.className = 'post-card'
      card.setAttribute('data-part', 'post-card')

      const link = document.createElement('a')
      link.href = withBase(p.url)
      link.setAttribute('aria-label', p.title || '暂无文章')

      const h3 = document.createElement('h3')
      h3.textContent = p.title || '暂无文章'
      link.appendChild(h3)

      const excerpt = p.excerpt || p.description || ''
      if (excerpt) {
        const para = document.createElement('p')
        para.className = 'post-excerpt'
        para.textContent = excerpt
        link.appendChild(para)
      }
      card.appendChild(link)

      if (p.date) {
        const time = document.createElement('time')
        time.className = 'post-card-date'
        time.setAttribute('datetime', new Date(p.date).toISOString())
        time.textContent = formatDate(p.date)
        card.appendChild(time)
      }
      grid.appendChild(card)
    }
  }

  const moreLink = document.querySelector('[data-part="articles-more"]')
  if (moreLink) moreLink.textContent = `查看全部 ${sorted.length} 篇研究 →`
}

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

  // 文章数据：运行时注入优先，构建期内联兜底
  const apply = (posts) => {
    if (!posts || !posts.length) return
    renderHome(posts)
  }
  if (window.__VP_POSTS__ && window.__VP_POSTS__.length) apply(window.__VP_POSTS__)
  else if (BUILD_POSTS && BUILD_POSTS.length) apply(BUILD_POSTS)
  window.addEventListener('vp-posts-ready', (e) => apply((e && e.detail) || window.__VP_POSTS__))

  // 订阅表单反馈
  const form = document.querySelector('.subscribe-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const input = form.querySelector('.subscribe-input')
      const feedback = form.parentElement.querySelector('.subscribe-feedback')
      if (!input || !input.value || input.value.indexOf('@') === -1) {
        input.classList.add('input-error')
        if (feedback) {
          feedback.textContent = '请输入有效的邮箱地址'
          feedback.hidden = false
          feedback.classList.remove('is-success')
          feedback.classList.add('is-error')
        }
        return
      }
      input.classList.remove('input-error')
      input.classList.add('input-success')
      if (feedback) {
        feedback.textContent = '订阅成功！'
        feedback.hidden = false
        feedback.classList.remove('is-error')
        feedback.classList.add('is-success')
      }
      form.reset()
      setTimeout(() => input.classList.remove('input-success'), 2000)
    })
  }
})
</script>
