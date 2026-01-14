import chargeColumns from '../json/charge-columns.json'
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'chargeManage',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        searchpaycost: this.$api.state.Charge.searchpaycost.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        villageend: this.$api.state.Charge.villageend.url,
        checksubjecttype: this.$api.state.Charge.checksubjecttype.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 欠费科目下拉框绑定值
      subjectVal: '',
      // 欠费科目数据列表
      subOptions: [],
      // 当前科目是否可以搜索楼栋、单元
      isRoom: false,
      // 楼栋下拉框绑定值
      buildVal: '',
      // 楼栋数据列表
      buildOptions: [],
      // 单元下拉框绑定值
      unitVal: '',
      // 单元数据列表
      unitOptions: [],
      // 缴费方式下拉框绑定值
      paymentVal: '',
      // 缴费方式数据列表
      paymentOptions: [],
      // 日期选择框绑定值
      dateValue: [],
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: chargeColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
    }
  },

  mounted () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.tableLoad()
    this.getSubjectList()
    this.getBuildList()
    this.getPaymentType()
  },

  methods: {
    // 获取科目列表数据
    getSubjectList () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.villageend, data)
        .then(res => {
          if (res.Code === 200) {
            this.subOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取科目数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取楼栋数据
    getBuildList () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼栋数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元数据
    getUnitList () {
      let data = {
        bid: this.buildVal
      }
      this.$axios
        .post(this.urlObj.unitOfBuild, data)
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取单元数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取支付方式
    getPaymentType () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.paymentOptions = res.Data ? res.Data : []
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

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        subject_id: this.subjectVal,
        stime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        etime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        keywords: this.searchVal,
        payment_id: this.paymentVal,
        is_excel: 0
      }
      if (this.isRoom == 'rooms') {
        data.bid = this.buildVal
        data.unit = this.unitVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.searchpaycost, data)
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
      this.tableLoad(true)
    },

    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.isRoom = ''
      this.searchVal = ''
      this.subjectVal = ''
      this.subOptions = []
      this.buildVal = ''
      this.buildOptions = []
      this.unitVal = ''
      this.unitOptions = []
      this.paymentVal = ''
      this.paymentOptions = []
      this.dateValue = []
      // 请求接口获取表单数据
      this.keySearch()
      this.getSubjectList()
      this.getBuildList()
      this.getPaymentType()
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

    // 科目选择更改处理
    subjectChange (value) {
      if (value) {
        this.$axios
          .post(this.urlObj.checksubjecttype, { id: value })
          .then(res => {
            if (res.Code === 200) {
              this.isRoom = res.Data
              // 获取表格数据
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '验证资源类型失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          .catch(() => { })
      } else {
        this.isRoom = false
        this.tableLoad()
      }
    },

    // 楼栋选择更改处理
    buildChange (value) {
      this.unitVal = ''
      this.unitOptions = []
      if (value) {
        // 获取单元数据
        this.getUnitList()
      }
      this.tableLoad()
    },

    /* 导出EXCEL */
    getExportData () {
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        subject_id: this.subjectVal,
        stime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        etime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        keywords: this.searchVal,
        payment_id: this.paymentVal,
        is_excel: 1
      }
      if (this.isRoom == 'rooms') {
        data.bid = this.buildVal
        data.unit = this.unitVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.searchpaycost, data)
        .then(res => {
          if (res.Code === 200) {
            this.exportExcel(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取收费数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    /** 处理数据并导出 */
    exportExcel (result) {
      let tableName = '收费数据表'
      let headers = [
        '订单号',
        '资源名称',
        '科目名称',
        '客户姓名',
        '联系电话',
        '交费周期',
        '金额',
        '交费方式',
        '交费时间'
      ]
      let datas = result.map(item => {
        let arr = [
          item.sn,
          item.resources_name,
          item.subject_name,
          item.owner_name,
          item.owner_tel,
          item.cycle,
          item.money,
          item.payment_name,
          item.pay_time
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
    }
  }
}
