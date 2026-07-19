import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(page => !page.srcPath.endsWith('index.md'))
      .sort((a, b) => {
        const da = a.frontmatter.date || ''
        const db = b.frontmatter.date || ''
        return da > db ? -1 : 1
      })
      .map(page => ({
        title: page.frontmatter.title || page.srcPath,
        date: page.frontmatter.date ? new Date(page.frontmatter.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        rawDate: page.frontmatter.date || '',
        tags: page.frontmatter.tags || [],
        categories: page.frontmatter.categories || [],
        excerpt: page.frontmatter.description || '',
        url: page.url,
      }))
  },
})
