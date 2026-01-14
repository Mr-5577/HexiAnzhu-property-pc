import standColumns from '../json/stand-columns.json'
import standRecord from '../json/stand-record.json'

export default {
  name: 'icstanding',
  data () {
    return {
      urlObj: {
        standlist: this.$api.state.Means.standlist.url,
        addrecord: this.$api.state.Means.addrecord.url,
        recordlist: this.$api.state.Means.recordlist.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: standColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示新增领卡弹框
      showAddDialog: false,
      // 表单数据对象
      ruleForm: {
        user: '',
        time: '',
        number: '',
      },
      // 表单验证规则
      rules: {
        user: [
          { required: true, message: '请输入领用人员', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择领用时间', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入领用数量', trigger: 'blur' }
        ]
      },
      // 是否显示领卡记录
      showRecordDialog: false,
      // 记录表格数据
      recordTableData: [],
      // 记录表格列数据配置
      recordColumns: standRecord.list,
      // 记录表格配置
      recordConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否正在提交数据
      isCommit: false,
      total1: 0,
      total2: 0,
      total3: 0,
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
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.standlist, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.list.forEach(item => {
              item.vname = item.village.villagename
              item.oname = item.owner.realname
              item.roomnum = item.owner.rooms.map(itm => itm.roomnum).join('、')
              item.cname = item.creator.realname
            })
            this.total1 = res.Data.total_count
            this.total2 = res.Data.sale_count
            this.total3 = res.Data.available_count
            // 存放查询数据
            this.tableData = res.Data.list
            // 设置查询总数
            this.conf.dataTotal = res.Data.sale_count
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

    // 获取领用记录表格数据
    recordTableLoad () {
      // 表格处于加载状态
      this.recordConf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.recordlist, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.user = item.receiver.realname
            })
            // 存放查询数据
            this.recordTableData = res.Data
            // // 设置查询总数
            // this.recordConf.dataTotal = res.Data.total
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

    // // 表格每页条数改变处理
    // recordSizeChange (num) {
    //   this.recordConf.limit = num
    //   // 获取一次数据
    //   this.recordTableLoad()
    // },

    // // 当前页码改变处理
    // recordCurrentChange (num) {
    //   this.recordConf.curPage = num
    //   // 获取一次数据
    //   this.recordTableLoad()
    // },

    // 点击新增领卡按钮处理
    addCard () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.user = sessionStorage.getItem('realname')
      this.ruleForm.time = new Date()
      this.showAddDialog = true
    },

    // 点击领卡记录按钮处理
    cardRecord () {
      this.showRecordDialog = true
      this.recordTableLoad()
    },

    // 点击确认回收按钮处理
    formSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.choseVillageInfo.vid,
            receiver: sessionStorage.getItem('uid'),
            receive_time: this.ruleForm.time,
            number: this.ruleForm.number
          }
          this.$axios
            .post(this.urlObj.addrecord, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '领卡成功！'
                })
                this.showAddDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '领卡失败！'
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
  }
}
