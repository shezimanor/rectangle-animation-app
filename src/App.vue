<script setup>
import { computed, ref } from 'vue';
import GeometricShape from './components/GeometricShape.vue';
const activeElement = ref('all');
const elementCount = ref(1);
const elementCountSqrt = computed(() => Math.sqrt(elementCount.value));
const elementLayoutClass = computed(
  () => `grid-${elementCountSqrt.value}x${elementCountSqrt.value}`
);
function changeElementCount(count) {
  elementCount.value = count;
}
</script>

<template>
  <div class="main-wrapper">
    <div :class="['grid-container', elementLayoutClass]">
      <GeometricShape
        v-for="n in elementCount"
        :key="`shape_${n}`"
        :active="true"
        :chunk="elementCountSqrt"
      />
    </div>
    <div class="flex-container">
      <div class="flex-item">
        <button @click="changeElementCount(1)">1x1</button>
        <button @click="changeElementCount(9)">3x3</button>
        <button @click="changeElementCount(25)">5x5</button>
        <button @click="changeElementCount(100)">10x10</button>
      </div>
      <div class="flex-item">
        <label>
          <input
            type="radio"
            id="all"
            name="activeElement"
            value="all"
            v-model="activeElement"
          />
          All
        </label>
        <label>
          <input
            type="radio"
            id="random"
            name="activeItem"
            value="random"
            v-model="activeElement"
          />
          Random
        </label>
      </div>
    </div>
  </div>
</template>
