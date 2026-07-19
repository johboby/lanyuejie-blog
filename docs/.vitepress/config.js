import { defineConfig } from 'vitepress'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = 'https://johboby.github.io/lanyuejie-blog'
const SITE_NAME = '揽月界科技'
const SITE_DESCRIPTION = '专注于人工智能与风险控制的前沿科技企业'

function getPageUrl(relativePath) {
  if (relativePath === 'index.md') return `${SITE_URL}/`
  if (relativePath === 'posts/index.md') return `${SITE_URL}/posts/`
  return `${SITE_URL}/${relativePath.replace(/\.md$/, '.html')}`
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineConfig({
  lang: 'zh-CN',
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  base: '/lanyuejie-blog/',
  cleanUrls: false,
  lastUpdated: true,
  ignoreDeadLinks: true,

  sitemap: {
    hostname: `${SITE_URL}/`,
    lastmodDateOnly: true,
  },

  vite: {
    build: { target: 'esnext' },
    esbuild: { target: 'esnext' },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_NAME} RSS`, href: `${SITE_URL}/feed.xml` }],
    ['link', { rel: 'dns-prefetch', href: 'https://johboby.github.io' }],
    ['link', { rel: 'preconnect', href: 'https://johboby.github.io', crossorigin: '' }],
    ['meta', { name: 'keywords', content: '揽月界科技,AI风控,智能保险,畜牧业监测,双精两减,防灾减损,人工智能,风险控制' }],
    ['meta', { name: 'author', content: SITE_NAME }],
    ['meta', { name: 'robots', content: 'index, follow, maxsnippet:-1, maximagepreview:large, maxvideopreview:-1' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow, maxsnippet:-1, maximagepreview:large' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about.html' },
    ],

    sidebar: false,

    search: {
      provider: 'local',
    },

    outline: { label: '页面导航', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  transformHead({ pageData }) {
    const url = getPageUrl(pageData.relativePath)
    const head = []
    const title = pageData.frontmatter.title || SITE_NAME
    const description = pageData.frontmatter.description || SITE_DESCRIPTION

    head.push(['link', { rel: 'canonical', href: url }])

    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:type', content: pageData.frontmatter.date ? 'article' : 'website' }])

    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])

    if (pageData.frontmatter.date) {
      const isoDate = new Date(pageData.frontmatter.date).toISOString()
      head.push(['meta', { property: 'article:published_time', content: isoDate }])
      if (pageData.frontmatter.tags) {
        for (const tag of pageData.frontmatter.tags) {
          head.push(['meta', { property: 'article:tag', content: tag }])
        }
      }

      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        datePublished: isoDate,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
        },
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      })
      head.push(['script', { type: 'application/ld+json' }, jsonLd])
    } else if (pageData.relativePath === 'index.md') {
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'samhoclub@163.com',
          contactType: 'customer service',
          availableLanguage: ['Chinese'],
        },
      })
      head.push(['script', { type: 'application/ld+json' }, jsonLd])
    } else if (pageData.relativePath === 'about.md') {
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: title,
        description,
        url,
        mainEntity: {
          '@type': 'Organization',
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: SITE_URL,
        },
      })
      head.push(['script', { type: 'application/ld+json' }, jsonLd])
    }

    return head
  },

  async buildEnd({ outDir }) {
    const { createContentLoader } = await import('vitepress')
    const posts = await createContentLoader('posts/*.md', {
      transform(raw) {
        return raw
          .filter(page => !page.url.endsWith('/posts/'))
          .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
      },
    }).load()

    const items = posts.map(post => {
      const link = `${SITE_URL}${post.url}`
      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(post.frontmatter.description || '')}</description>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${link}</guid>
${(post.frontmatter.tags || []).map(t => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`
    }).join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>VitePress</generator>
${items}
  </channel>
</rss>`

    writeFileSync(resolve(outDir, 'feed.xml'), rss, 'utf-8')
  },
})
