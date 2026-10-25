<template>
  <section class="home-entrance">
    <transition name="power-on">
      <div v-if="isPreviewOpen" class="preview-overlay" @click.self="closePreview">
        <div class="preview-card">
          <button class="preview-close" type="button" @click="closePreview" aria-label="閉じる">×</button>
          <img class="preview-image" :src="previewImageSrc" alt="拡大プレビュー" />
          <div class="preview-scanline" aria-hidden="true"></div>
        </div>
      </div>
    </transition>

    <div class="welcome-shell">
      <div class="display-grid">
        <div class="welcome-copy">
          <p class="eyebrow">Welcome to My Room</p>
          <p class="lead">
                        ここは、ちょっとだけ遊びに来た感じの部屋です。
          </p>
        </div>

        <div class="clock-badge" role="status" aria-live="polite">
          <span class="clock-label">Clock</span>
          <strong class="clock-time">{{ clockText }}</strong>
          <span class="clock-sub">{{ clockDateText }}</span>
        </div>
      </div>
      <div class="monitor-frame">
        <button class="monitor-trigger" type="button" @click="openPreview" aria-label="画像を拡大して表示">
          <span class="trigger-dot"></span>
          <span class="trigger-label">open</span>
        </button>

        <div ref="monitorScreenRef" class="monitor-screen">
          <div ref="monitorImageRef" class="monitor-image-layer" :style="monitorImageStyle" aria-hidden="true">
            <div class="monitor-boot-layer" :class="{ active: isBooting }" aria-hidden="true">
              <span class="boot-line"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

type SlideImage = {
  src: string
  position: string
}

const defaultSlidePosition = 'center 20%'

const backgroundGroups = [
  {
    name: 'morning',
    images: [
      { src: new URL('../assets/images/新年（午）.png', import.meta.url).href, position: 'center 18%' },
      { src: new URL('../assets/images/春テト.png', import.meta.url).href, position: 'center 22%' },
      { src: new URL('../assets/images/ジャージメイド.png', import.meta.url).href, position: 'center 12%' },
    ],
  },
  {
    name: 'day',
    images: [
      { src: new URL('../assets/images/3000over.png', import.meta.url).href, position: 'center 50%' },
      { src: new URL('../assets/images/ねこの日（照れ）.png', import.meta.url).href, position: 'center 10%' },
      { src: new URL('../assets/images/ポケミクエスパー.png', import.meta.url).href, position: 'center 20%' },
    ],
  },
  {
    name: 'evening',
    images: [
      { src: new URL('../assets/images/秋テト.png', import.meta.url).href, position: 'center 28%' },
      { src: new URL('../assets/images/キメラ.png', import.meta.url).href, position: 'center 10%' },
      { src: new URL('../assets/images/メズマライザー.png', import.meta.url).href, position: 'center 24%' },
    ],
  },
  {
    name: 'night',
    images: [
      { src: new URL('../assets/images/HalloWeen.png', import.meta.url).href, position: 'center 18%' },
      { src: new URL('../assets/images/Bunnys.png', import.meta.url).href, position: 'center 16%' },
      { src: new URL('../assets/images/KingTeto.png', import.meta.url).href, position: 'center 20%' },
    ],
  },
]

const backgroundGroupIndex = ref(0)
const backgroundImageIndex = ref(0)
const isPreviewOpen = ref(false)
const previewImageSrc = ref('')
const isBooting = ref(false)
const isTransitioning = ref(false)
const monitorScreenRef = ref<HTMLElement | null>(null)
const monitorImageRef = ref<HTMLElement | null>(null)
const prefersReducedMotion = ref(false)
const clockNow = ref(new Date())

let backgroundTimer: number | undefined
let clockTimer: number | undefined

const emptySlideImage: SlideImage = {
  src: '',
  position: defaultSlidePosition,
}

const currentBackgroundImage = computed<SlideImage>(() => {
  const selectedGroup = backgroundGroups[backgroundGroupIndex.value]
  return selectedGroup?.images[backgroundImageIndex.value] ?? selectedGroup?.images[0] ?? emptySlideImage
})

