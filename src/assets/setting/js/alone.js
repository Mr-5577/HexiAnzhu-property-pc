import aloneCloumns from '../json/alone-cloumns.json'
import aloneLog from '../json/alone-log.json'

export default {
  name: 'alone',
  data () {
    return {
      urlObj: {
        villages: this.$api.state.System.village.list.url,
        aloneList: this.$api.state.Setting.aloneList.url,
        changeLog: this.$api.state.Setting.changeLog.url,
        infoEdit: this.$api.state.Setting.infoEdit.url,
        getResourceTypes: this.$api.state.Setting.getResourceTypes.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        subjectList: this.$api.state.Public.subjectList.url
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
      columns: aloneCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 表格中选中的数据
      tableSelected: [],
      // 是否打开变更日志弹框
      showLogDialog: false,
      // 日志表格数据
      logTableData: [],
      // 日志表格列数据配置
      logColumns: aloneLog.list,
      // 日志表格配置
      logConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 楼栋下拉框绑定值
      buildVal: '',
      // 楼栋数据列表
      buildOptions: [],
      // 单元下拉框绑定值
      unitVal: '',
      // 单元数据列表
      unitOptions: [],
      // 资源类型
      typeVal: '',
      typeOptions: [],
      // 计费科目下拉框绑定值
      subVal: '',
      // 计费科目数据列表
      subOptions: [],
      // 当前编辑数据的索引
      currentIndex: 0,
      // 是否显示设置计费标准弹框
      showChargeDialog: false,
      // 表单数据对象
      editForm: {
        subValue: '',
        priceValue: ''
      },
      // 表单验证对象
      rules: {
        subValue: [
          { required: false, message: '请输入计费科目', trigger: 'blur' }
        ],
        priceValue: [
          { required: true, message: '请输入基本单价', trigger: 'blur' }
        ]
      },
      // 是否是批量设置
      isBatch: false,
      // 是否正在提交数据
      isCommit: false
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
    this.getTypeSubjects()
  },

  /**
   * 方法
   */
  methods: {
    async getTypeSubjects () {
      let res1 = await this.$axios.post(this.urlObj.getResourceTypes)
      let res2 = await this.$axios.post(this.urlObj.subjectList, { vid: this.choseVillageInfo.vid })
      if (res1.Code === 200) {
        this.typeVal = res1.Data && res1.Data.length > 0 ? res1.Data[0].model_type : ''
        this.typeOptions = res1.Data ? res1.Data : []
      } else {
        let msg = res1.Message ? res1.Message : '获取资源类型数据失败！'
        this.$message({
          type: 'error',
          message: msg
        })
      }
      if (res2.Code === 200) {
        this.subVal = res2.Data && res2.Data.length > 0 ? [res2.Data[0].id] : []
        this.subOptions = res2.Data ? res2.Data : []
      } else {
        let msg = res2.Message ? res2.Message : '获取科目数据失败！'
        this.$message({
          type: 'error',
          message: msg
        })
      }
      if (this.typeVal && this.subVal) {
        this.tableLoad()
      }
    },

    // 获取科目数据
    async getSubject () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      let res = await this.$axios.post(this.urlObj.subjectList, data)
      if (res.Code === 200) {
        this.subVal = res.Data && res.Data.length > 0 ? [res.Data[0].id] : []
        this.subOptions = res.Data ? res.Data : []
      } else {
        let msg = res.Message ? res.Message : '获取科目数据失败！'
        this.$message({
          type: 'error',
          message: msg
        })
      }
    },

    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      // 清空楼栋、单元、计费科目
      this.buildVal = ''
      this.buildOptions = []
      this.unitVal = ''
      this.unitOptions = []
      this.subVal = ''
      this.subOptions = []
      if (this.choseVillageInfo.vid) {
        // 获取科目数据
        this.getSubject()
      }
      // 请求接口获取表格数据
      this.keySearch()
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

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        page: this.conf.curPage,
        limit: this.conf.limit,
        name: this.searchVal,
        bid: this.buildVal,
        unit: this.unitVal,
        subject: this.subVal,
        model_type: this.typeVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.aloneList, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach(item => {
              item.bjhide = item.edit_auth == 1 ? false : true
            })
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

    // 表格选择更改处理
    selectionChange (arr) {
      this.tableSelected = arr
    },

    // 科目选择更改
    subChange (value) {
      if (value.length > 0) {
        let ipt = document.querySelector(
          '#alone .select-wp .el-select__tags >.el-select__input'
        )
        ipt.removeAttribute('placeholder')
      } else {
        let ipt = document.querySelector(
          '#alone .select-wp .el-select__tags >.el-select__input'
        )
        ipt.setAttribute('placeholder', '选择科目搜索')
      }
      this.tableLoad()
    },

    // 获取变更日志数据
    getLogData () {
      // 表格处于加载状态
      this.logConf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        page: this.logConf.curPage,
        limit: this.logConf.limit
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.changeLog, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach(item => {
              item.operator = item.createuser ? item.createuser.realname : ''
              item.tel = item.createuser ? item.createuser.tel : ''
              item.roomnum = item.source ? item.source.roomnum : ''
            })
            // 设置查询总数
            this.logConf.dataTotal = res.Data.total
            // 存放查询数据
            this.logTableData = res.Data.data
            // 关闭加载状态
            this.logConf.loadStatus = false
            // 清空空数据提示
            this.logConf.emptyText = ''
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
            this.logTableData = []
            this.logConf.emptyText = res.Message
            this.logConf.dataTotal = 0
            this.logConf.loadStatus = false
          }
        })
        .catch(() => {
          this.logTableData = []
          this.logConf.emptyText = '服务器连接失败...'
          this.logConf.dataTotal = 0
          this.logConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    sizeChange (num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 表格每页条数改变处理
    logSizeChange (num) {
      this.logConf.limit = num
      // 获取一次表格数据
      this.getLogData()
    },

    // 当前页码改变处理
    currentChange (num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    logCurrentChange (num) {
      this.logConf.curPage = num
      // 获取一次表格数据
      this.getLogData()
    },

    // 查看变更日志
    viewLog () {
      this.showLogDialog = true
      this.getLogData()
    },

    // 点击表格编辑按钮处理
    tableEdit (index) {
      this.isBatch = false
      this.currentIndex = index
      // 表单验证重置
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      this.editForm.subValue = this.tableData[index].subject_village_name
      this.editForm.priceValue = this.tableData[index].price
      this.showChargeDialog = true
    },

    // 点击批量设置按钮处理
    batchSetting () {
      this.isBatch = true
      // 表单验证重置
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      let subs = []
      this.tableSelected.forEach(item => {
        if (!subs.includes(item.subject_village_name)) {
          subs.push(item.subject_village_name)
        }
      })
      this.editForm.subValue = subs.join('、')
      this.editForm.priceValue = ''
      this.showChargeDialog = true
    },

    // 提交数据处理
    editSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.isSubmit = true
          let data = {}
          if (this.isBatch) {
            data = {
              price_batch: this.tableSelected.map(item => {
                return {
                  id: item.id,
                  price: this.editForm.priceValue
                }
              })
            }
          } else {
            data = {
              id: this.tableData[this.currentIndex].id,
              price: this.editForm.priceValue,
              resourcesmodel_type: this.tableData[this.currentIndex]
                .resourcesmodel_type
            }
          }
          // 新增科目请求
          this.$axios
            .post(this.urlObj.infoEdit, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: this.isBatch ? '批量设置成功！' : '设置成功！'
                })
                this.showChargeDialog = false
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : (this.isBatch ? '批量设置失败！' : '设置失败！')
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.isSubmit = false
            })
            .catch(() => {
              this.isSubmit = false
            })
        }
      })
    }
  }
}
