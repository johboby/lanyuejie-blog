---
title: 关于我们
---

<script setup>
const products = [
  {
    name: '生猪养殖风险监测与保险平台',
    desc: 'IoT + AI图像识别 + 区块链存证，实现牲畜标的精准追踪、生长状态监测与疫病风险预警。',
    url: 'https://szxt.cycu.top',
    tag: '畜牧',
  },
  {
    name: '牦牛监测和智能保险系统',
    desc: '覆盖标的识别、风险评估、理赔存证的全流程智能保险平台，实现风险精准定价与防灾减损预警。',
    url: 'https://agri.cycu.top',
    tag: '畜牧',
  },
  {
    name: '农业标准化基础数据库平台',
    desc: '整合土壤、气候、作物、养殖等多维数据，以统一数据标准驱动精准农业决策。',
    url: 'https://risk.cycu.top',
    tag: '农业',
  },
  {
    name: '马铃薯晚疫病智能监测系统',
    desc: 'AI驱动的作物病害实时监测与预警，精准施药降低损失。',
    url: 'https://risk.cycu.top',
    tag: '农业',
  },
  {
    name: '水利综合监控雷达软件',
    desc: '融合雷达遥感监测与AI预测模型，实现水位、流速、降雨量实时监测与洪涝灾害早期预警。',
    url: '',
    tag: '水利',
  },
]

const roadmap = [
  {
    phase: 'PHASE I',
    label: '当前阶段',
    title: '扎根技术 · 夯实底座',
    desc: '聚焦AI核心算法与分层架构研发，深耕物理信息融合、自适应进化等关键技术。与中央财经大学深度合作，在畜牧业、农业、水利、保险四大领域落地智能风控产品。',
    active: true,
  },
  {
    phase: 'PHASE II',
    label: '近期目标',
    title: '扩张生态 · 场景闭环',
    desc: '打通畜牧业、农业、水利、保险等场景闭环，构建跨行业协同的智能风控网络。持续深化与高校合作，拓展更多行业应用场景，形成可复制的技术解决方案体系。',
    active: false,
  },
  {
    phase: 'PHASE III',
    label: '未来愿景',
    title: '升华价值 · 标准引领',
    desc: '推动解决方案向行业标准演进，输出可复制的认知框架与工具平台。以「双精两减」和防灾减损为核心价值，助力中国农业与保险行业实现智能化转型升级。',
    active: false,
  },
]

const techFeatures = [
  {
    name: '物理信息融合AI',
    desc: '将质量守恒等物理定律嵌入神经网络，在复杂工况下保持模型鲁棒性，结果可解释、可验证、可信任。',
  },
  {
    name: '自适应进化引擎',
    desc: '基于动态反馈机制驱动算法持续优化，系统具备随环境变化自主迭代的能力，越用越精准。',
  },
  {
    name: '安全合规闭环',
    desc: '国密算法 + 零信任架构 + 区块链存证，全链路数据安全与决策可追溯，满足等保2.0要求。',
  },
  {
    name: '分层推理模型',
    desc: 'HighModule统筹全局策略，LowModule执行精细操作，双层结构实现从宏观决策到微观执行的贯通。',
  },
]
</script>

