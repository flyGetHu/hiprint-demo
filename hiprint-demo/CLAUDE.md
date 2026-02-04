[根目录](../CLAUDE.md) > **hiprint-demo**

# hiprint-demo (前端模块)

> Vue 3 可视化物流面单设计器

## 模块职责

- 提供拖拽式模板设计界面
- 支持模板的保存、加载、导入、导出
- 实时预览打印效果
- 调用后端服务生成 PDF/图片

## 入口与启动

### 入口文件

`src/main.js` - 应用初始化，注册 Vue 插件

### 启动命令

```bash
npm run dev      # 开发服务器 http://localhost:3000
npm run build    # 生产构建
npm run preview  # 预览构建
```

### 依赖初始化

```javascript
// main.js 初始化流程
import { hiPrintPlugin } from 'vue-plugin-hiprint'
app.use(hiPrintPlugin, '$hiPrint', false)  // 不自动连接客户端
```

## 对外接口

### 路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `Home.vue` | 首页入口 |
| `/designer` | `Designer.vue` | 模板设计器 |

### 组件 Props/Events

#### LogisticsDesigner.vue

| 事件 | 参数 | 说明 |
|------|------|------|
| `@print` | `printData: Object` | 预览打印时触发 |

#### TemplateManager.vue

| Props | 类型 | 说明 |
|-------|------|------|
| `hiprint-template` | `Object` | hiprint 模板实例 |

| 事件 | 参数 | 说明 |
|------|------|------|
| `@template-loaded` | `template: Object` | 模板加载完成 |
| `@template-cleared` | - | 模板清空 |

#### PaperSizeSelector.vue

| Props | 类型 | 说明 |
|-------|------|------|
| `v-model` | `Object` | 纸张尺寸 `{ width, height, paperType }` |

| 事件 | 参数 | 说明 |
|------|------|------|
| `@change` | `size: Object` | 尺寸变更 |

## 关键依赖与配置

### 核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `vue` | ^3.5.24 | 前端框架 |
| `element-plus` | ^2.13.1 | UI 组件库 |
| `vue-plugin-hiprint` | ^0.0.60 | 打印模板设计 |
| `pinia` | ^3.0.4 | 状态管理 |
| `vue-router` | ^4.6.4 | 路由管理 |
| `axios` | ^1.13.2 | HTTP 客户端 |
| `jquery` | ^3.7.1 | hiprint 依赖 |

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `vite` | ^7.2.4 | 构建工具 |
| `@vitejs/plugin-vue` | ^6.0.1 | Vue 插件 |
| `sass` | ^1.97.2 | CSS 预处理器 |

### 构建配置

`vite.config.js`:
```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  }
})
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_HIPRINT_SERVICE_URL` | 后端服务地址 | `http://localhost:3000` |

## 数据模型

### 打印数据结构

```javascript
{
  sender: {           // 发货人信息
    name, company, phone, mobile,
    province, city, district, address, postCode
  },
  receiver: {         // 收货人信息（同 sender）
    name, company, phone, mobile,
    province, city, district, address, postCode
  },
  waybill: {          // 运单信息
    no, date, serviceType, paymentType,
    weight, freight, insurance, totalAmount
  },
  products: [{        // 商品列表
    no, name, spec, quantity, price, amount
  }],
  tracking: { url, qrcode },  // 物流追踪
  remark: '',         // 备注
  logo: ''            // Logo URL/Base64
}
```

### 模板结构

```javascript
{
  panels: [{
    index: 0,
    paperType: '10x15',
    height: 15,
    width: 10,
    printElements: [{
      options: { left, top, height, width, title, field, ... },
      printElementType: { title, tid }
    }]
  }]
}
```

## 测试与质量

### 当前状态

- 无自动化测试框架配置
- 依赖手动测试

### 测试要点

1. **组件拖拽**：从左侧面板拖拽元素到画布
2. **属性编辑**：选中元素后在右侧修改属性
3. **模板操作**：保存、加载、导入、导出模板
4. **打印预览**：点击预览查看效果
5. **PDF 导出**：调用后端生成 PDF

### 建议配置

```bash
npm install -D vitest @vue/test-utils happy-dom
```

## 常见问题 (FAQ)

### Q: 打印预览显示异常？

确保 `index.html` 引入了打印样式：

```html
<link rel="stylesheet" type="text/css" media="print"
      href="https://cdn.jsdelivr.net/npm/vue-plugin-hiprint@latest/dist/print-lock.css"/>
```

### Q: 拖拽组件无法选中？

1. 确保浏览器支持 jQuery
2. 检查控制台错误信息
3. 确认 `hiprint.init()` 正确执行

### Q: 如何修改纸张大小？

1. 右侧面板「纸张规格」标签页修改
2. 或直接修改模板 JSON 的 `panels[0].width/height`

### Q: PDF 导出失败？

1. 检查后端服务是否启动
2. 确认 `VITE_HIPRINT_SERVICE_URL` 配置正确
3. 查看浏览器网络请求错误

## 相关文件清单

### 核心组件

| 文件 | 说明 |
|------|------|
| `src/components/LogisticsDesigner.vue` | 主设计器，核心逻辑 |
| `src/components/DraggableModules.vue` | 可拖拽元素面板 |
| `src/components/TemplateManager.vue` | 模板管理器 |
| `src/components/PaperSizeSelector.vue` | 纸张选择器 |

### 工具函数

| 文件 | 说明 |
|------|------|
| `src/utils/hiprintService.js` | 后端 API 封装 |
| `src/utils/logisticsData.js` | 物流数据模型与生成器 |
| `src/utils/defaultTemplate.js` | 默认物流面单模板 |
| `src/utils/templateValidator.js` | 模板验证工具 |

### 配置文件

| 文件 | 说明 |
|------|------|
| `vite.config.js` | Vite 构建配置 |
| `package.json` | 项目依赖与脚本 |

## 变更记录 (Changelog)

| 时间 | 变更内容 |
|------|----------|
| 2026-02-04 | 初始化模块文档 |
