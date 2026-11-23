# 前端全面改进——视觉冲击力优先 + 结构修复

## Context

用户要求对 lanyuejie-blog（VitePress 1.6.4 SSG 文档站，base `/lanyuejie-blog/`）前端做全面改进与完善，并明确指定使用 `frontend-design` 与 `web-app-development`（uicraft）两个插件。经沟通，用户选择：

- **侧重方向**：视觉冲击力优先（bolder/overdrive 方向，在结构正确前提下强化 Hero、卡片、动效的品牌个性）
- **实施方式**：一次性全量改进

审计发现两类问题：**结构正确性**（缺失类、重复进度条、控件重叠、emoji 图标、重复计数 bug）和**表达力**（Hero 冲击力不足、卡片 hover 平淡、featured 品牌覆盖媒体未真正实现）。按 uicraft 决策优先级，先修结构，再做视觉强化，最后验证。

## 现状审计（实测）

**结构问题（优先修复）**
1. **5 个 CSS 类缺失**，被引用但未定义：
   - `.sr-only`（index.md L132 订阅邮箱 label）→ 标签裸露可见
   - `.result-count`（posts/index.md L322 结果计数）
   - `.filter-status` / `.clear-filter`（posts/index.md L325-327 筛选状态条）
   - `.tags-toggle`（posts/index.md L277/294 展开分类/标签按钮）
2. **双重阅读进度条**：`Layout.vue` 的 `.reading-progress`（全站固定顶栏，L834）+ `ReadingEnhance.vue` 的 `.reading-bar`（文章页）→ 文章页两条重叠
3. **底部控件重叠**：`.theme-toggle`（bottom20/right20）+ `.back-to-top`（bottom20/right80）+ `.font-toolbar`（bottom24/right16）→ 三者挤在右下，back-to-top 与 font-toolbar 几乎叠在一起
4. **emoji 主题图标**：`Layout.vue` 用 🌙/☀️，违反 AGENTS.md「不用 emoji 图标（用 SVG/品牌字形）」
5. **首页分类计数重复计数 bug**：`index.md` L216-230，同一篇既匹配 `categories/tags`（L222 `catCounts[t]++`）又匹配标题关键词（L226-229）时被加两次
6. **首页 featured 媒体未真正实现**：`featured-media` 只有 tag 字标，无品牌覆盖 media 视觉（gradient + glyph 已定义但 `featured-media-glyph` 未在首页使用——首页 L95-97 只有 `featured-media-tag`）

**表达力问题（视觉强化）**
7. Hero 冲击力：`hero-title` 纯色、`hero-magazine` 渐变 12s 循环偏弱，缺「杂志封面」的强视觉锚点
8. 卡片 hover：`.post-card-article` 已有磁吸 scale(1.02)，但 `.post-card`（首页）、`.cat-nav-card`、`.featured-card` hover 偏弱，缺品牌色描边/光晕
9. 动效密度：Hero 渐变 12s + featured mediaShimmer 8s 两个无限循环，缺「一签一幕」的聚焦动效（uicraft：one well-choreographed sequence beats animation everywhere）

## 设计决策（确认）

- **阅读进度条**：保留 `Layout.vue` 的 `.reading-progress`（全站，滚动任何页都有价值），**删除** `ReadingEnhance.vue` 的 `.reading-bar`。ReadingEnhance 保留字号调节工具栏。
- **底部控件**：右下垂直栈，互不重叠——`.font-toolbar`（bottom 24，仅文章页）+ `.theme-toggle`（bottom 84）+ `.back-to-top`（bottom 144，滚动>400 显示）。移动端 font-toolbar 仍移到左侧。
- **首页分类卡片**：保留业务领域语义（AI/风险/农业/保险），**不强行改成内容轴**——两者语义不同（首页=品牌业务导航，归档=内容类型轴），AGENTS.md 的「7 组 CATEGORY_GROUPS」是历史构想，当前实现是 4 业务领域，保持现状避免破坏信息架构。
- **emoji → SVG**：主题切换换成太阳/月亮 SVG 图标（交叉淡入）。
- **视觉强化方向**：品牌绿-金（`--brand-primary`/`--brand-accent`）为锚，Hero 渐变标题 + 光晕锚点、卡片 hover 渐变描边 + 抬升、featured 品牌覆盖媒体（gradient + 大 glyph 字标，已定义样式需在首页补上 `featured-media-glyph`）。

