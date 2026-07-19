import { defineConfig } from 'vitepress'
import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = 'https://johboby.github.io/lanyuejie-blog'
const SITE_NAME = '揽月界科技'
const SITE_DESCRIPTION = '专注于人工智能与风险控制的前沿科技企业'
const CHARS_PER_MINUTE = 500

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

function extractText(src) {
  if (!src) return ''
  return src
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*|__|\*|_|~~|`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function autoDescription(src, fallback = '') {
  const text = extractText(src)
  if (!text) return fallback
  const first = text.split('\n').find(l => l.trim().length > 20)
  if (!first) return fallback
  const clean = first.trim().replace(/\s+/g, ' ')
  return clean.length > 160 ? clean.slice(0, 157) + '...' : clean
}

function countWords(src) {
  const text = extractText(src)
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const english = text.replace(/[\u4e00-\u9fff]/g, ' ').split(/\s+/).filter(w => w).length
  return chinese + english
}

function extractHeadings(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const headings = []
  const regex = /^(#{2,4})\s+(.+)$/gm
  let match
  while ((match = regex.exec(body)) !== null) {
    const level = match[1].length
    const text = match[2].trim().replace(/\*\*|__|\*|_|~~|`{1,3}[^`]*`{1,3}/g, '')
    headings.push({ level, text })
  }
  return headings
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
    const fm = pageData.frontmatter
    let src = ''
    try {
      src = readFileSync(resolve('docs', pageData.relativePath), 'utf-8')
    } catch {}
    const title = fm.title || SITE_NAME
    const description = autoDescription(src, fm.description || SITE_DESCRIPTION)
    const wordCount = countWords(src)
    const headings = extractHeadings(src)

    head.push(['link', { rel: 'canonical', href: url }])

    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }])

    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])

    if (fm.date) {
      const isoDate = new Date(fm.date).toISOString()
      head.push(['meta', { property: 'article:published_time', content: isoDate }])
      if (fm.tags) {
        for (const tag of fm.tags) {
          head.push(['meta', { property: 'article:tag', content: tag }])
        }
      }

      const isLongRead = wordCount > 3000
      const articleType = isLongRead ? 'ScholarlyArticle' : 'Article'
      const readMinutes = Math.max(1, Math.ceil(wordCount / CHARS_PER_MINUTE))

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': articleType,
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
        wordCount,
        timeRequired: `PT${readMinutes}M`,
      }

      if (isLongRead && headings.length > 0) {
        jsonLd.hasPart = headings.slice(0, 10).map(h => ({
          '@type': 'WebPageElement',
          name: h.text,
        }))
      }

      if (fm.categories && fm.categories.length) {
        jsonLd.about = fm.categories.map(c => ({
          '@type': 'Thing',
          name: c,
        }))
      }

      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

      if (isLongRead) {
        const speakable = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SpeakableSpecification',
          cssSelector: ['.vp-doc h2', '.vp-doc h3'],
        })
        head.push(['meta', { name: 'speakable', content: JSON.stringify({ cssSelector: ['.vp-doc h2', '.vp-doc h3'] }) }])
      }

      const breadcrumb = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: '文章', item: `${SITE_URL}/posts/` },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      })
      head.push(['script', { type: 'application/ld+json' }, breadcrumb])
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
      includeSrc: true,
      render: false,
      transform(raw) {
        return raw
          .filter(page => !page.url.endsWith('/posts/'))
          .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
      },
    }).load()

    const items = posts.map(post => {
      const link = `${SITE_URL}${post.url}`
      const src = post.src || ''
      const desc = autoDescription(src, post.frontmatter.description || '')
      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(desc)}</description>
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

    const llmsFull = [
      `# ${SITE_NAME}`,
      '',
      `> ${SITE_DESCRIPTION}`,
      '',
      `网站地址：${SITE_URL}`,
      '联系方式：samhoclub@163.com | 微信 cy321one | 公众号 尘渊文化',
      '',
      '---',
      '',
      ...posts.map(post => {
        const src = post.src || ''
        const desc = autoDescription(src, post.frontmatter.description || '')
        const wc = countWords(src)
        const rt = Math.max(1, Math.ceil(wc / CHARS_PER_MINUTE))
        const tags = (post.frontmatter.tags || []).join('、')
        const dateStr = post.frontmatter.date ? new Date(post.frontmatter.date).toISOString().slice(0, 10) : '未知'
        return [
          `## ${post.frontmatter.title}`,
          '',
          `- 地址：${SITE_URL}${post.url}`,
          `- 日期：${dateStr}`,
          `- 字数：${wc.toLocaleString()} | 阅读时间：${rt}分钟`,
          tags ? `- 标签：${tags}` : null,
          `- 分类：${(post.frontmatter.categories || []).join('、')}`,
          '',
          desc,
          '',
        ].filter(Boolean).join('\n')
      }),
    ].join('\n')

    writeFileSync(resolve(outDir, 'llms-full.txt'), llmsFull, { encoding: 'utf-8' })
  },
})
