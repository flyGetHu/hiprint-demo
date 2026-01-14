<template>
  <div class="logistics-designer">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <el-button-group>
        <el-button type="primary" @click="handlePreview" :icon="View">
          预览打印
        </el-button>
        <el-button @click="handleDirectPrint" :icon="Printer">
          直接打印
        </el-button>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button-group>
        <el-button @click="handleUndo" :icon="RefreshLeft" :disabled="!canUndo">
          撤销
        </el-button>
        <el-button @click="handleRedo" :icon="RefreshRight" :disabled="!canRedo">
          重做
        </el-button>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button @click="showDataDialog = true" :icon="Edit">
        编辑数据
      </el-button>

      <el-divider direction="vertical" />

      <el-button type="success" @click="handleExportPDF" :icon="Download">
        导出 PDF
      </el-button>

      <div class="spacer"></div>

      <el-tag type="success">{{ paperType }}</el-tag>
    </div>

    <!-- 主体区域 -->
    <div class="designer-container">
      <!-- 左侧组件面板 -->
      <div class="left-panel">
        <DraggableModules />
      </div>

      <!-- 中间设计区域 -->
      <div class="center-area">
        <div id="hiprint-printTemplate" class="print-template"></div>
      </div>

      <!-- 右侧参数设置 -->
      <div class="right-panel">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="纸张规格" name="paper">
            <PaperSizeSelector
              v-model="paperSize"
              @change="handlePaperSizeChange"
            />
          </el-tab-pane>
          <el-tab-pane label="参数设置" name="setting">
            <div id="PrintElementOptionSetting" class="setting-container"></div>
          </el-tab-pane>
          <el-tab-pane label="模板管理" name="template">
            <TemplateManager
              ref="templateManagerRef"
              :hiprint-template="hiprintTemplate"
              @template-loaded="handleTemplateLoaded"
              @template-cleared="handleTemplateCleared"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 数据编辑对话框 -->
    <el-dialog
      v-model="showDataDialog"
      title="打印数据"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="printData" label-width="100px">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="发货人信息" name="sender">
            <el-form-item label="姓名">
              <el-input v-model="printData.sender.name" />
            </el-form-item>
            <el-form-item label="公司">
              <el-input v-model="printData.sender.company" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="printData.sender.phone" />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="printData.sender.mobile" />
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="printData.sender.address" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="收货人信息" name="receiver">
            <el-form-item label="姓名">
              <el-input v-model="printData.receiver.name" />
            </el-form-item>
            <el-form-item label="公司">
              <el-input v-model="printData.receiver.company" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="printData.receiver.phone" />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="printData.receiver.mobile" />
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="printData.receiver.address" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="运单信息" name="waybill">
            <el-form-item label="运单号">
              <el-input v-model="printData.waybill.no" />
            </el-form-item>
            <el-form-item label="服务类型">
              <el-input v-model="printData.waybill.serviceType" />
            </el-form-item>
            <el-form-item label="付款方式">
              <el-input v-model="printData.waybill.paymentType" />
            </el-form-item>
            <el-form-item label="重量">
              <el-input v-model="printData.waybill.weight" />
            </el-form-item>
            <el-form-item label="运费">
              <el-input v-model="printData.waybill.freight" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="商品列表" name="products">
            <el-button
              size="small"
              @click="addProduct"
              :icon="Plus"
              style="margin-bottom: 10px"
            >
              添加商品
            </el-button>
            <div
              v-for="(product, index) in printData.products"
              :key="index"
              class="product-item"
            >
              <el-card>
                <template #header>
                  <span>商品 {{ index + 1 }}</span>
                  <el-button
                    type="danger"
                    size="small"
                    link
                    @click="removeProduct(index)"
                    style="float: right"
                  >
                    删除
                  </el-button>
                </template>
                <el-form-item label="名称">
                  <el-input v-model="product.name" />
                </el-form-item>
                <el-form-item label="规格">
                  <el-input v-model="product.spec" />
                </el-form-item>
                <el-form-item label="数量">
                  <el-input-number v-model="product.quantity" :min="1" />
                </el-form-item>
                <el-form-item label="单价">
                  <el-input v-model="product.price" />
                </el-form-item>
              </el-card>
            </div>
          </el-collapse-item>

          <el-collapse-item title="其他信息" name="other">
            <el-form-item label="备注">
              <el-input
                v-model="printData.remark"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="追踪链接">
              <el-input v-model="printData.tracking.url" />
            </el-form-item>
            <el-form-item label="Logo URL">
              <el-input v-model="printData.logo" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <template #footer>
        <el-button @click="resetData">重置数据</el-button>
        <el-button type="primary" @click="showDataDialog = false">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  View,
  Printer,
  RefreshLeft,
  RefreshRight,
  Edit,
  Plus,
  Download
} from '@element-plus/icons-vue'
import { hiprint, defaultElementTypeProvider } from 'vue-plugin-hiprint'
import DraggableModules from './DraggableModules.vue'
import TemplateManager from './TemplateManager.vue'
import PaperSizeSelector from './PaperSizeSelector.vue'
import { logisticsPrintData } from '../utils/logisticsData'
import { defaultLogisticsTemplate } from '../utils/defaultTemplate'
import { downloadPDF, checkServiceHealth } from '../utils/hiprintService'

