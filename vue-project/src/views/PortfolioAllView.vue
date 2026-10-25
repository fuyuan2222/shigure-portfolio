<template>
  <section class="portfolio-all">
    <div class="container">
      <div class="page-intro">
        <p class="eyebrow">Gallery</p>
        <h1>作品ギャラリー</h1>
        <p class="intro-copy">{{ guideText }}</p>
      </div>

      <div class="category-tabs" role="tablist" aria-label="gallery categories">
        <button
          v-for="category in categories"
          :key="category"
          class="category-tab"
          :class="{ active: currentCategory === category }"
          @click="currentCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="gallery-grid">
        <article
          v-for="(work, index) in filteredWorks"
          :key="index"
          class="gallery-card"
          @click="openLightbox(work)"
        >
          <img class="gallery-preview" :src="getAssetUrl(work.src)" :alt="work.title" loading="lazy" />
        </article>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <transition name="fade">
      <div v-if="selectedWork" class="lightbox-overlay" @click="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox" aria-label="閉じる">&times;</button>

        <div class="lightbox-content" @click.stop>
          <img :src="getAssetUrl(selectedWork.src)" :alt="selectedWork.title" class="lightbox-img" />
          <div class="lightbox-caption">
            <h4>{{ selectedWork.title }}</h4>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const selectedWork = ref<null | { src: string; title: string; description: string }>(null)
const currentCategory = ref('All')
const categories = ['All', 'Illustration', 'FanArt', 'Original', 'Animation']
const guideText = computed(() => {
  if (currentCategory.value === 'All') return '作品を見て、好きな雰囲気を探してね。'
  if (currentCategory.value === 'FanArt') return 'ファンアートはこっちに集めてるよ。'
  if (currentCategory.value === 'Animation') return '動きのある作品はこちら。'
  return '気になる作品を選んでみて。'
})

const getAssetUrl = (src: string) => src

const openLightbox = (work: any) => {
  selectedWork.value = work
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedWork.value = null
  document.body.style.overflow = ''
}

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedWork.value) {
    closeLightbox()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})

const images = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,webp,gif,avif}', { eager: true, import: 'default' })

const works = Object.keys(images).map((path) => {
  const fileName = path.split('/').pop()?.replace(/\.[^.]+$/, '') || 'No Title'
  if (fileName === 'logo') return null
  const category = /Fan|fan|FA|テト|キメラ|メズ|Teto|Teto/i.test(fileName)
    ? 'FanArt'
    : /Animation|anim|motion|gif/i.test(fileName)
      ? 'Animation'
      : /Original|orig|オリジナル/i.test(fileName)
        ? 'Original'
        : 'Illustration'

  return {
    src: images[path] as string,
    title: fileName,
    category,
  }
}).filter((work): work is { src: string; title: string; category: string } => work !== null)

const filteredWorks = computed(() => {
  if (currentCategory.value === 'All') return works
  return works.filter((work) => work.category === currentCategory.value)
})
</script>

<style scoped>
.portfolio-all {
  min-height: 100vh;
  padding: 1rem 1.2rem 3rem;
  background: #ffffff;
  color: #1d1d1d;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.page-intro {
  margin: 0.4rem 0 1.2rem;
}

.eyebrow {
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #d4af37;
  margin-bottom: 0.35rem;
}

h1 {
  margin: 0;
  color: #b11226;
  font-size: clamp(1.4rem, 2.2vw, 1.9rem);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0 0 1.1rem;
}

.category-tab {
  border: 1px solid rgba(177, 18, 38, 0.14);
  background: rgba(255, 255, 255, 0.82);
  color: #b11226;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.category-tab.active {
  background: #b11226;
  color: #fafaf8;
  box-shadow: 0 8px 18px rgba(177, 18, 38, 0.12);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.gallery-card {
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 30px rgba(177, 18, 38, 0.08);
  cursor: pointer;
  transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
  aspect-ratio: 1 / 1.02;
  transform-origin: center bottom;
}

.gallery-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 14px 28px rgba(177, 18, 38, 0.1);
}

.gallery-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: #faf7f5;
}

.gallery-card-footer {
  display: none;
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(29, 29, 29, 0.92);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.lightbox-content {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-img {
  max-width: 95vw;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
}

.lightbox-caption {
  margin-top: 16px;
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 12px;
  right: 20px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 3rem;
  cursor: pointer;
  line-height: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .category-tabs {
    gap: 0.5rem;
  }
}
</style>