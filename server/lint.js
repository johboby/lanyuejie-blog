import fs from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'
import chokidar from 'chokidar'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '../docs/posts')

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0]
  const d = new Date(date)
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0]
  return d.toISOString().split('T')[0]
}

function extractTitleFromContent(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : ''
}

function extractDescriptionFromContent(content) {
  const lines = content
    .replace(/^#.+/gm, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
  const text = lines.slice(0, 3).join(' ').replace(/[*`\[\]()]/g, '')
  return text.length > 120 ? text.slice(0, 117) + '...' : text
}

function normalizeArray(val) {
  if (!val) return []
  if (typeof val === 'string') return [val]
  return Array.isArray(val) ? val : [String(val)]
}

function fixContent(content) {
  let fixed = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t/g, '  ')
    .replace(/ +$/gm, '')

  fixed = fixed.replace(/^(#{1,6})\s{2,}/gm, '$1 ')
  fixed = fixed.replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
  fixed = fixed.replace(/\n{2,}^---$/gm, '\n---')

  const h1Match = fixed.match(/^#\s+.+$/m)
  if (h1Match) {
    fixed = fixed.replace(/^#\s+.+\n*/m, '')
  }

  fixed = fixed.trim() + '\n'
  return { fixed, hadH1: !!h1Match }
}

function lintPost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const { fixed, hadH1 } = fixContent(content)

  const fm = { ...data }

  let changed = false
  const fixes = []

  if (hadH1 && !fm.title) {
    fm.title = extractTitleFromContent(content)
    fixes.push(`从 # 标题提取 title: "${fm.title}"`)
    changed = true
  }

  if (!fm.title) {
    const slug = path.basename(filePath, '.md')
    fm.title = slug
    fixes.push(`补全缺失的 title: "${fm.title}"`)
    changed = true
  }

  if (!fm.date) {
    fm.date = formatDate(null)
    fixes.push(`补全缺失的 date: ${fm.date}`)
    changed = true
  } else {
    const normalized = formatDate(fm.date)
    if (fm.date !== normalized) {
      fm.date = normalized
      fixes.push(`修正 date 格式: ${fm.date}`)
      changed = true
    }
  }

  if (!fm.categories || fm.categories.length === 0) {
    fm.categories = ['未分类']
    fixes.push('补全缺失的 categories: ["未分类"]')
    changed = true
  }

  const normCats = normalizeArray(fm.categories)
  if (JSON.stringify(fm.categories) !== JSON.stringify(normCats)) {
    fm.categories = normCats
    fixes.push('修正 categories 格式为数组')
    changed = true
  }

  const normTags = normalizeArray(fm.tags)
  if (fm.tags && JSON.stringify(fm.tags) !== JSON.stringify(normTags)) {
    fm.tags = normTags
    fixes.push('修正 tags 格式为数组')
    changed = true
  }

  if (!fm.description && fixed.trim()) {
    fm.description = extractDescriptionFromContent(fixed)
    fixes.push(`自动生成 description: "${fm.description.slice(0, 40)}..."`)
    changed = true
  }

  if (content !== fixed) {
    fixes.push('修正正文格式（换行/缩进/多余空格）')
    changed = true
  }

  if (changed) {
    const result = matter.stringify(fixed, fm)
    fs.writeFileSync(filePath, result, 'utf-8')
    console.log(`\n✅ ${path.relative(POSTS_DIR, filePath)}`)
    fixes.forEach(f => console.log(`   - ${f}`))
  }

  return changed
}

function lintAll() {
  fs.ensureDirSync(POSTS_DIR)
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')
  let fixed = 0
  files.forEach(f => {
    if (lintPost(path.join(POSTS_DIR, f))) fixed++
  })
  console.log(`\n扫描 ${files.length} 篇文章，修正 ${fixed} 篇`)
}

function watch() {
  console.log(`\n👀 监听 ${POSTS_DIR} ...`)
  console.log('保存 .md 文件时自动修正格式\n')

  lintAll()

  const watcher = chokidar.watch('*.md', {
    cwd: POSTS_DIR,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100,
    },
  })

  watcher.on('add', (file) => {
    if (file === 'index.md') return
    console.log(`\n📄 新增: ${file}`)
    lintPost(path.join(POSTS_DIR, file))
  })

  watcher.on('change', (file) => {
    if (file === 'index.md') return
    console.log(`\n✏️  修改: ${file}`)
    lintPost(path.join(POSTS_DIR, file))
  })

  process.on('SIGINT', () => {
    watcher.close()
    process.exit(0)
  })
}

const cmd = process.argv[2]
if (cmd === 'lint') {
  lintAll()
} else {
  watch()
}
