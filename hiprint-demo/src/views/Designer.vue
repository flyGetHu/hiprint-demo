<template>
  <div class="designer-page">
    <LogisticsDesigner @print="handlePrint" />
  </div>
</template>

<script setup>
import LogisticsDesigner from '../components/LogisticsDesigner.vue'

function handlePrint(data) {
  console.log('打印数据:', data)
}
</script>

<style scoped lang="scss">
.designer-page {
  height: 100vh;
  overflow: hidden;
}
</style>
