import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '鎻芥湀鐣岀鎶€',
  description: '涓撴敞浜庝汉宸ユ櫤鑳戒笌椋庨櫓鎺у埗鐨勫墠娌跨鎶€浼佷笟 鈥?鍙岀簿涓ゅ噺锛氱簿鍑嗚瘑鍒风簿缁嗙鐞喡峰噺鎹熷鏁埪峰噺鐏鹃槻鐏?,
  base: '/lanyuejie-blog/',
  cleanUrls: true,
  lastUpdated: true,

  vite: {
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
  ],

  themeConfig: {
    nav: [
      { text: '棣栭〉', link: '/' },
      { text: '鏂囩珷', link: '/posts/' },
      { text: '鍒嗙被', link: '/categories/' },
      { text: '鍏充簬', link: '/about' },
    ],

    sidebar: {
      '/posts/': [
        {
          text: '鏂囩珷鍒楄〃',
          items: [],
        },
      ],
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '鎼滅储', buttonAriaLabel: '鎼滅储' },
              modal: {
                noResultsText: '鏃犳硶鎵惧埌鐩稿叧缁撴灉',
                resetButtonTitle: '娓呴櫎鏌ヨ鏉′欢',
                footer: { selectText: '閫夋嫨', navigateText: '鍒囨崲', closeText: '鍏抽棴' },
              },
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
      { icon: 'linkedin', link: 'https://www.cycu.top' },
    ],

    outline: {
      label: '椤甸潰瀵艰埅',
      level: [2, 3],
    },

    docFooter: {
      prev: '涓婁竴绡?,
      next: '涓嬩竴绡?,
    },

    lastUpdated: {
      text: '鏈€鍚庢洿鏂颁簬',
    },

    returnToTopLabel: '鍥炲埌椤堕儴',
    sidebarMenuLabel: '鑿滃崟',
    darkModeSwitchLabel: '涓婚',
    lightModeSwitchTitle: '鍒囨崲鍒版祬鑹叉ā寮?,
    darkModeSwitchTitle: '鍒囨崲鍒版繁鑹叉ā寮?,
  },
})