## 改动清单

### A. style.css（核心，`docs/.vitepress/theme/style.css`）

**A1. 补齐缺失类（结构修复）**
- `.sr-only`：`position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;`
- `.result-count`：`font-size:0.85rem; color:var(--vp-c-text-3); white-space:nowrap;`（toolbar 内垂直居中）
- `.filter-status`：`display:flex; align-items:center; justify-content:space-between; gap:var(--space-3); padding:var(--space-3) var(--space-4); margin-bottom:var(--space-4); border-radius:var(--radius-sm); background:var(--vp-c-brand-soft); color:var(--vp-c-text-2); font-size:0.86rem;`
- `.clear-filter`：`padding:2px 12px; font-size:0.8rem; font-weight:600; color:var(--brand-primary); background:transparent; border:1px solid var(--brand-primary); border-radius:var(--radius-full); cursor:pointer; transition:all var(--motion-fast) var(--easing);` + hover/focus-visible
- `.tags-toggle`：`margin-top:var(--space-2); font-size:0.78rem; font-weight:600; color:var(--brand-primary); background:none; border:none; cursor:pointer; padding:4px 8px;` + hover/focus-visible

**A2. 底部控件重排（结构修复）**
- `.theme-toggle`：`bottom:84px; right:20px;`（保持 48px 圆形）
- `.back-to-top`：`bottom:144px; right:20px;`（从 right80 改 right20，与 theme-toggle 同轴垂直栈）
- `.font-toolbar`：`bottom:24px; right:16px;`（保持文章页专属；移动端移到左下 bottom 16 left 16）

**A3. 视觉强化：Hero（bolder/overdrive）**
- `.hero-magazine`：`::before` 保留深绿渐变（magazine 始终深底，浅/暗色均深底白字，可读），加一层 `radial-gradient` 金高光锚点；`heroShimmer` 12s → `18s ease-in-out infinite alternate`（降低频率，避免躁动）
- `.hero-magazine .hero-title`（L880-888）：白 → 金渐变标题。改 `background:linear-gradient(115deg, #fff 20%, var(--brand-accent) 55%, #fff 90%); -webkit-background-clip:text; background-clip:text; color:transparent;`，保留 text-shadow（用 `drop-shadow` 避免与 clip 冲突，`filter:drop-shadow(0 4px 30px rgba(0,0,0,0.3))`）。暗色（`[data-vp-theme=dark]`）下用亮金 `#ecd999` 提亮
- `.hero-magazine .hero-badge`：加 `box-shadow:0 0 24px rgba(201,168,76,0.25)` 光晕（浅/暗皆适用）
- `.hero-floating-stats`（L268）：玻璃拟态增强 `background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.28)`

**A4. 视觉强化：卡片 hover（delight）**
- `.post-card`（首页）：hover 加渐变描边（`border-color:var(--brand-primary)` + `box-shadow:0 0 0 1px rgba(31,79,66,0.2), var(--shadow-3)` + `transform:translateY(-4px)`）
- `.cat-nav-card`：hover 加品牌光晕（`box-shadow:0 8px 28px rgba(31,79,66,0.14)`）+ glyph 微放大
- `.featured-card`：hover 抬升 -4px + 渐变描边 + media glyph scale(1.06)

**A5. 视觉强化：featured 品牌覆盖媒体（补上缺失 glyph）**
- 首页 index.md L95-97 `featured-media` 内补 `<span class="featured-media-glyph">研</span>`（品牌字标），让 `.featured-media-glyph` 样式真正生效
- `.featured-media` 渐变强化：`linear-gradient(135deg, var(--brand-primary-strong) 0%, var(--brand-primary) 50%, var(--brand-accent) 100%)`（加入品牌金）

**A6. 动效密度收敛（animate 原则）**
- 删除 `.featured-card .featured-media` 的 `mediaShimmer 8s` 无限循环（A5 渐变已够），避免与 Hero 双循环
- 保留 Hero 单一 18s 渐变作为「一签一幕」
- `prefers-reduced-motion` 已有全局规则，保留

### B. Layout.vue（`docs/.vitepress/theme/Layout.vue`）

