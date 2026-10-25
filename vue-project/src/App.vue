<template>
  <div class="app-root" :class="{ 'content-ready': !showOverlay }">
    <header v-if="!showOverlay" class="site-header">
      <div class="brand-wrap">
        <router-link to="/" class="brand" aria-label="時雨時卵の部屋">
          <img class="brand-logo" :src="logoSrc" alt="時雨時卵の部屋" />
        </router-link>
      </div>

      <nav class="nav-pills">
        <router-link to="/" class="pill" :class="{ active: route.path === '/' }">ホーム</router-link>
        <router-link to="/portfolio" class="pill" :class="{ active: route.path === '/portfolio' }">ギャラリー</router-link>
        <router-link to="/about" class="pill" :class="{ active: route.path === '/about' }">紹介</router-link>
        <router-link to="/links" class="pill" :class="{ active: route.path === '/links' }">リンク</router-link>
      </nav>
    </header>

    <div class="app-content">
      <router-view />
    </div>

    <transition name="overlay-fade">
      <div v-if="showOverlay" class="entrance-overlay" role="dialog" aria-label="サイト紹介">
        <div class="overlay-inner">
          <div class="loader-character">{{ loaderFrame }}</div>
          <div class="loader-title">時雨時卵</div>
          <div class="loader-sub">部屋に入る…</div>
        </div>
      </div>
    </transition>
<!-- 
    <div v-if="!showOverlay" class="assistant-bubble">
      <div class="assistant-face">{{ guide?.emote }}</div>
      <div class="assistant-copy">
        <strong>{{ guide?.title }}</strong>
        <p>{{ guide?.text }}</p>
      </div>
    </div> -->

    <footer v-if="!showOverlay" class="site-footer">
      <p>キャラ</p>
      <strong>「また来てね！」</strong>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'

const route = useRoute()
const showOverlay = ref(true)
const loaderFrames = ['・・・', '👀', '😊', '👋']
const loaderFrame = ref(loaderFrames[0])
let loaderTimer: number | undefined

const logoSrc = new URL('./assets/images/logo.png', import.meta.url).href

const animateShell = () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const header = document.querySelector('.site-header') as HTMLElement | null
  const pills = document.querySelectorAll('.pill') as NodeListOf<HTMLElement>
  const tools = document.querySelectorAll('.header-chip') as NodeListOf<HTMLElement>

  if (header) {
    gsap.fromTo(header, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' })
  }

  gsap.fromTo(pills, { y: 10, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: 'back.out(1.6)' })
  gsap.fromTo(tools, { y: 10, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.05, ease: 'back.out(1.6)' })
}

onMounted(() => {
  let frameIndex = 0
  loaderTimer = window.setInterval(() => {
    frameIndex = (frameIndex + 1) % loaderFrames.length
    loaderFrame.value = loaderFrames[frameIndex]
  }, 280)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const delay = prefersReduced ? 250 : 1200
  setTimeout(() => {
    showOverlay.value = false
  }, delay)
})

watch(showOverlay, (isVisible) => {
  if (!isVisible) {
    nextTick(() => {
      animateShell()
    })
  }
})

onBeforeUnmount(() => {
  if (loaderTimer) window.clearInterval(loaderTimer)
})
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Noto Sans JP', sans-serif;
  background: #faf7f5;
}

.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #faf7f5;
  color: #1d1d1d;
  transition: background 0.25s ease, color 0.25s ease;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.95rem 1.25rem;
  backdrop-filter: blur(10px);
  background: rgba(255, 253, 252, 0.9);
  border-bottom: 1px solid rgba(177, 18, 38, 0.18);
  box-shadow: 0 4px 18px rgba(177, 18, 38, 0.08);
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  color: #b11226;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.brand-logo {
  display: block;
  width: auto;
  height: 5rem;
  object-fit: contain;
}

.header-tools {
  display: flex;
  gap: 0.4rem;
}

.header-chip {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 0.62rem;
  background: #ffffff;
  color: #b11226;
  cursor: pointer;
}

.nav-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.95rem;
  border-radius: 999px;
  text-decoration: none;
  color: #b11226;
  background: #ffffff;
  border: 1px solid rgba(177, 18, 38, 0.14);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.pill:hover,
.pill.active {
  background: #b11226;
  color: #fff;
  transform: translateY(-1px);
}

.app-content {
  flex: 1;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 520ms ease, transform 520ms ease;
}

.content-ready .app-content {
  opacity: 1;
  transform: translateY(0);
}

.entrance-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf7f5;
  z-index: 1050;
  backdrop-filter: blur(2px);
}

.overlay-inner {
  text-align: center;
  color: #b11226;
  transform: translateY(0) scale(1);
}

.loader-character {
  font-size: 3.2rem;
  margin-bottom: 0.35rem;
}

.loader-title {
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.loader-sub {
  margin-top: 0.35rem;
  font-size: 0.95rem;
  opacity: 0.8;
}

.overlay-fade-enter-active {
  animation: overlayIn 700ms cubic-bezier(.2,.9,.3,1) both;
}

.overlay-fade-leave-active {
  animation: overlayOut 700ms cubic-bezier(.2,.9,.3,1) both;
}

@keyframes overlayIn {
  0% { opacity: 0; transform: scale(0.98) translateY(6px); }
  60% { opacity: 1; transform: scale(1.02) translateY(-6px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes overlayOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.98) translateY(-8px); }
}

.assistant-bubble {
  position: fixed;
  right: 1rem;
  bottom: 5.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  max-width: min(280px, calc(100vw - 2rem));
  padding: 0.8rem 0.9rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 30px rgba(177, 18, 38, 0.08);
  border: 1px solid rgba(177, 18, 38, 0.14);
  z-index: 999;
}

.assistant-face {
  font-size: 1.3rem;
}

.assistant-copy strong {
  display: block;
  margin-bottom: 0.2rem;
  color: #b11226;
}

.assistant-copy p {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
}

.site-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.2rem 1.5rem;
  font-size: 0.95rem;
  color: #1d1d1d;
}

@media (max-width: 767px) {
  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-wrap {
    width: 100%;
    justify-content: space-between;
  }

  .nav-pills {
    width: 100%;
  }

  .assistant-bubble {
    right: 0.75rem;
    left: 0.75rem;
    max-width: none;
    bottom: 4.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .overlay-fade-enter-active,
  .overlay-fade-leave-active,
  .app-content {
    transition: none !important;
    animation: none !important;
  }

  .app-content {
    opacity: 1;
    transform: none;
  }
}
</style>
