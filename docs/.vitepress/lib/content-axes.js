// 首页分类卡片与文章归档页共用的「内容轴」聚类规则。
//
// 为什么不用 categories / tags 直接分组：全站 117 篇文章的 categories 有 80+ 种
// （最多的「研究」有 38 篇），tags 有 720 个唯一值，没有任何一个能代表内容方向。
// 等值匹配统计出来的数字对读者没有意义，所以改用内容域关键词对
// 「标题 + 摘要 + 标签 + 分类」做聚类。
//
// 首页卡片上的「N 篇」与归档页按轴筛选后的条数来自同一个函数，两边数字永远一致。

export const CONTENT_AXES = [
  {
    key: 'AI',
    slug: 'ai',
    label: 'AI 前沿',
    glyph: 'AI',
    keywords: ['ai', '人工智能', '大模型', '大语言模型', 'llm', '智能体', 'agent', '具身', '机器人',
      '芯片', '算力', '深度学习', '神经网络', '多模态', '生成式', 'claude', 'gpt', 'deepseek',
      'prompt', 'rag', 'mcp', '自动驾驶', '算法', '编程', '世界模型', '扩散模型']
  },
  {
    key: '行业',
    slug: 'industry',
    label: '行业洞察',
    glyph: '行业',
    keywords: ['行业分析', '行业观察', '行业新闻', '行业展望', '产业研究', '市场', '竞争格局',
      '商业模式', '经济', '政策', '供应链', '趋势']
  },
  {
    key: '深度',
    slug: 'deep',
    label: '深度解析',
    glyph: '深度',
    keywords: ['深度分析', '深度思考', '深度复盘', '深度调查', '深度长文', '研究综述', '技术原理',
      '深度', '综述', '复盘', '机制', '架构']
  },
  {
    key: '工具',
    slug: 'tool',
    label: '效率实战',
    glyph: '工具',
    keywords: ['工具', '生产力', '效率', '工作流', '实战', '教程', '上手', '推荐', '脚本', '插件', '方法论']
  }
]

// 首页卡片 / 归档页筛选共用同一套 URL 参数，避免两边各写一套 key
export const AXIS_QUERY = 'axis'

// 纯 ASCII 关键词按「词首边界」匹配，避免 trained / paragraph / email 等误命中；
// 中文关键词直接子串匹配。
export function hitAxis(text, word) {
  if (/^[\x00-\x7F]+$/.test(word)) {
    return new RegExp(`(^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(text)
  }
  return text.includes(word)
}

function toArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value).split(/[,/]/).map((s) => s.trim()).filter(Boolean)
}

export function axisText(post) {
  if (!post) return ''
  return [
    post.title,
    post.description,
    post.excerpt,
    ...toArray(post.tags),
    ...toArray(post.categories)
  ].filter(Boolean).join(' ').toLowerCase()
}

// 返回一篇文章命中的所有内容轴（可能同时命中多个）
export function matchAxes(post) {
  const text = axisText(post)
  if (!text) return []
  return CONTENT_AXES.filter((axis) => axis.keywords.some((w) => hitAxis(text, w))).map((a) => a.key)
}

export function findAxis(key) {
  return CONTENT_AXES.find((axis) => axis.key === key) || null
}

// 归档页深链（不含 base，调用方负责 withBase）
export function axisHref(key) {
  return `/posts/?${AXIS_QUERY}=${encodeURIComponent(key)}`
}

// 各内容轴的文章数
export function countByAxis(posts) {
  const counts = {}
  CONTENT_AXES.forEach((axis) => { counts[axis.key] = 0 })
  ;(posts || []).forEach((post) => {
    matchAxes(post).forEach((key) => { counts[key]++ })
  })
  return counts
}
