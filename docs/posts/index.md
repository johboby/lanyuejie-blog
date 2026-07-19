---
title: 文章列表
---

<script setup>
import { data as posts } from '../.vitepress/posts.data.js'
import { withBase } from 'vitepress'
</script>

<div v-if="posts && posts.length">
  <div v-for="post in posts" :key="post.url" style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--vp-c-divider);">
    <a :href="withBase(post.url)" style="font-size: 1.15rem; font-weight: 600; color: var(--vp-c-brand-1); text-decoration: none;">{{ post.title }}</a>
    <div v-if="post.date" style="font-size: 0.85rem; color: var(--vp-c-text-3); margin-top: 0.3rem;">{{ post.date }}</div>
    <div v-if="post.excerpt" style="font-size: 0.9rem; color: var(--vp-c-text-2); margin-top: 0.4rem;">{{ post.excerpt }}</div>
    <div v-if="post.tags && post.tags.length" style="margin-top: 0.4rem;">
      <span v-for="tag in post.tags" :key="tag" style="font-size: 0.75rem; padding: 2px 8px; margin-right: 4px; border-radius: 8px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);">{{ tag }}</span>
    </div>
  </div>
</div>
<div v-else>
  <p>暂无文章</p>
</div>
