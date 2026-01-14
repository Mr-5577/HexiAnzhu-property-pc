import carRecord from '../json/car-record.json'
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'carRecord',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        carparkdata: this.$api.state.Car.carparkdata.url,
        tempcarrecord: this.$api.state.Car.tempcarrecord.url,
        parklastcost: this.$api.state.Car.parklastcost.url,
        searchmoney: this.$api.state.Car.searchmoney.url,
        createtempcarsn: this.$api.state.Car.createtempcarsn.url,
        getreceipttype: this.$api.state.Charge.getreceipttype.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 车场类型
      parkVal: '',
      parkOptions: [],
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: carRecord.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示弹框
      showDialog: false,
      // 弹框表单数据对象
      ruleForm: {
        parkValue: '',
        startDate: '',
        endDate: '',
        allMoney: '',
        yhmoney: '',
        ssmoney: '',
        isreceipt: '',
        receiptType: 1,
        isPaper: '',
      },
      // 表单验证对象
      rules: {
        parkValue: [
          { required: true, message: '请选择停车场', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择入场时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止时间', trigger: 'change' }
        ],
        allMoney: [
          { required: true, message: '请输入临停总金额', trigger: 'blur' }
        ],
        yhmoney: [
          { required: true, message: '请输入临停优惠金额', trigger: 'blur' }
        ],
        ssmoney: [
          { required: true, message: '请输入实收金额', trigger: 'blur' }
        ],
        isreceipt: [
          { required: true, message: '请选择是否生成发票', trigger: 'change' }
        ],
        receiptType: [
          { required: true, message: '请选择收据类型', trigger: 'change' }
        ],
        isPaper: [
          {
            required: true,
            message: '请选择是否生成纸质收据',
            trigger: 'change'
          }
        ],
      },
      // 是否生成收据列表
      receiptOptions: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      // 是否展示临停总金额/优惠金额
      showMoney: false,
      // 是否正在提交数据
      isCommit: false,
      // 是否有上一次的数据
      hasLast: false,
      // 是否可以修改金额信息
      moneyEdit: '',
      // 日期限制条件
      pickerOptions: {
        disabledDate: time => {
          if (time) {
            return time.getTime() > new Date()
          }
        }
      },
      // 当前项目支持的收据类型
      receiptType: '',
      // 是否正在导出数据
      isExport: false,
    }
  },

  // 计算属性
  computed: {
    // 开始时间限制
    spickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.endTime ? time.getTime() > this.endTime : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.startTime ? time.getTime() < this.startTime : false
          }
        }
      }
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    // let vid = sessionStorage.getItem('vid')
    // let vname = sessionStorage.getItem('vname')
    // if (vid) {
    //   this.choseVillageInfo.vid = vid
    //   this.choseVillageInfo.name = vname
    // }
    this.getParkList()
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.parkVal = ''
      this.parkOptions = []
      this.startTime = ''
      this.endTime = ''
      // 获取车场类型
      this.getParkList()
      // 请求接口获取表单数据
      this.tableLoad()
    },

    // 获取停车场类型数据
    getParkList () {
      this.$axios
        .post(this.urlObj.carparkdata, { vid: this.choseVillageInfo.vid })
        .then(res => {
          if (res.Code === 200) {
            this.parkOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取停车场类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取停车场上一次临停订单信息
    getLastOrder (data) {
      this.$axios
        .post(this.urlObj.parklastcost, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.is_last == 1) {
              this.hasLast = true
              let date = new Date(res.Data.last_time * 1000)
              let y = date.getFullYear()
              let m =
                date.getMonth() + 1 < 10
                  ? '0' + (date.getMonth() + 1)
                  : date.getMonth() + 1
              let d =
                date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
              let hh =
                date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
              let mm =
                date.getMinutes() < 10
                  ? '0' + date.getMinutes()
                  : date.getMinutes()
              let ss =
                date.getSeconds() < 10
                  ? '0' + date.getSeconds()
                  : date.getSeconds()
              this.ruleForm.startDate = `${y}-${m}-${d} ${hh}:${mm}:${ss}`
              this.pickerOptions = {
                disabledDate: time => {
                  if (time) {
                    return (
                      time.getTime() > new Date() ||
                      time.getTime() <
                      new Date(this.ruleForm.startDate).getTime()
                    )
                  }
                }
              }
            } else {
              this.hasLast = false
            }
          } else {
            let msg = res.Message ? res.Message : '获取上一次停车场数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 查询时间段的临停费用
    getFreeInfo () {
      let data = {
        park_id: this.ruleForm.parkValue,
        starttime: this.ruleForm.startDate,
        endtime: this.ruleForm.endDate
      }
      this.$axios
        .post(this.urlObj.searchmoney, data)
        .then(res => {
          if (res.Code === 200) {
            this.ruleForm.allMoney = res.Data.all_money
            this.ruleForm.yhmoney = res.Data.discount_money
            this.ruleForm.ssmoney = res.Data.all_pay_money
            this.moneyEdit = res.Data.editmoney_auth == 1 ? true : false
            this.showMoney = true
          } else {
            let msg = res.Message ? res.Message : '查询临停费用失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        park_id: this.parkVal,
        starttime: this.startTime ? this.startTime / 1000 : '',
        endtime: this.endTime ? this.endTime / 1000 : '',
      }
      if (this.parkVal) {
        data.park_id = this.parkVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.tempcarrecord, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.tableData = res.Data.data
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

    // 点击查询处理
    keySearch () {
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 请求接口获取表单数据
      this.tableLoad()
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

    // 弹框显示初始化
    dialogInit () {
      this.ruleForm = {
        parkValue: '',
        startDate: '',
        endDate: '',
        allMoney: '',
        yhmoney: '',
        ssmoney: '',
        isreceipt: ''
      }
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showMoney = false
      this.showDialog = true
    },

    // 获取当前项目支持的收据类型
    getReceiptType (vid) {
      this.$axios
        .post(this.urlObj.getreceipttype, { vid })
        .then(res => {
          if (res.Code === 200) {
            this.receiptType = res.Data ? res.Data.use_receipt_type : ''
          } else {
            let msg = res.Message ? res.Message : '获取收据类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 停车场选择更改处理
    parkChange (value) {
      this.ruleForm.startDate = ''
      this.ruleForm.endDate = ''
      this.ruleForm.allMoney = ''
      this.ruleForm.yhmoney = ''
      this.ruleForm.isreceipt = ''
      this.receiptType = ''
      this.showMoney = false
      if (value) {
        this.getLastOrder({ park_id: value })
        let vid = this.parkOptions.find(item => item.id == value).vid
        // 获取项目支持的收据类型
        this.getReceiptType(vid)
      }
    },

    // 开始日期选择更改
    startChange (value) {
      this.showMoney = false
      this.ruleForm.allMoney = ''
      this.ruleForm.yhmoney = ''
      this.ruleForm.isreceipt = ''
      if (value) {
        if (this.ruleForm.endDate && this.ruleForm.parkValue) {
          this.getFreeInfo()
        }
      }
    },

    // 结束日期选择更改
    endChange (value) {
      this.showMoney = false
      this.ruleForm.allMoney = ''
      this.ruleForm.yhmoney = ''
      this.ruleForm.isreceipt = ''
      if (value) {
        if (this.ruleForm.startDate && this.ruleForm.parkValue) {
          this.getFreeInfo()
        }
      }
    },

    // 实收金额改变处理
    moneyChange () {
      this.ruleForm.yhmoney = _.round(_.subtract(
        Number(this.ruleForm.allMoney),
        Number(this.ruleForm.ssmoney)
      ), 2)
    },

    // 数据提交处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addRequest()
        }
      })
    },

    // 生成临停请求
    addRequest () {
      this.isCommit = true
      let data = {
        park_id: this.ruleForm.parkValue,
        starttime: this.ruleForm.startDate,
        endtime: this.ruleForm.endDate,
        is_bill: this.ruleForm.isreceipt,
        all_money: this.ruleForm.allMoney,
        discount_money: this.ruleForm.yhmoney,
        real_money: this.ruleForm.ssmoney
      }
      if (this.receiptType == 3) {
        data.receipt_type = this.ruleForm.receiptType
        if (this.ruleForm.receiptType == 2) {
          data.is_open_receiptpaper = this.ruleForm.isPaper
        }
      } else if (this.receiptType == 2) {
        data.is_open_receiptpaper = this.ruleForm.isPaper
      }
      this.$axios
        .post(this.urlObj.createtempcarsn, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '生成临停费用成功！',
              type: 'success'
            })
            // 关闭弹框重新获取表格数据
            this.showDialog = false
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '生成临停费用失败！'
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
    },

    /* 导出EXCEL */
    getExportData () {
      // 获取数据
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        park_id: this.parkVal,
        starttime: this.startTime ? this.startTime / 1000 : '',
        endtime: this.endTime ? this.endTime / 1000 : '',
        is_excel: 1,
      }
      if (this.parkVal) {
        data.park_id = this.parkVal
      }
      if (data.vid) {
        this.isExport = true
        // 获取项目列表数据
        this.$axios
          .post(this.urlObj.tempcarrecord, data)
          .then(res => {
            if (res.Code === 200) {
              this.exportExcel(res.Data.data)
            } else {
              let msg = res.Message ? res.Message : '临停车辆数据失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isExport = false
          })
          .catch(() => {
            this.isExport = false
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一个项目再导出！'
        })
      }
    },

    /** 处理数据并导出 */
    exportExcel (result) {
      let tableName = '临停车辆明细表'
      let headers = [
        '停车场名称',
        '车牌号码',
        '应收',
        '实收',
        '付款方式',
        '入场时间',
        '缴费时间',
        '操作人员'
      ]
      let datas = result.map(item => {
        let arr = [
          item.park_name,
          item.plate_no,
          Number(item.need_pay) ? Number(item.need_pay) : 0,
          Number(item.pay_money) ? Number(item.pay_money) : 0,
          item.pay_type,
          item.in_time,
          item.pay_time,
          item.collector
        ]
        return arr
      })
      try {
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
