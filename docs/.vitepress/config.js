import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '揽月界科技',
  description: '专注于人工智能与风险控制的前沿科技企业 — 双精两减：精准识别·精细管理·减损增效·减灾防灾',
  base: '/lanyuejie-blog/',
  cleanUrls: false,
  lastUpdated: true,
  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://johboby.github.io/lanyuejie-blog/',
    lastmodDateOnly: true,
  },

  transformPageData(pageData) {
    const canonicalUrl = `https://johboby.github.io/lanyuejie-blog/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.frontmatter.title || '揽月界科技' }],
      ['meta', { property: 'og:description', content: pageData.frontmatter.description || '专注于人工智能与风险控制的前沿科技企业' }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
    )

    if (pageData.frontmatter.date) {
      pageData.frontmatter.head.push(
        ['meta', { property: 'article:published_time', content: pageData.frontmatter.date }],
      )
    }

    if (pageData.frontmatter.tags && pageData.frontmatter.tags.length) {
      pageData.frontmatter.head.push(
        ['meta', { name: 'keywords', content: pageData.frontmatter.tags.join(', ') }],
      )
    }

    if (pageData.relativePath.startsWith('posts/') && !pageData.relativePath.endsWith('index.md')) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageData.frontmatter.title || '',
        datePublished: pageData.frontmatter.date || '',
        author: { '@type': 'Organization', name: '揽月界科技' },
        publisher: { '@type': 'Organization', name: '揽月界科技', url: 'https://johboby.github.io/lanyuejie-blog/' },
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
      }
      if (pageData.frontmatter.tags) {
        schema.keywords = pageData.frontmatter.tags.join(', ')
      }
      pageData.frontmatter.head.push(
        ['script', { type: 'application/ld+json' }, JSON.stringify(schema)],
      )
    }
  },

  vite: {
    build: {
      target: 'esnext',
    },
    esbuild: {
      target: 'esnext',
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: '揽月界科技,AI风控,智能保险,畜牧业监测,双精两减,防灾减损,物理信息AI,五层脑架构' }],
    ['meta', { name: 'author', content: '揽月界科技' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'baiduspider', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '揽月界科技' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'canonical', href: 'https://johboby.github.io/lanyuejie-blog/' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '关于', link: '/about' },
    ],

    sidebar: false,

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
