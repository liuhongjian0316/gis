<script setup lang="ts">
import {defineProps} from 'vue';

const props = defineProps<{
  visible: boolean;
}>()
</script>

<template>
  <div class="top-bar-container">
    <template v-if="visible">
      <slot/>
    </template>
    <div v-if="!visible">
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-bar-container{
  height: 100%;
}
</style>