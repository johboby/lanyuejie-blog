---
title: 标签
---

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePosts } from '../.vitepress/theme/composables/usePosts.js'

const glob = import.meta.glob('../posts/*.md', { eager: true })
const { posts } = usePosts(glob)
const activeTag = ref('')

const tags = computed(() => {
  const tagMap = {}
  posts.value.forEach(p => {
    const postTags = p.tags.length ? p.tags : ['未标签']
    postTags.forEach(tag => {
      if (!tagMap[tag]) tagMap[tag] = []
      tagMap[tag].push(p)
    })
  })
  return tagMap
})

const sortedTags = computed(() => {
  return Object.entries(tags.value).sort((a, b) => b[1].length - a[1].length)
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return []
  return tags.value[activeTag.value] || []
})

function selectTag(tag) {
  activeTag.value = activeTag.value === tag ? '' : tag
  if (activeTag.value) {
    window.location.hash = encodeURIComponent(tag)
  } else {
    history.replaceState(null, '', window.location.pathname)
  }
}

onMounted(() => {
  const hash = decodeURIComponent(window.location.hash.slice(1))
  if (hash && tags.value[hash]) {
    activeTag.value = hash
  }
})
</script>

<div class="tags-page">
  <h1 class="page-title">标签</h1>
  <p class="page-desc">通过标签快速浏览相关文章</p>

  <div v-if="sortedTags.length" class="tag-cloud">
    <button
      v-for="[tag, tagPosts] in sortedTags"
      :key="tag"
      :class="['tag-btn', { active: activeTag === tag }]"
      @click="selectTag(tag)"
    >
      {{ tag }}
      <span class="tag-count">{{ tagPosts.length }}</span>
    </button>
  </div>

  <div v-if="filteredPosts.length" class="tag-posts">
    <h2 class="section-title">{{ activeTag }} · {{ filteredPosts.length }} 篇</h2>
    <div class="post-list">
      <a v-for="post in filteredPosts" :key="post.link" :href="post.link" class="post-item">
        <div class="post-item-main">
          <div class="post-item-title">{{ post.title }}</div>
          <div class="post-item-meta">
            <span v-if="post.date" class="meta-date">{{ post.date }}</span>
            <span v-for="cat in post.categories" :key="cat" class="meta-cat">{{ cat }}</span>
          </div>
        </div>
        <div class="post-item-arrow">→</div>
      </a>
    </div>
  </div>

  <div v-else-if="!activeTag && posts.length" class="all-posts">
    <h2 class="section-title">全部文章 · {{ posts.length }} 篇</h2>
    <div class="post-list">
      <a v-for="post in posts" :key="post.link" :href="post.link" class="post-item">
        <div class="post-item-main">
          <div class="post-item-title">{{ post.title }}</div>
          <div class="post-item-meta">
            <span v-if="post.date" class="meta-date">{{ post.date }}</span>
            <span v-for="cat in post.categories" :key="cat" class="meta-cat">{{ cat }}</span>
            <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="meta-tag">{{ tag }}</span>
          </div>
        </div>
        <div class="post-item-arrow">→</div>
      </a>
    </div>
  </div>

  <div v-if="!sortedTags.length && !posts.length" class="empty-state">
    <p>暂无文章</p>
  </div>
</div>

<style scoped>
.tags-page { max-width: 720px; margin: 0 auto; }
.page-title { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
.page-desc { color: var(--vp-c-text-2); font-size: 15px; margin-bottom: 2rem; }

.tag-cloud { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 2.5rem; }

.tag-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 16px; border-radius: 20px;
  border: 1px solid var(--vp-c-divider); background: transparent;
  color: var(--vp-c-text-2); font-size: 14px; cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.tag-btn.active {
  background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff;
}

.tag-count {
  font-size: 11px; padding: 1px 7px; border-radius: 10px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-3);
}

.tag-btn.active .tag-count { background: rgba(255,255,255,0.2); color: #fff; }

.section-title {
  font-size: 1rem; font-weight: 600; color: var(--vp-c-text-2);
  margin-bottom: 1rem; padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-list { display: flex; flex-direction: column; gap: 2px; }

.post-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px; border-radius: 10px; text-decoration: none; color: inherit;
  transition: background 0.15s;
}

.post-item:hover { background: var(--vp-c-default-soft); }
.post-item-main { flex: 1; min-width: 0; }

.post-item-title {
  font-size: 15px; font-weight: 600; margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.post-item-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.meta-date { font-size: 13px; color: var(--vp-c-text-3); }

.meta-cat {
  font-size: 12px; padding: 1px 8px; border-radius: 10px;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
}

.meta-tag {
  font-size: 11px; padding: 1px 7px; border-radius: 8px;
  background: var(--vp-c-gold-soft); color: var(--vp-c-gold);
}

.post-item-arrow {
  font-size: 16px; color: var(--vp-c-text-3); margin-left: 16px;
  transition: transform 0.15s, color 0.15s;
}

.post-item:hover .post-item-arrow { transform: translateX(4px); color: var(--vp-c-brand-1); }

.empty-state { text-align: center; padding: 4rem 0; color: var(--vp-c-text-3); }
</style>
