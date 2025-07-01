<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rules: {
    type: [String, Function],
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  class: String,
  isDisabled: {
    type: Boolean,
    default: false
  },
  checkBoxList: {
    type: Array,
    required: true
  },
  optionCode: {
    type: String,
    default: 'id'
  },
  displayName: {
    type: String,
    default: 'name'
  }
});

const model = defineModel();
</script>

<template>
  <div>
    <div :class="['min-h-[28px]', 'grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-2']">
      <div class="flex items-center" v-for="item in props.checkBoxList" :key="item[optionCode]">
        <VField
          type="checkbox"
          :id="`${name}-${item[optionCode]}`"
          :name="props.name"
          v-model="model"
          :disabled="props.isDisabled"
          :value="item[props.optionCode]"
          :rules="props.rules"
          :checked="Array.isArray(model) && model.includes(item.id)"
          :class="[
            'checkbox form-checkbox cursor-pointer',
            {
              'border-red-500 focus:border-red-500 focus-visible:border-3': errors?.[props.name]
            },
            props.class //外層的類別
          ]"
        />
        <label :for="`${name}-${item[optionCode]}`" class="text-secondary-600 ml-2 cursor-pointer">{{
          item[props.displayName]
        }}</label>
      </div>
    </div>
    <div class="mt-1 text-start">
      <ErrorMessage :name="props.name" class="block text-sm text-red-500" />
    </div>
  </div>
</template>
