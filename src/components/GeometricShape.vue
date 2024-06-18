<script setup>
defineProps({
  active: Boolean
});
</script>

<template>
  <svg class="geometric-shape" width="100" height="100" viewBox="0 0 100 100">
    <rect
      x="4"
      y="4"
      width="92"
      height="92"
      rx="2"
      ry="2"
      stroke="#666"
      stroke-width="2"
    />
    <rect
      x="4"
      y="4"
      width="92"
      height="92"
      rx="2"
      ry="2"
      fill="transparent"
      stroke="white"
      stroke-width="2"
      stroke-dasharray="46 138"
      stroke-dashoffset="0"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="368"
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
