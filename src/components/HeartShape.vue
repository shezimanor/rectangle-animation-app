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

// 305 is Path Element getTotalLength();
const heartPathTotalLength = ref(305);

function svgWidthWatcherCallback(newValue) {
  // 圖形周長會改變主要跑動的線條長度
  shapePerimeter.value = Math.floor(
    (newValue * heartPathTotalLength.value) / (size.value + 4)
  );
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
      d="M52 25 C32,-13, -30,25, 22,72 L52,96 L82,72 C134,25, 72,-13, 52,25"
      stroke="#666"
      stroke-width="2"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    ></path>
    <path
      d="M52 25 C32,-13, -30,25, 22,72 L52,96 L82,72 C134,25, 72,-13, 52,25"
      fill="transparent"
      :stroke="active ? 'white' : '#666'"
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
