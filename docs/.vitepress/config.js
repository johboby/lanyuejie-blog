import { defineConfig } from 'vitepress'
import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'

const SITE_URL = 'https://johboby.github.io/lanyuejie-blog'
const SITE_NAME = '揽月界科技'
const SITE_NAME_EN = 'Lanyuejie Technology'
const SITE_DESCRIPTION = '专注于人工智能与风险控制的前沿科技企业'
const SITE_DESCRIPTION_EN = 'A frontier technology enterprise focused on artificial intelligence and risk control'
const CHARS_PER_MINUTE = 500
const MAX_TITLE_LENGTH = 60
const MAX_DESCRIPTION_LENGTH = 160
const DESCRIPTION_CTA = ' | 深度阅读'
const SYNDICATION_PLATFORMS = [
  { name: 'twitter', url: 'https://twitter.com/intent/tweet' },
  { name: 'linkedin', url: 'https://www.linkedin.com/sharing/share-offsite' },
  { name: 'facebook', url: 'https://www.facebook.com/sharer/sharer.php' },
]

const SEO_EN = {
  'ai-agent-industry-report-2025-2026': {
    title: 'In-Depth Research Report on China AI Agent Industry 2025-2026',
    description: 'Comprehensive analysis of China AI Agent industry: from LLM emergence to engineering convergence, covering paradigm shifts, technology stack reconstruction, and enterprise application pathways.',
    keywords: 'AI Agent, intelligent agent, industry report, LLM, multi-agent, China AI',
  },
  'ai-humanities-integration': {
    title: 'Deep Integration of AI and Humanities',
    description: 'How generative AI and LLMs drive deep reconstruction of humanities and digital humanities, from technology empowerment to bidirectional shaping.',
    keywords: 'AI, humanities, ethics, methodology, digital humanities, LLM',
  },
  'chenyuan-research-collection': {
    title: 'Chenyuan Culture Research Report Collection',
    description: 'A collection of Chenyuan Culture research reports covering new popular literature, market trend analysis, and cross-media narrative studies.',
    keywords: 'research reports, collection, new popular literature, market analysis',
  },
  'economic-policy-ai-econometrics': {
    title: 'Economic Policy Uncertainty and AI Econometric Methods',
    description: 'Research on economic policy uncertainty, monetary policy, artificial intelligence, and econometric methods application and market impact analysis.',
    keywords: 'economic policy, monetary policy, AI, econometrics, EPU, market impact',
  },
  'energy-climate-industry-report': {
    title: 'Energy and Climate Frontier Industry Report',
    description: 'Industry report on energy and climate frontiers by application scenario, covering new energy, carbon markets, and climate adaptation strategies.',
    keywords: 'energy, climate, industry report, new energy, carbon market, LDES',
  },
  'energy-manufacturing-trends-2026h1': {
    title: 'China Energy and Manufacturing Trends Research 2026 H1',
    description: 'Macro and manufacturing prosperity-output-profit analysis, power demand and supply structure, load, capacity and system constraints research.',
    keywords: 'energy, manufacturing, trends, power grid, energy storage, China',
  },
  'global-industry-outlook-2026': {
    title: '2026 Global Industry Deep Outlook and Strategic Insight Report',
    description: 'Landscape restructuring and opportunity capture on the eve of new quality productivity explosion, covering macroeconomics, AI, new energy and full-industry strategic insights.',
    keywords: 'industry outlook, new quality productivity, strategic insight, macroeconomics, AI',
  },
  'global-tech-breakthrough-2025-2026': {
    title: 'Global Major Technology Breakthroughs Research Report 2025-2026',
    description: 'From quantum error correction to digital civilization evolution: in-depth research on the macro landscape and core drivers of global technology paradigm shifts.',
    keywords: 'quantum computing, technology breakthrough, digital civilization, paradigm shift',
  },
  'global-value-chain-resilience': {
    title: 'Global Value Chain Resilience and Security Research',
    description: 'Research on global value chain resilience and security, focusing on supply chain security and geopolitical impact analysis.',
    keywords: 'global value chain, supply chain security, geopolitics, GVC resilience',
  },
  'llm-knowledge-automation': {
    title: 'LLM-Driven Knowledge Automation',
    description: 'Research on technology architecture evolution and industrial implementation pathways of knowledge automation driven by large language models.',
    keywords: 'LLM, knowledge automation, technology architecture, RAG, enterprise AI',
  },
  'market-trends-dec-2025': {
    title: 'Market Trends Aggregation and Analysis - December 2025',
    description: 'December 2025 market trends analysis focusing on emerging technologies and WEF top 10 emerging technologies deep interpretation.',
    keywords: 'market analysis, emerging technology, WEF, semiconductor, green technology',
  },
  'market-trends-mar-2026': {
    title: 'Market Trends Aggregation and Analysis - March 2026',
    description: 'March 2026 market trends analysis focusing on emerging industries, technology trends, and market opportunities including semiconductor innovation.',
    keywords: 'market analysis, emerging industry, semiconductor, Moore Law, technology trends',
  },
}

