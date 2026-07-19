import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(page => !page.url.endsWith('/posts/'))
      .sort((a, b) => (a.frontmatter.date > b.frontmatter.date ? -1 : 1))
      .map(page => ({
        title: page.frontmatter.title || '',
        date: page.frontmatter.date ? new Date(page.frontmatter.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        rawDate: page.frontmatter.date || '',
        tags: page.frontmatter.tags || [],
        categories: page.frontmatter.categories || [],
        excerpt: page.frontmatter.description || page.excerpt || '',
        url: page.url,
      }))
  },
})
