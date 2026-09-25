import { defineConfig } from 'vitepress'
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'fs'
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

// 预计算所有文章元数据：单次扫描读取全部文章内容，后续 transformHead 直接查表
// 消除每页 transformHead 中的 readFileSync 同步 I/O，提升构建效率
const POST_META = (() => {
  const meta = {}
  try {
    const dir = resolve('docs', 'posts')
    const files = readdirSync(dir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const filePath = resolve(dir, file)
      const src = readFileSync(filePath, 'utf-8')
      const slug = file.replace('.md', '')
      const fmMatch = src.match(/^---\s*\n([\s\S]*?)\n---/)
      const fm = {}
      if (fmMatch) {
        fmMatch[1].split('\n').forEach(line => {
          const idx = line.indexOf(':')
          if (idx < 0) return
          const key = line.slice(0, idx).trim()
          let val = line.slice(idx + 1).trim()
          if (val.startsWith('[')) {
            try { val = JSON.parse(val) } catch { val = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, '')) }
          } else if (val.startsWith('"') || val.startsWith("'")) {
            val = val.slice(1, -1)
          }
          fm[key] = val
        })
      }
      meta[slug] = {
        src,
        fm,
        wordCount: countWords(src),
        headings: extractHeadings(src),
        faqs: extractFAQs(src),
        internalLinks: extractInternalLinks(src),
        externalLinks: extractExternalLinks(src),
        description: autoDescription(src, fm.description || ''),
        mainKeyword: extractFirstKeyword(src, fm),
        keywordInFirst100: keywordInFirst100Words(src, extractFirstKeyword(src, fm)),
      }
    }
  } catch {}
  return meta
})()

// 构建时精简文章数据（SSG 阶段内嵌到 HTML，让首屏即含真实文章列表，
// 不依赖客户端 JS hydration；同时供 index/posts 列表页与 transformHead 使用）
const POSTS_DATA = (() => {
  const list = []
  for (const [slug, pm] of Object.entries(POST_META)) {
    const fm = pm.fm
    if (!fm.title || !fm.date) continue // 跳过 index.md / about.md 等
    const wc = pm.wordCount || 0
    list.push({
      url: `/posts/${slug}.html`,
      title: fm.title,
      date: new Date(fm.date).toISOString(),
      description: pm.description || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      categories: Array.isArray(fm.categories) ? fm.categories : [],
      excerpt: pm.description || '',
      wordCount: wc,
      readTime: `${Math.max(1, Math.ceil(wc / CHARS_PER_MINUTE))} 分钟`,
      hasLongContent: wc > 3000,
    })
  }
  list.sort((a, b) => new Date(b.date) - new Date(a.date))
  return list
})()

function loadSEOMap() {
  const map = {}
  for (const [slug, pm] of Object.entries(POST_META)) {
    const fm = pm.fm
    if (fm.enTitle || fm.enDescription || fm.enKeywords) {
      map[slug] = {
        title: fm.enTitle || '',
        description: fm.enDescription || '',
        keywords: fm.enKeywords || '',
      }
    }
  }
  return map
}

