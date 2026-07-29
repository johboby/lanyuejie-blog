<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as allPosts } from '../../posts.data.js'

const { page } = useData()

const frontmatter = computed(() => page.value?.frontmatter || {})
const readingTime = computed(() => frontmatter.value.readTime || '')

const isPost = computed(() => page.value?.relativePath?.startsWith('posts/') && !page.value?.relativePath?.endsWith('index.md'))

const faqs = computed(() => {
  const fm = frontmatter.value
  if (fm.faq && Array.isArray(fm.faq)) return fm.faq
  return []
})

const externalLinks = computed(() => {
  const fm = frontmatter.value
  if (fm.externalLinks && Array.isArray(fm.externalLinks)) return fm.externalLinks
  return []
})

// 自动相关文章：基于分类/标签重合度排序，排除当前文章，最多 4 篇
const currentUrl = computed(() => page.value?.relativePath || '')
const relatedPosts = computed(() => {
  const fm = frontmatter.value
  const cats = fm.categories || []
  const tags = fm.tags || []
  if (!cats.length && !tags.length) return []
  const scored = (allPosts || [])
    .filter(p => p.url && p.url !== page.value?.relativePath && !p.url.endsWith('/posts/'))
    .map(p => {
      const cOverlap = (p.categories || []).filter(c => cats.includes(c)).length
      const tOverlap = (p.tags || []).filter(t => tags.includes(t)).length
      const score = cOverlap * 2 + tOverlap
      return { post: p, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.dateISO || 0) - new Date(a.post.dateISO || 0))
    .slice(0, 4)
    .map(x => x.post)
  return scored
})

const showReadingTime = computed(() => isPost.value && readingTime.value)
const showRelated = computed(() => isPost.value && relatedPosts.value.length > 0)
const showFAQ = computed(() => isPost.value && faqs.value.length >= 3)
const showExternalLinks = computed(() => isPost.value && externalLinks.value.length >= 2)
const showCTA = computed(() => isPost.value)
</script>

<template>
  <div class="post-features">
    <div v-if="showReadingTime" class="post-reading-time">
      <span class="reading-time-icon" aria-hidden="true">&#8635;</span>
      <span class="reading-time-text">约{{ readingTime }}阅读</span>
    </div>

    <div v-if="showRelated" class="post-links-section">
      <h3 class="links-title">相关阅读</h3>
      <ul class="internal-links">
        <li v-for="post in relatedPosts" :key="post.url" class="internal-link-item">
          <a :href="withBase(post.url)" class="internal-link">{{ post.title }}</a>
          <span v-if="post.excerpt" class="link-desc">{{ post.excerpt }}</span>
        </li>
      </ul>
    </div>

    <div v-if="showExternalLinks" class="post-links-section">
      <h3 class="links-title">参考资料</h3>
      <ul class="external-links">
        <li v-for="(link, i) in externalLinks" :key="i" class="external-link-item">
          <a :href="link.url" target="_blank" rel="noopener noreferrer" class="external-link">{{ link.title }}</a>
          <span v-if="link.desc" class="link-desc">{{ link.desc }}</span>
        </li>
      </ul>
    </div>

    <div v-if="showFAQ" class="post-faq">
      <h3 class="faq-title">常见问题</h3>
      <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
        <h4 class="faq-question">{{ faq.question }}</h4>
        <div class="faq-answer">{{ faq.answer }}</div>
      </div>
    </div>

    <div v-if="showCTA" class="post-cta">
      <div class="cta-content">
        <p class="cta-text">觉得这篇文章对您有帮助？</p>
        <div class="cta-actions">
          <a :href="withBase('/posts/')" class="cta-btn cta-collect">收藏文章</a>
          <a href="mailto:samhoclub@163.com" class="cta-btn cta-comment">评论反馈</a>
          <a :href="withBase('/feed.xml')" class="cta-btn cta-subscribe">订阅 RSS</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-features {
  margin-top: var(--vp-custom-spacing, 3rem);
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.post-reading-time {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-soft);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.post-links-section {
  margin: 2rem 0;
}

.links-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}

.internal-links,
.external-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.internal-link-item,
.external-link-item {
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, background 0.2s;
}

.internal-link-item:hover,
.external-link-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.internal-link,
.external-link {
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.internal-link:hover,
.external-link:hover {
  text-decoration: underline;
}

.link-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  display: block;
}

.post-faq {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.faq-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.faq-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-1);
}

.faq-answer {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.post-cta {
  margin: 2rem 0 0;
  padding: 2rem;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, transparent 100%);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.cta-text {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  color: var(--vp-c-text-1);
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
  min-width: 120px;
}

.cta-collect {
  background: var(--vp-c-brand-1);
  color: #fff;
  border: 1px solid var(--vp-c-brand-1);
}

.cta-collect:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.cta-comment {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
}

.cta-comment:hover {
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.cta-subscribe {
  background: var(--vp-c-accent, #c9a84c);
  color: #fff;
  border: 1px solid var(--vp-c-accent, #c9a84c);
}

.cta-subscribe:hover {
  background: var(--vp-c-accent-hover, #b89a3a);
  border-color: var(--vp-c-accent-hover, #b89a3a);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .post-features {
    margin-top: 2rem;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .post-cta {
    padding: 1.5rem;
  }
}
</style>
