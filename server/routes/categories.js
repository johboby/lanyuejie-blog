import { Router } from 'express'
import { getCategories } from '../utils/posts.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const categories = getCategories()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
