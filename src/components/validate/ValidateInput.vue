<script setup>
import { ref, computed } from 'vue';
// import openEyeIcon from '@/assets/images/icons/open_eye.svg';
// import closeEyeIcon from '@/assets/image/icon/close_eye.svg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  id: String,
  name: String,
  type: String,
  placeholder: String,
  title: {
    type: String,
    default: '請輸入內容'
  },
  rules: String,
  errors: {
    type: Object,
    default: () => ({})
  },
  parentClass: {
    type: String,
    default: 'relative'
  },
  class: String,
  showImage: {
    type: Boolean,
    default: false // 預設一般input不會有圖片
  },
  validate: {
    type: Boolean,
    default: true // 預設為需要驗證
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isCaseInvalid: {
    // 是否作廢
    type: Boolean,
    default: false
  }
});

const model = defineModel();
// console.log(model);
/** 密碼開關 */
const isPasswordVisible = ref(false);
const inputType = computed(() => {
  return isPasswordVisible.value ? 'text' : 'password';
});
const currentIcon = computed(() => (isPasswordVisible.value ? EyeIcon : EyeSlashIcon));
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
/** */
</script>
<template>
  <div>
    <div :class="props.parentClass">
      <VField
        as="input"
        autocomplete="off"
        v-bind="$attrs"
        :id="props.id"
        :name="props.name"
        :type="props.type === 'date' ? 'date' : props.showImage ? inputType : props.type"
        :class="[
          'focus-visible:border-3',
          'h-11',
          'form-control',
          {
            'border-red-500 focus:border-red-500': props.validate && props.errors?.[props.name]
          },
          { 'disabled-style': props.isCaseInvalid },
          props.class //外層的類別
        ]"
        :placeholder="props.placeholder"
        :title="props.title"
        :rules="props.validate ? props.rules : ''"
        v-model="model"
        :disabled="props.isDisabled"
      />
      <button
        @click="togglePasswordVisibility"
        v-if="props.showImage"
        type="button"
        class="a11y-focus absolute top-1/2 right-3 -translate-y-1/2 transform"
      >
        <component
          :is="currentIcon"
          class="h-6 w-6 text-gray-500"
          :title="isPasswordVisible ? '關閉實際密碼' : '顯示實際密碼'"
        />
      </button>
    </div>
    <div class="mt-1 text-start" v-if="props.validate">
      <ErrorMessage :name="props.name" class="block text-sm text-red-500" />
    </div>
  </div>
</template>
