/**
 * generateMetadata API — 集中管理所有页面的 meta 标签 + JSON-LD 结构化数据
 *
 * 使用方式：在 vitepress config.js 的 transformHead 中调用
 *   const head = await generateMetadata({ pageData, SITE_URL, SITE_NAME, ... })
 *
 * 所有元数据逻辑集中在此模块，便于维护、测试和扩展。
 */
import { resolve } from 'path'
import { readdirSync, readFileSync } from 'fs'

// ============ 常量 ============

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

// ============ 工具函数 ============

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
    headings.push({ level: match[1].length, text: match[2].trim().replace(/\*\*|__|\*|_|~~|`{1,3}[^`]*`{1,3}/g, '') })
  }
  return headings
}

function extractFAQs(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const faqs = []
  const faqRegex = /^::: faq\s*\n([\s\S]*?)\n::: *$/gm
  let match
  while ((match = faqRegex.exec(body)) !== null) {
    const block = match[1]
    const qRegex = /^\s*###\s+(.+)$/gm
    let qMatch
    while ((qMatch = qRegex.exec(block)) !== null) {
      const qText = qMatch[1].trim().replace(/\*\*|__|\*|_|~~|`{1,3}[^`]*`{1,3}/g, '')
      const qStart = qMatch.index + qMatch[0].length
      const nextQ = block.indexOf('\n### ', qStart)
      const aText = (nextQ === -1 ? block.slice(qStart) : block.slice(qStart, nextQ))
        .trim().replace(/^:\s*/, '')
      faqs.push({ question: qText, answer: aText })
    }
  }
  return faqs.slice(0, 10)
}

function extractInternalLinks(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const links = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match
  while ((match = linkRegex.exec(body)) !== null) {
    if (match[2].startsWith('/') || match[2].startsWith('./') || match[2].startsWith('../') || match[2].includes('posts/')) {
      links.push({ text: match[1], href: match[2] })
    }
  }
  return links
}

function extractExternalLinks(src) {
  if (!src) return []
  const body = src.replace(/^---[\s\S]*?---/, '')
  const links = []
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
  let match
  while ((match = linkRegex.exec(body)) !== null) {
    links.push({ text: match[1], href: match[2] })
  }
  return links
}

function extractFirstKeyword(src, fm) {
  if (fm.keywords && fm.keywords.length) return fm.keywords[0]
  const tags = fm.tags || []
  if (tags.length) return tags[0]
  return ''
}

function generateFAQs(faqs) {
  if (!faqs.length) return null
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim() },
    })),
  })
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
  if (text.length + cta.length <= MAX_DESCRIPTION_LENGTH) return text + cta
  const cut = MAX_DESCRIPTION_LENGTH - cta.length
  return text.slice(0, cut - 1).trim() + '…' + cta
}

function fmtDate(d) {
  if (!d) return null
  const t = new Date(d)
  if (Number.isNaN(t.getTime())) return String(d)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

// ============ 预计算所有文章元数据 ============

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
        src, fm,
        wordCount: countWords(src),
        headings: extractHeadings(src),
        faqs: extractFAQs(src),
        internalLinks: extractInternalLinks(src),
        externalLinks: extractExternalLinks(src),
        description: autoDescription(src, fm.description || ''),
        mainKeyword: extractFirstKeyword(src, fm),
        keywordInFirst100: (() => {
          const kw = extractFirstKeyword(src, fm)
          if (!kw) return false
          const body = src.replace(/^---[\s\S]*?---/, '')
          const text = body.replace(/<[^>]+>/g, '').replace(/#{1,6}\s+/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
          const words = text.trim().split(/\s+/).slice(0, 100).join(' ')
          return words.toLowerCase().includes(kw.toLowerCase())
        })(),
      }
    }
  } catch {}
  return meta
})()

// ============ 英文元数据 ============

const SEO_EN = (() => {
  const map = {}
  for (const [slug, pm] of Object.entries(POST_META)) {
    const fm = pm.fm
    if (fm.enTitle || fm.enDescription || fm.enKeywords) {
      map[slug] = { title: fm.enTitle || '', description: fm.enDescription || '', keywords: fm.enKeywords || '' }
    }
  }
  return map
})()

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

// ============ 核心：generateMetadata ============

/**
 * 生成页面的所有 meta 标签 + JSON-LD 结构化数据
 * @param {Object} opts
 * @param {Object} opts.pageData - VitePress pageData
 * @param {Object} [opts.overrides] - 覆盖默认值 { title, description, ogImage }
 * @returns {Array} head 标签数组（格式同 VitePress head 配置）
 *
 * @example
 * // 在 config.js 中使用：
 * transformHead({ pageData }) {
 *   return generateMetadata({ pageData })
 * }
 */
