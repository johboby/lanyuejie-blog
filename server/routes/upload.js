import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(__dirname, '../uploads')
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, '../../docs/public/images')

fs.ensureDirSync(UPLOAD_DIR)
fs.ensureDirSync(PUBLIC_IMAGES_DIR)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = crypto.randomBytes(8).toString('hex') + ext
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
  },
})

const router = Router()

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '请选择文件' })

  const src = path.join(UPLOAD_DIR, req.file.filename)
  const dst = path.join(PUBLIC_IMAGES_DIR, req.file.filename)

  try {
    fs.copySync(src, dst)
  } catch {
    // ignore copy error, file still in uploads
  }

  res.json({
    url: `/images/${req.file.filename}`,
    filename: req.file.filename,
  })
})

export default router
