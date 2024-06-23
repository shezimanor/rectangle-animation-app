<script setup>
import HeartShape from '@/components/HeartShape.vue';
import RectangleShape from '@/components/RectangleShape.vue';
import findCommonTruePositions from '@/utils/findCommonTruePositions';
import generateRandomBooleans from '@/utils/generateRandomBooleans';
import { computed, ref, watch } from 'vue';

// 動畫顯示的模式：All, Random
const elementMode = ref('All');
const elementShape = ref('Rectangle');

// 介面按鈕陣列
const buttonCountItems = ref([1, 3, 5, 10]);
const radioButtonModeItems = ref(['All', 'Random']);
const radioButtonShapeItems = ref(['Rectangle', 'Heart']);

// SVG 元件的數量
const elementCount = ref(1);

// SVG 元件 Refs
const shapeRefs = ref([]);

// SVG 當前元件
const currentShapeComponent = computed(() => {
  switch (elementShape.value) {
    case 'Heart':
      return HeartShape;
    case 'Rectangle':
    default:
      return RectangleShape;
  }
});

// 每行每列數量
const elementCountSqrt = computed(() => Math.sqrt(elementCount.value));

// 隨機 active 的數量：先假設等於 elementCountSqrt
const elementRandomCount = computed(() => elementCountSqrt.value);

// 動畫狀態陣列
const elementStateArray = computed(() => {
  if (elementMode.value === 'Random')
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
      <component
        v-for="n in elementCount"
        ref="shapeRefs"
        :is="currentShapeComponent"
        :key="`shape_${n - 1}`"
        :active="elementStateArray[n - 1]"
        :index="n - 1"
      />
    </div>
    <div class="flex-container">
      <div class="flex-item">
        <button
          v-for="item in buttonCountItems"
          :key="`btn_${item}`"
          @click="changeElementCount(item * item)"
        >
          {{ item }}x{{ item }}
        </button>
      </div>
      <div class="flex-item">
        <label
          v-for="item in radioButtonModeItems"
          :key="`radioBtnMode_${item}`"
        >
          <input
            type="radio"
            :id="`radioBtnMode_${item}`"
            name="elementMode"
            :value="item"
            v-model="elementMode"
          />
          {{ item }}
        </label>
      </div>
      <div class="flex-item">
        <label
          v-for="item in radioButtonShapeItems"
          :key="`radioBtnShape_${item}`"
        >
          <input
            type="radio"
            :id="`radioBtnShape_${item}`"
            name="elementShape"
            :value="item"
            v-model="elementShape"
          />
          {{ item }}
        </label>
      </div>
      <div class="flex-item">
        <a
          href="https://github.com/shezimanor/rectangle-animation-app"
          target="_blank"
          >Github Repo</a
        >
      </div>
    </div>
  </div>
</template>
