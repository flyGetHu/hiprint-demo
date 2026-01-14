# 后端集成指南 - node-hiprint-pdf

本文档介绍如何使用 `node-hiprint-pdf` 服务在后端生成 PDF 面单。

## 1. 服务部署

### 1.1 使用 Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/CcSimple/node-hiprint-pdf.git
cd node-hiprint-pdf

# 启动服务
docker compose up -d

# 服务将在 http://localhost:3000 启动
```

### 1.2 本地部署

```bash
# 1. 克隆项目
git clone https://github.com/CcSimple/node-hiprint-pdf.git
cd node-hiprint-pdf

# 2. 安装依赖
npm install

# 3. 启动服务
npm run start

# 服务将在 http://localhost:3000 启动
```

### 1.3 配置说明

服务默认配置：
- 端口：3000
- PDF API：`POST http://localhost:3000/pdf`
- 图片 API：`POST http://localhost:3000/img`
- HTML API：`POST http://localhost:3000/html`

## 2. API 接口说明

### 2.1 生成 PDF

**接口**: `POST /pdf`

**请求参数**:
```javascript
{
  template: {},      // hiprint 模板 JSON
  printData: {},     // 打印数据 JSON
  options: {         // Puppeteer PDF 选项（可选）
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  },
  url: '',          // 自定义渲染页面（可选）
  noFile: false     // true: 不生成文件, false: 生成文件
}
```

**响应**:
- 成功：返回 PDF 文件
- 失败：返回错误信息

### 2.2 生成图片

**接口**: `POST /img`

**请求参数**:
```javascript
{
  template: {},      // hiprint 模板 JSON
  printData: {},     // 打印数据 JSON
  options: {         // Puppeteer 截图选项（可选）
    type: 'png',
    fullPage: true
  },
  url: '',          // 自定义渲染页面（可选）
  noFile: false     // true: 不生成文件, false: 生成文件
}
```

### 2.3 生成 HTML

**接口**: `POST /html`

**请求参数**:
```javascript
{
  template: {},      // hiprint 模板 JSON
  printData: {},     // 打印数据 JSON
  domId: '#hiprintTemplate',  // 获取指定节点的 html
  url: '',          // 自定义渲染页面（可选）
  noFile: false     // true: 不生成文件, false: 生成文件
}
```

## 3. 前端调用示例

### 3.1 导出模板并生成 PDF

```javascript
import axios from 'axios'

// hiprint 服务地址
const HIPRINT_SERVICE_URL = 'http://localhost:3000'

/**
 * 导出模板并生成 PDF
 * @param {Object} template - hiprint 模板 JSON
 * @param {Object} printData - 打印数据
 * @returns {Promise<Blob>} PDF 文件
 */
export async function generatePDF(template, printData) {
  try {
    const response = await axios.post(`${HIPRINT_SERVICE_URL}/pdf`, {
      template,
      printData,
      options: {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          bottom: '0mm',
          left: '0mm',
          right: '0mm'
        }
      }
    }, {
      responseType: 'blob'
    })

    // 下载 PDF
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `logistics_${Date.now()}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return response.data
  } catch (error) {
    console.error('生成 PDF 失败:', error)
    throw error
  }
}

/**
 * 批量生成 PDF
 * @param {Object} template - hiprint 模板 JSON
 * @param {Array} dataList - 打印数据数组
 * @returns {Promise<Array>} PDF 文件数组
 */
export async function generateBatchPDF(template, dataList) {
  const promises = dataList.map(data => generatePDF(template, data))
  return Promise.all(promises)
}
```

### 3.2 集成到 LogisticsDesigner 组件

```vue
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generatePDF, generateBatchPDF } from '../utils/hiprintService'

const props = defineProps({
  hiprintTemplate: {
    type: Object,
    required: true
  },
  printData: {
    type: Object,
    required: true
  }
})

async function handleExportPDF() {
  try {
    const template = props.hiprintTemplate.getJson()
    await generatePDF(template, props.printData)
    ElMessage.success('PDF 导出成功')
  } catch (error) {
    ElMessage.error('PDF 导出失败: ' + error.message)
  }
}

async function handleBatchExport() {
  try {
    const template = props.hiprintTemplate.getJson()
    const batchData = getBatchPrintData() // 获取批量数据
    await generateBatchPDF(template, batchData)
    ElMessage.success(`成功导出 ${batchData.length} 个 PDF`)
  } catch (error) {
    ElMessage.error('批量导出失败: ' + error.message)
  }
}
</script>
```

## 4. 后端集成示例

### 4.1 Node.js Express 服务集成

```javascript
const express = require('express')
const axios = require('axios')
const FormData = require('form-data')

