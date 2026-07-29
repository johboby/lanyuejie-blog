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
  '2026-h2-economy-save-or-invest': {
    title: '2026 H2 Economy: Should You Save or Invest?',
    description: 'A practitioner guide to personal finance decisions in the second half of 2026, weighing saving, investing, and risk under economic uncertainty.',
    keywords: 'economy 2026, save or invest, personal finance, economic outlook, investment strategy',
  },
  '2026-h2-economy-save-or-invest-zh': {
    title: '2026 H2 Economy (Chinese): Save or Invest?',
    description: '面向普通人的 2026 下半年经济展望：在不确定性中如何权衡储蓄与投资、控制风险并规划资产。',
    keywords: '2026经济, 存钱还是投资, 个人理财, 经济展望, 资产配置',
  },
  'ai-10000-word-article-workflow': {
    title: 'AI-Assisted 10,000-Word Article Workflow',
    description: 'A complete, repeatable workflow for drafting a 10,000-word long-form article in a single day with AI assistance, broken down step by step.',
    keywords: 'AI writing, long-form content, writing workflow, content production, productivity',
  },
  'ai-anxiety-guide': {
    title: 'AI Anxiety Is a Real Condition: How to Live with Uncertainty',
    description: 'A guide to understanding and coping with AI-induced anxiety, and finding peace while living alongside rapid technological uncertainty.',
    keywords: 'AI anxiety, mental health, technology anxiety, coping, uncertainty',
  },
  'ai-app-dev-knowledge-graph-2026': {
    title: 'Prompt to System Design: AI Dev Knowledge Graph 2026',
    description: 'How to move from prompts to structured system design using an AI-driven development knowledge graph in 2026.',
    keywords: 'AI development, knowledge graph, system design, software engineering, prompt engineering',
  },
  'ai-bulk-seo-30-day-experiment': {
    title: 'AI SEO in 30 Days: Publishing 90 Articles, Here Is the Data',
    description: 'A 30-day bulk SEO experiment publishing 90 AI-assisted articles, with honest traffic, ranking, and revenue data.',
    keywords: 'AI SEO, content marketing, bulk publishing, SEO experiment, traffic growth',
  },
  'ai-data-analysis-excel-to-charts': {
    title: 'AI Data Analysis 2026: Excel In, Charts and Insights Out',
    description: 'How to turn raw Excel data into clear charts and actionable insights using AI data analysis tools in 2026.',
    keywords: 'AI data analysis, Excel, data visualization, business intelligence, charts',
  },
  'ai-image-editing-tools-2026': {
    title: '12 AI Image Editing Tools 2026: Cutout, Retouch, Outpaint Tested',
    description: 'Hands-on testing of 12 AI image editing tools in 2026 covering cutout, retouching, and outpainting workflows.',
    keywords: 'AI image editing, photo retouch, cutout, outpaint, image tools',
  },
  'ai-image-generators-ultimate-comparison': {
    title: 'AI Art Generators Ultimate Showdown: Midjourney vs DALL-E vs Stable Diffusion 2026',
    description: 'The definitive 2026 comparison of leading AI art generators Midjourney, DALL-E, and Stable Diffusion across quality, control, and cost.',
    keywords: 'AI art, Midjourney, DALL-E, Stable Diffusion, image generation',
  },
  'ai-music-generation-suno-vs-udio-2026': {
    title: 'AI Music 2026: Suno vs Udio, Can AI Make Good Songs?',
    description: 'A 2026 comparison of AI music generators Suno and Udio, examining whether AI can produce genuinely good songs.',
    keywords: 'AI music, Suno, Udio, music generation, generative audio',
  },
  'ai-personal-knowledge-base-2026': {
    title: 'AI Knowledge Base 2026: From Notes to Smart Q&A System',
    description: 'Build a personal AI knowledge base in 2026 that turns scattered notes into a searchable, conversational Q&A system.',
    keywords: 'AI knowledge base, personal knowledge management, RAG, second brain, Q&A',
  },
  'ai-search-vs-google-2026': {
    title: 'AI Search vs Google 2026: Perplexity, ChatGPT and Arc Tested',
    description: 'A 2026 hands-on comparison of AI search engines Perplexity, ChatGPT, and Arc against traditional Google search.',
    keywords: 'AI search, Perplexity, ChatGPT search, Google, search engines',
  },
  'ai-solo-social-media-sop-2026': {
    title: 'AI Solo SOP: Run Social Media from Topic to Publish (2026)',
    description: 'A standard operating procedure for solo creators to run an entire social media pipeline from topic research to publishing with AI in 2026.',
    keywords: 'social media, AI workflow, content SOP, solo creator, automation',
  },
  'ai-subscription-bill-2026': {
    title: 'My AI Subscription Bill in 2026: What I Pay and How I Cut It',
    description: 'A transparent breakdown of one creator real AI subscription costs in 2026 and practical tips to cut the bill without losing capability.',
    keywords: 'AI subscription, SaaS cost, cost cutting, productivity tools, AI stack',
  },
  'ai-training-avoid-scams': {
    title: 'AI Training Courses: The Most Honest Scam-Avoidance Guide',
    description: 'A no-nonsense guide to spotting and avoiding scams in the booming AI training course market.',
    keywords: 'AI training, scam avoidance, online courses, AI education, pitfalls',
  },
  'ai-video-generation-2026-sora-kling-runway': {
    title: 'AI Video 2026: Sora vs Kling vs Runway, Which Is Best?',
    description: 'The 2026 showdown of AI video generators Sora, Kling, and Runway across quality, motion, and usability.',
    keywords: 'AI video, Sora, Kling, Runway, video generation',
  },
  'ai-will-replace-white-collar-jobs': {
    title: 'Will AI Replace 50% of White-Collar Jobs in 2 Years? A Calm Analysis',
    description: 'A practitioner calmly analyzes whether AI will replace half of white-collar jobs within two years, separating hype from reality.',
    keywords: 'AI jobs, white-collar, automation, future of work, employment',
  },
  'ai-will-replace-white-collar-jobs-2026-analysis': {
    title: 'AI and White-Collar Jobs 2026: An Honest Analysis',
    description: 'An honest 2026 analysis of how AI is reshaping white-collar work, with realistic timelines and actionable advice.',
    keywords: 'AI jobs, white-collar, future of work, automation, career',
  },
  'blog-seo-growth-0-to-100k': {
    title: 'From 0 to 100K: My Blog SEO Growth Retrospective (18-Month Data)',
    description: 'A full retrospective of growing a blog from zero to 100K followers through SEO, with 18 months of real data and lessons.',
    keywords: 'blog SEO, growth, organic traffic, content strategy, retrospective',
  },
  'chatgpt-vs-claude-vs-gemini-2026': {
    title: 'ChatGPT vs Claude vs Gemini: 2026 In-Depth AI Comparison',
    description: 'A 2026 deep comparison of ChatGPT, Claude, and Gemini across coding, writing, reasoning, multimodal, and pricing.',
    keywords: 'ChatGPT, Claude, Gemini, AI comparison, LLM benchmark',
  },
  'deep-work-2026-short-video-focus': {
    title: 'Deep Work in 2026: 4-Hour Focus in the Short-Video Era',
    description: 'Practical strategies to achieve four hours of deep focus daily in 2026 despite the distraction of the short-video era.',
    keywords: 'deep work, focus, productivity, attention, short video',
  },
  'early-rising-100-days': {
    title: '100 Days Early Rising Experiment: Sleep Data, Productivity, Mood',
    description: 'A complete record of a 100-day early rising experiment covering sleep data, work efficiency, and emotional changes.',
    keywords: 'early rising, habit, sleep, productivity, self-experiment',
  },
  'early-rising-100-days-experiment-2026': {
    title: '100 Days Early Rising: Data, Sleep and Mood (2026)',
    description: 'A 2026 data-driven account of a 100-day early rising challenge, tracking sleep, mood, and productivity.',
    keywords: 'early rising, habit tracking, sleep data, productivity, experiment',
  },
  'feynman-learning-method-ai-2026': {
    title: 'Feynman Plus AI: Learn Any Skill by Teaching (2026)',
    description: 'Combine the Feynman learning technique with AI to master any skill faster by teaching and getting instant feedback.',
    keywords: 'Feynman technique, AI learning, skill acquisition, teaching, study method',
  },
  'feynman-technique-ai-2026': {
    title: 'Feynman Technique Plus AI: Master Any Skill by Teaching',
    description: 'How to use the Feynman technique powered by AI to truly master any skill through teaching and explanation.',
    keywords: 'Feynman technique, AI tutor, learning method, mastery, study',
  },
  'fine-tune-ai-model-complete-guide-2026': {
    title: 'Fine-Tune Your Own AI Model: Full Pipeline 2026',
    description: 'A complete, practical pipeline for fine-tuning your own AI model in 2026, from data to deployment.',
    keywords: 'fine-tuning, LLM training, model deployment, machine learning, custom model',
  },
  'humanoid-robot-home-2026': {
    title: 'Humanoid Robots at Home 2026: Progress and Reality',
    description: 'An assessment of humanoid robot progress for home use in 2026, separating demo hype from real-world capability.',
    keywords: 'humanoid robot, robotics, home automation, AI hardware, 2026',
  },
  'letter-to-2026-graduates': {
    title: 'A Letter to the 2026 Graduates: What Is Truly Irreplaceable in the AI Era',
    description: 'A letter to 2026 graduates on the human abilities that remain irreplaceable as AI reshapes the workforce.',
    keywords: 'graduation, AI era, career advice, future of work, human skills',
  },
  'local-llm-deployment-guide-llama4-qwen3': {
    title: 'Local LLM Guide: Llama 4 and Qwen 3 Deployment plus Hardware',
    description: 'A practical guide to deploying local LLMs Llama 4 and Qwen 3, including hardware requirements and setup.',
    keywords: 'local LLM, Llama 4, Qwen 3, self-hosting, AI hardware',
  },
  'minimalist-app-stack-2026': {
    title: 'Minimalist App Stack 2026: 8 Apps to Run My Whole Life',
    description: 'How a minimalist app stack of just 8 applications runs an entire life and work system in 2026.',
    keywords: 'minimalism, app stack, productivity, tools, digital minimalism',
  },
  'minimalist-tool-stack': {
    title: 'Minimalist Toolism: Only 8 Apps to Manage My Whole Life and Work',
    description: 'A minimalist approach using just eight apps to manage all of life and work, cutting tool sprawl and cognitive load.',
    keywords: 'minimalism, productivity tools, app stack, digital declutter, workflow',
  },
  'notion-ai-second-brain-2026': {
    title: 'Notion AI Second Brain 2026: PARA Setup and Free Template',
    description: 'Build a Notion AI second brain in 2026 with a PARA setup and a free downloadable template.',
    keywords: 'Notion AI, second brain, PARA, knowledge management, template',
  },
  'notion-ai-second-brain-guide': {
    title: 'Notion Plus AI Second Brain: My Complete Setup and Free Template',
    description: 'My complete Notion and AI second brain setup with a free template to replicate the system.',
    keywords: 'Notion, AI second brain, PARA, productivity, template',
  },
  'python-ai-customer-service-bot': {
    title: 'Python Plus AI: Build a Smart Customer Service Bot in 100 Lines',
    description: 'A step-by-step tutorial to build a smart AI customer service bot in about 100 lines of Python.',
    keywords: 'Python, AI bot, customer service, chatbot, tutorial',
  },
  'web3-2026-real-use-cases': {
    title: 'Is Web3 Dead? Real Blockchain Use Cases in 2026',
    description: 'An honest look at whether Web3 is dead and the blockchain use cases that are actually working in 2026.',
    keywords: 'Web3, blockchain, use cases, crypto, decentralized',
  },
  'why-start-blogging-now': {
    title: 'Why I Urge You to Start Blogging Now (Even If No One Reads)',
    description: 'A sincere argument for starting a blog in 2026 even with zero audience, for clarity, knowledge compounding, and career opportunity.',
    keywords: 'blogging, writing, personal growth, knowledge compounding, digital garden',
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

    // Default social share image (always present so crawlers never fall back to a random crop)
    const ogImage = `${SITE_URL}/images/agriculture.jpg`
    head.push(['meta', { property: 'og:image', content: ogImage }])
    head.push(['meta', { property: 'og:image:width', content: '1200' }])
    head.push(['meta', { property: 'og:image:height', content: '630' }])
    head.push(['meta', { name: 'twitter:image', content: ogImage }])

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
  },
})
