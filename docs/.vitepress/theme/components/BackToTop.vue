<template>
  <transition name="back-top">
    <button
      v-show="visible"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    visible.value = window.scrollY > 400
    ticking = false
  })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.back-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.25rem;
    right: 1.25rem;
    width: 40px;
    height: 40px;
  }
}
</style>
