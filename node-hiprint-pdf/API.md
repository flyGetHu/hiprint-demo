# node-hiprint-pdf API 文档

> 基于 Fastify + Puppeteer 的 PDF/图片生成服务

## 基础信息

- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`

---

## 接口列表

### 1. 生成 PDF

生成 PDF 文件并返回文件路径或 Buffer。

**请求**

```
POST /pdf
```

**请求参数**

| 参数        | 类型    | 必填 | 说明                                                     |
| ----------- | ------- | ---- | -------------------------------------------------------- |
| `template`  | Object  | 是   | hiprint 模板 JSON，通过 `hiprintTemplate.getJson()` 获取 |
| `printData` | Object  | 是   | 打印数据 JSON                                            |
| `options`   | Object  | 否   | Puppeteer PDF 选项                                       |
| `url`       | String  | 否   | 自定义渲染页面 URL（默认使用内置页面）                   |
| `noFile`    | Boolean | 否   | `true`: 返回 Buffer；`false`: 返回文件路径（默认）       |

**options 参数** ([Puppeteer PDF Options](https://pptr.dev/api/puppeteer.pdfoptions))

| 参数              | 类型    | 说明                               | 示例                                                       |
| ----------------- | ------- | ---------------------------------- | ---------------------------------------------------------- |
| `width`           | String  | 纸张宽度                           | `"100mm"`                                                  |
| `height`          | String  | 纸张高度                           | `"150mm"`                                                  |
| `format`          | String  | 纸张格式（与 width/height 二选一） | `"A4"`                                                     |
| `printBackground` | Boolean | 打印背景                           | `true`                                                     |
| `landscape`       | Boolean | 横向打印                           | `false`                                                    |
| `margin`          | Object  | 页边距                             | `{ top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }` |
| `scale`           | Number  | 缩放比例 (0.1-2)                   | `1`                                                        |
| `pageRanges`      | String  | 打印页码范围                       | `"1-3"`                                                    |

**请求示例**

```json
{
  "template": {
    "panels": [
      {
        "index": 0,
        "width": 100,
        "height": 150,
        "paperType": "10x15",
        "printElements": [
          {
            "options": {
              "left": 30,
              "top": 10,
              "height": 20,
              "width": 200,
              "title": "物流单号",
              "field": "waybill.no",
              "fontSize": 14,
              "fontWeight": "bold"
            }
          }
        ]
      }
    ]
  },
  "printData": {
    "sender": {
      "name": "张三",
      "phone": "13800138000",
      "address": "上海市浦东新区XX路123号"
    },
    "receiver": {
      "name": "李四",
      "phone": "13900139000",
      "address": "北京市朝阳区XX街456号"
    },
    "waybill": {
      "no": "SF1234567890",
      "serviceType": "标准快递",
      "paymentType": "寄付",
      "weight": "1.5kg",
      "freight": "15.00"
    }
  },
  "options": {
    "width": "100mm",
    "height": "150mm",
    "printBackground": true,
    "margin": {
      "top": "0mm",
      "bottom": "0mm",
      "left": "0mm",
      "right": "0mm"
    }
  }
}
```

**响应**

```json
{
  "code": 1,
  "msg": "success",
  "data": "http://localhost:17521/files/2026-02-04/1234567890-abc123.pdf"
}
```

**noFile: true 时的响应**

```json
{
  "code": 1,
  "msg": "success",
  "data": "<Buffer 25 50 44 46 2d 31 2e ...>"
}
```

**错误响应**

```json
{
  "code": 0,
  "msg": "错误信息",
  "data": null
}
```

---

### 2. 生成图片

生成 PNG 图片并返回文件路径或 Base64。

**请求**

```
POST /img
```

**请求参数**

| 参数        | 类型    | 必填 | 说明                                       |
| ----------- | ------- | ---- | ------------------------------------------ |
| `template`  | Object  | 是   | hiprint 模板 JSON                          |
| `printData` | Object  | 是   | 打印数据 JSON                              |
| `options`   | Object  | 否   | Puppeteer 截图选项                         |
| `url`       | String  | 否   | 自定义渲染页面 URL                         |
| `noFile`    | Boolean | 否   | `true`: 返回 Base64；`false`: 返回文件路径 |

**options 参数** ([Puppeteer Screenshot Options](https://pptr.dev/api/puppeteer.screenshotoptions))

| 参数             | 类型    | 说明                           | 示例                                      |
| ---------------- | ------- | ------------------------------ | ----------------------------------------- |
| `type`           | String  | 图片格式                       | `"png"` / `"jpeg"` / `"webp"`             |
| `quality`        | Number  | 图片质量 (0-100，仅 jpeg/webp) | `80`                                      |
| `fullPage`       | Boolean | 截取整页                       | `true`                                    |
| `clip`           | Object  | 裁剪区域                       | `{ x: 0, y: 0, width: 100, height: 100 }` |
| `omitBackground` | Boolean | 透明背景                       | `false`                                   |

**请求示例**

```json
{
  "template": { ... },
  "printData": { ... },
  "options": {
    "type": "png",
    "fullPage": true
  },
  "noFile": true
}
```

**响应 (noFile: false)**

```json
{
  "code": 1,
  "msg": "success",
  "data": "http://localhost:17521/files/2026-02-04/1234567890-abc123.png"
}
```

**响应 (noFile: true)**

```json
{
  "code": 1,
  "msg": "success",
  "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

---

### 3. 生成 HTML

获取渲染后的 HTML 内容。

**请求**

```
POST /html
```

**请求参数**

| 参数        | 类型    | 必填 | 说明                                         |
| ----------- | ------- | ---- | -------------------------------------------- |
| `template`  | Object  | 是   | hiprint 模板 JSON                            |
| `printData` | Object  | 是   | 打印数据 JSON                                |
| `domId`     | String  | 否   | 提取的 DOM 选择器（默认 `#hiprintTemplate`） |
| `url`       | String  | 否   | 自定义渲染页面 URL                           |
| `noFile`    | Boolean | 否   | `true`: 不保存文件                           |

**请求示例**

```json
{
  "template": { ... },
  "printData": { ... },
  "domId": "#hiprintTemplate"
}
```

**响应**

```json
{
  "code": 1,
  "msg": "success",
  "data": "<div class=\"hiprint-printTemplate\">...</div>"
}
```

---

### 4. 获取缓存模板

获取临时缓存的模板数据（用于调试）。

**请求**

```
GET /template?id={cacheId}
```

**响应**

```json
{
  "code": 1,
  "msg": "ok",
  "data": {
    "template": { ... },
    "printData": { ... },
    "options": { ... }
  }
}
```

---

### 5. 健康检查

**请求**

```
GET /
```

**响应**

```
微信公众号: 不简说files/2026-02-04
```

---

## cURL 示例

### 生成 PDF

```bash
curl -X POST http://localhost:17521/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "panels": [{
        "width": 100,
        "height": 150,
        "printElements": []
      }]
    },
    "printData": {
      "waybill": { "no": "SF123456" }
    },
    "options": {
      "width": "100mm",
      "height": "150mm"
    }
  }'
```

### 生成图片（返回 Base64）

```bash
curl -X POST http://localhost:17521/img \
  -H "Content-Type: application/json" \
  -d '{
    "template": { ... },
    "printData": { ... },
    "noFile": true
  }'
```

---

## 前端调用示例

### JavaScript (fetch)

```javascript
async function generatePDF(template, printData) {
  const response = await fetch("http://localhost:17521/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template,
      printData,
      options: {
        width: "100mm",
        height: "150mm",
        printBackground: true,
      },
    }),
  });

  const result = await response.json();

  if (result.code === 1) {
    window.open(result.data); // 打开 PDF
  } else {
    console.error(result.msg);
  }
}
```

### Axios

```javascript
import axios from "axios";

const { data: result } = await axios.post("http://localhost:17521/pdf", {
  template: hiprintTemplate.getJson(),
  printData: printData,
  options: { width: "100mm", height: "150mm" },
});

if (result.code === 1) {
  window.open(result.data);
}
```

---

## 错误码

| code | 说明                      |
| ---- | ------------------------- |
| `1`  | 成功                      |
| `0`  | 失败，查看 `msg` 获取详情 |

## 常见错误

| 错误信息                  | 原因               | 解决方案                    |
| ------------------------- | ------------------ | --------------------------- |
| `Browser not initialized` | Puppeteer 启动失败 | 检查 Chromium 是否安装      |
| `Navigation timeout`      | 页面加载超时       | 增加 timeout 参数或检查网络 |
| `no cache`                | 缓存已过期         | 重新请求（默认 60 秒过期）  |

---

## 部署配置

### 环境变量

| 变量                        | 说明          | 默认值   |
| --------------------------- | ------------- | -------- |
| `PORT`                      | 服务端口      | `17521`  |
| `PUPPETEER_EXECUTABLE_PATH` | Chromium 路径 | 自动检测 |

### Docker

```bash
docker compose up -d
```

### 本地开发

```bash
npm install
npm run dev   # 开发模式（热重载）
npm run start # 生产模式
```
