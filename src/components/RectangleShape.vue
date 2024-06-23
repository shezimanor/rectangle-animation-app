<script setup>
import { useShape } from '@/composables/useShape.js';
import { ref, toRefs } from 'vue';

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

const {
  svgElement,
  animateElement,
  size,
  shapePerimeter,
  strokeDasharray,
  viewBox,
  beginAnimation,
  endAnimation
} = useShape(active, svgWidthWatcherCallback);

// svg 圓角寬度
const borderRadius = ref(8);

function svgWidthWatcherCallback(newValue) {
  // 圖形周長會改變主要跑動的線條長度
  shapePerimeter.value = (newValue - 4) * 4;
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
    <rect
      x="2"
      y="2"
      :width="size"
      :height="size"
      :rx="borderRadius"
      :ry="borderRadius"
      stroke="#666"
      stroke-width="2"
      vector-effect="non-scaling-stroke"
    />
    <rect
      x="2"
      y="2"
      :width="size"
      :height="size"
      :rx="borderRadius"
      :ry="borderRadius"
      fill="transparent"
      :stroke="active ? 'white' : '#666'"
      stroke-width="2"
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
    </rect>
  </svg>
</template>

<style scoped>
@import url('@/assets/styles/geometric-shape.scss');
</style>
