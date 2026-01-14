import arrearageCloumns from '../json/arrearage-cloumns.json'
import arrearagesTotal from '../json/arrearages-total.json'
import sendRecord from '../json/send-record.json'
import descRecord from '../json/desc-record.json'

import workIcon from '@/components/common/workIcon.vue'
import { getLodop } from '@/assets/common/js/LodopFuncs.js'

export default {
  name: 'arrearage',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        villageend: this.$api.state.Charge.villageend.url,
        scountlist: this.$api.state.Charge.scountlist.url,
        getarrearsreson: this.$api.state.Charge.getarrearsreson.url,
        setarrearsreson: this.$api.state.Charge.setarrearsreson.url,
        sendmsgarrears: this.$api.state.Charge.sendmsgarrears.url,
        checksubjecttype: this.$api.state.Charge.checksubjecttype.url,
        getsendmsglist: this.$api.state.Charge.getsendmsglist.url,
        sendmsgagain: this.$api.state.Charge.sendmsgagain.url,
        costaddreason: this.$api.state.Charge.costaddreason.url,
        costeditreason: this.$api.state.Charge.costeditreason.url,
        costdelreason: this.$api.state.Charge.costdelreason.url,
        costreasonlist: this.$api.state.Charge.costreasonlist.url,
        getcostcycle: this.$api.state.Charge.getcostcycle.url,
        costsplitmoney: this.$api.state.Charge.costsplitmoney.url,
        splitcost: this.$api.state.Charge.splitcost.url,
        delcost: this.$api.state.Charge.delcost.url,
      },
      // 搜索框绑定值
      searchVal: '',
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 类型
      typeVal: 2,
      // 表格数据
      tableData: [],
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
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
      // 日期选择框绑定值
      dateValue: [],
      // 当前表格中选择的数据
      tableSelected: [],
      // 是否显示添加欠费原因弹框
      showReasonDialog: false,
      // 单选绑定值
      radioVal: '',
      // 是否正在提交数据
      isCommit: false,
      // 欠费原因列表
      reasonList: [],
      // 是否显示打印内容
      showPrint: false,
      // 欠费统计合计金额
      totalMoney: 0,
      // 是否显示短信记录弹框
      showRecordDialog: false,
      // 发送状态
      statusVal: '',
      // 发送日期范围
      sendDate: [],
      // 关键字
      keywords: '',
      // 记录表格数据
      recordTableData: [],
      // 记录表格列数据配置
      recordColumns: sendRecord.list,
      // 记录表格配置
      recordConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 短信记录表格选择数据列表
      recordSelects: [],
      // 是否显示新增/编辑说明弹框
      showDescDialog: false,
      // 是否是新增欠费说明
      isAdd: true,
      // 欠费说明绑定值
      descVal: '',
      // 当期修改/新增欠费说明项 index
      cindex: '',
      // 是否显示欠费说明记录弹框
      showDescRecordDialog: false,
      // 欠费说明记录表格数据
      descTableData: [],
      // 欠费说明记录表格列数据配置
      descColumns: descRecord.list,
      // 欠费说明记录表格配置
      descConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示欠费拆分弹框
      showSplitDialog: false,
      // 当前拆分数据的 index
      sindex: '',
      // 拆分时间限制配置
      pickerOptions: {},
      // 第一段拆分金额对应时间段
      oneTime: '',
      // 第二段拆分金额对应时间段
      twoTime: '',
      // 表单对象
      ruleForm: {
        stime: '',
        oneMoney: '',
        twoMoney: ''
      },
      rules: {
        stime: [{ required: true, message: '请选择拆分时间', trigger: 'change' }],
        oneMoney: [{ required: true, message: '请输入第一段拆分金额', trigger: 'blur' }],
        twoMoney: [{ required: true, message: '请输入第二段拆分金额', trigger: 'blur' }],
      },
    }
  },

  computed: {
    // 表格列数据配置
    columns () {
      return this.typeVal == 2 ? arrearageCloumns.list : arrearagesTotal.list
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
  },

  methods: {
    // 时间戳转 年月日
    dateFormat (time) {
      let date = new Date(time * 1000)
      let y = date.getFullYear()
      let m =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      let d =
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return y + '' + m + '' + d
    },

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
          this.dateValue && this.dateValue[1] ? this.dateValue[1] / 1000 : '',
        keywords: this.searchVal.trim(),
        type: this.typeVal,
        is_excel: 0
      }
      if (this.isRoom == 'rooms') {
        data.bid = this.buildVal
        data.unit = this.unitVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.scountlist, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.tableData = res.Data.data
            if (res.Data.data && res.Data.data.length > 0) {
              let total = 0
              res.Data.data.forEach(item => {
                total = _.add(Number(total), Number(item.money))
              })
              this.totalMoney = total.toFixed(2)
            }
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
      this.dateValue = []
      // 请求接口获取表单数据
      this.keySearch()
      this.getSubjectList()
      this.getBuildList()
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

    // 表格选择更改处理
    selectionChange (value) {
      this.tableSelected = value
    },

    // 发送短信处理
    sendNote () {
      let arr = this.tableSelected.map(item => item.cost_ids)
      let data = {
        vid: this.choseVillageInfo.vid,
        cost_group: arr
      }
      this.$confirm(
        `确定要给这${this.tableSelected.length}条欠费用户发送催收短信吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$axios
            .post(this.urlObj.sendmsgarrears, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '短信发送成功！',
                  type: 'success'
                })
                // 清空用户的选择
                let table = this.$refs.seleTable.$children[0]
                table.clearSelection()
              } else {
                let msg = res.Message ? res.Message : '短信发送失败！'
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

    // 添加欠费原因
    addReason () {
      this.radioVal = ''
      this.reasonList = []
      this.showReasonDialog = true
      this.getReasonList()
    },

    // 获取欠费原因
    getReasonList () {
      this.$axios
        .post(this.urlObj.getarrearsreson)
        .then(res => {
          if (res.Code === 200) {
            this.reasonList = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '欠费原因数据获取失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 提交数据处理
    confirm () {
      if (this.radioVal) {
        this.isCommit = true
        let data = {
          ids: this.tableSelected.map(item => item.id),
          arrears_reson_id: this.radioVal
        }
        this.$axios
          .post(this.urlObj.setarrearsreson, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                message: '欠费原因设置成功！',
                type: 'success'
              })
              // 关闭弹框并重新获取数据
              this.showReasonDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '欠费原因数据获取失败！'
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
      } else {
        this.$message({
          message: '请选择欠费原因！',
          type: 'warning'
        })
      }
    },

    /* 导出EXCEL */
    getExportData () {
      // 获取数据
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        subject_id: this.subjectVal,
        stime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        etime:
          this.dateValue && this.dateValue[1] ? this.dateValue[1] / 1000 : '',
        keywords: this.searchVal.trim(),
        type: this.typeVal,
        is_excel: 1
      }
      if (this.isRoom == 'rooms') {
        data.bid = this.buildVal
        data.unit = this.unitVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.scountlist, data)
        .then(res => {
          if (res.Code === 200) {
            this.exportExcel(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取欠费数据失败！'
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
      let tableName = ''
      let headers = []
      let datas = []
      if (this.typeVal == 1) {
        tableName = '欠费统计表'
        headers = [
          '资源名称',
          '面积',
          '科目名称',
          '客户姓名',
          '联系电话',
          '欠费周期',
          '欠费金额',
        ]
        datas = result.map(item => {
          let arr = [
            item.resources_name,
            Number(item.area) ? Number(item.area) : 0,
            item.subject_name,
            item.owner_name,
            item.owner_tel,
            item.cycle,
            Number(item.money) ? Number(item.money) : 0,
          ]
          return arr
        })
      } else {
        tableName = '欠费明细表'
        headers = [
          '资源名称',
          '科目名称',
          '客户姓名',
          '联系电话',
          '欠费周期',
          '欠费金额',
          '上次推送',
          '欠费原因'
        ]
        datas = result.map(item => {
          let arr = [
            item.resources_name,
            item.subject_name,
            item.owner_name,
            item.owner_tel,
            item.cycle,
            item.money,
            item.last_send_time,
            item.arrearsreson
          ]
          return arr
        })
      }
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

    // 打印单据
    arrearagePrint (index) {
      let obj = this.tableData[index]
      let date = new Date()
      let y = date.getFullYear()
      let m =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      let d = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()
      var LODOP = getLodop()
      var strBodyStyle =
        '<style>' +
        'table{width: 700px;border: 1px solid #aaa; border-collapse:collapse;};' +
        'th{text-align: center;border: 2px solid #aaa;border-bottom:none;font-size: 29px;line-height:40px;height: 40px;}' +
        'tbody td{text-align: center;height: 25px;border: 1px solid #aaa;font-size: 14px;}' +
        '.bordertop{border-top: none}' +
        'tr:last-child td{border-right: none;border-left: none;}' +
        'tr:last-child td:first-child{border-left: 1px solid #aaa;}' +
        'tr:last-child td:last-child{border-right: 1px solid #aaa;}</style>'

      var strFormHtml =
        strBodyStyle +
        '<body> ' +
        "<form><table cellspacing='0' ><tbody>" +
        "<tr><th colspan='4'>缴费通知单</th></tr>" +
        "<tr><td colspan='4' class='bordertop'>小区:" +
        this.choseVillageInfo.name +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '房号：' +
        obj.resources_name +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '业主姓名：' +
        obj.owner_name +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '制单日期：' +
        (y + '-' + m + '-' + d) +
        '</td></tr>' +
        '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
        '<tr><td>' +
        obj.subject_name +
        '</td><td>' +
        obj.cycle +
        '</td><td>' +
        obj.price +
        '</td><td>' +
        obj.money +
        '</td></tr>' +
        '<tr><td></td><td></td><td></td><td></td></tr>' +
        '<tr><td></td><td></td><td></td><td></td></tr>' +
        "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
        obj.money +
        '</td><td></td></tr><tr>' +
        "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
        "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='/static/qrcode/qrcode.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
        this.choseVillageInfo.name +
        '</br>物业服务中心</br></br>' +
        // service_hotline +
        '</td></tr>' +
        '</tbody></table></form></body>'
      LODOP.PRINT_INIT('打印控件功能演示')
      LODOP.ADD_PRINT_TEXT()
      LODOP.ADD_PRINT_HTM(30, 30, 500, 1000, strFormHtml)
      LODOP.PREVIEW()
    },

    // 批量打印单据
    batchPrint () {
      let date = new Date()
      let y = date.getFullYear()
      let m =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      let d = date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()
      var printHtml = ''
      var yu = this.tableSelected.length % 3
      var len = Math.floor(this.tableSelected.length / 3)
      for (var i = 0; i < len; i++) {
        let strTable = '<div id="pagepage' + i + '">' +
          '<style >' +
          'table {	width: 700px;border: 1px solid #aaa;; border-collapse:collapse;margin-bottom: 40px;}' +
          'table:last-child { margin-bottom: 0; }' +
          'th {text-align: center;border: 1px solid #aaa;border-bottom:none;font-size: 20px;height: 40px;}' +
          'tbody td{text-align: center;height: 25px;border: 1px solid #aaa;font-size: 14px;}' +
          '.bordertop{border-top: none}' +
          'tr:last-child td{border-right: none;border-left: none;}' +
          'tr:last-child td:first-child{border-left: 1px solid #aaa;}' +
          'tr:last-child td:last-child{border-right: 1px solid #aaa;} ' +
          '</style>' +
          "<table cellspacing='0' ><tbody>" +
          "<tr><th colspan='4'>缴费通知单</th></tr>" +
          "<tr><td colspan='4' class='bordertop'>小区:" +
          this.choseVillageInfo.name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '房号：' +
          this.tableSelected[i * 3].resources_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '业主姓名：' +
          this.tableSelected[i * 3].owner_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '制单日期：' +
          (y + '-' + m + '-' + d) +
          '</td></tr>' +
          '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
          '<tr><td>' +
          this.tableSelected[i * 3].subject_name +
          '</td><td>' +
          this.tableSelected[i * 3].cycle +
          '</td><td>' +
          this.tableSelected[i * 3].price +
          '</td><td>' +
          this.tableSelected[i * 3].money +
          '</td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
          this.tableSelected[i * 3].money +
          '</td><td></td></tr><tr>' +
          "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
          "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='http://est.yangguangzhiye.com/Uploads/qrcode/meishan.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
          this.choseVillageInfo.name +
          '</br>物业服务中心</br></br>' +
          '</td></tr>' +
          '</tbody></table>' +
          "<table cellspacing='0' ><tbody>" +
          "<tr><th colspan='4'>缴费通知单</th></tr>" +
          "<tr><td colspan='4' class='bordertop'>小区:" +
          this.choseVillageInfo.name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '房号：' +
          this.tableSelected[i * 3 + 1].resources_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '业主姓名：' +
          this.tableSelected[i * 3 + 1].owner_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '制单日期：' +
          (y + '-' + m + '-' + d) +
          '</td></tr>' +
          '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
          '<tr><td>' +
          this.tableSelected[i * 3 + 1].subject_name +
          '</td><td>' +
          this.tableSelected[i * 3 + 1].cycle +
          '</td><td>' +
          this.tableSelected[i * 3 + 1].price +
          '</td><td>' +
          this.tableSelected[i * 3 + 1].money +
          '</td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
          this.tableSelected[i * 3 + 1].money +
          '</td><td></td></tr><tr>' +
          "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
          "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='http://est.yangguangzhiye.com/Uploads/qrcode/meishan.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
          this.choseVillageInfo.name +
          '</br>物业服务中心</br></br>' +
          '</td></tr>' +
          '</tbody></table>' +
          "<table cellspacing='0' ><tbody>" +
          "<tr><th colspan='4'>缴费通知单</th></tr>" +
          "<tr><td colspan='4' class='bordertop'>小区:" +
          this.choseVillageInfo.name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '房号：' +
          this.tableSelected[i * 3 + 2].resources_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '业主姓名：' +
          this.tableSelected[i * 3 + 2].owner_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '制单日期：' +
          (y + '-' + m + '-' + d) +
          '</td></tr>' +
          '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
          '<tr><td>' +
          this.tableSelected[i * 3 + 2].subject_name +
          '</td><td>' +
          this.tableSelected[i * 3 + 2].cycle +
          '</td><td>' +
          this.tableSelected[i * 3 + 2].price +
          '</td><td>' +
          this.tableSelected[i * 3 + 2].money +
          '</td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
          this.tableSelected[i * 3 + 2].money +
          '</td><td></td></tr><tr>' +
          "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
          "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='http://est.yangguangzhiye.com/Uploads/qrcode/meishan.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
          this.choseVillageInfo.name +
          '</br>物业服务中心</br></br>' +
          '</td></tr>' +
          '</tbody></table>' +
          '</div>' +
          '<p style="page-break-after:always"><!--分页元素--></p>'
        printHtml = printHtml + strTable
      }
      if (yu === 1) {
        printHtml = printHtml +
          '<div id="pagepage' + this.tableSelected.length + '">' +
          '<style >' +
          'table {	width: 700px;border: 1px solid #aaa;; border-collapse:collapse;margin-bottom: 50px;}' +
          'th {text-align: center;border: 1px solid #aaa;border-bottom:none;font-size: 20px;height: 40px;}' +
          'tbody td{text-align: center;height: 25px;border: 1px solid #aaa;font-size: 14px;}' +
          '.bordertop{border-top: none}' +
          'tr:last-child td{border-right: none;border-left: none;}' +
          'tr:last-child td:first-child{border-left: 1px solid #aaa;}' +
          'tr:last-child td:last-child{border-right: 1px solid #aaa;} ' +
          '</style>' +
          "<table cellspacing='0' ><tbody>" +
          "<tr><th colspan='4'>缴费通知单</th></tr>" +
          "<tr><td colspan='4' class='bordertop'>小区:" +
          this.choseVillageInfo.name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '房号：' +
          this.tableSelected[this.tableSelected.length - 1].resources_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '业主姓名：' +
          this.tableSelected[this.tableSelected.length - 1].owner_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '制单日期：' +
          (y + '-' + m + '-' + d) +
          '</td></tr>' +
          '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
          '<tr><td>' +
          this.tableSelected[this.tableSelected.length - 1].subject_name +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 1].cycle +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 1].price +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 1].money +
          '</td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
          this.tableSelected[this.tableSelected.length - 1].money +
          '</td><td></td></tr><tr>' +
          "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
          "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='http://est.yangguangzhiye.com/Uploads/qrcode/meishan.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
          this.choseVillageInfo.name +
          '</br>物业服务中心</br></br>' +
          '</td></tr>' +
          '</tbody></table>' +
          '</div>' +
          '<p style="page-break-after:always"><!--分页元素--></p>'
      } else if (yu === 2) {
        printHtml = printHtml +
          '<div id="pagepage' + this.tableSelected.length + '">' +
          '<style >' +
          'table {	width: 700px;border: 1px solid #aaa;; border-collapse:collapse;margin-bottom: 50px;}' +
          'th {text-align: center;border: 1px solid #aaa;border-bottom:none;font-size: 20px;height: 40px;}' +
          'tbody td{text-align: center;height: 25px;border: 1px solid #aaa;font-size: 14px;}' +
          '.bordertop{border-top: none}' +
          'tr:last-child td{border-right: none;border-left: none;}' +
          'tr:last-child td:first-child{border-left: 1px solid #aaa;}' +
          'tr:last-child td:last-child{border-right: 1px solid #aaa;} ' +
          '</style>' +
          "<table cellspacing='0' ><tbody>" +
          "<tr><th colspan='4'>缴费通知单</th></tr>" +
          "<tr><td colspan='4' class='bordertop'>小区:" +
          this.choseVillageInfo.name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '房号：' +
          this.tableSelected[this.tableSelected.length - 2].resources_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '业主姓名：' +
          this.tableSelected[this.tableSelected.length - 2].owner_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '制单日期：' +
          (y + '-' + m + '-' + d) +
          '</td></tr>' +
          '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
          '<tr><td>' +
          this.tableSelected[this.tableSelected.length - 2].subject_name +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 2].cycle +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 2].price +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 2].money +
          '</td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
          this.tableSelected[this.tableSelected.length - 2].money +
          '</td><td></td></tr><tr>' +
          "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
          "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='http://est.yangguangzhiye.com/Uploads/qrcode/meishan.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
          this.choseVillageInfo.name +
          '</br>物业服务中心</br></br>' +
          '</td></tr>' +
          '</tbody></table>' +
          "<table cellspacing='0' ><tbody>" +
          "<tr><th colspan='4'>缴费通知单</th></tr>" +
          "<tr><td colspan='4' class='bordertop'>小区:" +
          this.choseVillageInfo.name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '房号：' +
          this.tableSelected[this.tableSelected.length - 1].resources_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '业主姓名：' +
          this.tableSelected[this.tableSelected.length - 1].owner_name +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          '制单日期：' +
          (y + '-' + m + '-' + d) +
          '</td></tr>' +
          '<tr><td>科目名称</td><td>描述</td><td>单价</td><td>金额(人民币)</td></tr>' +
          '<tr><td>' +
          this.tableSelected[this.tableSelected.length - 1].subject_name +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 1].cycle +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 1].price +
          '</td><td>' +
          this.tableSelected[this.tableSelected.length - 1].money +
          '</td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          '<tr><td></td><td></td><td></td><td></td></tr>' +
          "<tr><td>总&nbsp;&nbsp;&nbsp;&nbsp;计(人民币)</td><td colspan='2'>" +
          this.tableSelected[this.tableSelected.length - 1].money +
          '</td><td></td></tr><tr>' +
          "<td colspan='4'>为维护小区全体业主共同利益及保证小区物业管理工作正常进行，请您配合及时交纳相关费用，谢谢！</td></tr>" +
          "<tr style='height: 80px;'><td>关注公众号</br>绑定房产缴费</td><td><img src='http://est.yangguangzhiye.com/Uploads/qrcode/meishan.jpg' width='80px' height='80px' ></td><td colspan='2'>" +
          this.choseVillageInfo.name +
          '</br>物业服务中心</br></br>' +
          '</td></tr>' +
          '</tbody></table>' +
          '</div>' +
          '<p style="page-break-after:always"><!--分页元素--></p>'
      }
      var LODOP = getLodop()
      LODOP.PRINT_INIT('打印控件功能演示')
      LODOP.ADD_PRINT_TEXT()
      LODOP.ADD_PRINT_HTM(30, 30, 500, 1000, printHtml)
      LODOP.PREVIEW()
    },

    // 批量删除按钮
    batchDel () {
      this.$prompt('请输入删除欠费原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '删除欠费原因不能为空！'
      }).then(({ value }) => {
        let data = {
          ids: this.tableSelected.map(item => item.id),
          reason: value,
        }
        // 获取项目列表数据
        this.$axios
          .post(this.urlObj.delcost, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '删除欠费成功！'
              });
              // 获取一次表格数据
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '删除欠费失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      }).catch(() => { });
    },

    // 打印处理
    printHandle () {
      this.showPrint = true;
      setTimeout(() => {
        this.showPrint = false;
      }, 500)
    },

    // 点击详情图标处理
    desRecord (index) {
      this.cindex = index
      this.showDescRecordDialog = true
      this.getRecordData()
    },

    // 获取欠费说明记录
    getRecordData () {
      // 表格处于加载状态
      this.descConf.loadStatus = true
      let data = {
        cost_id: this.tableData[this.cindex].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.costreasonlist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.uname = item.creater ? item.creater.realname : ''
              })
            }
            // 设置查询总数
            this.descConf.dataTotal = 0
            // 存放查询数据
            this.descTableData = res.Data
            // 关闭加载状态
            this.descConf.loadStatus = false
            // 清空空数据提示
            this.descConf.emptyText = ''
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
            this.descTableData = []
            this.descConf.emptyText = res.Message
            this.descConf.dataTotal = 0
            this.descConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.descTableData = []
          this.descConf.emptyText = '服务器连接失败...'
          this.descConf.dataTotal = 0
          this.descConf.loadStatus = false
        })
    },

    // 新增说明处理
    addMsg (index) {
      this.isAdd = true
      this.cindex = index
      this.descVal = ''
      this.showDescDialog = true
    },

    // 确认新增/编辑欠费说明
    descSubmit () {
      if (this.descVal) {
        this.isCommit = true
        let url = ''
        let data = {
          content: this.descVal
        }
        if (this.isAdd) {
          url = this.urlObj.costaddreason
          data.cost_id = this.tableData[this.cindex].id
        } else {
          url = this.urlObj.costeditreason
          data.id = this.descTableData[this.descIndex].id
        }
        this.$axios.post(url, data).then(res => {
          if (res.Code === 200) {
            this.showDescDialog = false
            let msg = ''
            if (this.isAdd) {
              msg = '新增欠费说明成功！'
              this.tableLoad()
            } else {
              msg = '编辑欠费说明成功！'
              this.getRecordData()
            }
            this.$message({
              type: 'success',
              message: msg
            })
          } else {
            let msg = res.Message ? res.Message : this.isAdd ? '新增欠费说明失败！' : '编辑欠费说明失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isCommit = false
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请填写欠费说明！'
        })
      }
    },

    // 点击记录表格编辑按钮
    descEdit (index) {
      this.descIndex = index
      this.isAdd = false
      this.descVal = this.descTableData[index].content
      this.showDescDialog = true
    },

    // 点击记录表格删除按钮
    descDel (index) {
      this.$confirm('此操作将删除当前欠费说明记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.descTableData[index].id
          }
          this.$axios
            .post(this.urlObj.costdelreason, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '欠费说明记录删除成功！',
                  type: 'success'
                })
                this.showDescDialog = false
                this.getRecordData()
              } else {
                let msg = res.Message ? res.Message : '欠费说明记录删除失败！'
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

    // 点击短信发送记录按钮处理
    RecordInit () {
      this.statusVal = ''
      this.sendDate = []
      this.keywords = ''
      this.showRecordDialog = true
      this.recordTableLoad()
    },

    // 短信发送记录表格数据
    recordTableLoad () {
      // 表格处于加载状态
      this.recordConf.loadStatus = true
      let data = {
        page: this.recordConf.curPage,
        limit: this.recordConf.limit,
        vid: this.choseVillageInfo.vid,
        status: this.statusVal,
        start_time:
          this.sendDate && this.sendDate[0] ? this.sendDate[0] / 1000 : '',
        end_time:
          this.sendDate && this.sendDate[1] ? this.sendDate[1] / 1000 : '',
        keywords: this.keywords.trim(),
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getsendmsglist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.status_text = item.status == 1 ? '成功' : '失败'
                item.statusColor = item.status == 1 ? '#3ebb75' : 'rgb(245, 108, 108)'
                item.fshide = item.status == 1 ? true : false
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

    // 短信记录表格选择更改处理
    recordSelectionChange (value) {
      this.recordSelects = value
    },

    // 重新发送短信
    sendAgain (index) {
      this.$confirm(
        `确定要重新发送催收短信吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.sendRequest({ ids: [this.recordTableData[index].id] })
        })
        .catch(() => { })
    },

    // 批量重新发送短信
    batchSendAgain () {
      let flag = this.recordSelects.every(item => item.status != 1)
      if (flag) {
        this.$confirm(
          `确定要重新给当前${this.recordSelects.length}条欠费用户发送催收短信吗?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            let data = {
              ids: this.recordSelects.map(item => item.id)
            }
            this.sendRequest(data)
          })
          .catch(() => { })
      } else {
        this.$message({
          type: 'warning',
          message: '存在发送成功的数据，请重新选择！'
        })
      }
    },

    // 重新发送短信请求
    sendRequest (data) {
      this.$axios
        .post(this.urlObj.sendmsgagain, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '短信发送成功！',
              type: 'success'
            })
            // 重新记录获取表格数据
            this.recordTableLoad()
          } else {
            let msg = res.Message ? res.Message : '短信发送失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    /* 导出EXCEL */
    exportRecordData () {
      let data = {
        page: this.recordConf.curPage,
        limit: this.recordConf.limit,
        vid: this.choseVillageInfo.vid,
        status: this.statusVal,
        start_time:
          this.sendDate && this.sendDate[0] ? this.sendDate[0] / 1000 : '',
        end_time:
          this.sendDate && this.sendDate[1] ? this.sendDate[1] / 1000 : '',
        keywords: this.keywords.trim(),
        is_excel: 1
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getsendmsglist, data)
        .then(res => {
          if (res.Code === 200) {
            this.exportRecordExcel(res.Data)
          } else {
            let msg = res.Message ? res.Message : '短信发送记录导出失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    /** 处理数据并导出 */
    exportRecordExcel (result) {
      let tableName = ''
      let headers = []
      let datas = []
      tableName = '短信发送记录'
      headers = [
        '发送人',
        '联系电话',
        '发送状态',
        '发送时间',
        '描述',
      ]
      datas = result.map(item => {
        let arr = [
          item.realname,
          item.phone,
          item.status == 1 ? '成功' : '失败',
          item.create_time,
          item.content,
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

    // 点击表格拆分处理
    splitStart (index) {
      this.sindex = index
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm = {
        stime: '',
        oneMoney: '',
        twoMoney: ''
      }
      this.showSplitDialog = true
      this.getCycleData()
    },

    // 获取欠费周期
    getCycleData () {
      this.$axios
        .post(this.urlObj.getcostcycle, { id: this.tableData[this.sindex].id })
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.previewCostRepair && res.Data.previewCostRepair.stime) {
              this.ruleForm.stime = res.Data.default_time * 1000
              this.stimeChange(this.ruleForm.stime)
            } else {
              this.ruleForm.stime = ''
            }
            this.pickerOptions = {
              disabledDate: time => {
                if (time) {
                  return time.getTime() > res.Data.previewCostRepair.etime * 1000 || time.getTime() < res.Data.previewCostRepair.stime * 1000
                }
              }
            }
          } else {
            let msg = res.Message ? res.Message : '欠费周期数据获取失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取拆分时间段金额
    stimeChange (value) {
      this.ruleForm.oneMoney = ''
      this.ruleForm.twoMoney = ''
      if (value) {
        let data = {
          id: this.tableData[this.sindex].id,
          time: this.ruleForm.stime / 1000
        }
        this.$axios
          .post(this.urlObj.costsplitmoney, data)
          .then(res => {
            if (res.Code === 200) {
              this.oneTime = this.dateFormat(res.Data.time_slot_one.stime) + '~' + this.dateFormat(res.Data.time_slot_one.etime)
              this.twoTime = this.dateFormat(res.Data.time_slot_two.stime) + '~' + this.dateFormat(res.Data.time_slot_two.etime)
              this.ruleForm.oneMoney = res.Data.time_slot_one.money
              this.ruleForm.twoMoney = res.Data.time_slot_two.money
            } else {
              let msg = res.Message ? res.Message : '欠费时间段金额数据获取失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          .catch(() => { })
      }
    },

    // 拆分确认处理
    splitSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.tableData[this.sindex].id,
            time: this.ruleForm.stime / 1000,
            time_slot_one_money: this.ruleForm.oneMoney,
            time_slot_two_money: this.ruleForm.twoMoney
          }
          this.$axios
            .post(this.urlObj.splitcost, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '欠费拆分成功！',
                })
                this.showSplitDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '欠费拆分失败！'
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
    }
  }
}
