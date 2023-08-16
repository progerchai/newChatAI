<script setup lang="ts">
withDefaults(defineProps<{ text: string; max?: number }>(), { max: 8 });
</script>
<template>
  <span>
    {{ text.length > max ? text.slice(0, max) + "..." : text }}
  </span>
</template>