const monitorImageStyle = computed(() => ({
  backgroundImage: `url(${currentBackgroundImage.value.src})`,
  backgroundPosition: currentBackgroundImage.value.position,
}))

const clockText = computed(() => {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(clockNow.value)
})

const clockDateText = computed(() => {
  return new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(clockNow.value)
})

function getBackgroundGroupIndex() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 0
  if (hour >= 11 && hour < 17) return 1
  if (hour >= 17 && hour < 21) return 2
  return 3
}

function openPreview() {
  previewImageSrc.value = currentBackgroundImage.value.src
  isPreviewOpen.value = true
}

function closePreview() {
  isPreviewOpen.value = false
}

function toggleImage() {
  const selectedGroup = backgroundGroups[backgroundGroupIndex.value]
  if (!selectedGroup) return

  backgroundImageIndex.value = (backgroundImageIndex.value + 1) % selectedGroup.images.length
}

function toggleImageWithMotion() {
  if (isTransitioning.value) return

  if (prefersReducedMotion.value) {
    toggleImage()
    return
  }

  const imageLayer = monitorImageRef.value
  if (!imageLayer) {
    toggleImage()
    return
  }

  isTransitioning.value = true
  isBooting.value = true

  gsap.timeline({
    onComplete: () => {
      isTransitioning.value = false
      isBooting.value = false
    },
  })
    .to(imageLayer, {
      duration: 0.18,
      scaleY: 0.05,
      scaleX: 0.92,
      opacity: 0.92,
      filter: 'brightness(2.15) contrast(1.28)',
      ease: 'power2.in',
    })
    .add(() => {
      toggleImage()
    })
    .fromTo(
      imageLayer,
      {
        scaleY: 0.05,
        scaleX: 0.92,
        opacity: 0.95,
        filter: 'brightness(2.5) contrast(1.35) blur(1px)',
      },
      {
        duration: 0.62,
        scaleY: 1,
        scaleX: 1,
        opacity: 1,
        filter: 'brightness(1) contrast(1) blur(0px)',
        ease: 'expo.out',
      },
    )
}

function startBackgroundSlideshow() {
  backgroundGroupIndex.value = getBackgroundGroupIndex()
  backgroundImageIndex.value = 0

  if (backgroundTimer) {
    window.clearInterval(backgroundTimer)
  }

  backgroundTimer = window.setInterval(() => {
    toggleImageWithMotion()
  }, 7000)
}

onMounted(() => {
  startBackgroundSlideshow()
  clockTimer = window.setInterval(() => {
    clockNow.value = new Date()
  }, 1000)

  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onUnmounted(() => {
  if (backgroundTimer) {
    window.clearInterval(backgroundTimer)
  }
  if (clockTimer) {
    window.clearInterval(clockTimer)
  }
})
</script>

<style scoped>
.home-entrance {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.2rem 1rem 2rem;
  font-family: 'Noto Sans JP', sans-serif;
  color: #1d1d1d;
  position: relative;
  background: #faf7f5;
}

.home-entrance::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(177, 18, 38, 0.03);
  pointer-events: none;
}

.welcome-shell {
  width: min(980px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.1rem;
  position: relative;
}

.welcome-shell::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  width: min(220px, 42%);
  height: 18px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(177, 18, 38, 0.14);
  filter: blur(8px);
  pointer-events: none;
}

.monitor-frame {
  width: 100%;
  max-width: 920px;
  min-height: clamp(520px, 68vh, 690px);
  border-radius: 22px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.56);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(177, 18, 38, 0.14);
  box-shadow: 0 8px 30px rgba(177, 18, 38, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: stretch;
}

.monitor-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.28);
  pointer-events: none;
}

.monitor-frame::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -36px;
  width: 120px;
  height: 36px;
  transform: translateX(-50%);
  border-radius: 0 0 14px 14px;
  background: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.6);
  box-shadow: 0 7px 14px rgba(177, 18, 38, 0.14);
  pointer-events: none;
}

