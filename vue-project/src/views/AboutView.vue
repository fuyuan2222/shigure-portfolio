<template>
  <section class="page-shell">
    <div class="page-card">
      <div class="content-grid">
        <div class="copy-block">
          <p class="eyebrow">About</p>
          <h1>このサイトについて</h1>
          <p>
            ここは、イラストを見せるための“部屋”です。<br />
            ただのポートフォリオではなく、少しだけキャラクターの気配がある場所を目指しています。
          </p>

          <div class="info-grid">
            <div class="info-card">
              <h2>好き</h2>
              <p>ゆるい雰囲気、かわいい線、少しだけ不思議な空気。</p>
            </div>
            <div class="info-card">
              <h2>嫌い</h2>
              <p>無機質な見せ方、説明の多さ、必要以上にきれいすぎる空気。</p>
            </div>
            <div class="info-card">
              <h2>制作環境</h2>
              <p>CLIP STUDIO PAINT / Photoshop / Blender などで制作。</p>
            </div>
            <div class="info-card">
              <h2>Q&A</h2>
              <p>「制作時間は？」→ かなりバラバラです。</p>
            </div>
          </div>
        </div>

        <div class="shape-block" aria-hidden="true">
          <div class="shape-circle"></div>
          <div class="shape-rect"></div>
          <div class="shape-star"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #ffffff;
  color: #5d2a24;
}

.page-card {
  width: min(900px, 100%);
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(177, 18, 38, 0.12);
  box-shadow: 0 8px 30px rgba(177, 18, 38, 0.08);
}

.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.2rem;
  align-items: center;
}

.eyebrow {
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #d4af37;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: #b11226;
}

p {
  line-height: 1.8;
  color: #1d1d1d;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 1rem;
}

.info-card {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(177, 18, 38, 0.12);
}

.info-card h2 {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  color: #b11226;
}

.info-card p {
  margin: 0;
  font-size: 0.92rem;
}

.shape-block {
  min-height: 220px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(177, 18, 38, 0.12);
  position: relative;
  overflow: hidden;
}

.shape-circle {
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: #77c8c5;
  position: absolute;
  top: 36px;
  left: 38px;
}

.shape-rect {
  width: 120px;
  height: 160px;
  border-radius: 24px;
  background: #d4af37;
  position: absolute;
  right: 38px;
  bottom: 28px;
}

@media (max-width: 767px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
