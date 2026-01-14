import fileColumns from '../json/file-columns.json'
import recordCloumns from '../json/record-cloumns.json'
import historyDetail from '../json/history-detail-dialog.json'
import fitmentDetail from '../json/fitment-detail.json'
import orderInfo from '../json/order-info.json'
import stallInfo from '../json/stall-info.json'
import nocarInfo from '../json/nocar-info.json'
import fileInfo from '../json/file-info.json'

export default {
  name: 'fileManage',
  data () {
    return {
      urlObj: {
        getfilelist: this.$api.state.Charge.getfilelist.url,
        viewfile: this.$api.state.Charge.viewfile.url,
        filedetail: this.$api.state.Charge.filedetail.url,
        carbyfixcar: this.$api.state.Means.carbyfixcar.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: ''
      },
      // 搜索框绑定值
      searchVal: '',
      // 订单状态
      typeVal: '',
      typeOptions: [
        {
          id: 'op_transfer',
          name: '欠费转移',
        },
        {
          id: 'op_delete',
          name: '欠费删除',
        },
        {
          id: 'free_order',
          name: '免单收入',
        },
        {
          id: 'car',
          name: '车位启用',
        },
        {
          id: 'renovation',
          name: '办理装修',
        },
      ],
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: fileColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示详情弹框
      showDetailDialog: false,
      // 是否正在加载详情数据
      isLoading: false,
      // 欠费详情表格数据
      arreTableData: [],
      // 欠费详情表格列数据配置
      arreColumns: recordCloumns.list,
      // 欠费详情表格配置
      arreConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 订单详情表格数据
      orderTableData: [],
      // 订单详情表格列数据配置
      orderColumns: historyDetail.list,
      // 订单详情表格配置
      orderConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 装修详情表格数据
      fitmentTableData: [],
      // 装修详情表格列数据配置
      fitmentColumns: fitmentDetail.list,
      // 装修详情表格配置
      fitmentConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 缴费明细表格数据
      infoTableData: [],
      // 缴费明细表格列数据配置
      infoColumns: orderInfo.list,
      // 缴费明细表格配置
      infoConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 订单费用实收合计
      realityMoney: '0.00',
      // 订单费用应收合计
      receivableMoney: '0.00',
      // 订单的备注
      orderRemark: '',
      // 当前详情 对象数据
      currentObj: {},
      // 详情弹框标题
      title: '',
      // 缴费明细表格数据
      stallTableData: [],
      // 缴费明细表格列数据配置
      stallColumns: stallInfo.list,
      // 缴费明细表格配置
      stallConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 缴费明细表格数据
      nocarTableData: [],
      // 缴费明细表格列数据配置
      nocarColumns: nocarInfo.list,
      // 缴费明细表格配置
      nocarConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 车位详情数据
      stallObj: {},
      // 是否显示附件详情弹框
      showFileDialog: false,
      // 文件表格数据
      fileTableData: [],
      // 文件表格列数据配置
      fileColumns: fileInfo.list,
      // 文件表格配置
      fileConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 文件 url
      furl: '',
      // 图片列表
      imgList: [],
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
        keywords: this.searchVal,
        starttime: this.startTime ? this.startTime / 1000 : '',
        endtime: this.endTime ? this.endTime / 1000 : '',
        type: this.typeVal,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getfilelist, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach((item, index) => {
              item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
              item.type_text = this.typeOptions.find(itm => itm.id == item.type).name
            })
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

    // 点击预览按钮处理
    filePreview (index) {
      this.fileTableData = []
      this.furl = ''
      this.imgList = []
      this.showFileDialog = true
      // 表格处于加载状态
      this.fileConf.loadStatus = true
      let data = {
        id: this.tableData[index].id,
        type: this.tableData[index].type
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.viewfile, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.size = (item.size / 1024).toFixed(2) + 'KB'
                if (item.mimetype && item.mimetype.startsWith('image')) {
                  item.dhide = true
                  this.imgList.push(item.file_url)
                } else {
                  item.dhide = false
                }
              })
            }
            // 存放查询数据
            this.fileTableData = res.Data
            // 关闭加载状态
            this.fileConf.loadStatus = false
            // 清空空数据提示
            this.fileConf.emptyText = ''
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
            this.fileTableData = []
            this.fileConf.emptyText = res.Message
            this.fileConf.dataTotal = 0
            this.fileConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.fileTableData = []
          this.fileConf.emptyText = '服务器连接失败...'
          this.fileConf.dataTotal = 0
          this.fileConf.loadStatus = false
        })
    },

    // 文件/图片预览
    fpreview (index) {
      let obj = this.fileTableData[index]
      if (obj.mimetype && obj.mimetype.startsWith('image')) {
        this.furl = obj.file_url
        this.$nextTick(() => {
          this.$refs.preview.showViewer = true
        })
      } else {
        let user = sessionStorage.getItem('realname')
        this.furl = `http://doc.ygddzy.cn/view/url?url=${obj.file_url}&name=${obj.filename}&watermark=${user}`
        this.$nextTick(() => {
          this.$refs.adom.click()
        })
      }
    },

    // 文件下载
    fdownload (index) {
      let obj = this.fileTableData[index]
      this.furl = obj.file_url
      this.$nextTick(() => {
        this.$refs.adom.click()
      })
    },

    // 点击详情按钮处理
    fileDetail (index) {
      this.currentObj = this.tableData[index]
      switch (this.currentObj.type) {
        case 'op_transfer':
          this.title = '欠费详情'
          break;
        case 'op_delete':
          this.title = '欠费详情'
          break;
        case 'free_order':
          this.title = '订单详情'
          break;
        case 'renovation':
          this.title = '订单详情'
          break;
        case 'car':
          this.title = '车位详情'
          break;
      }
      // 获取详情数据
      this.getDetailData()
      this.showDetailDialog = true
    },

    // 获取详情表格数据
    getDetailData () {
      this.isLoading = true
      let data = {
        id: this.currentObj.id,
        type: this.currentObj.type
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.filedetail, data)
        .then(res => {
          if (res.Code === 200) {
            switch (this.currentObj.type) {
              case 'op_transfer':
                if (res.Data && res.Data.length > 0) {
                  res.Data.forEach(item => {
                    item.title = item.previewCostRepair.model_text
                    item.type_name = item.type_name
                    item.subName = item.subject.name
                    item.cname = item.creater.realname
                  })
                  this.arreTableData = res.Data
                } else {
                  this.arreTableData = []
                }
                break;
              case 'op_delete':
                if (res.Data && res.Data.length > 0) {
                  res.Data.forEach(item => {
                    item.title = item.previewCostRepair.model_text
                    item.type_name = item.type
                    item.subName = item.subject.name
                    item.cname = item.creater.realname
                  })
                  this.arreTableData = res.Data
                } else {
                  this.arreTableData = []
                }
                break;
              case 'free_order':
                this.receivableMoney = res.Data.allmoney ? res.Data.allmoney : '0.00'
                this.realityMoney = res.Data.money ? res.Data.money : '0.00'
                if (res.Data.deatil && res.Data.deatil.length > 0) {
                  res.Data.deatil.forEach(item => {
                    item.subname = item.subject ? item.subject.name : '--'
                    item.payname = item.payment ? item.payment.name : '--'
                    item.oname = item.owner ? item.owner.realname : '--'
                  })
                }
                if (res.Data.cost && res.Data.cost.length > 0) {
                  res.Data.cost.forEach(item => {
                    item.subname = item.subject ? item.subject.name : '--'
                    item.remark = item.previewCostRepair ? item.previewCostRepair.remarks : ''
                  })
                }
                this.orderRemark = res.Data.sn ? res.Data.sn.bz : ''
                // 存放查询数据
                this.orderTableData = res.Data.deatil ? res.Data.deatil : []
                this.infoTableData = res.Data.cost ? res.Data.cost : []
                break;
              case 'renovation':
                this.fitmentTableData = [
                  {
                    model_text: res.Data.sn.sndetails[0].model_text,
                    money: res.Data.money,
                    oname: res.Data.sn.sndetails[0].owner.realname,
                    payname: res.Data.sn.sndetails[0].payment.name,
                    remark: res.Data.remark,
                    pay_time: res.Data.sn.pay_time,
                  }
                ]
                this.infoTableData = res.Data.sn.sndetails.map(item => {
                  return {
                    subname: item.subject.name,
                    real_money: item.money,
                    describe: item.describe,
                    pay_time: res.Data.sn.pay_time,
                    remark: res.Data.sn.remark,
                  }
                })
                break;
              case 'car':
                this.stallObj = res.Data
                this.stallTableData = res.Data.carmotor.map(item => {
                  return {
                    id: item.id,
                    plate: item.plates ? item.plates : '--',
                    owner: item.name ? item.name : '--',
                    phone: item.tel ? item.tel : '--',
                    time: item.create_time ? item.create_time : '--',
                    operator: item.creater ? item.creater.realname : '--'
                  }
                })
                this.getNocarByFixcar()
                break;
            }
          } else {
            this.$message({
              type: 'error',
              message: `${this.title}数据获取失败！`
            })
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    // 获取固定车关联的非机动车列表
    getNocarByFixcar () {
      // 表格处于加载状态
      this.nocarConf.loadStatus = true
      let data = {
        car_id: this.stallObj.id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carbyfixcar, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.resource = item.resourcestype.name
              item.icname = item.iccard.map(itm => itm.code).join('、')
              item.cname = item.creater.realname
            })
            // 设置查询总数
            this.nocarConf.dataTotal = 0
            // 存放查询数据
            this.nocarTableData = res.Data
            // 关闭加载状态
            this.nocarConf.loadStatus = false
            // 清空空数据提示
            this.nocarConf.emptyText = ''
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
            this.nocarTableData = []
            this.nocarConf.emptyText = res.Message
            this.nocarConf.dataTotal = 0
            this.nocarConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.nocarTableData = []
          this.nocarConf.emptyText = '服务器连接失败...'
          this.nocarConf.dataTotal = 0
          this.nocarConf.loadStatus = false
        })
    },
  }
}
