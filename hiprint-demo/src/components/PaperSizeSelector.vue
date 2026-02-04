<template>
  <div class="paper-size-selector">
    <div class="selector-title">纸张规格</div>
    <el-radio-group v-model="selectedPaper" @change="handlePaperChange">
      <el-radio-button
        v-for="paper in presetPapers"
        :key="paper.value"
        :label="paper.value"
      >
        {{ paper.label }}
      </el-radio-button>
      <el-radio-button label="custom">自定义</el-radio-button>
    </el-radio-group>

    <div v-if="selectedPaper === 'custom'" class="custom-size-input">
      <el-form-item label="宽度">
        <el-input-number
          v-model="customWidth"
          :min="1"
          :max="100"
          :precision="1"
          :step="0.1"
          controls-position="right"
          @change="handleCustomSizeChange"
        />
        <span class="unit">cm</span>
      </el-form-item>
      <el-form-item label="高度">
        <el-input-number
          v-model="customHeight"
          :min="1"
          :max="100"
          :precision="1"
          :step="0.1"
          controls-position="right"
          @change="handleCustomSizeChange"
        />
        <span class="unit">cm</span>
      </el-form-item>
    </div>

    <div class="current-paper-info">
      <el-tag type="info">
        {{ currentPaperInfo }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      width: 100,
      height: 150
    })
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// hiprint 纸张尺寸单位为 mm
const presetPapers = [
  {
    label: '10×10cm',
    value: '10x10',
    width: 100,
    height: 100
  },
  {
    label: '10×15cm',
    value: '10x15',
    width: 100,
    height: 150
  },
  {
    label: 'A4',
    value: 'A4',
    width: 210,
    height: 297
  }
]

const selectedPaper = ref('10x15')
const customWidth = ref(10)
const customHeight = ref(15)

const currentPaperInfo = computed(() => {
  if (selectedPaper.value === 'custom') {
    return `${customWidth.value}×${customHeight.value}cm`
  }
  const paper = presetPapers.find(p => p.value === selectedPaper.value)
  return paper ? paper.label : ''
})

const currentPaperSize = computed(() => {
  if (selectedPaper.value === 'custom') {
    // 用户输入 cm，转换为 mm
    return {
      width: customWidth.value * 10,
      height: customHeight.value * 10,
      paperType: `custom_${customWidth.value}x${customHeight.value}`
    }
  }
  const paper = presetPapers.find(p => p.value === selectedPaper.value)
  return paper
    ? {
        width: paper.width,
        height: paper.height,
        paperType: paper.value
      }
    : null
})

function handlePaperChange(value) {
  if (value !== 'custom') {
    emitChange()
  }
}

function handleCustomSizeChange() {
  if (selectedPaper.value === 'custom') {
    emitChange()
  }
}

function emitChange() {
  const size = currentPaperSize.value
  if (size) {
    emit('update:modelValue', size)
    emit('change', size)
  }
}

watch(
  () => props.modelValue,
  newVal => {
    if (newVal && newVal.width && newVal.height) {
      // modelValue 来自模板，单位是 mm
      const found = presetPapers.find(
        p => p.width === newVal.width && p.height === newVal.height
      )
      if (found) {
        selectedPaper.value = found.value
      } else {
        selectedPaper.value = 'custom'
        // 显示给用户的是 cm
        customWidth.value = newVal.width / 10
        customHeight.value = newVal.height / 10
      }
    }
  },
  { immediate: true }
)

defineExpose({
  getPresetPapers: () => presetPapers,
  getCurrentSize: () => currentPaperSize.value
})
</script>

<style scoped lang="scss">
.paper-size-selector {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;

  .selector-title {
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
  }

  .custom-size-input {
    margin-top: 15px;
    padding: 10px;
    background: white;
    border-radius: 4px;

    .el-form-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .unit {
      margin-left: 5px;
      color: #909399;
      font-size: 12px;
    }
  }

  .current-paper-info {
    margin-top: 10px;
    text-align: right;
  }
}

:deep(.el-radio-button) {
  .el-radio-button__inner {
    min-width: 80px;
  }
}
</style>
