<script setup>
import { computed } from 'vue';
import { EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: {
    type: String,
    default: '按鈕'
  },
  isLoading: Boolean,
  color: {
    type: String,
    default: 'primary'
  },
  class: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click']);

const colors = {
  primary: 'btn-primary',
  primaryLight: 'btn-primary-300',
  secondary: 'btn-secondary',
  warning: 'btn-warning',
  danger: 'btn-error',
  disabled: 'btn-secondary opacity-25',
  secondaryLight: 'btn-secondary-300',
  outlinePrimary: 'btn-outline-primary',
  outlinePrimaryLight: 'btn-outline-primary-300'
  // outlineSecondaryLight: 'btn-outline-eiadoc-gray'
};

// 動態計算按鈕背景顏色
const bgColor = computed(() => colors[props.color] || colors.primary);
</script>
<template>
  <button
    v-bind="$attrs"
    :class="['btn flex items-center justify-center', bgColor, props.class]"
    :title="`${props.title}按鈕`"
    @click="emit('click', $event)"
  >
    <EllipsisHorizontalCircleIcon v-if="props.isLoading" />
    <span v-if="props.isLoading">處理中...</span>
    <slot v-else>送出</slot>
  </button>
</template>
