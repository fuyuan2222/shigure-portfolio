<template>
  <header class="hero-section text-white text-center py-5">
    <div class="hero-slider" aria-hidden="true">
      <div class="hero-slide active">
        <div
          class="hero-slide-inner"
          :style="{ backgroundImage: `url(${slide})` }"
        />
      </div>
    </div>
    <div class="hero-overlay"></div>

    <div class="container position-relative">
      <div class="hero-deco hero-deco-left"></div>
      <div class="hero-deco hero-deco-right"></div>
      <p class="eyebrow mb-3">Hello,World！</p>
      <h1 class="display-5 fw-bold">時雨時卵の部屋</h1>
      <p class="lead mt-3 mx-auto mw-700">
        伝統的な和の美意識と豊かな表現力を融合し、
        あなたの魅力を印象的に伝えるイラストサイトです。
      </p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a href="#portfolio" class="btn btn-light btn-lg">WORKS</a>
        <a href="#contact" class="btn btn-outline-light btn-lg">OTHERS</a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const slide = new URL('../assets/images/ジャージメイド.png', import.meta.url).href
</script>

<style scoped>
.btn{
    margin-top: 160px;
}
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 82vh;
}
.hero-slider {
  position: absolute;
  inset: 0;
}
.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease;
}
.hero-slide.active {
  opacity: 1;
}
.hero-slide-inner {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 50%;
  filter: saturate(1.05) contrast(1.05) brightness(0.9);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(177, 18, 38, 0.14);
  pointer-events: none;
}
.hero-section .container {
  position: relative;
  z-index: 1;
}
.hero-deco {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  opacity: 0.35;
}
.hero-deco-left {
  top: 10%;
  left: -60px;
}
.hero-deco-right {
  bottom: 10%;
  right: -60px;
}

@media (max-width: 767px) {
  .hero-section {
    min-height: 68vh;
  }
  .hero-deco {
    display: none;
  }
}
</style>
