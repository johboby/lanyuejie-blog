import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  excerpt: '---',
  render: false,
})