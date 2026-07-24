import { Router } from 'express'
import { listPosts, getCategories } from '../utils/posts.js'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const { total, posts } = listPosts({ pageSize: 1000 })
    const catMap = getCategories()
    const tagMap = {}
    posts.forEach(p => (p.tags || []).forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1 }))
    const topTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }))
    const latest = posts
      .filter(p => p.date)
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0]
    res.json({
      totalPosts: total,
      categories: Object.entries(catMap).map(([name, info]) => ({ name, count: info.count })),
      topTags,
      lastUpdated: latest ? latest.date : null,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
