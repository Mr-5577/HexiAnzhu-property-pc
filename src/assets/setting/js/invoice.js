import workIcon from '@/components/common/workIcon.vue'
import invoiceCloumns from '../json/invoice-cloumns.json'
import invoiceCollect from '../json/invoice-collect.json'

export default {
  name: 'invoice',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        invoiceList: this.$api.state.Setting.invoiceList.url,
        mainlist: this.$api.state.Setting.mainlist.url,
        addquo: this.$api.state.Setting.addquo.url,
        examinemain: this.$api.state.Setting.examinemain.url,
        getfacevalue: this.$api.state.Charge.getfacevalue.url,
        addBill: this.$api.state.Setting.addBill.url,
        grantBill: this.$api.state.Setting.grantBill.url,
        customGrant: this.$api.state.Setting.customGrant.url,
        searchuser: this.$api.state.Setting.searchuser.url,
        getcollaruser: this.$api.state.Setting.getcollaruser.url,
        getAreas: this.$api.state.Public.getAreas.url,
        userVillage: this.$api.state.Public.userVillage.url,
        checkbill: this.$api.state.Setting.checkbill.url,
        examine: this.$api.state.Setting.examine.url,
        transferuser: this.$api.state.Setting.transferuser.url,
        examinecancel: this.$api.state.Setting.examinecancel.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 搜索框绑定值
      searchVal: '',
      // 模式绑定值
      modelVal: 1,
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: invoiceCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 发票状态绑定值
      statusVal: '',
      // 审核状态绑定值
      auditVal: '',
      // 发票状态数据列表
      statusOptions: [
        {
          value: 0,
          label: '未领取'
        },
        {
          value: 1,
          label: '已领取'
        },
        {
          value: 2,
          label: '已提交'
        },
        {
          value: 3,
          label: '已缴销'
        }
      ],
      // 发票面值绑定值
      faceVal: '',
      // 发票面值数据列表
      faceOptions: [],
      // 日期选择值
      dateVal: '',
      // 当前弹框类型
      type: '',
      // 是否显示弹框
      showDialog: false,
      // 弹框标题
      dialogTitle: '',
      // 弹框表单数据
      ruleForm: {
        code: '',
        faceValue: '',
        faceVal: '',
        first: '',
        last: '',
        number: '',
        area: '',
        auditor: '',
        village: '',
        user: ''
      },
      // 表单验证对象
      rules: {
        code: [{ required: true, message: '请输入发票代码', trigger: 'blur' }],
        faceValue: [
          { required: true, message: '请输入发票面值', trigger: 'blur' }
        ],
        faceVal: [
          { required: true, message: '请选择发票面值', trigger: 'change' }
        ],
        first: [{ required: true, message: '请输入首张单号', trigger: 'blur' }],
        last: [{ required: true, message: '请输入末张单号', trigger: 'blur' }],
        number: [
          { required: true, message: '请输入发票本数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择发放大区', trigger: 'change' }
        ],
        auditor: [
          { required: true, message: '请选择审核人员', trigger: 'change' }
        ],
        village: [
          { required: true, message: '请选择发放项目', trigger: 'change' }
        ],
        user: [{ required: true, message: '请选择领用人员', trigger: 'change' }]
      },
      // 当前表格中选中的数据
      tableSelected: [],
      // 审核人员列表
      auditorOptions: [],
      // 是否正在搜索审核人员
      isLoading: false,
      // 大区列表
      areaOptions: [],
      // 项目列表
      villageOptions: [],
      // 发放人员列表
      userOptions: [],
      // 是否是批量发放
      isBatch: false,
      // 当前发放表格数据
      currentData: '',
      // 发票是否存在
      isexist: false,
      // 总计本数
      sheetNum: 0,
      // 总计数量
      total: 0,
      // 是否正在提交数据
      isCommit: false,
      // 当前移交数据的 id 列表
      turnOverIds: [],
      // 是否显示审批弹框
      showAuditDialog: false,
      // 是否是单个审核
      isAlone: true,
      // 当前是通过还是驳回
      isPass: true,
      // 当前审核 index
      auditIndex: '',
      // 审批备注
      auditRemark: '',
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    this.tableLoad()
    this.getFaceValue()
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
      // 请求接口获取表格数据
      this.keySearch()
    },

    // 获取面值数据
    getFaceValue () {
      this.$axios
        .post(this.urlObj.getfacevalue)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            Object.keys(res.Data).forEach(item => {
              let obj = {
                value: item,
                label: res.Data[item]
              }
              arr.push(obj)
            })
            this.faceOptions = arr
          } else {
            let msg = res.Message ? res.Message : '获取面值数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 检查发票是否存在
    checkbill () {
      if (
        this.type == 'custom' &&
        this.ruleForm.code &&
        this.ruleForm.faceVal &&
        this.ruleForm.first &&
        this.ruleForm.last
      ) {
        let data = {
          face_value: this.ruleForm.faceVal,
          first: this.ruleForm.first,
          last: this.ruleForm.last,
          fpdm: this.ruleForm.code
        }
        this.$axios.post(this.urlObj.checkbill, data).then(res => {
          if (res.Code === 200) {
            this.isexist = true
            this.sheetNum = res.Data.count
            this.total = res.Data.num
          } else {
            let msg = res.Message ? res.Message : '发票不存在'
            this.$message({
              type: 'error',
              message: msg
            })
            this.isexist = false
          }
        })
      }
    },

    // 模式改变处理
    modelChange () {
      this.searchVal = ""
      this.statusVal = ""
      this.auditVal = ""
      this.faceVal = ""
      this.dateVal = []
      this.tableData = []
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.tableLoad()
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let url = this.modelVal == 1 ? this.urlObj.invoiceList : this.urlObj.mainlist
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        keywords: this.searchVal,
      }
      // 明细模式
      if (this.modelVal == 1) {
        this.columns = invoiceCloumns.list
        data.vid = this.choseVillageInfo.vid
        if (this.statusVal === 0 || this.statusVal) {
          data.status = this.statusVal
        }
        if (this.faceVal === 0 || this.faceVal) {
          data.face_value = this.faceVal
        }
        if (this.dateVal && this.dateVal[0] && this.dateVal[1]) {
          data.time = {
            stime: this.dateVal[0] / 1000,
            etime: this.dateVal[1] / 1000
          }
        }
        if (this.auditVal) {
          data.examine_status = this.auditVal
        }
      } else {
        // 汇总模式
        this.columns = invoiceCollect.list
        if (this.auditVal) {
          data.status = this.auditVal
        }
        if (this.faceVal === 0 || this.faceVal) {
          data.face_value = this.faceVal
        }
      }

      // 获取项目列表数据
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              if (this.modelVal == 1) {
                res.Data.data.forEach(item => {
                  item.gname = item.grantor ? item.grantor.realname : '-'
                  item.vname = item.village ? item.village.villagename : '-'
                  item.user = item.examiner ? item.examiner.realname : '-'
                  item.passHide =
                    item.examine_status != 0 || item.examine_bottom == 0
                      ? true
                      : false
                  item.rejectHide =
                    item.examine_status != 0 || item.examine_bottom == 0
                      ? true
                      : false
                  item.sendHide = (item.status == 0 && item.examine_status == 1) ? false : true
                  item.turnHide = item.status != 1 ? true : false
                  item.cpassHide = item.status != 2 ? true : false
                  item.crejectHide = item.status != 2 ? true : false
                })
              } else {
                res.Data.data.forEach(item => {
                  item.areaName = item.area && item.area.deptname ? item.area.deptname : ''
                  item.rname = item.recorder && item.recorder.realname ? item.recorder.realname : ''
                  item.ename = item.examiner && item.examiner.realname ? item.examiner.realname : ''
                  item.statusColor = item.status == 0 ? '#ffcb3c' : item.status == 1 ? '#69da61' : item.status == 2 ? "#f56c6c" : "#333"
                  item.passHide =
                    item.status != 0 || item.examine_bottom == 0
                      ? true
                      : false
                  item.rejectHide =
                    item.status != 0 || item.examine_bottom == 0
                      ? true
                      : false
                })
              }
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

    // 表格选择更改处理
    selectionChange (arr) {
      this.tableSelected = arr
    },

    // 录入通过/驳回请求
    auditRequest (status, arr) {
      let data = {
        ids: arr,
        status: status
      }
      this.$axios
        .post(this.urlObj.examine, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: status == 1 ? '录入申请已通过！' : '录入申请已驳回！'
            })
            // 重新获取表格数据
            this.tableLoad()
          } else {
            let tip = status == 1 ? '录入申请通过失败！' : '录入申请拒绝失败！'
            let msg = res.Message ? res.Message : tip
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 缴销通过/驳回请求
    cancelRequest (status, arr) {
      let data = {
        ids: arr,
        status: status
      }
      this.$axios
        .post(this.urlObj.examinecancel, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: status == 1 ? '缴销申请已通过！' : '缴销申请已驳回！'
            })
            // 重新获取表格数据
            this.tableLoad()
          } else {
            let tip = status == 1 ? '缴销申请通过失败！' : '缴销申请拒绝失败！'
            let msg = res.Message ? res.Message : tip
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击表格发放按钮处理
    invoiceSend (index) {
      this.isBatch = false
      this.currentData = this.tableData[index]
      this.dialogInit('grant')
    },

    // 点击表格通过按钮处理（录入）
    enterPass (index) {
      this.$confirm('确定要通过当前录入申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.auditRequest(1, [this.tableData[index].id])
        })
        .catch(() => { })
    },

    // 点击表格驳回按钮处理（录入）
    enterReject (index) {
      this.$confirm('确定要驳回当前录入申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.auditRequest(2, [this.tableData[index].id])
        })
        .catch(() => { })
    },

    // 点击表格通过按钮处理（缴销）
    cancelPass (index) {
      this.$confirm('确定要通过当前缴销申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.cancelRequest(1, [this.tableData[index].id])
        })
        .catch(() => { })
    },

    // 点击表格驳回按钮处理（缴销）
    cancelReject (index) {
      this.$confirm('确定要驳回当前缴销申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.cancelRequest(2, [this.tableData[index].id])
        })
        .catch(() => { })
    },

    // 点击表格移交按钮处理
    turnOver (index) {
      this.turnOverIds = [this.tableData[index].id]
      this.dialogInit('turn')
    },

    // 批量发放处理
    batchSend () {
      this.isBatch = true
      this.dialogInit('grant')
    },

    // 批量移交处理
    batchTurn () {
      this.turnOverIds = this.tableSelected.map(item => item.id)
      this.dialogInit('turn')
    },

    // 批量录入审批处理
    batchAudit () {
      this.$confirm('此操作将对发票的录入进行批量处理，点击按钮继续', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '批量通过',
        cancelButtonText: '批量驳回',
        type: 'warning'
      })
        .then(() => {
          let arr = this.tableSelected.map(item => item.id)
          this.auditRequest(1, arr)
        })
        .catch(action => {
          if (action == 'cancel') {
            let arr = this.tableSelected.map(item => item.id)
            this.auditRequest(2, arr)
          }
        })
    },

    // 批量缴销审批处理
    cancelAudit () {
      this.$confirm('此操作将对发票的缴销进行批量处理，点击按钮继续', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '批量通过',
        cancelButtonText: '批量驳回',
        type: 'warning'
      })
        .then(() => {
          let arr = this.tableSelected.map(item => item.id)
          this.cancelRequest(1, arr)
        })
        .catch(action => {
          if (action == 'cancel') {
            let arr = this.tableSelected.map(item => item.id)
            this.cancelRequest(2, arr)
          }
        })
    },

    // 获取大区列表数据
    getAreaList () {
      this.$axios
        .post(this.urlObj.getAreas)
        .then(res => {
          if (res.Code === 200) {
            this.areaOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取大区数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取项目列表数据
    getVillageList () {
      this.$axios
        .post(this.urlObj.userVillage)
        .then(res => {
          if (res.Code === 200) {
            this.villageOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取项目数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 搜索审核人
    remoteMethod (query) {
      if (query !== '') {
        this.isLoading = true
        // 获取审核人数据
        this.$axios
          .post(this.urlObj.searchuser, { keywords: query })
          .then(res => {
            if (res.Code === 200) {
              this.auditorOptions = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '搜索审核人员失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          })
      } else {
        this.auditorOptions = []
      }
    },

    // 获取领用人员
    getUserList (value) {
      this.$axios
        .post(this.urlObj.getcollaruser, { vid: value })
        .then(res => {
          if (res.Code === 200) {
            this.userOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取领用人员数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 项目选择更改处理
    villageChange (value) {
      this.ruleForm.user = ''
      this.userOptions = []
      if (value) {
        // 获取领用人员数据
        this.getUserList(value)
      }
    },

    // 弹框显示初始化
    dialogInit (type) {
      this.type = type
      this.auditorOptions = []
      this.areaOptions = []
      this.villageOptions = []
      this.userOptions = []
      this.sheetNum = 0
      this.total = 0
      switch (type) {
        case 'entering':
          this.dialogTitle = '录入发票'
          this.getAreaList()
          break
        case 'custom':
          this.dialogTitle = '自定义发放'
          this.getVillageList()
          break
        case 'grant':
          this.dialogTitle = '发票发放'
          this.getVillageList()
          break
        case 'turn':
          this.dialogTitle = '发票移交'
          this.getVillageList()
          break
      }
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showDialog = true
    },

    // 数据提交处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let url = ''
          let data = {}
          switch (this.type) {
            case 'entering':
              data = {
                fpdm: this.ruleForm.code,
                face_value: this.ruleForm.faceValue,
                first: this.ruleForm.first,
                last: this.ruleForm.last,
                copies: this.ruleForm.number,
                collar_area: this.ruleForm.area,
                examine_uid: this.ruleForm.auditor
              }
              url = this.urlObj.addquo
              break
            case 'custom':
              if (!this.isexist) {
                this.$message({
                  type: 'warning',
                  message: '票据不存在！'
                })
                this.isCommit = false
                return
              }
              data = {
                fpdm: this.ruleForm.code,
                face_value: this.ruleForm.faceVal,
                first: this.ruleForm.first,
                last: this.ruleForm.last,
                vid: this.ruleForm.village,
                uid: this.ruleForm.user
              }
              url = this.urlObj.customGrant
              break
            case 'grant':
              let ids = []
              if (this.isBatch) {
                ids = this.tableSelected.map(item => item.id)
              } else {
                ids = [this.currentData.id]
              }
              data = {
                ids: ids,
                vid: this.ruleForm.village,
                uid: this.ruleForm.user
              }
              url = this.urlObj.grantBill
              break
            case 'turn':
              data = {
                ids: this.turnOverIds,
                vid: this.ruleForm.village,
                uid: this.ruleForm.user
              }
              url = this.urlObj.transferuser
              break
          }
          this.submitRequest(url, data)
        }
      })
    },

    // 表单提交请求
    submitRequest (url, data) {
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message:
                this.type == 'entering'
                  ? '发票录入成功！'
                  : this.type == 'custom'
                    ? '自定义发放成功！'
                    : this.type == 'turn'
                      ? '发票移交成功！'
                      : '发票发放成功！',
              type: 'success'
            })
            // 关闭弹框重新获取表格数据
            this.showDialog = false
            this.tableLoad()
          } else {
            let tip =
              this.type == 'entering'
                ? '发票录入失败！'
                : this.type == 'custom'
                  ? '自定义发放失败！'
                  : this.type == 'turn'
                    ? '发票移交失败！'
                    : '发票发放失败！'
            let msg = res.Message ? res.Message : tip
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

    // 点击表格通过
    auditPass (index) {
      this.auditIndex = index
      this.isAlone = true
      this.isPass = true
      this.auditRemark = ''
      this.showAuditDialog = true
    },

    // 点击表格驳回
    auditReject (index) {
      this.auditIndex = index
      this.isAlone = true
      this.isPass = false
      this.auditRemark = ''
      this.showAuditDialog = true
    },

    // 点击批量通过/驳回处理
    auditHandle (flag) {
      this.isAlone = false
      this.isPass = flag
      this.auditRemark = ''
      if (this.tableSelected.every(item => item.status == 0) && this.tableSelected[0].examine_bottom != 0) {
        this.showAuditDialog = true
      } else {
        this.$message({
          type: 'warning',
          message: '存在已审批的数据或不具备审批权限！'
        })
      }
    },

    // 审核请求
    auditSubmit () {
      this.isCommit = true
      let ids = []
      if (this.isAlone) {
        ids = [this.tableData[this.auditIndex].id]
      } else {
        ids = this.tableSelected.map(item => item.id)
      }
      let data = {
        ids: ids,
        status: this.isPass ? 1 : 2,
        status_remarks: this.auditRemark
      }
      this.$axios
        .post(this.urlObj.examinemain, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: this.isPass ? '审批已通过！' : '审批已驳回！',
              type: 'success'
            })
            // 关闭弹框重新获取表格数据
            this.showAuditDialog = false
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : this.isPass ? '审批通过失败！' : '审批驳回失败！'
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
  }
}
