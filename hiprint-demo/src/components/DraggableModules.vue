<template>
  <div class="draggable-modules">
    <div class="module-category">
      <div class="category-title">基础组件</div>
      <div class="ep-draggable-item" tid="defaultModule.text">
        <el-icon><Document /></el-icon>
        <span>文本</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.image">
        <el-icon><Picture /></el-icon>
        <span>图片</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.longText">
        <el-icon><Tickets /></el-icon>
        <span>长文本</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.html">
        <el-icon><Document /></el-icon>
        <span>HTML</span>
      </div>
    </div>

    <div class="module-category">
      <div class="category-title">表格组件</div>
      <div class="ep-draggable-item" tid="defaultModule.table">
        <el-icon><Grid /></el-icon>
        <span>表格</span>
      </div>
    </div>

    <div class="module-category">
      <div class="category-title">条码组件</div>
      <div class="ep-draggable-item" tid="defaultModule.barcode">
        <el-icon><Promotion /></el-icon>
        <span>条形码</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.qrcode">
        <el-icon><Crop /></el-icon>
        <span>二维码</span>
      </div>
    </div>

    <div class="module-category">
      <div class="category-title">辅助组件</div>
      <div class="ep-draggable-item" tid="defaultModule.hline">
        <el-icon><Minus /></el-icon>
        <span>横线</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.vline">
        <el-icon><Minus /></el-icon>
        <span>竖线</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.rect">
        <el-icon><FullScreen /></el-icon>
        <span>矩形</span>
      </div>
      <div class="ep-draggable-item" tid="defaultModule.oval">
        <el-icon><CirclePlus /></el-icon>
        <span>椭圆</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Document,
  Picture,
  Tickets,
  Grid,
  Promotion,
  Crop,
  Minus,
  FullScreen,
  CirclePlus
} from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.draggable-modules {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.module-category {
  margin-bottom: 20px;
}

.category-title {
  font-size: 13px;
  font-weight: bold;
  color: #606266;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 2px solid #409eff;
}

.ep-draggable-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
  user-select: none;

  &:hover {
    border-color: #409eff;
    color: #409eff;
    background: #ecf5ff;
    transform: translateX(5px);
  }

  i,
  .el-icon {
    margin-right: 8px;
    font-size: 16px;
  }

  span {
    font-size: 13px;
  }
}
</style>
