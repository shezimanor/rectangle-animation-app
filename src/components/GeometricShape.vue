<script setup>
import { computed, nextTick, ref, toRefs, watch } from 'vue';

// props
const props = defineProps({
  active: {
    type: Boolean,
    default: true
  },
  chunk: {
    type: Number,
    default: 1,
    validator(value) {
      return [1, 3, 5, 10].includes(value);
    }
  },
  index: {
    type: Number,
    default: 1
  }
});

// 解構 props：可保持一致性
const { active, chunk, index } = toRefs(props);

const animateElement = ref(null);

// 預設的 svg 的長寬
const defaultSize = ref(360);

// 圓角對應列表：borderRadius 使用
const borderRadiusMapping = ref({
  1: 8,
  3: 6,
  5: 4,
  10: 2
});

// svg 的長寬：交由 chunk 來決定
const size = computed(() => (defaultSize.value / chunk.value) | 0);

const viewBox = computed(() => `0 0 ${size.value + 4} ${size.value + 4}`);

// svg 圓角寬度
const borderRadius = computed(() => {
  return borderRadiusMapping.value[chunk.value];
});

// 矩形周長與半周長
const shapePerimeter = computed(() => size.value * 4);
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
    class="geometric-shape"
    :width="`${size + 4}`"
    :height="`${size + 4}`"
    :viewBox="viewBox"
  >
    <rect
      x="2"
      y="2"
      :width="size"
      :height="size"
      :rx="borderRadius"
      :ry="borderRadius"
      stroke="#666"
      stroke-width="2"
    />
    <rect
      x="2"
      y="2"
      :width="size"
      :height="size"
      :rx="borderRadius"
      :ry="borderRadius"
      fill="transparent"
      stroke="white"
      stroke-width="2"
      :stroke-dasharray="strokeDasharray"
      stroke-dashoffset="0"
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
    </rect>
  </svg>
</template>

<style scoped>
@import url('@/assets/styles/geometric-shape.scss');
</style>
