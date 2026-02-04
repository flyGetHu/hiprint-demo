# hiprint-demo

> 基于 vue-plugin-hiprint 的完整物流面单打印解决方案

一个包含前端可视化设计器和后端 PDF/图片生成服务的 Monorepo 项目。

## 功能特性

### 前端设计器

- **可视化设计**：拖拽式界面，无需编写代码
- **丰富组件**：文本、图片、表格、条形码、二维码等
- **模板管理**：保存、加载、导入、导出模板
- **实时预览**：即时预览打印效果
- **灵活打印**：支持浏览器打印和客户端静默打印

### 后端服务

- **PDF 生成**：基于 Puppeteer 无头浏览器渲染
- **图片导出**：支持 PNG/JPEG 格式
- **HTML 输出**：获取渲染后的 HTML 代码
- **Docker 部署**：开箱即用的容器化方案

## 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| **前端** | Vue 3 + Vite | 3.5.x / 7.x |
| | Element Plus | 2.13.x |
| | vue-plugin-hiprint | 0.0.60 |
| | Pinia + Vue Router | 3.x / 4.x |
| **后端** | Node.js + Fastify | 18.x / 4.x |
| | Puppeteer | 23.x |

## 项目结构

```
hiprint-demo/
├── hiprint-demo/           # Vue 3 前端 - 模板设计器
│   ├── src/
│   │   ├── components/     # 核心组件
│   │   ├── views/          # 页面视图
│   │   ├── utils/          # 工具函数
│   │   └── router/         # 路由配置
│   └── vite.config.js
│
└── node-hiprint-pdf/       # Node.js 后端 - PDF 生成服务
    ├── lib/                # Puppeteer 封装
    ├── routes/             # API 路由
    ├── plugins/            # Fastify 插件
    ├── public/             # 静态资源
    └── Dockerfile
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 8.x 或 pnpm >= 7.x
- Docker（可选，用于后端部署）

### 前端开发

```bash
cd hiprint-demo
npm install
npm run dev          # http://localhost:3000
```

### 后端开发

```bash
cd node-hiprint-pdf
npm install
npm run dev          # http://localhost:3000
```

### Docker 一键部署（后端）

```bash
cd node-hiprint-pdf
docker compose up -d
```

## API 文档

### 接口概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/pdf` | 生成 PDF 文件 |
| POST | `/img` | 生成图片文件 |
| POST | `/html` | 获取渲染 HTML |

### 请求参数

```javascript
{
  template: {},      // vue-plugin-hiprint 模板 JSON
  printData: {},     // 打印数据 JSON
  options: {},       // Puppeteer 配置（可选）
  noFile: false      // true: 返回 base64，false: 生成文件
}
```

### 使用示例

```javascript
import axios from 'axios'

// 生成 PDF
const response = await axios.post('http://localhost:3000/pdf', {
  template: {
    panels: [{
      width: 100,
      height: 150,
      printElements: [...]
    }]
  },
  printData: {
    sender: { name: '发货人', address: '...' },
    receiver: { name: '收货人', address: '...' },
    waybill: { no: 'SF1234567890' }
  }
})

console.log(response.data)
// { code: 1, msg: "success", data: "/files/2024-01-15/xxx.pdf" }
```

### 响应格式

```javascript
{
  code: 1,          // 1: 成功, 0: 失败
  msg: "success",   // 消息
  data: "..."       // 文件路径或 base64
}
```

## 使用指南

### 1. 创建面单模板

访问前端应用，点击「创建面单模板」进入设计器。

### 2. 设计面单

- **添加组件**：从左侧面板拖拽组件到画布
- **编辑属性**：点击组件，在右侧面板修改属性
- **调整布局**：拖拽调整位置和大小

### 3. 设置打印数据

点击「编辑数据」，填写发货人、收货人、运单等信息。

### 4. 预览和导出

- **预览打印**：点击「预览打印」查看效果
- **生成 PDF**：调用后端 API 导出 PDF
- **直接打印**：安装客户端后支持静默打印

### 5. 保存模板

在右侧「模板管理」面板保存、导入、导出模板。

## 开发指南

### 编码规范

- **前端**：Vue 3 Composition API + `<script setup>`
- **组件命名**：PascalCase（如 `LogisticsDesigner.vue`）
- **函数命名**：camelCase，事件处理用 `handle` 前缀
- **CSS 类名**：kebab-case

### 添加新打印组件

```javascript
// hiprint-demo/src/components/DraggableModules.vue
<div class="ep-draggable-item" tid="customModule.custom">
  <span>自定义组件</span>
</div>
```

### 添加新 API 端点

在 `node-hiprint-pdf/routes/` 目录下创建新路由文件，Fastify 会自动加载。

## 常见问题

<details>
<summary><b>Q: 打印预览显示异常？</b></summary>

确保 `index.html` 引入了打印样式：

```html
<link rel="stylesheet" type="text/css" media="print"
      href="https://cdn.jsdelivr.net/npm/vue-plugin-hiprint@latest/dist/print-lock.css"/>
```
</details>

<details>
<summary><b>Q: Docker 中中文显示乱码？</b></summary>

Dockerfile 已配置中文字体，如仍有问题请检查：
- 字体文件是否正确安装
- 环境变量 `LANG=zh_CN.UTF-8` 是否设置
</details>

<details>
<summary><b>Q: Puppeteer 启动失败？</b></summary>

1. 确保安装了 Chromium 依赖
2. 检查 `PUPPETEER_EXECUTABLE_PATH` 环境变量
3. Docker Alpine 需要额外安装 chromium 包
</details>

<details>
<summary><b>Q: 如何实现静默打印？</b></summary>

安装 [electron-hiprint](https://gitee.com/CcSimple/electron-hiprint) 客户端，配置连接后即可实现无弹窗打印。
</details>

## 详细文档

| 文档 | 说明 |
|------|------|
| [前端文档](./hiprint-demo/README.md) | 设计器使用、组件说明、高级功能 |
| [后端文档](./node-hiprint-pdf/README.md) | API 详情、Docker 部署、配置说明 |
| [编码规范](./AGENTS.md) | 开发规范、最佳实践 |

## 参考资源

- [vue-plugin-hiprint](https://github.com/CcSimple/vue-plugin-hiprint) - 打印模板库
- [hiprint 官方文档](http://hiprint.io/) - 核心功能文档
- [Element Plus](https://element-plus.org/) - UI 组件库
- [Puppeteer](https://pptr.dev/) - 无头浏览器 API

## License

MIT License

---

**欢迎提交 Issue 和 Pull Request！**
