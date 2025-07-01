<script setup>
import { computed } from 'vue';
import { useIsDesktop } from '@/composables/device/useIsDesktop';

const props = defineProps({
  deskPosition: {
    type: String,
    default: 'bottom' // 支援 top、bottom、left、right
  },
  mobilePosition: {
    type: String,
    default: 'left' // 支援 top、bottom、left、right
  },
  bgClass: {
    type: String,
    default: 'bg-gray-700'
  },
  textClass: {
    type: String,
    default: 'text-white'
  },
  transitionClass: {
    type: String,
    default: 'transition duration-200'
  }
});

const { isDesktop } = useIsDesktop();

// 根據 isDesktop 決定 tooltip 顯示位置
const actualPosition = computed(() => {
  return isDesktop.value ? props.deskPosition : props.mobilePosition;
});

const getPositionClasses = () => {
  switch (actualPosition.value) {
    case 'top':
      return 'bottom-full left-1/2 -translate-x-1/2';
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2';
    case 'left':
      return 'right-full -translate-y-6 mr-2';
    case 'right':
      return 'left-full -translate-y-6 ml-2';
    default:
      return 'top-full';
  }
};
</script>

<template>
  <div class="group">
    <div
      class="absolute z-10 w-max max-w-[200px] scale-0 transform rounded px-2 py-1 text-base shadow group-hover:scale-100 group-focus:scale-100"
      :class="[getPositionClasses(), bgClass, textClass, transitionClass]"
    >
      <slot />
    </div>
  </div>
</template>
