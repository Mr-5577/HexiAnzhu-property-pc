import yarnColumns from '../json/yarn-columns.json'
import gateColumns from '../json/gate-columns.json'
import gateDetail from '../json/gate-detail.json'
import pilesColumns from '../json/piles-columns.json'
import pilesDetail from '../json/piles-detail.json'

export default {
  name: 'yardManage',
  data () {
    return {
      urlObj: {
        userVillage: this.$api.state.Public.userVillage.url,
        cars: this.$api.state.ParkManage.cars.url,
        addcar: this.$api.state.ParkManage.addcar.url,
        modes: this.$api.state.ParkManage.modes.url,
        estatelist: this.$api.state.ParkManage.estatelist.url,
        devicelist: this.$api.state.ParkManage.devicelist.url,
        carType: this.$api.state.Means.carType.url,
        resources: this.$api.state.ParkManage.resources.url,
        cardetail: this.$api.state.ParkManage.cardetail.url,
        addgate: this.$api.state.ParkManage.addgate.url,
        addpile: this.$api.state.ParkManage.addpile.url,
        equisearch: this.$api.state.DeviceManage.equisearch.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: ''
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: yarnColumns.list,
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
      // 是否显示弹框
      showDialog: false,
      // 是否为新增车场
      isAdd: true,
      // 弹框表单数据对象
      ruleForm: {
        parkName: '',
        village: '',
        method: '',
        standard: [],
        phone: '',
        lccPlot: '',
      },
      // 表单验证对象
      rules: {
        parkName: [
          { required: true, message: '请输入车场名称', trigger: 'blur' }
        ],
        village: [
          { required: true, message: '请选择关联项目', trigger: 'change' }
        ],
        method: [
          { required: true, message: '请选择临停收费方式', trigger: 'change' }
        ],
        standard: [
          { required: true, message: '请选择收费标准', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入呼叫中心电话号码', trigger: 'blur' }
        ],
        lccPlot: [
          { required: true, message: '请选择驴充充小区', trigger: 'change' }
        ],
      },
      // 关联项目
      villageOptions: [],
      // 临停收费方式
      methodOptions: [],
      // 驴充充小区列表数据
      plotOptions: [],
      // 收费标准
      standardOptions: [],
      // 是否显示新增闸机弹框
      showGateDialog: false,
      // 表格数据
      gateTableData: [],
      // 表格列数据配置
      gateColumns: gateColumns.list,
      // 表格配置
      gateConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 新增闸机表单数据对象
      gateForm: {
        nameId: '',
        name: '',
        resource: '',
        sort: '',
        camera: '',
        status: '',
        charge: '',
        location: '',
        classify: '',
      },
      // 新增闸机表单验证对象
      gateRules: {
        name: [
          { required: true, message: '请输入闸机名称', trigger: 'blur' }
        ],
        nameId: [
          { required: true, message: '请选择闸机设备', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择所属资源', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入控制机序号', trigger: 'blur' }
        ],
        camera: [
          { required: false, message: '请选择视频摄像头', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ],
        charge: [
          { required: true, message: '请选择是否计费', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请选择位置', trigger: 'change' }
        ],
        classify: [
          { required: true, message: '请选择闸机类别', trigger: 'change' }
        ],
      },
      // 设备列表
      deviceOptions: [],
      // 资源类型列表
      resourceOptions: [],
      // 启用状态列表
      statusOptions: [],
      // 位置列表
      locationOptions: [],
      // 是否显示新增充电桩弹框
      showPileDialog: false,
      // 表格数据
      pileTableData: [],
      // 表格列数据配置
      pileColumns: pilesColumns.list,
      // 表格配置
      pileConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 新增充电桩表单对象
      pileForm: {
        name: '',
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
        type: [
          { required: true, message: '请选择充电桩类型', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        camera: [
          { required: false, message: '请选择视频摄像头', trigger: 'change' }
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
      // 是否正在提交数据
      isCommit: false,
      // 是否正在加载详情数据
      isloadDetail: false,
      // 当前车场详情数据
      yarnDetail: {},
      // 当前闸机是编辑还是新增
      isEditGate: false,
      // 当前编辑闸机数据
      currentGate: '',
      // 当前充电桩是编辑还是新增
      isEditPile: false,
      // 当前编辑充电桩数据
      currentPile: '',
      // 是否正在搜索设备
      loading: false,
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
        keywords: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.cars, data)
        .then(res => {
          if (res.Code === 200) {
            this.totalMoney = _.round(Number(res.Data.allmoney), 2).toFixed(2)
            // 设置查询总数
            this.conf.dataTotal = res.Data.data.total
            // 存放查询数据
            this.tableData = res.Data.data.data
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

    // 获取项目数据
    getVillageData () {
      this.$axios
        .post(this.urlObj.userVillage)
        .then(res => {
          if (res.Code === 200) {
            if (this.isAdd) {
              this.ruleForm.village = this.choseVillageInfo.vid ? Number(this.choseVillageInfo.vid) : ''
            }
            this.villageOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '项目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取收费方式/收费标准
    getChargeData (data) {
      this.$axios
        .post(this.urlObj.modes, data)
        .then(res => {
          if (res.Code === 200) {
            if (data.mode) {
              this.standardOptions = res.Data ? res.Data : []
            } else {
              this.methodOptions = res.Data ? res.Data : []
            }
          } else {
            let msg = res.Message ? res.Message : '获取收费方式/标准数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取驴充充小区
    getLccPlots () {
      this.$axios
        .post(this.urlObj.estatelist)
        .then(res => {
          if (res.Code === 200) {
            this.plotOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取驴充充小区数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取驴充充 设备数据
    getLccDevices () {
      this.$axios
        .post(this.urlObj.devicelist, { estateId: this.ruleForm.lccPlot })
        .then(res => {
          this.lccDevices = res.lists ? res.lists : []
        })
        .catch(() => { })
    },

    // 点击新增车场按钮处理
    addPark () {
      this.isAdd = true
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.methodOptions = []
      this.standardOptions = []
      this.gateTableData = []
      this.pileTableData = []
      this.gateColumns = gateColumns.list
      this.pileColumns = pilesColumns.list
      this.showDialog = true
      // 获取项目数据
      this.getVillageData()
      // 获取收费方式
      this.getChargeData({ mode: '' })
      // 获取驴充充小区
      this.getLccPlots()
    },

    // 闸机选择更改处理
    nameChange (val) {
      if (val) {
        this.gateForm.name = this.deviceOptions.find(item => item.id == val).sn
      } else {
        this.gateForm.name = ''
      }
    },

    // 收费方式选择更改处理
    methodChange (val) {
      this.ruleForm.standard = []
      this.standardOptions = []
      this.getChargeData({ mode: val })
    },

    // 获取设备数据
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true;
        let data = {
          vid: this.ruleForm.village,
          keywords: query
        }
        this.$axios
          .post(this.urlObj.equisearch, data)
          .then(res => {
            if (res.Code === 200) {
              this.deviceOptions = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '设备数据获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.loading = false;
          })
          .catch(() => { this.loading = false })
      } else {
        this.deviceOptions = []
      }
    },

    // 获取资源类型数据
    getResources () {
      this.$axios
        .post(this.urlObj.carType, { type: "virtual" })
        .then(res => {
          if (res.Code === 200) {
            this.resourceOptions = res.Data ? res.Data : []
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

    // 获取位置数据
    getPositions () {
      this.$axios
        .post(this.urlObj.resources, { type: 'position' })
        .then(res => {
          if (res.Code === 200) {
            this.locationOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '位置数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击新增闸机按钮处理
    addGate () {
      this.isEditGate = false
      // 表单验证重置
      if (this.$refs.gateForm) {
        this.$refs.gateForm.resetFields()
      }
      this.gateForm = {
        name: '',
        nameId: '',
        resource: '',
        sort: '',
        camera: '',
        status: '',
        charge: '',
        location: '',
        classify: '',
      }
      this.deviceOptions = []
      this.showGateDialog = true
      // 获取资源类型
      this.getResources()
      // 获取闸机位置
      this.getPositions()
    },

    // 点击新增电桩按钮处理
    addPile () {
      if (this.ruleForm.lccPlot) {
        this.isEditPile = false
        // 表单验证重置
        if (this.$refs.pileForm) {
          this.$refs.pileForm.resetFields()
        }
        this.pileForm = {
          name: '',
          type: '',
          code: '',
          camera: '',
          status: '',
          lccDevice: '',
        }
        this.showPileDialog = true
        // 获取资源类型
        this.getResources()
        // 获取关联设备
        this.getLccDevices()
      } else {
        this.$message({
          type: 'warning',
          message: '请选择驴充充小区'
        })
      }
    },

    // 点击表格详情按钮处理
    showDetail (index) {
      this.isAdd = false
      this.showDialog = true
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.methodOptions = []
      this.standardOptions = []
      this.gateTableData = []
      this.pileTableData = []
      this.gateColumns = gateDetail.list
      this.pileColumns = pilesDetail.list
      // 获取车场详情数据
      this.getCarDetail(this.tableData[index].id)
      // 获取项目数据
      this.getVillageData()
      // 获取收费方式
      this.getChargeData({ mode: '' })
      // 获取驴充充小区
      this.getLccPlots()
    },

    // 确认新增/编辑闸机
    gateSubmit () {
      this.$refs.gateForm.validate(valid => {
        if (valid) {
          // 新增车场的新增闸机
          if (this.isAdd) {
            let data = JSON.parse(JSON.stringify(this.gateForm))
            data.online = '离线'
            if (this.gateForm.resource) {
              data.resource_text = this.resourceOptions.find(itm => itm.id == this.gateForm.resource).name
            } else {
              data.resource_text = ''
            }
            if (this.gateForm.location) {
              data.location_text = this.locationOptions.find(item => item.id == this.gateForm.location).name
            } else {
              data.location_text = ''
            }
            if (this.gateForm.classify) {
              data.classify_text = this.gateForm.classify == 1 ? '入口' : '出口'
            } else {
              data.classify_text = ''
            }
            this.gateTableData.push(data)
            this.showGateDialog = false
          } else {
            // 车场详情的新增闸机
            this.isCommit = true
            let data = {
              equipment_id: this.gateForm.nameId,
              name: this.gateForm.name,
              number: this.gateForm.sort,
              type: '',
              camera_url: this.gateForm.camera,
              status: this.gateForm.status,
              is_free: this.gateForm.charge,
              position: this.gateForm.location,
              resources_type_id: this.gateForm.resource,
              ctid: this.yarnDetail.id,
              vid: this.yarnDetail.vid,
              is_enter: this.gateForm.classify,
            }
            // 闸机编辑
            if (this.isEditGate) {
              data.id = this.currentGate.id
            }

            this.$axios
              .post(this.urlObj.addgate, data)
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: this.isEditGate ? '闸机编辑成功！' : '闸机添加成功！'
                  })
                  this.showGateDialog = false
                  // 获取一次详情数据
                  this.getCarDetail(this.yarnDetail.id)
                } else {
                  let msg = res.Message ? res.Message : this.isEditGate ? '闸机编辑失败！' : '闸机添加失败！'
                  this.$message({
                    type: 'error',
                    message: msg
                  })
                }
                this.isCommit = false
              })
              .catch(() => {
                this.isCommit = true
              })
          }
        }
      })
    },

    // 闸机删除
    gateDelete (index) {
      this.gateTableData.splice(index, 1)
    },

    // 闸机编辑
    gateEdit (index) {
      this.isEditGate = true
      this.currentGate = this.gateTableData[index]
      // 表单验证重置
      if (this.$refs.gateForm) {
        this.$refs.gateForm.resetFields()
      }
      this.gateForm = {
        name: this.currentGate.name,
        resource: this.currentGate.types ? this.currentGate.types.id : '',
        sort: this.currentGate.number,
        camera: this.currentGate.camera_url,
        status: this.currentGate.status,
        location: this.currentGate.position,
        classify: this.currentGate.is_enter,
        charge: this.currentGate.is_free
      }
      this.showGateDialog = true
      // 获取资源类型
      this.getResources()
      // 获取闸机位置
      this.getPositions()
    },

    // 确认新增充电桩
    pileSubmit () {
      this.$refs.pileForm.validate(valid => {
        if (valid) {
          // 新增车场的新增充电桩
          if (this.isAdd) {
            let data = JSON.parse(JSON.stringify(this.pileForm))
            data.online = '离线'
            if (this.pileForm.type) {
              data.type_text = this.resourceOptions.find(item => item.id == this.pileForm.type).name
            } else {
              data.type_text = ''
            }
            data.deviceName = this.lccDevices.find(item => item.id == data.lccDevice).name
            this.pileTableData.push(data)
            this.showPileDialog = false
          } else {
            // 车场详情的新增充电桩
            this.isCommit = true
            let data = {
              name: this.pileForm.name,
              resources_type_id: this.pileForm.type,
              number: this.pileForm.code,
              status: this.pileForm.status,
              camera_url: this.pileForm.camera,
              ctid: this.yarnDetail.id,
              vid: this.yarnDetail.vid,
            }
            // 充电桩编辑
            if (this.isEditPile) {
              data.id = this.currentPile.id
            }

            this.$axios
              .post(this.urlObj.addpile, data)
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: this.isEditPile ? '充电桩编辑成功！' : '充电桩添加成功！'
                  })
                  this.showPileDialog = false
                  // 获取一次详情数据
                  this.getCarDetail(this.yarnDetail.id)
                } else {
                  let msg = res.Message ? res.Message : this.isEditPile ? '充电桩编辑失败！' : '充电桩添加失败！'
                  this.$message({
                    type: 'error',
                    message: msg
                  })
                }
                this.isCommit = false
              })
              .catch(() => {
                this.isCommit = true
              })
          }
        }
      })
    },

    // 充电桩删除
    pileDelete (index) {
      this.pileTableData.splice(index, 1)
    },

    // 充电桩编辑
    pileEdit (index) {
      this.isEditPile = true
      this.currentPile = this.pileTableData[index]
      // 表单验证重置
      if (this.$refs.pileForm) {
        this.$refs.pileForm.resetFields()
      }
      this.pileForm = {
        name: this.currentPile.name,
        type: this.currentPile.resources_type_id,
        code: this.currentPile.number,
        camera: this.currentPile.camera_url,
        status: this.currentPile.status,
        lccDevice: this.currentPile.deviceId
      }
      this.showPileDialog = true
      // 获取充电桩的类型
      this.getResources()
      // 获取关联设备
      this.getLccDevices()
    },

    // 确认新增/编辑车场处理
    parkSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.ruleForm.village,
            name: this.ruleForm.parkName,
            mobile: this.ruleForm.phone,
            cid: this.ruleForm.standard.join(','),
            estateId: this.ruleForm.lccPlot,
            gate: [],
            chargepile: []
          }
          // 添加车场
          if (this.isAdd) {
            // 闸机数据提取
            if (this.gateTableData.length > 0) {
              data.gate = this.gateTableData.map(item => {
                return {
                  equipment_id: item.nameId,
                  name: item.name,
                  number: item.sort,
                  type: '',
                  camera_url: item.camera,
                  status: item.status,
                  is_free: item.charge,
                  position: item.location,
                  resources_type_id: item.resource,
                  vid: this.ruleForm.village,
                }
              })
            }
            // 充电桩数据提取
            if (this.pileTableData.length > 0) {
              data.chargepile = this.pileTableData.map(item => {
                return {
                  name: item.name,
                  resources_type_id: item.type,
                  number: item.code,
                  status: item.status,
                  camera_url: item.camera,
                  vid: this.ruleForm.village,
                  deviceId: item.lccDevice
                }
              })
            }
          } else {
            // 编辑车场
            data.id = this.yarnDetail.id
          }

          this.$axios
            .post(this.urlObj.addcar, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: this.isAdd ? '车场新增成功！' : '车场编辑成功！',
                  type: 'success'
                })
                // 关闭弹框重新获取表格数据
                this.showDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : this.isAdd ? '车场新增失败！' : '车场编辑失败！'
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
        }
      })
    },

    // 获取车场详情
    getCarDetail (id) {
      this.isloadDetail = true
      this.$axios
        .post(this.urlObj.cardetail, { id })
        .then(res => {
          if (res.Code === 200) {
            this.yarnDetail = res.Data
            this.ruleForm = {
              parkName: res.Data.name,
              village: res.Data.vid,
              method: res.Data.methods ? res.Data.methods.mode : '',
              standard: res.Data.cid.map(item => Number(item)),
              phone: res.Data.mobile,
              lccPlot: res.Data.estateId
            }
            res.Data.gates.forEach(item => {
              item.statusColor = item.online_status == 2 ? '#333' : 'rgb(255, 203, 60)'
              item.r_text = item.types ? item.types.name : ''
              item.online_text = item.online_status_text
            })
            res.Data.chargepiles.forEach(item => {
              item.statusColor = item.online == 1 ? '#333' : 'rgb(255, 203, 60)'
            })
            this.gateTableData = res.Data.gates ? res.Data.gates : []
            this.pileTableData = res.Data.chargepiles ? res.Data.chargepiles : []
            if (this.ruleForm.method) {
              // 获取收费标准
              this.getChargeData({ mode: this.ruleForm.method })
            }
          } else {
            let msg = res.Message ? res.Message : '获取车场详情数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isloadDetail = false
        })
        .catch(() => {
          this.isloadDetail = false
        })
    }
  }
}
