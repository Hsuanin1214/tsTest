<script setup lang="ts">
import { computed } from 'vue';
import { useIsDesktop } from '@/composables/device/useIsDesktop';

// Props 型別定義
// Vue 元件的 props 的 TypeScript 型別介面
// 屬性後加上 ? 表示該屬性是 可選的（optional）
// 呼叫這個元件時，你可以不傳這個 prop， 如果拿掉"?"，就會變成元件一定要有這些props
interface Props {
  deskPosition?: 'top' | 'bottom' | 'left' | 'right';
  mobilePosition?: 'top' | 'bottom' | 'left' | 'right';
  bgClass?: string;
  textClass?: string;
  transitionClass?: string;
}

// 使用泛型定義 props
// Props 就是 泛型（Generic）
// 泛型是一種 在使用時再指定具體型別
// 泛型的語法特徵
// 用 <T> 包住型別名稱。
// defineProps<Props>() 中的 <Props> 就是傳進去的「泛型型別參數」。
const props = defineProps<Props>();

const { isDesktop } = useIsDesktop();

// 根據 isDesktop 決定 tooltip 顯示位置
//如果 props.deskPosition 有值（不是 null 或 undefined），就用它，否則預設用 'bottom'。
const actualPosition = computed(() => {
  return isDesktop.value ? (props.deskPosition ?? 'bottom') : (props.mobilePosition ?? 'left');
});

const getPositionClasses = (): string => {
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
