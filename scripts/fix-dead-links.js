const fs = require('fs')
const path = require('path')

const postsDir = path.resolve('docs/posts')
const missing = new Set([
  'ai-coding-ecommerce-backend-2026',
  'ai-pricing-2026-api-cost-guide',
  'claude-code-autonomous-development',
  'deep-work-practice-2026',
  'gemini-multimodal-productivity',
  'solo-5-platform-content-pipeline-2026',
])

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
let totalRemoved = 0
let filesChanged = 0

for (const f of files) {
  const fp = path.join(postsDir, f)
  let content = fs.readFileSync(fp, 'utf-8')
  const lines = content.split('\n')
  let changed = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.includes('相关阅读') && !missing.has((line.match(/\/posts\/([a-z0-9\-]+)/) || [])[1] || '')) {
      // still scan for anchors even if no 相关阅读 keyword
    }
    if (!/<a\s+href="\/posts\//.test(line)) continue
    let newLine = line
    for (const slug of missing) {
      const re = new RegExp(`\\s*·\\s*<a\\s+href="/posts/${slug}"[^>]*>[^<]*</a>`, 'g')
      newLine = newLine.replace(re, '')
      const reStart = new RegExp(`<a\\s+href="/posts/${slug}"[^>]*>[^<]*</a>\\s*·\\s*`, 'g')
      newLine = newLine.replace(reStart, '')
      const reSolo = new RegExp(`<a\\s+href="/posts/${slug}"[^>]*>[^<]*</a>`, 'g')
      newLine = newLine.replace(reSolo, '')
    }
    if (newLine !== line) {
      lines[i] = newLine
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(fp, lines.join('\n'), 'utf-8')
    filesChanged++
  }
}

console.log(`Files changed: ${filesChanged}`)
console.log('Done. Removed broken /posts/<missing> anchors while preserving valid links.')
