<script setup>
import { useElementSize } from '@vueuse/core';
import { computed, nextTick, ref, toRefs, watch } from 'vue';

// props
const props = defineProps({
  active: {
    type: Boolean,
    default: true
  },
  index: {
    type: Number,
    default: 1
  }
});

// 解構 props：可保持一致性
const { active, index } = toRefs(props);

const svgElement = ref(null);
const animateElement = ref(null);
const heartPathElement = ref(null);

const { width: svgWidth } = useElementSize(svgElement);

// 預設的 svg 的長寬
const size = ref(100);

// 心型周長（不一樣的地方）
const shapePerimeter = ref(0);

// 305 is heartPathElement.value.getTotalLength();
const heartPathTotalLength = ref(305);

const viewBox = computed(() => `0 0 ${size.value + 4} ${size.value + 4}`);

// 圖形半周長
const shapeHalfPerimeter = computed(() => Math.floor(shapePerimeter.value / 2));

// 主要跑動的線條長度
const mainDashLength = computed(() =>
  active.value ? Math.floor(shapeHalfPerimeter.value / 4) : 0
);

// 虛線設定：兩條短虛線（周長的一半的 1:3）
const strokeDasharray = computed(() => {
  return `${mainDashLength.value} ${
    shapeHalfPerimeter.value - mainDashLength.value
  }`;
});

// 監控 active 來控制動畫的啟閉
watch(
  active,
  (newValue, oldValue) => {
    // 針對本元件初始化時 active 為 true 的處理
    if (newValue && oldValue === undefined) nextTick(() => beginAnimation());
    else if (newValue) beginAnimation();
    else endAnimation();
  },
  // before onMounted：且 DOM 尚未 ready
  { immediate: true }
);

// 監控 svgWidth 來控制圖形虛線的呈現比例
watch(svgWidth, (newValue) => {
  // 圖形周長會改變主要跑動的線條長度
  shapePerimeter.value = Math.floor(
    (newValue * heartPathTotalLength.value) / (size.value + 4)
  );
});

// methods
function beginAnimation() {
  // beginElement 會立即重新啟動動畫
  animateElement.value?.beginElement();
}

function endAnimation() {
  // endElement 會立即終止動畫
  animateElement.value?.endElement();
}

// 使用 <script setup> 的元件，必須用 defineExpose 才能將屬性和方法暴露出去
defineExpose({
  index,
  beginAnimation,
  endAnimation
});
</script>

<template>
  <svg
    ref="svgElement"
    class="geometric-shape"
    :width="`${size + 4}`"
    :height="`${size + 4}`"
    :viewBox="viewBox"
  >
    <!-- 心型 -->
    <path
      ref="heartPathElement"
      d="M52 25 C32,-13, -30,25, 22,72 L52,96 L82,72 C134,25, 72,-13, 52,25"
      stroke="#666"
      stroke-width="2"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    ></path>
    <path
      d="M52 25 C32,-13, -30,25, 22,72 L52,96 L82,72 C134,25, 72,-13, 52,25"
      fill="transparent"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      :stroke-dasharray="strokeDasharray"
      stroke-dashoffset="0"
      vector-effect="non-scaling-stroke"
    >
      <animate
        ref="animateElement"
        attributeName="stroke-dashoffset"
        from="0"
        :to="shapePerimeter"
        begin="indefinite"
        end="indefinite"
        dur="1.5s"
        calcMode="spline"
        repeatCount="indefinite"
        keyTimes="0;1"
        keySplines=".25 .1 .45 .9"
      />
    </path>
  </svg>
</template>

<style scoped>
@import url('@/assets/styles/geometric-shape.scss');
</style>
