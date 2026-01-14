import workIcon from '@/components/common/workIcon.vue'
import accountsCloumns from '../json/accounts-cloumns.json'
import accountOrder from '../json/account-order.json'
import accountBill from '../json/account-bill.json'

export default {
  name: 'accounts',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        villages: this.$api.state.System.village.list.url,
        manageList: this.$api.state.Setting.manageList.url,
        accountAudit: this.$api.state.Setting.accountAudit.url,
        orderDetail: this.$api.state.Setting.orderDetail.url,
        recordInfoList: this.$api.state.Setting.recordInfoList.url,
        revAccount: this.$api.state.Setting.revAccount.url,
        accountApprove: this.$api.state.Setting.accountApprove.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 日期选择绑定值
      dateVal: '',
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: accountsCloumns.list,
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
      // 交账订单明细表格数据
      orderTableData: [],
      // 交账订单明细表格列数据配置
      orderColumns: accountOrder.list,
      // 交账订单明细表格配置
      orderConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 记录明细合计金额
      totalMoney: '0.00',
      // 账单详情表格数据
      billTableData: [],
      // 账单详情表格列数据配置
      billColumns: accountBill.list,
      // 账单详情表格配置
      billConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示交账订单明细弹框
      showOrderDialog: false,
      // 是否显示账单详情弹框
      showBillDialog: false,
      // 是否显示打印内容
      showPrint: false,
      // 是否显示审批记录弹框
      showAuditDialog: false,
      // 审批列表数据
      auditList: {},
      // 当前操作的数据在表格中的 index
      currentIndex: '',
    }
  },

  watch: {
    currentIndex (val) {
      let trs = document.querySelectorAll('.main-wp > .table-wp > #CusTable .el-table .el-table__body-wrapper tbody tr')
      let tds = trs[val].querySelectorAll('td')
      trs.forEach(item => {
        let tds = item.querySelectorAll('td')
        tds.forEach(itm => {
          itm.style.backgroundColor = '#fff'
        })
      })
      tds.forEach(item => {
        item.style.cssText = 'background-color: #cceeff !important'
      })
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
      // 请求接口获取表单数据
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
      this.tableLoad()
    },

    // 交账首页表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid
      }
      if (this.dateVal && this.dateVal[0] && this.dateVal[1]) {
        data.time = [this.dateVal[0] / 1000, this.dateVal[1] / 1000]
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.manageList, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.uname = item.user.realname
                item.vname = item.village.villagename
                // 是否有区域权限
                let areaAuth = this.$menu.getters.judgeRole(
                  'Btn-p5EpzeVjdFb57MYDxHmlLra7'
                )
                // 是否有总部权限
                let headAuth = this.$menu.getters.judgeRole(
                  'Btn-7SEpzeVju7fftMYDxHmlLrab'
                )
                if (areaAuth && headAuth && item.is_check_exist) {
                  if (item.status === 0 && !item.is_check) {
                    item.sphide = false
                  } else if (item.status === 1) {
                    item.sphide = false
                  } else if (item.status === 11) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else if (areaAuth && item.is_check_exist) {
                  if (item.status === 0 && !item.is_check) {
                    item.sphide = false
                  } else if (item.status === 11) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else if (areaAuth && headAuth) {
                  if (item.status === 11) {
                    item.sphide = false
                  } else if (item.status === 1) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else if (headAuth && item.is_check_exist) {
                  if (item.status === 0 && !item.is_check) {
                    item.sphide = false
                  } else if (item.status == 1) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else if (areaAuth) {
                  if (item.status === 11) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else if (item.is_check_exist) {
                  if (item.status === 0 && !item.is_check) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else if (headAuth) {
                  if (item.status === 1) {
                    item.sphide = false
                  } else {
                    item.sphide = true
                  }
                } else {
                  item.sphide = true
                }
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

    // 表格选择更改处理
    selectionChange (arr) {
      this.tableSelected = arr
    },

    // 点击批量审核处理
    batchAudit () {
      if (this.tableSelected.every(item => !item.sphide)) {
        this.$confirm('此操作将对账单审核进行批量处理，点击按钮继续', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '批量通过',
          cancelButtonText: '批量驳回',
          type: 'warning'
        })
          .then(() => {
            this.batchAuditRequest(1)
          })
          .catch(action => {
            if (action == 'cancel') {
              this.batchAuditRequest(2)
            }
          })
      } else {
        this.$message({
          message: '存在不能审核的账单，请重新选择！',
          type: 'warning'
        })
      }
    },

    // 交账订单明细表格数据
    orderTableLoad (index) {
      // 表格处于加载状态
      this.orderConf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        id: this.tableData[index].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.orderDetail, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              let total = 0
              res.Data.forEach(item => {
                item.cname = item.snOrder ? item.snOrder.realname : ''
                item.code = item.snOrder
                  ? item.snOrder.fphm && item.snOrder.receipt
                    ? item.snOrder.fphm + '/' + item.snOrder.receipt
                    : item.snOrder.fphm
                      ? item.snOrder.fphm
                      : item.snOrder.receipt
                        ? item.snOrder.receipt
                        : ''
                  : ''

                item.roomnum = item.snOrder ? item.snOrder.roomnum : ''
                item.ssmoney = item.snOrder ? item.snOrder.money : ''
                item.type_text = item.snOrder ? item.snOrder.payment.name : ''
                item.vname = item.village.villagename
                item.description = item.snOrder ? item.snOrder.remark : ''
                item.pay_time = item.snOrder ? item.snOrder.pay_time : ''
                total = _.add(Number(total), Number(item.ssmoney))
              })
              this.totalMoney = _.round(total, 2)
            }
            this.auditList = res.checkData
            // 存放查询数据
            this.orderTableData = res.Data
            // 关闭加载状态
            this.orderConf.loadStatus = false
            // 清空空数据提示
            this.orderConf.emptyText = ''
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
            this.orderTableData = []
            this.orderConf.emptyText = res.Message
            this.orderConf.dataTotal = 0
            this.orderConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.orderTableData = []
          this.orderConf.emptyText = '服务器连接失败...'
          this.orderConf.dataTotal = 0
          this.orderConf.loadStatus = false
        })
    },

    // 账单详情表格数据
    billTableLoad (index) {
      // 表格处于加载状态
      this.billConf.loadStatus = true
      let data = {
        id: this.tableData[index].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.recordInfoList, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.billTableData = res.Data
            // 关闭加载状态
            this.billConf.loadStatus = false
            // 清空空数据提示
            this.billConf.emptyText = ''
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
            this.billTableData = []
            this.billConf.emptyText = res.Message
            this.billConf.dataTotal = 0
            this.billConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.billTableData = []
          this.billConf.emptyText = '服务器连接失败...'
          this.billConf.dataTotal = 0
          this.billConf.loadStatus = false
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

    // 订单详情
    orderDetail (index) {
      this.currentIndex = index
      this.totalMoney = '0.00'
      this.orderTableData = []
      this.orderConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.showOrderDialog = true
      this.orderTableLoad(index)
    },

    // 账单详情
    billDetail (index) {
      this.currentIndex = index
      this.billTableData = []
      this.billConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.showBillDialog = true
      this.billTableLoad(index)
    },

    // 账单详情 提取合计字段
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        let feilds = this.billTableData.total ? this.billTableData.total.map(item => item.prop) : []
        if (feilds.includes(column.property)) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return _.round(_.add(Number(prev), Number(curr)), 2).toFixed(2)
              } else {
                return prev;
              }
            }, 0);
            sums[index];
          } else {
            sums[index] = '';
          }
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    // 点击表格通过按钮处理
    accountPass (index) {
      this.currentIndex = index
      this.$confirm('确定要通过当前申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.auditRequest(index, 1)
        })
        .catch(() => { })
    },

    // 点击表格驳回处理
    accountReject (index) {
      this.currentIndex = index
      this.$confirm('确定要驳回当前申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.auditRequest(index, 2)
        })
        .catch(() => { })
    },

    // 审核通过/驳回
    auditRequest (index, type) {
      let obj = this.tableData[index]
      let data = {
        id: obj.id,
        type: type,
        label: obj.status === 0 ? 3 : obj.status === 1 ? 2 : obj.status === 11 ? 1 : ''
      }
      this.$axios
        .post(this.urlObj.accountApprove, data)
        .then(res => {
          if (res.Code === 200) {
            let msg = ''
            if (this.tableData[index].status === 0) {
              msg = type === 1 ? '项目经理已通过！' : '项目经理已驳回！'
            } else if (this.tableData[index].status === 1) {
              msg = type === 1 ? '总部已通过！' : '总部已驳回！'
            } else if (this.tableData[index].status === 11) {
              msg = type === 1 ? '区域已通过！' : '区域已驳回！'
            }
            this.$message({
              message: msg,
              type: 'success'
            })
            // 重新获取一次表格数据
            this.tableLoad()
          } else {
            let msg = ''
            if (this.tableData[index].status === 0) {
              msg = type === 1 ? '项目经理通过失败！' : '项目经理驳回失败！'
            } else if (this.tableData[index].status === 1) {
              msg = type === 1 ? '总部通过失败！' : '总部驳回失败！'
            } else if (this.tableData[index].status === 11) {
              msg = type === 1 ? '区域通过失败！' : '区域驳回失败！'
            }
            this.$message({
              message: res.Message ? res.Message : msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 批量审核通过/驳回
    batchAuditRequest (type) {
      let data = {
        is_batch: true,
        batch: this.tableSelected.map(item => {
          return {
            id: item.id,
            type: type,
            label: item.status === 0 ? 3 : item.status === 1 ? 2 : item.status === 11 ? 1 : ''
          }
        })
      }
      this.$axios
        .post(this.urlObj.accountApprove, data)
        .then(res => {
          if (res.Code === 200) {
            let msg = type === 1 ? '批量审核已通过！' : '批量审核已驳回！'
            this.$message({
              message: msg,
              type: 'success'
            })
            // 重新获取一次表格数据
            this.tableLoad()
          } else {
            let msg = type === 1 ? '批量审核通过失败！' : '批量审核驳回失败！'
            this.$message({
              message: res.Message ? res.Message : msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 打印处理
    printHandle () {
      this.showPrint = true;
      setTimeout(() => {
        this.showPrint = false;
      }, 500)
    },

    // 筛选 复选框改变处理
    checkChange () {
      let arr = JSON.parse(JSON.stringify(this.columns))
      this.columns = arr
    },
  }
}
