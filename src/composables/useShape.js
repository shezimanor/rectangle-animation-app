import { useElementSize } from '@vueuse/core';
import { computed, nextTick, ref, watch } from 'vue';

export const useShape = (active, svgWidthWatcherCallback = () => {}) => {
  const svgElement = ref(null);
  const animateElement = ref(null);
  const { width: svgWidth } = useElementSize(svgElement);

  // 預設的 svg 的長寬
  const size = ref(100);

  // 圖形周長
  const shapePerimeter = ref(0);

  // 動畫設定
  const animateConfig = ref({
    dur: '1.5s',
    keySplines: '.42 .0 .1 .1'
  });

  // 圖形半周長
  const shapeHalfPerimeter = computed(() =>
    Math.floor(shapePerimeter.value / 2)
  );

  // 主要跑動的線條長度
  const mainDashLength = computed(() =>
    Math.floor(shapeHalfPerimeter.value / 4)
  );

  // 虛線設定：兩條短虛線（周長的一半的 1:3）
  const strokeDasharray = computed(() => {
    return `${mainDashLength.value} ${
      shapeHalfPerimeter.value - mainDashLength.value
    }`;
  });

  // SVG 屬性: viewBox
  const viewBox = computed(() => `0 0 ${size.value + 4} ${size.value + 4}`);

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
    // 圖形周長會改變主要跑動的線條長度（由每個元件自行定義）
    svgWidthWatcherCallback(newValue);
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
  return {
    svgElement,
    animateElement,
    size,
    shapePerimeter,
    animateConfig,
    strokeDasharray,
    viewBox,
    beginAnimation,
    endAnimation
  };
};
