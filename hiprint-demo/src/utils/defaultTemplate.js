/**
 * 默认物流面单模板
 * 预置的标准物流面单设计
 */

export const defaultLogisticsTemplate = {
  panels: [
    {
      index: 0,
      paperType: '10x15',
      height: 15,
      width: 10,
      paperHeader: 5,
      paperFooter: 5,
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
            height: 10,
            width: 70,
            title: '顺丰速运 SF EXPRESS',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#409EFF'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 运单号标签
        {
          options: {
            left: 140,
            top: 5,
            height: 8,
            width: 30,
            title: '运单号',
            fontSize: 10,
            textAlign: 'center'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 运单号
        {
          options: {
            left: 140,
            top: 13,
            height: 12,
            width: 65,
            title: 'waybill.no',
            field: 'waybill.no',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 条形码
        {
          options: {
            left: 140,
            top: 25,
            height: 25,
            width: 60,
            title: 'waybill.no',
            field: 'waybill.no',
            textAlign: 'center'
          },
          printElementType: { title: '条形码', tid: 'defaultModule.barcode' }
        },
        // 发货人标签
        {
          options: {
            left: 5,
            top: 40,
            height: 7,
            width: 95,
            title: '发货人信息',
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '2px solid #333',
            paddingBottom: '3px'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 发货人姓名
        {
          options: {
            left: 5,
            top: 49,
            height: 7,
            width: 45,
            title: '发货人: sender.name',
            field: 'sender.name',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 发货人电话
        {
          options: {
            left: 55,
            top: 49,
            height: 7,
            width: 45,
            title: '电话: sender.mobile',
            field: 'sender.mobile',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 发货人地址
        {
          options: {
            left: 5,
            top: 57,
            height: 15,
            width: 95,
            title: '地址: sender.province sender.city sender.district sender.address',
            field: 'sender.province, sender.city, sender.district, sender.address',
            fontSize: 9,
            lineHeight: 18
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        },
        // 收货人标签
        {
          options: {
            left: 105,
            top: 40,
            height: 7,
            width: 100,
            title: '收货人信息',
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '2px solid #333',
            paddingBottom: '3px'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 收货人姓名
        {
          options: {
            left: 105,
            top: 49,
            height: 7,
            width: 45,
            title: '收货人: receiver.name',
            field: 'receiver.name',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 收货人电话
        {
          options: {
            left: 155,
            top: 49,
            height: 7,
            width: 50,
            title: '电话: receiver.mobile',
            field: 'receiver.mobile',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 收货人地址
        {
          options: {
            left: 105,
            top: 57,
            height: 15,
            width: 100,
            title: '地址: receiver.province receiver.city receiver.district receiver.address',
            field: 'receiver.province, receiver.city, receiver.district, receiver.address',
            fontSize: 9,
            lineHeight: 18
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        },
        // 运单信息标签
        {
          options: {
            left: 5,
            top: 77,
            height: 7,
            width: 200,
            title: '运单详情',
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '2px solid #333',
            paddingBottom: '3px'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 服务类型
        {
          options: {
            left: 5,
            top: 86,
            height: 7,
            width: 50,
            title: '服务: waybill.serviceType',
            field: 'waybill.serviceType',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 付款方式
        {
          options: {
            left: 60,
            top: 86,
            height: 7,
            width: 50,
            title: '付款: waybill.paymentType',
            field: 'waybill.paymentType',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 重量
        {
          options: {
            left: 115,
            top: 86,
            height: 7,
            width: 40,
            title: '重量: waybill.weight kg',
            field: 'waybill.weight',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 运费
        {
          options: {
            left: 160,
            top: 86,
            height: 7,
            width: 45,
            title: '运费: ¥waybill.freight',
            field: 'waybill.freight',
            fontSize: 10
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 商品列表标签
        {
          options: {
            left: 5,
            top: 98,
            height: 7,
            width: 200,
            title: '商品清单',
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '2px solid #333',
            paddingBottom: '3px'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 商品表格
        {
          options: {
            left: 5,
            top: 107,
            height: 50,
            width: 200,
            field: 'products',
            tableHeaderRepeat: 'first',
            columns: [
              [
                {
                  title: '序号',
                  field: 'no',
                  width: 20,
                  align: 'center',
                  colspan: 1,
                  rowspan: 1
                },
                {
                  title: '商品名称',
                  field: 'name',
                  width: 80,
                  align: 'left',
                  colspan: 1,
                  rowspan: 1
                },
                {
                  title: '规格',
                  field: 'spec',
                  width: 60,
                  align: 'left',
                  colspan: 1,
                  rowspan: 1
                },
                {
                  title: '数量',
                  field: 'quantity',
                  width: 20,
                  align: 'center',
                  colspan: 1,
                  rowspan: 1
                }
              ]
            ]
          },
          printElementType: { title: '表格', tid: 'defaultModule.table' }
        },
        // 备注标签
        {
          options: {
            left: 5,
            top: 162,
            height: 7,
            width: 200,
            title: '备注信息',
            fontSize: 12,
            fontWeight: 'bold',
            borderBottom: '2px solid #333',
            paddingBottom: '3px'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 备注内容
        {
          options: {
            left: 5,
            top: 171,
            height: 20,
            width: 200,
            title: 'remark',
            field: 'remark',
            fontSize: 9,
            lineHeight: 18
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        },
        // 二维码标签
        {
          options: {
            left: 150,
            top: 195,
            height: 7,
            width: 55,
            title: '扫码追踪',
            fontSize: 10,
            textAlign: 'center'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 二维码
        {
          options: {
            left: 160,
            top: 202,
            height: 35,
            width: 35,
            title: 'tracking.qrcode',
            field: 'tracking.qrcode',
            textAlign: 'center'
          },
          printElementType: { title: '二维码', tid: 'defaultModule.qrcode' }
        },
        // 打印时间
        {
          options: {
            left: 5,
            top: 245,
            height: 6,
            width: 140,
            title: '打印时间: 2024-01-15 10:30:00',
            fontSize: 8,
            color: '#999'
          },
          printElementType: { title: '文本', tid: 'defaultModule.text' }
        },
        // 温馨提示
        {
          options: {
            left: 5,
            top: 255,
            height: 15,
            width: 140,
            title: '温馨提示: 请在签收前检查包裹完整性，如有问题请及时联系客服。签收后视为商品完好。',
            fontSize: 7,
            lineHeight: 14,
            color: '#666'
          },
          printElementType: { title: '长文本', tid: 'defaultModule.longText' }
        }
      ]
    }
  ]
}
