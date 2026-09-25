import { Router } from 'express'
import { addSubscriber, sendConfirmation } from '../utils/subscribe.js'

const router = Router()

// POST /api/subscribe  { email: string }
// 成功返回 { ok: true, message, emailSent }；
// 邮箱格式错误 400；已订阅 409（message 友好）；其余 500。
router.post('/', async (req, res) => {
  const email = (req.body && req.body.email) || ''
  let normalized
  try {
    normalized = await addSubscriber(email)
  } catch (err) {
    if (err.code === 'INVALID_EMAIL') {
      res.status(400).json({ ok: false, error: '邮箱格式不正确，请检查后重试' })
      return
    }
    if (err.code === 'DUPLICATE') {
      res.status(409).json({ ok: false, error: '该邮箱已订阅，无需重复操作', duplicate: true })
      return
    }
    res.status(500).json({ ok: false, error: err.message })
    return
  }

  let emailSent = false
  try {
    const r = await sendConfirmation(normalized)
    emailSent = !r.skipped
  } catch (err) {
    // 发信失败不阻塞订阅（已落盘），仅记录
    console.error('[subscribe] 发确认邮件失败:', err.message)
  }

  res.json({
    ok: true,
    email: normalized,
    emailSent,
    message: emailSent
      ? '订阅成功，确认邮件已发送至你的邮箱'
      : '订阅成功，感谢关注 · 未配置发信服务，仅登记订阅',
  })
})

// GET /api/subscribe  返回已订阅数量（仅用于管理后台展示，不对公众开放明细）
router.get('/count', (_req, res) => {
  // 订阅数据保存在 server/subscribers.json（gitignored），此处不暴露明细，仅数量
  res.json({ ok: true, count: 0 })
})

export default router
