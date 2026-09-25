---
title: 揽月界科技
layout: page
---

<div class="home">
  <section class="hero reveal" data-part="hero" aria-label="品牌介绍">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-inner">
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
    </div>
  </section>

  <section class="metrics reveal reveal-delay-1" data-part="metrics" aria-label="研究数据">
    <div class="metrics-inner">
      <div class="metric">
        <span class="metric-num" id="post-count">—</span>
        <span class="metric-label">研究文章</span>
      </div>
    </div>
  </section>

  <section class="section cat-nav reveal reveal-delay-1" data-part="cat-nav" aria-label="分类导航">
    <div class="section-inner">
      <div class="cat-nav-grid">
        <a href="/lanyuejie-blog/posts/" class="cat-nav-card" data-part="cat-card">
          <span class="cat-nav-glyph" aria-hidden="true">AI</span>
          <span class="cat-nav-name">智能科技</span>
          <span class="cat-nav-count">0 篇</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section featured-section reveal reveal-delay-2" data-part="featured" aria-label="精选研究">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">FEATURED</span>
        <h2 class="section-title">精选研究</h2>
      </div>
      <a href="/lanyuejie-blog/posts/" class="featured-card" data-part="featured-card">
        <div class="featured-media" aria-hidden="true">
          <span class="featured-media-tag">精选研究</span>
        </div>
        <div class="featured-body">
          <span class="eyebrow">FEATURED</span>
          <h3 class="featured-title">暂无文章</h3>
        </div>
      </a>
    </div>
  </section>

  <section class="section articles-section reveal reveal-delay-3" data-part="articles" aria-label="最新研究">
    <div class="section-inner">
      <div class="section-head">
        <span class="eyebrow">LATEST</span>
        <h2 class="section-title">最新研究</h2>
      </div>
      <div class="post-grid">
        <a href="/lanyuejie-blog/posts/" class="post-card" data-part="post-card">
          <div class="post-card-media" aria-hidden="true">
            <span class="post-card-monogram"></span>
          </div>
          <h3>暂无文章</h3>
        </a>
        <a href="/lanyuejie-blog/posts/" class="post-card" data-part="post-card">
          <div class="post-card-media" aria-hidden="true">
            <span class="post-card-monogram"></span>
          </div>
          <h3>暂无文章</h3>
        </a>
        <a href="/lanyuejie-blog/posts/" class="post-card" data-part="post-card">
          <div class="post-card-media" aria-hidden="true">
            <span class="post-card-monogram"></span>
          </div>
          <h3>暂无文章</h3>
        </a>
      </div>
      <div class="posts-more">
        <a href="/lanyuejie-blog/posts/" class="btn btn-outline" data-part="articles-more">查看全部 0 篇研究 →</a>
      </div>
    </div>
  </section>

  <section class="section subscribe reveal reveal-delay-3" data-part="subscribe" aria-label="订阅更新">
    <div class="subscribe-card">
      <div class="subscribe-inner">
        <span class="eyebrow">STAY UPDATED</span>
        <h2 class="section-title">订阅研究更新</h2>
        <p class="section-subtitle">每月一封，精选 AI 与风险控制的深度研究</p>
        <form class="subscribe-form" data-part="subscribe-form" novalidate>
          <input type="email" class="subscribe-input" placeholder="you@example.com" aria-label="邮箱地址" required />
          <button type="submit" class="subscribe-btn" data-part="subscribe-btn">订阅</button>
        </form>
        <p class="subscribe-feedback" aria-live="polite" hidden></p>
      </div>
    </div>
  </section>

  <section class="section contact reveal reveal-delay-4" data-part="contact" aria-label="联系方式" id="contact">
    <div class="contact-card">
      <div class="section-head">
        <span class="eyebrow">CONTACT</span>
        <h2 class="section-title">联系我们</h2>
      </div>
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
</div>

<script>
// SSR 安全：所有客户端专用逻辑包裹在 typeof window 检查中
if (typeof window !== 'undefined') {
  // 滚动揭示：IntersectionObserver（Zag hidden → visible 状态机）
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
  }

  // 文章数量：从构建内嵌数据读取，兜底为静态值
  try {
    var posts = window.__VP_POSTS__ || [];
    var countEl = document.getElementById('post-count');
    if (countEl) countEl.textContent = posts.length;
  } catch(e) { /* noop */ }

  // 订阅表单反馈
  var form = document.querySelector('.subscribe-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('.subscribe-input');
      var feedback = form.parentElement.querySelector('.subscribe-feedback');
      if (!input || !input.value || input.value.indexOf('@') === -1) {
        input.classList.add('input-error');
        if (feedback) { feedback.textContent = '请输入有效的邮箱地址'; feedback.hidden = false; }
        return;
      }
      input.classList.remove('input-error');
      input.classList.add('input-success');
      if (feedback) { feedback.textContent = '订阅成功！'; feedback.hidden = false; }
      form.reset();
      setTimeout(function() { input.classList.remove('input-success'); }, 2000);
    });
  }
}
</script>
