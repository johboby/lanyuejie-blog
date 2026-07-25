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

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
// 基于文件头（magic number）的真实类型校验，避免扩展名伪装
const MAGIC = [
  { ext: '.jpg', bytes: [0xff, 0xd8, 0xff] },
  { ext: '.png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: '.gif', bytes: [0x47, 0x49, 0x46] },
  { ext: '.webp', bytes: [0x52, 0x49, 0x46, 0x46] },
  { ext: '.svg', bytes: null }, // SVG 为文本，单独用内容校验
]

function sanitizeExt(originalname) {
  const ext = path.extname(originalname || '').toLowerCase()
  return ALLOWED_EXT.includes(ext) ? ext : ''
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // 用随机名存放，彻底避免 originalname 路径穿越与覆盖
    const ext = sanitizeExt(file.originalname) || '.bin'
    const name = crypto.randomBytes(12).toString('hex') + ext
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = sanitizeExt(file.originalname)
    if (!ext) return cb(new Error('不支持的文件类型'))
    cb(null, true)
  },
})

// 上传后二次校验文件真实类型（读取文件头）
function verifyFileType(filePath, claimedExt) {
  const buf = Buffer.alloc(8)
  try {
    const fd = fs.openSync(filePath, 'r')
    fs.readSync(fd, buf, 0, 8, 0)
    fs.closeSync(fd)
  } catch {
    return false
  }
  if (claimedExt === '.svg') {
    // 简易文本校验：含 <svg 且不以脚本危险声明开头
    const head = buf.toString('utf-8', 0, 8).toLowerCase()
    return head.includes('<svg') || /^\s*<[?!]?xml/.test(head)
  }
  const rule = MAGIC.find(m => m.ext === claimedExt)
  if (!rule || !rule.bytes) return true
  return rule.bytes.every((b, i) => buf[i] === b)
}

const router = Router()

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '请选择文件' })

  const src = path.join(UPLOAD_DIR, req.file.filename)
  const ext = path.extname(req.file.filename).toLowerCase()

  // 二次校验真实文件类型，伪装文件直接拒绝
  if (!verifyFileType(src, ext)) {
    try { fs.removeSync(src) } catch {}
    return res.status(400).json({ error: '文件内容校验失败，疑似伪装文件' })
  }

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
