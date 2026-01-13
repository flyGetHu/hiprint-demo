# 物流面单打印系统

基于 vue-plugin-hiprint 的可视化物流面单设计与打印解决方案。

## 项目简介

这是一个使用 Vue 3 + Vite + Element Plus + vue-plugin-hiprint 构建的物流面单打印系统。系统提供了可视化拖拽设计器,用户可以轻松创建、编辑和管理物流面单模板,支持预览打印和直接打印。

## 功能特性

- ✅ **可视化设计器**: 拖拽式设计界面,无需编写代码
- ✅ **丰富的组件**: 文本、图片、长文本、表格、条形码、二维码等
- ✅ **模板管理**: 保存、加载、导入、导出模板
- ✅ **实时预览**: 即时预览打印效果
- ✅ **灵活打印**: 支持浏览器打印和客户端打印
- ✅ **数据编辑**: 可视化编辑打印数据
- ✅ **默认模板**: 内置标准物流面单模板

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **打印库**: vue-plugin-hiprint (基于 hiprint 2.5.4)

## 项目结构

```
hiprint-demo/
├── public/                      # 静态资源
├── src/
│   ├── assets/                  # 资源文件
│   │   └── styles/
│   │       └── global.scss      # 全局样式
│   ├── components/              # 组件
│   │   ├── DraggableModules.vue      # 可拖拽组件面板
│   │   ├── LogisticsDesigner.vue     # 物流面单设计器
│   │   └── TemplateManager.vue       # 模板管理器
│   ├── views/                   # 页面视图
│   │   ├── Home.vue             # 首页
│   │   └── Designer.vue         # 设计器页面
│   ├── router/                  # 路由配置
│   │   └── index.js
│   ├── utils/                   # 工具函数
│   │   ├── logisticsData.js     # 物流数据模型
│   │   └── defaultTemplate.js   # 默认模板
│   ├── App.vue                  # 根组件
│   └── main.js                  # 应用入口
├── index.html                   # HTML 模板
├── vite.config.js               # Vite 配置
└── package.json                 # 项目依赖
```

## 安装和运行

### 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 pnpm >= 7.x

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 使用指南

### 1. 创建面单模板

点击首页的"创建面单模板"按钮进入设计器。

### 2. 设计面单

- **添加组件**: 从左侧面板拖拽组件到中间画布
- **编辑组件**: 点击画布上的组件,在右侧面板设置属性
- **调整布局**: 拖拽组件调整位置和大小

### 3. 设置打印数据

点击"编辑数据"按钮,填写发货人、收货人、运单、商品等信息。

### 4. 预览和打印

- **预览打印**: 点击"预览打印"查看效果
- **浏览器打印**: 在预览窗口点击浏览器的打印按钮
- **直接打印**: 点击"直接打印"(需要安装客户端)

### 5. 保存模板

在右侧"模板管理"标签页:
- 点击"保存模板"输入名称保存
- 点击"加载模板"选择已保存的模板
- 点击"导出模板"下载模板文件
- 点击"导入模板"上传模板文件

## 组件说明

### 可拖拽组件

| 组件 | 说明 | 常用场景 |
|------|------|----------|
| 文本 | 单行文本 | 标题、标签、字段值 |
| 图片 | 图片显示 | 公司 Logo |
| 长文本 | 多行文本 | 地址、备注 |
| 表格 | 数据表格 | 商品列表 |
| 条形码 | 条形码 | 运单号 |
| 二维码 | 二维码 | 物流追踪链接 |
| HTML | 自定义 HTML | 复杂布局 |
| 横线/竖线 | 分隔线 | 分隔内容 |
| 矩形/椭圆 | 图形 | 装饰元素 |

### 数据字段

模板中的数据字段支持以下格式:

