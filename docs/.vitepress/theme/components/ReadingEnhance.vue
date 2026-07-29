<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const isPost = () => page.value?.relativePath?.startsWith('posts/') && !page.value?.relativePath?.endsWith('index.md')

const progress = ref(0)
const fontSize = ref(0) // -1 small, 0 normal, 1 large
const STORAGE_KEY = 'lyj-reading-font'

function onScroll() {
  const doc = document.documentElement
  const max = doc.scrollHeight - doc.clientHeight
  progress.value = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0
}

function applyFont() {
  const el = document.querySelector('.vp-doc')
  if (!el) return
  el.classList.remove('font-sm', 'font-lg')
  if (fontSize.value === -1) el.classList.add('font-sm')
  if (fontSize.value === 1) el.classList.add('font-lg')
}

function setFont(v) {
  fontSize.value = v
  localStorage.setItem(STORAGE_KEY, String(v))
  applyFont()
}

function cycleFont() {
  const next = fontSize.value >= 1 ? -1 : fontSize.value + 1
  setFont(next)
}

// 移动端长表格横向滚动：用带提示条的容器包裹可横向溢出的表格
function setupScrollableTables() {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return
  const tables = doc.querySelectorAll('table')
  tables.forEach(table => {
    if (table.closest('.scrollable-table')) return
    const wrap = document.createElement('div')
    wrap.className = 'scrollable-table'
    table.parentNode.insertBefore(wrap, table)
    wrap.appendChild(table)
    const hint = document.createElement('span')
    hint.className = 'scrollable-table-hint'
    hint.setAttribute('aria-hidden', 'true')
    hint.textContent = '← 左右滑动查看完整表格 →'
    wrap.appendChild(hint)
  })
  updateTableHints()
}

function updateTableHints() {
  document.querySelectorAll('.scrollable-table').forEach(wrap => {
    const table = wrap.querySelector('table')
    if (!table) return
    const overflow = table.scrollWidth - table.clientWidth > 4
    wrap.classList.toggle('can-scroll', overflow)
  })
}

onMounted(() => {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
  if (!Number.isNaN(saved)) fontSize.value = saved
  applyFont()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  window.addEventListener('resize', updateTableHints)
  onScroll()
  requestAnimationFrame(setupScrollableTables)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('resize', updateTableHints)
})

watch(() => page.value?.relativePath, () => {
  // reset progress on navigation; font persists
  progress.value = 0
  requestAnimationFrame(() => { applyFont(); onScroll(); setupScrollableTables() })
})
</script>

<template>
  <div v-if="isPost()">
    <div class="reading-bar" :class="{ visible: progress > 0 }" aria-hidden="true">
      <div class="reading-bar-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="font-toolbar" role="group" aria-label="正文字号调节">
      <button class="font-btn" :class="{ active: fontSize === -1 }" @click="setFont(-1)" aria-label="小字号">A⁻</button>
      <button class="font-btn" :class="{ active: fontSize === 0 }" @click="setFont(0)" aria-label="标准字号">A</button>
      <button class="font-btn" :class="{ active: fontSize === 1 }" @click="setFont(1)" aria-label="大字号">A⁺</button>
    </div>
  </div>
</template>

<style scoped>
.reading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100;
  background: transparent;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--motion-fast) var(--easing);
}
.reading-bar.visible { opacity: 1; }
.reading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  transition: width 80ms linear;
}
.font-toolbar {
  position: fixed;
  right: 16px;
  bottom: 24px;
  z-index: 90;
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: var(--radius-full);
  background: var(--surface-raised);
  border: 1px solid var(--vp-c-divider);
  box-shadow: var(--shadow-2);
}
.font-btn {
  min-width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-weight: 600;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--motion-fast) var(--easing);
}
.font-btn:hover { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.font-btn.active { background: var(--brand-primary); color: #fff; }
.font-btn:focus-visible { outline: 2px solid var(--brand-primary); outline-offset: 1px; }
@media (max-width: 768px) {
  /* 移到左下角，避开 VitePress 默认的右下角"返回顶部"按钮，避免重叠 */
  .font-toolbar { right: auto; left: 12px; bottom: 16px; padding: 3px; }
  .font-btn { min-width: 30px; height: 30px; }
}
</style>