function getEnMeta(relativePath) {
  if (!relativePath.startsWith('posts/')) return null
  const slug = relativePath.replace('posts/', '').replace('.md', '')
  return SEO_EN[slug] || null
}

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
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/{{[^}]+}}/g, '')
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

function enforceTitle(title) {
  if (!title) return SITE_NAME
  const clean = String(title).replace(/\s+/g, ' ').trim()
  if (clean.length <= MAX_TITLE_LENGTH) return clean
  return clean.slice(0, MAX_TITLE_LENGTH - 1) + '…'
}

function enforceDescription(desc, fallback = '') {
  let text = desc || fallback
  if (!text) return SITE_DESCRIPTION
  text = String(text).replace(/\s+/g, ' ').trim()
  const cta = DESCRIPTION_CTA
  if (text.length + cta.length <= MAX_DESCRIPTION_LENGTH) {
    return text + cta
  }
  const cut = MAX_DESCRIPTION_LENGTH - cta.length
  return text.slice(0, cut - 1).trim() + '…' + cta
}

function extractFAQs(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const faqRegex = /^::: faq\s*\n([\s\S]*?)\n::: *$/gm
  const faqs = []
  let match
  while ((match = faqRegex.exec(body)) !== null) {
    const block = match[1]
    const qRegex = /^\s*###\s+(.+)$/gm
    let qMatch
    const questions = []
    while ((qMatch = qRegex.exec(block)) !== null) {
      const qText = qMatch[1].trim().replace(/\*\*|__|\*|_|~~|`{1,3}[^`]*`{1,3}/g, '')
      const qStart = qMatch.index + qMatch[0].length
      const nextQ = block.indexOf('\n### ', qStart)
      const aText = (nextQ === -1 ? block.slice(qStart) : block.slice(qStart, nextQ))
        .trim()
        .replace(/^:\s*/, '')
      questions.push({ question: qText, answer: aText })
    }
    faqs.push(...questions)
  }
  return faqs.slice(0, 10)
}

function generateFAQSchema(faqs) {
  if (!faqs.length) return null
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer.replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim(),
      },
    })),
  })
}

function extractInternalLinks(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const links = []
  let match
  while ((match = linkRegex.exec(body)) !== null) {
    const href = match[2]
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || href.includes('posts/')) {
      links.push({ text: match[1], href })
    }
  }
  return links
}

function extractExternalLinks(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
  const links = []
  let match
  while ((match = linkRegex.exec(body)) !== null) {
    links.push({ text: match[1], href: match[2] })
  }
  return links
}

function extractFirstKeyword(src, fm) {
  if (fm.keywords && fm.keywords.length) return fm.keywords[0]
  const body = src.replace(/^---[\s\S]*?---/, '')
  const tags = fm.tags || []
  if (tags.length) return tags[0]
  return ''
}

function keywordInFirst100Words(src, keyword) {
  if (!keyword) return false
  const body = src.replace(/^---[\s\S]*?---/, '')
  const text = body.replace(/<[^>]+>/g, '').replace(/#{1,6}\s+/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  const words = text.trim().split(/\s+/).slice(0, 100).join(' ')
  return words.toLowerCase().includes(keyword.toLowerCase())
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
    esbuild: {
      target: 'esnext',
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/lanyuejie-blog/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_NAME} RSS`, href: `${SITE_URL}/feed.xml` }],
    ['link', { rel: 'dns-prefetch', href: 'https://johboby.github.io' }],
    ['link', { rel: 'preconnect', href: 'https://johboby.github.io', crossorigin: '' }],

    ['meta', { name: 'keywords', content: '揽月界科技,Lanyuejie Technology,AI风控,智能保险,畜牧业监测,双精两减,防灾减损,人工智能,风险控制,AI risk control,intelligent insurance,disaster prevention' }],
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
    const rawTitle = fm.title || SITE_NAME
    const title = enforceTitle(rawTitle)
    const rawDesc = autoDescription(src, fm.description || SITE_DESCRIPTION)
    const description = enforceDescription(rawDesc, SITE_DESCRIPTION)
    const wordCount = countWords(src)
    const headings = extractHeadings(src)
    const faqs = extractFAQs(src)
    const internalLinks = extractInternalLinks(src)
    const externalLinks = extractExternalLinks(src)
    const mainKeyword = extractFirstKeyword(src, fm)
    const keywordInFirst100 = keywordInFirst100Words(src, mainKeyword)
    const readMinutes = Math.max(1, Math.ceil(wordCount / CHARS_PER_MINUTE))

    head.push(['link', { rel: 'canonical', href: url }])

    head.push(['meta', { name: 'description', content: description }])
    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }])
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])

    if (fm.date) {
      head.push(['meta', { name: 'author', content: SITE_NAME }])
      head.push(['meta', { name: 'article:reading_time', content: `${readMinutes} minutes` }])
    }

    const enMeta = getEnMeta(pageData.relativePath)
    if (enMeta) {
      head.push(['meta', { property: 'og:locale:alternate', content: 'en_US' }])
      head.push(['meta', { property: 'og:title', content: enforceTitle(enMeta.title), 'xml:lang': 'en' }])
      head.push(['meta', { name: 'description_en', content: enforceDescription(enMeta.description, enMeta.description) }])
      head.push(['meta', { name: 'keywords', content: enMeta.keywords }])
    }

    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:title', content: enMeta ? enforceTitle(enMeta.title) : title }])
    head.push(['meta', { name: 'twitter:description', content: enMeta ? enforceDescription(enMeta.description, enMeta.description) : description }])

    for (const platform of SYNDICATION_PLATFORMS) {
      head.push(['link', { rel: 'syndication', href: `${platform.url}?url=${encodeURIComponent(url)}`, title: platform.name }])
    }

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
          alternateName: SITE_NAME_EN,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
        },
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        wordCount,
        timeRequired: `PT${readMinutes}M`,
        inLanguage: 'zh-CN',
      }

      if (enMeta) {
        jsonLd.alternateHeadline = enforceTitle(enMeta.title)
        jsonLd.inLanguage = ['zh-CN', 'en']
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

      if (mainKeyword) {
        jsonLd.keywords = mainKeyword
      }

      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

      const faqSchema = generateFAQSchema(faqs)
      if (faqSchema) {
        head.push(['script', { type: 'application/ld+json' }, faqSchema])
      }

      if (isLongRead) {
        head.push(['meta', { name: 'speakable', content: JSON.stringify({ cssSelector: ['.vp-doc h2', '.vp-doc h3'] }) }])
      }

      const breadcrumb = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: '文章', item: `${SITE_URL}/posts/` },
          { '@type': 'ListItem', position: 3, name: enMeta ? `${title} / ${enforceTitle(enMeta.title)}` : title, item: url },
        ],
      })
      head.push(['script', { type: 'application/ld+json' }, breadcrumb])
    } else if (pageData.relativePath === 'index.md') {
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        alternateName: SITE_NAME_EN,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'samhoclub@163.com',
          contactType: 'customer service',
          availableLanguage: ['Chinese', 'English'],
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
      const desc = enforceDescription(autoDescription(src, post.frontmatter.description || ''), SITE_DESCRIPTION)
      const slug = post.url.replace('/posts/', '').replace(/\/$/, '').replace('.html', '')
      const enMeta = SEO_EN[slug]
      const enDescLine = enMeta ? `\n      <content:encoded>${escapeXml(`<p><strong>EN:</strong> ${enMeta.title}</p><p>${enMeta.description}</p>`)}</content:encoded>` : ''
      return `    <item>
       <title>${escapeXml(enforceTitle(post.frontmatter.title))}${enMeta ? ` / ${escapeXml(enforceTitle(enMeta.title))}` : ''}</title>
       <link>${link}</link>
       <description>${escapeXml(desc)}</description>${enDescLine}
       <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
       <guid isPermaLink="true">${link}</guid>
${(post.frontmatter.tags || []).map(t => `      <category>${escapeXml(t)}</category>`).join('\n')}${enMeta ? `\n      <category>${escapeXml(enMeta.keywords)}</category>` : ''}
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
      `# ${SITE_NAME} / ${SITE_NAME_EN}`,
      '',
      `> ${SITE_DESCRIPTION}`,
      `> ${SITE_DESCRIPTION_EN}`,
      '',
      `Website: ${SITE_URL}`,
      'Contact: samhoclub@163.com | WeChat cy321one | WeChat Official Account 尘渊文化',
      '',
      '---',
      '',
      ...posts.map(post => {
        const src = post.src || ''
        const desc = enforceDescription(autoDescription(src, post.frontmatter.description || ''), SITE_DESCRIPTION)
        const wc = countWords(src)
        const rt = Math.max(1, Math.ceil(wc / CHARS_PER_MINUTE))
        const tags = (post.frontmatter.tags || []).join('、')
        const dateStr = post.frontmatter.date ? new Date(post.frontmatter.date).toISOString().slice(0, 10) : '未知'
        const slug = post.url.replace('/posts/', '').replace(/\/$/, '').replace('.html', '')
        const enMeta = SEO_EN[slug]
        return [
          `## ${enforceTitle(post.frontmatter.title)}${enMeta ? ` / ${enforceTitle(enMeta.title)}` : ''}`,
          '',
          `- URL: ${SITE_URL}${post.url}`,
          `- Date: ${dateStr}`,
          `- Words: ${wc.toLocaleString()} | Read time: ${rt} min`,
          tags ? `- Tags: ${tags}` : null,
          `- Categories: ${(post.frontmatter.categories || []).join('、')}`,
          enMeta ? `- EN Keywords: ${enMeta.keywords}` : null,
          '',
          desc,
          enMeta ? `EN: ${enMeta.description}` : null,
          '',
        ].filter(Boolean).join('\n')
      }),
    ].join('\n')

    writeFileSync(resolve(outDir, 'llms-full.txt'), llmsFull, { encoding: 'utf-8' })
  },
})