**B1. emoji → SVG 主题图标**：🌙/☀️（L111-112）换成内联 SVG（太阳=circle+rays，月亮=path），`v-if="isDark"`/`v-else` 交叉淡入，`aria-hidden="true"`（按钮已有 aria-label）
**B2. `.back-to-top` 语义化 + SVG**：`<div>`（L116）改为 `<button type="button" class="back-to-top" :class="{visible}">`，`↑` 文本换成内联 SVG 箭头（chevron-up），加 `aria-label="回到顶部"`、`:aria-hidden="false"`（visible 时）
**B3. 保留 `.reading-progress`**（L105-107，全站进度条，不做改动）

### C. ReadingEnhance.vue（`docs/.vitepress/theme/components/ReadingEnhance.vue`）

**C1. 删除 `.reading-bar` 阅读进度条**（L103-105），避免与 Layout 的 `.reading-progress` 重叠。删除：
- 模板中 `<div class="reading-bar">`（L103-105）
- `<style scoped>` 中 `.reading-bar` / `.reading-bar-fill`（L115-132）
- 仅服务进度条的脚本：`progress` ref（L8）、`rafId`（L16）、`onScroll`（L17-27）、`onMounted` 里的 `window.addEventListener('scroll', onScroll...)` 与 `onScroll()` 调用（L81-84）、`onBeforeUnmount` 里的 `removeEventListener('scroll', onScroll)`（L89）、`watch` 里的 `progress.value = 0`（L96）
- **保留**：`fontLevel`/`applyFont`/`setFont`/`cycleFont`（字号工具栏）、`setupScrollableTables`/`updateTableHints`（表格滚动）、`onMounted` 里的 `applyFont()`/`requestAnimationFrame(setupScrollableTables)`、`watch` 里的 `applyFont()`/`setupScrollableTables()`
- `.font-toolbar` 样式（L133-164）保留

### D. index.md（首页，`docs/index.md`）

**D1. 补 featured-media-glyph**（见 A5）
**D2. 修复分类计数重复 bug**：L217-230 改为「每篇最多对每个分类计一次」：
```js
var catCounts = { 'AI': 0, '风险': 0, '农业': 0, '保险': 0 };
posts.forEach(function(p) {
  var hit = new Set();
  var all = (p.categories || []).concat(p.tags || []);
  all.forEach(function(t) { if (catCounts.hasOwnProperty(t)) hit.add(t); });
  var title = (p.title || '').toLowerCase();
  if (title.indexOf('ai') !== -1 || title.indexOf('智能') !== -1) hit.add('AI');
  if (title.indexOf('风险') !== -1 || title.indexOf('防灾') !== -1) hit.add('风险');
  if (title.indexOf('农业') !== -1 || title.indexOf('养殖') !== -1) hit.add('农业');
  if (title.indexOf('保险') !== -1) hit.add('保险');
  hit.forEach(function(k) { catCounts[k]++; });
});
```
同一篇同时命中 categories 与标题关键词时只计一次。

## 验证

1. **构建**：`npm run build`（CI Linux，无 Windows 盘符问题），确认 `build complete` 且 exit 0。重点 grep `dist/assets` 无报错。
2. **缺失类**：`npm run build` 后 grep `dist` 中 `.result-count`/`.filter-status`/`.clear-filter`/`.tags-toggle`/`.sr-only` 均出现在产物 CSS。
3. **无重复进度条**：grep `ReadingEnhance.vue` 无 `.reading-bar`；grep `Layout.vue` 保留 `.reading-progress`。
4. **无 emoji**：grep `Layout.vue` 无 🌙/☀️。
5. **分类计数**：静态检查 index.md 脚本逻辑（Set 去重），构建后首页 `cat-*-count` 不超文章总数。
6. **视觉验证**：`npm run dev`（vite proxy /api→3001 无关首页静态），浏览器预览首页/归档/文章页，确认 Hero 渐变标题、卡片 hover、featured 媒体、底部控件不重叠、无双重进度条。可用 `browser_use` 或 `webapp-testing`（Playwright）截图核对。
7. **reduced-motion**：确认 `prefers-reduced-motion` 全局规则仍生效（A6 未破坏）。

## 不在本次范围（避免过度工程）

- 首页分类卡片语义（业务领域 vs 内容轴）**保持现状**，不改成内容轴
- 不引入新依赖、不改 config.js 的 SEO/RSS/search-index（已达标）
- 不重构归档页筛选逻辑（结构已合理），只补缺失样式
- 不动 `createContentLoader` / posts-list 单一数据源（已正确）
