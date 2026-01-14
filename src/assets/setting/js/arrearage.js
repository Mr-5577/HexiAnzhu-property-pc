import batchCloumns from '../json/batch-cloumns.json'
import addBatch from '../json/add-batch.json'
import manageBatch from '../json/manage-batch.json'
import updateLog from '../json/update-log.json'
import errorLog from '../json/error-log.json'

// 引入添加费用组件
import ChargeAdd from '@/components/charge/common/ChargeAdd.vue'

export default {
  name: 'arrearages',
  components: {
    ChargeAdd
  },
  data () {
    return {
      urlObj: {
        userVillage: this.$api.state.Public.userVillage.url,
        subjectList: this.$api.state.Setting.subjectList.url,
        batchList: this.$api.state.Setting.batchList.url,
        batchRooms: this.$api.state.Setting.batchRooms.url,
        generateArrears: this.$api.state.Setting.generateArrears.url,
        batchLog: this.$api.state.Setting.batchLog.url,
        batchManage: this.$api.state.Setting.getBatchData.url,
        addBatch: this.$api.state.Setting.addBatch.url,
        errorLog: this.$api.state.Setting.errorLog.url,
        updateFail: this.$api.state.Setting.updateFail.url,
        addrooms: this.$api.state.Setting.addrooms.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        searchUnit: this.$api.state.Public.searchUnit.url,
        arrearageProcess: this.$api.state.Setting.processCounts.url
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: batchCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前表格选择的数据列表
      tableSelected: [],
      // 项目下拉框绑定值
      villageVal: '',
      // 项目选择列表
      vilOptions: [],
      // 欠费批次绑定值
      batchVal: '',
      // 欠费批次选择列表
      batchOptions: [],
      // 欠费科目绑定值
      subVal: '',
      // 欠费科目选择列表
      subOptions: [],
      // 欠费开始日期
      startDate: '',
      // 欠费结束日期
      endDate: '',
      // 开始日期限制
      startOptions: {
        disabledDate: time => {
          return false
        }
      },
      // 日期限制条件
      endOptions: {
        disabledDate: time => {
          return false
        }
      },
      // 开关绑定值
      switchVal: true,
      // 是否显示新增弹框
      showAddPop: false,
      // 是否显示批次管理弹框
      showManagePop: false,
      // 是否显示更新记录弹框
      showLogPop: false,
      // 新增弹框、管理弹框、更新日志弹框表格配置
      dialogTable: {
        // 表格数据
        tableData: [],
        // 表格列数据配置
        columns: addBatch.list,
        // 表格配置
        conf: {
          loadStatus: false,
          emptyText: '',
          curPage: 1,
          limit: 20,
          dataTotal: 0
        }
      },
      // 是否正在提交数据
      isCommit: false,
      // 当前弹框 类型
      type: '',
      // 关联项目
      relatedVillage: '',
      // 批次名称
      batchName: '',
      // 首次交房时间
      firstDate: '',
      // 当前请求url
      currentUrl: '',
      // 是否显示失败记录弹框
      showFailDialog: false,
      // 欠费失败表格数据
      failTableData: [],
      // 欠费失败表格列数据配置
      failColumns: errorLog.list,
      // 欠费失败表格配置
      failConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否展示添加费用组件
      showAdd: false,
      // 当前操作的数据对象
      currentObj: {},
      // 楼栋
      buildVal: [],
      buildOptions: [],
      // 单元
      unitVal: [],
      unitOptions: [],
      // 是否显示添加房源弹框
      showAddSource: false,
      // 添加房源表格数据
      addTableData: [],
      // 添加房源表格列数据配置
      addColumns: addBatch.list,
      // 添加房源表格配置
      addConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 100,
        dataTotal: 0
      },
      // 添加房源表格选择数据列表
      addTableSelected: [],
      // 当前添加房源数据的 index
      addIndex: '',
      showProcess: 'ture',
    }
  },

  /**
   * 计算属性
   */
  computed: {
    vid () {
      return this.$store.state.vid
    }
  },

  /**
   * 生命周期
   */
  created () {
    // 获取用户权限下的项目数据
    this.getUserVillage()
  },

  methods: {
    // 获取用户权限下的项目数据
    getUserVillage () {
      this.$axios
        .post(this.urlObj.userVillage)
        .then(res => {
          if (res.Code === 200) {
            this.vilOptions = res.Data
            if (this.vid) {
              this.villageVal = Number(this.vid)
              // 获取批次列表数据
              this.getBatchData()
              // 获取科目列表数据
              this.getSubjectData()
            }
          } else {
            let msg = res.Message ? res.Message : '获取项目数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取项目数据失败!'
          })
        })
    },

    // 获取批次列表数据
    getBatchData () {
      let data = {
        vid: this.villageVal
      }
      this.$axios
        .post(this.urlObj.batchList, data)
        .then(res => {
          if (res.Code === 200) {
            this.batchOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取批次数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取批次数据失败!'
          })
        })
    },

    // 获取科目列表数据
    getSubjectData () {
      let data = {
        vid: this.villageVal
      }
      this.$axios
        .post(this.urlObj.subjectList, data)
        .then(res => {
          if (res.Code === 200) {
            this.subOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取科目数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取科目数据失败!'
          })
        })
    },

    // 项目选择更改处理
    villageChange (value) {
      this.batchVal = ''
      this.batchOptions = []
      this.subVal = ''
      this.subOptions = []
      if (value) {
        // 获取批次列表数据
        this.getBatchData()
        // 获取科目列表数据
        this.getSubjectData()
      }
    },

    // 欠费批次选择更改处理
    batchChange (value) {
      this.tableData = []
      if (value) {
        this.conf = {
          loadStatus: false,
          emptyText: '',
          curPage: 1,
          limit: 20,
          dataTotal: 0
        }
        // 获取表格数据
        this.tableLoad()
      }
    },

    // 开始日期选择更改
    startChange () {
      if (this.startDate) {
        this.endOptions = {
          disabledDate: time => {
            if (time) {
              return time.getTime() < new Date(this.startDate).getTime()
            }
          }
        }
      } else {
        this.endOptions = {
          disabledDate: time => {
            return false
          }
        }
      }
    },

    // 结束日期选择更改
    endChange () {
      if (this.endDate) {
        let y = this.endDate.split('-')[0]
        let m = this.endDate.split('-')[1]
        let day = new Date(y, m, 0).getDate()
        let etime = new Date(y, m - 1, day, 59, 59, 59).getTime()
        this.startOptions = {
          disabledDate: time => {
            if (time) {
              return time.getTime() > etime
            }
          }
        }
      } else {
        this.startOptions = {
          disabledDate: time => {
            return false
          }
        }
      }
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.villageVal,
        batch_id: this.batchVal,
        subject_id: this.subVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.batchRooms, data)
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

    // 点击生成欠费按钮处理
    generateOwe () {
      if (this.villageVal && this.startDate && this.endDate && this.subVal) {
        this.$confirm('确定要生成欠费吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.isCommit = true
            let y = this.endDate.split('-')[0]
            let m = this.endDate.split('-')[1]
            let d = new Date(y, m, 0).getDate()
            // 生成欠费请求
            let data = {
              batch_id: this.batchVal ? this.batchVal : '',
              vid: this.villageVal,
              time: [this.startDate, y + '-' + m + '-' + d],
              subject_id: this.subVal
            }
            this.$axios
              .post(this.urlObj.generateArrears, data)
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: '生成欠费成功！'
                  })
                  this.startDate = ''
                  this.endDate = ''
                  this.subVal = ''
                  this.subOptions = []
                  this.batchVal = ''
                  this.batchOptions = []
                  this.villageVal = ''
                } else {
                  let msg = res.Message ? res.Message : '生成欠费失败!'
                  this.$message({
                    type: 'error',
                    message: msg
                  })
                }
                this.isCommit = false
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '生成欠费失败!'
                })
                this.isCommit = false
              })
          })
          .catch(() => { })
      } else {
        let arr = []
        if (!this.villageVal) {
          arr.push('欠费项目')
        }
        // if (!this.batchVal) {
        //   arr.push('欠费批次')
        // }
        if (!this.subVal) {
          arr.push('欠费科目')
        }
        if (!this.startDate) {
          arr.push('欠费开始日期')
        }
        if (!this.endDate) {
          arr.push('欠费结束日期')
        }
        this.$message({
          type: 'warning',
          message: `请选择${arr.join('、')}`
        })
      }
    },

    // 获取弹框表格数据
    getDialogTable () {
      // 表格处于加载状态
      this.dialogTable.conf.loadStatus = true
      let data = {
        page: this.dialogTable.conf.curPage,
        limit: this.dialogTable.conf.limit,
        vid: this.vid,
        b_id: this.buildVal,
        unit_id: this.unitVal
      }
      if (this.type == 'add') {
        data.vid = this.relatedVillage
      }
      // 获取项目列表数据
      this.$axios
        .post(this.currentUrl, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.dialogTable.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.dialogTable.tableData = res.Data.data
            // 关闭加载状态
            this.dialogTable.conf.loadStatus = false
            // 清空空数据提示
            this.dialogTable.conf.emptyText = ''
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
            this.dialogTable.tableData = []
            this.dialogTable.conf.emptyText = res.Message
            this.dialogTable.conf.dataTotal = 0
            this.dialogTable.conf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.dialogTable.tableData = []
          this.dialogTable.conf.emptyText = '服务器连接失败...'
          this.dialogTable.conf.dataTotal = 0
          this.dialogTable.conf.loadStatus = false
        })
    },

    // 弹框表格每页条数改变处理
    dialogSizeChange (num) {
      this.dialogTable.conf.limit = num
      // 获取表格数据
      this.getDialogTable()
    },

    // 弹框 当前页码改变处理
    dialogCurrentChange (num) {
      this.dialogTable.conf.curPage = num
      // 获取表格数据
      this.getDialogTable()
    },

    // 弹框显示处理
    dialogInit (type) {
      this.type = type
      this.dialogTable = {
        // 表格数据
        tableData: [],
        // 表格列数据配置
        columns: addBatch.list,
        // 表格配置
        conf: {
          loadStatus: false,
          emptyText: '',
          curPage: 1,
          limit: 20,
          dataTotal: 0
        }
      }
      switch (type) {
        case 'add':
          this.dialogTable.conf = {
            loadStatus: false,
            emptyText: '',
            curPage: 1,
            limit: 100,
            dataTotal: 0
          }
          this.currentUrl = this.urlObj.batchRooms
          this.dialogTable.columns = addBatch.list
          this.relatedVillage = Number(this.vid)
          this.buildVal = []
          this.buildOptions = []
          this.unitVal = []
          this.unitOptions = []
          // 获取楼栋数据
          this.getBuildData()
          this.showAddPop = true
          break
        case 'manage':
          this.currentUrl = this.urlObj.batchManage
          this.dialogTable.columns = manageBatch.list
          this.showManagePop = true
          break
        case 'log':
          this.currentUrl = this.urlObj.batchLog
          this.dialogTable.columns = updateLog.list
          this.showLogPop = true
          break
      }
      this.getDialogTable()
    },

    // 提交数据处理
    confirm () {
      this.isCommit = true
      let data = {
        interactive_time: this.firstDate,
        vid: this.relatedVillage,
        name: this.batchName,
        rooms: this.tableSelected.map(item => item.id)
      }
      this.$axios
        .post(this.urlObj.addBatch, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '批次新增成功！'
            })
            this.batchName = ''
            this.firstDate = ''
            this.getDialogTable()
            // 获取一次批次数据
            this.getBatchData()
          } else {
            let msg = res.Message ? res.Message : '批次新增失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isCommit = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '批次新增失败!'
          })
          this.isCommit = false
        })
    },

    // 点击欠费失败记录弹框
    failDialogInit () {
      this.showFailDialog = true
      this.failTableLoad()
    },

    // 欠费失败表格数据获取
    failTableLoad () {
      // 表格处于加载状态
      this.failConf.loadStatus = true
      let data = {
        page: this.failConf.curPage,
        limit: this.failConf.limit,
        vid: this.vid
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.errorLog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.vname = item.village ? item.village.villagename : '--'
                item.sname = item.subject ? item.subject.name : '--'
                item.oname = item.owner ? item.owner.realname : '--'
                item.cname = item.createuser ? item.createuser.realname : '--'
                item.currentData = {
                  id: item.resources.id,
                  oid: item.oid,
                  type: item.resources_model_id
                }
              })
            }
            // 设置查询总数
            this.failConf.dataTotal = res.Data.total
            // 存放查询数据
            this.failTableData = res.Data.data
            // 关闭加载状态
            this.failConf.loadStatus = false
            // 清空空数据提示
            this.failConf.emptyText = ''
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
            this.failTableData = []
            this.failConf.emptyText = res.Message
            this.failConf.dataTotal = 0
            this.failConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.failTableData = []
          this.failConf.emptyText = '服务器连接失败...'
          this.failConf.dataTotal = 0
          this.failConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    failSizeChange (num) {
      this.failConf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    failCurrentChange (num) {
      this.failConf.curPage = num
      // 获取一次表格数据
      this.failTableLoad()
    },

    // 重新添加欠费
    addAgain (index) {
      this.currentObj = {
        vid: this.failTableData[index].village.id,
        oid: this.failTableData[index].oid,
        id: this.failTableData[index].resources_model_id,
        type: this.failTableData[index].resources_model_type,
        subid: this.failTableData[index].subject_id,
        nodeid: this.failTableData[index].nodeid
      }
      this.showAdd = true
      this.$axios
        .post(this.urlObj.updateFail, {
          id: this.failTableData[index].id
        })
        .then(res => {
          if (res.Code != 200) {
            let msg = res.Message ? res.Message : '更新欠费操作失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击返回按钮处理
    goBack () {
      this.showAdd = false
      this.failTableLoad()
    },

    // 获取楼栋数据
    getBuildData () {
      this.$axios
        .post(this.urlObj.buildOfVillage, { vid: this.relatedVillage })
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼栋数据失败!'
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
      this.$axios
        .post(this.urlObj.searchUnit, { bids: this.buildVal })
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取单元数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 新增批次 项目选择更改
    villChange (val) {
      this.buildVal = []
      this.buildOptions = []
      this.unitVal = []
      this.unitOptions = []
      if (val) {
        this.getBuildData()
      }
      this.getDialogTable()
    },

    // 楼栋选择更改处理
    buildChange (val) {
      this.unitVal = []
      this.unitOptions = []
      if (val) {
        this.getUnitData()
      }
      this.getDialogTable()
    },

    // 添加房源
    addSource (index) {
      this.addIndex = index
      this.relatedVillage = Number(this.dialogTable.tableData[index].vid)
      this.buildVal = []
      this.buildOptions = []
      this.unitVal = []
      this.unitOptions = []
      // 获取楼栋数据
      this.getBuildData()
      this.getHouseTables()
      this.showAddSource = true
    },

    // 获取添加房源弹框表格数据
    getHouseTables () {
      // 表格处于加载状态
      this.addConf.loadStatus = true
      let data = {
        page: this.addConf.curPage,
        limit: this.addConf.limit,
        vid: this.relatedVillage,
        b_id: this.buildVal,
        unit_id: this.unitVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.batchRooms, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.addConf.dataTotal = res.Data.total
            // 存放查询数据
            this.addTableData = res.Data.data
            // 关闭加载状态
            this.addConf.loadStatus = false
            // 清空空数据提示
            this.addConf.emptyText = ''
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
            this.addTableData = []
            this.addConf.emptyText = res.Message
            this.addConf.dataTotal = 0
            this.addConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.addTableData = []
          this.addConf.emptyText = '服务器连接失败...'
          this.addConf.dataTotal = 0
          this.addConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    addSizeChange (num) {
      this.addConf.limit = num
      // 获取一次表格数据
      this.getHouseTables()
    },

    // 当前页码改变处理
    addCurrentChange (num) {
      this.addConf.curPage = num
      // 获取一次表格数据
      this.getHouseTables()
    },

    // 表格选择更改处理
    addSelectionChange (arr) {
      this.addTableSelected = arr
    },

    // 楼栋选择更改
    addBuildChange (val) {
      this.unitVal = []
      this.unitOptions = []
      if (val) {
        this.getUnitData()
      }
      this.getHouseTables()
    },

    // 添加房源确认提交
    addSubmit () {
      this.isCommit = true
      let data = {
        id: this.dialogTable.tableData[this.addIndex].id,
        rooms: this.addTableSelected.map(item => item.id),
        vid: this.relatedVillage,
      }
      this.$axios
        .post(this.urlObj.addrooms, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '添加房源成功！'
            })
            this.getDialogTable()
            this.showAddSource = false
          } else {
            let msg = res.Message ? res.Message : '添加房源失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isCommit = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '添加房源失败！'
          })
          this.isCommit = false
        })
    },
    // 显示生成欠费进程

    // 显示生成欠费进程
    processCount () {
      this.showProcess = true;
      this.$axios
        .post(this.urlObj.arrearageProcess, {})
        .then(res => {
          if (res.Code === 200) {
            this.$notify({
              title: '批量生成欠费状态',
              duration: 8000,
              offset: 100,
              dangerouslyUseHTMLString: true,
              message: `<strong><p>待生成物管费总数：${res.Data.wg_count}</p><p>待生成车位费总数：${res.Data.car_count}</p></strong>`,
            });
          } else {
            let msg = res.Message ? res.Message : '添加房源失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '查询失败'
          })
        })
    },
  }
}
