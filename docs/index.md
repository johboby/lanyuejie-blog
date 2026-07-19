---
title: 揽月界科技
---

<script setup>
import { computed } from 'vue'
import posts from './.vitepress/posts-data.json'

const recentPosts = computed(() => (posts || []).slice(0, 4))

const products = [
  {
    name: '生猪养殖风险监测与保险平台',
    desc: 'IoT + AI图像识别 + 区块链存证，牲畜标的精准追踪与疫病预警',
    url: 'https://szxt.cycu.top',
    tag: '畜牧',
  },
  {
    name: '牦牛监测和智能保险系统',
    desc: '覆盖标的识别、风险评估、理赔存证的全流程智能保险平台',
    url: 'https://agri.cycu.top',
    tag: '畜牧',
  },
  {
    name: '农业标准化基础数据库平台',
    desc: '整合土壤、气候、作物、养殖多维数据，统一标准驱动精准决策',
    url: 'https://risk.cycu.top',
    tag: '农业',
  },
  {
    name: '马铃薯晚疫病智能监测系统',
    desc: 'AI驱动的作物病害实时监测与预警，精准施药降低损失',
    url: 'https://risk.cycu.top',
    tag: '农业',
  },
  {
    name: '水利综合监控雷达软件',
    desc: '雷达遥感 + AI预测模型，水位流速实时监测与洪涝早期预警',
    url: '',
    tag: '水利',
  },
]

