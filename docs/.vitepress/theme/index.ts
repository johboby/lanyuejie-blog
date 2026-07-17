import DefaultTheme from 'vitepress/theme'
import PostHeader from './components/PostHeader.vue'
import './style.css'
import { h } from 'vue'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostHeader),
    })
  },
}
