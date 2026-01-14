import smspushColumns from '../json/smspush-columns.json'
import smspushAdd from '../json/smspush-add.json'
import sendRecord from '../json/send-record.json'
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'smsPush',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        smslist: this.$api.state.Custom.smslist.url,
        smstemps: this.$api.state.Custom.smstemps.url,
        tempdetail: this.$api.state.Custom.tempdetail.url,
        tempvillage: this.$api.state.Custom.tempvillage.url,
        sendmsg: this.$api.state.Custom.sendmsg.url,
        tempcontent: this.$api.state.Custom.tempcontent.url,
        getOwners: this.$api.state.Public.getOwners.url,
        userType: this.$api.state.Means.userType.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        searchUnit: this.$api.state.Public.searchUnit.url,
        getmsglist: this.$api.state.Custom.getmsglist.url,
        sendmsgagain: this.$api.state.Custom.sendmsgagain.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: smspushColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示新增弹框
      showAddDialog: false,
      // 推送模板
      tempVal: "",
      tempOptions: [],
      // 推送备注
      pushRemark: "",
      // 推送项目
      pushVillages: [],
      villageOptions: [],
      // 楼栋
      buildVal: [],
      buildOptions: [],
      // 单元
      unitVal: [],
      unitOptions: [],
      // 客户类型
      typeVal: "",
      typeOptions: [],
      // 交房状态
      statusVal: "",
      // 是否正在提交数据
      isCommit: false,
      // 表格数据
      ownerTableData: [],
      // 表格列数据配置
      ownerColumns: smspushAdd.list,
      // 表格配置
      ownerConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前模板数据对象
      currentTemp: {},
      // 当前模板计费
      tempContent: {},
      // 选择的项目列表(上一次)
      oldSelected: [],
      // 选择的项目列表
      selectedVillages: [],
      // 当前选择的 项目 id
      cvid: '',
      // 表格中默认选中值
      defaultSelecteRows: [],
      // 是否显示短信记录弹框
      showRecordDialog: false,
      // 发送状态
      statusVal: '',
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
      // 当前操作表格行 index
      cindex: "",
    }
  },

  /**
   * 计算属性
   */
  computed: {
    vid () {
      return this.$store.state.vid
    },

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
    },

    // 消息发送条数
    sendNumber () {
      let total = 0
      this.selectedVillages.forEach(item => {
        // 业主去重
        let obj = {};
        let arr = item.selects.reduce((item, next) => {
          obj[next.oid] ? '' : obj[next.oid] = true && item.push(next);
          return item;
        }, []);
        total = arr.length + total
      })
      return total
    },

    // 总计
    sendTotal () {
      return this.accMul(Number(this.sendNumber), Number((this.tempContent.price ? this.tempContent.price : 0)))
    }
  },

  /**
   *
   */
  watch: {
    vid () {
      this.tableLoad()
    },

    cvid () {
      this.buildVal = ""
      this.buildOptions = []
      this.unitVal = ""
      this.unitOptions = []
      this.typeVal = 1
      this.ownerTableLoad()
      this.getBuildData()
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 两数相乘
    accMul (arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) { }
      try {
        m += s2.split('.')[1].length
      } catch (e) { }
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
    },

    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.tableLoad()
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
      }
      if (this.startTime) {
        data.start_time = this.startTime / 1000
      }
      if (this.endTime) {
        data.end_time = this.endTime / 1000
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.smslist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.tempName = item.template.name
                item.cname = item.creater.realname
              })
            }
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

    // 弹框初始化
    dialogInit () {
      this.currentTemp = {}
      this.tempContent = {}
      this.pushVillages = []
      this.villageOptions = []
      this.pushVillages = []
      this.oldSelected = []
      this.buildVal = []
      this.buildOptions = []
      this.unitVal = []
      this.unitOptions = []
      this.typeVal = 1
      this.ownerTableData = []
      this.ownerConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.cvid = ''
      this.selectedVillages = []
      this.defaultSelecteRows = []
    },

    // 点击新增推送处理
    addPush () {
      this.tempVal = ""
      this.tempOptions = []
      this.dialogInit()
      this.showAddDialog = true
      // 获取推送模板
      this.getTempData()
      // 获取业主类型
      this.getOwnerType()
    },

    // 获取推送模板列表数据
    getTempData () {
      let data = {
        page: 1,
        limit: 100,
        type: 'all',
      }
      this.$axios
        .post(this.urlObj.smstemps, data)
        .then(res => {
          if (res.Code === 200) {
            this.tempOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '推送模板数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 模板选择改变处理
    tempChange (value) {
      this.dialogInit()
      if (value) {
        this.getTempDetail()
        this.getTempVillages()
      }
    },

    // 获取推送模板详情数据
    getTempDetail () {
      let data = {
        id: this.tempVal
      }
      this.$axios
        .post(this.urlObj.tempdetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.currentTemp = res.Data
            this.getTempContent()
          } else {
            let msg = res.Message ? res.Message : '模板详情数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取推送模板详情数据
    getTempContent () {
      let data = {
        content: this.currentTemp.content
      }
      this.$axios
        .post(this.urlObj.tempcontent, data)
        .then(res => {
          if (res.Code === 200) {
            this.tempContent = res.Data
          } else {
            let msg = res.Message ? res.Message : '模板单条计费获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取模板绑定所有项目
    getTempVillages () {
      let data = {
        id: this.tempVal,
        type: 'normal'
      }
      this.$axios
        .post(this.urlObj.tempvillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.villageOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '模板项目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 项目选择更改
    villageChange () {
      let arr = []
      let oldIds = this.oldSelected.map(item => item.id)
      if (this.cvid && this.pushVillages.includes(this.cvid)) {
        this.villageOptions.forEach(item => {
          if (this.pushVillages.includes(item.id)) {
            if (item.id == this.cvid) {
              item.active = true
            } else {
              item.active = false
            }
            if (oldIds.includes(item.id)) {
              item.selects = this.oldSelected.find(itm => itm.id == item.id).selects
            } else {
              item.selects = []
            }
            arr.push(item)
          }
        })
      } else {
        this.villageOptions.forEach(item => {
          if (this.pushVillages.includes(item.id)) {
            if (item.id == this.pushVillages[0]) {
              item.active = true
              this.cvid = item.id
            } else {
              item.active = false
            }
            if (oldIds.includes(item.id)) {
              item.selects = this.oldSelected.find(itm => itm.id == item.id).selects
            } else {
              item.selects = []
            }
            arr.push(item)
          }
        })
      }
      this.oldSelected = JSON.parse(JSON.stringify(arr))
      this.selectedVillages = arr
    },

    // 点击项目 tab 处理
    villageClick (obj) {
      if (!obj.active) {
        this.selectedVillages.forEach(item => {
          item.active = false
        })
        obj.active = true
        this.cvid = obj.id
        let arr = JSON.parse(JSON.stringify(this.selectedVillages))
        this.selectedVillages = arr
      }
    },

    // 楼栋选择改变处理
    buildChange () {
      this.unitVal = ""
      this.unitOptions = []
      this.getUnitData()
      this.ownerTableLoad()
    },

    // 业主类型改变处理
    typeChange () {
      if (this.cvid) {
        this.ownerTableLoad()
      } else {
        this.$message({
          type: 'warning',
          message: '请选择推送项目！'
        })
      }
    },

    // 获取楼栋
    getBuildData () {
      let data = {
        vid: this.cvid,
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '楼栋数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元数据
    getUnitData () {
      let data = {
        bids: this.buildVal,
      }
      this.$axios
        .post(this.urlObj.searchUnit, data)
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '单元数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取业主类型
    getOwnerType () {
      this.$axios
        .post(this.urlObj.userType)
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
            this.typeVal = 1
          } else {
            let msg = res.Message ? res.Message : '业主类型获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取表格数据
    ownerTableLoad () {
      if (this.selectedVillages.length > 0) {
        // 设置默认选择
        let obj = this.selectedVillages.find(item => item.id == this.cvid)
        this.defaultSelecteRows = obj.selects.map(item => item.roomid)
      }
      // 表格处于加载状态
      this.ownerConf.loadStatus = true
      let data = {
        vid: this.cvid,
        bid_ids: this.buildVal,
        unit_ids: this.unitVal,
        type_id: this.typeVal,
        check_type: this.statusVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getOwners, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            // this.ownerConf.dataTotal = res.Data.total
            // 存放查询数据
            this.ownerTableData = res.Data
            // 关闭加载状态
            this.ownerConf.loadStatus = false
            // 清空空数据提示
            this.ownerConf.emptyText = ''
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
            this.ownerTableData = []
            this.ownerConf.emptyText = res.Message
            this.ownerConf.dataTotal = 0
            this.ownerConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.ownerTableData = []
          this.ownerConf.emptyText = '服务器连接失败...'
          this.ownerConf.dataTotal = 0
          this.ownerConf.loadStatus = false
        })
    },

    // 表格全选处理
    selectAllEvent ({ records }) {
      let obj = null
      let index = ''
      this.selectedVillages.forEach((item, i) => {
        if (item.id == this.cvid) {
          obj = item
          index = i
        }
      })
      obj.selects = records
      this.$set(this.selectedVillages, index, obj)
      this.oldSelected = JSON.parse(JSON.stringify(this.selectedVillages))
    },

    // 表格单选处理
    selectChangeEvent ({ records }) {
      let obj = null
      let index = ''
      this.selectedVillages.forEach((item, i) => {
        if (item.id == this.cvid) {
          obj = item
          index = i
        }
      })
      obj.selects = records
      this.$set(this.selectedVillages, index, obj)
      this.oldSelected = JSON.parse(JSON.stringify(this.selectedVillages))
    },

    // 点击表格详情按钮处理
    tableDetail (index) {
      this.cindex = index
      this.statusVal = ''
      this.keywords = ''
      this.recordConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.showRecordDialog = true
      this.recordTableLoad()
    },

    // 数据提交处理
    pushSubmit () {
      let vids = []
      let sendData = []
      this.selectedVillages.forEach(item => {
        if (item.selects.length > 0) {
          vids.push(item.id)
          item.selects.forEach(itm => {
            sendData.push({ oid: itm.oid, roomid: itm.roomid })
          })
        }
      })
      if (!this.tempVal) {
        this.$message({
          type: 'warning',
          message: '请选择推送模板！'
        })
        return
      }
      if (this.pushVillages.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择推送项目！'
        })
        return
      }
      if (sendData.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择推送业主！'
        })
        return
      }
      this.isCommit = true
      let data = {
        template_id: this.tempVal,
        vids: vids,
        send_data: sendData,
        remarks: this.pushRemark
      }
      this.$axios.post(this.urlObj.sendmsg, data).then(res => {
        if (res.Code === 200) {
          this.$message({
            type: 'success',
            message: '短信推送成功！'
          })
          this.showAddDialog = false
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '短信推送失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isCommit = false
      }).catch(() => {
        this.isCommit = false
      })
    },

    // 短信发送记录表格数据
    recordTableLoad () {
      // 表格处于加载状态
      this.recordConf.loadStatus = true
      let data = {
        page: this.recordConf.curPage,
        limit: this.recordConf.limit,
        status: this.statusVal,
        count_id: this.tableData[this.cindex].id,
        keywords: this.keywords.trim(),
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getmsglist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.status_text = item.status == 1 ? '成功' : item.status == 2 ? '失败' : '待发送'
                item.statusColor = item.status == 1 ? '#3ebb75' : item.status == 2 ? 'rgb(245, 108, 108)' : '#333'
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
        `确定要重新发送短信吗?`,
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
          `确定要重新给当前${this.recordSelects.length}条欠费用户发送短信吗?`,
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
        status: this.statusVal,
        count_id: this.tableData[this.cindex].id,
        keywords: this.keywords.trim(),
        is_excel: 1
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getmsglist, data)
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
  }
}