.monitor-trigger {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(177, 18, 38, 0.14);
  background: rgba(255, 255, 255, 0.86);
  color: #b11226;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(113, 57, 37, 0.12);
}

.trigger-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: #b11226;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.monitor-screen {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  align-items: stretch;
  width: 100%;
  min-height: clamp(430px, 56vh, 560px);
  padding: 1.4rem 1.4rem 1.8rem;
  border-radius: 16px;
  background-color: #fffdfd;
  border: 1px solid rgba(177, 18, 38, 0.14);
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.monitor-image-layer {
  position: absolute;
  inset: 1.4rem 1.4rem 1.8rem;
  border-radius: 14px;
  background-size: cover;
  background-repeat: no-repeat;
  will-change: transform, filter, opacity;
  transform-origin: center center;
}

.monitor-screen::before {
  content: none;
}

.monitor-boot-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: rgba(177, 18, 38, 0.06);
  mix-blend-mode: screen;
}

.monitor-boot-layer.active {
  animation: crtFlicker 0.6s linear;
}

.boot-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%) scaleX(0.1);
  background: rgba(177, 18, 38, 0.92);
  opacity: 0;
}

.monitor-boot-layer.active .boot-line {
  animation: crtLineBoot 0.6s cubic-bezier(0.2, 0.72, 0.2, 1);
}

@keyframes crtFlicker {
  0% {
    opacity: 0;
  }
  14% {
    opacity: 0.95;
  }
  22% {
    opacity: 0.2;
  }
  36% {
    opacity: 0.78;
  }
  50% {
    opacity: 0.16;
  }
  68% {
    opacity: 0.54;
  }
  100% {
    opacity: 0;
  }
}

@keyframes crtLineBoot {
  0% {
    opacity: 0;
    transform: translateY(-50%) scaleX(0.06);
    filter: blur(2px);
  }
  28% {
    opacity: 1;
    transform: translateY(-50%) scaleX(1);
    filter: blur(0);
  }
  58% {
    opacity: 0.8;
    transform: translateY(-50%) scaleX(0.94);
  }
  100% {
    opacity: 0;
    transform: translateY(-50%) scaleX(1);
  }
}

.display-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 18rem);
  align-items: stretch;
  gap: 1rem 1.25rem;
  position: relative;
  z-index: 1;
  width: min(920px, 100%);
  margin-bottom: 1rem;
}

.welcome-copy {
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 0.82rem 1rem 0.8rem 1.2rem;
  border-radius: 14px;
}

.welcome-copy::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 253, 252, 0.20);
  border: 1px solid rgba(177, 18, 38, 0.12);
  box-shadow: 0 8px 30px rgba(177, 18, 38, 0.08);
  backdrop-filter: blur(15px);
  z-index: -1;
}

.welcome-copy::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 999px;
  background: #b11226;
}

.eyebrow {
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.74rem;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: clamp(1.85rem, 3.4vw, 2.6rem);
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: #b11226;
  text-shadow: none;
  letter-spacing: 0.04em;
}

.lead {
  font-size: 0.96rem;
  line-height: 1.65;
  color: #1d1d1d;
  margin-bottom: 0.35rem;
  max-width: 34rem;
}

.clock-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  gap: 0.12rem;
  padding: 0.82rem 1rem 0.78rem;
  border-radius: 16px;
  background:
    rgb(255, 255, 255);

  margin-bottom: 0;
 
}

.clock-label {
  font-size: 0.72rem;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: #d4af37;
  opacity: 0.8;
}

.clock-time {
  font-size: 2.45rem;
  line-height: 1;
  letter-spacing: 0.1em;
  color: #098cb1;
  font-variant-numeric: tabular-nums;
  font-family: 'SFMono-Regular', 'Consolas', 'Noto Sans JP', monospace;
  /* text-shadow:
    0 0 10px rgba(255, 118, 118, 0.5),
    0 0 22px rgba(177, 18, 38, 0.3); */
}

.clock-sub {
  font-size: 0.68rem;
  margin-top: 0.02rem;
  letter-spacing: 0.12em;
  color: rgba(250, 247, 245, 0.76);
}

