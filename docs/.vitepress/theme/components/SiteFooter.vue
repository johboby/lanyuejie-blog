<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">揽月界科技</div>
          <p class="footer-desc">AI驱动的风险控制前沿企业<br/>精准识别 · 精细管理 · 减损增效 · 减灾防灾</p>
        </div>
        <div class="footer-nav">
          <h4>导航</h4>
          <a href="/lanyuejie-blog/">首页</a>
          <a href="/lanyuejie-blog/posts/">文章</a>
          <a href="/lanyuejie-blog/categories/">分类</a>
          <a href="/lanyuejie-blog/tags/">标签</a>
          <a href="/lanyuejie-blog/about">关于</a>
        </div>
        <div class="footer-products">
          <h4>核心产品</h4>
          <a href="https://szxt.cycu.top" target="_blank" rel="noopener">生猪养殖风险监测</a>
          <a href="https://agri.cycu.top" target="_blank" rel="noopener">牦牛监测智能保险</a>
          <a href="https://risk.cycu.top" target="_blank" rel="noopener">农业标准化数据库</a>
        </div>
        <div class="footer-contact">
          <h4>联系方式</h4>
          <a href="mailto:samhoclub@163.com">samhoclub@163.com</a>
          <span class="footer-contact-item">微信：cy321one</span>
          <span class="footer-contact-item">公众号：尘渊文化</span>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© {{ year }} 揽月界科技 Lanyuejie Technology. All rights reserved.</p>
        <p class="footer-icp">揽月于九天，划界于未来</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 0;
  padding: 3rem 0 1.5rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

.footer-logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.footer-desc {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  line-height: 1.7;
  margin: 0;
}

.footer-nav h4,
.footer-products h4,
.footer-contact h4 {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
  letter-spacing: 0.02em;
}

.footer-nav a,
.footer-products a,
.footer-contact a {
  display: block;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.footer-nav a:hover,
.footer-products a:hover,
.footer-contact a:hover {
  color: var(--vp-c-brand-1);
}

.footer-contact-item {
  display: block;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1.25rem;
  text-align: center;
}

.footer-bottom p {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.footer-icp {
  margin-top: 0.3rem !important;
  font-style: italic;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .footer-inner { padding: 0 1.25rem; }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
