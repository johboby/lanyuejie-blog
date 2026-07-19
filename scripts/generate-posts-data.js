import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.resolve('docs/posts')
const outFile = path.resolve('docs/.vitepress/posts-data.json')

const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md') && f !== 'index.md')
  .sort()

const posts = []

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
  const { data } = matter(raw)
  if (!data.title) continue

  const slug = file.replace(/\.md$/, '')
  const url = '/lanyuejie-blog/posts/' + slug

  posts.push({
    title: data.title || '',
    date: data.date ? new Date(data.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
    rawDate: data.date || '',
    tags: data.tags || [],
    categories: data.categories || [],
    excerpt: data.description || '',
    url,
  })
}

posts.sort((a, b) => (a.rawDate > b.rawDate ? -1 : 1))

fs.writeFileSync(outFile, JSON.stringify(posts, null, 2), 'utf-8')
console.log(`Generated ${posts.length} posts to ${outFile}`)
