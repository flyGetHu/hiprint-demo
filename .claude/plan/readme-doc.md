# 实施计划：生成项目总 README.md

## 任务概述

为 hiprint-demo 项目生成根级 README.md 文档，整合前后端模块信息，作为项目的入口文档。

### 任务类型
- [x] 文档生成（Claude 直接执行）
- [ ] 前端 (→ Gemini)
- [ ] 后端 (→ Codex)

### 目标读者
- 项目新人开发者
- 潜在贡献者
- 技术评估人员

---

## 技术方案

基于已有的 `CLAUDE.md` 和各模块 `README.md`，生成一份结构完整、内容全面的项目总文档。

### 文档结构设计

```markdown
# hiprint-demo

## 项目简介
- 项目愿景与定位
- 核心功能亮点

## 功能特性
- 前端：可视化设计器
- 后端：PDF/图片生成服务

## 技术栈
- 前端：Vue 3 + Vite + Element Plus + vue-plugin-hiprint
- 后端：Node.js + Fastify + Puppeteer

## 项目结构
- Monorepo 结构图

## 快速开始
- 环境要求
- 前端启动
- 后端启动
- Docker 部署

## API 文档
- POST /pdf
- POST /img
- POST /html
- 请求/响应示例

## 使用指南
- 设计面单
- 生成 PDF/图片
- 模板管理

## 开发指南
- 编码规范
- 添加新组件
- 扩展 API

## 常见问题

## 参考资源

## License
```

---

## 实施步骤

### 步骤 1：创建 README.md 文件
- **操作**：在项目根目录创建 `README.md`
- **产物**：`E:\data-code\hiprint-demo\README.md`

### 步骤 2：编写项目简介
- 整合 CLAUDE.md 中的项目愿景
- 添加徽章（可选）：版本、许可证、构建状态

### 步骤 3：编写功能特性
- 从前端 README 提取设计器功能
- 从后端 README 提取 API 能力

### 步骤 4：编写技术栈
- 前端依赖：Vue 3.5.24、Element Plus 2.13.1、vue-plugin-hiprint 0.0.60
- 后端依赖：Fastify 4.26.1、Puppeteer 23.1.1

### 步骤 5：编写项目结构
- 使用树形目录展示 Monorepo 结构
- 链接到各模块详细文档

### 步骤 6：编写快速开始
- 环境要求：Node.js >= 18.x
- 前后端启动命令
- Docker 一键部署

### 步骤 7：编写 API 文档
- 三个核心接口说明
- 请求体参数
- 响应格式
- 代码示例

### 步骤 8：编写使用指南
- 链接到前端 README 的详细使用说明
- 快速操作流程

### 步骤 9：编写开发指南
- 从 AGENTS.md 提取编码规范
- 常见开发任务

### 步骤 10：编写常见问题和参考资源
- 合并前后端 FAQ
- 外部文档链接

---

## 关键文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `README.md` | 新建 | 项目总入口文档 |

### 参考来源

| 来源文件 | 提取内容 |
|----------|----------|
| `CLAUDE.md` | 项目愿景、架构图、运行命令 |
| `hiprint-demo/README.md` | 功能特性、使用指南、FAQ |
| `node-hiprint-pdf/README.md` | API 文档、Docker 部署 |
| `AGENTS.md` | 编码规范 |

---

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 内容重复 | README.md 提供概览，详细内容链接到各模块文档 |
| 信息过时 | 标注版本信息，建立文档更新机制 |
| 篇幅过长 | 使用折叠块（details）隐藏次要内容 |

---

## 预期产物

```
E:\data-code\hiprint-demo\
├── README.md          # 新建：项目总文档
├── CLAUDE.md          # 现有：AI 上下文
├── AGENTS.md          # 现有：编码规范
├── hiprint-demo/
│   └── README.md      # 现有：前端详细文档
└── node-hiprint-pdf/
    └── README.md      # 现有：后端详细文档
```

---

## SESSION_ID（供 /ccg:execute 使用）

- CODEX_SESSION: N/A（纯文档任务）
- GEMINI_SESSION: N/A（纯文档任务）

---

## 备注

此任务为纯文档生成，不涉及代码修改，由 Claude 直接执行即可。
