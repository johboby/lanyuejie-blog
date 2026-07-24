---
title: 揽月界科技
layout: page
---

<script setup>
import { data as posts } from './.vitepress/posts.data.js'
import { withBase } from 'vitepress'

const recentPosts = (posts || []).slice(0, 6)

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
    </div>
    <div class="hero-visual" aria-hidden="true">
      <img class="hero-visual-img" :src="withBase('/images/agriculture.jpg')" alt="" />
      <div class="hero-visual-scrim"></div>
      <div class="hero-visual-content">
        <div class="hero-stat hero-stat-tl">
          <span class="hero-stat-num">98%</span>
          <span class="hero-stat-label">标的识别精度</span>
        </div>
        <div class="hero-stat hero-stat-br">
          <span class="hero-stat-num">-32%</span>
          <span class="hero-stat-label">灾害损失</span>
        </div>
        <div class="hero-visual-mark">LANYUEJIE<br/>TECHNOLOGY</div>
      </div>
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
      <div class="post-grid">
        <a v-for="post in recentPosts" :key="post.url" :href="withBase(post.url)" class="post-card">
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
