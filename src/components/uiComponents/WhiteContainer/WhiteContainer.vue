<script setup>
// import { computed } from 'vue';
// import { useRoute } from 'vue-router';
import BreadCrumb from '@/components/uiComponents/BreadCrumb/BreadCrumb.vue';

// const route = useRoute();

// const showNavbar = computed(() => {
//   // 檢查當前路由是否為首頁
//   return route.path !== '/register';
// });
</script>

<template>
  <div class="rounded-md bg-white px-8 py-7 xl:px-6 2xl:px-8">
    <!-- <BreadCrumb v-if="showNavbar"></BreadCrumb> -->
    <BreadCrumb></BreadCrumb>
    <slot />
  </div>
</template>
