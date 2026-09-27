---
title: 揽月界科技
layout: page
---

<main class="home">
  <!-- Hero: magazine-cover centered, no side panel -->
  <section class="hero reveal" data-part="hero" aria-label="品牌介绍">
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
  <section class="metrics reveal reveal-delay-1" data-part="metrics" aria-label="研究数据">
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
        <a href="/lanyuejie-blog/posts/" class="cat-nav-card" data-part="cat-card">
          <span class="cat-nav-glyph" aria-hidden="true">AI</span>
          <span class="cat-nav-name">智能科技</span>
          <span class="cat-nav-count" id="cat-ai-count">0 篇</span>
        </a>
        <a href="/lanyuejie-blog/posts/" class="cat-nav-card" data-part="cat-card">
          <span class="cat-nav-glyph" aria-hidden="true">风险</span>
          <span class="cat-nav-name">风险研究</span>
          <span class="cat-nav-count" id="cat-risk-count">0 篇</span>
        </a>
        <a href="/lanyuejie-blog/posts/" class="cat-nav-card" data-part="cat-card">
          <span class="cat-nav-glyph" aria-hidden="true">农业</span>
          <span class="cat-nav-name">农业监测</span>
          <span class="cat-nav-count" id="cat-agri-count">0 篇</span>
        </a>
        <a href="/lanyuejie-blog/posts/" class="cat-nav-card" data-part="cat-card">
          <span class="cat-nav-glyph" aria-hidden="true">保险</span>
          <span class="cat-nav-name">智能保险</span>
          <span class="cat-nav-count" id="cat-ins-count">0 篇</span>
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
        <div class="featured-media" aria-hidden="true">
          <span class="featured-media-tag" id="featured-tag">精选研究</span>
        </div>
        <div class="featured-body">
          <span class="eyebrow">FEATURED</span>
          <h3 class="featured-title" id="featured-title">加载中…</h3>
          <p class="featured-excerpt" id="featured-excerpt"></p>
          <time class="featured-date" id="featured-date" datetime=""></time>
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
        <a href="/lanyuejie-blog/posts/" class="btn btn-outline" data-part="articles-more">查看全部 0 篇研究 →</a>
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

  // 文章数据：从构建内嵌数据读取
  var posts = window.__VP_POSTS__ || [];
  var sorted = posts.slice().sort(function(a, b) {
    return new Date(b.date || 0) - new Date(a.date || 0);
  });

  // withBase 兜底
  var base = (typeof withBase === 'function') ? withBase : function(p) { return '/lanyuejie-blog' + p; };

  // 文章数量
  var countEl = document.getElementById('post-count');
  if (countEl) countEl.textContent = posts.length;

  // 总字数
  var totalWords = 0;
  posts.forEach(function(p) { totalWords += (p.wordCount || 0); });
  var wordEl = document.getElementById('word-count');
  if (wordEl) wordEl.textContent = totalWords.toLocaleString();

  // 标签数（去重）
  var allTags = new Set();
  posts.forEach(function(p) { (p.tags || []).forEach(function(t) { allTags.add(t); }); });
  var tagEl = document.getElementById('tag-count');
  if (tagEl) tagEl.textContent = allTags.size;

  // 分类计数
  var catCounts = { 'AI': 0, '风险': 0, '农业': 0, '保险': 0 };
  posts.forEach(function(p) {
    var cats = p.categories || [];
    var tags = p.tags || [];
    var all = cats.concat(tags);
    all.forEach(function(t) {
      if (catCounts.hasOwnProperty(t)) catCounts[t]++;
    });
    // 关键词匹配兜底
    var title = (p.title || '').toLowerCase();
    if (title.indexOf('ai') !== -1 || title.indexOf('智能') !== -1) catCounts['AI']++;
    if (title.indexOf('风险') !== -1 || title.indexOf('防灾') !== -1) catCounts['风险']++;
    if (title.indexOf('农业') !== -1 || title.indexOf('养殖') !== -1) catCounts['农业']++;
    if (title.indexOf('保险') !== -1) catCounts['保险']++;
  });
  Object.keys(catCounts).forEach(function(k) {
    var el = document.getElementById('cat-' + k.toLowerCase() + '-count');
    if (el) el.textContent = catCounts[k] + ' 篇';
  });

  // 1. 精选文章：取第一篇
  if (sorted.length > 0) {
    var fp = sorted[0];
    var featTitle = document.getElementById('featured-title');
    var featCard = document.querySelector('.featured-card');
    var featTag = document.getElementById('featured-tag');
    var featExcerpt = document.getElementById('featured-excerpt');
    var featDate = document.getElementById('featured-date');
    if (featTitle) featTitle.textContent = fp.title || '暂无文章';
    if (featCard && fp.url) featCard.href = base(fp.url);
    if (featExcerpt) featExcerpt.textContent = fp.excerpt || '';
    if (featDate && fp.date) {
      var isoDate = new Date(fp.date).toISOString();
      featDate.textContent = isoDate.slice(0, 10);
      featDate.setAttribute('datetime', isoDate);
      featDate.style.display = 'block';
      featDate.style.fontSize = '0.82rem';
      featDate.style.color = 'var(--vp-c-text-3)';
      featDate.style.marginTop = '8px';
    }
    if (fp.tags && fp.tags.length) {
      if (featTag) featTag.textContent = fp.tags[0];
    }
  }

  // 2. 文章网格：取第 2-5 篇
  var grid = document.getElementById('post-grid');
  if (grid) {
    grid.innerHTML = '';
    var monoIdx = 0;
    var monograms = ['AI', '风', '农', '智', '数', '安'];
    for (var i = 0; i < 4 && sorted[i + 1]; i++) {
      var p = sorted[i + 1];
      var card = document.createElement('article');
      card.className = 'post-card';
      card.setAttribute('data-part', 'post-card');
      var link = document.createElement('a');
      link.href = base(p.url);
      link.setAttribute('aria-label', p.title || '暂无文章');
      var mono = document.createElement('span');
      mono.className = 'post-card-monogram';
      mono.textContent = monograms[monoIdx % monograms.length];
      mono.setAttribute('aria-hidden', 'true');
      monoIdx++;
      var h3 = document.createElement('h3');
      h3.textContent = p.title || '暂无文章';
      link.appendChild(mono);
      link.appendChild(h3);
      card.appendChild(link);
      if (p.date) {
        var time = document.createElement('time');
        time.className = 'post-card-date';
        time.setAttribute('datetime', new Date(p.date).toISOString());
        time.textContent = new Date(p.date).toISOString().slice(0, 10);
        card.appendChild(time);
      }
      grid.appendChild(card);
    }
  }

  // 3. "查看全部"链接
  var moreLink = document.querySelector('[data-part="articles-more"]');
  if (moreLink) moreLink.textContent = '查看全部 ' + posts.length + ' 篇研究 →';

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
