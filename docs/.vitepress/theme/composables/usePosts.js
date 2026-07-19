import { ref } from 'vue'
import { withBase } from 'vitepress'

const posts = ref(null)

const modules = import.meta.glob('../../posts/*.md', { eager: true })

function loadPosts() {
  if (posts.value) return posts.value

  const items = Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || {}
      const slug = path.replace(/^..\/..\/posts\//, '').replace(/\.md$/, '')
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

  posts.value = items
  return items
}

export function usePosts() {
  return { posts: ref(loadPosts()) }
}
