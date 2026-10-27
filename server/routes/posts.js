import { Router } from 'express'
import { listPosts, getPost, createPost, updatePost, deletePost } from '../utils/posts.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const result = listPosts(req.query)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:slug', (req, res) => {
  try {
    const post = getPost(req.params.slug)
    if (!post) return res.status(404).json({ error: '文章不存在' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', (req, res) => {
  try {
    const post = createPost(req.body)
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:slug', (req, res) => {
  try {
    const post = updatePost(req.params.slug, req.body)
    res.json(post)
  } catch (err) {
    // "文章不存在" 是 404（语义正确），"解析/写入失败" 是 500（不是坏数据）
    const isMissing = /文章不存在/.test(err.message || '')
    res.status(isMissing ? 404 : 500).json({ error: err.message })
  }
})

router.delete('/:slug', (req, res) => {
  try {
    const result = deletePost(req.params.slug)
    res.json(result)
  } catch (err) {
    const isMissing = /文章不存在/.test(err.message || '')
    res.status(isMissing ? 404 : 500).json({ error: err.message })
  }
})

export default router
