<script setup>
import GeometricShape from './components/GeometricShape.vue';
</script>

<template>
  <div class="grid-container grid-5x5">
    <GeometricShape v-for="n in 25" :active="true" />
  </div>
</template>
