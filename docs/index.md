---
title: 揽月界科技
layout: page
---

<script setup>
import { computed } from 'vue'
import { data as loaderPosts } from './.vitepress/posts.data.js'
import { POSTS } from './posts-list.generated.js'
import { withBase } from 'vitepress'

// 优先使用 SSG 内嵌的 window.__VP_POSTS__（config.js transformHead 注入，客户端）；
// SSR/SSG 阶段 window 未定义，回退到 posts-data.js 的同步 POSTS 数组（构建时预计算），
// 让首屏 HTML 即渲染真实文章列表；再回退到 createContentLoader 数据。
function getPosts() {
  if (typeof window !== 'undefined' && window.__VP_POSTS__ && window.__VP_POSTS__.length) {
    return window.__VP_POSTS__
  }
  if (POSTS.length) return POSTS
  return loaderPosts.value || []
}
const allPosts = computed(() => getPosts())

// 统一日期格式化（SSG 内嵌数据 date 为 ISO 字符串，loader 数据为 frontmatter 原始值）
function fmtDate(d) {
  if (!d) return ''
  const t = new Date(d)
  if (Number.isNaN(t.getTime())) return String(d)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}
function normalizePost(p) {
  if (!p) return null
  return {
    ...p,
    date: fmtDate(p.date),
  }
}
const recentPosts = computed(() => allPosts.value.slice(0, 8).map(normalizePost))
const featuredPost = computed(() => recentPosts.value[0] || null)
const gridPosts = computed(() => recentPosts.value.slice(1))

// 基于标题生成稳定色相
function hueOf(title = '') {
  let h = 0
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360
  return h
}
function mediaStyle(title) {
  const h = hueOf(title)
  return {
    background: `radial-gradient(120% 120% at 0% 0%, hsla(${(h + 40) % 360},45%,55%,0.18) 0%, transparent 55%), linear-gradient(135deg, hsl(${h},38%,32%) 0%, hsl(${(h + 20) % 360},42%,26%) 100%)`,
  }
}

// Featured 卡：分类关键词聚类驱动差异化视觉母题
const CATEGORY_GROUPS = [
  { hue: 168, glyph: 'AI', label: '智能科技', keys: ['AI', '智能体', '大模型', '技术', '科技', '算法', '机器人', '视频技术'] },
  { hue: 32,  glyph: '经', label: '经济理财', keys: ['经济', '理财', '投资', '金融', '市场', '产业', '政策', '价值链'] },
  { hue: 96,  glyph: '能', label: '能源制造', keys: ['能源', '气候', '制造', '绿色'] },
  { hue: 280, glyph: '学', label: '成长方法', keys: ['学习', '成长', '方法', '认知', '心理', '教育', '职业', '效率', '自我'] },
  { hue: 210, glyph: '战', label: '实战复盘', keys: ['复盘', '实战', '增长', 'SEO', '工具', '应用', '部署'] },
  { hue: 188, glyph: '析', label: '深度分析', keys: ['分析', '调查', '研究', '思考', '趋势', '展望', '洞察', '行业'] },
  { hue: 350, glyph: '文', label: '人文伦理', keys: ['人文', '伦理', '社会'] },
]
function featuredTheme(post) {
  if (!post) return { hue: 158, glyph: '★', label: '精选研究' }
  const cats = post.categories || []
  const hay = cats.join('/')
  for (const g of CATEGORY_GROUPS) {
    if (g.keys.some(k => hay.includes(k))) return g
  }
  return { hue: 158, glyph: '★', label: '精选研究' }
}

const featuredMediaStyle = computed(() => {
  if (!featuredPost) return {}
  const t = featuredTheme(featuredPost)
  const h = t.hue
  return {
    background:
      `radial-gradient(120% 120% at 100% 0%, hsla(${(h + 40) % 360},45%,55%,0.22) 0%, transparent 55%), ` +
      `linear-gradient(135deg, hsl(${h},40%,34%) 0%, hsl(${(h + 18) % 360},44%,24%) 100%)`,
  }
})