const emit = defineEmits(['print'])

// 状态
const hiprintTemplate = ref(null)
const activeTab = ref('paper')
const showDataDialog = ref(false)
const printData = ref(JSON.parse(JSON.stringify(logisticsPrintData)))
const canUndo = ref(false)
const canRedo = ref(false)
const paperType = ref('10x15')
const paperSize = ref({
  width: 10,
  height: 15,
  paperType: '10x15'
})
const templateManagerRef = ref(null)
const activeCollapse = ref(['sender', 'receiver', 'waybill'])

// 初始化设计器
onMounted(() => {
  initHiprint()
})

function initHiprint() {
  try {
    // 初始化 hiprint
    hiprint.init({
      providers: [new defaultElementTypeProvider()],
      lang: 'zh'
    })

    // 创建模板实例
    hiprintTemplate.value = new hiprint.PrintTemplate({
      template: {},
      settingContainer: '#PrintElementOptionSetting',
      paginationContainer: '.hiprint-printPagination',
      fontList: [
        { title: '微软雅黑', value: 'Microsoft YaHei' },
        { title: '宋体', value: 'SimSun' },
        { title: '黑体', value: 'SimHei' },
        { title: 'Arial', value: 'Arial' }
      ],
      dataMode: 1,
      history: true
    })

    // 渲染设计器
    nextTick(() => {
      hiprintTemplate.value.design('#hiprint-printTemplate')

      // 构建拖拽元素
      if (window.$) {
        hiprint.PrintElementTypeManager.buildByHtml(
          window.$('.ep-draggable-item')
        )
      }

      // 加载默认模板
      hiprintTemplate.value.update(defaultLogisticsTemplate)

      // 监听模板变更
      hiprintTemplate.value.on('updateOption', () => {
        updateHistoryState()
      })

      ElMessage.success('设计器初始化成功')
    })
  } catch (e) {
    console.error('初始化失败:', e)
    ElMessage.error('设计器初始化失败: ' + e.message)
  }
}

// 更新历史状态
function updateHistoryState() {
  if (hiprintTemplate.value) {
    // hiprint 的历史记录功能需要手动实现
    // 这里简化处理
  }
}

// 预览打印
function handlePreview() {
  if (!hiprintTemplate.value) {
    ElMessage.error('设计器未初始化')
    return
  }

  try {
    hiprintTemplate.value.print(printData.value, {
      styleHandler: () => {
        return '<style>.hiprint-printPaper{background:white;}</style>'
      }
    })
    emit('print', printData.value)
  } catch (e) {
    ElMessage.error('预览失败: ' + e.message)
  }
}

// 直接打印
function handleDirectPrint() {
  if (!hiprintTemplate.value) {
    ElMessage.error('设计器未初始化')
    return
  }

  try {
    hiprintTemplate.value.print2(printData.value, {
      printer: '',
      title: '物流面单'
    })
    ElMessage.warning('直接打印需要安装客户端程序')
  } catch (e) {
    ElMessage.error('打印失败: ' + e.message)
  }
}

