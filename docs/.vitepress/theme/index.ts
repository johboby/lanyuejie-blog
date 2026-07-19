import DefaultTheme from 'vitepress/theme'
import PostHeader from './components/PostHeader.vue'
import './style.css'
import { h, onMounted } from 'vue'
import { useRoute } from 'vitepress'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostHeader),
      'layout': () => h(JsonLd),
    })
  },
}

const JsonLd = {
  setup() {
    const route = useRoute()
    onMounted(() => {
      const existing = document.getElementById('json-ld-org')
      if (existing) return

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'json-ld-org'
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: '揽月界科技',
        alternateName: 'Lanyuejie Technology',
        url: 'https://johboby.github.io/lanyuejie-blog/',
        description: '专注于人工智能与风险控制的前沿科技企业 — 双精两减：精准识别·精细管理·减损增效·减灾防灾',
        sameAs: ['https://www.cycu.top'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'samhoclub@163.com',
          contactType: 'customer service',
          availableLanguage: ['Chinese'],
        },
      })
      document.head.appendChild(script)
    })
    return () => null
  },
}
