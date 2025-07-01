// composables/useIsDesktop.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useIsDesktop(breakpoint = 575) {
  /** 是否為桌機版版面 */
  const isDesktop = ref(false);

  const handleResize = () => {
    isDesktop.value = window.innerWidth > breakpoint;
  };

  onMounted(() => {
    handleResize(); // 初始化就判斷一次
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return { isDesktop };
}
