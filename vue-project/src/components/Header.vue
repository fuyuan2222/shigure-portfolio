<template>
  <header class="site-header bg-dark text-white py-5" id="contact-header">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h2 class="section-title text-white">Contact</h2>
          <p>質問・リクエストなど</p>
          <div class="contact-box p-4 rounded-4 mt-4">
            <p class="mb-2"><strong>マシュマロ：</strong><a href="https://marshmallow-qa.com/rinky_creater" target="_blank" rel="noopener noreferrer">marshmallow-qa.com/rinky_creater</a></p>
            <p class="mb-2"><strong>SNS：</strong>@yourname</p>
            <p class="mb-0"><strong>対応可能：</strong>商用利用 / 納期調整 / リテイク</p>
          </div>
        </div>
        <div class="col-lg-6 mt-4 mt-lg-0">
          <div class="card p-4 text-dark">
            <h3 class="h5 mb-3">今すぐ相談する</h3>
            <p>
              作品イメージや制作内容をお送りいただければ、
              お見積もりと納期をご案内します。
            </p>
            <a href="mailto:example@example.com" class="btn btn-primary mt-3">メールを送る</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Header only contains static contact info moved from ContactSection
</script>

<style scoped>
.contact-box {
  background: rgba(255, 255, 255, 0.14);
}
</style>
