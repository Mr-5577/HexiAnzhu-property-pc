import tempColumns from '../json/temp-columns.json'

export default {
  name: 'chargeTemp',
  data () {
    return {
      urlObj: {
        charges: this.$api.state.ParkManage.charges.url,
        modes: this.$api.state.ParkManage.modes.url,
        chargestatus: this.$api.state.ParkManage.chargestatus.url,
        addcharge: this.$api.state.ParkManage.addcharge.url,
        applied: this.$api.state.ParkManage.applied.url,
        appliedcars: this.$api.state.ParkManage.appliedcars.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: ''
      },
      // 闸机位置
      mode: '',
      modeOptions: [],
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: tempColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示新增充电桩弹框
      showAddDialog: false,
      // 新增模板表单对象
      ruleForm: {
        name: '',
        mode: '',
        money: '',
        time: '',
        type: '',
        number: '',
        remark: ''
      },
      // 新增模板表单验证对象
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        mode: [
          { required: true, message: '请选择收费模式', trigger: 'change' }
        ],
        money: [
          { required: true, message: '请输入收费金额', trigger: 'blur' }
        ],
        time: [
          { required: false, message: '请输入有效时间', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择通行模式', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入通行次数', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入资费说明', trigger: 'blur' }
        ],
      },
      // 是否正在提交数据
      isCommit: false,
      // 是否显示应用车场弹框
      showUseDialog: false,
      // 应用车场详情数据列表
      detailList: [],
      // 当前tab 名
      activeName: '',
      // 当前详情的收费模板index
      cIndex: '',
      // 是否正在加载详情数据
      loadDetail: false,
      // 是否是编辑操作
      isEdit: false,
      // 当前编辑操作的 index
      editIndex: '',
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
    this.getChargeData()
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
      this.searchVal = ''
      this.mode = ''
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

    // 获取收费方式/收费标准
    getChargeData () {
      this.$axios
        .post(this.urlObj.modes, { mode: '' })
        .then(res => {
          if (res.Code === 200) {
            this.modeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取收费模式数据失败！'
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
        mode: this.mode,
        keyword: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.charges, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach(item => {
              item.uname = item.user ? item.user.realname : ''
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
            this.datas = []
            this.conf.emptyText = res.Message
            this.conf.dataTotal = 0
            this.conf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.datas = []
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

    // 启用状态改变
    tableSetVal (obj) {
      let msg = obj.value == 0 ? '关闭' : '启用'
      // 弹出提示弹框
      this.$confirm(`确定要${msg}当前收费模板吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let value = obj.value == 0 ? -1 : 1
        let data = {
          id: this.tableData[obj.index].id,
          status: value
        }
        this.$axios
          .post(this.urlObj.chargestatus, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: `收费模板${msg}成功！`
              })
              this.$set(this.tableData[obj.index], obj.col_name, value)
            } else {
              let msg = res.Message ? res.Message : `收费模板${msg}失败！`
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      }).catch(() => { })
    },

    // 点击新增收费标准按钮处理
    addCharge () {
      this.isEdit = false
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm = {
        name: '',
        mode: '',
        money: '',
        time: '',
        type: '',
        number: '',
        remark: ''
      }
      this.showAddDialog = true
    },

    // 收费模式选择更改处理
    modeChange (val) {
      if (val == 'day') {
        this.ruleForm.time = 1
      } else if (val == 'hour') {
        this.ruleForm.time = 24
      }
    },

    // 数据提交处理
    addSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            title: this.ruleForm.name,
            mode: this.ruleForm.mode,
            money: this.ruleForm.money,
            type: this.ruleForm.type,
            remark: this.ruleForm.remark,
          }

          if (this.isEdit) {
            data.id = this.tableData[this.editIndex].id
          }

          if (this.ruleForm.type == 1) {
            data.times = this.ruleForm.number
          }

          this.$axios
            .post(this.urlObj.addcharge, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: this.isEdit ? '收费模板修改成功！' : '收费模板添加成功！'
                })
                this.showAddDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : this.isEdit ? '收费模板修改失败！' : '收费模板添加失败！'
                this.$message({
                  type: 'error',
                  message: msg
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

    // 点击表格详情按钮处理
    tableDetail (index) {
      this.cIndex = index
      this.showUseDialog = true
      this.getParkDatas()
    },

    // 点击表格编辑按钮处理
    tempEdit (index) {
      this.isEdit = true
      this.editIndex = index
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.name = this.tableData[index].title
      this.ruleForm.mode = this.tableData[index].mode
      this.ruleForm.time = this.tableData[index].mode === 'day' ? 1 : this.tableData[index].mode === 'hour' ? 24 : ''
      this.ruleForm.money = this.tableData[index].money
      this.ruleForm.type = this.tableData[index].type
      this.ruleForm.number = this.tableData[index].times ? this.tableData[index].times : ''
      this.ruleForm.remark = this.tableData[index].remark
      this.showAddDialog = true
    },

    // 获取应用车场数据
    getParkDatas () {
      this.loadDetail = true
      this.$axios
        .post(this.urlObj.appliedcars, { id: this.tableData[this.cIndex].id })
        .then(res => {
          if (res.Code === 200) {
            this.activeName = res.Data && res.Data.length > 0 ? res.Data[0].deptname : ''
            this.detailList = res.Data && res.Data.length > 0 ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '应用车场数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.loadDetail = false
        })
        .catch(() => {
          this.loadDetail = false
        })
    },

    // 点击全部按钮处理
    selectAll (obj) {
      if (obj.lowerDepartment.every(item => item.checked)) {
        obj.lowerDepartment.forEach(item => {
          item.checked = false
        })
      } else {
        obj.lowerDepartment.forEach(item => {
          item.checked = true
        })
      }
    },

    // 确认应用处理
    useSubmit () {
      this.isCommit = true
      let selects = []
      this.detailList.forEach(item => {
        item.lowerDepartment.forEach(itm => {
          itm.lowerDepartment.forEach(i => {
            if (i.checked) {
              selects.push(i.vid)
            }
          })
        })
      })
      let data = {
        id: this.tableData[this.cIndex].id,
        vid: selects
      }
      this.$axios
        .post(this.urlObj.applied, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              dangerouslyUseHTMLString: true,
              message: res.Message ? res.Message : '车场应用成功！'
            })
            this.showUseDialog = false
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '车场应用失败！'
            this.$message({
              type: 'error',
              message: msg
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
