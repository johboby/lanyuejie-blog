import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

function loadSEOMap() {
  const map = {}
  try {
    const dir = resolve('docs', 'posts')
    const files = readdirSync(dir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const src = readFileSync(resolve(dir, file), 'utf-8')
      const fmMatch = src.match(/^---\s*\n([\s\S]*?)\n---/)
      if (!fmMatch) continue
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
      const slug = file.replace('.md', '')
      if (fm.enTitle || fm.enDescription) {
        map[slug] = { title: fm.enTitle || '', description: fm.enDescription || '', keywords: fm.enKeywords || '' }
      }
    }
  } catch (e) { console.error(e) }
  return map
}

const m = loadSEOMap()
console.log('Loaded entries:', Object.keys(m).length);
console.log('agriculture:', JSON.stringify(m['ai-agriculture-latest-2026']));
console.log('blog-seo:', JSON.stringify(m['blog-seo-growth-0-to-100k']));
console.log('economy-zh:', JSON.stringify(m['2026-h2-economy-save-or-invest-zh']));
console.log('ai-jobs:', JSON.stringify(m['ai-will-replace-white-collar-jobs']));
