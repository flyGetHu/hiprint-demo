<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <el-icon><Van /></el-icon>
          物流面单打印系统
        </h1>
        <p class="hero-subtitle">
          基于 vue-plugin-hiprint 的可视化面单设计与打印解决方案
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="goToDesigner" :icon="Edit">
            创建面单模板
          </el-button>
          <el-button size="large" @click="showDemo" :icon="VideoPlay">
            查看演示
          </el-button>
        </div>
      </div>
    </div>

    <div class="features-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="feature in features" :key="feature.title">
          <el-card class="feature-card" :body-style="{ padding: '20px' }">
            <div class="feature-icon">
              <el-icon :size="40" :color="feature.color">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="info-section">
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>系统说明</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="技术栈">
            Vue 3 + Vite + Element Plus + vue-plugin-hiprint
          </el-descriptions-item>
          <el-descriptions-item label="打印方式">
            浏览器打印 / 客户端打印
          </el-descriptions-item>
          <el-descriptions-item label="模板格式">
            JSON（支持导入/导出）
          </el-descriptions-item>
          <el-descriptions-item label="数据格式">
            JavaScript 对象（支持自定义）
          </el-descriptions-item>
          <el-descriptions-item label="浏览器兼容">
            Chrome / Edge / Firefox（推荐 Chrome）
          </el-descriptions-item>
          <el-descriptions-item label="开源协议">
            MIT
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>

    <div class="steps-section">
      <h2 class="section-title">使用步骤</h2>
      <el-steps :active="steps.length" finish-status="success" align-center>
        <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.description" />
      </el-steps>
    </div>

    <!-- 演示对话框 -->
    <el-dialog
      v-model="demoDialogVisible"
      title="系统演示"
      width="900px"
    >
      <div class="demo-content">
        <el-carousel height="400px" indicator-position="outside">
          <el-carousel-item v-for="(demo, index) in demos" :key="index">
            <div class="demo-slide">
              <h3>{{ demo.title }}</h3>
              <p>{{ demo.description }}</p>
              <div class="demo-image">
                <el-icon :size="100" color="#409EFF">
                  <component :is="demo.icon" />
                </el-icon>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Van,
  Edit,
  VideoPlay,
  InfoFilled,
  Monitor,
  EditPen,
  Printer,
  Download,
  Setting
} from '@element-plus/icons-vue'

const router = useRouter()

const demoDialogVisible = ref(false)

const features = [
  {
    title: '可视化设计',
    description: '拖拽式设计器，无需编写代码即可创建专业物流面单模板',
    icon: Monitor,
    color: '#409EFF'
  },
  {
    title: '丰富组件',
    description: '支持文本、图片、表格、条形码、二维码等多种打印元素',
    icon: EditPen,
    color: '#67C23A'
  },
  {
    title: '灵活打印',
    description: '支持浏览器打印预览和客户端直接打印两种模式',
    icon: Printer,
    color: '#E6A23C'
  },
  {
    title: '模板管理',
    description: '可保存、加载、导入、导出模板，方便模板复用和共享',
    icon: Setting,
    color: '#F56C6C'
  }
]

const steps = [
  { title: '设计模板', description: '从左侧拖拽组件到画布，设计面单布局' },
  { title: '设置参数', description: '在右侧面板设置组件参数和样式' },
  { title: '编辑数据', description: '填写或导入物流面单打印数据' },
  { title: '预览打印', description: '预览打印效果并输出到打印机' }
]

const demos = [
  {
    title: '1. 创建模板',
    description: '点击"创建面单模板"进入设计器，从左侧面板拖拽组件到中间画布',
    icon: EditPen
  },
  {
    title: '2. 设计布局',
    description: '设置组件位置、大小、字体、边框等属性，调整面单布局',
    icon: Monitor
  },
  {
    title: '3. 编辑数据',
    description: '点击"编辑数据"按钮，填写发货人、收货人、商品等信息',
    icon: Edit
  },
  {
    title: '4. 预览打印',
    description: '点击"预览打印"查看效果，确认后点击浏览器打印按钮',
    icon: Printer
  },
  {
    title: '5. 保存模板',
    description: '设计完成后，点击"保存模板"方便下次使用',
    icon: Download
  }
]

function goToDesigner() {
  router.push('/designer')
}

function showDemo() {
  demoDialogVisible.value = true
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .el-icon {
    font-size: 56px;
  }
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 20px;

  .el-button {
    padding: 15px 40px;
    font-size: 16px;
  }
}

.features-section {
  max-width: 1200px;
  margin: -60px auto 40px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.feature-card {
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .feature-icon {
    margin-bottom: 15px;
  }

  .feature-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #303133;
  }

  .feature-description {
    font-size: 14px;
    color: #606266;
    line-height: 1.6;
  }
}

.info-section {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
}

.steps-section {
  max-width: 1000px;
  margin: 40px auto 60px;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 40px;
  color: white;
}

.demo-content {
  .demo-slide {
    text-align: center;
    padding: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h3 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      color: #606266;
      margin-bottom: 30px;
    }

    .demo-image {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f7fa;
      border-radius: 8px;
      padding: 40px;
    }
  }
}

:deep(.el-carousel__item) {
  background: white;
  border-radius: 8px;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
}
</style>
