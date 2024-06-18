<script setup>
defineProps({
  active: Boolean
});
</script>

<template>
  <div class="demo">{{ active }}</div>
</template>

<style scoped>
@import url('@/assets/styles/geometric-shape.scss');
</style>
