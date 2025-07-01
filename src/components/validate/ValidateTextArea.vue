<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: String,
  name: String,
  rules: String,
  errors: {
    type: Object,
    default: () => ({}) // 保證 errors 預設為空對象，而不是 null
  },
  class: String,
  rows: String,
  cols: String,
  modelValue: [Number, String, Array],
  validate: {
    type: [Boolean, String],
    default: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  areaType: {
    type: String,
    default: 'textarea'
  },
  isCaseInvalid: {
    // 是否作廢
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['click', 'update:modelValue', 'keydown']);

// 事件處理函數
const handleKeyDown = event => {
  emits('keydown', event);
};

const handleClick = () => {
  // 發射click事件
  emits('click');
};
// const model = defineModel();
// const emits = defineEmits(['update:modelValue']);  // 用於更新v-model的值

// 創建一個computed來處理input的雙向綁定
const model = computed({
  get: () => props.modelValue,
  set: newValue => emits('update:modelValue', newValue)
});
</script>
<template>
  <div>
    <div class="relative">
      <VField
        autocomplete="off"
        :id="props.id"
        :name="props.name"
        :as="props.areaType"
        :rows="props.rows"
        :cols="props.cols"
        :placeholder="props.placeholder"
        class="form-control h-11"
        :class="[
          {
            'border-red-500 focus:border-red-500': props.validate && errors && errors[props.name]
          },
          { 'disabled-textarea-style': props.isCaseInvalid },
          props.class //外層的類別
        ]"
        :rules="props.validate ? props.rules : undefined"
        :disabled="props.isDisabled || props.isCaseInvalid"
        v-bind="$attrs"
        v-model="model"
        @click="handleClick"
        @keydown="handleKeyDown"
      />
      <!--<button
			type="button"
			class="absolute right-3 top-1/2 -translate-y-1/2 transform"
		></button>-->
    </div>
    <div class="mt-1 text-start" v-if="props.validate">
      <ErrorMessage :name="props.name" class="block text-sm text-red-500" />
    </div>
  </div>
</template>
