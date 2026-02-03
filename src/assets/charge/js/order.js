// 导入打印 js 文件
import myPrint from '@/assets/common/js/LodopNew.js'
import { getLodop } from '@/assets/common/js/LodopFuncs.js'
import workIcon from '@/components/common/workIcon.vue'
import orderCloumns from '../json/order-cloumns.json'
import historyDetail from '@/assets/charge/json/history-detail-dialog.json'
import accountList from '../json/account-list.json'
import accountInfo from '../json/account-info.json'
import orderInfo from '../json/order-info.json'

// 导入时间选择器组件
// import DatePicker from '@hyjiacan/vue-datepicker'
// import '@hyjiacan/vue-datepicker/dist/datepicker.css'

import { _ } from 'core-js'

export default {
  name: 'order',
  components: {
    workIcon,
    // DatePicker
  },
  data () {
    return {
      urlObj: {
        orderList: this.$api.state.Charge.orderList.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        repairReceipt: this.$api.state.Charge.repairReceipt.url,
        issueReceipt: this.$api.state.Charge.issueReceipt.url,
        resalesn: this.$api.state.Charge.resalesn.url,
        changepaytype: this.$api.state.Charge.changepaytype.url,
        sndetail: this.$api.state.Charge.sndetail.url,
        repairinvoice: this.$api.state.Charge.repairinvoice.url,
        getfptype: this.$api.state.Charge.getfptype.url,
        changetickets: this.$api.state.Charge.changetickets.url,
        importsninvoice: this.$api.state.Charge.importsninvoice.url,
        getinvoiceinfo: this.$api.state.Charge.getinvoiceinfo.url,
        getwxqrcode: this.$api.state.Charge.getwxqrcode.url,
        accountList: this.$api.state.Setting.accountList.url,
        accountAudit: this.$api.state.Setting.accountAudit.url,
        orderDetail: this.$api.state.Setting.orderDetail.url,
        accountDetail: this.$api.state.Setting.accountDetail.url,
        revAccount: this.$api.state.Setting.revAccount.url,
        lastTime: this.$api.state.Setting.lastTime.url,
        accountdel: this.$api.state.Setting.accountdel.url,
        recordInfoList: this.$api.state.Setting.recordInfoList.url,
        getAuditors: this.$api.state.Public.getAuditors.url,
        getreceipttype: this.$api.state.Charge.getreceipttype.url,
      },
      // 搜索框绑定值
      searchVal: '',
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: orderCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 缴费状态下拉框绑定值
      chargeStatus: '',
      // 缴费状态数据列表
      statusOptions: [
        {
          value: 1,
          label: '未交'
        },
        {
          value: 2,
          label: '已交'
        }
      ],
      // 缴费渠道下拉框绑定值
      chargeChannel: '',
      // 缴费渠道数据列表
      channelOptions: [],
      // 订单支付方式列表
      orderPayments: [],
      // 订单状态下拉框绑定值
      orderStatus: '',
      // 订单状态数据列表
      orderOptions: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '作废'
        }
      ],
      // 日期范围选择值
      dateValue: [],
      // 是否只读
      dateRead: true,
      // 应收合计
      allmoney: '0.00',
      // 实收合计
      money: '0.00',
      // 优惠合计
      yhmoney: '0.00',
      // 是否显示明细弹框
      showDetailPop: false,
      // 表格数据
      popTableData: [],
      // 表格列数据配置
      popColumns: historyDetail.list,
      // 表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 表格数据
      infoTableData: [],
      // 表格列数据配置
      infoColumns: orderInfo.list,
      // 表格配置
      infoConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 实收金额
      realityMoney: '',
      // 应收金额
      receivableMoney: '',
      // 是否显示缴销记录弹框
      showRecordDialog: false,
      // 缴销记录表格数据
      recordTableData: [],
      // 缴销记录表格
      recordColumns: accountList.list,
      // 缴销记录表格配置
      recordConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 上次提交时间
      lastTime: '',
      // 日期筛选框绑定值
      dateFilter: ['', ''],
      // 当前查询时的日期范围
      searchDate: [],
      // 是否显示查询结果表格
      showSearchTable: false,
      // 记录搜索表格数据
      searchTableData: [],
      // 记录搜索表格配置
      searchConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示记录明细弹框
      showInfoDialog: false,
      // 记录明细表格数据
      rcdInfoData: [],
      // 记录明细配置
      rcdInfoColumns: accountInfo.list,
      // 记录明细表格配置
      rcdInfoConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 记录明细合计金额
      totalMoney: '0.00',
      // 是否显示换票弹框
      showTicketChange: false,
      // 当前换票的发票数据
      currentTicket: '',
      // 表单数据对象
      changeForm: {
        code: '',
        number: '',
        type: ''
      },
      // 表单验证规则
      changeRules: {
        code: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        number: [
          { required: true, message: '请输入发票号码', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择发票类型', trigger: 'change' }]
      },
      // 发票类型列表
      typeList: [],
      // 是否正在提交数据
      isCommit: false,
      // 要下载的发票的链接
      downloadUrl: '',
      // 是否显示收据二维码弹框
      showQrcodeDialog: false,
      // 二维码地址
      qrSrc: '',
      downloadData: {
        url: '',
        icon: ''
      },
      // 是否显示打印类型选择弹框
      showPrintDialog: false,
      // 当前打印的数据
      printData: '',
      // 横版/竖版 选择值
      radioVal: 1,
      // 是否显示审批人选择弹框
      showAuditDialog: false,
      // 审批人 表单数据对象
      auditForm: {
        auditors: [
          { auditor: '', options: [] }
        ],
      },
      auditRules: {
        auditor: [{ required: true, message: '选择审批人', trigger: 'change' }]
      },
      // 是否正在加载审批人数据
      loading: false,
      // 是否是重新交账
      isAgain: false,
      againObj: '',
      // 订单备注
      orderRemark: '',
      // 是否显示补开收据弹框
      showFillDialog: false,
      useReceiptType: 1,
      receiptType: 1,
      // 是否正在加载开始时间
      loadStime: false,
      filldisabled: false,
      // 是否显示发票植入弹框
      showImplantDialog: false,
      // 当前植入发票数据
      currentImplant: '',
      // 发票植入 表单数据对象
      implantForm: {
        code: '',
        number: '',
      },
      // 发票植入 表单验证规则
      implantRules: {
        code: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        number: [
          { required: true, message: '请输入发票号码', trigger: 'blur' }
        ],
      },
    }
  },

  mounted () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let start = new Date(y + '-' + m + '-' + d + ' 00:00:00').getTime()
    let end = date.getTime()
    // 时间选择器初始化
    this.dateValue = [start, end]
    this.getPayments()
    this.getPaymentType()
    this.tableLoad()
  },

  methods: {
    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.searchVal = ''
      this.chargeStatus = ''
      this.chargeChannel = ''
      this.channelOptions = []
      this.orderStatus = ''
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 请求接口获取表单数据
      this.tableLoad()
      this.getPaymentType()
    },

    // 点击查询按钮处理
    keySearch () {
      if (this.searchVal) {
        this.conf = {
          loadStatus: false,
          emptyText: '',
          curPage: 1,
          limit: 20,
          dataTotal: 0
        }
        this.chargeStatus = ''
        this.orderStatus = ''
        this.chargeChannel = ''
        this.dateValue = []
      }
      this.tableLoad()
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        is_page: 1,
        status: this.chargeStatus,
        pstatus: this.orderStatus,
        pay_type: this.chargeChannel,
        keywords: this.searchVal
      }
      if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        data.stime = this.dateValue[0] / 1000
        data.etime = this.dateValue[1] / 1000
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.orderList, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.list.data && res.Data.list.data.length > 0) {
              let ids = this.orderPayments.map(item => item.id)
              res.Data.list.data.forEach(item => {
                item.resourceName = item.sndetails.map(itm => itm.model_text).join('、')
                item.paymentOptions = this.orderPayments
                item.type = ids.includes(item.type)
                  ? item.type
                  : item.payment
                    ? item.payment.name
                    : ''
                item.freceipt = item.fphm && item.receipt ? item.fphm + '/' + item.receipt : item.fphm ? item.fphm : item.receipt ? item.receipt : ''
                item.sfname = item.creater ? item.creater.realname : ''
                // 是否可以查看详情
                item.xqhide = false
                // 是否可以返销订单
                let fxflag = this.$menu.getters.judgeRole('Btn-Ca4BnJLT1Yl51cx9f0icJESk') && this.$menu.getters.judgeRole('Btn-T5EkZJ9w1SSdGxxZy7ghN8Cb')
                item.fxhide =
                  item.status == 0 || item.pstatus == 2 ? true : false
                item.fxhide1 =
                  item.status == 0 || item.pstatus == 2 || fxflag ? true : false
                // 是否可以打印收据
                item.dyhide = item.receipt && item.pstatus == 1 ? false : true
                // 是否可以下载发票
                item.xzhide = item.fphm ? false : true
                // 是否可以补开发票
                item.bkhide =
                  item.status == 0 ||
                    item.pstatus == 2 ||
                    item.open_receipt_fp == 0
                    ? true
                    : false
                // 是否可以补开收据
                item.rbkhide =
                  item.status == 0 ||
                    item.pstatus == 2 ||
                    item.receipt
                    ? true
                    : false
                // 是否可以换票
                item.hphide = item.receipt && item.pstatus == 1 ? false : true
                // 是否可以展示收据二维码
                item.qrhide = item.receipt && item.pstatus == 1 ? false : true
                // 是否显示植入发票
                item.zrhide = item.fpdm ? true : false
              })
            }
            this.money = _.round(res.Data.money, 2)
            this.yhmoney = _.round(res.Data.yhmoney, 2)
            this.allmoney = _.round(res.Data.allmoney, 2)
            // 设置查询总数
            this.conf.dataTotal = res.Data.list.total
            // 存放查询数据
            this.tableData = res.Data.list.data
            // 关闭加载状态
            this.conf.loadStatus = false
            // 清空空数据提示
            this.conf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.tableData = []
            this.conf.emptyText = res.Message
            this.conf.dataTotal = 0
            this.conf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.tableData = []
          this.conf.emptyText = '服务器连接失败...'
          this.conf.dataTotal = 0
          this.conf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    sizeChange (num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange (num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 获取所有支付方式
    getPaymentType () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.channelOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取支付方式失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取订单支付方式
    getPayments () {
      let data = {
        vid: this.choseVillageInfo.vid,
        receipts: 1
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.orderPayments = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取支付方式失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 支付方式更改处理
    selectChange (index) {
      let data = {
        id: this.tableData[index].id,
        pay_type: this.tableData[index].type
      }
      this.$axios
        .post(this.urlObj.changepaytype, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '支付方式修改成功！',
              type: 'success'
            })
          } else {
            let msg = res.Message ? res.Message : '支付方式修改失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          // 重新获取一次数据
          this.tableLoad()
        })
        .catch(() => { })
    },

    /* 导出EXCEL */
    exportExcel () {
      // 获取所有数据
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        is_page: 0,
        status: this.chargeStatus,
        pstatus: this.orderStatus,
        pay_type: this.chargeChannel,
        stime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        etime:
          this.dateValue && this.dateValue[1] ? this.dateValue[1] / 1000 : '',
        keywords: this.searchVal
      }
      this.$axios.post(this.urlObj.orderList, data).then(res => {
        if (res.Code === 200) {
          let arr =
            res.Data.list && res.Data.list.length > 0 ? res.Data.list : []
          this.exportDataHandle(arr)
        } else {
          let msg = res.Message ? res.Message : '订单列表数据获取失败！'
          $message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    // 导出数据处理
    exportDataHandle (result) {
      try {
        require.ensure([], () => {
          // 引入excel.js
          let {
            export_json_to_excel
          } = require('@/assets/common/excel/Export2Excel')

          let header = [
            '姓名',
            '房号',
            '资源名称',
            '装修状态',
            '实收金额',
            '优惠金额',
            '应收金额',
            '订单状态',
            '缴费状态',
            '收款方式',
            '收费员',
            '缴费内容',
            '发票收据',
            '订单号',
          ]

          // 整理需要导出的数据
          let datas = []
          result.forEach(item => {
            let arr = [
              item.realname,
              item.roomnum,
              item.sndetails.map(itm => itm.model_text).join('、'),
              item.isdecorate,
              Number(item.money) ? Number(item.money) : 0,
              Number(item.yhmoney) ? Number(item.yhmoney) : 0,
              Number(item.allmoney) ? Number(item.allmoney) : 0,
              item.pstatus_text,
              item.status == 1 ? '已交' : '未交',
              item.payment ? item.payment.name : '',
              item.creater ? item.creater.realname : '',
              item.remark,
              item.receipt ? item.receipt : '',
              item.sn,
            ]
            datas.push(arr)
          })

          // 执行导出操作
          export_json_to_excel(header, datas, '订单数据表')
        })

        this.$notify({
          type: 'success',
          title: '温馨提示',
          message: '导出报表成功',
          duration: 1500
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    },

    // 返销
    buyBack (obj) {
      this.$confirm('此操作将返销当前订单，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 返销确认请求
          let data = {
            id: obj.id
          }
          this.$axios
            .post(this.urlObj.resalesn, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '订单返销成功！',
                  type: 'success'
                })
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '订单返销失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 获取订单详情
    detailTableLoad (data) {
      // 表格处于加载状态
      this.popConf.loadStatus = true
      this.infoConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.sndetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.receivableMoney = res.Data.allmoney ? res.Data.allmoney : '0.00'
            this.realityMoney = res.Data.money ? res.Data.money : '0.00'
            if (res.Data.deatil && res.Data.deatil.length > 0) {
              res.Data.deatil.forEach(item => {
                item.subname = item.subject ? item.subject.name : '--'
                item.payname = item.payment ? item.payment.name : '--'
                item.oname = item.owner ? item.owner.realname : '--'
              })
            }
            if (res.Data.cost && res.Data.cost.length > 0) {
              res.Data.cost.forEach(item => {
                item.subname = item.subject ? item.subject.name : '--'
                item.remark = item.previewCostRepair ? item.previewCostRepair.remarks : ''
              })
            }
            this.orderRemark = res.Data.sn ? res.Data.sn.bz : ''
            // 存放查询数据
            this.popTableData = res.Data.deatil ? res.Data.deatil : []
            this.infoTableData = res.Data.cost ? res.Data.cost : []
            // 关闭加载状态
            this.popConf.loadStatus = false
            this.infoConf.loadStatus = false
            // 清空空数据提示
            this.popConf.emptyText = ''
            this.infoConf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.popTableData = []
            this.infoTableData = []
            this.popConf.emptyText = res.Message
            this.infoConf.emptyText = res.Message
            this.popConf.dataTotal = 0
            this.infoConf.dataTotal = 0
            this.popConf.loadStatus = false
            this.infoConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.popTableData = []
          this.infoTableData = []
          this.popConf.emptyText = '服务器连接失败...'
          this.infoConf.emptyText = '服务器连接失败...'
          this.popConf.dataTotal = 0
          this.infoConf.dataTotal = 0
          this.popConf.loadStatus = false
          this.infoConf.loadStatus = false
        })
    },

    // 查看详情
    showDetial (obj) {
      this.realityMoney = '0.00'
      this.receivableMoney = '0.00'
      this.orderRemark = ''
      this.showDetailPop = true
      this.detailTableLoad({ id: obj.id })
    },

    // 打印
    printOrder (obj) {
      let data = {
        id: obj.id,
        type: 2
      }
      // 获取打印数据
      this.$axios
        .post(this.urlObj.issueReceipt, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.id = obj.id
            // 开始打印
            myPrint.startLodop(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取打印数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 下载发票
    invoiceDownload (obj) {
      // 获取发票链接
      this.$axios
        .post(this.urlObj.getinvoiceinfo, { id: obj.id })
        .then(res => {
          if (res.Code === 200) {
            this.downloadUrl = res.Data.pdf_url
            this.$nextTick(() => {
              let adom = this.$refs.adom
              adom.click()
            })
          } else {
            let msg = res.Message ? res.Message : '获取发票链接失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 补开发票
    invoiceAgain (obj) {
      this.$confirm('确定要补开当前订单的发票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .post(this.urlObj.repairinvoice, { id: obj.id })
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '补开发票成功！',
                  type: 'success'
                })
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '补开发票失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 补开收据
    receiptAgain (obj) {
      this.currentRecipt = obj
      this.showFillDialog = true
      this.filldisabled = true
      // 获取收据使用类型
      this.$axios
        .post(this.urlObj.getreceipttype, { vid: obj.vid })
        .then(res => {
          if (res.Code === 200) {
            this.useReceiptType = res.Data.use_receipt_type
            if (this.useReceiptType == 2) {
              this.receiptType = 2
            } else {
              this.receiptType = 1
            }
          } else {
            let msg = res.Message ? res.Message : '获取收据使用类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.filldisabled = false
        })
        .catch(() => {
          this.filldisabled = false
        })
    },

    // 补开收据提交请求
    fillSubmit () {
      this.isCommit = true
      let data = {
        id: this.currentRecipt.id,
        receipt_type: this.receiptType,
        vid: this.currentRecipt.vid
      }
      this.$axios
        .post(this.urlObj.repairReceipt, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '补开收据成功！',
              type: 'success'
            })
            this.showFillDialog = false
            // 重新获取一次表格数据
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '补开收据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.isCommit = false
        })
        .catch(() => { this.isCommit = false })
    },

    // 换票处理
    changeTicket (obj) {
      this.currentTicket = obj
      // 表单验证重置
      if (this.$refs.changeForm) {
        this.$refs.changeForm.resetFields()
      }
      this.showTicketChange = true
      // 获取发票类型
      this.$axios
        .post(this.urlObj.getfptype)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            Object.keys(res.Data).forEach(item => {
              let obj = {
                label: res.Data[item],
                value: item
              }
              arr.push(obj)
            })
            this.typeList = arr
          } else {
            let msg = res.Message ? res.Message : '获取发票类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 换票提交
    formSubmit () {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.currentTicket.id,
            fpdm: this.changeForm.code,
            fphm: this.changeForm.number,
            fp_type: this.changeForm.type
          }
          this.$axios
            .post(this.urlObj.changetickets, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '换票成功！',
                  type: 'success'
                })
                this.showTicketChange = false
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '换票失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
              this.isCommit = false
            })
            .catch(() => {
              this.isCommit = false
            })
        }
      })
    },

    // 展示收据二维码
    showQrcode (obj) {
      this.qrSrc = ''
      this.showQrcodeDialog = true
      // 获取小程序二维码
      this.$axios.post(this.urlObj.getwxqrcode, { id: obj.id }).then(res => {
        if (res.Code === 200) {
          this.qrSrc = res.Data
        } else {
          let msg = res.Message ? res.Message : '获取小程序二维码失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => { })
    },

    // 保存二维码图片
    saveImage () {
      let qrImage = document.querySelector('#qrcode img')
      let url = qrImage.src
      let a = document.createElement('a') // 生成一个a元素
      let event = new MouseEvent('click') // 创建一个单击事件
      a.download = '电子收据二维码' // 设置图片名称
      a.href = url // 将生成的URL设置为a.href属性
      a.dispatchEvent(event) // 触发a的单击事件
    },

    // 点击植入发票处理
    implantation (obj) {
      this.currentImplant = obj
      // 表单验证重置
      if (this.$refs.implantForm) {
        this.$refs.implantForm.resetFields()
      }
      this.showImplantDialog = true
    },

    // 植入发票确认处理
    implantSubmit () {
      this.$refs.implantForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.currentImplant.id,
            fpdm: this.implantForm.code,
            fphm: this.implantForm.number,
          }
          this.$axios
            .post(this.urlObj.importsninvoice, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '植入发票成功！',
                  type: 'success'
                })
                this.showImplantDialog = false
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '植入发票失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
              this.isCommit = false
            })
            .catch(() => {
              this.isCommit = false
            })
        }
      })
    },

    // 提取合计字段
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        let feilds = this.searchTableData.total ? this.searchTableData.total.map(item => item.prop) : []
        if (feilds.includes(column.property)) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return _.round(_.add(Number(prev), Number(curr)), 2).toFixed(2)
              } else {
                return prev;
              }
            }, 0);
            sums[index];
          } else {
            sums[index] = '';
          }
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    /** **************** */

    // 点击交款申请按钮处理
    viewRecord () {
      this.dateFilter = ['', '']
      this.showSearchTable = false
      this.showRecordDialog = true
      this.recordTableLoad()
      this.getStartTime()
    },

    // 开始时间禁用处理
    pickerOptions1 () {
      let date = new Date()
      let minutes = date.getMinutes()
      // h和m 是将日期只取时分
      let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m = (minutes < 10 ? '0' + minutes : minutes) + ':'
      let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

      let yy, mm, dd, date2, h2, m2, s2
      if (this.dateFilter[1]) {
        date2 = new Date(this.dateFilter[1])
        yy = date2.getFullYear()
        mm =
          date2.getMonth() < 10
            ? '0' + date2.getMonth()
            : date2.getMonth()
        dd = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
        h2 =
          (date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()) +
          ':'
        m2 =
          (date2.getMinutes() < 10
            ? '0' + date2.getMinutes()
            : date2.getMinutes()) + ':'
        s2 =
          date2.getSeconds() < 10
            ? '0' + date2.getSeconds()
            : date2.getSeconds()
      }

      let pickerDate =
        date.toDateString() === new Date(this.dateFilter[0]).toDateString()
      let pickerDate2 = this.dateFilter[1]
        ? date2.toDateString() === new Date(this.dateFilter[0]).toDateString()
        : false
      return {
        // 日期限制
        disabledDate: time => {
          if (this.dateFilter[1]) {
            return time.getTime() > new Date(yy, mm, dd, 0, 0, 0).getTime()
          } else {
            return time.getTime() > new Date().getTime()
          }
        },
        // 时间限制
        selectableRange: (() => {
          if (pickerDate2) {
            return '00:00:00 - ' + h2 + m2 + s2
          } else if (pickerDate) {
            return '00:00:00 -' + h + m + s
          } else {
            return '00:00:00 - 23:59:59'
          }
        })()
      }
    },

    // 结束时间禁用处理
    pickerOptions2 () {
      let date = new Date()
      let minutes = date.getMinutes()
      // h和m 是将日期只取时分
      let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m = (minutes < 10 ? '0' + minutes : minutes) + ':'
      let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

      let yy, mm, dd, date2, h2, m2, s2
      if (this.dateFilter[0]) {
        date2 = new Date(this.dateFilter[0])
        yy = date2.getFullYear()
        mm =
          date2.getMonth() < 10
            ? '0' + date2.getMonth()
            : date2.getMonth()
        dd = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
        h2 =
          (date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()) +
          ':'
        m2 =
          (date2.getMinutes() < 10
            ? '0' + date2.getMinutes()
            : date2.getMinutes()) + ':'
        s2 =
          date2.getSeconds() < 10
            ? '0' + date2.getSeconds()
            : date2.getSeconds()
      }

      let pickerDate =
        date.toDateString() === new Date(this.dateFilter[1]).toDateString()
      let pickerDate2 = this.dateFilter[0]
        ? date2.toDateString() === new Date(this.dateFilter[1]).toDateString()
        : false
      return {
        // 日期限制
        disabledDate: time => {
          if (time.getTime() > new Date().getTime()) {
            return true
          } else {
            if (this.dateFilter[0] && time.getTime() < new Date(yy, mm, dd, 0, 0, 0).getTime()) {
              return true
            } else {
              return false
            }
          }
        },
        // 时间限制
        selectableRange: (() => {
          if (pickerDate && pickerDate2) {
            return h2 + m2 + s2 + '-' + h + m + s
          } else if (pickerDate) {
            return '00:00:00 -' + h + m + s
          } else if (pickerDate2) {
            return h2 + m2 + s2 + ' - 23:59:59'
          } else {
            return '00:00:00 - 23:59:59'
          }
        })()
      }
    },

    // 开始时间改变处理
    sdateChange () {
      if (this.dateFilter[0] && this.dateFilter[1]) {
        if (this.dateFilter[0] > this.dateFilter[1]) {
          this.dateFilter[0] = this.dateFilter[1]
        }
      }
    },

    // 结束时间改变处理
    edateChange () {
      if (this.dateFilter[0] && this.dateFilter[1]) {
        if (this.dateFilter[1] < this.dateFilter[1]) {
          this.dateFilter[1] = this.dateFilter[0]
        }
      }
    },

    // 获取开始时间
    getStartTime () {
      this.loadStime = true
      this.dateFilter = ['', '']
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.lastTime, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data) {
              this.lastTime = new Date(res.Data).getTime()
              this.dateFilter[0] = this.lastTime
              this.dateRead = true
            } else {
              this.dateRead = false
            }
          } else {
            let msg = res.Message ? res.Message : '获取上次提交时间失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.loadStime = false
        })
        .catch(() => {
          this.loadStime = false
        })
    },

    // 搜索表格
    searchTable () {
      if (this.dateFilter && this.dateFilter[0] && this.dateFilter[1]) {
        this.searchDate = [this.dateFilter[0] / 1000, this.dateFilter[1] / 1000]
        this.showSearchTable = true
        this.searchTableLoad()
      } else if (!this.dateFilter[0] && !this.dateFilter[1]) {
        this.$message({
          type: 'warning',
          message: '请选择时间范围！'
        })
      } else if (!this.dateFilter[0]) {
        this.$message({
          type: 'warning',
          message: '请选择开始时间！'
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择结束时间！'
        })
      }
    },

    // 点击提交按钮处理
    auditHandle () {
      this.isAgain = false
      if (this.$refs.auditForm) {
        this.$refs.auditForm.resetFields()
      }
      this.showAuditDialog = true
    },

    // 审批人搜索处理
    remoteMethod (query, obj) {
      if (query !== '') {
        this.loading = true;
        // 获取审批人数据
        this.$axios
          .post(this.urlObj.getAuditors, { name: query })
          .then(res => {
            if (res.Code === 200) {
              obj.options = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '获取审批人数据失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          })
      } else {
        obj.options = [];
      }
    },

    // 点击添加审批人处理
    addAuditor () {
      this.auditForm.auditors.push({ auditor: '' })
    },

    // 删除审批人
    delAuditor (index) {
      this.auditForm.auditors.splice(index, 1)
    },

    // 审批人确认选择
    auditorSubmit () {
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.choseVillageInfo.vid,
            user: this.auditForm.auditors.map(item => item.auditor)
          }
          let url = ''
          if (this.isAgain) {
            // 重新交账
            data.id = this.againObj.id
            url = this.urlObj.accountAudit
          } else {
            // 提交
            data.time = this.searchDate
            url = this.urlObj.accountAudit
          }
          this.$axios
            .post(url, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: this.isAgain ? '重新交账成功！' : '提交成功！',
                  type: 'success'
                })
                this.showSearchTable = false
                // 重新获取表格数据
                this.recordTableLoad()
                this.getStartTime()
                this.showAuditDialog = false
              } else {
                let msg = res.Message ? res.Message : this.isAgain ? '重新交账失败！' : '提交失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
              this.isCommit = false
            })
            .catch(() => {
              this.isCommit = false
            })
        }
      })
    },

    // 点击交账记录按钮处理
    goBack () {
      this.recordTableData = []
      this.recordConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.showSearchTable = false
      this.recordTableLoad()
    },

    // 获取交账记录表格数据
    recordTableLoad () {
      // 表格处于加载状态
      this.recordConf.loadStatus = true
      let data = {
        page: this.recordConf.curPage,
        limit: this.recordConf.limit,
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.accountList, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cname = item.user.realname
                item.xqhide = false
                item.chhide =
                  item.status == 0 || item.status == 4 ? false : true
                item.dyhide = item.status != 3 ? false : true
                item.cxhide = item.status == 3 ? false : true
                item.schide = item.is_del && item.status == 3 ? false : true
              })
            }
            // 设置查询总数
            this.recordConf.dataTotal = res.Data.total
            // 存放查询数据
            this.recordTableData = res.Data.data
            // 关闭加载状态
            this.recordConf.loadStatus = false
            // 清空空数据提示
            this.recordConf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.recordTableData = []
            this.recordConf.emptyText = res.Message
            this.recordConf.dataTotal = 0
            this.recordConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.recordTableData = []
          this.recordConf.emptyText = '服务器连接失败...'
          this.recordConf.dataTotal = 0
          this.recordConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    recordSizeChange (num) {
      this.recordConf.limit = num
      // 获取一次表格数据
      this.recordTableLoad()
    },

    // 当前页码改变处理
    recordCurrentChange (num) {
      this.recordConf.curPage = num
      // 获取一次表格数据
      this.recordTableLoad()
    },

    // 点击打印处理
    printHandle (obj) {
      this.radioVal = 1
      this.printData = obj
      this.showPrintDialog = true
    },

    // 交账记录打印
    recordPrint () {
      this.showPrintDialog = false
      // 获取打印数据
      this.$axios
        .post(this.urlObj.recordInfoList, { id: this.printData.id })
        .then(res => {
          if (res.Code === 200) {
            let tableHtml = ''
            if (res.Data.title && res.Data.title.length > 0) {
              // 竖版
              if (this.radioVal == 1) {
                let props = res.Data.total.map(item => item.prop)
                res.Data.title.forEach(item => {
                  if (item.prop != 'km') {
                    let trs = ''
                    let total = 0
                    res.Data.data.forEach(itm => {
                      if (props.includes(item.prop)) {
                        total = _.round(_.add(Number(total), Number(itm[item.prop])), 2).toFixed(2)
                      }
                      trs = trs + `<tr><td style="width:50%;text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">${itm['km']}</td>
                        <td style="width:50%;text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">${itm[item.prop]}</td></tr>
                      `
                    })
                    if (props.includes(item.prop)) {
                      trs = trs + `<tr><td style="width:50%;text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">合计</td>
                        <td style="width:50%;text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">${total}</td></tr>
                      `
                    }
                    tableHtml = tableHtml + '<table style="width: 700px;margin-bottom: 20px;border: 1px solid #aaa; border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0">' +
                      '<thead>' +
                      '<tr style="text-align: center;height: 40px;line-height: 40px;font-weight: 600">' +
                      '<th style="width: 50%;text-align: center;border: 1px solid #aaa;font-size: 15px;line-height:60px;height: 60px;">科目</th>' +
                      `<th style="width: 50%;text-align: center;border: 1px solid #aaa;font-size: 15px;line-height:60px;height: 60px;">${item.label}</th>` +
                      '</tr>' +
                      '</thead>' +
                      '<tbody style="text-align: center">' +
                      trs +
                      '</tbody>' +
                      '</table>'
                  }
                })

              } else {
                // 横板
                let ths = ''
                res.Data.title.forEach(item => {
                  ths =
                    ths +
                    `<th style="text-align: center;border: 1px solid #aaa;font-size: 15px;line-height:60px;height: 60px;">${item.label}</th>`
                })
                let trs = ''
                res.Data.data.forEach(item => {
                  let tds = ''
                  res.Data.title.forEach((itm) => {
                    tds = tds +
                      `<td style="text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">${item[itm.prop]}</td>`
                  })
                  trs = trs + `<tr>${tds}</tr>`
                })

                let props = res.Data.total.map(item => item.prop)
                let totaltds = '<td style="text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">合计</td>'
                res.Data.title.forEach((item) => {
                  let total = 0
                  // 判断添加合计的列
                  if (props.includes(item.prop) && item.prop != 'km') {
                    res.Data.data.forEach(itm => {
                      total = _.round(_.add(Number(total), Number(itm[item.prop])), 2).toFixed(2)
                    })
                    totaltds = totaltds + `<td style="text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;">${total}</td>`
                  } else if (item.prop != 'km') {
                    totaltds = totaltds + `<td style="text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;"></td>`
                  }
                })

                trs = trs + `<tr>${totaltds}</tr>`

                let LODOP = getLodop()

                // 表格内容
                tableHtml = '<table style="width: 700px;margin-bottom: 20px;border: 1px solid #aaa; border-collapse:collapse;" border="0" cellpadding="0" cellspacing="0" class="table table-striped table-bordered table-hover "  >' +
                  '<thead>' +
                  '<tr class="table-title-1" style="text-align: center;height: 40px;line-height: 40px;font-weight: 600">' +
                  ths +
                  '</tr>' +
                  '</thead>' +
                  '<tbody style="text-align: center">' +
                  trs +
                  '</tbody>' +
                  '</table>'
              }
            } else {
              tableHtml = '<div style="height: 50px;line-height: 40px;border: 1px solid #aaa;text-align:center;">暂无数据！</div>'
            }

            // 打印内容
            let strFormHtml =
              '<div style="width: 700px;text-align: center;height: 30px;line-height: 30px;font-size: 18px;"><strong>' +
              this.choseVillageInfo.name +
              '&nbsp;&nbsp;交账日报</strong></div>' +
              '<div style="width: 700px;text-align: right;height: 40px;line-height: 40px;font-size: 13px;"><span>起止时间:' +
              this.printData.stime +
              '至' +
              this.printData.etime +
              '</span></div>' +
              tableHtml +
              '<div style="width: 700px;text-align: left;height: 30px;line-height: 30px;font-size: 14px;margin-top: 20px;">' +
              '<strong>收据范围:&nbsp;&nbsp;&nbsp;</strong><span>' +
              res.Data.info.receipt +
              '</span>' +
              '</div>' +
              '<div style="width: 700px;text-align: left;height: 30px;line-height: 30px;font-size: 14px;">' +
              '<strong>作废收据:&nbsp;&nbsp;&nbsp;</strong><span>' +
              res.Data.info.voidReceipt +
              '</span>' +
              '</div>' +
              '<div style="width: 700px;text-align: left;height: 30px;line-height: 30px;font-size: 14px;">' +
              '<strong>交款人:&nbsp;&nbsp;&nbsp;</strong><span>' +
              res.Data.info.realname +
              '</span>' +
              '<strong style="margin-left: 18%">收款人:</strong>' +
              '<strong style="margin-left: 18%">收款日期:</strong>' +
              '</div>'
            LODOP.ADD_PRINT_TEXT()
            // LODOP.SET_PRINT_PAGESIZE(3, '', '', 'A4')
            LODOP.ADD_PRINT_HTM(30, 30, 5, '100%', strFormHtml)
            LODOP.PREVIEW()
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取查询表格数据
    searchTableLoad () {
      // 表格处于加载状态
      this.searchConf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        start_time: this.dateFilter[0] / 1000,
        end_time: this.dateFilter[1] / 1000
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.accountDetail, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.searchTableData = res.Data
            // 关闭加载状态
            this.searchConf.loadStatus = false
            // 清空空数据提示
            this.searchConf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.searchTableData = []
            this.searchConf.emptyText = res.Message
            this.searchConf.dataTotal = 0
            this.searchConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.searchTableData = []
          this.searchConf.emptyText = '服务器连接失败...'
          this.searchConf.dataTotal = 0
          this.searchConf.loadStatus = false
        })
    },

    // 查看交账记录详情
    recordInfo (obj) {
      this.showInfoDialog = true
      // 表格处于加载状态
      this.rcdInfoConf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        id: obj.id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.orderDetail, data)
        .then(res => {
          if (res.Code == 200) {
            const dataList = res.Data || []
            // 过滤掉没有 snOrder 的数据
            const validData = dataList.filter(item => item && item.snOrder)
            let total = 0
            validData.forEach(item => {
              const snOrder = item.snOrder
              item.cname = snOrder.realname || ''
              item.code =
                snOrder.fphm && snOrder.receipt
                  ? snOrder.fphm + '/' + snOrder.receipt
                  : snOrder.fphm
                    ? snOrder.fphm
                    : snOrder.receipt
                      ? snOrder.receipt
                      : ''
              item.roomnum = snOrder.roomnum || ''
              item.ssmoney = snOrder.money || '0'
              item.type_text = snOrder.payment ? snOrder.payment.name : ''
              item.vname = item.village.villagename || ''
              item.description = snOrder.remark || ''
              item.pay_time = snOrder.pay_time || ''
              total = _.add(Number(total), Number(item.ssmoney))
            })
            this.totalMoney = _.round(total, 2)
            // 存放查询数据
            this.rcdInfoData = validData
            // 关闭加载状态
            this.rcdInfoConf.loadStatus = false
            // 清空空数据提示
            this.rcdInfoConf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.rcdInfoData = []
            this.rcdInfoConf.emptyText = res.Message
            this.rcdInfoConf.dataTotal = 0
            this.rcdInfoConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.rcdInfoData = []
          this.rcdInfoConf.emptyText = '服务器连接失败...'
          this.rcdInfoConf.dataTotal = 0
          this.rcdInfoConf.loadStatus = false
        })
    },

    // 撤回交账记录
    recordDevocation (obj) {
      this.$confirm('确定要撤回当前交账记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: obj.id,
            vid: this.choseVillageInfo.vid,
            type: obj.label
          }
          this.$axios
            .post(this.urlObj.revAccount, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '交账记录撤回成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.recordTableLoad()
                this.getStartTime()
              } else {
                let msg = res.Message ? res.Message : '交账记录撤回失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 重新交账
    accountAgain (obj) {
      this.isAgain = true
      this.againObj = obj
      if (this.$refs.auditForm) {
        this.$refs.auditForm.resetFields()
      }
      this.showAuditDialog = true

      // this.$confirm('确定要重新交账当前订单吗?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     let data = {
      //       id: obj.id,
      //       vid: this.choseVillageInfo.vid
      //     }
      //     this.$axios
      //       .post(this.urlObj.accountAudit, data)
      //       .then(res => {
      //         if (res.Code === 200) {
      //           this.$message({
      //             message: '重新交账成功！',
      //             type: 'success'
      //           })
      //           // 重新获取表格数据
      //           this.recordTableLoad()
      //           this.getStartTime()
      //         } else {
      //           let msg = res.Message ? res.Message : '重新交账失败！'
      //           this.$message({
      //             message: msg,
      //             type: 'error'
      //           })
      //         }
      //       })
      //       .catch(() => { })
      //   })
      //   .catch(() => { })
    },

    // 删除交账
    accountDel (obj) {
      this.$confirm('确定要删除当前订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: obj.id
          }
          this.$axios
            .post(this.urlObj.accountdel, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.recordTableLoad()
                this.getStartTime()
              } else {
                let msg = res.Message ? res.Message : '删除失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    /* 导出EXCEL */
    exportDetailExcel () {
      try {
        let tableName = '交账记录明细表'
        let headers = [
          '发票/收据号',
          '房间号',
          '姓名',
          '实收金额',
          '缴费渠道',
          '小区名称',
          '缴费内容',
          '缴费日期'
        ]

        // 整理需要导出的数据
        let datas = []
        this.rcdInfoData.forEach(item => {
          let arr = [
            item.code,
            item.roomnum,
            item.cname,
            item.ssmoney,
            item.type_text,
            item.vname,
            item.description,
            item.pay_time
          ]
          datas.push(arr)
        })
        require.ensure([], () => {
          // 引入excel.js
          let {
            export_json_to_excel
          } = require('@/assets/common/excel/Export2Excel')

          // 执行导出操作
          export_json_to_excel(headers, datas, tableName)
        })

        this.$notify({
          type: 'success',
          title: '温馨提示',
          message: '导出报表成功',
          duration: 1500
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    },
  }
}
