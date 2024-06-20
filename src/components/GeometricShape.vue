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
    default: 1
  }
});

// 解構 props：可保持一致性
const { active, chunk } = toRefs(props);

const animateElement = ref(null);

// 預設的 svg 的長寬
const defaultSize = ref(360);

// svg 的長寬：交由 chunk 來決定
const size = computed(() => (defaultSize.value / chunk.value) | 0);

const viewBox = computed(() => `0 0 ${size.value + 4} ${size.value + 4}`);

// svg 圓角寬度
const borderRadius = computed(() => {
  const mapping = {
    1: 8,
    3: 6,
    5: 4,
    10: 2
  };
  return mapping[props.chunk];
});

// 矩形周長
const shapePerimeter = computed(() => size.value * 4);

// 虛線設定：兩條短虛線（周長的一半的 1:2）
const strokeDasharray = computed(() => {
  const shapeHalfPerimeter = size.value * 2;
  const mainDashLength = Math.floor(shapeHalfPerimeter / 3);
  return active.value
    ? `${mainDashLength} ${shapeHalfPerimeter - mainDashLength}`
    : `0 ${shapePerimeter.value}`;
});

// 監控 chunk 來控制動畫重啟：因為剛好 chunk 的變化是動畫需要重啟的主要原因
watch(chunk, () => {
  beginAnmation();
});

// 監控 chunk 來控制動畫重啟：
watch(
  active,
  (newValue, oldValue) => {
    // 針對初始化 active 為 true 的處理
    if (newValue && oldValue === undefined) nextTick(() => beginAnmation());
    else if (newValue) beginAnmation();
    else endAnmation();
  },
  // before onMounted：且 DOM 尚未 ready
  { immediate: true }
);

// methods
function beginAnmation() {
  console.log('beginAnmation');
  // beginElement 會立即重新啟動動畫
  animateElement.value?.beginElement();
}

function endAnmation() {
  console.log('endAnmation');
  // endElement 會立即終止動畫
  animateElement.value?.endElement();
}
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