const techFeatures = [
  {
    name: '五层脑启发架构',
    desc: '感知→认知→决策→执行→价值，模拟生物神经的完整闭环',
  },
  {
    name: '物理信息融合AI',
    desc: '将物理定律嵌入神经网络，复杂工况下保持鲁棒性与可解释性',
  },
  {
    name: '自适应进化引擎',
    desc: '动态反馈驱动算法持续优化，系统随环境变化自主迭代',
  },
  {
    name: '安全合规闭环',
    desc: '国密算法 + 零信任架构 + 区块链存证，全链路可追溯',
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
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-inner">
      <p class="hero-overline">Lanyuejie Technology</p>
      <h1 class="hero-title">揽月界科技</h1>
      <p class="hero-sub">AI驱动的风险控制前沿企业</p>
      <p class="hero-tagline">精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
      <div class="hero-actions">
        <a href="mailto:samhoclub@163.com" class="btn-primary">联系合作</a>
        <a href="/lanyuejie-blog/about" class="btn-secondary">了解我们</a>
      </div>
    </div>
  </section>

  <section class="stats-bar">
    <div v-for="s in stats" :key="s.label" class="stat-item">
      <span class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></span>
      <span class="stat-label">{{ s.label }}</span>
    </div>
  </section>

  <section class="products">
    <div class="section-inner">
      <div class="section-header">
        <h2>核心产品</h2>
        <p>从感知到决策，从技术到产品</p>
      </div>
      <div class="product-grid">
        <div v-for="p in products" :key="p.name" class="product-card">
          <span class="product-tag">{{ p.tag }}</span>
          <h3>{{ p.name }}</h3>
          <p>{{ p.desc }}</p>
          <a v-if="p.url" :href="p.url" target="_blank" rel="noopener" class="product-link">访问平台 →</a>
        </div>
      </div>
    </div>
  </section>

  <section class="tech">
    <div class="section-inner">
      <div class="section-header">
        <h2>技术底座</h2>
      </div>
      <div class="tech-grid">
        <div v-for="t in techFeatures" :key="t.name" class="tech-card">
          <h3>{{ t.name }}</h3>
          <p>{{ t.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="recent">
    <div class="section-inner">
      <div class="section-header">
        <h2>最新研究</h2>
        <a href="/lanyuejie-blog/posts/" class="view-all">查看全部 →</a>
      </div>
      <div class="recent-grid">
        <a v-for="post in recentPosts" :key="post.url" :href="post.url" class="recent-card">
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
        </a>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="cta-bg"></div>
    <div class="cta-overlay"></div>
    <div class="cta-inner">
      <h2>与我们一起，用AI重新定义风控</h2>
      <p>揽月于九天，划界于未来</p>
      <a href="mailto:samhoclub@163.com" class="btn-primary">samhoclub@163.com</a>
    </div>
  </section>
</div>

<style scoped>
.home {
  overflow-x: hidden;
  width: 100%;
}

.hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url('/lanyuejie-blog/images/hero-bg.jpg') center/cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 40, 35, 0.88) 0%, rgba(30, 70, 60, 0.82) 50%, rgba(50, 90, 70, 0.75) 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 5rem 2rem;
  max-width: 700px;
}

.hero-overline {
  font-family: monospace;
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.2rem;
  text-transform: uppercase;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.75rem;
  color: #fff;
}

.hero-sub {
  font-size: 1.3rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.5rem;
}

.hero-tagline {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2.5rem;
  letter-spacing: 0.08em;
}

.hero-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 12px 32px;
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
  box-shadow: 0 8px 24px rgba(45, 106, 90, 0.4);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 12px 32px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-decoration: none;
  backdrop-filter: blur(8px);
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 960px;
  margin: -2rem auto 0;
  position: relative;
  z-index: 2;
  padding: 0 2rem;
  gap: 1px;
  background: var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.stat-item {
  background: var(--vp-c-bg);
  padding: 1.75rem 1rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.2rem;
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
  margin-top: 0.35rem;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.products,
.tech,
.recent {
  padding: 4rem 0;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  margin: 0;
}

.section-header p {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.view-all {
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.view-all:hover { opacity: 0.7; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.product-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.5rem;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-soft);
}

.product-tag {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 0.75rem;
}

.product-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.product-card p {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 1rem;
  flex: 1;
}

.product-link {
  font-size: 0.85rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.product-link:hover { opacity: 0.7; }

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tech-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.5rem;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-soft);
}

.tech-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.tech-card p {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.recent-card {
  display: block;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.recent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-soft);
}

.recent-card-cats {
  display: flex;
  gap: 6px;
  margin-bottom: 0.6rem;
}

.recent-cat {
  font-size: 0.72rem;
  padding: 2px 10px;
  border-radius: 6px;
  background: var(--vp-c-gold-soft);
  color: var(--vp-c-gold);
  font-weight: 500;
}

.recent-card h3 {
  font-size: 1rem;
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
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.recent-tags {
  display: flex;
  gap: 4px;
}

.recent-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.cta {
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: url('/lanyuejie-blog/images/cta-bg.jpg') center/cover no-repeat;
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 40, 35, 0.92) 0%, rgba(30, 60, 50, 0.88) 100%);
}

.cta-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 5rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.cta-inner h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.6rem;
  letter-spacing: -0.02em;
}

.cta-inner p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

@media (min-width: 1440px) {
  .hero { min-height: 600px; }
  .hero-title { font-size: 4rem; }
  .section-inner { max-width: 1320px; }
}

@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero { min-height: 420px; }
  .hero-inner { padding: 3.5rem 1.25rem; }
  .hero-title { font-size: 2.5rem; }
  .hero-sub { font-size: 1.1rem; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); max-width: 100%; margin-top: -1.5rem; }
  .product-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: 1fr 1fr; }
  .recent-grid { grid-template-columns: 1fr; }
  .section-inner { padding: 0 1.25rem; }
  .cta-inner { padding: 3.5rem 1.5rem; }
}

@media (max-width: 640px) {
  .hero-title { font-size: 2rem; }
  .hero-sub { font-size: 1rem; }
  .stats-bar { border-radius: 10px; }
  .stat-item { padding: 1.25rem 0.75rem; }
  .stat-value { font-size: 1.7rem; }
  .section-header h2 { font-size: 1.3rem; }
  .tech-grid { grid-template-columns: 1fr; }
  .cta-inner h2 { font-size: 1.4rem; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.75rem; }
  .stat-value { font-size: 1.5rem; }
  .hero-actions { gap: 10px; }
  .btn-primary, .btn-secondary { padding: 10px 24px; font-size: 14px; }
}
</style>
