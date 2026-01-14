// 导入打印 js 文件
import myPrint from '@/assets/common/js/LodopNew.js'
import gatheringPrint from '../json/gathering-print.json'
import gatheringOrder from '../json/gathering-order.json'

export default {
  name: 'batchGathering',
  data () {
    return {
      urlObj: {
        subjectbytype: this.$api.state.Public.subjectbytype.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        searchUnit: this.$api.state.Public.searchUnit.url,
        resourcetypeid: this.$api.state.Assist.resourcetypeid.url,
        subjectarrears: this.$api.state.Assist.subjectarrears.url,
        haspayorder: this.$api.state.Assist.haspayorder.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        batchopenpaysn: this.$api.state.Assist.batchopenpaysn.url,
        issueReceipt: this.$api.state.Charge.issueReceipt.url,
        batchprint: this.$api.state.Assist.batchprint.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 缴费科目
      subjectVal: '',
      ymonth: '',  // 截止日期
      subOptions: [],
      // 打印收据还是生成订单
      typeVal: 2,
      typeOptions: [
        {
          label: '生成订单',
          value: 2
        },
        {
          label: '打印收据',
          value: 1
        }
      ],
      // 表格数据
      tableData: [],
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 楼栋
      buildVal: [],
      buildOptions: [],
      // 单元
      unitVal: [],
      unitOptions: [],
      // 表格当前选择的数据列表
      tableSelected: [],
      // 当前操作的表格数据的index
      currentIndex: 0,
      // 是否是批量收款操作
      isBatch: false,
      // 是否显示确认收款弹框
      showGatheringDialog: false,
      // 支付方式单选框绑定值
      radioVal: '',
      // 支付方式数据列表
      paymentList: [],
      // 支付时间绑定值
      dateVal: '',
      // 是否正在提交数据
      isCommit: false
    }
  },

  /**
   * 计算属性
   */
  computed: {
    // 表格列数据配置
    columns () {
      return this.typeVal == 1 ? gatheringPrint.list : gatheringOrder.list
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
    // 获取三表资源类型 id
    // this.getResourceId()
    // 获取科目列表数据
    this.getSubjectList()
    // 获取楼栋列表数据
    this.getBuildList()
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
      this.subjectVal = ''
      this.subOptions = []
      this.typeVal = 1
      this.ymonth = '';
      this.buildVal = []
      this.buildOptions = []
      this.unitVal = []
      this.unitOptions = []
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 获取三表资源类型 id
      // this.getResourceId()
      // 获取科目列表数据
      this.getSubjectList()
      // 获取楼栋列表数据
      this.getBuildList()
    },

    // 获取三表资源类型 id
    // getResourceId () {
    //   this.$axios
    //     .post(this.urlObj.resourcetypeid)
    //     .then(res => {
    //       if (res.Code === 200) {
    //         // 获取科目列表数据
    //         this.getSubjectList(res.Data)
    //       } else {
    //         let msg = res.Message ? res.Message : '获取资源类型id失败！'
    //         this.$message({
    //           message: msg,
    //           type: 'error'
    //         })
    //       }
    //     })
    //     .catch(() => { })
    // },

    // 获取缴费科目列表
    getSubjectList () {
      let data = {
        vid: this.choseVillageInfo.vid,
      }
      this.$axios
        .post(this.urlObj.subjectbytype, data)
        .then(res => {
          if (res.Code === 200) {
            this.subOptions = res.Data ? res.Data : []
            // 默认选中一个科目
            this.subjectVal = res.Data && res.Data[0] ? res.Data[0].id : ''
            if (this.subjectVal) {
              // 获取表格数据
              this.tableLoad()
            }
          } else {
            let msg = res.Message ? res.Message : '获取缴费科目失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取楼栋数据
    getBuildList () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼栋数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元数据
    getUnitList () {
      let data = {
        bids: this.buildVal
      }
      this.$axios
        .post(this.urlObj.searchUnit, data)
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取单元数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 楼栋选择更改处理
    buildChange (value) {
      this.unitVal = []
      this.unitOptions = []
      if (value.length > 0) {
        // 获取单元数据
        this.getUnitList()
      }
      this.tableLoad()
    },

    // 获取表格数据
    tableLoad () {
      let url =
        this.typeVal == 1 ? this.urlObj.haspayorder : this.urlObj.subjectarrears
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        subject_id: this.subjectVal,
        bids: this.buildVal,
        ymonth: this.ymonth,
        units: this.unitVal
      }
      // 获取项目列表数据
      this.$axios.post(url, data).then(res => {
        if (res.Code === 200) {
          if (this.typeVal == 2) {
            res.Data.data.forEach(item => {
              item.oname = item.owner.realname
              item.subject_name = item.subject.name
            })
          } else {
            res.Data.data.forEach(item => {
              item.status_text = item.status == 0 ? '未交' : '已交'
              let arr = []
              if (item.sndetails && item.sndetails.length > 0) {
                item.sndetails.forEach(itm => {
                  if (itm.subject && itm.subject.name) {
                    arr.push(itm.subject.name)
                  }
                })
              }
              item.subject_name = arr.join('、')
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
    /**
     * 
     * 选择类型
     * 
     */
    typeChange() {
      this.ymonth = '';
      this.tableLoad();
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

    // 点击表格打印按钮处理
    tablePrint (index) {
      this.currentIndex = index
      if (this.typeVal == 1) {
        this.$confirm('确定要打印当前收据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let data = {
              id: this.tableData[index].id,
              ymonth: this.ymonth,
              type: 2
            }
            this.printCommit(data)
          })
          .catch(() => { })
      } else {
        this.isBatch = false
        this.radioVal = ''
        this.dateVal = ''
        this.getPaymentType()
        this.showGatheringDialog = true
      }
    },

    // 批量打印处理
    batchPrint () {
      if (this.typeVal == 1) {
        this.$confirm('确定要打印当前选择的票据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let arr = this.tableSelected.map(item => item.id)
            let data = {
              ymonth: this.ymonth,
              ids: arr
            }
            this.batchPrintCommit(data)
          })
          .catch(() => { })
      } else {
        this.isBatch = true
        this.radioVal = ''
        this.dateVal = ''
        this.getPaymentType()
        this.showGatheringDialog = true
      }
    },

    // 打印收据请求
    printCommit (data) {
      this.$axios
        .post(this.urlObj.issueReceipt, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.id = data.id
            // 开始打印
            myPrint.startLodop(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取打印收据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 批量打印请求
    batchPrintCommit (data) {
      this.$axios
        .post(this.urlObj.batchprint, data)
        .then(res => {
          if (res.Code === 200) {
            // 开始批量打印
            myPrint.startMorePrintLodop(res.Data);
          } else {
            let msg = res.Message ? res.Message : '获取打印收据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取支付方式
    getPaymentType () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.paymentList = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取支付方式失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 点击确认收款按钮处理
    confirm () {
      if (this.radioVal && this.dateVal) {
        this.isCommit = true
        let arr = []
        if (this.isBatch) {
          this.tableSelected.forEach(item => {
            let obj = {
              resources_id: item.resourcesmodel_id,
              resources_name: item.resources_name,
              resources_type: item.resourcesmodel_type,
              oid: item.oid,
              subject_id: item.subject_village_id,
              time: item.time,
              use_info: item.use_info
            }
            arr.push(obj)
          })
        } else {
          arr = [
            {
              resources_id: this.tableData[this.currentIndex].resourcesmodel_id,
              resources_name: this.tableData[this.currentIndex].resources_name,
              resources_type: this.tableData[this.currentIndex]
                .resourcesmodel_type,
              oid: this.tableData[this.currentIndex].oid,
              subject_id: this.tableData[this.currentIndex].subject_village_id,
              time: this.tableData[this.currentIndex].time,
              use_info: this.tableData[this.currentIndex].use_info
            }
          ]
        }
        let data = {
          vid: this.choseVillageInfo.vid,
          ymonth: this.ymonth,
          pay_type: this.radioVal,
          pay_time: this.dateVal / 1000,
          data: arr
        }
        this.$axios
          .post(this.urlObj.batchopenpaysn, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                message: '生成订单成功！',
                type: 'success'
              })
              // 关闭弹框并重新获取表格数据
              this.showGatheringDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '生成订单失败！'
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
      } else if (!this.radioVal && !this.dateVal) {
        this.$message({
          type: 'warning',
          message: '请选择支付方式和支付时间！'
        })
      } else if (!this.radioVal) {
        this.$message({
          type: 'warning',
          message: '请选择支付方式！'
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择支付时间！'
        })
      }
    }
  }
}
