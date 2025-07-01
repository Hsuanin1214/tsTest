<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbItems = computed(() => {
  if (typeof route.meta.breadCrumbs === 'function') {
    return route.meta.breadCrumbs(route);
  }
  return route.meta.breadCrumbs || [];
});
</script>

<template>
  <nav class="mb-2 text-base">
    <ol class="inline-flex list-none p-0">
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="flex items-center">
        <router-link
          v-if="index < breadcrumbItems.length - 1"
          :to="item.to"
          :class="{
            'text-black-100 hover:text-primary-300 font-bold transition-colors duration-300':
              breadcrumbItems.length > 2 && index > 0,
            'text-black-100 font-bold': breadcrumbItems.length <= 2 || index === 0
          }"
        >
          {{ item.text }}
        </router-link>
        <span v-else class="text-black-100 font-bold">
          {{ item.text }}
        </span>
        <span v-if="index < breadcrumbItems.length - 1">＞</span>
      </li>
    </ol>
  </nav>
</template>