<div class="about">
  <section class="about-hero">
    <div class="about-hero-bg"></div>
    <div class="about-hero-overlay"></div>
    <div class="about-hero-inner">
      <p class="about-overline">About Us</p>
      <h1 class="about-title">关于揽月界科技</h1>
      <p class="about-lead">专注于人工智能与风险控制的前沿科技企业，根植上海</p>
      <p class="about-tagline">精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
    </div>
  </section>

  <section class="about-intro">
    <div class="section-inner">
      <div class="intro-grid">
        <div class="intro-main">
          <h2>我们的使命</h2>
          <p>揽月界科技（Lanyuejie Technology）以「双精两减」为核心理念，致力于将AI技术深度应用于畜牧业、农业、水利、保险等实体经济领域，构建可靠、可控、可追溯的智能风控解决方案。</p>
          <p>公司构建的「五层脑启发架构」（感知→认知→决策→执行→价值），融合物理信息AI、自适应进化引擎与安全合规闭环，为合作伙伴提供可靠、可控、可追溯的智能风控解决方案。</p>
        </div>
        <div class="intro-side">
          <div class="intro-highlight">
            <div class="highlight-label">核心架构</div>
            <div class="highlight-value">五层脑启发架构</div>
            <div class="highlight-desc">感知 → 认知 → 决策 → 执行 → 价值</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="about-products">
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

  <section class="about-academic">
    <div class="section-inner">
      <div class="academic-card">
        <div class="academic-badge">产学研合作</div>
        <h2>与中央财经大学深度合作</h2>
        <p>联合研发畜牧业智能监测、智能保险风控、农业标准化基础数据库、水利综合监控雷达软件等核心产品，将金融工程、精算科学与人工智能深度融合，推动行业智能化升级。</p>
      </div>
    </div>
  </section>

  <section class="about-roadmap">
    <div class="section-inner">
      <div class="section-header">
        <h2>三级火箭发展战略</h2>
      </div>
      <div class="roadmap-grid">
        <div v-for="r in roadmap" :key="r.phase" class="roadmap-card" :class="{ active: r.active }">
          <div class="roadmap-phase">
            <span class="phase-code">{{ r.phase }}</span>
            <span class="phase-label">{{ r.label }}</span>
          </div>
          <h3>{{ r.title }}</h3>
          <p>{{ r.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="about-tech">
    <div class="section-inner">
      <div class="section-header">
        <h2>技术特色</h2>
      </div>
      <div class="tech-grid">
        <div v-for="t in techFeatures" :key="t.name" class="tech-card">
          <h3>{{ t.name }}</h3>
          <p>{{ t.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="about-contact">
    <div class="section-inner">
      <div class="section-header">
        <h2>联系我们</h2>
      </div>
      <div class="contact-grid">
        <a href="mailto:samhoclub@163.com" class="contact-card">
          <div class="contact-icon">✉</div>
          <div class="contact-label">邮箱</div>
          <div class="contact-value">samhoclub@163.com</div>
        </a>
        <div class="contact-card">
          <div class="contact-icon">💬</div>
          <div class="contact-label">微信</div>
          <div class="contact-value">cy321one</div>
        </div>
        <div class="contact-card">
          <div class="contact-icon">📱</div>
          <div class="contact-label">公众号</div>
          <div class="contact-value">尘渊文化</div>
        </div>
      </div>
    </div>
  </section>

  <section class="about-vision">
    <div class="about-vision-bg"></div>
    <div class="about-vision-overlay"></div>
    <div class="vision-inner">
      <p class="vision-main">揽月于九天，划界于未来。</p>
      <p class="vision-sub">以技术为基石，以创新为动力，构建智慧、绿色、可持续的美好社会。</p>
    </div>
  </section>
</div>

<style scoped>
.about {
  overflow-x: hidden;
  width: 100%;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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

.about-hero {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.about-hero-bg {
  position: absolute;
  inset: 0;
  background: url('/lanyuejie-blog/images/about-hero.jpg') center/cover no-repeat;
}

.about-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 40, 35, 0.9) 0%, rgba(30, 70, 60, 0.85) 50%, rgba(50, 90, 70, 0.78) 100%);
}

.about-hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
}

.about-overline {
  font-family: monospace;
  font-size: 0.82rem;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.about-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 0.75rem;
  color: #fff;
}

.about-lead {
  font-size: 1.15rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.about-tagline {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.06em;
}

.about-intro {
  padding: 4rem 0;
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 3rem;
  align-items: start;
}

.intro-main h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.intro-main p {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.9;
  margin-bottom: 1rem;
}

.intro-highlight {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.75rem;
  border-left: 3px solid var(--vp-c-gold);
}

.highlight-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-bottom: 0.6rem;
}

.highlight-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.highlight-desc {
  font-size: 0.88rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.about-products {
  padding: 3rem 0;
}

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

.about-academic {
  padding: 2rem 0 3rem;
}

.academic-card {
  background: linear-gradient(135deg, rgba(45, 106, 90, 0.06), rgba(201, 168, 76, 0.04));
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 3rem;
  text-align: center;
}

.academic-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 3px 14px;
  border-radius: 6px;
  background: var(--vp-c-gold-soft);
  color: var(--vp-c-gold);
  margin-bottom: 1.25rem;
}

.academic-card h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.academic-card p {
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  line-height: 1.85;
  max-width: 700px;
  margin: 0 auto;
}

.about-roadmap {
  padding: 3rem 0;
}

.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.roadmap-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.75rem;
  transition: transform 0.25s, box-shadow 0.25s;
}

.roadmap-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.roadmap-card.active {
  border-left: 3px solid var(--vp-c-gold);
}

.roadmap-phase {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.75rem;
}

.phase-code {
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.1em;
  font-weight: 600;
}

.phase-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.roadmap-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.6rem;
}

.roadmap-card p {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.8;
  margin: 0;
}

.about-tech {
  padding: 3rem 0;
}

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
  line-height: 1.7;
  margin: 0;
}

.about-contact {
  padding: 3rem 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.contact-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 1.75rem;
  text-align: center;
  text-decoration: none;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-soft);
}

.contact-icon {
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
}

.contact-label {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-bottom: 0.35rem;
}

.contact-value {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 600;
  word-break: break-all;
}

.about-vision {
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
}

.about-vision-bg {
  position: absolute;
  inset: 0;
  background: url('/lanyuejie-blog/images/agriculture.jpg') center/cover no-repeat;
}

.about-vision-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 40, 35, 0.92) 0%, rgba(30, 60, 50, 0.88) 100%);
}

.vision-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.vision-main {
  font-size: 1.4rem;
  font-weight: 700;
  font-style: italic;
  color: #fff;
  margin-bottom: 0.6rem;
}

.vision-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

@media (min-width: 1440px) {
  .section-inner { max-width: 1320px; }
}

@media (max-width: 1024px) {
  .intro-grid { grid-template-columns: 1fr; }
  .intro-highlight { border-left: none; border-top: 3px solid var(--vp-c-gold); }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
  .roadmap-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .about-hero { min-height: 340px; }
  .about-hero-inner { padding: 3rem 1.25rem; }
  .about-title { font-size: 2.2rem; }
  .section-inner { padding: 0 1.25rem; }
  .product-grid { grid-template-columns: 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
  .academic-card { padding: 2rem 1.5rem; }
}

@media (max-width: 640px) {
  .about-title { font-size: 1.9rem; }
  .tech-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .about-title { font-size: 1.7rem; }
}
</style>
