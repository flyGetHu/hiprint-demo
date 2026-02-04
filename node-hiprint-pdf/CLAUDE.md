[根目录](../CLAUDE.md) > **node-hiprint-pdf**

# node-hiprint-pdf (后端模块)

> Node.js PDF/图片生成服务，基于 Fastify + Puppeteer

## 模块职责

- 接收前端模板和数据请求
- 使用 Puppeteer 无头浏览器渲染 hiprint 模板
- 生成 PDF、图片、HTML 并返回或保存

## 入口与启动

### 入口文件

`app.js` - Fastify 应用入口，自动加载 plugins 和 routes

### 启动命令

```bash
npm run start    # 生产模式 http://localhost:3000
npm run dev      # 开发模式（热重载）
```

### Docker 启动

```bash
docker compose up -d
# 或
docker build -t node-hiprint-pdf:1.0.0 .
docker run -p 3000:3000 node-hiprint-pdf:1.0.0
```

### 应用初始化流程

```javascript
// app.js
import AutoLoad from '@fastify/autoload'

export default async function (fastify, opts) {
  // 自动加载 plugins 目录下的插件
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // 自动加载 routes 目录下的路由
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
```

## 对外接口

### API 端点

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| GET | `/` | 健康检查 | - |
| GET | `/template?id=xxx` | 获取缓存的模板数据 | - |
| POST | `/pdf` | 生成 PDF | `{ template, printData, options?, url?, noFile? }` |
| POST | `/img` | 生成图片 | `{ template, printData, options?, url?, noFile? }` |
| POST | `/html` | 生成 HTML | `{ template, printData, options?, url?, domId?, noFile? }` |

### 请求参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `template` | Object | 是 | vue-plugin-hiprint 模板 JSON |
| `printData` | Object | 是 | 打印数据 JSON |
| `options` | Object | 否 | Puppeteer 配置（PDF/截图选项） |
| `url` | String | 否 | 自定义渲染页面 URL |
| `domId` | String | 否 | HTML 提取的 DOM 节点（默认 `#hiprintTemplate`） |
| `noFile` | Boolean | 否 | true: 不生成文件，返回 base64/buffer |

### 响应格式

```javascript
{
  code: 1,          // 1: 成功, 0: 失败
  msg: "success",   // 消息
  data: "..."       // 文件路径/base64/buffer
}
```

### Puppeteer 配置参考

