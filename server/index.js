import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import postRoutes from './routes/posts.js'
import categoryRoutes from './routes/categories.js'
import uploadRoutes from './routes/upload.js'
import searchRoutes from './routes/search.js'
import statsRoutes from './routes/stats.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ charset: 'utf-8' }))
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/posts', postRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/stats', statsRoutes)

// 404 for unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

// Global error handler (avoid leaking stack traces)
app.use((err, _req, res, _next) => {
  console.error('[server error]', err.message)
  res.status(500).json({ error: '服务器内部错误' })
})

app.listen(PORT, () => {
  console.log(`博客管理后端已启动: http://localhost:${PORT}`)
})
