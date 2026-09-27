import { defineConfig } from 'vitepress'
import { writeFileSync, readdirSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import {
  generateMetadata, SITE_URL, SITE_NAME, SITE_NAME_EN,
  SITE_DESCRIPTION, SITE_DESCRIPTION_EN, CHARS_PER_MINUTE,
  enforceTitle, enforceDescription, autoDescription, countWords,
  POST_META, SEO_EN, getEnMeta, getPageUrl, escapeXml,
} from './metadata.js'
import { generateOGImages, generateHomeOGImage } from './og-generator.js'

// 从 POST_META 派生文章列表（供 window.__VP_POSTS__ 内嵌到 HTML）
const POSTS_DATA = (() => {
  const list = []
  for (const [slug, pm] of Object.entries(POST_META)) {
    const fm = pm.fm
    if (!fm.title || !fm.date) continue
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

export default defineConfig({
  lang: 'zh-CN',
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  titleTemplate: false,
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
    server: {
      proxy: {
        '/api': { target: 'http://localhost:3001', changeOrigin: true },
      },
    },
    plugins: [
      {
        name: 'generate-posts-list',
        buildStart() {
          const list = POSTS_DATA.map(p => ({
            url: p.url, title: p.title, date: p.date,
            tags: p.tags, categories: p.categories,
            wordCount: p.wordCount, readTime: p.readTime,
            hasLongContent: p.hasLongContent,
          }))
          writeFileSync(
            resolve('docs', 'posts-list.generated.js'),
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
        },
      },
    ],
  },

  markdown: {
    config(md) {
      const defaultImage = md.renderer.rules.image
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (token.attrIndex('loading') < 0) token.attrPush(['loading', 'lazy'])
        return defaultImage(tokens, idx, options, env, self)
      }
    },
  },

  // 站点级通用 head 标签（所有页面共享）
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/lanyuejie-blog/favicon.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_NAME} RSS`, href: `${SITE_URL}/feed.xml` }],
    ['link', { rel: 'dns-prefetch', href: 'https://johboby.github.io' }],
    ['link', { rel: 'preconnect', href: 'https://johboby.github.io', crossorigin: '' }],
    ['link', { rel: 'webmention', href: 'https://webmention.io/johboby/lanyuejie-blog/webmention' }],
    ['link', { rel: 'pingback', href: 'https://webmention.io/johboby/lanyuejie-blog/xmlrpc' }],
    ['meta', { name: 'keywords', content: '揽月界科技,Lanyuejie Technology,AI风控,智能保险,畜牧业监测,双精两减,防灾减损,人工智能,风险控制' }],
    ['meta', { name: 'author', content: SITE_NAME }],
    ['meta', { name: 'robots', content: 'index, follow, maxsnippet:-1, maximagepreview:large, maxvideopreview:-1' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow, maxsnippet:-1, maximagepreview:large' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
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
        _render(src, env, md) {
          if (env.frontmatter && env.frontmatter.search === false) return ''
          return md.render(src.length > 1800 ? src.slice(0, 1800) : src, env)
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

  // 集中生成所有页面级 meta 标签 + JSON-LD @graph
  transformHead({ pageData }) {
    return generateMetadata({ pageData })
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

    // ---- OG Images ----
    const ogDir = resolve('docs', 'public', 'images', 'og')
    const ogResults = generateOGImages(posts, ogDir, SITE_NAME)
    // Home page OG image (slug is 'index' from pageData.relativePath)
    writeFileSync(resolve(ogDir, 'index.svg'), generateHomeOGImage(SITE_NAME), 'utf-8')
    ogResults.push({ slug: 'index', title: SITE_NAME, path: '/images/og/index.svg' })

    // ---- RSS ----
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

    // ---- llms-full.txt ----
    const llmsFull = [
      `# ${SITE_NAME} / ${SITE_NAME_EN}`, '',
      `> ${SITE_DESCRIPTION}`, `> ${SITE_DESCRIPTION_EN}`, '',
      `Website: ${SITE_URL}`,
      'Contact: samhoclub@163.com | WeChat cy321one | WeChat Official Account 尘渊文化', '',
      '---', '',
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
          `## ${enforceTitle(post.frontmatter.title)}${enMeta ? ` / ${enforceTitle(enMeta.title)}` : ''}`, '',
          `- URL: ${SITE_URL}${post.url}`, `- Date: ${dateStr}`,
          `- Words: ${wc.toLocaleString()} | Read time: ${rt} min`,
          tags ? `- Tags: ${tags}` : null,
          `- Categories: ${(post.frontmatter.categories || []).join('、')}`,
          enMeta ? `- EN Keywords: ${enMeta.keywords}` : null, '', desc,
          enMeta ? `EN: ${enMeta.description}` : null, '',
        ].filter(Boolean).join('\n')
      }),
    ].join('\n')
    writeFileSync(resolve(outDir, 'llms-full.txt'), llmsFull, { encoding: 'utf-8' })

    // ---- llms.txt（精简版，AI 爬虫入口） ----
    const llmsIndex = [
      `# ${SITE_NAME}`, '',
      `> ${SITE_DESCRIPTION} | ${SITE_URL}`, '',
      '揽月界科技是一家专注于人工智能与风险控制的前沿科技企业，核心业务涵盖智能保险、畜牧业风险监测、农业标准化数据库。', '',
      '## 联系方式', '',
      '- 邮箱：samhoclub@163.com', '- 微信：cy321one', '- 公众号：尘渊文化', '',
      '## 产品平台', '',
      '- 生猪养殖风险监测：https://szxt.cycu.top',
      '- 牦牛监测和智能保险：https://agri.cycu.top',
      '- 农业标准化基础数据库：https://risk.cycu.top', '',
      '## 研究报告', '',
      ...posts.map(post => {
        const slug = post.url.replace('/posts/', '').replace(/\/$/, '').replace('.html', '')
        const enMeta = SEO_EN[slug]
        const title = enMeta ? `${enforceTitle(post.frontmatter.title)} / ${enforceTitle(enMeta.title)}` : enforceTitle(post.frontmatter.title)
        return `- [${title}](${SITE_URL}${post.url})`
      }), '',
      '## 可选：详细内容', '',
      `- [llms-full.txt](${SITE_URL}/llms-full.txt) — 包含所有文章摘要的完整版`, '',
    ].join('\n')
    writeFileSync(resolve(outDir, 'llms.txt'), llmsIndex, { encoding: 'utf-8' })

    // ---- data/posts.json ----
    const postsJson = posts.map(post => {
      const fm = post.frontmatter || {}
      const src = post.src || ''
      const wc = countWords(src)
      return {
        url: post.url, title: fm.title || '',
        date: fm.date ? new Date(fm.date).toISOString() : null,
        description: fm.description || autoDescription(src, ''),
        tags: fm.tags || [], categories: fm.categories || [],
        excerpt: autoDescription(src, fm.description || ''),
        wordCount: wc, readTime: `${Math.max(1, Math.ceil(wc / CHARS_PER_MINUTE))} 分钟`,
        enTitle: fm.enTitle || '', enDescription: fm.enDescription || '',
      }
    })
    const dataDir = resolve(outDir, 'data')
    mkdirSync(dataDir, { recursive: true })
    writeFileSync(resolve(dataDir, 'posts.json'), JSON.stringify(postsJson, null, 0), { encoding: 'utf-8' })
  },
})
