/**
 * 默认物流面单模板
 * 预置的标准物流面单设计
 */

export const defaultLogisticsTemplate = {
  panels: [
    {
      index: 0,
      paperType: '10x15',
      height: 150,
      width: 100,
      paperHeader: 0,
      paperFooter: 0,
      printElements: [
        // 公司 Logo
        {
          options: {
            left: 5,
            top: 5,
            height: 30,
            width: 50,
            title: 'logo',
            field: 'logo',
            fieldType: 'image'
          },
          printElementType: { title: '图片', tid: 'defaultModule.image' }
        },
        // 公司名称
        {
          options: {
            left: 60,
            top: 5,
            height: 15,
            width: 80,
            title: '顺丰速运',
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'left',
            color: '#E6550D'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 公司英文名
        {
          options: {
            left: 60,
            top: 20,
            height: 12,
            width: 80,
            title: 'SF EXPRESS',
            fontSize: 10,
            textAlign: 'left',
            color: '#E6550D'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 运单号标签
        {
          options: {
            left: 200,
            top: 5,
            height: 10,
            width: 80,
            title: '运单号',
            fontSize: 9,
            textAlign: 'right',
            color: '#666'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 运单号
        {
          options: {
            left: 180,
            top: 16,
            height: 14,
            width: 100,
            field: 'waybill.no',
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'right'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 条形码
        {
          options: {
            left: 180,
            top: 32,
            height: 28,
            width: 100,
            field: 'waybill.no',
            textAlign: 'center'
          },
          printElementType: { title: '条形码', tid: 'defaultModule.barcode' }
        },

        // ========== 发货人/收货人区域 ==========
        // 发货人标签
        {
          options: {
            left: 5,
            top: 68,
            height: 12,
            width: 130,
            title: '发货人信息',
            fontSize: 10,
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0',
            padding: '2pt'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 发货人姓名
        {
          options: {
            left: 5,
            top: 82,
            height: 10,
            width: 130,
            title: '姓名:',
            field: 'sender.name',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 发货人电话
        {
          options: {
            left: 5,
            top: 93,
            height: 10,
            width: 130,
            title: '电话:',
            field: 'sender.mobile',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 发货人地址
        {
          options: {
            left: 5,
            top: 104,
            height: 28,
            width: 130,
            title: '地址:',
            field: 'sender.address',
            fontSize: 8,
            lineHeight: 14
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        },

        // 收货人标签
        {
          options: {
            left: 145,
            top: 68,
            height: 12,
            width: 135,
            title: '收货人信息',
            fontSize: 10,
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0',
            padding: '2pt'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 收货人姓名
        {
          options: {
            left: 145,
            top: 82,
            height: 10,
            width: 135,
            title: '姓名:',
            field: 'receiver.name',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 收货人电话
        {
          options: {
            left: 145,
            top: 93,
            height: 10,
            width: 135,
            title: '电话:',
            field: 'receiver.mobile',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 收货人地址
        {
          options: {
            left: 145,
            top: 104,
            height: 28,
            width: 135,
            title: '地址:',
            field: 'receiver.address',
            fontSize: 8,
            lineHeight: 14
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        },

        // ========== 运单详情区域 ==========
        // 运单信息标签
        {
          options: {
            left: 5,
            top: 138,
            height: 12,
            width: 275,
            title: '运单详情',
            fontSize: 10,
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0',
            padding: '2pt'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 付款方式
        {
          options: {
            left: 5,
            top: 152,
            height: 10,
            width: 65,
            title: '付款:',
            field: 'waybill.paymentType',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 重量
        {
          options: {
            left: 75,
            top: 152,
            height: 10,
            width: 65,
            title: '重量:',
            field: 'waybill.weight',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 运费
        {
          options: {
            left: 145,
            top: 152,
            height: 10,
            width: 65,
            title: '运费:',
            field: 'waybill.freight',
            fontSize: 9
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },

        // ========== 备注区域 ==========
        // 备注标签
        {
          options: {
            left: 5,
            top: 168,
            height: 12,
            width: 275,
            title: '备注信息',
            fontSize: 10,
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0',
            padding: '2pt'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 备注内容
        {
          options: {
            left: 5,
            top: 182,
            height: 30,
            width: 180,
            field: 'remark',
            fontSize: 8,
            lineHeight: 14
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        },

        // 二维码标签
        {
          options: {
            left: 220,
            top: 168,
            height: 10,
            width: 60,
            title: '扫码追踪',
            fontSize: 8,
            textAlign: 'center',
            color: '#666'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 二维码
        {
          options: {
            left: 225,
            top: 180,
            height: 45,
            width: 45,
            field: 'tracking.qrcode',
            textAlign: 'center'
          },
          printElementType: { title: '二维码', tid: 'defaultModule.qrcode' }
        },

        // ========== 底部区域 ==========
        // 打印时间
        {
          options: {
            left: 5,
            top: 230,
            height: 10,
            width: 180,
            title: '打印时间: 2024-01-15 10:30:00',
            fontSize: 7,
            color: '#999'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 温馨提示
        {
          options: {
            left: 5,
            top: 242,
            height: 22,
            width: 275,
            title: '温馨提示: 请在签收前检查包裹完整性，如有问题请及时联系客服。签收后视为商品完好。',
            fontSize: 7,
            lineHeight: 12,
            color: '#666'
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        }
      ]
    }
  ]
}
