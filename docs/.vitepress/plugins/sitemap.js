export function sitemap() {
  return {
    name: 'sitemap',
    transformPageData(pageData) {
      const canonicalUrl = `https://johboby.github.io/lanyuejie-blog/${pageData.relativePath}`
        .replace(/index\.md$/, '')
        .replace(/\.md$/, '')
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push(
        ['link', { rel: 'canonical', href: canonicalUrl }],
        ['meta', { property: 'og:title', content: pageData.frontmatter.title || '揽月界科技' }],
        ['meta', { property: 'og:description', content: pageData.frontmatter.description || pageData.frontmatter.tagline || '专注于人工智能与风险控制的前沿科技企业' }],
        ['meta', { property: 'og:url', content: canonicalUrl }],
      )
      if (pageData.frontmatter.date) {
        pageData.frontmatter.head.push(
          ['meta', { property: 'article:published_time', content: pageData.frontmatter.date }],
        )
      }
    },
  }
}
