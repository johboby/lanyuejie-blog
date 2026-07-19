import { createContentLoader } from 'vitepress'

const CHARS_PER_MINUTE = 500

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
    .replace(/\|/g, '')
    .replace(/---|\*\*\*|___/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function extractAutoDescription(src, fallback = '') {
  const text = extractText(src)
  if (!text) return fallback
  const firstParagraph = text.split('\n').find(l => l.trim().length > 20)
  if (!firstParagraph) return fallback
  const clean = firstParagraph.trim().replace(/\s+/g, ' ')
  return clean.length > 160 ? clean.slice(0, 157) + '...' : clean
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
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '')
    headings.push({ level, text, id })
  }
  return headings
}

function countWords(src) {
  const text = extractText(src)
  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const english = text.replace(/[\u4e00-\u9fff]/g, ' ').split(/\s+/).filter(w => w).length
  return chinese + english
}

function estimateReadTime(wordCount) {
  const minutes = Math.max(1, Math.ceil(wordCount / CHARS_PER_MINUTE))
  if (minutes < 60) return `${minutes} 分钟`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} 小时 ${m} 分钟` : `${h} 小时`
}

export default createContentLoader('posts/*.md', {
  transform(raw) {
    return raw
      .filter(page => !page.url.endsWith('/posts/'))
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
      .map(page => {
        const src = page.src
        const fm = page.frontmatter
        const wordCount = countWords(src)
        const autoDescription = extractAutoDescription(src, fm.description || '')
        const headings = extractHeadings(src)

        return {
          title: fm.title,
          url: page.url,
          date: fm.date ? new Date(fm.date).toLocaleDateString('zh-CN') : null,
          dateISO: fm.date ? new Date(fm.date).toISOString() : null,
          tags: fm.tags || [],
          categories: fm.categories || [],
          excerpt: fm.description || autoDescription,
          description: autoDescription,
          wordCount,
          readTime: estimateReadTime(wordCount),
          headings,
          hasLongContent: wordCount > 3000,
        }
      })
  }
})
