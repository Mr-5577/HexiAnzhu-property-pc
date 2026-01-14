import stopColumns from '../json/stop-columns.json'

export default {
  name: 'stopCharge',
  data () {
    return {
      urlObj: {
        orders: this.$api.state.ParkManage.orders.url,
        status: this.$api.state.ParkManage.status.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: ''
      },
      // 搜索框绑定值
      searchVal: '',
      // 订单状态
      statusVal: '',
      statusOptions: [],
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: stopColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 费用合计
      totalMoney: '0.00',
      // 是否正在导出数据
      isExport: false,
    }
  },

  // 计算属性
  computed: {
    // 开始时间限制
    spickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.endTime ? time.getTime() > this.endTime : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.startTime ? time.getTime() < this.startTime : false
          }
        }
      }
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
    this.getStatus()
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
      this.startTime = ''
      this.endTime = ''
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
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        money: this.searchVal,
        status: this.statusVal,
        stime: this.startTime ? this.startTime / 1000 : '',
        etime: this.endTime ? this.endTime / 1000 : '',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.orders, data)
        .then(res => {
          if (res.Code === 200) {
            this.totalMoney = _.round(Number(res.Data.money), 2).toFixed(2)
            res.Data.lists.data.forEach(item => {
              item.vname = item.village && item.village.villagename ? item.village.villagename : '--'
              item.cname = item.cars && item.cars.name ? item.cars.name : '--'
              item.gname = item.gate && item.gate.name ? item.gate.name : '--'
              if (item.gate.delete_time > 0) {
                item.gname = item.gname + '（闸机已删除）'
              }
            })
            // 设置查询总数
            this.conf.dataTotal = res.Data.lists.total
            // 存放查询数据
            this.tableData = res.Data.lists.data
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
    keySearch () {
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 请求接口获取表单数据
      this.tableLoad(true)
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

    // 获取订单状态数据
    getStatus () {
      this.$axios
        .post(this.urlObj.status)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            Object.keys(res.Data).forEach((key) => {
              arr.push({
                label: res.Data[key],
                value: key
              })
            })
            this.statusOptions = arr
          } else {
            let msg = res.Message ? res.Message : '订单状态数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    /* 导出EXCEL */
    exportDetailExcel () {
      try {
        this.isExport = true;
        let data = {
          page: this.conf.curPage,
          limit: this.conf.limit,
          vid: this.choseVillageInfo.vid,
          money: this.searchVal,
          status: this.statusVal,
          stime: this.startTime ? this.startTime / 1000 : '',
          etime: this.endTime ? this.endTime / 1000 : '',
          is_excel: 1,
        }
        // 获取项目列表数据
        this.$axios
          .post(this.urlObj.orders, data)
          .then(res => {
            this.isExport = false
            if (res.Code === 200) {
              let tableName = '临停收费订单表'
              let headers = [
                '项目名称',
                '车场名称',
                '交费入口',
                '交费金额',
                '订单号',
                '微信订单号',
                '客户openid',
                '交费时间',
                '订单状态',
              ]

              // 整理需要导出的数据
              let datas = []
              res.Data.forEach(item => {
                let arr = [
                  item.village ? item.village.villagename : '',
                  item.cars ? item.cars.name : '',
                  item.gate ? item.gate.name : '',
                  item.money,
                  item.order_no,
                  item.wechat_order_no,
                  item.openid,
                  item.pay_time,
                  item.status_text,
                ]
                datas.push(arr)
              })
              require.ensure([], () => {
                // 引入excel.js
                let {
                  export_json_to_excel
                } = require('@/assets/common/excel/Export2Excel')

                // 执行导出操作
                export_json_to_excel(headers, datas, tableName)
              })

              this.$notify({
                type: 'success',
                title: '温馨提示',
                message: '导出报表成功',
                duration: 1500
              })
            } else {
              let msg = res.Message ? res.Message : '订单数据获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
      } catch (e) {
        this.isExport = false
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    },
  }
}