export function generateMetadata({ pageData, overrides = {} }) {
  const url = getPageUrl(pageData.relativePath)
  const head = []
  const fm = pageData.frontmatter || {}
  const slug = pageData.relativePath.replace('posts/', '').replace('.md', '')
  const pm = POST_META[slug] || {}
  const src = pm.src || ''

  const rawTitle = overrides.title || fm.title || SITE_NAME
  const title = enforceTitle(rawTitle)

  const enMeta = getEnMeta(pageData.relativePath)
  const rawDesc = overrides.description || pm.description || fm.description || SITE_DESCRIPTION
  const description = enforceDescription(rawDesc, SITE_DESCRIPTION)
  const wordCount = pm.wordCount || 0
  const headings = pm.headings || []
  const faqs = pm.faqs || []
  const internalLinks = pm.internalLinks || []
  const externalLinks = pm.externalLinks || []
  const mainKeyword = pm.mainKeyword || ''
  const readMinutes = Math.max(1, Math.ceil(wordCount / CHARS_PER_MINUTE))

  // 社交分享图（优先使用自定义或生成的 OG image）
  const ogImage = overrides.ogImage
    ? `${SITE_URL}${overrides.ogImage}`
    : (fm.ogImage ? `${SITE_URL}${fm.ogImage}` : `${SITE_URL}/images/og/${slug}.svg`)

  // ---- 基础 meta ----（title 由 VitePress titleTemplate 处理，不在 generateMetadata 中 push）
  head.push(['link', { rel: 'canonical', href: url }])
  head.push(['meta', { name: 'description', content: description }])
  head.push(['meta', { property: 'og:url', content: url }])
  head.push(['meta', { property: 'og:title', content: title }])
  head.push(['meta', { property: 'og:description', content: description }])
  head.push(['meta', { property: 'og:type', content: fm.date ? 'article' : 'website' }])
  head.push(['meta', { property: 'og:locale', content: 'zh_CN' }])
  head.push(['meta', { property: 'og:image', content: ogImage }])
  head.push(['meta', { property: 'og:image:width', content: '1200' }])
  head.push(['meta', { property: 'og:image:height', content: '630' }])
  head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
  head.push(['meta', { name: 'twitter:image', content: ogImage }])

  // ---- 首页专用 JSON-LD @graph ----
  if (pageData.relativePath === 'index.md') {
    const graph = [
      {
        '@type': 'Organization',
        name: SITE_NAME,
        alternateName: SITE_NAME_EN,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg`, width: 512, height: 512 },
        sameAs: ['https://johboby.github.io/lanyuejie-blog/'],
        contactPoint: { '@type': 'ContactPoint', email: 'samhoclub@163.com', contactType: 'customer service', availableLanguage: ['Chinese', 'English'] },
      },
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/posts/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ]
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
  }

  // ---- 文章页 JSON-LD @graph ----
  if (fm.date) {
    const isoDate = new Date(fm.date).toISOString()
    const isLongRead = wordCount > 3000
    const articleType = isLongRead ? 'ScholarlyArticle' : 'Article'

    const articleNode = {
      '@type': articleType,
      headline: title,
      description,
      datePublished: isoDate,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: {
        '@type': 'Organization', name: SITE_NAME, alternateName: SITE_NAME_EN, url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg`, width: 512, height: 512 },
      },
      url, mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
      wordCount, timeRequired: `PT${readMinutes}M`, inLanguage: 'zh-CN',
    }

    if (enMeta) {
      articleNode.alternateHeadline = enforceTitle(enMeta.title)
      articleNode.inLanguage = ['zh-CN', 'en']
    }
    if (isLongRead && headings.length > 0) {
      articleNode.hasPart = headings.slice(0, 10).map(h => ({ '@type': 'WebPageElement', name: h.text }))
    }
    if (fm.categories && fm.categories.length) {
      articleNode.about = fm.categories.map(c => ({ '@type': 'Thing', name: c }))
    }
    if (mainKeyword) articleNode.keywords = mainKeyword

    const graph = [articleNode]

    // FAQPage
    if (faqs.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question', name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim() },
        })),
      })
    }

    // BreadcrumbList
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: '文章', item: `${SITE_URL}/posts/` },
        { '@type': 'ListItem', position: 3, name: enMeta ? `${title} / ${enforceTitle(enMeta.title)}` : title, item: url },
      ],
    })

    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])

    // speakable
    if (isLongRead) {
      head.push(['meta', { name: 'speakable', content: JSON.stringify({ cssSelector: ['.vp-doc h2', '.vp-doc h3'] }) }])
    }
  }

  // ---- 关于页 JSON-LD ----
  if (pageData.relativePath === 'about.md') {
    const graph = [{
      '@type': 'AboutPage', name: title, description, url,
      mainEntity: { '@type': 'Organization', name: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL },
    }]
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
  }

  return head
}

// ============ 导出便捷常量 ============

export {
  SITE_URL, SITE_NAME, SITE_NAME_EN, SITE_DESCRIPTION, SITE_DESCRIPTION_EN,
  CHARS_PER_MINUTE, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, DESCRIPTION_CTA,
  SYNDICATION_PLATFORMS, POST_META, SEO_EN,
  enforceTitle, enforceDescription, autoDescription, countWords,
  extractHeadings, extractFAQs, generateFAQs,
  extractInternalLinks, extractExternalLinks, extractFirstKeyword, getEnMeta, getPageUrl,
  fmtDate, escapeXml,
}