import fs from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '../../docs/posts')

function ensureDir() {
  fs.ensureDirSync(POSTS_DIR)
}

/**
 * 只读 frontmatter（不同步读取全文），返回 { slug, filename, fm, raw }
 * 用于仅需元数据的场景（统计/搜索/分类），避免全量 gray-matter 解析。
 *
 * 支持 YAML 块序列：
 *   tags:
 *     - a
 *     - b
 * 旧版逐行 split(':') 解析会把 `- a` 当成独立 key（`- a` → `a`），导致
 * 块序列里的子项被丢、外层 tags/categories 被漏读（见 AGENTS.md "Frontmatter
 * must be parsed with gray-matter" 一节；这里只读 frontmatter 不读全文，所以
 * 保留轻量 parser，但补齐块序列支持）。
 */
function readFrontmatter(file) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---/)
  const fm = {}
  if (fmMatch) {
    const lines = fmMatch[1].split('\n')
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) { i++; continue }
      const idx = line.indexOf(':')
      if (idx < 0) { i++; continue }
      const key = line.slice(0, idx).trim()
      const val = line.slice(idx + 1).trim()
      // 键后无值 → 可能是块序列的开始
      if (val === '') {
        const items = []
        let j = i + 1
        while (j < lines.length) {
          const sub = lines[j]
          const subTrim = sub.trim()
          if (!subTrim || subTrim.startsWith('#')) { j++; continue }
          if (subTrim.startsWith('- ') || subTrim === '-') {
            let item = subTrim.replace(/^-\s*/, '').trim()
            if ((item.startsWith('"') || item.startsWith("'")) && item.length >= 2 && item[0] === item[item.length - 1]) {
              item = item.slice(1, -1)
            }
            items.push(item)
            j++
          } else break
        }
        if (items.length) fm[key] = items
        i = j
        continue
      }
      // 内联 [a, b, c]
      if (val.startsWith('[')) {
        try { fm[key] = JSON.parse(val) }
        catch { fm[key] = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, '')) }
      } else if (val.startsWith('"') || val.startsWith("'")) {
        fm[key] = val.slice(1, -1)
      } else {
        fm[key] = val
      }
      i++
    }
  }
  return { slug: file.replace('.md', ''), filename: file, fm, raw }
}

export function listPosts({ status, category, tag, page = 1, pageSize = 20 } = {}) {
  page = parseInt(page, 10) || 1
  pageSize = parseInt(pageSize, 10) || 20
  ensureDir()
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  let posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data: fm, content } = matter(raw)
    return { slug: file.replace('.md', ''), filename: file, ...fm, content, status: fm.status || 'published' }
  })

  if (status) posts = posts.filter(p => p.status === status)
  if (category) posts = posts.filter(p => p.categories?.includes(category))
  if (tag) posts = posts.filter(p => p.tags?.includes(tag))

  posts.sort((a, b) => ((a.date || '') > (b.date || '') ? -1 : 1))

  const total = posts.length
  const start = (page - 1) * pageSize
  const paged = posts.slice(start, start + pageSize)

  return { total, page, pageSize, posts: paged.map(p => ({
    ...p,
    wordCount: countWords(p.content),
    description: p.description || '',
  })) }
}

/** 字数统计：输入的是已剥掉 frontmatter 的正文（调用方传入 matter().content 或 readFrontmatter().raw.slice(frontmatter_end)）。
 *  防御性：若调用方误传了完整文件，再剥一次 frontmatter（零成本，正则不会匹配到正文）。
 */
