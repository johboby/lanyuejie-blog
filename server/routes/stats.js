import { Router } from 'express'
import { getPostStats } from '../utils/posts.js'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const stats = getPostStats()
    res.json({
      totalPosts: stats.totalPosts,
      categories: stats.categories,
      topTags: stats.topTags,
      lastUpdated: stats.lastUpdated,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
