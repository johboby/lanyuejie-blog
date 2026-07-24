import { Router } from 'express'
import { getCategories } from '../utils/posts.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const catMap = getCategories()
    const list = Object.entries(catMap).map(([name, info]) => ({
      name,
      count: info.count,
      posts: info.posts,
    }))
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