// 撤销
function handleUndo() {
  ElMessage.info('撤销功能需要额外实现历史记录')
}

// 重做
function handleRedo() {
  ElMessage.info('重做功能需要额外实现历史记录')
}

// 添加商品
function addProduct() {
  printData.value.products.push({
    no: String(printData.value.products.length + 1),
    name: '新商品',
    spec: '',
    quantity: 1,
    price: '0.00',
    amount: '0.00'
  })
}

// 删除商品
function removeProduct(index) {
  if (printData.value.products.length > 1) {
    printData.value.products.splice(index, 1)
    // 重新编号
    printData.value.products.forEach((p, i) => {
      p.no = String(i + 1)
    })
  } else {
    ElMessage.warning('至少保留一个商品')
  }
}

// 重置数据
function resetData() {
  printData.value = JSON.parse(JSON.stringify(logisticsPrintData))
  ElMessage.success('数据已重置')
}

// 模板加载完成
function handleTemplateLoaded(template) {
  if (template && template.panels && template.panels[0]) {
    const panel = template.panels[0]
    paperType.value = panel.paperType || '10x15'
    paperSize.value = {
      width: panel.width || 10,
      height: panel.height || 15,
      paperType: panel.paperType || '10x15'
    }
  }
}

function handleTemplateCleared() {
  paperType.value = '10x15'
  paperSize.value = {
    width: 10,
    height: 15,
    paperType: '10x15'
  }
}

async function handleExportPDF() {
  if (!hiprintTemplate.value) {
    ElMessage.error('设计器未初始化')
    return
  }

  try {
    const isServiceAvailable = await checkServiceHealth()
    if (!isServiceAvailable) {
      ElMessage.warning('hiprint 服务未启动，请先启动后端服务')
      return
    }

    const template = hiprintTemplate.value.getJson()
    const filename = `logistics_${Date.now()}.pdf`

    ElMessage.info('正在生成 PDF，请稍候...')
    await downloadPDF(template, printData.value, filename)
    ElMessage.success('PDF 导出成功')
  } catch (e) {
    ElMessage.error('导出 PDF 失败: ' + e.message)
  }
}

function handlePaperSizeChange(size) {
  if (!hiprintTemplate.value || !size) {
    return
  }

  try {
    const templateJson = hiprintTemplate.value.getJson()
    if (templateJson && templateJson.panels && templateJson.panels[0]) {
      templateJson.panels[0].width = size.width
      templateJson.panels[0].height = size.height
      templateJson.panels[0].paperType = size.paperType

      hiprintTemplate.value.clear()
      nextTick(() => {
        hiprintTemplate.value.design('#hiprint-printTemplate', { template: templateJson })
        hiprintTemplate.value.update(templateJson)
        paperType.value = size.paperType || `${size.width}x${size.height}`

        if (templateManagerRef.value) {
          templateManagerRef.value.setCurrentPaperSize(size)
        }

        ElMessage.success(`纸张尺寸已更新为 ${size.width}×${size.height}cm`)
      })
    }
  } catch (e) {
    ElMessage.error('更新纸张尺寸失败: ' + e.message)
  }
}

// 清理
onBeforeUnmount(() => {
  if (hiprintTemplate.value) {
    hiprintTemplate.value.clear()
  }
})
</script>

<style scoped lang="scss">
.logistics-designer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.action-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #dcdfe6;
  gap: 10px;

  .spacer {
    flex: 1;
  }
}

.designer-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 200px;
  background: #f5f7fa;
  border-right: 1px solid #dcdfe6;
  overflow-y: auto;
}

.center-area {
  flex: 1;
  padding: 20px;
  background: #e8e8e8;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  :deep(.hiprint-printPaper) {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.right-panel {
  width: 320px;
  background: #f5f7fa;
  border-left: 1px solid #dcdfe6;

  :deep(.el-tabs) {
    height: 100%;

    .el-tabs__content {
      height: calc(100% - 55px);
      overflow: auto;
    }
  }
}

.setting-container {
  padding: 10px;
  height: 100%;
  overflow: auto;
}

.product-item {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-collapse-item__header) {
  font-weight: bold;
}
</style>
