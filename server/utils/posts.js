import fs from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '../../docs/posts')

function ensureDir() {
  fs.ensureDirSync(POSTS_DIR)
}

export function listPosts({ status, category, tag, page = 1, pageSize = 20 } = {}) {
  page = parseInt(page, 10) || 1
  pageSize = parseInt(pageSize, 10) || 20
  ensureDir()
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  let posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug: file.replace('.md', ''),
      filename: file,
      ...data,
      content,
      status: data.status || 'published',
    }
  })

  if (status) posts = posts.filter(p => p.status === status)
  if (category) posts = posts.filter(p => p.categories?.includes(category))
  if (tag) posts = posts.filter(p => p.tags?.includes(tag))

  posts.sort((a, b) => ((a.date || '') > (b.date || '') ? -1 : 1))

  const total = posts.length
  const start = (page - 1) * pageSize

  function countWords(src) {
    const text = (src || '')
      .replace(/^---[\s\S]*?---/, '')
      .replace(/[#>*_`~\-]/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    const chinese = (text.match(/[一-龥]/g) || []).length
    const english = text.replace(/[一-龥]/g, ' ').split(/\s+/).filter(Boolean).length
    return chinese + english
  }

  posts = posts.slice(start, start + pageSize).map(p => {
    const { content: _, ...rest } = p
    const wordCount = countWords(p.content)
    return {
      ...rest,
      wordCount,
      description: rest.description || '',
    }
  })

  return { total, page, pageSize, posts }
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
  ensureDir()
  const fileName = (slug || title?.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '')) + '.md'
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
  const { posts } = listPosts()
  const catMap = {}
  posts.forEach(p => {
    const cats = p.categories || ['未分类']
    cats.forEach(cat => {
      if (!catMap[cat]) catMap[cat] = { count: 0, posts: [] }
      catMap[cat].count += 1
      catMap[cat].posts.push({ title: p.title, slug: p.slug, date: p.date })
    })
  })
  return catMap
}

// 轻量统计：仅读取 frontmatter，不解析全文，避免 pageSize: 1000 暴力读取全文
export function getPostStats() {
  ensureDir()
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  let total = 0
  const catMap = {}
  const tagMap = {}
  let latestDate = null
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---/)
      if (!fmMatch) continue
      total++
      const fm = {}
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
  const { posts } = listPosts()
  const kw = keyword.toLowerCase()
  return posts.filter(p =>
    (p.title || '').toLowerCase().includes(kw) ||
    (p.description || '').toLowerCase().includes(kw) ||
    (p.tags || []).some(t => t.toLowerCase().includes(kw)) ||
    (p.categories || []).some(c => c.toLowerCase().includes(kw))
  )
}
