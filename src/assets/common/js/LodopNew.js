import { getLodop } from './LodopFuncs'

function formatMoney (number, places, symbol) {
  if (number == '' || number == undefined) {
    return ''
  }
  number = number || 0
  places = !isNaN((places = Math.abs(places))) ? places : 2
  symbol = symbol !== undefined ? symbol : '￥'
  var negative = number < 0 ? '-' : '',
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + '',
    j = (j = i.length) > 3 ? j % 3 : 0
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + ',' : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + ',') +
    (places
      ? '.' +
      Math.abs(number - i)
        .toFixed(places)
        .slice(2)
      : '')
  )
}

var LODOP

function startLodop (data) {
  CreateDataBill(data)
  LODOP.PREVIEW()
}

// 单个打印
function CreateDataBill (data) {
  LODOP = getLodop()
  // 电子收据
  if (data.receipt_type === 'electronic') {
    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(130, 120, 150, 20, '小区名称：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(130, 180, 150, 20, data.villagename)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(160, 120, 150, 20, '收费项目')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    for (var i = 0; i < data.subject_detail.length; i++) {
      var m = 20
      if (data.subject_detail.length > 4) {
        m = 17
      }
      LODOP.ADD_PRINT_TEXT(
        parseInt(180 + m * i),
        120,
        170,
        70,
        data.subject_detail[i].project
      )
      LODOP.ADD_PRINT_TEXT(
        parseInt(180 + m * i),
        220,
        330,
        70,
        data.subject_detail[i].zy
      )
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      if (data.subject_detail[i].hzzz != 0) {
        LODOP.ADD_PRINT_TEXT(
          parseInt(180 + m * i),
          550,
          100,
          70,
          formatMoney(data.subject_detail[i].mainmoney, 2, '￥')
        )
      }
    }

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(160, 250, 250, 20, '摘      要：')
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    //LODOP.ADD_PRINT_TEXT(140,250,250,100,data.zy);
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(160, 540, 80, 20, '金额：')
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    // LODOP.ADD_PRINT_TEXT(140,540,80,20,formatMoney(data.mainmoney,2,"￥"));
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(130, 300, 180, 20, '房号/姓名：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    if (data.roomnum == data.owner_name) {
      LODOP.ADD_PRINT_TEXT(130, 370, 150, 20, data.roomnum)
    } else {
      if (data.owner_name) {
        LODOP.ADD_PRINT_TEXT(
          130,
          370,
          150,
          20,
          data.roomnum +
          '/' +
          data.owner_name.substr(0, 5) +
          ' \n' +
          data.owner_name.substr(5, data.owner_name.length)
        )
      } else {
        LODOP.ADD_PRINT_TEXT(130, 370, 150, 20, data.roomnum + '/')
      }
    }

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(130, 500, 150, 20, '日期：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(130, 540, 150, 20, data.date)

    if(data.bz) {
      const sliceStr = data.bz.slice(0, 75)
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(280, 130, 150, 20, '备注：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(280, 170, 450, 20, sliceStr)
    }

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(300, 130, 300, 20, '合计：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(300, 170, 300, 20, formatMoney(data.money, 2, '￥'))

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(300, 240, 300, 20, '人民币(大写)：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(300, 330, 300, 20, data.capitalization_money)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(300, 460, 300, 20, '渠道：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(300, 500, 300, 20, data.pay_type)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(340, 120, 150, 20, '收款单位：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(340, 180, 150, 40, data.payee)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(340, 320, 150, 20, '收款人：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(340, 370, 150, 20, data.creater)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(340, 440, 150, 20, '交款人：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(340, 490, 150, 20, data.owner_name)
    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.SET_PRINT_STYLE('FontSize', '12')
    LODOP.ADD_PRINT_TEXT(55, 540, 150, 20, '状态：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(55, 590, 150, 20, data.receipt_status_yext)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.SET_PRINT_STYLE('FontSize', '13')
    LODOP.ADD_PRINT_TEXT(75, 500, 150, 20, 'No')
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)
    LODOP.SET_PRINT_STYLE('FontColor', '#800000')
    LODOP.ADD_PRINT_TEXT(75, 520, 150, 20, data.receipt_num)
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)
    LODOP.ADD_PRINT_SHAPE(2, 100, 100, 540, 290, 0)
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)
    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.SET_PRINT_STYLE('FontSize', '20')
    LODOP.SET_PRINT_STYLE('FontWeight', '800')
    LODOP.ADD_PRINT_TEXT(60, 350, 390, 20, '收据')
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)

    LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')

    // 印章
    LODOP.ADD_PRINT_IMAGE(
      320,
      220,
      '100%',
      '100%',
      "<img src='" + data.seal_image + "' style='width: 80px;height:80px;' />"
    )
    LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')

    // 小程序二维码
    LODOP.ADD_PRINT_IMAGE(
      290,
      550,
      '100%',
      '100%',
      `<img src="${data.qrcode_base64}" style="width: 80px;height:80px;"/>`
    )
    LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')
  } else {
    // 纸质收据
    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(70, 120, 150, 20, '小区名称：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(70, 180, 150, 20, data.villagename)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(100, 120, 150, 20, '收费项目')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')

    for (var i = 0; i < data.subject_detail.length; i++) {
      var m = 20
      if (data.subject_detail.length > 4) {
        m = 17
      }
      LODOP.ADD_PRINT_TEXT(
        parseInt(120 + m * i),
        120,
        170,
        70,
        data.subject_detail[i].project
      )
      LODOP.ADD_PRINT_TEXT(
        parseInt(120 + m * i),
        220,
        330,
        70,
        data.subject_detail[i].zy
      )
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      if (data.subject_detail[i].hzzz != 0) {
        LODOP.ADD_PRINT_TEXT(
          parseInt(120 + m * i),
          550,
          100,
          70,
          formatMoney(data.subject_detail[i].mainmoney, 2, '￥')
        )
      }
    }

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(100, 250, 250, 20, '摘      要：')
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    //LODOP.ADD_PRINT_TEXT(140,250,250,100,data.zy);
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(100, 540, 80, 20, '金额：')
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    // LODOP.ADD_PRINT_TEXT(140,540,80,20,formatMoney(data.mainmoney,2,"￥"));
    LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(70, 300, 180, 20, '房号/姓名：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')

    if (data.roomnum == data.owner_name) {
      LODOP.ADD_PRINT_TEXT(70, 370, 150, 20, data.roomnum)
    } else {
      if (data.owner_name) {
        LODOP.ADD_PRINT_TEXT(
          70,
          370,
          150,
          20,
          data.roomnum +
          '/' +
          data.owner_name.substr(0, 5) +
          ' \n' +
          data.owner_name.substr(5, data.owner_name.length)
        )
      } else {
        LODOP.ADD_PRINT_TEXT(70, 370, 150, 20, data.roomnum + '/')
      }
    }

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(70, 500, 150, 20, '日期：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(70, 540, 150, 20, data.date)

    if(data.bz) {
      const sliceStr = data.bz.slice(0, 75)
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(200, 130, 150, 20, '备注：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(200, 170, 450, 20, sliceStr)
    }

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(220, 130, 300, 20, '合计：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(220, 170, 300, 20, formatMoney(data.money, 2, '￥'))

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(220, 280, 300, 20, '人民币(大写)：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(220, 370, 300, 20, data.capitalization_money)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(220, 500, 300, 20, '渠道：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(220, 540, 300, 20, data.pay_type)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(260, 120, 150, 20, '收款单位：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(260, 180, 150, 40, data.payee)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(260, 340, 150, 20, '收款人：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(260, 390, 150, 20, data.creater)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.ADD_PRINT_TEXT(260, 460, 150, 20, '交款人：')
    LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
    LODOP.ADD_PRINT_TEXT(260, 510, 150, 20, data.owner_name)

    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.SET_PRINT_STYLE('FontSize', '13')
    LODOP.ADD_PRINT_TEXT(15, 500, 150, 20, 'No')
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)
    LODOP.SET_PRINT_STYLE('FontColor', '#800000')
    LODOP.ADD_PRINT_TEXT(15, 520, 150, 20, data.receipt_num)
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)
    LODOP.ADD_PRINT_SHAPE(2, 40, 100, 540, 290, 0)
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)
    LODOP.SET_PRINT_STYLE('FontColor', '#000000')
    LODOP.SET_PRINT_STYLE('FontSize', '20')
    LODOP.SET_PRINT_STYLE('FontWeight', '800')
    LODOP.ADD_PRINT_TEXT(0, 350, 390, 20, '收据')
    LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)

    LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')
  }
}

// 批量打印
function startMorePrintLodop (datas) {
  LODOP = getLodop()
  LODOP.PRINT_INIT("")
  LODOP.SET_PRINT_PAGESIZE(1, 2100, 1300, "")
  for (var j = 0; j < datas.length; j++) {
    LODOP.NewPageA()
    const data = datas[j]
    // 电子收据
    if (data.receipt_type === 'electronic') {
      LODOP.SET_PRINT_STYLE('FontSize', '9')
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(130, 120, 150, 20, '小区名称：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(130, 180, 150, 20, data.villagename)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(160, 120, 150, 20, '收费项目')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      for (var i = 0; i < data.subject_detail.length; i++) {
        var m = 20
        if (data.subject_detail.length > 4) {
          m = 17
        }
        LODOP.ADD_PRINT_TEXT(
          parseInt(180 + m * i),
          120,
          170,
          70,
          data.subject_detail[i].project
        )
        LODOP.ADD_PRINT_TEXT(
          parseInt(180 + m * i),
          220,
          330,
          70,
          data.subject_detail[i].zy
        )
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        if (data.subject_detail[i].hzzz != 0) {
          LODOP.ADD_PRINT_TEXT(
            parseInt(180 + m * i),
            550,
            100,
            70,
            formatMoney(data.subject_detail[i].mainmoney, 2, '￥')
          )
        }
      }

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(160, 250, 250, 20, '摘      要：')
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      //LODOP.ADD_PRINT_TEXT(140,250,250,100,data.zy);
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(160, 540, 80, 20, '金额：')
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      // LODOP.ADD_PRINT_TEXT(140,540,80,20,formatMoney(data.mainmoney,2,"￥"));
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(130, 300, 180, 20, '房号/姓名：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      if (data.roomnum == data.owner_name) {
        LODOP.ADD_PRINT_TEXT(130, 370, 150, 20, data.roomnum)
      } else {
        if (data.owner_name) {
          LODOP.ADD_PRINT_TEXT(
            130,
            370,
            150,
            20,
            data.roomnum +
            '/' +
            data.owner_name.substr(0, 5) +
            ' \n' +
            data.owner_name.substr(5, data.owner_name.length)
          )
        } else {
          LODOP.ADD_PRINT_TEXT(130, 370, 150, 20, data.roomnum + '/')
        }
      }

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(130, 500, 150, 20, '日期：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(130, 540, 150, 20, data.date)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(300, 130, 300, 20, '合计：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(300, 170, 300, 20, formatMoney(data.money, 2, '￥'))

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(300, 240, 300, 20, '人民币(大写)：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(300, 330, 300, 20, data.capitalization_money)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(300, 460, 300, 20, '渠道：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(300, 500, 300, 20, data.pay_type)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(340, 120, 150, 20, '收款单位：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(340, 180, 150, 40, data.payee)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(340, 320, 150, 20, '收款人：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(340, 370, 150, 20, data.creater)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(340, 440, 150, 20, '交款人：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(340, 490, 150, 20, data.owner_name)
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.SET_PRINT_STYLE('FontSize', '12')
      LODOP.ADD_PRINT_TEXT(55, 540, 150, 20, '状态：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(55, 590, 150, 20, data.receipt_status_yext)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.SET_PRINT_STYLE('FontSize', '13')
      LODOP.ADD_PRINT_TEXT(75, 500, 150, 20, 'No')
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)
      LODOP.SET_PRINT_STYLE('FontColor', '#800000')
      LODOP.ADD_PRINT_TEXT(75, 520, 150, 20, data.receipt_num)
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)
      LODOP.ADD_PRINT_SHAPE(2, 100, 100, 540, 290, 0)
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.SET_PRINT_STYLE('FontSize', '20')
      LODOP.SET_PRINT_STYLE('FontWeight', '800')
      LODOP.ADD_PRINT_TEXT(60, 350, 390, 20, '收据')
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', false)

      LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')

      // 印章
      LODOP.ADD_PRINT_IMAGE(
        320,
        220,
        '100%',
        '100%',
        "<img src='" + data.seal_image + "' style='width: 80px;height:80px;' />"
      )
      LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')

      // 小程序二维码
      LODOP.ADD_PRINT_IMAGE(
        290,
        550,
        '100%',
        '100%',
        `<img src="${data.qrcode_base64}" style="width: 80px;height:80px;"/>`
      )
      LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')
    } else {
      // 纸质收据
      LODOP.SET_PRINT_STYLE('FontSize', '9')
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(70, 120, 150, 20, '小区名称：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(70, 180, 150, 20, data.villagename)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(100, 120, 150, 20, '收费项目')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')

      for (var i = 0; i < data.subject_detail.length; i++) {
        var m = 20
        if (data.subject_detail.length > 4) {
          m = 17
        }
        LODOP.ADD_PRINT_TEXT(
          parseInt(120 + m * i),
          120,
          170,
          70,
          data.subject_detail[i].project
        )
        LODOP.ADD_PRINT_TEXT(
          parseInt(120 + m * i),
          220,
          330,
          70,
          data.subject_detail[i].zy
        )
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        if (data.subject_detail[i].hzzz != 0) {
          LODOP.ADD_PRINT_TEXT(
            parseInt(120 + m * i),
            550,
            100,
            70,
            formatMoney(data.subject_detail[i].mainmoney, 2, '￥')
          )
        }
      }

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(100, 250, 250, 20, '摘      要：')
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      //LODOP.ADD_PRINT_TEXT(140,250,250,100,data.zy);
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(100, 540, 80, 20, '金额：')
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      // LODOP.ADD_PRINT_TEXT(140,540,80,20,formatMoney(data.mainmoney,2,"￥"));
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(70, 300, 180, 20, '房号/姓名：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')

      if (data.roomnum == data.owner_name) {
        LODOP.ADD_PRINT_TEXT(70, 370, 150, 20, data.roomnum)
      } else {
        if (data.owner_name) {
          LODOP.ADD_PRINT_TEXT(
            70,
            370,
            150,
            20,
            data.roomnum +
            '/' +
            data.owner_name.substr(0, 5) +
            ' \n' +
            data.owner_name.substr(5, data.owner_name.length)
          )
        } else {
          LODOP.ADD_PRINT_TEXT(70, 370, 150, 20, data.roomnum + '/')
        }
      }

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(70, 500, 150, 20, '日期：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(70, 540, 150, 20, data.date)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(220, 130, 300, 20, '合计：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(220, 170, 300, 20, formatMoney(data.money, 2, '￥'))

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(220, 280, 300, 20, '人民币(大写)：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(220, 370, 300, 20, data.capitalization_money)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(220, 500, 300, 20, '渠道：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(220, 540, 300, 20, data.pay_type)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(260, 120, 150, 20, '收款单位：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(260, 180, 150, 40, data.payee)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(260, 340, 150, 20, '收款人：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(260, 390, 150, 20, data.creater)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.ADD_PRINT_TEXT(260, 460, 150, 20, '交款人：')
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT(260, 510, 150, 20, data.owner_name)

      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.SET_PRINT_STYLE('FontSize', '13')
      LODOP.ADD_PRINT_TEXT(15, 500, 150, 20, 'No')
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)
      LODOP.SET_PRINT_STYLE('FontColor', '#800000')
      LODOP.ADD_PRINT_TEXT(15, 520, 150, 20, data.receipt_num)
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)
      LODOP.ADD_PRINT_SHAPE(2, 40, 100, 540, 290, 0)
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)
      LODOP.SET_PRINT_STYLE('FontColor', '#000000')
      LODOP.SET_PRINT_STYLE('FontSize', '20')
      LODOP.SET_PRINT_STYLE('FontWeight', '800')
      LODOP.ADD_PRINT_TEXT(0, 350, 390, 20, '收据')
      LODOP.SET_PRINT_STYLEA(0, 'PreviewOnly', true)

      LODOP.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')
    }
  }
  LODOP.PREVIEW()
}

export default { startLodop, startMorePrintLodop }
