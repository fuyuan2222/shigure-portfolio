<template>
  <section class="portfolio-section bg-light py-5" id="portfolio">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-3">
        <div>
          <h2 class="section-title">Portfolio</h2>
          <p class="mb-0">最新の制作事例をピックアップ</p>
        </div>
        <!-- 6件より多い場合のみ「全作品を見る」ボタンを表示 -->
        <router-link v-if="hasMoreWorks" to="/portfolio" class="btn btn-outline-danger btn-lg">
          他作品を見る
        </router-link>
      </div>

      <div class="row g-3 g-md-4">
        <!-- featuredWorks（最大6件）をループで表示 -->
        <div v-for="(work, index) in featuredWorks" :key="index" class="col-12 col-sm-6 col-lg-4">
          <!-- ページ遷移ではなく、クリックで拡大表示（openLightbox）を呼び出す -->
          <article class="card h-100 shadow-sm overflow-hidden clickable-card" @click="openLightbox(work)">
            <!-- テキストを削除し、画像のみを表示。個別の位置調整も適用 -->
            <div 
              class="card-img-placeholder" 
              :style="{ 
                backgroundImage: `url(${work.src})`,
                backgroundPosition: work.position 
              }"
            ></div>
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- トップページ用のライトボックス（拡大表示）UI -->
  <Teleport to="body">
    <transition name="fade">
      <div v-if="selectedWork" class="lightbox-overlay" @click="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox" aria-label="閉じる">&times;</button>
        
        <div class="lightbox-content" @click.stop>
          <img :src="selectedWork.src" :alt="selectedWork.title" class="lightbox-img" />
          
          <div class="lightbox-caption">
            <h4 class="text-white mb-1">{{ selectedWork.title }}</h4>
            <p v-if="selectedWork.description" class="text-white-50 mb-0 small">{{ selectedWork.description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

// ==========================================
// ライトボックス（拡大表示）の機能
// ==========================================
const selectedWork = ref<null | { src: string; title: string; description?: string }>(null)

const openLightbox = (work: any) => {
  selectedWork.value = work
  document.body.style.overflow = 'hidden' // 背景スクロール防止
}

const closeLightbox = () => {
  selectedWork.value = null
  document.body.style.overflow = '' // スクロール再開
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

// ==========================================
// 画像データの取得と加工
// ==========================================
// imagesフォルダ内のすべてのpng画像をURLとして一括取得
const images = import.meta.glob('../assets/images/*.png', { eager: true, import: 'default' });

// 画像ごとの表示位置・説明文設定
const imageSettings: Record<string, { position?: string }> = {
  'メズマライザー': { position: 'center center' },
  '3000over': { position: 'center 50%' },
  'KingTeto': { position: 'right 20%' },
  'SVどや顔.ver.キメラ': { position: 'center 10%' },
  'イラスト361_222': { position: '50% 30%' },
};

// 一度すべての作品リストを作成する
const allWorks = Object.keys(images).map((path) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || 'No Title';
  const settings = imageSettings[fileName];
  
  return {
    src: images[path] as string,
    title: fileName,
    position: settings?.position || 'center top' // 設定がない場合はデフォルト
  };
});

// 表示上限を6件に設定
const DISPLAY_LIMIT = 6;

// 全作品から最初の6件だけを切り出した配列
const featuredWorks = computed(() => allWorks.slice(0, DISPLAY_LIMIT));

// 全作品数が6件より多いかどうかを判定
const hasMoreWorks = computed(() => allWorks.length > DISPLAY_LIMIT);
</script>

<style scoped>
.container {
  font-family: 'Noto Sans JP', sans-serif;
  color: black;
  text-align: center;
}

/* サムネイル画像の高さを固定 */
.card-img-placeholder {
  height: 250px;
  background-size: cover;
  transition: transform 0.5s ease;
}

/* ホバー時のリッチなアニメーション */
.clickable-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}
.clickable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,0.15)!important;
}
.clickable-card:hover .card-img-placeholder {
  transform: scale(1.05); /* 画像が少しズームする */
}

@media (min-width: 768px) {
  .card-img-placeholder {
    height: 280px;
  } 
}

/* =========================================
   ライトボックス（拡大表示）のスタイル
   ========================================= */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

.lightbox-img {
  max-width: 95vw;
  max-height: 80vh;
  object-fit: contain; /* アスペクト比を維持して全体を表示 */
  box-shadow: 0 10px 50px rgba(0,0,0,0.8);
  border-radius: 2px;
  background-color: rgba(255,255,255,0.05);
}

.lightbox-caption {
  margin-top: 15px;
  text-align: center;
  width: 100%;
  max-width: 800px;
}

.lightbox-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 3.5rem;
  font-weight: 100;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s ease;
  z-index: 10000;
}
.lightbox-close:hover {
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>