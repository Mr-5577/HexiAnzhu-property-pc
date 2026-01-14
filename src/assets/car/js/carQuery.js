import carQuery from '../json/car-query.json'
import payRecord from '../json/pay-record.json'
import postRecord from '../json/post-record.json'

export default {
  name: 'carQuery',
  data() {
    return {
      urlObj: {
        searchCarInfo: this.$api.state.Car.searchCarInfo.url,
        carpaylog: this.$api.state.Car.carpaylog.url,
        carpassinglog: this.$api.state.Car.carpassinglog.url,
        issueCar: this.$api.state.Means.issueCar.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: carQuery.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 缴费记录表格数据
      payTableData: [],
      // 缴费记录表格列数据配置
      payColumns: payRecord.list,
      // 缴费记录表格配置
      payConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前操作的表格数据的 index
      currentIndex: 0,
      // 过车记录表格数据
      postTableData: [],
      // 过车记录表格列数据配置
      postColumns: postRecord.list,
      // 过车记录表格配置
      postConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示缴费记录弹框
      showPayDialog: false,
      // 是否显示过车记录弹框
      showPostDialog: false,
      // 当前操作车辆名称
      carName: ''
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
  },

  /**
   * 方法
   */
  methods: {
    // 筛选选择项目
    filterVillage(choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
    },

    // 获取表格数据
    tableLoad() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        plates: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.searchCarInfo, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.tableData = res.Data ? res.Data : []
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

    // 缴费记录表格数据
    payTableLoad() {
      // 表格处于加载状态
      this.payConf.loadStatus = true
      let data = {
        id: this.tableData[this.currentIndex].id,
        type: this.tableData[this.currentIndex].car_type
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carpaylog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.start_time = item.previewCostRepair.stime
                item.end_time = item.previewCostRepair.etime
                item.payment = item.paymentType.name
              })
            }
            // 存放查询数据
            this.payTableData = res.Data
            // 关闭加载状态
            this.payConf.loadStatus = false
            // 清空空数据提示
            this.payConf.emptyText = ''
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
            this.payTableData = []
            this.payConf.emptyText = res.Message
            this.payConf.dataTotal = 0
            this.payConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.payTableData = []
          this.payConf.emptyText = '服务器连接失败...'
          this.payConf.dataTotal = 0
          this.payConf.loadStatus = false
        })
    },

    // 过车记录表格数据
    postTableLoad() {
      // 表格处于加载状态
      this.postConf.loadStatus = true
      let data = {
        page: this.postConf.curPage,
        limit: this.postConf.limit,
        plates: this.tableData[this.currentIndex].plates,
        id: this.tableData[this.currentIndex].id,
        type: this.tableData[this.currentIndex].car_type
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carpassinglog, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.postConf.dataTotal = res.Data ? res.Data.total : 0
            // 存放查询数据
            this.postTableData = res.Data ? res.Data.list : []
            // 关闭加载状态
            this.postConf.loadStatus = false
            // 清空空数据提示
            this.postConf.emptyText = ''
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
            this.postTableData = []
            this.postConf.emptyText = res.Message
            this.postConf.dataTotal = 0
            this.postConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.postTableData = []
          this.postConf.emptyText = '服务器连接失败...'
          this.postConf.dataTotal = 0
          this.postConf.loadStatus = false
        })
    },

    // 点击查询处理
    keySearch() {
      if (this.searchVal.trim()) {
        // 请求接口获取表单数据
        this.tableLoad()
      }
    },

    // // 表格每页条数改变处理
    // sizeChange(num) {
    //   this.conf.limit = num
    //   // 获取一次表格数据
    //   this.tableLoad()
    // },

    // // 缴费记录表格每页条数改变处理
    // paySizeChange(num) {
    //   this.payConf.limit = num
    //   // 获取一次表格数据
    //   this.payTableLoad()
    // },

    // 过车记录表格每页条数改变处理
    postSizeChange(num) {
      this.postConf.limit = num
      // 获取一次表格数据
      this.postTableLoad()
    },

    // // 当前页码改变处理
    // currentChange(num) {
    //   this.conf.curPage = num
    //   // 获取一次表格数据
    //   this.tableLoad()
    // },

    // // 缴费记录当前页码改变处理
    // payCurrentChange(num) {
    //   this.payConf.curPage = num
    //   // 获取一次表格数据
    //   this.payTableLoad()
    // },

    // 过车记录当前页码改变处理
    postCurrentChange(num) {
      this.postConf.curPage = num
      // 获取一次表格数据
      this.postTableLoad()
    },

    // 重新下发
    issueAgain(index) {
      this.$confirm('此操作将重新下发当前车辆，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 下发确认请求
          let data = {
            id: this.tableData[index].id,
            type: this.tableData[index].car_type
          }
          this.$axios
            .post(this.urlObj.issueCar, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '车辆下发成功！',
                  type: 'success'
                })
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '车辆下发失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => {})
    },

    // 查看缴费记录
    paymentRecords(index) {
      this.currentIndex = index
      this.showPayDialog = true
      this.payTableLoad()
    },

    // 查看过车记录弹框
    postRecords(index) {
      this.currentIndex = index
      this.showPostDialog = true
      this.postTableLoad()
    }
  }
}
