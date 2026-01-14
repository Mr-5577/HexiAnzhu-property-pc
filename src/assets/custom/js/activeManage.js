import invoiceCloumns from '../json/invoice-cloumns.json'

export default {
  name: 'activeManage',
  data() {
    return {
      urlObj: {
        villages: this.$api.state.System.village.list.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: invoiceCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 发票状态绑定值
      statusVal: '',
      // 发票状态数据列表
      statusOptions: [],
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
      // 弹框数据
      dialogData: {
        // 发票面值
        faceValue: '',
        faceOptions: [],
        // 发票代码
        invoiceCode: '',
        // 首张单号
        firstBill: '',
        // 末张单号
        lastBill: '',
        // 发放项目
        village: '',
        villageOptions: [],
        // 发放人员
        grantUser: '',
        userOptions: [],
        // 总计本数
        sheetNum: 120,
        // 总计数量
        total: 240,
        // 发放大区
        area: '',
        areaOptions: []
      },
      // 是否正在提交数据
      isCommit: false
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 获取表格数据
    tableLoad(pageReload = false) {
      if (pageReload === true) {
        //重置表格分页数据
        this.$set(this.conf, 'curPage', 1)
      }
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        token: this.$api.state.System.village.list.token,
        keywords: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.villages, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.tableData = res.Data.datas
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

    // 点击查询处理
    keySearch() {
      // 参数赋值
      this.choseVillageInfo.name = '全部项目'
      this.choseVillageInfo.vid = 0
      // 请求接口获取表单数据
      this.tableLoad(true)
    },

    // 表格每页条数改变处理
    sizeChange(num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange(num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 点击表格发放按钮处理
    invoiceSend() {
      this.dialogInit('grant')
    },

    // 弹框显示初始化
    dialogInit(type) {
      this.type = type
      switch (type) {
        case 'entering':
          this.dialogTitle = '录入发票'
          break
        case 'custom':
          this.dialogTitle = '自定义发放'
          break
        case 'grant':
          this.dialogTitle = '发票发放'
          break
      }
      this.showDialog = true
    },

    // 数据提交处理
    confirm() {}
  }
}
