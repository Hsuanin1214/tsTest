<script setup>
import { ref, defineProps, defineEmits, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
    // 格式：[{ label: '全部', value: 1 }, { label: '未填寫', value: 2 }]
  },
  modelValue: {
    type: Number,
    default: 1
  },
  bgClass: {
    type: String,
    default: 'bg-white'
  }
});

const emit = defineEmits(['update:modelValue']);

const buttons = ref([]);
const buttonContainer = ref(null);

const activeIndex = computed(() => props.options.findIndex(item => item.value === props.modelValue));

const onClick = value => {
  emit('update:modelValue', value);
};

const isActive = value => props.modelValue === value;

const sliderStyle = ref({});

const updateSlider = () => {
  nextTick(() => {
    const activeBtn = buttons.value[activeIndex.value];
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const containerRect = buttonContainer.value.getBoundingClientRect();

      sliderStyle.value = {
        width: `${rect.width}px`,
        transform: `translateX(${rect.left - containerRect.left}px)`
      };
    }
  });
};

const handleResize = () => {
  updateSlider();
};

onMounted(() => {
  updateSlider();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

watch(() => props.modelValue, updateSlider);
</script>
<template>
  <div :class="[bgClass, 'flex w-full flex-col rounded sm:mx-auto sm:w-9/12 sm:max-w-sm']">
    <!-- <div
      class="border-secondary-600 text-secondary-600 relative flex h-14 w-full items-center rounded-full border-2 text-xs font-bold shadow sm:text-base"
    >
      <button
        v-for="item in props.options"
        :key="item.value"
        class="flex h-10 w-full items-center justify-center rounded-full"
        :class="isActive(item.value) ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'"
        @click.prevent="onClick(item.value)"
      >
        {{ item.label }}
      </button>
    </div> -->
    <div
      ref="buttonContainer"
      class="text-secondary-600 bg-secondary-100 relative flex h-14 w-full items-center overflow-hidden rounded-full text-xs font-bold shadow sm:text-base"
    >
      <!-- 滑動背景 -->
      <div class="bg-primary-500 absolute h-10 rounded-full transition-all duration-300" :style="sliderStyle"></div>

      <!-- 按鈕區塊 -->
      <button
        v-for="item in props.options"
        :key="item.value"
        ref="buttons"
        class="z-10 flex h-10 w-full items-center justify-center rounded-full transition-colors duration-300"
        :class="isActive(item.value) ? 'text-white' : 'hover:bg-gray-100'"
        @click.prevent="onClick(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
