import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import postRoutes from './routes/posts.js'
import categoryRoutes from './routes/categories.js'
import uploadRoutes from './routes/upload.js'
import searchRoutes from './routes/search.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json({ charset: 'utf-8' }))
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/posts', postRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)

app.listen(PORT, () => {
  console.log(`博客管理后端已启动: http://localhost:${PORT}`)
})