const app = express()
const HIPRINT_SERVICE_URL = 'http://localhost:3000'

// 中间件
app.use(express.json())

/**
 * 真实订单数据转换为打印数据格式
 */
function transformOrderToPrintData(order) {
  return {
    sender: {
      name: order.senderName,
      company: order.senderCompany,
      phone: order.senderPhone,
      mobile: order.senderMobile,
      province: order.senderProvince,
      city: order.senderCity,
      district: order.senderDistrict,
      address: order.senderAddress,
      postCode: order.senderPostCode
    },
    receiver: {
      name: order.receiverName,
      company: order.receiverCompany,
      phone: order.receiverPhone,
      mobile: order.receiverMobile,
      province: order.receiverProvince,
      city: order.receiverCity,
      district: order.receiverDistrict,
      address: order.receiverAddress,
      postCode: order.receiverPostCode
    },
    waybill: {
      no: order.waybillNo,
      date: order.orderTime,
      serviceType: order.serviceType,
      paymentType: order.paymentType,
      weight: order.weight,
      freight: order.freight,
      totalAmount: order.totalAmount
    },
    products: order.products.map((product, index) => ({
      no: String(index + 1),
      name: product.productName,
      spec: product.specification,
      quantity: product.quantity,
      price: product.price,
      amount: product.amount
    })),
    tracking: {
      url: `https://www.logistics.com/track/${order.waybillNo}`,
      qrcode: `https://www.logistics.com/track/${order.waybillNo}`
    },
    remark: order.remark,
    logo: order.logoUrl || 'https://example.com/logo.png'
  }
}

/**
 * 生成单个订单 PDF
 */
