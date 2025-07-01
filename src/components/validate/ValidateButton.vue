<script setup>
import { computed } from 'vue';
// import LoadingIcon from '@/components/iconComponent/loadingIcon.vue';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  title: {
    type: String,
    default: '按鈕'
  },
  isLoading: Boolean,
  // errors 是此元件傳入的 props，會來自 vee validate 用來判斷是否有錯誤訊息
  isSaveEnabled: {
    type: Boolean,
    default: true // 預設允許按鈕可點擊
  },
  color: {
    type: String,
    default: 'primary'
  },
  errors: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['click']);

const colors = {
  primary: 'btn-primary',
  primaryOutline: ' btn-outline-primary',
  secondary: 'btn-secondary',
  disabled: 'btn-secondary opacity-25'
};
const bgColor = computed(() => colors[props.color] || colors.primary);
const buttonClasses = computed(() => ({
  'cursor-not-allowed pointer-events-none opacity-75': !props.isSaveEnabled || Object.keys(props.errors).length > 0
}));
const isDisabled = computed(() => Object.keys(props.errors).length > 0 || props.color === 'disabled');
</script>

<template>
  <div
    :class="{
      'pointer-events-none cursor-not-allowed': !props.isSaveEnabled || Object.keys(errors).length > 0 || isDisabled
    }"
  >
    <!-- 使用 $attrs，可以套用原本 BaseButton 的 props 、emit 等  -->
    <button
      v-bind="$attrs"
      :title="`${props.title}按鈕`"
      :class="['btn', bgColor, props.class, buttonClasses]"
      :disabled="Object.keys(errors).length > 0"
      @click="emit('click', $event)"
    >
      <EllipsisHorizontalIcon v-if="props.isLoading" />
      <span v-if="props.isLoading">處理中...</span>
      <slot v-else>送出</slot>
    </button>
  </div>
</template>
