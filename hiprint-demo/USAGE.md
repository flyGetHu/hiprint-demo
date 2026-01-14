# 物流面单模板工作台 - 使用说明

## 功能概览

本系统是一个完整的物流面单模板设计和管理平台，支持从可视化设计到后端 PDF 生成的完整流程。

### ✨ 已实现功能

1. ✅ **纸张规格选择** - 支持 10×10cm、10×15cm、A4 预设和自定义尺寸
2. ✅ **可视化拖拽设计** - 直观的拖拽式面单布局设计
3. ✅ **模板分类管理** - 按纸张尺寸分类保存和管理模板
4. ✅ **模板验证** - 检查字段映射和数据完整性
5. ✅ **示例数据填充** - 内置物流面单测试数据，可实时编辑
6. ✅ **模板导出** - 导出 JSON 格式模板供后端使用
7. ✅ **PDF 导出** - 直接导出 PDF 文件（需后端服务支持）
8. ✅ **后端集成示例** - 完整的 node-hiprint-pdf 集成指南

---

## 快速开始

### 1. 启动前端项目

```bash
cd hiprint-demo
npm install
npm run dev
```

访问：http://localhost:3001

### 2. 可选：启动后端 PDF 服务

```bash
# 使用 Docker（推荐）
git clone https://github.com/CcSimple/node-hiprint-pdf.git
cd node-hiprint-pdf
docker compose up -d

# 或本地运行
npm install
npm run start
```

后端服务将在 http://localhost:3000 启动

---

## 使用流程

### 步骤 1：选择纸张规格

1. 进入设计器页面（点击首页"创建面单模板"）
2. 在右侧"纸张规格"标签页选择规格：
   - **10×10cm** - 小型面单
   - **10×15cm** - 标准物流面单（默认）
   - **A4** - A4 纸张
   - **自定义** - 输入任意宽高（单位：cm）

选择后，画布会自动调整尺寸。

### 步骤 2：设计面单布局

1. 从左侧组件面板拖拽组件到中间画布
2. 可用组件包括：
   - 文本 - 单行文字
   - 长文本 - 多行文字
   - 图片 - 显示图片（如 Logo）
   - 表格 - 商品列表
   - 条形码 - 运单号条形码
   - 二维码 - 追踪二维码
   - 横线/竖线 - 分隔线
   - 矩形/椭圆 - 装饰图形
3. 点击画布上的组件，在右侧"参数设置"面板调整属性：
   - 位置（left、top）
   - 尺寸（width、height）
   - 字体大小、颜色
   - 对齐方式
   - 边框、背景等

### 步骤 3：配置数据字段

在组件的"参数设置"面板中：
1. 找到 **"字段"** 属性
2. 输入数据字段路径，如：
   - `sender.name` - 发货人姓名
   - `receiver.address` - 收货人地址
   - `waybill.no` - 运单号
   - `products` - 商品列表（表格组件）

### 步骤 4：测试数据填充

点击顶部"**编辑数据**"按钮，在弹出的对话框中：
1. 填写发货人、收货人、运单等信息
2. 添加或删除商品
3. 修改备注和追踪链接
4. 点击"确定"保存数据

然后点击"**预览打印**"查看效果，验证字段映射是否正确。

### 步骤 5：验证模板

点击"**验证模板**"按钮，系统会检查：
- ✅ 使用的字段列表
- ⚠️ 非标准字段警告
- ⚠️ 缺失必要字段建议

确保模板无误后再导出。

### 步骤 6：保存模板

1. 点击"**保存模板**"按钮
2. 输入模板名称和备注
3. 模板会自动保存到 localStorage
4. 同时保存纸张尺寸信息，方便后续分类查找

### 步骤 7：导出模板

有两种导出方式：

**方式一：导出 JSON 模板**
1. 点击"**导出模板**"按钮
2. 下载 JSON 文件
3. 保存到后端项目或版本控制系统

**方式二：导出 PDF 文件**（需后端服务）
1. 确保后端 hiprint 服务已启动
2. 点击"**导出 PDF**"按钮
3. 系统会调用后端服务生成并下载 PDF

---

## 模板管理

### 分类查看

在"模板管理"标签页：
1. 点击"**加载模板**"按钮
2. 使用顶部分类筛选：
   - 全部
   - 10×10cm
   - 10×15cm
   - A4
   - 自定义

### 加载模板

点击列表中的任意模板即可加载到画布。

