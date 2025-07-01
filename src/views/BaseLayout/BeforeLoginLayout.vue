<script setup>
import FooterSection from '@/components/navbarAndFooter/FooterSection.vue';
</script>
<template>
  <div class="bg-primary-gradient min-h-screen bg-top bg-repeat">
    <!-- 確認權限，放nav -->
    <div class="container">
      <a
        href="#C"
        class="a11y-focus bg-primary-500 sr-only -top-[3.75rem] left-[0.75rem] rounded-br-lg p-4 text-white transition-all focus:not-sr-only focus:absolute focus:top-[0rem] focus:p-4"
        title="跳到主要內容區塊"
        tabindex="1"
        >跳到主要內容區塊</a
      >
    </div>
    <div class="py-4">
      <router-view />
    </div>
    <FooterSection />
  </div>
</template>
