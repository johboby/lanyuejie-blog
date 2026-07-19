---
title: 关于我们
---

<script setup>
const base = '/lanyuejie-blog'
</script>

<div class="about-page">
  <h1 class="page-title">关于揽月界科技</h1>

  <div class="about-content">
    <p class="lead">
      揽月界科技（Lanyuejie Technology）是一家专注于人工智能与风险控制的前沿科技企业，根植上海。
    </p>

    <p>
      我们以<strong>"双精两减"</strong>——精准识别、精细管理、减损增效、减灾防灾——为核心理念，
      致力于将AI技术深度应用于畜牧业、农业、水利、保险等实体经济领域。
    </p>

    <h2>🏢 核心理念</h2>
    <p>
      公司构建的<strong>五层脑启发架构</strong>（感知→认知→决策→执行→价值），
      融合物理信息AI、自适应进化引擎与安全合规闭环，
      为合作伙伴提供可靠、可控、可追溯的智能风控解决方案。
    </p>

    <h2>🤝 学术合作</h2>
    <p>
      与中央财经大学建立深度产学研合作关系，联合研发畜牧业智能监测、
      智能保险风控、农业标准化基础数据库、水利综合监控雷达软件等核心产品，
      将金融工程、精算科学与人工智能深度融合，推动行业智能化升级。
    </p>

    <h2>🚀 三级火箭发展战略</h2>

    <div class="roadmap-grid">
      <div class="roadmap-item active">
        <div class="phase">PHASE I · 当前阶段</div>
        <h3>扎根技术 · 夯实底座</h3>
        <p>聚焦AI核心算法与分层架构研发，深耕物理信息融合、自适应进化等关键技术。与中央财经大学深度合作，在畜牧业、农业、水利、保险四大领域落地智能风控产品。</p>
      </div>
      <div class="roadmap-item">
        <div class="phase">PHASE II · 近期目标</div>
        <h3>扩张生态 · 场景闭环</h3>
        <p>打通畜牧业、农业、水利、保险等场景闭环，构建跨行业协同的智能风控网络。持续深化与高校合作，拓展更多行业应用场景，形成可复制的技术解决方案体系。</p>
      </div>
      <div class="roadmap-item">
        <div class="phase">PHASE III · 未来愿景</div>
        <h3>升华价值 · 标准引领</h3>
        <p>推动解决方案向行业标准演进，输出可复制的认知框架与工具平台。以"双精两减"和防灾减损为核心价值，助力中国农业与保险行业实现智能化转型升级。</p>
      </div>
    </div>

    <h2>🌟 技术特色</h2>

    <div class="tech-grid">
      <div class="tech-item">
        <h4>物理信息融合AI</h4>
        <p>将质量守恒等物理定律嵌入神经网络，在复杂工况下保持模型鲁棒性，结果可解释、可验证、可信任。</p>
      </div>
      <div class="tech-item">
        <h4>自适应进化引擎</h4>
        <p>基于动态反馈机制驱动算法持续优化，系统具备随环境变化自主迭代的能力，越用越精准。</p>
      </div>
      <div class="tech-item">
        <h4>安全合规闭环</h4>
        <p>国密算法 + 零信任架构 + 区块链存证，全链路数据安全与决策可追溯，满足等保2.0要求。</p>
      </div>
      <div class="tech-item">
        <h4>分层推理模型</h4>
        <p>HighModule统筹全局策略，LowModule执行精细操作，双层结构实现从宏观决策到微观执行的贯通。</p>
      </div>
    </div>

    <h2>📬 联系我们</h2>
    <ul class="contact-list">
      <li>📧 邮箱：<a href="mailto:samhoclub@163.com">samhoclub@163.com</a></li>
      <li>🌐 官网：<a href="https://www.cycu.top" target="_blank">www.cycu.top</a></li>
      <li>📱 公众号：尘渊文化</li>
    </ul>

    <div class="vision-quote">
      <p>揽月于九天，划界于未来。</p>
      <p>以技术为基石，以创新为动力，构建智慧、绿色、可持续的美好社会。</p>
    </div>
  </div>
</div>

<style scoped>
.about-page {
  max-width: 780px;
  margin: 0 auto;
}
.page-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #3b7a6b, #8b6f47);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.about-content {
  font-size: 15px;
  line-height: 1.9;
}
.about-content :deep(p) {
  margin-bottom: 1rem;
  color: var(--vp-c-text-2);
}
.about-content :deep(.lead) {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  line-height: 1.8;
}
.about-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}
.about-content :deep(strong) {
  color: var(--vp-c-text-1);
}
.roadmap-grid {
  display: grid;
  gap: 1rem;
  margin: 1rem 0 2rem;
}
.roadmap-item {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.3s, box-shadow 0.3s;
}
.roadmap-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.roadmap-item.active {
  border-left: 3px solid #c9a84c;
}
.roadmap-item .phase {
  font-family: monospace;
  font-size: 0.72rem;
  color: #3b7a6b;
  letter-spacing: 0.1em;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
}
.roadmap-item h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--vp-c-text-1);
}
.roadmap-item p {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.75;
  margin-bottom: 0;
}
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin: 1rem 0 2rem;
}
.tech-item {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.3s;
}
.tech-item:hover {
  transform: translateY(-2px);
}
.tech-item h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}
.tech-item p {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 0;
}
.contact-list {
  padding-left: 1.2rem;
  list-style: disc;
}
.contact-list li {
  margin-bottom: 0.5rem;
}
.contact-list a {
  color: #3b7a6b;
  text-decoration: none;
  transition: color 0.2s;
}
.contact-list a:hover {
  color: #2d5a4f;
  text-decoration: underline;
}
.vision-quote {
  margin-top: 2.5rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(59, 122, 107, 0.06), rgba(139, 111, 71, 0.04));
  border-radius: 12px;
  border-left: 3px solid #3b7a6b;
}
.vision-quote p {
  font-style: italic;
  color: var(--vp-c-text-1);
  font-weight: 500;
  margin-bottom: 0.4rem;
  line-height: 1.8;
}
.vision-quote p:last-child {
  margin-bottom: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 400;
}
</style>