function toStrArray(v) {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  if (typeof v === 'string') return v.split(/[,/]/).map(s => s.trim()).filter(Boolean)
  return []
}
// 动态指标：基于 SSG 注入的文章数据实时计算
const metrics = computed(() => {
  const list = allPosts.value
  const catSet = new Set()
  // 并集统计：同时计入 categories 与 tags，保证分类指标非 0
  list.forEach(p => {
    toStrArray(p.categories).forEach(c => catSet.add(c))
    toStrArray(p.tags).forEach(c => catSet.add(c))
  })
  const years = list.map(p => p.dateISO || p.date).filter(Boolean).map(d => new Date(d).getFullYear()).filter(Boolean)
  const maxYear = years.length ? Math.max(...years) : new Date().getFullYear()
  return [
    { num: String(list.length), label: '研究文章' },
    { num: String(catSet.size), label: '研究分类' },
    { num: '98%', label: '标的识别精度' },
    { num: '-32%', label: '灾害损失' },
  ]
})

// 分类导航数据：基于全部文章统计（非 recentPosts 前 8 篇），
// 关键词同时匹配 tags 与 categories（categories 字段稀疏，tags 更完整）
function groupCount(re) {
  return allPosts.value.filter(p =>
    [toStrArray(p.categories), toStrArray(p.tags)].some(arr => arr.some(c => re.test(c)))
  ).length
}
const categoryNav = [
  { name: '智能科技', count: groupCount(/AI|智能体|大模型|技术|科技|算法|机器人|视频|深度学习|模型训练|架构|工具|工程|图像|Python|应用|认知|推理|生成|评测|设计|知识|搜索|生产|效率|省|实战|趋势|市场|动向|行业|产业|经济与|能源|气候|制造|绿色|研究综述|图神经|时间序列|未来|展望|综合/), glyph: 'AI' },
  { name: '经济理财', count: groupCount(/经济|理财|投资|金融|市场|产业|政策|价值链|决策|消费|维权|规划/), glyph: '经' },
  { name: '能源制造', count: groupCount(/能源|气候|制造|绿色/), glyph: '能' },
  { name: '成长方法', count: groupCount(/学习|成长|方法|认知|心理|教育|职业|效率|自我|提升|管理|健康|方法论/), glyph: '学' },
  { name: '实战复盘', count: groupCount(/复盘|实战|增长|SEO|工具|应用|部署|搜索|引擎/), glyph: '战' },
  { name: '深度分析', count: groupCount(/分析|调查|研究|思考|趋势|展望|洞察|行业|综述|长文/), glyph: '析' },
  { name: '人文伦理', count: groupCount(/人文|伦理|社会/), glyph: '文' },
]
</script>

