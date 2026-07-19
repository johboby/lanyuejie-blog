import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '揽月界科技',
  description: '专注于人工智能与风险控制的前沿科技企业',
  base: '/lanyuejie-blog/',
  cleanUrls: false,
  lastUpdated: true,
  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://johboby.github.io/lanyuejie-blog/',
  },

  vite: {
    build: { target: 'esnext' },
    esbuild: { target: 'esnext' },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: '揽月界科技,AI风控,智能保险,畜牧业监测,双精两减,防灾减损' }],
    ['meta', { name: 'author', content: '揽月界科技' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about.html' },
    ],

    sidebar: false,

    search: {
      provider: 'local',
    },

    outline: { label: '页面导航', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
