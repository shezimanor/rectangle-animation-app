<script setup>
import GeometricShape from '@/components/GeometricShape.vue';
import generateRandomBooleans from '@/utils/generateRandomBooleans';
import { computed, ref } from 'vue';

// 動畫顯示的模式：all, random
const elementMode = ref('all');

// SVG 的數量
const elementCount = ref(1);

// 每行每列數量
const elementCountSqrt = computed(() => Math.sqrt(elementCount.value));

// 隨機 active 的數量：先假設等於 elementCountSqrt
const elementRandomCount = computed(() => elementCountSqrt.value);

// 動畫狀態陣列
const elementStateArray = computed(() => {
  if (elementMode.value === 'random')
    return generateRandomBooleans(elementRandomCount.value, elementCount.value);
  else return Array(elementCount.value).fill(true);
});

// grid 排版樣式
const elementLayoutClass = computed(
  () => `grid-${elementCountSqrt.value}x${elementCountSqrt.value}`
);

// methods
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
        :active="elementStateArray[n - 1]"
        :chunk="elementCountSqrt"
        :index="n"
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
            name="elementMode"
            value="all"
            v-model="elementMode"
          />
          All
        </label>
        <label>
          <input
            type="radio"
            id="random"
            name="elementMode"
            value="random"
            v-model="elementMode"
          />
          Random
        </label>
      </div>
    </div>
  </div>
</template>
