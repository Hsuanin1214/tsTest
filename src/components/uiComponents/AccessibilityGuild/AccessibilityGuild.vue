<script setup>
import { computed } from 'vue';

const props = defineProps({
  position: {
    validator(value) {
      // value 必須是以下幾個值，若不是會跳警告
      return ['navbar', 'center', 'footer', 'search'].includes(value);
    },
    class: {
      type: String,
      default: 'text-eiadoc-blue'
    }
  }
});

/** 無障礙導盲磚四個位置 */
const accessibilityType = [
  {
    blockName: 'navbar',
    href: '#AccesskeyNavbar',
    id: 'AccesskeyNavbar',
    accesskey: 'U',
    name: 'U',
    title: '上方功能區塊'
  },
  {
    blockName: 'center',
    href: '#AccesskeyCenter',
    id: 'AccesskeyCenter',
    accesskey: 'C',
    name: 'C',
    title: '中央內容區塊'
  },
  {
    blockName: 'footer',
    href: '#AccesskeyFooter',
    id: 'AccesskeyFooter',
    accesskey: 'Z',
    name: 'Z',
    title: '下方功能區塊'
  },
  {
    blockName: 'search',
    href: '#AccesskeySearch',
    id: 'AccesskeySearch',
    accesskey: 'S',
    name: 'S',
    title: '網站搜尋'
  }
];

const accessibility = computed(() => {
  return accessibilityType.find(item => item.blockName === props.position);
});
// onMounted(() => {
// 	// 當加載完成後檢測焦點是否正確移動
// 	const targetElement = document.querySelector(accessibility.value.href);
// 	if (targetElement) {
// 		targetElement.focus(); // 聚焦到目標內容區塊
// 	}
// });
</script>
<template>
  <div>
    <a
      :href="accessibility.href"
      :id="accessibility.id"
      :accesskey="accessibility.accesskey"
      :name="accessibility.name"
      :title="accessibility.title"
      :class="[
        'hover:opacity-70 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-amber-500',
        props.class
      ]"
      rel="noopener noreferrer"
      >:::</a
    >
  </div>
</template>
