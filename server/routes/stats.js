import { Router } from 'express'
import { getPostStats, getCategories } from '../utils/posts.js'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const stats = getPostStats()
    const catMap = getCategories()
    res.json({
      totalPosts: stats.totalPosts,
      categories: Object.entries(catMap).map(([name, info]) => ({ name, count: info.count })),
      topTags: stats.topTags,
      lastUpdated: stats.lastUpdated,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