app.post('/api/orders/:orderId/pdf', async (req, res) => {
  try {
    const { orderId } = req.params

    // 1. 从数据库获取订单
    const order = await getOrderFromDatabase(orderId)
    if (!order) {
      return res.status(404).json({ error: '订单不存在' })
    }

    // 2. 获取对应的模板
    const template = await getTemplate(order.templateId)

    // 3. 转换数据格式
    const printData = transformOrderToPrintData(order)

    // 4. 调用 hiprint 服务生成 PDF
    const response = await axios.post(`${HIPRINT_SERVICE_URL}/pdf`, {
      template,
      printData,
      options: {
        format: template.paperType || 'A4',
        printBackground: true
      }
    }, {
      responseType: 'arraybuffer'
    })

    // 5. 返回 PDF 文件
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="order_${orderId}.pdf"`
    })
    res.send(response.data)

  } catch (error) {
    console.error('生成 PDF 失败:', error)
    res.status(500).json({ error: '生成 PDF 失败' })
  }
})

/**
 * 批量生成订单 PDF
 */
app.post('/api/orders/batch/pdf', async (req, res) => {
  try {
    const { orderIds } = req.body

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: '请提供订单ID列表' })
    }

    // 1. 批量获取订单
    const orders = await getOrdersFromDatabase(orderIds)

    // 2. 获取模板（假设使用同一个模板）
    const templateId = orders[0].templateId
    const template = await getTemplate(templateId)

    // 3. 逐个生成 PDF
    const pdfPromises = orders.map(async (order) => {
      const printData = transformOrderToPrintData(order)
      const response = await axios.post(`${HIPRINT_SERVICE_URL}/pdf`, {
        template,
        printData,
        options: {
          format: template.paperType || 'A4',
          printBackground: true
        }
      }, {
        responseType: 'arraybuffer'
      })
      return {
        orderId: order.id,
        pdf: response.data
      }
    })

    const results = await Promise.all(pdfPromises)

    // 4. 返回结果（实际应用中可能需要打包成 ZIP）
    res.json({
      success: true,
      total: results.length,
      data: results.map(r => ({
        orderId: r.orderId,
        size: r.pdf.length
      }))
    })

  } catch (error) {
    console.error('批量生成 PDF 失败:', error)
    res.status(500).json({ error: '批量生成 PDF 失败' })
  }
})

// 辅助函数（需要根据实际数据库实现）
async function getOrderFromDatabase(orderId) {
  // 从数据库查询订单
  return {
    id: orderId,
    templateId: 'template_10x15',
    waybillNo: 'SF1234567890',
    orderTime: '2024-01-15 10:30',
    serviceType: '标准快递',
    paymentType: '寄付',
    weight: '2.5',
    freight: '23.00',
    totalAmount: '15117.00',
    senderName: '张三',
    senderCompany: '某某公司',
    senderPhone: '021-12345678',
    senderMobile: '13900139000',
    senderProvince: '广东省',
    senderCity: '深圳市',
    senderDistrict: '南山区',
    senderAddress: '科技园南区',
    senderPostCode: '518000',
    receiverName: '李四',
    receiverCompany: '某某科技有限公司',
    receiverPhone: '021-87654321',
    receiverMobile: '13800138000',
    receiverProvince: '上海市',
    receiverCity: '上海市',
    receiverDistrict: '浦东新区',
    receiverAddress: '世纪大道100号',
    receiverPostCode: '200120',
    products: [
      {
        productName: 'MacBook Pro',
        specification: '14寸',
        quantity: 1,
        price: '14999.00',
        amount: '14999.00'
      }
    ],
    remark: '易碎品',
    logoUrl: 'https://example.com/logo.png'
  }
}

async function getOrdersFromDatabase(orderIds) {
  // 批量查询订单
  return orderIds.map(id => getOrderFromDatabase(id))
}

async function getTemplate(templateId) {
  // 从数据库或文件系统获取模板
  // 示例：使用 localStorage 中的模板
  const templates = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key === templateId || key.startsWith('template_')) {
      const data = JSON.parse(localStorage.getItem(key))
      templates.push(data)
    }
  }
  return templates[0]?.template || null
}

// 启动服务
const PORT = 3001
app.listen(PORT, () => {
  console.log(`API 服务运行在 http://localhost:${PORT}`)
})
```

## 5. 数据转换映射

### 5.1 订单字段映射表

| 业务字段 | 打印数据字段 | 说明 |
|---------|-------------|------|
| orderId | - | 订单ID（内部使用） |
| waybillNo | waybill.no | 运单号 |
| orderTime | waybill.date | 开单时间 |
| serviceType | waybill.serviceType | 服务类型 |
| paymentType | waybill.paymentType | 付款方式 |
| senderName | sender.name | 发货人姓名 |
| senderMobile | sender.mobile | 发货人手机 |
| senderAddress | sender.address | 发货人地址 |
| receiverName | receiver.name | 收货人姓名 |
| receiverMobile | receiver.mobile | 收货人手机 |
| receiverAddress | receiver.address | 收货人地址 |
| products[].productName | products[].name | 商品名称 |
| products[].quantity | products[].quantity | 商品数量 |

### 5.2 自定义字段映射

如果需要添加自定义字段，可以在模板中使用：

```javascript
// 前端设计器中
{
  options: {
    left: 10,
    top: 50,
    field: 'customField.orderType',  // 自定义字段路径
    title: '订单类型'
  },
  printElementType: { title: '文本', tid: 'defaultModule.text' }
}

// 后端转换时
function transformOrderToPrintData(order) {
  return {
    // ... 标准字段
    customField: {
      orderType: order.orderType || '普通订单',
      priority: order.priority || '正常',
      customNote: order.note || ''
    }
  }
}
```

## 6. 生产环境注意事项

### 6.1 性能优化

1. **批量处理**: 使用队列处理大批量 PDF 生成请求
2. **缓存**: 缓存常用模板，减少重复加载
3. **负载均衡**: 部署多个 hiprint 服务实例，使用负载均衡分发请求

### 6.2 安全性

1. **认证**: 添加 API 认证机制
2. **限流**: 限制单个用户的请求频率
3. **验证**: 验证模板和数据的合法性

### 6.3 监控

1. 监控 PDF 生成成功率和耗时
2. 设置告警机制
3. 记录错误日志

## 7. 故障排查

### 7.1 常见问题

**问题**: 生成 PDF 失败，返回错误
**解决方案**:
- 检查 hiprint 服务是否正常运行
- 验证模板格式是否正确
- 检查数据字段是否完整

**问题**: PDF 样式不正确
**解决方案**:
- 确认模板中使用了正确的 CSS 样式
- 检查打印数据是否包含所有必需字段
- 使用验证工具检查模板字段映射

### 7.2 调试方法

```javascript
// 1. 生成 HTML 预览
const response = await axios.post(`${HIPRINT_SERVICE_URL}/html`, {
  template,
  printData,
  domId: '#hiprintTemplate'
})
console.log(response.data) // 查看 HTML

// 2. 生成图片预览
const response = await axios.post(`${HIPRINT_SERVICE_URL}/img`, {
  template,
  printData,
  options: {
    type: 'png',
    fullPage: true
  }
})
// 保存图片查看效果
```

## 8. 总结

通过以上步骤，您可以：
1. ✅ 在设计器中创建和保存模板
2. ✅ 导出模板 JSON 供后端使用
3. ✅ 在后端调用 hiprint 服务生成 PDF
4. ✅ 支持单个订单和批量订单 PDF 生成
5. ✅ 灵活映射业务字段到打印数据

整个流程实现了从可视化设计到生产打印的完整闭环！
