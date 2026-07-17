import { Router } from 'express'
import { searchPosts } from '../utils/posts.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json([])
    const results = searchPosts(q)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
