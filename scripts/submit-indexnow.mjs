/**
 * IndexNow 提交脚本
 *
 * 读取构建生成的 sitemap.xml，提取所有 URL，
 * 提交到 IndexNow API（Bing / Yandex / Baidu 通用）。
 *
 * 用法: node scripts/submit-indexnow.mjs
 * 环境变量: INDEXNOW_KEY — IndexNow 站点验证密钥
 *
 * 需要先设置 INDEXNOW_KEY 环境变量：
 *   set INDEXNOW_KEY=your-key
 */
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const INDEXNOW_API = 'https://api.indexnow.org/indexnow'
const KEY = process.env.INDEXNOW_KEY

if (!KEY) {
  console.error('错误: 请设置 INDEXNOW_KEY 环境变量')
  console.error('  set INDEXNOW_KEY=your-key')
  process.exit(1)
}

const sitemapPath = resolve('docs/.vitepress/dist/sitemap.xml')

if (!existsSync(sitemapPath)) {
  console.error(`错误: 未找到 sitemap.xml: ${sitemapPath}`)
  console.error('  请先运行 npm run build')
  process.exit(1)
}

const sitemap = readFileSync(sitemapPath, 'utf-8')

// 从 sitemap.xml 提取所有 <loc> URL
const urlPattern = /<loc>(https?:\/\/[^<]+)<\/loc>/g
const urls = []
let match
while ((match = urlPattern.exec(sitemap)) !== null) {
  urls.push(match[1])
}

if (urls.length === 0) {
  console.log('警告: sitemap.xml 中未找到 URL')
  process.exit(0)
}

console.log(`找到 ${urls.length} 个 URL，待提交...`)

// IndexNow API 每次最多提交 10000 个 URL
const BATCH_SIZE = 10000
const batches = []
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  batches.push(urls.slice(i, i + BATCH_SIZE))
}

let successCount = 0
let failCount = 0

for (let i = 0; i < batches.length; i++) {
  const batch = batches[i]
  const body = JSON.stringify({
    host: 'johboby.github.io',
    key: KEY,
    keyType: 'txt',
    urlList: batch,
  })

  try {
    const response = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    })

    const result = await response.text()

    if (response.ok) {
      console.log(`批次 ${i + 1}/${batches.length}: 成功 — ${result}`)
      successCount += batch.length
    } else {
      console.error(`批次 ${i + 1}/${batches.length}: 失败 — HTTP ${response.status}: ${result}`)
      failCount += batch.length
    }
  } catch (err) {
    console.error(`批次 ${i + 1}/${batches.length}: 错误 — ${err.message}`)
    failCount += batch.length
  }
}

console.log(`\n提交完成: 成功 ${successCount}, 失败 ${failCount}, 总计 ${urls.length}`)
