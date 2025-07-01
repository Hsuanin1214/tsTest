<script setup>
import { computed } from 'vue';
import { ExclamationCircleIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  type: {
    type: String,
    default: 'info' // info | success | error | warning
  },
  message: {
    type: String,
    default: ''
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  showButton: {
    type: Boolean
  }
});

const emit = defineEmits(['close']);

const alertStyle = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-teal-500 bg-white text-secondary-600';
    case 'error':
      return 'border-error-500 bg-white text-secondary-600';
    case 'warning':
      return 'border-warning-500 bg-white text-secondary-600';
    default:
      return 'border-primary-550 bg-white text-secondary-600';
  }
});

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon;
    case 'warning':
      return ExclamationCircleIcon;
    default:
      return InformationCircleIcon;
  }
});
const iconColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-teal-300';
    case 'error':
      return 'text-error-500'; // 你可自定義此色碼
    case 'warning':
      return 'text-warning-500';
    default:
      return 'text-primary-550';
  }
});
</script>
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 遮罩，可控制是否允許點擊關閉 -->
    <div class="absolute inset-0 bg-gray-500 opacity-25" @click="props.maskClosable && emit('close')"></div>

    <!-- alert 本體 -->
    <div
      class="relative z-10 flex max-w-[90%] flex-col items-center gap-4 border-t-4 py-4 pr-8 pl-3 text-sm shadow-lg sm:max-w-lg sm:min-w-[200px]"
      :class="alertStyle"
      @click.stop
      role="alert"
    >
      <!-- Icon + 內容區 -->
      <div class="flex items-start gap-3">
        <component :is="iconComponent" class="h-6 w-6 shrink-0" :class="iconColor" />
        <div class="text-base leading-relaxed font-bold break-words whitespace-pre-wrap">
          <slot name="alertBody">
            {{ message }}
          </slot>
        </div>
      </div>

      <!-- 按鈕（可選） -->
      <button
        v-if="showButton"
        class="bg-primary-500 hover:bg-primary-600 mt-2 rounded px-4 py-2 text-white"
        @click="emit('close')"
      >
        關閉
      </button>

      <!-- 關閉按鈕（X） -->
      <button class="absolute top-2 right-3 text-2xl font-bold hover:opacity-70" @click="emit('close')">&times;</button>
    </div>
  </div>
</template>
