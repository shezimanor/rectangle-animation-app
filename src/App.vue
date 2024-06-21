<script setup>
import GeometricShape from '@/components/GeometricShape.vue';
import findCommonTruePositions from '@/utils/findCommonTruePositions';
import generateRandomBooleans from '@/utils/generateRandomBooleans';
import { computed, ref, watch } from 'vue';

// 動畫顯示的模式：all, random
const elementMode = ref('all');

// 介面按鈕陣列
const buttonItems = ref([1, 3, 5, 10]);
const radioButtonItems = ref(['all', 'random']);

// SVG 元件的數量
const elementCount = ref(1);

// SVG 元件 Refs
const shapeRefs = ref([]);

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

// 監控 elementStateArray 來控制動畫重啟：變化原因有 2 種：elementCount（圖形數量）、elementMode（模式）
watch(elementStateArray, (newValue, oldValue) => {
  // 因為陣列是整個替換，所以 newValue !== oldValue
  // 找出變因變化前，就在播放動畫的圖形索引陣列
  const elementRestartIndexArray = findCommonTruePositions(newValue, oldValue);
  // 動畫重啟，以求同步播放
  elementRestartIndexArray.forEach((index) => {
    if (shapeRefs.value[index].index === index)
      shapeRefs.value[index].beginAnimation();
  });
});

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
        ref="shapeRefs"
        :key="`shape_${n - 1}`"
        :active="elementStateArray[n - 1]"
        :chunk="elementCountSqrt"
        :index="n - 1"
      />
    </div>
    <div class="flex-container">
      <div class="flex-item">
        <button
          v-for="item in buttonItems"
          :key="`btn_${item}`"
          @click="changeElementCount(item * item)"
        >
          {{ item }}x{{ item }}
        </button>
      </div>
      <div class="flex-item">
        <label v-for="item in radioButtonItems" :key="`radioBtn_${item}`">
          <input
            type="radio"
            :id="`radioBtn_${item}`"
            name="elementMode"
            :value="item"
            v-model="elementMode"
          />
          {{ item }}
        </label>
      </div>
    </div>
  </div>
</template>
