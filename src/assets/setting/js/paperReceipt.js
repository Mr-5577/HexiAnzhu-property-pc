import paperReceipt from '../json/paper-receipt.json'
import paperDetail from '../json/paper-detail.json'

export default {
  name: 'receipt',
  data () {
    return {
      urlObj: {
        paperreceiptlist: this.$api.state.Setting.paperreceiptlist.url,
        addreceipt: this.$api.state.Setting.addreceipt.url,
        grantdetails: this.$api.state.Setting.grantdetails.url,
        getAreas: this.$api.state.Public.getAreas.url,
        searchvillage: this.$api.state.Public.searchvillage.url,
        receiptgrant: this.$api.state.Setting.receiptgrant.url,
        receiptmember: this.$api.state.Setting.receiptmember.url,
        getmember: this.$api.state.Setting.getmember.url,
        moveReceipt: this.$api.state.Setting.moveReceipt.url,
        receipttransfer: this.$api.state.Setting.receipttransfer.url,
      },
      // 搜索框绑定值
      searchVal: '',
      // 收据表格数据
      tableData: [],
      // 收据表格列数据配置
      columns: paperReceipt.list,
      // 收据表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 大区列表
      areaVal: '',
      areaOptions: [],
      // 票据状态
      statusVal: '',
      statusOptions: [
        {
          label: '未领用',
          value: 0
        },
        {
          label: '已领用',
          value: 1
        },
        {
          label: '已作废',
          value: 2
        },
      ],
      // 弹框表单数据
      ruleForm: {
        first: '',
        last: '',
      },
      // 表单验证对象
      rules: {
        first: [{ required: true, message: '请输入首张单号', trigger: 'blur' }],
        last: [{ required: true, message: '请输入末张单号', trigger: 'blur' }],
      },
      // 是否显示录入弹框
      showEntryDialog: false,
      // 是否正在提交数据
      isCommit: false,
      // 是否显示明细弹框
      showRecordDialog: false,
      // 明细表格数据
      popTableData: [],
      // 明细表格列数据配置
      popColumns: paperDetail.list,
      // 明细表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示发放弹框
      showGrantDialog: false,
      // 发放弹框标题
      grantTitle: '发放到大区',
      // 发放弹框表单数据
      grantForm: {
        area: '',
        first: '',
        last: '',
        user: '',
        village: '',
      },
      // 发放表单验证对象
      grantRules: {
        area: [{ required: true, message: '请选择发放大区', trigger: 'change' }],
        first: [{ required: true, message: '请输入首张单号', trigger: 'blur' }],
        last: [{ required: true, message: '请输入末张单号', trigger: 'blur' }],
        user: [{ required: true, message: '请选择发放人员', trigger: 'change' }],
        village: [{ required: true, message: '请选择发放项目', trigger: 'change' }],
      },
      // 发放项目列表
      grantVillages: [],
      // 发放人员列表
      grantUsers: [],
      // 是否显示移交弹框
      showMoveDialog: false,
      // 移交弹框表单数据
      moveForm: {
        first: '',
        last: '',
        user: '',
        village: '',
      },
      // 移交表单验证对象
      moveRules: {
        first: [{ required: true, message: '请输入首张单号', trigger: 'blur' }],
        last: [{ required: true, message: '请输入末张单号', trigger: 'blur' }],
        user: [{ required: true, message: '请选择人员', trigger: 'change' }],
        village: [{ required: true, message: '请选择项目', trigger: 'change' }],
      },
      // 项目列表
      villgeOptions: [],
      // 移交人员列表
      userOptions: [],
      // 是否正在搜索用户
      loading: false,
      // 当前发放收据 id
      currentGrantId: '',
      // 当前明细表格的收据id
      detailId: '',
      // 是移交操作还是拆分
      isMove: true,
      // 当前移交/拆分的收据 index
      cmindex: '',
    }
  },
  /**
   * 生命周期
   */
  mounted () {
    // 获取大区数据
    this.getAreaData()
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
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

    // 获取大区数据
    getAreaData () {
      this.$axios
        .post(this.urlObj.getAreas)
        .then(res => {
          if (res.Code === 200) {
            this.areaOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取大区数据失败！'
            this.$message({
              type: 'error',
              message: msg
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
        kwd: this.searchVal,
        status: this.statusVal,
        area: this.areaVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.paperreceiptlist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.uname = item.user ? item.user.realname : ''
                item.deptname = item.department ? item.department.deptname : ''
                if (item.status == 0 && this.$menu.getters.judgeRole('Btn-kDQNa5cnphwi284KgeuRI9TF')) {
                  item.ffhide = false
                } else if (item.status == 1 && this.$menu.getters.judgeRole('Btn-iBdj2to9sgb6nrmYIFxa5N4K')) {
                  item.ffhide = false
                } else {
                  item.ffhide = true
                }
              })
            }
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.tableData = res.Data.data ? res.Data.data : []
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

    // 发放票据
    grantReceipt (index) {
      this.$confirm('确定要发放当前票据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.receiptcancel, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '票据发放成功！'
                })
                // 获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '票据发放失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 点击录入收据按钮处理
    entryHandle () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showEntryDialog = true
    },

    // 录入收据提交
    entrySubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            first: this.ruleForm.first,
            last: this.ruleForm.last,
          }
          this.$axios.post(this.urlObj.addreceipt, data).then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '收据录入成功！'
              })
              this.showEntryDialog = false
              // 获取一次表格数据
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '录入收据失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isCommit = false
          }).catch(() => {
            this.isCommit = false
          })
        }
      })
    },

    // 点击表格发放按钮
    showGrant (index) {
      this.currentGrantId = this.tableData[index].id
      // 未领用
      if (this.tableData[index].status == 0) {
        this.grantTitle = '发放到大区'
      } else if (this.tableData[index].status == 1) {
        // 已领用
        this.grantTitle = '发放到个人'
      }
      // 表单验证重置
      if (this.$refs.grantForm) {
        this.$refs.grantForm.resetFields()
      }
      this.showGrantDialog = true
    },

    // 发放/移交/拆分项目搜索处理
    villageRemote (query) {
      if (query !== '') {
        this.loading = true;
        this.$axios
          .post(this.urlObj.searchvillage, { name: query })
          .then(res => {
            if (res.Code === 200) {
              this.grantVillages = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '获取发放项目数据失败！'
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
        this.grantVillages = [];
      }
    },

    // 发放/移交/拆分项目选择改变处理
    villageChange (val) {
      this.grantForm.user = ''
      this.grantUsers = []
      this.moveForm.user = ''
      if (val) {
        this.getUserData(val)
      }
    },

    // 发放人员搜索处理
    getUserData (val) {
      this.$axios
        .post(this.urlObj.getmember, { vid: val })
        .then(res => {
          if (res.Code === 200) {
            this.grantUsers = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取发放人员数据失败！'
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
    },

    // 发放提交处理
    grantSubmit () {
      this.$refs.grantForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.currentGrantId
          }
          let url = ''
          if (this.grantTitle === '发放到大区') {
            data.area = this.grantForm.area
            url = this.urlObj.receiptgrant
          } else {
            data.first = this.grantForm.first
            data.last = this.grantForm.last
            data.vid = this.grantForm.village
            data.uid = this.grantForm.user
            url = this.urlObj.receiptmember
          }
          this.$axios.post(url, data).then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '收据发放成功！'
              })
              this.showGrantDialog = false
              // 获取一次表格数据
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '收据发放失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isCommit = false
          }).catch(() => {
            this.isCommit = false
          })
        }
      })
    },

    // 查看收据明细
    showDetail (index) {
      this.detailId = this.tableData[index].id
      this.showRecordDialog = true
      this.RecordTableLoad()
    },

    // 获取明细表格数据
    RecordTableLoad () {
      // 表格处于加载状态
      this.popConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.grantdetails, { id: this.detailId })
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.vname = item.village ? item.village.villagename : ''
              item.uname = item.user ? item.user.realname : ''
              item.status_text = item.status == 0 ? '未领用' : item.status == 1 ? '已领用' : item.status == 2 ? '已作废' : ''
              item.yjhide = item.is_runout == 1 ? true : false
              item.cfhide = item.is_runout == 1 ? true : false
            })
            // 设置查询总数
            this.popConf.dataTotal = res.Data.total
            // 存放查询数据
            this.popTableData = res.Data ? res.Data : []
            // 关闭加载状态
            this.popConf.loadStatus = false
            // 清空空数据提示
            this.popConf.emptyText = ''
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
            this.popConf.emptyText = res.Message
            this.popConf.dataTotal = 0
            this.popConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.popTableData = []
          this.popConf.emptyText = '服务器连接失败...'
          this.popConf.dataTotal = 0
          this.popConf.loadStatus = false
        })
    },

    // 点击表格移交按钮
    moveReceipt (index) {
      this.cmindex = index
      // 表单验证重置
      if (this.$refs.moveForm) {
        this.$refs.moveForm.resetFields()
      }
      this.grantUsers = []
      this.grantVillages = []
      this.isMove = true
      this.showMoveDialog = true
    },

    // 点击表格拆分按钮处理
    resolution (index) {
      this.cmindex = index
      // 表单验证重置
      if (this.$refs.moveForm) {
        this.$refs.moveForm.resetFields()
      }
      this.grantUsers = []
      this.grantVillages = []
      this.isMove = false
      this.showMoveDialog = true
    },

    // 收据移交提交
    moveSubmit () {
      this.$refs.moveForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.popTableData[this.cmindex].id,
            vid: this.moveForm.village,
            uid: this.moveForm.user
          }
          let url = ''
          if (this.isMove) {
            url = this.urlObj.moveReceipt
          } else {
            data.first = this.moveForm.first
            data.last = this.moveForm.last
            url = this.urlObj.receipttransfer
          }
          this.$axios.post(url, data).then(res => {
            if (res.Code === 200) {
              let msg = this.isMove ? '收据移交成功！' : '收据拆分成功！'
              this.$message({
                type: 'success',
                message: msg
              })
              this.showMoveDialog = false
              // 获取一次表格数据
              this.RecordTableLoad()
            } else {
              let msg = res.Message ? res.Message : this.isMove ? '收据移交失败！' : '收据拆分失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isCommit = false
          }).catch(() => {
            this.isCommit = false
          })
        }
      })
    }
  }
}