```javascript
{
  // 发货人信息
  sender: {
    name: '发货人姓名',
    company: '发货人公司',
    phone: '固定电话',
    mobile: '手机号',
    province: '省份',
    city: '城市',
    district: '区/县',
    address: '详细地址',
    postCode: '邮编'
  },

  // 收货人信息
  receiver: {
    // 同 sender
  },

  // 运单信息
  waybill: {
    no: '运单号',
    date: '开单时间',
    serviceType: '服务类型',
    paymentType: '付款方式',
    weight: '重量',
    freight: '运费',
    totalAmount: '总金额'
  },

  // 商品列表
  products: [
    {
      no: '序号',
      name: '商品名称',
      spec: '规格',
      quantity: '数量',
      price: '单价',
      amount: '金额'
    }
  ],

  // 物流追踪
  tracking: {
    url: '追踪链接',
    qrcode: '二维码内容'
  },

  // 备注
  remark: '备注信息',

  // Logo
  logo: '图片 URL 或 Base64'
}
```

## 高级功能

### 客户端直接打印

如需实现静默打印(不弹窗),需要安装 [electron-hiprint](https://gitee.com/CcSimple/electron-hiprint) 客户端。

1. 下载并运行客户端
2. 在 [main.js](src/main.js) 中配置连接:

```javascript
import { hiprint } from 'vue-plugin-hiprint'

hiprint.init({
  host: 'http://localhost:17521',
  token: 'your-token'
})
```

### 批量打印

使用 [logisticsData.js](src/utils/logisticsData.js) 中的 `getRandomLogisticsData` 函数生成批量数据:

```javascript
import { getRandomLogisticsData } from './utils/logisticsData'

const batchData = getRandomLogisticsData(10) // 生成 10 条数据
```

### 自定义模板

参考 [defaultTemplate.js](src/utils/defaultTemplate.js) 创建自定义模板,模板格式为 JSON:

```json
{
  "panels": [
    {
      "index": 0,
      "paperType": "A4",
      "height": 297,
      "width": 210,
      "printElements": [
        {
          "options": {
            "left": 10,
            "top": 10,
            "height": 20,
            "width": 50,
            "title": "文本内容",
            "fontSize": 14
          },
          "printElementType": {
            "title": "文本",
            "tid": "defaultModule.text"
          }
        }
      ]
    }
  ]
}
```

## 常见问题

### Q: 打印预览显示异常?
A: 确保 [index.html](index.html) 中已引入 `print-lock.css`:

```html
<link rel="stylesheet" type="text/css" media="print"
      href="https://cdn.jsdelivr.net/npm/vue-plugin-hiprint@latest/dist/print-lock.css"/>
```

### Q: 拖拽组件无法选中?
A: 确保使用了支持 jQuery 的浏览器,并检查控制台是否有错误。

### Q: 如何修改纸张大小?
A: 在设计器右侧面板的"参数设置"中修改纸张类型,或在模板 JSON 中设置 `paperType`、`width`、`height`。

### Q: 如何自定义字体?
A: 在 [LogisticsDesigner.vue](src/components/LogisticsDesigner.vue) 的 `fontList` 配置中添加字体:

```javascript
fontList: [
  { title: '字体名称', value: 'FontFamilyName' }
]
```

## 浏览器兼容性

| 浏览器 | 支持情况 | 备注 |
|--------|----------|------|
| Chrome | ✅ 完全支持 | 推荐使用 |
| Edge | ✅ 完全支持 | 基于 Chromium |
| Firefox | ⚠️ 部分支持 | 打印预览可能有问题 |
| Safari | ⚠️ 部分支持 | 需要额外测试 |

## 开发指南

### 添加新组件

1. 在 [DraggableModules.vue](src/components/DraggableModules.vue) 中添加组件按钮:

```html
<div class="ep-draggable-item" tid="customModule.custom">
  <i class="el-icon-star"></i>
  <span>自定义组件</span>
</div>
```

2. 使用 hiprint API 创建自定义模块(详见官方文档)。

### 扩展数据字段

1. 在 [logisticsData.js](src/utils/logisticsData.js) 中添加新字段
2. 在设计器中添加文本组件,设置 `field` 属性为新字段名
3. 在"编辑数据"对话框中添加对应的表单项

## 参考资源

- [vue-plugin-hiprint GitHub](https://github.com/CcSimple/vue-plugin-hiprint)
- [hiprint 官方文档](http://hiprint.io/)
- [Element Plus 文档](https://element-plus.org/)
- [Vue 3 文档](https://cn.vuejs.org/)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request!

---

**祝您使用愉快!**
