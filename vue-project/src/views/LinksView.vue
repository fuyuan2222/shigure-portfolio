<template>
  <section class="page-shell">
    <div class="page-card">
      <div class="content-grid">
        <div class="copy-block">
          <p class="eyebrow">Links</p>
          <h1>リンク集</h1>
          <p class="lead">部屋の中に置いてあるものみたいな、ちょっとだけゆるいリンクです。</p>
          <div class="link-list">
            <a href="https://marshmallow-qa.com/rinky_creater" target="_blank" rel="noopener noreferrer">Marshmallow</a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div class="shape-block" aria-hidden="true">
          <div class="shape-dot"></div>
          <div class="shape-pill"></div>
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
  background: #fafaf8;
  color: #1a1a1a;
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
  margin-bottom: 0.6rem;
  color: #b11226;
}

.lead {
  margin-bottom: 1rem;
  color: #1d1d1d;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.link-list a {
  color: #b11226;
  font-weight: 600;
  text-decoration: none;
  padding: 0.7rem 0.9rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  width: fit-content;
}

.link-list a:hover {
  background: #b11226;
  color: #faf7f5;
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

.shape-dot {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: #77c8c5;
  position: absolute;
  top: 32px;
  left: 42px;
}

.shape-pill {
  width: 150px;
  height: 54px;
  border-radius: 999px;
  background: #d4af37;
  position: absolute;
  right: 32px;
  bottom: 34px;
}

@media (max-width: 767px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