function countWords(src) {
  const text = (src || '')
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/[#>*_`~\-]/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  const chinese = (text.match(/[一-龥]/g) || []).length
  const english = text.replace(/[一-龥]/g, ' ').split(/\s+/).filter(Boolean).length
  return chinese + english
}

export function getPost(slug) {
  ensureDir()
  const file = slug + '.md'
  const filePath = path.join(POSTS_DIR, file)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { slug, ...data, content, status: data.status || 'published' }
}

export function createPost({ slug, title, date, categories, tags, description, content, status = 'draft' }) {
  if (!slug && !title) throw new Error('slug 或 title 至少提供一个')
  ensureDir()
  const base = slug || title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')
  if (!base) throw new Error('无法生成有效的 slug：slug 与 title 都为空')
  const fileName = base + '.md'
  const filePath = path.join(POSTS_DIR, fileName)
  if (fs.existsSync(filePath)) throw new Error('文章已存在: ' + fileName)

  const frontmatter = {}
  if (title) frontmatter.title = title
  if (date) frontmatter.date = date
  if (categories?.length) frontmatter.categories = categories
  if (tags?.length) frontmatter.tags = tags
  if (description) frontmatter.description = description
  if (status && status !== 'published') frontmatter.status = status

  const body = (content || '').replace(/\\n/g, '\n')
  const fileContent = matter.stringify(body, frontmatter)
  fs.writeFileSync(filePath, fileContent, 'utf-8')
  return { slug: fileName.replace('.md', ''), ...frontmatter }
}

export function updatePost(slug, updates) {
  ensureDir()
  const filePath = path.join(POSTS_DIR, slug + '.md')
  if (!fs.existsSync(filePath)) throw new Error('文章不存在: ' + slug)

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content: oldContent } = matter(raw)

  const newContent = (updates.content !== undefined ? updates.content : oldContent).replace(/\\n/g, '\n')
  const newData = { ...data }
  if (updates.title !== undefined) newData.title = updates.title
  if (updates.date !== undefined) newData.date = updates.date
  if (updates.categories !== undefined) newData.categories = updates.categories
  if (updates.tags !== undefined) newData.tags = updates.tags
  if (updates.description !== undefined) newData.description = updates.description
  if (updates.status !== undefined) {
    if (updates.status === 'published') delete newData.status
    else newData.status = updates.status
  }

  const fileContent = matter.stringify(newContent, newData)
  fs.writeFileSync(filePath, fileContent, 'utf-8')
  return { slug, ...newData }
}

export function deletePost(slug) {
  ensureDir()
  const filePath = path.join(POSTS_DIR, slug + '.md')
  if (!fs.existsSync(filePath)) throw new Error('文章不存在: ' + slug)
  fs.removeSync(filePath)
  return { success: true, slug }
}

export function getCategories() {
  ensureDir()
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  const catMap = {}
  for (const file of files) {
    const { fm } = readFrontmatter(file)
    const cats = fm.categories || ['未分类']
    cats.forEach(cat => {
      if (!catMap[cat]) catMap[cat] = { count: 0, posts: [] }
      catMap[cat].count += 1
      catMap[cat].posts.push({ title: fm.title, slug: file.replace('.md', ''), date: fm.date })
    })
  }
  return catMap
}

// 轻量统计：仅读取 frontmatter，不解析全文
export function getPostStats() {
  ensureDir()
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  let total = 0
  const catMap = {}
  const tagMap = {}
  let latestDate = null
  for (const file of files) {
    try {
      const { fm } = readFrontmatter(file)
      total++
      const cats = fm.categories || ['未分类']
      cats.forEach(cat => { catMap[cat] = (catMap[cat] || 0) + 1 })
      ;(fm.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1 })
      if (fm.date && (!latestDate || fm.date > latestDate)) latestDate = fm.date
    } catch (err) {
      console.error('[getPostStats] skip', file, err.message)
    }
  }
  const topTags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }))
  return {
    totalPosts: total,
    categories: Object.entries(catMap).map(([name, info]) => ({ name, count: info.count })),
    topTags,
    lastUpdated: latestDate,
  }
}

export function searchPosts(keyword) {
  ensureDir()
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  const kw = keyword.toLowerCase()
  return files.map(f => readFrontmatter(f)).filter(({ fm }) => {
    const title = (fm.title || '').toLowerCase()
    const desc = (fm.description || '').toLowerCase()
    const tags = (fm.tags || []).map(t => t.toLowerCase())
    const cats = (fm.categories || []).map(c => c.toLowerCase())
    return title.includes(kw) || desc.includes(kw) || tags.some(t => t.includes(kw)) || cats.some(c => c.includes(kw))
  }).map(({ slug, fm }) => ({ slug, ...fm }))
}