const SEO_EN = loadSEOMap()

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
    plugins: [
      {
        // 构建时把同步文章列表数据生成到 docs/posts-list.generated.js，
        // 供 index.md / posts/index.md 在 SSR/SSG 阶段直接 import（构建时预计算），
        // 解决 createContentLoader 数据只在客户端、SSR 阶段为空导致的"文章全都不见了"。
        name: 'generate-posts-list',
        buildStart() {
          const list = POSTS_DATA.map(p => ({
            url: p.url, title: p.title, date: p.date,
            tags: p.tags, categories: p.categories,
            wordCount: p.wordCount, readTime: p.readTime,
            hasLongContent: p.hasLongContent,
          }))
          const outPath = resolve('docs', 'posts-list.generated.js')
          writeFileSync(
            outPath,
            `// 构建时自动生成的同步文章列表数据（勿手改，由 config.js buildStart 重写）\n` +
              `export const POSTS = ${JSON.stringify(list, null, 2)};\n`,
            { encoding: 'utf-8' }
          )
        },
      },
      {
        name: 'md-assets-handler',
        resolveId(source) {
          if (source.startsWith('/md_assets/')) {
            return resolve('docs/public', source)
          }
        }
      }
    ]
  },

  // Inject loading="lazy" on all in-body images to avoid first-view LCP degradation
  // caused by many concurrent requests in long posts (e.g. reports with 100+ images).
  // Cross-directory public images now use /md_assets/ absolute paths; only lazy attrs are added here.
  markdown: {
    config(md) {
      const defaultImage = md.renderer.rules.image
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const aIndex = token.attrIndex('loading')
        if (aIndex < 0) {
          token.attrPush(['loading', 'lazy'])
        }
        return defaultImage(tokens, idx, options, env, self)
      }
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

    // 移动端浏览器地址栏品牌色 + 可添加到主屏（体验与品牌一致性）
    ['meta', { name: 'theme-color', content: '#1f4f42' }],
    ['meta', { name: 'theme-color', content: '#5ab89e', media: '(prefers-color-scheme: dark)' }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
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
      options: {
        // 截断每篇文档进入本地搜索索引的正文（默认全量入库导致索引 4.3MB，严重拖慢首屏）。
        // 1800 字符足以覆盖标题/导语/关键词命中，索引体积降至约 270KB（≈1/16）。
        _render(src, env, md) {
          if (env.frontmatter && env.frontmatter.search === false) return ''
          const truncated = src.length > 1800 ? src.slice(0, 1800) : src
          return md.render(truncated, env)
        },
      },
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
    const slug = pageData.relativePath.replace('posts/', '').replace('.md', '')
    const pm = POST_META[slug] || {}
    const src = pm.src || ''
    const rawTitle = fm.title || SITE_NAME
    const title = enforceTitle(rawTitle)
    const enMeta = getEnMeta(pageData.relativePath)
    // 每页设置正确的 <title>：文章页优先英文标题，非文章页用 frontmatter title
    head.push(['title', enMeta?.title || title])
    const rawDesc = pm.description || fm.description || SITE_DESCRIPTION
    const description = enforceDescription(rawDesc, SITE_DESCRIPTION)
    const wordCount = pm.wordCount || 0
    const headings = pm.headings || []
    const faqs = pm.faqs || []
    const internalLinks = pm.internalLinks || []
    const externalLinks = pm.externalLinks || []
    const mainKeyword = pm.mainKeyword || ''
    const keywordInFirst100 = pm.keywordInFirst100 || false
    const readMinutes = Math.max(1, Math.ceil(wordCount / CHARS_PER_MINUTE))

    head.push(['link', { rel: 'canonical', href: url }])

    // 把文章数据内嵌到每页 HTML，让 SSG 首屏即渲染出真实文章列表
    // （createContentLoader 的数据只在客户端 JS chunk 里，SSR 阶段为空，
    //   不内嵌会导致首页/文章列表页首屏 0 篇、空网格、"文章全都不见了"）
    // 只保留列表展示所需字段，控制内嵌体积
    const postsInline = POSTS_DATA.map(p => ({
      url: p.url, title: p.title, date: p.date,
      tags: p.tags, categories: p.categories,
      excerpt: p.excerpt.slice(0, 120),
      readTime: p.readTime, hasLongContent: p.hasLongContent,
    }))
    head.push(['script', {}, `window.__VP_POSTS__=${JSON.stringify(postsInline)};`])

    head.push(['meta', { name: 'description', content: description }])
    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }])
    head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])

    // 社交分享图：优先使用文章 frontmatter ogImage，否则默认品牌图
    const ogImage = fm.ogImage ? `${SITE_URL}${fm.ogImage}` : `${SITE_URL}/images/agriculture.jpg`
    head.push(['meta', { property: 'og:image', content: ogImage }])
    head.push(['meta', { property: 'og:image:width', content: '1200' }])
    head.push(['meta', { property: 'og:image:height', content: '630' }])
    head.push(['meta', { name: 'twitter:image', content: ogImage }])

    if (fm.date) {
      head.push(['meta', { name: 'author', content: SITE_NAME }])
      head.push(['meta', { name: 'article:reading_time', content: `${readMinutes} minutes` }])
    }

    if (enMeta) {
      head.push(['meta', { property: 'og:locale:alternate', content: 'en_US' }])
      head.push(['meta', { property: 'og:title', content: enforceTitle(enMeta.title), 'xml:lang': 'en' }])
      head.push(['meta', { name: 'description_en', content: enforceDescription(enMeta.description, SITE_DESCRIPTION) }])
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

      if (fm.categories && fm.categories.length) {
        head.push(['meta', { property: 'article:section', content: fm.categories[0] }])
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
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/favicon.svg`,
            width: 512,
            height: 512,
          },
        },
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: {
          '@type': 'ImageObject',
          url: ogImage,
          width: 1200,
          height: 630,
        },
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
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon.svg`,
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://johboby.github.io/lanyuejie-blog/',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'samhoclub@163.com',
          contactType: 'customer service',
          availableLanguage: ['Chinese', 'English'],
        },
      })
      head.push(['script', { type: 'application/ld+json' }, jsonLd])

      // WebSite + SearchAction：让站内搜索框以 Google 富结果（Sitelinks Search Box）呈现，提升品牌曝光
      const siteJsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/posts/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      })
      head.push(['script', { type: 'application/ld+json' }, siteJsonLd])
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

    // 精简版 llms.txt：从 SSG 数据自动生成完整文章清单，避免手写遗漏（原先静态仅 12 篇）
    const llmsIndex = [
      `# ${SITE_NAME}`,
      '',
      `> ${SITE_DESCRIPTION} | ${SITE_URL}`,
      '',
      '揽月界科技是一家专注于人工智能与风险控制的前沿科技企业，核心业务涵盖智能保险、畜牧业风险监测、农业标准化数据库。',
      '',
      '## 联系方式',
      '',
      '- 邮箱：samhoclub@163.com',
      '- 微信：cy321one',
      '- 公众号：尘渊文化',
      '',
      '## 产品平台',
      '',
      '- 生猪养殖风险监测：https://szxt.cycu.top',
      '- 牦牛监测和智能保险：https://agri.cycu.top',
      '- 农业标准化基础数据库：https://risk.cycu.top',
      '',
      '## 研究报告',
      '',
      ...posts.map(post => {
        const slug = post.url.replace('/posts/', '').replace(/\/$/, '').replace('.html', '')
        const enMeta = SEO_EN[slug]
        const title = enMeta ? `${enforceTitle(post.frontmatter.title)} / ${enforceTitle(enMeta.title)}` : enforceTitle(post.frontmatter.title)
        return `- [${title}](${SITE_URL}${post.url})`
      }),
      '',
      '## 可选：详细内容',
      '',
      `- [llms-full.txt](${SITE_URL}/llms-full.txt) — 包含所有文章摘要的完整版`,
      '',
    ].join('\n')

    writeFileSync(resolve(outDir, 'llms.txt'), llmsIndex, { encoding: 'utf-8' })

    // 生成 data/posts.json：把文章 frontmatter 数据内嵌到构建产物，
    // 供 SSR 阶段 Layout.vue 预加载到 window.__VP_POSTS__，让首屏 HTML 就包含真实文章数据。
    // （createContentLoader 的数据只在客户端 JS chunk 里，SSR 阶段为空，
    //   导致 dist/*.html 文章网格全部空、指标全 0，用户看到"文章全都不见了"）
    const postsJson = posts.map(post => {
      const fm = post.frontmatter || {}
      const src = post.src || ''
      const wc = countWords(src)
      return {
        url: post.url,
        title: fm.title || '',
        date: fm.date ? new Date(fm.date).toISOString() : null,
        description: fm.description || autoDescription(src, ''),
        tags: fm.tags || [],
        categories: fm.categories || [],
        excerpt: autoDescription(src, fm.description || ''),
        wordCount: wc,
        readTime: `${Math.max(1, Math.ceil(wc / CHARS_PER_MINUTE))} 分钟`,
        enTitle: fm.enTitle || '',
        enDescription: fm.enDescription || '',
      }
    })
    const dataDir = resolve(outDir, 'data')
    mkdirSync(dataDir, { recursive: true })
    writeFileSync(resolve(dataDir, 'posts.json'), JSON.stringify(postsJson, null, 0), { encoding: 'utf-8' })
  },
})
