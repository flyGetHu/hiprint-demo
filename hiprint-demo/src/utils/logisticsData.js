/**
 * 物流面单打印数据模型
 * 模拟真实的物流面单数据
 */

export const logisticsPrintData = {
  // 发货人信息
  sender: {
    name: '顺丰速运',
    company: '顺丰速运有限公司',
    phone: '95338',
    mobile: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '科技园南区深圳湾科技生态园',
    postCode: '518000'
  },

  // 收货人信息
  receiver: {
    name: '张三',
    company: '深圳市某某科技有限公司',
    phone: '021-12345678',
    mobile: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    address: '世纪大道100号上海环球金融中心',
    postCode: '200120'
  },

  // 运单信息
  waybill: {
    no: 'SF1234567890123',
    date: '2024-01-15 10:30',
    serviceType: '标准快递',
    paymentType: '寄付',
    weight: '2.5',
    freight: '23.00',
    insurance: '0',
    totalAmount: '15117.00'
  },

  // 商品列表
  products: [
    {
      no: '1',
      name: '苹果 MacBook Pro 14寸',
      spec: 'M3 Pro芯片 18GB内存 512GB存储 深空灰色',
      quantity: 1,
      price: '14999.00',
      amount: '14999.00'
    },
    {
      no: '2',
      name: '保护壳',
      spec: '透明硅胶款 适用于 MacBook Pro 14寸',
      quantity: 2,
      price: '59.00',
      amount: '118.00'
    }
  ],

  // 物流追踪
  tracking: {
    url: 'https://www.sf-express.com/track/SF1234567890123',
    qrcode: 'https://www.sf-express.com/track/SF1234567890123'
  },

  // 备注
  remark: '易碎品，请轻拿轻放。工作日配送，联系人：张三，电话：13900139000',

  // 公司 Logo (使用占位图)
  logo: 'https://via.placeholder.com/200x80/409EFF/ffffff?text=顺丰速运'
}

/**
 * 获取随机物流数据
 * 用于批量打印测试
 */
export function getRandomLogisticsData(count = 1) {
  const cities = [
    { province: '北京市', city: '北京市', district: '朝阳区' },
    { province: '上海市', city: '上海市', district: '浦东新区' },
    { province: '广东省', city: '广州市', district: '天河区' },
    { province: '广东省', city: '深圳市', district: '南山区' },
    { province: '浙江省', city: '杭州市', district: '西湖区' },
    { province: '江苏省', city: '南京市', district: '鼓楼区' }
  ]

  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  const companies = ['科技有限公司', '贸易有限公司', '实业有限公司', '电子商务公司']

  const data = []
  for (let i = 0; i < count; i++) {
    const senderCity = cities[Math.floor(Math.random() * cities.length)]
    const receiverCity = cities[Math.floor(Math.random() * cities.length)]
    const name = names[Math.floor(Math.random() * names.length)]

    data.push({
      sender: {
        name: '顺丰速运',
        company: '顺丰速运有限公司',
        phone: '95338',
        mobile: '13800138000',
        province: senderCity.province,
        city: senderCity.city,
        district: senderCity.district,
        address: '科技园南区深圳湾科技生态园',
        postCode: '518000'
      },
      receiver: {
        name: name,
        company: name + companies[Math.floor(Math.random() * companies.length)],
        phone: '021-12345678',
        mobile: '13' + Math.floor(Math.random() * 900000000 + 100000000),
        province: receiverCity.province,
        city: receiverCity.city,
        district: receiverCity.district,
        address: `某某街道${Math.floor(Math.random() * 100)}号`,
        postCode: '200120'
      },
      waybill: {
        no: 'SF' + Math.floor(Math.random() * 1000000000000000),
        date: new Date().toLocaleString('zh-CN'),
        serviceType: '标准快递',
        paymentType: '寄付',
        weight: (Math.random() * 10 + 0.5).toFixed(2),
        freight: (Math.random() * 50 + 10).toFixed(2),
        insurance: '0',
        totalAmount: (Math.random() * 10000).toFixed(2)
      },
      products: [
        {
          no: '1',
          name: '测试商品' + (i + 1),
          spec: '规格: ' + (Math.floor(Math.random() * 10) + 1),
          quantity: Math.floor(Math.random() * 5) + 1,
          price: (Math.random() * 1000).toFixed(2),
          amount: '0'
        }
      ],
      tracking: {
        url: 'https://www.sf-express.com/track/',
        qrcode: 'https://www.sf-express.com/track/'
      },
      remark: '请勿暴力分拣，轻拿轻放',
      logo: 'https://via.placeholder.com/200x80/409EFF/ffffff?text=顺丰速运'
    })
  }

  return data
}
