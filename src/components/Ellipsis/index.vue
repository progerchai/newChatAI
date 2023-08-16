<script setup lang="ts">
import _ from 'lodash';
withDefaults(defineProps<{ text: string | undefined; max?: number }>(), {
  max: 8,
});
</script>
<template>
  <span>
    {{ _.get(text, 'length', 0) > max ? text?.slice(0, max) + '...' : text }}
  </span>
</template>
