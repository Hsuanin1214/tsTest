<script setup>
import { RouterView } from 'vue-router';
import MeetingSideBar from '@/components/navbarAndFooter/MeetingSideBar.vue';
import FooterSection from '@/components/navbarAndFooter/FooterSection.vue';
import MainNavBar from '@/components/navbarAndFooter/MainNavBar.vue';
</script>

<template>
  <div class="bg-primary-gradient">
    <MainNavBar />

    <div class="container mb-20 flex flex-col space-y-2 py-4 lg:flex-row lg:gap-4">
      <MeetingSideBar></MeetingSideBar>
      <RouterView class="min-h-[80vh] flex-1" />
    </div>
    <FooterSection />
  </div>
</template>
