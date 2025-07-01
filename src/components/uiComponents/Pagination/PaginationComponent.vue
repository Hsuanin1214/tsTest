<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useIsDesktop } from '@/composables/device/useIsDesktop';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/solid';

const { isDesktop } = useIsDesktop();
const emit = defineEmits(['update:currentPage']);
const props = defineProps({
  pageTotal: Number,
  totalRecords: Number,
  initialPage: Number,
  resetPage: Boolean,
  previousPage: { type: [String, Number], default: '' }
});

const currentPage = ref(props.initialPage || 1);
const visiblePages = computed(() => {
  const pages = [];
  // 設定窗口大小為最小值，例如5頁或總頁數的較小者
  const midPage = isDesktop.value ? 5 : 3;
  const windowSize = Math.min(midPage, props.pageTotal);
  const halfWindow = Math.floor(windowSize / 2);

  // 計算起始和結束頁碼
  let start = currentPage.value - halfWindow;
  let end = currentPage.value + halfWindow;

  // 調整起始和結束頁碼，確保它們在合理範圍內
  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end > props.pageTotal) {
    start -= end - props.pageTotal;
    end = props.pageTotal;
  }

  // 設置頁碼列表，考慮起始或結束頁碼超出範圍的情況
  start = Math.max(start, 1);
  end = Math.min(end, props.pageTotal);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }
  return pages;
});

const setCurrentPage = page => {
  currentPage.value = page;
  emit('update:currentPage', page);
};
watch(
  () => props.resetPage,
  newValue => {
    if (newValue) {
      setCurrentPage(1);
    }
  },
  { immediate: true }
);

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    emit('update:currentPage', currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < props.pageTotal) {
    currentPage.value += 1;
    emit('update:currentPage', currentPage.value);
  }
};
const firstPage = () => {
  currentPage.value = 1;
  emit('update:currentPage', currentPage.value);
};

const lastPage = () => {
  currentPage.value = props.pageTotal;
  emit('update:currentPage', currentPage.value);
};

onMounted(async () => {
  if (props.previousPage) {
    currentPage.value = props.previousPage;
  }
});
</script>
<template>
  <div class="mt-4 md:flex md:items-center md:justify-center">
    <div class="flex flex-wrap items-center justify-center bg-white py-4 sm:mx-3 sm:p-4">
      <nav aria-label="Page navigation">
        <ul class="inline-flex">
          <li>
            <button
              @click="firstPage"
              class="focus:shadow-outline border-primary-500 text-primary-500 checked:bg-primary-700 hover:bg-primary-600 h-[40px] w-[30px] rounded-l-lg border border-r-0 bg-white py-2 transition-colors duration-150 hover:text-white focus:border-zinc-600 sm:w-[50px]"
              :disabled="currentPage === 1"
            >
              <ChevronDoubleLeftIcon class="text-primary-500 mx-auto size-5 hover:fill-white" />
            </button>
          </li>
          <li>
            <button
              @click="prevPage"
              class="focus:shadow-outline border-primary-500 text-primary-500 hover:bg-primary-600 h-[40px] w-[30px] border border-r-0 bg-white transition-colors duration-150 hover:text-white sm:w-[50px]"
              :disabled="currentPage === 1"
            >
              <ChevronLeftIcon class="text-primary-500 mx-auto size-5 hover:fill-white" />
            </button>
          </li>
          <li v-for="page in visiblePages" :key="page">
            <button
              @click="setCurrentPage(page)"
              class="focus:shadow-outline border-primary-500 h-[40px] w-[30px] border border-r-0 transition-colors duration-150 sm:w-[50px]"
              :class="{
                'bg-primary-600 text-white': page === currentPage,
                'text-primary-500 hover:bg-primary-600 bg-white hover:text-white': page !== currentPage
              }"
            >
              {{ page }}
            </button>
          </li>
          <li>
            <button
              @click="nextPage"
              class="focus:shadow-outline border-primary-500 hover:bg-primary-600 h-[40px] w-[30px] border border-r-0 transition-colors duration-150 sm:w-[50px]"
              :disabled="currentPage === pageTotal"
            >
              <ChevronRightIcon class="text-primary-500 mx-auto size-5 hover:fill-white" />
            </button>
          </li>
          <li>
            <button
              @click="lastPage"
              class="focus:shadow-outline border-primary-500 text-primary-500 checked:bg-primary-700 hover:bg-primary-600 h-[40px] w-[30px] cursor-pointer rounded-r-lg border bg-white transition-colors duration-150 hover:text-white focus:border-zinc-600 sm:w-[50px]"
              :disabled="currentPage === pageTotal"
            >
              <ChevronDoubleRightIcon class="text-primary-500 mx-auto size-5 hover:fill-white" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="text-center md:mt-0 md:ml-3">總筆數：{{ totalRecords }}</div>
  </div>
</template>
