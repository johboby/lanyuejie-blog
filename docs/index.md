---
title: 揽月界科技
---

<script setup>
import { ref, onMounted, computed } from 'vue'
import { withBase } from 'vitepress'

const posts = ref([])

onMounted(async () => {
  const modules = import.meta.glob('../posts/*.md', { eager: true })
  const items = Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || {}
      const slug = path.replace(/^\.\.\/posts\//, '').replace(/\.md$/, '')
      return {
        title: fm.title || slug,
        date: fm.date ? new Date(fm.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
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

const recentPosts = computed(() => posts.value.slice(0, 4))

const capabilities = [
  {
    label: '畜牧业智能监测',
    desc: 'IoT + AI图像识别 + 区块链存证，牲畜标的精准追踪与疫病预警',
    tag: '产品',
  },
  {
    label: '智能保险风控',
    desc: '覆盖标的识别、风险评估、理赔存证的全流程智能保险平台',
    tag: '产品',
  },
  {
    label: '农业标准化数据库',
    desc: '整合土壤、气候、作物、养殖多维数据，统一标准驱动精准决策',
    tag: '产品',
  },
  {
    label: '水利综合监控雷达',
    desc: '雷达遥感 + AI预测模型，水位流速实时监测与洪涝早期预警',
    tag: '产品',
  },
  {
    label: '五层脑启发架构',
    desc: '感知→认知→决策→执行→价值，模拟生物神经的完整闭环',
    tag: '架构',
  },
  {
    label: '物理信息融合AI',
    desc: '将物理定律嵌入神经网络，复杂工况下保持鲁棒性与可解释性',
    tag: '技术',
  },
]

const stats = [
  { value: '4', unit: '大领域', label: '畜牧 / 农业 / 水利 / 保险' },
  { value: '5', unit: '层架构', label: '脑启发分层推理模型' },
  { value: '3', unit: '级火箭', label: '扎根→扩张→引领' },
  { value: '1', unit: '个闭环', label: '安全合规全链路可追溯' },
]
</script>

<div class="home">
  <section class="hero">
    <div class="hero-inner">
      <p class="hero-overline">Lanyuejie Technology</p>
      <h1 class="hero-title">揽月界科技</h1>
      <p class="hero-sub">AI驱动的风险控制前沿企业</p>
      <p class="hero-tagline">精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
      <div class="hero-actions">
        <a :href="withBase('/posts/')" class="btn-primary">探索研究</a>
        <a :href="withBase('/about')" class="btn-secondary">了解我们</a>
      </div>
    </div>
  </section>

  <section class="stats-bar">
    <div v-for="s in stats" :key="s.label" class="stat-item">
      <span class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></span>
      <span class="stat-label">{{ s.label }}</span>
    </div>
  </section>

  <section class="capabilities">
    <div class="section-header">
      <h2>核心能力</h2>
      <p>从感知到决策，从技术到产品</p>
    </div>
    <div class="cap-grid">
      <div v-for="c in capabilities" :key="c.label" class="cap-card">
        <span class="cap-tag">{{ c.tag }}</span>
        <h3>{{ c.label }}</h3>
        <p>{{ c.desc }}</p>
      </div>
    </div>
  </section>

  <section class="recent">
    <div class="section-header">
      <h2>最新研究</h2>
      <a :href="withBase('/posts/')" class="view-all">查看全部 →</a>
    </div>
    <div class="recent-grid">
      <a v-for="post in recentPosts" :key="post.link" :href="post.link" class="recent-card">
        <div class="recent-card-body">
          <div class="recent-card-cats">
            <span v-for="cat in post.categories.slice(0, 2)" :key="cat" class="recent-cat">{{ cat }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <div class="recent-card-footer">
            <span v-if="post.date" class="recent-date">{{ post.date }}</span>
            <div class="recent-tags">
              <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="recent-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </section>

  <section class="cta">
    <div class="cta-inner">
      <h2>与我们一起，用AI重新定义风控</h2>
      <p>揽月于九天，划界于未来</p>
      <div class="cta-actions">
        <a href="mailto:samhoclub@163.com" class="btn-primary">联系合作</a>
        <a href="https://www.cycu.top" target="_blank" class="btn-secondary">访问官网</a>
      </div>
    </div>
  </section>
</div>

<style scoped>
.home {
  overflow-x: hidden;
}

.hero {
  padding: 6rem 1.5rem 4rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(45, 106, 90, 0.04) 0%, transparent 100%);
}

.hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.hero-overline {
  font-family: monospace;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.hero-tagline {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2.5rem;
  letter-spacing: 0.06em;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 10px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  background: var(--vp-c-brand-1);
  color: #fff;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 106, 90, 0.25);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 10px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}

.btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 800px;
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
  gap: 1px;
  background: var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
}

.stat-item {
  background: var(--vp-c-bg-soft);
  padding: 1.5rem 1rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.stat-value small {
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 2px;
}

.stat-label {
  display: block;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-top: 0.3rem;
}

.capabilities,
.recent,
.cta {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.section-header p {
  font-size: 0.88rem;
  color: var(--vp-c-text-3);
}

.view-all {
  font-size: 0.88rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.view-all:hover {
  opacity: 0.7;
}

.cap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.cap-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.25rem;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.cap-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--vp-c-brand-soft);
}

.cap-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 0.6rem;
}

.cap-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.4rem;
}

.cap-card p {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.recent-card {
  display: block;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.recent-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--vp-c-brand-soft);
}

.recent-card-cats {
  display: flex;
  gap: 6px;
  margin-bottom: 0.5rem;
}

.recent-cat {
  font-size: 0.7rem;
  padding: 1px 8px;
  border-radius: 6px;
  background: var(--vp-c-gold-soft);
  color: var(--vp-c-gold);
  font-weight: 500;
}

.recent-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recent-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recent-date {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

.recent-tags {
  display: flex;
  gap: 4px;
}

.recent-tag {
  font-size: 0.7rem;
  padding: 1px 7px;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.cta {
  padding-bottom: 5rem;
}

.cta-inner {
  text-align: center;
  padding: 3.5rem 2rem;
  background: linear-gradient(135deg, rgba(45, 106, 90, 0.06), rgba(201, 168, 76, 0.04));
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
}

.cta-inner h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.cta-inner p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero { padding: 4rem 1.25rem 3rem; }
  .hero-title { font-size: 2.2rem; }
  .hero-sub { font-size: 1.1rem; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .cap-grid { grid-template-columns: 1fr; }
  .recent-grid { grid-template-columns: 1fr; }
  .cta-inner { padding: 2.5rem 1.5rem; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.8rem; }
  .stat-value { font-size: 1.5rem; }
}
</style>
