// 导入打印 js 文件
import myPrint from '@/assets/common/js/LodopNew.js'
import workIcon from '@/components/common/workIcon.vue'
import receiptCloumns from '../json/receipt-cloumns.json'

export default {
  name: 'receipt',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        getelectronic: this.$api.state.Setting.getelectronic.url,
        receiptlist: this.$api.state.Setting.receiptlist.url,
        receiptprint: this.$api.state.Setting.receiptprint.url,
        receiptcancel: this.$api.state.Setting.receiptcancel.url,
        paymentList: this.$api.state.Setting.paymentList.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 搜索框绑定值
      searchVal: '',
      // 收据表格数据
      tableData: [],
      // 收据表格列数据配置
      columns: receiptCloumns.list,
      // 收据表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 票据状态
      statusVal: '',
      statusOptions: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '已作废',
          value: 2
        },
        {
          label: '已换票',
          value: 3
        }
      ],
      // 收款方式
      paymentVal: '',
      paymentOptions: [],
      // 开票人员
      userVal: '',
      userOptions: [],
      // 时间范围
      dateVal: []
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
    this.getPayments()
    this.getUserList()
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
      // 请求接口获取表单数据
      this.tableLoad()
    },

    // 获取支付方式
    getPayments () {
      this.$axios
        .post(this.urlObj.paymentList)
        .then(res => {
          if (res.Code === 200) {
            this.paymentOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取支付方式数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取开票人员列表
    getUserList () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.getelectronic, data)
        .then(res => {
          if (res.Code === 200) {
            this.userOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取开票人员数据失败！'
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
        keywords: this.searchVal,
        vid: this.choseVillageInfo.vid,
        status: this.statusVal,
        pay_type: this.paymentVal,
        create_uid: this.userVal,
        starttime: this.dateVal[0] ? this.dateVal[0] / 1000 : '',
        endtime: this.dateVal[1] ? this.dateVal[1] / 1000 : ''
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.receiptlist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.vname = item.village ? item.village.villagename : '--'
                item.oname = item.sn.owner ? item.sn.owner.realname : '--'
                item.roomname = item.sn.roomnum ? item.sn.roomnum : '--'
                item.payname = item.sn.payment ? item.sn.payment.name : '--'
                item.remark = item.sn.remark ? item.sn.remark : '--'
                item.money = item.sn.money ? item.sn.money : '--'
                item.cname = item.creater ? item.creater.realname : '--'
                item.pay_time = item.sn.pay_time ? item.sn.pay_time : '--'
                // 是否显示打印按钮
                item.dyhide = item.status != 2 ? false : true
                // 是否显示作废按钮
                item.zfhide = item.status == 1 ? false : true
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

    // 打印票据
    receiptPrint (index) {
      let data = {
        id: this.tableData[index].id
      }
      // 获取打印数据
      this.$axios
        .post(this.urlObj.receiptprint, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.id = data.id
            // 开始打印
            myPrint.startLodop(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取打印数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 作废票据
    receiptCancel (index) {
      this.$confirm('确定要作废当前票据吗?', '提示', {
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
                  message: '票据作废成功！'
                })
                // 获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '票据作废失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    }
  }
}
