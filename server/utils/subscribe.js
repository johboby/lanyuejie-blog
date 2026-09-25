import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SUBSCRIBERS_FILE = path.join(__dirname, '..', 'subscribers.json')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// SMTP 凭据走环境变量（不入库、不进版本库）：
//   SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS / SMTP_FROM
// 未配置时自动降级为「落盘 + 不发信」，接口仍返回 success，便于无邮件服务的环境也能收集订阅。
function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

// 邮箱格式校验（含 163 常见误用：@163.com 前缀长度限制等不做深究，仅基础校验）
function isValidEmail(email) {
  if (typeof email !== 'string' || email.length > 254 || !EMAIL_RE.test(email)) return false
  // 至少一个数字/字母组合 + 域名 TLD
  return true
}

// 去重 + 追加（O(n) 扫描即可，订阅量小）
export async function addSubscriber(email) {
  const normalized = String(email).trim().toLowerCase()
  if (!isValidEmail(normalized)) {
    const err = new Error('邮箱格式不正确')
    err.code = 'INVALID_EMAIL'
    throw err
  }
  let list = []
  try {
    if (await fs.pathExists(SUBSCRIBERS_FILE)) {
      list = (await fs.readJson(SUBSCRIBERS_FILE)) || []
    }
  } catch {
    list = []
  }
  if (!Array.isArray(list)) list = []
  if (list.some((s) => s.email === normalized)) {
    const err = new Error('该邮箱已订阅')
    err.code = 'DUPLICATE'
    throw err
  }
  list.push({ email: normalized, at: new Date().toISOString() })
  await fs.writeJson(SUBSCRIBERS_FILE, list, { spaces: 2 })
  return normalized
}

// 发送确认邮件；未配置 SMTP 时跳过（返回 skipped），不阻塞订阅流程
export async function sendConfirmation(email) {
  if (!isSmtpConfigured()) return { skipped: true, reason: 'SMTP 未配置' }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  const from = process.env.SMTP_FROM || `"揽月界科技" <${process.env.SMTP_USER}>`
  const info = await transporter.sendMail({
    from,
    to: email,
    subject: '已确认订阅 · 揽月界科技',
    text: `你好，\n\n你的订阅已成功登记：${email}\n\n你将收到 AI 与风险控制方向的最新研究更新。\n\n—— 揽月界科技`,
    html: `<p>你好，</p><p>你的订阅已成功登记：<strong>${email}</strong></p><p>你将收到 AI 与风险控制方向的最新研究更新。</p><p style="color:#888;font-size:12px;">—— 揽月界科技</p>`,
  })
  return { skipped: false, messageId: info.messageId }
}