**PDF 选项** ([文档](https://pptr.dev/api/puppeteer.pdfoptions)):
```javascript
{
  width: "240mm",
  height: "140mm",
  printBackground: true,
  margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
}
```

**截图选项** ([文档](https://pptr.dev/api/puppeteer.screenshotoptions)):
```javascript
{
  type: "png",
  fullPage: true,
  quality: 80  // 仅 jpeg
}
```

## 关键依赖与配置

### 核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `fastify` | ^4.26.1 | Web 框架 |
| `puppeteer` | ^23.1.1 | 无头浏览器 |
| `@fastify/autoload` | ^5.0.0 | 自动加载插件/路由 |
| `@fastify/cors` | ^9.0.1 | CORS 支持 |
| `@fastify/static` | ^7.0.4 | 静态文件服务 |
| `@fastify/sensible` | ^5.0.0 | HTTP 错误处理 |
| `fastify-cacheman` | ^3.1.0 | 缓存管理 |
| `fastify-plugin` | ^4.0.0 | 插件封装 |

### 插件配置

| 插件 | 文件 | 说明 |
|------|------|------|
| CORS | `plugins/cors.js` | 允许所有来源跨域请求 |
| Static | `plugins/static.js` | 提供 `public/` 目录静态服务 |
| Cacheman | `plugins/cacheman.js` | 内存缓存（可切换 Redis/文件） |
| Sensible | `plugins/sensible.js` | HTTP 错误处理工具 |

### 缓存配置

```javascript
// plugins/cacheman.js
fastify.register(fastifyCacheman, {
  engine: "memory",  // 可选: "file", "redis"
  // Redis 配置:
  // engine: 'redis',
  // port: 6379,
  // host: '127.0.0.1',
  // password: 'my-p@ssw0rd',
  // database: 1,
})
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NODE_ENV` | 运行环境 | `prd` (Docker) |
| `PUPPETEER_EXECUTABLE_PATH` | Chromium 路径 | `/usr/bin/chromium-browser` |
| `TZ` | 时区 | `Asia/Shanghai` |
| `LANG` | 语言 | `zh_CN.UTF-8` |

## 数据模型

### 缓存数据结构

模板和打印数据通过缓存 ID 传递给渲染页面：

```javascript
// 缓存键: randomId (如 "1706000000000-abc123")
// 缓存值:
{
  template: { ... },   // hiprint 模板 JSON
  printData: { ... },  // 打印数据
  options: { ... }     // Puppeteer 选项
}
// 默认过期时间: 60 秒
```

### 文件存储结构

```
public/
|-- files/
|   +-- 2024-01-15/
|       |-- 1706000000000-abc123.pdf
|       |-- 1706000000001-def456.png
|       +-- 1706000000002-ghi789.html
|
+-- vue-plugin-hiprint/
    +-- index.html      # 渲染模板页面
```

## 测试与质量

### 当前状态

- 配置了 `c8` 代码覆盖率工具
- 无自动化测试用例

### 手动测试

```bash
# 测试 PDF 生成
curl -X POST http://localhost:3000/pdf \
  -H "Content-Type: application/json" \
  -d '{"template":{...}, "printData":{...}}'

# 测试图片生成
curl -X POST http://localhost:3000/img \
  -H "Content-Type: application/json" \
  -d '{"template":{...}, "printData":{...}}'
```

### 建议配置

```bash
npm install -D jest @types/jest
```

## 常见问题 (FAQ)

### Q: Docker 中中文显示乱码？

Dockerfile 已配置中文字体：
```dockerfile
RUN apk add --no-cache \
    ttf-dejavu \
    font-droid-nonlatin \
    msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f
```

### Q: Puppeteer 启动失败？

1. 确保安装了 Chromium 依赖
2. 检查 `PUPPETEER_EXECUTABLE_PATH` 环境变量
3. Docker 中使用 Alpine 需要额外安装：
   ```dockerfile
   RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates
   ```

### Q: 缓存数据获取失败？

1. 检查缓存是否过期（默认 60 秒）
2. 确认 cacheman 插件正确加载
3. 查看服务日志中的 cacheId

### Q: 生成的文件无法访问？

1. 确认 `public/files/` 目录存在且有写权限
2. 检查静态文件服务是否正常
3. 访问 `http://localhost:3000/files/2024-01-15/xxx.pdf`

## 相关文件清单

### 核心文件

| 文件 | 说明 |
|------|------|
| `app.js` | 应用入口，自动加载插件和路由 |
| `lib/puppeteer-html-export.js` | Puppeteer 封装类 |
| `routes/root.js` | API 路由定义 |

### 插件

| 文件 | 说明 |
|------|------|
| `plugins/cors.js` | CORS 配置 |
| `plugins/static.js` | 静态文件服务 |
| `plugins/cacheman.js` | 缓存管理 |
| `plugins/sensible.js` | HTTP 错误处理 |

### 配置文件

| 文件 | 说明 |
|------|------|
| `package.json` | 项目依赖与脚本 |
| `Dockerfile` | Docker 构建配置 |
| `docker-compose.yaml` | Docker Compose 配置 |
| `.gitignore` | Git 忽略规则 |

### 静态资源

| 文件 | 说明 |
|------|------|
| `public/vue-plugin-hiprint/index.html` | 模板渲染页面 |
| `public/files/` | 生成文件存储目录 |

## 变更记录 (Changelog)

| 时间 | 变更内容 |
|------|----------|
| 2026-02-04 | 初始化模块文档 |
