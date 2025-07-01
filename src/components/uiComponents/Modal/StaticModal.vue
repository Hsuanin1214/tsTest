<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
  isModalOpen: {
    type: Boolean,
    default: false
  },
  isHasTitle: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  isHasBtn: {
    type: Boolean,
    default: false
  },
  widthClass: {
    // 新增的寬度控制 class
    type: String,
    default: 'max-w-2xl' // 預設寬度
  },
  paddingClass: {
    type: String,
    default: 'p-4 md:p-5'
  },
  titleColor: {
    type: String,
    default: 'text-primary-500'
  }
});

const emit = defineEmits(['close', 'confirm']);
</script>
<template>
  <div
    id="static-modal"
    tabindex="-1"
    :inert="!isModalOpen"
    v-show="props.isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
  >
    <div class="relative z-20 max-h-full w-full p-4" :class="props.widthClass">
      <div class="relative rounded-lg bg-white shadow-sm">
        <!-- Modal header -->
        <div class="flex items-start justify-between rounded-t border-b border-gray-200" :class="[props.paddingClass]">
          <slot name="modalTitle">
            <h3 :class="[props.titleColor, 'text-2xl font-semibold']" v-if="isHasTitle">
              {{ props.title }}
            </h3>
          </slot>
          <button
            type="button"
            class="bg-primary-500 hover:bg-primary-600 ms-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm shadow-lg focus:border-zinc-600"
            @click="emit('close')"
          >
            <XMarkIcon class="size-6 text-white" />
            <span class="sr-only">關閉視窗</span>
          </button>
        </div>
        <!-- Modal body -->
        <div :class="`text-secondary-600 space-y-4 ${props.paddingClass}`">
          <slot name="modalBody" />
        </div>
        <!-- Modal footer -->
        <template v-if="isHasBtn">
          <div
            class="flex items-center justify-end space-x-10 rounded-b"
            :class="[props.paddingClass, isHasTitle ? 'border-b border-gray-200' : '']"
          >
            <slot name="modalFooter">
              <!-- 預設按鈕 -->
              <button type="button" class="btn btn-primary" @click="emit('confirm')">確認</button>
              <button type="button" class="btn btn-secondary" @click="emit('close')">取消</button>
            </slot>
          </div>
          <slot name="underModalFooter"></slot>
        </template>
      </div>
    </div>
    <!-- 背景遮罩 -->
    <div class="fixed inset-0 z-10 transition-opacity">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
  </div>
</template>
