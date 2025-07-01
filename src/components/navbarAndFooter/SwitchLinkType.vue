<script setup>
const props = defineProps({
  nav: {
    type: Object,
    required: true
  }
});
</script>
<template>
  <component
    :is="props.nav.linkType === 'RouterLink' ? 'RouterLink' : 'a'"
    v-bind="props.nav.linkType === 'RouterLink' ? { to: props.nav.link } : { href: props.nav.link }"
    :title="props.nav.title"
    :target="props.nav.target"
  >
    {{ props.nav.name }}
  </component>
</template>
