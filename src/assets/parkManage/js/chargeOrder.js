import corder from '../json/charge-order.json'

export default {
  name: 'chargeOrder',
  data () {
    return {
      urlObj: {
        carType: this.$api.state.Means.carType.url,
        resources: this.$api.state.ParkManage.resources.url,
        chargepiles: this.$api.state.ParkManage.chargepiles.url,
        addpile: this.$api.state.ParkManage.addpile.url,
        chargepilestatus: this.$api.state.ParkManage.chargepilestatus.url,
        allcars: this.$api.state.ParkManage.allcars.url,
        chargeOrders: this.$api.state.ParkManage.chargeOrders.url,
        devicelist: this.$api.state.ParkManage.devicelist.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: ''
      },
      // 支付类型
      typeVal: '',
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: corder.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 表格合计
      totalMoney: "0.00",
      // 实际金额
      discountMoney: '0.00',
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
            return this.endTime ? time.getTime() > new Date(this.endTime).getTime() : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.startTime ? time.getTime() < new Date(this.startTime).getTime() - 24 * 60 * 60 * 1000 : false
          }
        }
      }
    },
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

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        payType: this.typeVal,
        stime: this.startTime ? this.startTime : '',
        etime: this.endTime ? this.endTime : '',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.chargeOrders, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.lists.data.forEach(item => {
              item.vname = item.carTemporary ? item.carTemporary.name : ''
              item.pileName = item.chargePile ? item.chargePile.name : ''
            })
            this.totalMoney = res.Data.allmoney ? res.Data.allmoney : '0.00'
            this.discountMoney = res.Data.discountPrice ? res.Data.discountPrice : '0.00'
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

    /* 导出EXCEL */
    exportDetailExcel () {
      try {
        this.isExport = true;
        let data = {
          page: this.conf.curPage,
          limit: this.conf.limit,
          vid: this.choseVillageInfo.vid,
          payType: this.typeVal,
          stime: this.startTime ? this.startTime : '',
          etime: this.endTime ? this.endTime : '',
          is_excel: 1,
        }
        // 获取项目列表数据
        this.$axios
          .post(this.urlObj.chargeOrders, data)
          .then(res => {
            this.isExport = false
            if (res.Code === 200) {
              let tableName = '临停收费订单表'
              let headers = [
                '项目名称',
                '充电桩',
                '订单号',
                '订单金额',
                '公众号',
                '是否统计',
                '详细支付方式',
                '支付方式',
                '订单来源',
                '支付用途',
                '订单状态',
                '更新时间'
              ]

              // 整理需要导出的数据
              let datas = []
              res.Data.forEach(item => {
                let arr = [
                  item.carTemporary ? item.carTemporary.name : '',
                  item.chargePile ? item.chargePile.name : '',
                  item.orderNum,
                  item.payPrice,
                  item.ownerName,
                  item.is_count_text,
                  item.pay_way_text,
                  item.pay_type_text,
                  item.pay_entrance_text,
                  item.type_text,
                  item.status_text,
                  item.updateTime
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
