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

// 仅允许本地开发来源（管理后台在 dev 模式下经 VitePress proxy 访问时为同源）
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    // 同源请求（origin 为空，如 curl/本地直连）放行
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error('CORS 不允许的来源: ' + origin))
  },
}))

app.use(express.json({ charset: 'utf-8', limit: '1mb' }))
app.use(express.urlencoded({ extended: true, charset: 'utf-8', limit: '1mb' }))
// 静态上传目录：禁止路径穿越
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  dotfiles: 'deny',
  fallthrough: true,
}))

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
