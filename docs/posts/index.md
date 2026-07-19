---
title: 文章列表
---

<script setup>
import { data as posts } from '../.vitepress/posts.data.js'
import { withBase } from 'vitepress'
</script>

<div v-if="posts && posts.length">
  <div v-for="post in posts" :key="post.url" style="margin-bottom: 1.8rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--vp-c-divider);">
    <a :href="withBase(post.url)" style="font-size: 1.15rem; font-weight: 600; color: var(--vp-c-brand-1); text-decoration: none;">{{ post.title }}</a>
    <div style="font-size: 0.82rem; color: var(--vp-c-text-3); margin-top: 0.3rem; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <span v-if="post.date">{{ post.date }}</span>
      <span v-if="post.readTime" style="display: inline-flex; align-items: center; gap: 3px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {{ post.readTime }}
      </span>
      <span v-if="post.wordCount" style="color: var(--vp-c-text-3);">{{ post.wordCount.toLocaleString() }} 字</span>
      <span v-if="post.hasLongContent" style="font-size: 0.7rem; padding: 1px 6px; border-radius: 4px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);">长文</span>
    </div>
    <div v-if="post.excerpt" style="font-size: 0.9rem; color: var(--vp-c-text-2); margin-top: 0.4rem; line-height: 1.6;">{{ post.excerpt }}</div>
    <div v-if="post.tags && post.tags.length" style="margin-top: 0.4rem;">
      <span v-for="tag in post.tags" :key="tag" style="font-size: 0.72rem; padding: 2px 8px; margin-right: 4px; border-radius: 8px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);">{{ tag }}</span>
    </div>
  </div>
</div>
<div v-else>
  <p>暂无文章</p>
</div>
