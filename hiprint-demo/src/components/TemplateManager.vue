<template>
  <div class="template-manager">
    <el-button type="primary" @click="showSaveDialog" :icon="Plus">
      保存模板
    </el-button>

    <el-button @click="showLoadDialog" :icon="FolderOpened">
      加载模板
    </el-button>

    <el-button @click="exportTemplate" :icon="Download">
      导出模板
    </el-button>

    <el-upload
      :show-file-list="false"
      :before-upload="importTemplate"
      accept=".json"
      style="display: inline-block; margin-left: 10px"
    >
      <el-button :icon="Upload">导入模板</el-button>
    </el-upload>

    <el-divider />

    <div class="quick-actions">
      <div class="action-title">快速操作</div>
      <el-button size="small" @click="loadDefaultTemplate" :icon="MagicStick">
        加载默认模板
      </el-button>
      <el-button size="small" @click="clearTemplate" :icon="Delete">
        清空画布
      </el-button>
    </div>

    <!-- 保存模板对话框 -->
    <el-dialog
      v-model="saveDialogVisible"
      title="保存模板"
      width="400px"
    >
      <el-form :model="saveForm" label-width="80px">
        <el-form-item label="模板名称">
          <el-input
            v-model="saveForm.name"
            placeholder="请输入模板名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="saveForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 加载模板对话框 -->
    <el-dialog
      v-model="loadDialogVisible"
      title="加载模板"
      width="500px"
    >
      <el-table
        :data="savedTemplates"
        @row-click="handleLoad"
        style="cursor: pointer"
      >
        <el-table-column prop="name" label="模板名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              link
              @click.stop="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty
        v-if="savedTemplates.length === 0"
        description="暂无保存的模板"
      />
      <template #footer>
        <el-button @click="loadDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  FolderOpened,
  Download,
  Upload,
  MagicStick,
  Delete
} from '@element-plus/icons-vue'
import { defaultLogisticsTemplate } from '../utils/defaultTemplate'

const props = defineProps({
  hiprintTemplate: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['template-loaded', 'template-cleared'])

// 保存对话框
const saveDialogVisible = ref(false)
const saveForm = ref({
  name: '',
  remark: ''
})

// 加载对话框
const loadDialogVisible = ref(false)

// 保存的模板列表
const savedTemplates = ref([])

// 初始化：从 localStorage 加载模板列表
onMounted(() => {
  loadTemplateList()
})

// 加载模板列表
function loadTemplateList() {
  const templates = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('template_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key))
        templates.push({
          key: key,
          name: data.name || key.replace('template_', ''),
          remark: data.remark || '',
          createTime: data.createTime || new Date().toLocaleString(),
          template: data.template
        })
      } catch (e) {
        console.error('加载模板失败:', e)
      }
    }
  }
  savedTemplates.value = templates.sort(
    (a, b) => new Date(b.createTime) - new Date(a.createTime)
  )
}

// 显示保存对话框
function showSaveDialog() {
  saveForm.value = {
    name: '',
    remark: ''
  }
  saveDialogVisible.value = true
}

// 保存模板
function handleSave() {
  if (!saveForm.value.name.trim()) {
    ElMessage.warning('请输入模板名称')
    return
  }

  if (!props.hiprintTemplate) {
    ElMessage.error('模板对象不存在')
    return
  }

  try {
    const templateJson = props.hiprintTemplate.getJson()
    const key = `template_${saveForm.value.name}`

    // 检查是否已存在
    if (localStorage.getItem(key)) {
      ElMessageBox.confirm(
        `模板 "${saveForm.value.name}" 已存在，是否覆盖？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        saveToLocalStorage(key, templateJson)
      })
    } else {
      saveToLocalStorage(key, templateJson)
    }
  } catch (e) {
    ElMessage.error('保存模板失败: ' + e.message)
  }
}

// 保存到 localStorage
function saveToLocalStorage(key, templateJson) {
  const data = {
    name: saveForm.value.name,
    remark: saveForm.value.remark,
    createTime: new Date().toLocaleString(),
    template: templateJson
  }

  localStorage.setItem(key, JSON.stringify(data))
  ElMessage.success('模板保存成功')
  saveDialogVisible.value = false
  loadTemplateList()
}

// 显示加载对话框
function showLoadDialog() {
  loadTemplateList()
  loadDialogVisible.value = true
}

// 加载模板
function handleLoad(row) {
  if (row.template) {
    try {
      props.hiprintTemplate.update(row.template)
      emit('template-loaded', row.template)
      ElMessage.success(`模板 "${row.name}" 加载成功`)
      loadDialogVisible.value = false
    } catch (e) {
      ElMessage.error('加载模板失败: ' + e.message)
    }
  }
}

// 删除模板
function handleDelete(row) {
  ElMessageBox.confirm(`确定删除模板 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem(row.key)
    ElMessage.success('删除成功')
    loadTemplateList()
  })
}

// 导出模板
function exportTemplate() {
  try {
    const templateJson = props.hiprintTemplate.getJson()
    const blob = new Blob([JSON.stringify(templateJson, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logistics_template_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('模板导出成功')
  } catch (e) {
    ElMessage.error('导出模板失败: ' + e.message)
  }
}

// 导入模板
function importTemplate(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const templateJson = JSON.parse(e.target.result)
      props.hiprintTemplate.update(templateJson)
      emit('template-loaded', templateJson)
      ElMessage.success('模板导入成功')
    } catch (error) {
      ElMessage.error('导入模板失败：文件格式错误')
    }
  }
  reader.readAsText(file)
  return false // 阻止默认上传
}

// 加载默认模板
function loadDefaultTemplate() {
  try {
    props.hiprintTemplate.update(defaultLogisticsTemplate)
    emit('template-loaded', defaultLogisticsTemplate)
    ElMessage.success('默认模板加载成功')
  } catch (e) {
    ElMessage.error('加载默认模板失败: ' + e.message)
  }
}

// 清空画布
function clearTemplate() {
  ElMessageBox.confirm('确定清空画布吗？此操作不可撤销。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    try {
      props.hiprintTemplate.clear()
      emit('template-cleared')
      ElMessage.success('画布已清空')
    } catch (e) {
      ElMessage.error('清空画布失败: ' + e.message)
    }
  })
}
</script>

<style scoped lang="scss">
.template-manager {
  padding: 15px;
}

.quick-actions {
  margin-top: 15px;
}

.action-title {
  font-size: 13px;
  font-weight: bold;
  color: #606266;
  margin-bottom: 10px;
}

.el-button {
  width: 100%;
  margin-bottom: 10px;
}

:deep(.el-upload) {
  width: 100%;
  .el-button {
    width: 100%;
  }
}
</style>
