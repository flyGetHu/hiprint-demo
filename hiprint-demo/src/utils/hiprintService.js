/**
 * hiprint 服务 API 封装
 * 用于调用后端 hiprint-pdf 服务生成 PDF、图片、HTML
 */

// hiprint 服务地址（可根据环境变量配置）
const HIPRINT_SERVICE_URL = import.meta.env.VITE_HIPRINT_SERVICE_URL || 'http://localhost:3000'

/**
 * 生成 PDF
 * @param {Object} template - hiprint 模板 JSON
 * @param {Object} printData - 打印数据 JSON
 * @param {Object} options - Puppeteer PDF 选项（可选）
 * @returns {Promise<Blob>} PDF 文件 Blob
 */
export async function generatePDF(template, printData, options = {}) {
  try {
    const response = await fetch(`${HIPRINT_SERVICE_URL}/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
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
          },
          ...options
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('生成 PDF 失败:', error)
    throw error
  }
}

/**
 * 下载 PDF 文件
 * @param {Object} template - hiprint 模板 JSON
 * @param {Object} printData - 打印数据 JSON
 * @param {String} filename - 文件名（可选）
 * @param {Object} options - Puppeteer PDF 选项（可选）
 * @returns {Promise<void>}
 */
export async function downloadPDF(template, printData, filename = null, options = {}) {
  try {
    const blob = await generatePDF(template, printData, options)

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename || `logistics_${Date.now()}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载 PDF 失败:', error)
    throw error
  }
}

/**
 * 批量生成 PDF
 * @param {Object} template - hiprint 模板 JSON
 * @param {Array} dataList - 打印数据数组
 * @param {Object} options - Puppeteer PDF 选项（可选）
 * @returns {Promise<Array<Blob>>} PDF 文件 Blob 数组
 */
export async function generateBatchPDF(template, dataList, options = {}) {
  const promises = dataList.map(data => generatePDF(template, data, options))
  return Promise.all(promises)
}

/**
 * 批量下载 PDF
 * @param {Object} template - hiprint 模板 JSON
 * @param {Array} dataList - 打印数据数组
 * @param {Function} namingFn - 文件命名函数 (data, index) => filename
 * @param {Object} options - Puppeteer PDF 选项（可选）
 * @returns {Promise<void>}
 */
export async function downloadBatchPDF(template, dataList, namingFn = null, options = {}) {
  for (let i = 0; i < dataList.length; i++) {
    try {
      const data = dataList[i]
      const filename = namingFn ? namingFn(data, i) : `logistics_${i + 1}_${Date.now()}.pdf`
      await downloadPDF(template, data, filename, options)

      // 添加延迟，避免请求过快
      if (i < dataList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`生成第 ${i + 1} 个 PDF 失败:`, error)
      throw error
    }
  }
}

/**
 * 生成图片
 * @param {Object} template - hiprint 模板 JSON
 * @param {Object} printData - 打印数据 JSON
 * @param {Object} options - Puppeteer 截图选项（可选）
 * @returns {Promise<Blob>} 图片文件 Blob
 */
export async function generateImage(template, printData, options = {}) {
  try {
    const response = await fetch(`${HIPRINT_SERVICE_URL}/img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template,
        printData,
        options: {
          type: 'png',
          fullPage: true,
          ...options
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('生成图片失败:', error)
    throw error
  }
}

/**
 * 下载图片
 * @param {Object} template - hiprint 模板 JSON
 * @param {Object} printData - 打印数据 JSON
 * @param {String} filename - 文件名（可选）
 * @param {Object} options - Puppeteer 截图选项（可选）
 * @returns {Promise<void>}
 */
export async function downloadImage(template, printData, filename = null, options = {}) {
  try {
    const blob = await generateImage(template, printData, options)

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename || `logistics_${Date.now()}.png`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载图片失败:', error)
    throw error
  }
}

/**
 * 生成 HTML
 * @param {Object} template - hiprint 模板 JSON
 * @param {Object} printData - 打印数据 JSON
 * @param {String} domId - DOM 节点 ID（可选）
 * @returns {Promise<String>} HTML 字符串
 */
export async function generateHTML(template, printData, domId = '#hiprintTemplate') {
  try {
    const response = await fetch(`${HIPRINT_SERVICE_URL}/html`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template,
        printData,
        domId
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    return html
  } catch (error) {
    console.error('生成 HTML 失败:', error)
    throw error
  }
}

/**
 * 检查 hiprint 服务是否可用
 * @returns {Promise<boolean>}
 */
export async function checkServiceHealth() {
  try {
    const response = await fetch(`${HIPRINT_SERVICE_URL}/health`, {
      method: 'GET',
      timeout: 5000
    })
    return response.ok
  } catch (error) {
    console.error('检查服务健康状态失败:', error)
    return false
  }
}

/**
 * 获取服务信息
 * @returns {Promise<Object>} 服务信息
 */
export async function getServiceInfo() {
  try {
    const response = await fetch(`${HIPRINT_SERVICE_URL}/info`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const info = await response.json()
    return info
  } catch (error) {
    console.error('获取服务信息失败:', error)
    throw error
  }
}

/**
 * 设置服务地址
 * @param {String} url - 服务地址
 */
export function setServiceUrl(url) {
  if (typeof url !== 'string') {
    throw new Error('服务地址必须是字符串')
  }
  HIPRINT_SERVICE_URL = url
}

/**
 * 获取当前服务地址
 * @returns {String} 服务地址
 */
export function getServiceUrl() {
  return HIPRINT_SERVICE_URL
}
