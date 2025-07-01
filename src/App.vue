<script setup>
import DefaultAlert from '@/components/uiComponents/Alert/DefaultAlert.vue';
import { useAlertStore } from '@/stores/Alert/alertStore';

const alertStore = useAlertStore();
</script>

<template>
  <RouterView />
  <!-- 全域的 Alert，統一顯示一次即可 -->
  <DefaultAlert
    v-if="alertStore.show"
    :type="alertStore.type"
    :message="alertStore.message"
    :maskClosable="true"
    :showButton="alertStore.showButton"
    @close="alertStore.close"
  >
  </DefaultAlert>
</template>

<style>
.input-no-arrows {
  @apply appearance-none;
}

/* 或者直接添加原生 CSS 來針對特定瀏覽器移除箭頭 */
.input-no-arrows::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.input-no-arrows::-ms-expand {
  display: none;
}

/* :focus-visible {
	outline: 0.2rem dashed rgb(93, 145, 85) !important;
	outline-offset: 0.2rem;
	border-radius: 0.8rem !important;
} */
</style>
