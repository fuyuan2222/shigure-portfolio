<template>
  <section class="container py-5 about-with-video" id="about">
    <div class="row align-items-start gap-3">
      <div class="col-12 col-lg-6">
        <h2 class="section-title mt-lg-0 mt-4">About</h2>
        <p>
         テトさんを中心に、ボカロFAやかわいい子を描いています！</p>
        <p>タイムラプス動画もYouTubeで公開中。</p>
        
        <ul class="list-unstyled mt-4">
          <li>・イラスト制作（個人・企業向け）</li>
          <li>・キャラクターデザイン</li>
          <li>・SNS用アイコン／ヘッダー</li>
          <li>・イベント・展示会用ビジュアル</li>
        </ul>
      </div>
      <div class="col-12 col-lg-6">
        <div class="video-carousel-wrapper">
          <div class="video-column d-flex flex-column gap-3">
            <div
              v-for="(video, i) in videos"
              :key="video.id"
              class="video-card p-2"
              :class="{ 'active': currentVideoIndex === i }"
            >
              <div class="video-frame ratio-9x16">
                <iframe
                  :id="`yt-player-${i}`"
                  :src="video.embed"
                  frameborder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                  :title="`highlight ${i + 1}`"
                ></iframe>
                <a class="overlay-link" :href="video.url" target="_blank" rel="noopener noreferrer" :aria-label="`Open video ${i + 1} on YouTube`"></a>
              </div>
            </div>
          </div>
          
          <!-- Navigation button -->
          <button class="video-nav-btn" @click="nextVideo" aria-label="Next video" title="Next video">
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentVideoIndex = ref(0)
const players = ref<any[]>([])

const videos = [
  {
    id: 'JBGfooRPfOE',
    url: 'https://youtube.com/shorts/JBGfooRPfOE?si=wFKBvEprETeVOxYU',
    embed: 'https://www.youtube.com/embed/JBGfooRPfOE?rel=0&autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&enablejsapi=1'
  },
  {
    id: 'gjAs9p_MV4s',
    url: 'https://youtube.com/shorts/gjAs9p_MV4s?si=w6KO_mYDnqlc_Qkw',
    embed: 'https://www.youtube.com/embed/gjAs9p_MV4s?rel=0&autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&enablejsapi=1'
  }
]

onMounted(() => {
  loadYouTubeAPI()
})

function loadYouTubeAPI() {
  if ((window as any).YT && (window as any).YT.Player) {
    initPlayers()
  } else {
    const tag = document.createElement('script') as HTMLScriptElement
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    const body = document.body
    if (body) {
      body.appendChild(tag)
    }
    
    (window as any).onYouTubeIframeAPIReady = () => {
      initPlayers()
    }
  }
}

function initPlayers() {
  videos.forEach((video, index) => {
    const player = new (window as any).YT.Player(`yt-player-${index}`, {
      events: {
        onStateChange: (event: any) => onPlayerStateChange(event, index)
      }
    })
    players.value[index] = player
  })
}

function onPlayerStateChange(event: any, index: number) {
  // 0 = ENDED, 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING, 5 = CUED
  if (event.data === 0) {
    // Video ended, switch to next
    currentVideoIndex.value = (currentVideoIndex.value + 1) % videos.length
    // Auto-play next video after brief delay
    setTimeout(() => {
      if (players.value[currentVideoIndex.value]) {
        players.value[currentVideoIndex.value].playVideo()
      }
    }, 300)
  }
}

function nextVideo() {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % videos.length
  // Play the next video
  setTimeout(() => {
    if (players.value[currentVideoIndex.value]) {
      players.value[currentVideoIndex.value].playVideo()
    }
  }, 100)
}
</script>

<style scoped>
/* Background video layer for About */
.about-with-video { position: relative; overflow: hidden; }
.about-with-video > .row { position: relative; z-index: 2; }

@media (max-width: 991px) {
  .about-with-video .video-bg iframe { display: none; }
}

/* Respect reduced motion: hide background video */
@media (prefers-reduced-motion: reduce) {
  .about-with-video .video-bg { display: none; }
}

/* Styles for the embedded videos replacing activity list */
.video-carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.video-column .video-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  position: absolute;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 400ms ease, visibility 400ms ease;
  pointer-events: none;
}

.video-column .video-card.active {
  position: relative;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.video-column {
  position: relative;
  flex: 1;
}

.video-column .video-frame { position: relative; overflow: hidden; border-radius: 8px; background: #000; }
.video-column .ratio-9x16 { padding-top: 177.78%; }
.video-column iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
.video-column .overlay-link { position: absolute; inset: 0; z-index: 2; display: block; background: transparent; cursor: pointer; }

/* Navigation button on the right side */
.video-nav-btn {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  transition: all 200ms ease;
  flex-shrink: 0;
}

.video-nav-btn:hover {
  background: rgba(255,255,255,0.22);
  border-color: rgba(255,255,255,0.4);
  transform: translateX(2px);
}

.video-nav-btn:active {
  transform: translateX(0);
}

@media (max-width: 991px) {
  .video-column .video-card { box-shadow: none; }
  .video-nav-btn { width: 44px; height: 44px; font-size: 1.25rem; }
}
</style>
