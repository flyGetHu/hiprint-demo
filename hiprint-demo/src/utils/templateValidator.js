/**
 * 模板验证工具
 * 用于验证模板的字段映射和完整性
 */

/**
 * 标准物流面单数据字段定义
 */
export const STANDARD_FIELDS = {
  sender: {
    name: '发货人姓名',
    company: '发货人公司',
    phone: '发货人电话',
    mobile: '发货人手机',
    province: '发货人省份',
    city: '发货人城市',
    district: '发货人区县',
    address: '发货人详细地址',
    postCode: '发货人邮编'
  },
  receiver: {
    name: '收货人姓名',
    company: '收货人公司',
    phone: '收货人电话',
    mobile: '收货人手机',
    province: '收货人省份',
    city: '收货人城市',
    district: '收货人区县',
    address: '收货人详细地址',
    postCode: '收货人邮编'
  },
  waybill: {
    no: '运单号',
    date: '开单时间',
    serviceType: '服务类型',
    paymentType: '付款方式',
    weight: '重量',
    freight: '运费',
    totalAmount: '总金额'
  },
  products: {
    no: '商品序号',
    name: '商品名称',
    spec: '商品规格',
    quantity: '商品数量',
    price: '商品单价',
    amount: '商品金额'
  },
  tracking: {
    url: '追踪链接',
    qrcode: '二维码内容'
  },
  remark: '备注信息',
  logo: '公司Logo'
}

/**
 * 验证模板字段映射
 * @param {Object} template - 模板 JSON 对象
 * @returns {Object} 验证结果 { valid: boolean, errors: Array, warnings: Array, usedFields: Array }
 */
export function validateTemplateFields(template) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    usedFields: [],
    missingFields: []
  }

  if (!template || !template.panels || template.panels.length === 0) {
    result.valid = false
    result.errors.push('模板格式错误：缺少面板数据')
    return result
  }

  const panel = template.panels[0]
  if (!panel.printElements) {
    result.warnings.push('模板中没有打印元素')
    return result
  }

  const fieldMap = new Map()

  panel.printElements.forEach(element => {
    const options = element.options || {}
    const field = options.field

    if (field) {
      fieldMap.set(field, element)
    }
  })

  const usedFields = Array.from(fieldMap.keys())
  result.usedFields = usedFields

  const flatStandardFields = flattenFields(STANDARD_FIELDS)

  usedFields.forEach(field => {
    const isStandard = flatStandardFields.some(f => field.includes(f))
    if (!isStandard) {
      result.warnings.push(`字段 "${field}" 不是标准字段，请确认映射关系`)
    }
  })

  const recommendedFields = [
    'sender.name',
    'sender.mobile',
    'receiver.name',
    'receiver.mobile',
    'receiver.address',
    'waybill.no'
  ]

  recommendedFields.forEach(field => {
    if (!usedFields.some(used => used.includes(field))) {
      result.warnings.push(`建议添加字段: ${STANDARD_FIELDS[field] || field}`)
    }
  })

  result.valid = result.errors.length === 0

  return result
}

/**
 * 展开嵌套的字段对象
 * @param {Object} obj - 字段对象
 * @returns {Array} 扁平化的字段数组
 */
function flattenFields(obj, prefix = '') {
  const fields = []

  for (const key in obj) {
    const fieldName = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      fields.push(...flattenFields(obj[key], fieldName))
    } else {
      fields.push(fieldName)
    }
  }

  return fields
}

/**
 * 验证模板数据完整性
 * @param {Object} template - 模板 JSON 对象
 * @param {Object} data - 打印数据
 * @returns {Object} 验证结果
 */
export function validateTemplateData(template, data) {
  const result = {
    valid: true,
    errors: [],
    warnings: []
  }

  const fieldValidation = validateTemplateFields(template)
  const usedFields = fieldValidation.usedFields

  usedFields.forEach(field => {
    const value = getFieldValue(data, field)
    if (value === undefined || value === null || value === '') {
      result.warnings.push(`数据缺少字段: ${field}`)
    }
  })

  if (!data.sender || !data.receiver) {
    result.errors.push('数据缺少发货人或收货人信息')
    result.valid = false
  }

  return result
}

/**
 * 从数据对象中获取字段值
 * @param {Object} obj - 数据对象
 * @param {String} path - 字段路径，如 'sender.name'
 * @returns {*} 字段值
 */
function getFieldValue(obj, path) {
  const keys = path.split('.')
  let value = obj

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key]
    } else {
      return undefined
    }
  }

  return value
}

/**
 * 生成字段映射报告
 * @param {Object} template - 模板 JSON 对象
 * @returns {String} HTML 格式的报告
 */
export function generateFieldReport(template) {
  const validation = validateTemplateFields(template)

  let html = '<div class="field-report">'

  html += '<h3>模板字段验证报告</h3>'

  html += '<div class="summary">'
  html += `<p><strong>使用字段数:</strong> ${validation.usedFields.length}</p>`
  html += `<p><strong>错误数:</strong> ${validation.errors.length}</p>`
  html += `<p><strong>警告数:</strong> ${validation.warnings.length}</p>`
  html += '</div>'

  if (validation.usedFields.length > 0) {
    html += '<h4>已使用字段:</h4><ul>'
    validation.usedFields.forEach(field => {
      html += `<li>${field}</li>`
    })
    html += '</ul>'
  }

  if (validation.errors.length > 0) {
    html += '<h4 class="error">错误:</h4><ul class="error">'
    validation.errors.forEach(error => {
      html += `<li>${error}</li>`
    })
    html += '</ul>'
  }

  if (validation.warnings.length > 0) {
    html += '<h4 class="warning">警告:</h4><ul class="warning">'
    validation.warnings.forEach(warning => {
      html += `<li>${warning}</li>`
    })
    html += '</ul>'
  }

  html += '</div>'

  return html
}