.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(29, 29, 29, 0.76);
  backdrop-filter: blur(10px);
}

.preview-card {
  position: relative;
  max-width: min(96vw, 1440px);
  max-height: 88vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(177, 18, 38, 0.18);
  background: rgba(255, 255, 255, 0.72);
  padding: 0.5rem;
}

.preview-image {
  max-width: 95vw;
  max-height: 84vh;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  display: block;
  box-shadow: 0 10px 50px rgba(177, 18, 38, 0.18);
}

.preview-scanline {
  position: absolute;
  inset: 0.5rem;
  pointer-events: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  mix-blend-mode: soft-light;
  opacity: 0.16;
}

.power-on-enter-active {
  transition: opacity 0.4s ease;
}

.power-on-leave-active {
  transition: opacity 0.22s ease;
}

.power-on-enter-from,
.power-on-leave-to {
  opacity: 0;
}

.power-on-enter-active .preview-card {
  animation: monitorBoot 0.62s cubic-bezier(0.18, 0.86, 0.18, 1) both;
}

.power-on-enter-active .preview-image {
  animation: imageBoot 0.68s ease-out both;
}

.power-on-enter-active .preview-scanline {
  animation: scanFlash 0.68s ease-out both;
}

@keyframes monitorBoot {
  0% {
    opacity: 0;
    transform: scaleY(0.02) scaleX(0.92);
    filter: brightness(2.1) contrast(1.3);
  }
  38% {
    opacity: 1;
    transform: scaleY(0.06) scaleX(0.98);
    filter: brightness(2.5) contrast(1.35);
  }
  72% {
    transform: scaleY(1.03) scaleX(1.01);
    filter: brightness(1.12) contrast(1.05);
  }
  100% {
    opacity: 1;
    transform: scaleY(1) scaleX(1);
    filter: brightness(1) contrast(1);
  }
}

@keyframes imageBoot {
  0% {
    opacity: 0;
    filter: blur(8px) brightness(2.2) saturate(0.5);
  }
  48% {
    opacity: 0.85;
    filter: blur(2px) brightness(1.4) saturate(1.12);
  }
  100% {
    opacity: 1;
    filter: blur(0) brightness(1) saturate(1);
  }
}

@keyframes scanFlash {
  0% {
    opacity: 0.58;
    transform: translateY(-6%);
  }
  100% {
    opacity: 0.16;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .power-on-enter-active,
  .power-on-leave-active {
    transition: none;
  }

  .monitor-boot-layer.active,
  .monitor-boot-layer.active .boot-line {
    animation: none;
  }

  .monitor-image-layer {
    transition: none !important;
    animation: none !important;
  }

  .power-on-enter-active .preview-card,
  .power-on-enter-active .preview-image,
  .power-on-enter-active .preview-scanline {
    animation: none;
  }
}

.preview-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: 2.4rem;
  height: 2.4rem;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #b11226;
  font-size: 1.2rem;
  cursor: pointer;
}

@media (max-width: 767px) {
  .home-entrance {
    padding-top: 0.75rem;
  }

  .welcome-shell {
    padding: 0.75rem;
  }

  .welcome-shell {
    gap: 0.9rem;
  }

  .welcome-shell::after {
    bottom: -14px;
    height: 12px;
  }

  .monitor-frame {
    min-height: clamp(460px, 72vh, 620px);
    padding: 0.8rem;
    border-radius: 22px;
  }

  .monitor-trigger {
    top: 0.75rem;
    right: 0.75rem;
  }

  .monitor-screen {
    min-height: clamp(360px, 56vh, 500px);
    padding: 1rem;
  }

  .display-grid {
    width: 100%;
    grid-template-columns: 1fr;
    margin-bottom: 0.25rem;
  }

  .welcome-copy {
    width: 100%;
    padding: 0.9rem 0.95rem;
    min-height: auto;
  }

  .clock-badge {
    width: 100%;
    min-height: auto;
    padding: 0.95rem 1rem 0.9rem;
  }

  .clock-time {
    font-size: 2.35rem;
  }
}
</style>
