import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  transform(raw) {
    return raw
      .filter(page => !page.url.endsWith('/posts/'))
      .sort((a, b) => {
        return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      })
      .map(page => ({
        title: page.frontmatter.title,
        url: page.url,
        date: page.frontmatter.date
          ? new Date(page.frontmatter.date).toLocaleDateString('zh-CN')
          : null,
        tags: page.frontmatter.tags || [],
        categories: page.frontmatter.categories || [],
        excerpt: page.frontmatter.description || '',
      }))
  }
})
