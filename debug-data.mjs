import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const outDir = 'docs/.vitepress/dist'
const p = path.resolve(outDir, 'data', 'posts.json')
const exists = fs.existsSync(p)
console.log('data/posts.json exists:', exists)
if (!exists) {
  console.log('parent dirs:', fs.readdirSync(outDir).join(','))
}
process.exit(0)
