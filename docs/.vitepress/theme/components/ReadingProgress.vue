<template>
  <div v-show="visible" class="reading-progress" :style="{ width: progress + '%' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const progress = ref(0)
const visible = ref(false)
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const el = document.documentElement
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight - el.clientHeight
    visible.value = scrollTop > 100
    progress.value = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0
    ticking = false
  })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-gold));
  z-index: 9999;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}
</style>
