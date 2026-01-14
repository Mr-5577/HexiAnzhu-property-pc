import workIcon from '@/components/common/workIcon.vue'
import billClounms from '../json/bill-clounms.json'
import billDetail from '../json/bill-detail.json'
import billRecord from '../json/bill-record.json'
import billSearch from '../json/bill-search.json'
import recordInfo from '../json/record-info.json'
import { getLodop } from '@/assets/common/js/LodopFuncs.js'

export default {
  name: 'billPay',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        cancellist: this.$api.state.Charge.cancellist.url,
        getfacevalue: this.$api.state.Charge.getfacevalue.url,
        cancelsection: this.$api.state.Charge.cancelsection.url,
        cancellog: this.$api.state.Charge.cancellog.url,
        batchCancel: this.$api.state.Charge.batchCancel.url,
        removecancel: this.$api.state.Charge.removecancel.url,
        cancelcountlog: this.$api.state.Charge.cancelcountlog.url,
        searchcancel: this.$api.state.Charge.searchcancel.url,
        addcancelcount: this.$api.state.Charge.addcancelcount.url,
        removecount: this.$api.state.Charge.removecount.url,
        cancelcountinfo: this.$api.state.Charge.cancelcountinfo.url
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
      columns: billClounms.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 状态
      statusVal: '',
      statusOptions: [
        {
          value: 1,
          label: '未缴销'
        },
        {
          value: 2,
          label: '缴销中'
        },
        {
          value: 3,
          label: '已缴销'
        }
      ],
      // 面值
      faceVal: '',
      faceOptions: [],
      // 日期选择框绑定值
      dateValue: [],
      // 表格当前选择的数据列表
      tableSelected: [],
      // 当前操作的表格数据的index
      currentIndex: 0,
      // 是否是批量收款操作
      isBatch: false,
      // 是否显示缴销弹框
      showBfjxDialog: false,
      // 部分缴销弹框的缴销单号
      cancellationOdd: '',
      // 是否正在提交数据
      isCommit: false,
      // 是否显示明细弹框
      showDetailDialog: false,
      // 弹框表格数据
      popTableData: [],
      // 弹框配置
      popColumns: billDetail.list,
      // 弹框表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示缴销记录弹框
      showRecordDialog: false,
      // 缴销记录表格数据
      recordTableData: [],
      // 缴销记录表格
      recordColumns: billRecord.list,
      // 缴销记录表格配置
      recordConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 日期筛选框绑定值
      dateFilter: [],
      // 当前查询时的日期范围
      searchDate: { stime: '', etime: '' },
      // 是否显示查询结果表格
      showSearchTable: false,
      // 记录搜索表格数据
      searchTableData: [],
      // 记录搜索配置
      searchColumns: billSearch.list,
      // 记录搜索表格配置
      searchConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示记录明细弹框
      showInfoDialog: false,
      // 记录明细表格数据
      rcdInfoData: [],
      // 记录明细配置
      rcdInfoColumns: recordInfo.list,
      // 记录明细表格配置
      rcdInfoConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 记录明细合计金额
      totalMoney: '0.00'
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
    // 获取面值数据
    this.getFaceValue()
    // 获取表格数据
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
      this.statusVal = ''
      this.faceVal = ''
      this.dateValue = []
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.tableLoad()
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

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        keywords: this.searchVal,
        vid: this.choseVillageInfo.vid,
        face_value: this.faceVal
      }
      if (this.statusVal) {
        data.c_status = this.statusVal
      }
      if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        data.time = {
          stime: this.dateValue[0] / 1000,
          etime: this.dateValue[1] / 1000
        }
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.cancellist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.vname = item.village.villagename
                if (item.status == 2 || item.status == 3) {
                  item.bfdisabled = true
                  item.jxdisabled = true
                } else if (item.status == 1 && Number(item.stock_num) > 0) {
                  item.bfdisabled = false
                  item.jxdisabled = false
                } else {
                  item.bfdisabled = true
                  item.jxdisabled = false
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

    // 表格切换处理
    tableChange () {
      this.conf.curPage = 1
      this.tableLoad()
    },

    // 表格选择处理
    selectionChange (value) {
      this.tableSelected = value
    },

    // 显示部分缴销弹框
    bfcancellation (index) {
      this.currentIndex = index
      this.cancellationOdd = ''
      this.showBfjxDialog = true
    },

    // 部分缴销确认处理
    bfjxConfirm () {
      if (this.cancellationOdd) {
        this.isCommit = true
        let data = {
          id: this.tableData[this.currentIndex].id,
          use_number: this.cancellationOdd
        }
        // 部分缴销请求
        this.$axios
          .post(this.urlObj.cancelsection, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                message: '部分缴销成功！',
                type: 'success'
              })
              // 关闭弹框并重新获取表格数据
              this.showBfjxDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '部分缴销失败！'
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
      } else {
        this.$message({
          type: 'warning',
          message: '请输入缴销单号！'
        })
      }
    },

    // 查看明细
    showDetail (index) {
      this.currentIndex = index
      this.showDetailDialog = true
      this.popTableLoad()
    },

    // 全部缴销
    cancellation (index) {
      this.$confirm('确定要缴销整本发票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            ids: [this.tableData[index].id]
          }
          this.cancelRequest(data)
        })
        .catch(() => { })
    },

    // 批量全部缴销
    batchCancellation () {
      this.$confirm('确定要缴销当前选择的发票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            ids: this.tableSelected.map(item => item.id)
          }
          this.cancelRequest(data)
        })
        .catch(() => { })
    },

    // 缴销请求
    cancelRequest (data) {
      this.$axios
        .post(this.urlObj.batchCancel, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '缴销成功！',
              type: 'success'
            })
            // 重新获取表格数据
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '缴销失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取表格数据
    popTableLoad () {
      // 表格处于加载状态
      this.popConf.loadStatus = true
      let data = {
        page: this.popConf.curPage,
        limit: this.popConf.limit,
        id: this.tableData[this.currentIndex].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.cancellog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cxname = item.creater.realname
              })
            }
            // 设置查询总数
            this.popConf.dataTotal = res.Data.total
            // 存放查询数据
            this.popTableData = res.Data.data
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

    // 表格每页条数改变处理
    popSizeChange (num) {
      this.popConf.limit = num
      // 获取一次表格数据
      this.popTableLoad()
    },

    // 当前页码改变处理
    popCurrentChange (num) {
      this.popConf.curPage = num
      // 获取一次表格数据
      this.popTableLoad()
    },

    // 撤回处理
    revocation (index) {
      this.$confirm('确定要撤回当前缴销明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.popTableData[index].id
          }
          this.$axios
            .post(this.urlObj.removecancel, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '缴销明细撤回成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.popTableLoad()
              } else {
                let msg = res.Message ? res.Message : '缴销明细撤回失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 点击缴销记录按钮处理
    viewRecord () {
      this.dateFilter = []
      this.showSearchTable = false
      this.showRecordDialog = true
      this.recordTableLoad()
    },

    // 搜索表格
    searchTable () {
      if (this.dateFilter && this.dateFilter[0] && this.dateFilter[1]) {
        this.searchDate.stime = this.dateFilter[0] / 1000
        this.searchDate.etime = this.dateFilter[1] / 1000
        this.showSearchTable = true
        this.searchTableLoad()
      } else {
        this.$message({
          type: 'warning',
          message: '请选择时间范围！'
        })
      }
    },

    // 点击提交按钮处理
    addRecord () {
      if (this.searchTableData.length > 0) {
        let data = {
          vid: this.choseVillageInfo.vid,
          time: this.searchDate
        }
        this.$axios
          .post(this.urlObj.addcancelcount, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                message: '提交成功！',
                type: 'success'
              })
              this.showSearchTable = false
              // 重新获取表格数据
              this.recordTableLoad()
            } else {
              let msg = res.Message ? res.Message : '提交失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          .catch(() => { })
      } else {
        this.showSearchTable = false
        this.recordTableLoad()
      }
    },

    // 获取缴销记录表格数据
    recordTableLoad () {
      // 表格处于加载状态
      this.recordConf.loadStatus = true
      let data = {
        page: this.recordConf.curPage,
        limit: this.recordConf.limit
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.cancelcountlog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cname = item.creater.realname
              })
            }
            // 设置查询总数
            this.recordConf.dataTotal = res.Data.total
            // 存放查询数据
            this.recordTableData = res.Data.data
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

    // 表格每页条数改变处理
    recordSizeChange (num) {
      this.recordConf.limit = num
      // 获取一次表格数据
      this.recordTableLoad()
    },

    // 当前页码改变处理
    recordCurrentChange (num) {
      this.recordConf.curPage = num
      // 获取一次表格数据
      this.recordTableLoad()
    },

    // 获取查询表格数据
    searchTableLoad () {
      // 表格处于加载状态
      this.searchConf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        time: {
          stime: this.dateFilter[0] / 1000,
          etime: this.dateFilter[1] / 1000
        }
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.searchcancel, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.vname = item.village.villagename
              })
            }
            // 存放查询数据
            this.searchTableData = res.Data
            // 关闭加载状态
            this.searchConf.loadStatus = false
            // 清空空数据提示
            this.searchConf.emptyText = ''
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
            this.searchTableData = []
            this.searchConf.emptyText = res.Message
            this.searchConf.dataTotal = 0
            this.searchConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.searchTableData = []
          this.searchConf.emptyText = '服务器连接失败...'
          this.searchConf.dataTotal = 0
          this.searchConf.loadStatus = false
        })
    },

    // 查看缴销记录详情
    recordInfo (index) {
      this.showInfoDialog = true
      // 表格处于加载状态
      this.rcdInfoConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.cancelcountinfo, {
          id: this.recordTableData[index].id
        })
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              let total = 0
              res.Data.forEach(item => {
                item.vname = item.village.villagename
                total = _.add(Number(total), Number(item.total_money))
              })
              this.totalMoney = _.round(total, 2)
            }
            // 存放查询数据
            this.rcdInfoData = res.Data
            // 关闭加载状态
            this.rcdInfoConf.loadStatus = false
            // 清空空数据提示
            this.rcdInfoConf.emptyText = ''
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
            this.rcdInfoData = []
            this.rcdInfoConf.emptyText = res.Message
            this.rcdInfoConf.dataTotal = 0
            this.rcdInfoConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.rcdInfoData = []
          this.rcdInfoConf.emptyText = '服务器连接失败...'
          this.rcdInfoConf.dataTotal = 0
          this.rcdInfoConf.loadStatus = false
        })
    },

    // 撤回缴销记录
    recordDevocation (index) {
      this.$confirm('确定要撤回当前缴销记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.recordTableData[index].id
          }
          this.$axios
            .post(this.urlObj.removecount, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '缴销记录撤回成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.recordTableLoad()
              } else {
                let msg = res.Message ? res.Message : '缴销记录撤回失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 缴销打印
    recordPrint (index) {
      let obj = this.recordTableData[index]
      this.$axios.post(this.urlObj.cancelcountinfo, { id: obj.id }).then(res => {
        if (res.Code === 200) {
          let trs = ''
          res.Data.forEach(item => {
            trs = trs + `<tr><td>${item.first}</td><td>${item.last}</td><td>${item.face_value}</td><td>${item.num}</td>
            <td>${item.total_money}</td><td>${item.village.villagename}</td><td>${item.create_time}</td></tr>`
          })
          let LODOP = getLodop();
          let strBodyStyle = "<style>" +
            "table{width: 700px;border: 1px solid #aaa; border-collapse:collapse;};" +
            "th{text-align: center;border: 1px solid #aaa!important;font-size: 29px;line-height:60px;height: 60px;}" +
            "td{text-align: center;height: 30px;border: 1px solid #aaa;font-size: 14px;}" +
            "</style>";
          let strFormHtml = strBodyStyle +
            '<div style="width: 700px;text-align: center;height: 30px;line-height: 30px;font-size: 18px;"><strong>' + this.choseVillageInfo.name + '&nbsp;&nbsp;交存明细</strong></div>' +
            '<div style="width: 700px;text-align: right;height: 40px;line-height: 40px;font-size: 13px;"><span>起止时间:' + obj.stime + ' 至 ' + obj.etime + '</span></div>' +
            '<table border="0" cellpadding="0" cellspacing="0" class="table table-striped table-bordered table-hover "  >' +
            `<tr>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">首张单号</th>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">末张单号</th>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">面值</th>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">数量</th>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">金额</th>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">项目</th>
              <th style="text-align: center;border: 1px solid #aaa!important;font-size: 14px;line-height:30px;height: 30px;">操作时间</th>
            </tr>` +
            trs +
            '</table>' +
            '<div style="width: 700px;text-align: left;height: 30px;line-height: 30px;font-size: 14px;">' +
            '<strong>交存人:&nbsp;&nbsp;&nbsp;</strong><span>' + obj.creater.realname + '</span>' +
            '<strong style="margin-left: 58%">时间:</strong>' + obj.create_time +
            '</div>';
          /* LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_样式风格");*/
          LODOP.ADD_PRINT_TEXT();
          LODOP.SET_PRINT_PAGESIZE(3, "", "", 'A4');
          LODOP.ADD_PRINT_HTM(30, 30, 5, 30, strFormHtml);
          LODOP.PREVIEW();
        } else {
          let msg = res.Message ? res.Message : '订单列表数据获取失败！'
          $message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    /* 导出EXCEL */
    exportExcel () {
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        keywords: this.searchVal,
        vid: this.choseVillageInfo.vid,
        face_value: this.faceVal,
        is_excel: 1
      }
      if (this.statusVal) {
        data.c_status = this.statusVal
      }
      if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        data.time = {
          stime: this.dateValue[0] / 1000,
          etime: this.dateValue[1] / 1000
        }
      }
      this.$axios.post(this.urlObj.cancellist, data).then(res => {
        if (res.Code === 200) {
          let arr = res.Data && res.Data.length > 0 ? res.Data : []
          this.exportDataHandle(arr)
        } else {
          let msg = res.Message ? res.Message : '订单列表数据获取失败！'
          $message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    // 导出数据处理
    exportDataHandle (result) {
      try {
        require.ensure([], () => {
          // 引入excel.js
          let {
            export_json_to_excel
          } = require('@/assets/common/excel/Export2Excel')

          let header = [
            '首张单号',
            '末张单号',
            '使用单号',
            '面值',
            '数量',
            '剩余数量',
            '金额',
            '状态',
            '领用项目'
          ]

          // 整理需要导出的数据
          let datas = []
          result.forEach(item => {
            let arr = [
              item.first,
              item.last,
              item.use_number,
              item.face_value,
              item.num,
              item.stock_num,
              item.count_money,
              item.status_text,
              item.village.villagename
            ]
            datas.push(arr)
          })

          // 执行导出操作
          export_json_to_excel(header, datas, '定额发票缴销表')
        })

        this.$notify({
          type: 'success',
          title: '温馨提示',
          message: '导出报表成功',
          duration: 1500
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    }
  }
}
