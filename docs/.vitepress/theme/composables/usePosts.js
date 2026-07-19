import { ref } from 'vue'
import { withBase } from 'vitepress'

const cache = ref(null)

export function usePosts(globResult) {
  if (cache.value) return { posts: cache }

  const items = Object.entries(globResult)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || {}
      const segments = path.split('/')
      const fileName = segments[segments.length - 1]
      const slug = fileName.replace(/\.md$/, '')
      return {
        title: fm.title || slug,
        date: fm.date ? new Date(fm.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        rawDate: fm.date || '',
        tags: fm.tags || [],
        categories: fm.categories || [],
        excerpt: fm.description || '',
        link: withBase('/posts/' + slug),
      }
    })
    .sort((a, b) => (a.rawDate > b.rawDate ? -1 : 1))

  cache.value = items
  return { posts: cache }
}
