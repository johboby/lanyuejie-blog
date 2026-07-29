---
title: 揽月界科技
layout: page
---

<script setup>
import { computed } from 'vue'
import { data as posts } from './.vitepress/posts.data.js'
import { withBase } from 'vitepress'

const recentPosts = (posts || []).slice(0, 9)
const featuredPost = recentPosts[0] || null
const gridPosts = recentPosts.slice(1)

// 基于标题生成稳定色相，让各卡片缩略图差异化（仍在品牌绿-金区间内），避免首字雷同
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

// Featured 卡：按分类驱动差异化视觉母题，与品牌绿-金体系一致，避免所有文章共用一张 agriculture.jpg
const CATEGORY_THEME = {
  'AI与科技': { hue: 168, glyph: 'AI', label: '智能科技' },
  '人工智能': { hue: 168, glyph: 'AI', label: '智能科技' },
  '农业与保险': { hue: 96, glyph: '农', label: '农业保险' },
  '农业保险': { hue: 96, glyph: '农', label: '农业保险' },
  '风险管理': { hue: 38, glyph: '险', label: '风险控制' },
  '行业研究': { hue: 210, glyph: '研', label: '行业研究' },
  '数字经济': { hue: 280, glyph: '数', label: '数字经济' },
  '能源与制造': { hue: 18, glyph: '能', label: '能源制造' },
}
function featuredTheme(post) {
  if (!post) return { hue: 158, glyph: '★', label: '精选研究' }
  const cat = (post.categories && post.categories[0]) || ''
  const t = CATEGORY_THEME[cat] || { hue: 158 + (hueOf(post.title || '') % 30), glyph: (post.title || '★').slice(0, 1), label: cat || '精选研究' }
  return t
}

// Featured 媒体区背景：分类主题色相驱动的品牌渐变（computed 避免 SSG 阶段 TDZ 执行）
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

// 动态指标：基于 SSG 注入的文章数据实时计算，避免写死数字与实际内容脱节
const metrics = computed(() => {
  const list = posts || []
  const catSet = new Set()
  list.forEach(p => (p.categories || []).forEach(c => catSet.add(c)))
  const years = list.map(p => p.dateISO || p.date).filter(Boolean).map(d => new Date(d).getFullYear()).filter(Boolean)
  const maxYear = years.length ? Math.max(...years) : new Date().getFullYear()
  return [
    { num: '98%', label: '标的识别精度' },
    { num: '-32%', label: '灾害损失' },
    { num: String(catSet.size) + '+', label: '研究分类' },
    { num: String(list.length) + '+', label: String(maxYear) + ' 研究文章' },
  ]
})

const products = [
  { title: '生猪养殖风险监测', desc: 'IoT + AI图像识别 + 区块链存证，牲畜标的精准追踪与疫病预警', link: 'https://szxt.cycu.top' },
  { title: '牦牛监测和智能保险', desc: '覆盖标的识别、风险评估、理赔存证的全流程智能保险平台', link: 'https://agri.cycu.top' },
  { title: '农业标准化基础数据库', desc: '整合土壤、气候、作物、养殖多维数据，统一标准驱动精准决策', link: 'https://risk.cycu.top' },
  { title: '马铃薯晚疫病智能监测', desc: '环境传感 + 遥感融合，早防早治降低病害损失', link: 'https://risk.cycu.top' },
  { title: '水利综合监控雷达软件', desc: '面向水利场景的综合监测与态势感知系统', link: 'https://risk.cycu.top' },
]

const techStack = [
  { title: '五层脑启发架构', desc: '感知→认知→决策→执行→价值，模拟生物神经的完整闭环' },
  { title: '物理信息融合AI', desc: '将物理定律嵌入神经网络，复杂工况下保持鲁棒性与可解释性' },
  { title: '自适应进化引擎', desc: '动态反馈驱动算法持续优化，系统越用越精准' },
  { title: '安全合规闭环', desc: '国密算法 + 零信任架构 + 区块链存证，全链路可追溯' },
]
</script>

<div class="home">
  <section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-inner">
      <p class="hero-badge">AI + 风险控制</p>
      <h1 class="hero-title">揽月界科技</h1>
      <p class="hero-tagline">精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
      <p class="hero-desc">专注于人工智能与风险控制的前沿科技企业，以"双精两减"理念驱动农业保险与灾害防控的智能化变革</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#contact">联系合作</a>
        <a class="btn btn-secondary" :href="withBase('/posts/')">浏览研究</a>
      </div>
      <dl class="hero-metrics">
        <div v-for="m in metrics" :key="m.label" class="hero-metric">
          <dt class="hero-metric-label">{{ m.label }}</dt>
          <dd class="hero-metric-num">{{ m.num }}</dd>
        </div>
      </dl>
    </div>
  </section>

  <section class="section products">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">SOLUTIONS</span>
        <h2 class="section-title">核心产品</h2>
        <p class="section-subtitle">从标的识别到理赔存证，全链路智能风控解决方案</p>
      </div>
      <div class="product-grid">
        <a v-for="(p, i) in products" :key="p.title" :href="p.link" target="_blank" rel="noopener" class="product-card">
          <span class="product-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.desc }}</p>
          <span class="product-link">访问平台 →</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section tech">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">TECHNOLOGY</span>
        <h2 class="section-title">技术底座</h2>
        <p class="section-subtitle">自主可控的核心技术体系，支撑行业级智能风控</p>
      </div>
      <div class="tech-grid">
        <div v-for="t in techStack" :key="t.title" class="tech-card">
          <h3>{{ t.title }}</h3>
          <p>{{ t.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section posts-section">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">INSIGHTS</span>
        <h2 class="section-title">最新研究</h2>
        <p class="section-subtitle">行业深度报告与技术前沿洞察</p>
      </div>
      <a v-if="featuredPost" :href="withBase(featuredPost.url)" class="featured-card">
        <div class="featured-media" aria-hidden="true" :style="featuredMediaStyle">
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
