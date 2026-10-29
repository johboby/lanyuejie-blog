/**
 * Sitemap Ping Tool
 *
 * 使用 Sitemap Submission Protocol 通知 Google & Bing
 * 原理：通过 HTTP GET / sitemap.xml?url= 的公开 ping 接口
 *
 * 用法: node scripts/deserve-sitemap-ping.mjs
 */

const SITEMAP_URL = 'https://johboby.github.io/lanyuejie-blog/sitemap.xml'

const PING_ENDPOINTS = [
  {
    name: 'Google',
    url: 'https://www.google.com/webmasters/tools/ping?sitemap=',
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/webmaster/ping.aspx?sitemap=',
  },
  {
    name: 'Yandex',
    url: 'https://webmaster.yandex.com/ping?sitemap=',
  },
  {
    name: 'Baidu',
    url: 'https://data.zz.baidu.com/urls?site=',
  },
]

async function ping(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    return res.status >= 200 && res.status < 300
  } catch (err) {
    clearTimeout(timeout)
    return false
  }
}

async function main() {
  console.log('📍 开始通知搜索引擎更新...')
  // 为每个 endpoint 创建 URL
  const tasks = PING_ENDPOINTS.map(async endpoint => {
    const fullUrl = endpoint.url + encodeURIComponent(SITEMAP_URL)
    const success = await ping(fullUrl)
    console.log(`${success ? '✅' : '❌'} ${endpoint.name}: ${success ? '已通知' : '失败'}`)
    return success
  })

  const results = await Promise.all(tasks)
  const successCount = results.filter(r => r).length
  console.log(`\n通知完成：${successCount}/${results.length} 成功`)
}

main().catch(console.error)