<div class="home">
  <!-- Hero: Agnes AI 风格大视觉 Hero -->
  <section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-inner">
      <p class="hero-badge">AI + 风险控制</p>
      <h1 class="hero-title">揽月界科技</h1>
      <p class="hero-tagline">精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
      <p class="hero-desc">专注于人工智能与风险控制的前沿科技企业，以"双精两减"理念驱动农业保险与灾害防控的智能化变革</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#contact">联系合作</a>
        <a class="btn btn-secondary" :href="withBase('/posts/')">浏览研究 →</a>
      </div>
    </div>
  </section>

  <!-- Metrics bar: Agnes AI 风格数据指标 -->
  <section class="metrics">
    <div class="metrics-inner">
      <div v-for="m in metrics" :key="m.label" class="metric">
        <span class="metric-num">{{ m.num }}</span>
        <span class="metric-label">{{ m.label }}</span>
      </div>
    </div>
  </section>

  <!-- Category Quick Nav: Agnes AI 风格分类导航 -->
  <section class="section cat-nav">
    <div class="section-inner">
      <div class="cat-nav-grid">
        <a v-for="cat in categoryNav" :key="cat.name" :href="withBase('/posts/')" class="cat-nav-card">
          <span class="cat-nav-glyph">{{ cat.glyph }}</span>
          <span class="cat-nav-name">{{ cat.name }}</span>
          <span class="cat-nav-count">{{ cat.count }} 篇</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Featured Post -->
  <section class="section featured-section">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">FEATURED</span>
        <h2 class="section-title">精选研究</h2>
      </div>
      <a v-if="featuredPost" :href="withBase(featuredPost.url)" class="featured-card">
        <div class="featured-media" aria-hidden="true" :style="featuredMediaStyle">
          <span class="featured-media-light"></span>
          <span class="featured-media-glyph">{{ featuredTheme(featuredPost).glyph }}</span>
          <span class="featured-media-tag">{{ featuredTheme(featuredPost).label }}</span>
        </div>
        <div class="featured-body">
          <span class="eyebrow">FEATURED</span>
          <h3 class="featured-title">{{ featuredPost.title }}</h3>
          <p v-if="featuredPost.excerpt" class="featured-excerpt">{{ featuredPost.excerpt }}</p>
          <div class="post-meta">
            <span v-if="featuredPost.date" class="post-date">{{ featuredPost.date }}</span>
            <span v-if="featuredPost.readTime" class="post-read">{{ featuredPost.readTime }}</span>
            <span v-if="featuredPost.hasLongContent" class="post-badge">长文</span>
          </div>
        </div>
      </a>
    </div>
  </section>

  <!-- Recent Articles -->
  <section class="section articles-section">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">INSIGHTS</span>
        <h2 class="section-title">最新研究</h2>
        <p class="section-subtitle">行业深度报告与技术前沿洞察</p>
      </div>
      <div class="post-grid">
        <a v-for="post in gridPosts" :key="post.url" :href="withBase(post.url)" class="post-card">
          <div class="post-card-media" aria-hidden="true" :style="mediaStyle(post.title)">
            <span class="post-card-monogram">{{ (post.title || '').slice(0, 1) }}</span>
          </div>
          <div class="post-meta">
            <span v-if="post.date" class="post-date">{{ post.date }}</span>
            <span v-if="post.readTime" class="post-read">{{ post.readTime }}</span>
            <span v-if="post.hasLongContent" class="post-badge">长文</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
          <div v-if="post.tags && post.tags.length" class="post-tags">
            <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="post-tag">{{ tag }}</span>
          </div>
        </a>
      </div>
      <div class="posts-more">
        <a :href="withBase('/posts/')" class="btn btn-secondary">查看全部文章 →</a>
      </div>
    </div>
  </section>

  <!-- Subscribe -->
  <section class="section subscribe">
    <div class="subscribe-card">
      <div class="subscribe-inner">
        <span class="eyebrow">STAY UPDATED</span>
        <h2 class="section-title">订阅研究更新</h2>
        <p class="section-subtitle">第一时间获取 AI 与风险控制前沿深度报告，不打扰、可随时退订</p>
        <div class="subscribe-actions">
          <a :href="withBase('/feed.xml')" class="btn btn-primary">订阅 RSS</a>
          <a href="mailto:samhoclub@163.com?subject=订阅研究更新" class="btn btn-secondary">邮件订阅</a>
        </div>
        <p class="subscribe-note">或微信搜索公众号「尘渊文化」获取最新研究</p>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="section contact" id="contact">
    <div class="contact-card">
      <div class="section-head">
        <span class="eyebrow">CONTACT</span>
        <h2 class="section-title">联系我们</h2>
        <p class="section-subtitle">揽月于九天，划界于未来</p>
      </div>
      <div class="contact-grid">
        <div class="contact-item">
          <span class="contact-label">邮箱</span>
          <a href="mailto:samhoclub@163.com" class="contact-link">samhoclub@163.com</a>
        </div>
        <div class="contact-item">
          <span class="contact-label">微信</span>
          <span class="contact-value">cy321one</span>
        </div>
        <div class="contact-item">
          <span class="contact-label">公众号</span>
          <span class="contact-value">尘渊文化</span>
        </div>
      </div>
    </div>
  </section>
</div>