### 删除模板

点击模板右侧的"删除"按钮即可删除。

---

## 后端集成

### 1. 保存模板到后端

前端导出模板 JSON 后，保存到后端：

```javascript
// 示例：保存到数据库
const templateJson = {
  name: "标准物流面单",
  paperType: "10x15",
  width: 10,
  height: 15,
  panels: [...]
}

await db.templates.insert(templateJson)
```

### 2. 订单数据转换

将真实订单数据转换为打印格式：

```javascript
// 参见 BACKEND_INTEGRATION.md
function transformOrderToPrintData(order) {
  return {
    sender: { ... },
    receiver: { ... },
    waybill: { ... },
    products: [...]
  }
}
```

### 3. 生成 PDF

调用后端 API：

```javascript
// 使用提供的 hiprintService.js
import { downloadPDF } from './utils/hiprintService'

const template = await getTemplate('template_id')
const printData = transformOrderToPrintData(order)

await downloadPDF(template, printData, `order_${order.id}.pdf`)
```

详细集成说明请参考 **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)**

---

## 标准数据字段

### 发货人信息 (sender)
```javascript
{
  name: '发货人姓名',
  company: '发货人公司',
  phone: '固定电话',
  mobile: '手机号',
  province: '省份',
  city: '城市',
  district: '区/县',
  address: '详细地址',
  postCode: '邮编'
}
```

### 收货人信息 (receiver)
同 sender

### 运单信息 (waybill)
```javascript
{
  no: '运单号',
  date: '开单时间',
  serviceType: '服务类型',
  paymentType: '付款方式',
  weight: '重量',
  freight: '运费',
  totalAmount: '总金额'
}
```

### 商品列表 (products)
```javascript
[
  {
    no: '序号',
    name: '商品名称',
    spec: '规格',
    quantity: '数量',
    price: '单价',
    amount: '金额'
  }
]
```

### 其他信息
```javascript
{
  tracking: {
    url: '追踪链接',
    qrcode: '二维码内容'
  },
  remark: '备注信息',
  logo: 'Logo URL'
}
```

---

## 常见问题

### Q1: 如何修改纸张尺寸？
A: 在右侧"纸张规格"标签页选择预设或输入自定义尺寸。

### Q2: 如何添加自定义字段？
A: 在组件的"字段"属性中输入自定义路径，如 `customField.orderType`。

### Q3: PDF 导出失败怎么办？
A: 检查后端服务是否启动，确认服务地址配置正确。

### Q4: 如何批量生成 PDF？
A: 参考 `hiprintService.js` 中的 `downloadBatchPDF` 函数。

### Q5: 模板在不同尺寸间转换？
A: 加载模板后，选择新的纸张规格，手动调整组件位置和大小。

---

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **UI 组件**: Element Plus
- **打印引擎**: vue-plugin-hiprint
- **后端服务**: node-hiprint-pdf (Puppeteer)
- **数据验证**: 自定义字段验证工具

---

## 项目结构

```
hiprint-demo/
├── src/
│   ├── components/
│   │   ├── DraggableModules.vue      # 左侧拖拽组件
│   │   ├── LogisticsDesigner.vue     # 主设计器
│   │   ├── TemplateManager.vue       # 模板管理
│   │   └── PaperSizeSelector.vue     # 纸张规格选择
│   ├── utils/
│   │   ├── logisticsData.js          # 物流数据模型
│   │   ├── defaultTemplate.js        # 默认模板
│   │   ├── templateValidator.js      # 模板验证工具
│   │   └── hiprintService.js        # 后端 API 封装
│   ├── views/
│   │   ├── Home.vue                  # 首页
│   │   └── Designer.vue              # 设计器页面
│   └── App.vue                      # 根组件
├── BACKEND_INTEGRATION.md            # 后端集成指南
└── package.json
```

---

## 开发说明

### 添加新组件

在 `DraggableModules.vue` 中添加新按钮：

```vue
<div class="ep-draggable-item" tid="customModule.custom">
  <i class="el-icon-star"></i>
  <span>自定义组件</span>
</div>
```

### 自定义验证规则

编辑 `templateValidator.js`，修改 `STANDARD_FIELDS` 和验证逻辑。

### 调整纸张预设

编辑 `PaperSizeSelector.vue`，修改 `presetPapers` 数组。

---

## 许可证

MIT License

---

## 支持

如有问题或建议，请提交 Issue 或 Pull Request。
