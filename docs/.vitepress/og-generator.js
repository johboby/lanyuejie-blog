/**
 * OG Image Generator — SVG-based Open Graph images
 *
 * Generates 1200x630 SVG OG images for each article at build time.
 * SVG OG images are lightweight, zero-dependency, and supported by all major platforms.
 *
 * Usage: import { generateOGImages } from './og-generator.js'
 * Call in config.js buildEnd hook.
 */
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const WIDTH = 1200
const HEIGHT = 630

// Design tokens aligned with site theme
const BRAND_COLOR = '#1f4f42'
const BRAND_COLOR_DARK = '#5ab89e'
const BG_COLOR = '#faf9f6'
const TEXT_COLOR = '#1a1a1a'
const SUBTEXT_COLOR = '#555'
const ACCENT_COLOR = '#c9a227'

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function truncateText(text, maxLen) {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '…'
}

/**
 * Generate an SVG OG image for a single article
 */
export function generateOGImage(title, siteName = '揽月界科技', isHome = false) {
  const displayTitle = isHome ? 'AI & 风险研究' : truncateText(title, 60)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG_COLOR}"/>
  <rect y="0" width="${WIDTH}" height="6" fill="${BRAND_COLOR}"/>
  <rect y="6" width="${WIDTH}" height="1" fill="${BRAND_COLOR_DARK}" opacity="0.3"/>
  <text x="60" y="340" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="900" fill="${TEXT_COLOR}" letter-spacing="-0.02em">${escapeXml(displayTitle)}</text>
  <text x="60" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="${SUBTEXT_COLOR}">${escapeXml(siteName)}</text>
  <circle cx="1060" cy="310" r="80" fill="${BRAND_COLOR}" opacity="0.08"/>
  <circle cx="1100" cy="200" r="40" fill="${ACCENT_COLOR}" opacity="0.1"/>
  <rect x="60" y="590" width="${WIDTH - 120}" height="1" fill="${BRAND_COLOR}" opacity="0.15"/>
  <text x="60" y="610" font-family="system-ui, sans-serif" font-size="16" fill="${SUBTEXT_COLOR}" opacity="0.6">${escapeXml(siteName)}</text>
</svg>`

  return svg
}

/**
 * Generate OG images for all articles and save to public/images/og/
 * @param {Array} posts - Array of post objects with frontmatter
 * @param {string} outDir - Output directory (public/images/og/)
 * @param {string} siteName - Site name for branding
 */
export function generateOGImages(posts, outDir, siteName = '揽月界科技') {
  mkdirSync(outDir, { recursive: true })

  const results = []

  for (const post of posts) {
    const slug = post.url.replace('/posts/', '').replace(/\/$/, '').replace('.html', '')
    const title = post.frontmatter?.title || slug
    const svg = generateOGImage(title, siteName)
    const filePath = resolve(outDir, `${slug}.svg`)
    writeFileSync(filePath, svg, 'utf-8')
    results.push({ slug, title, path: `/images/og/${slug}.svg` })
  }

  return results
}

/**
 * Generate the home page OG image
 */
export function generateHomeOGImage(siteName = '揽月界科技') {
  const svg = generateOGImage('', siteName, true)
  return svg
}
