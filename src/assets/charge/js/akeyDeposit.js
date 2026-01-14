// 一键划账表格列数据
import remitAccountCloumns from '../json/remit-account-cloumns.json'

export default {
  name: 'akeyDeposit',
  data () {
    return {
      urlObj: {
        villageend: this.$api.state.Charge.villageend.url,
        transferarrears: this.$api.state.Charge.transferarrears.url,
        batchbalancepaycost: this.$api.state.Charge.batchbalancepaycost.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 科目下拉框绑定值
      subjectVal: '',
      // 科目数据列表
      subOptions: [],
      // 预存款状态
      statusVal: '',
      // 日期选择框绑定值
      dateValue: [],
      // 搜索框绑定值
      searchVal: '',
      // 是否分页
      ispaging: false,
      // 划账弹框表格数据
      tableData: [],
      // 划账弹框表格列数据配置
      columns: remitAccountCloumns.list,
      // 划账弹框表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前表格选中值列表
      tableSelected: [],
      // 是否正在进行划账
      isCommit: false
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
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.getSubjectList()
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
      this.subjectVal = ''
      this.subOptions = []
      this.dateValue = []
      // 请求接口获取表单数据
      this.keySearch()
      this.getSubjectList()
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

    // 表格数据加载
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.vid,
        keywords: this.searchVal.trim(),
        subject_id: this.subjectVal,
        balance_money: this.statusVal,
        stime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        etime:
          this.dateValue && this.dateValue[1] ? this.dateValue[1] / 1000 : '',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.transferarrears, data)
        .then(res => {
          if (res.Code === 200) {
            if (this.statusVal) {
              if (res.Data && res.Data.length > 0) {
                res.Data.forEach(item => {
                  item.select_text = item.select == 1 ? '是' : '否'
                })
              }
              this.ispaging = false
              // 存放查询数据
              this.tableData = res.Data
            } else {
              if (res.Data.data && res.Data.data.length > 0) {
                res.Data.data.forEach(item => {
                  item.select_text = item.select == 1 ? '是' : '否'
                })
              }
              this.ispaging = true
              // 设置查询总数
              this.conf.dataTotal = res.Data.total
              // 存放查询数据
              this.tableData = res.Data.data
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
    selectionChange (value) {
      this.tableSelected = value
    },

    // 点击一键划账处理
    remitAccount () {
      let flag = false
      this.tableSelected.forEach(item => {
        if (item.select == 0) {
          flag = true
          return
        }
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '存在预存款不充足的资源，请重新选择！'
        })
      } else {
        this.$confirm('确定要对当前选择数据进行划账吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.isCommit = true
            let arr = []
            this.tableSelected.forEach(item => {
              let obj = {
                cost_ids: item.cost_ids,
                owner_id: item.owner_id,
              }
              arr.push(obj)
            })
            let data = {
              vid: this.vid,
              data: arr
            }
            this.$axios
              .post(this.urlObj.batchbalancepaycost, data)
              .then(res => {
                if (res.Code === 200) {
                  if (res.Data.error_num > 0) {
                    this.$message({
                      message: `划账成功条数：${res.Data.success_num}；划账失败条数：${res.Data.error_num}；错误信息：【${res.Data.error_msg.join(';')}】`,
                      type: 'error'
                    })
                  } else {
                    this.$message({
                      message: `批量划账成功！划账成功条数：${res.Data.success_num}；划账失败条数：${res.Data.error_num}；`,
                      type: 'success'
                    })
                    // 重新获取表格数据
                    this.tableLoad()
                  }
                } else {
                  let msg = res.Message ? res.Message : '批量划账失败！'
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
          })
          .catch(() => { })
      }
    }
  }
}
