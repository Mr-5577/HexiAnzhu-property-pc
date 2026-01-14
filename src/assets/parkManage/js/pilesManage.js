import pilesManage from '../json/piles-manage.json'
import detailDialog from '../json/detail-dialog.json'

export default {
  name: 'pilesManage',
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
      // 资源类型
      typeVal: '',
      typeOptions: [],
      // 搜索框绑定值
      searchVal: '',
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: pilesManage.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示新增充电桩弹框
      showPileDialog: false,
      // 新增充电桩表单对象
      pileForm: {
        name: '',
        park: '',
        type: '',
        code: '',
        camera: '',
        status: '',
        lccDevice: '',
      },
      // 新增充电桩表单验证对象
      pileRules: {
        name: [
          { required: true, message: '请输入充电桩名称', trigger: 'blur' }
        ],
        park: [
          { required: true, message: '请选择所属车场', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        camera: [
          { required: true, message: '请选择视频摄像头', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ],
        lccDevice: [
          { required: true, message: '请选择关联设备', trigger: 'change' }
        ],
      },
      // 关联设备列表
      lccDevices: [],
      // 所属车场列表
      parkOptions: [],
      // 摄像头列表
      cameraOptions: [],
      // 启用状态列表
      statusOptions: [],
      // 是否正在提交数据
      isCommit: false,
      // 费用合计
      totalMoney: '0.00',
      // 是否显示详情弹框
      showDetailDialog: false,
      // 当前充电桩的id
      pilesId: '',
      // 表格数据
      detailTableData: [],
      // 表格列数据配置
      detailColumns: detailDialog.list,
      // 表格配置
      detailConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 详情表格支付类型
      detailType: '',
      // 详情表格开始时间
      detailStime: '',
      // 详情表格结束时间
      detailEtime: '',
      // 详情表格合计
      allmoney: "0.00"
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

    // 开始时间限制
    dspickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.detailEtime ? time.getTime() > new Date(this.detailEtime).getTime() : false
          }
        }
      }
    },

    // 结束时间限制
    depickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.detailStime ? time.getTime() < new Date(this.detailStime).getTime() - 24 * 60 * 60 * 1000 : false
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
    this.getTypeList()
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

    // 资源类型
    getTypeList () {
      this.$axios
        .post(this.urlObj.carType, { type: "virtual" })
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '资源数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取驴充充 设备数据
    getLccDevices () {
      this.$axios
        .post(this.urlObj.devicelist, { vid: this.choseVillageInfo.vid })
        .then(res => {
          this.lccDevices = res.lists ? res.lists : []
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
        vid: this.choseVillageInfo.vid,
        keyword: this.searchVal,
        payType: this.typeVal,
        stime: this.startTime ? this.startTime : '',
        etime: this.endTime ? this.endTime : '',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.chargepiles, data)
        .then(res => {
          if (res.Code === 200) {
            this.totalMoney = _.round(Number(res.Data.allmoney), 2).toFixed(2)
            res.Data.lists.data.forEach((item, index) => {
              item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
              item.statusColor = item.online == 1 ? '#333' : 'rgb(255, 203, 60)'
              item.money = _.round(Number(item.money), 2).toFixed(2)
              item.carname = item.cartemporary ? item.cartemporary.name : ''
              item.type_text = item.type ? item.type.name : ''
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

    // 启用状态改变
    tableSetVal (obj) {
      let value = obj.value == 0 ? -1 : 1
      let data = {
        id: this.tableData[obj.index].id,
        status: value
      }
      this.$axios
        .post(this.urlObj.chargepilestatus, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '启用状态修改成功！'
            })
            this.$set(this.tableData[obj.index], obj.col_name, value)
          } else {
            let msg = res.Message ? res.Message : '启用状态修改失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击新增电桩按钮处理
    addPile () {
      // 表单验证重置
      if (this.$refs.pileForm) {
        this.$refs.pileForm.resetFields()
      }
      this.pileForm = {
        name: '',
        park: '',
        type: '',
        code: '',
        camera: '',
        status: '',
        lccDevice: '',
      }
      this.parkOptions = []
      this.showPileDialog = true
      // 获取所属车场列表数据
      this.getParkList()
      // 获取关联设备
      this.getLccDevices()
    },

    // 获取所属车场列表数据
    getParkList () {
      this.$axios
        .post(this.urlObj.allcars, { vid: this.choseVillageInfo.vid })
        .then(res => {
          if (res.Code === 200) {
            this.parkOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '车场列表数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 确认新增充电桩
    pileSubmit () {
      if (!this.isCommit) {
        this.$refs.pileForm.validate(valid => {
          if (valid) {
            // 车场详情的新增充电桩
            this.isCommit = true
            let data = {
              vid: this.choseVillageInfo.vid,
              ctid: this.pileForm.park,
              name: this.pileForm.name,
              resources_type_id: this.pileForm.type,
              number: this.pileForm.code,
              status: this.pileForm.status,
              camera_url: this.pileForm.camera,
              deviceId: this.pileForm.lccDevice
            }

            this.$axios
              .post(this.urlObj.addpile, data)
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: '充电桩添加成功！'
                  })
                  this.showPileDialog = false
                  this.tableLoad()
                } else {
                  let msg = res.Message ? res.Message : '充电桩添加失败！'
                  this.$message({
                    type: 'error',
                    message: msg
                  })
                }
                this.isCommit = false
              })
              .catch(() => {
                this.isCommit = false
              })
          }
        })
      }
    },

    // 点击表格详情按钮
    pilesDetail (index) {
      this.detailTableData = []
      this.pilesId = this.tableData[index].id
      this.detailType = this.typeVal
      this.detailStime = this.startTime
      this.detailEtime = this.endTime
      this.showDetailDialog = true
      this.detailTableLoad()
    },

    // 获取详情表格数据
    detailTableLoad () {
      // 表格处于加载状态
      this.detailConf.loadStatus = true
      let data = {
        page: this.detailConf.curPage,
        limit: this.detailConf.limit,
        id: this.pilesId,
        payType: this.detailType,
        stime: this.detailStime ? this.detailStime : '',
        etime: this.detailEtime ? this.detailEtime : '',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.chargeOrders, data)
        .then(res => {
          if (res.Code === 200) {
            this.allmoney = res.Data.allmoney
            // 设置查询总数
            this.detailConf.dataTotal = res.Data.lists.total
            // 存放查询数据
            this.detailTableData = res.Data.lists.data
            // 关闭加载状态
            this.detailConf.loadStatus = false
            // 清空空数据提示
            this.detailConf.emptyText = ''
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
            this.detailTableData = []
            this.detailConf.emptyText = res.Message
            this.detailConf.dataTotal = 0
            this.detailConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.detailTableData = []
          this.detailConf.emptyText = '服务器连接失败...'
          this.detailConf.dataTotal = 0
          this.detailConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    detailSizeChange (num) {
      this.detailConf.limit = num
      // 获取一次表格数据
      this.detailTableLoad()
    },

    // 当前页码改变处理
    detailCurrentChange (num) {
      this.detailConf.curPage = num
      // 获取一次表格数据
      this.detailTableLoad()
    },
  }
}
