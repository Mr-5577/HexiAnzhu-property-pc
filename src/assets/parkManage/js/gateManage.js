import gateManage from '../json/gate-manage.json'
import orderRecord from '../json/order-record.json'

export default {
  name: 'gateManage',
  data () {
    return {
      urlObj: {
        gates: this.$api.state.ParkManage.gates.url,
        carType: this.$api.state.Means.carType.url,
        resources: this.$api.state.ParkManage.resources.url,
        allcars: this.$api.state.ParkManage.allcars.url,
        addgate: this.$api.state.ParkManage.addgate.url,
        gatedelete: this.$api.state.ParkManage.gatedelete.url,
        addCard: this.$api.state.ParkManage.addCard.url,
        gatestatus: this.$api.state.ParkManage.gatestatus.url,
        update_status: this.$api.state.ParkManage.update_status.url,
        gate_open: this.$api.state.ParkManage.gate_open.url,
        equisearch: this.$api.state.DeviceManage.equisearch.url,
        command_list: this.$api.state.ParkManage.command_list.url,
        gateCardAgainUrl: this.$api.state.ParkManage.gate_card_again.url,
        gateUnlockRecordUrl: this.$api.state.ParkManage.gate_unlock_record.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: ''
      },
      // 闸机位置
      location: '',
      locationOptions: [],
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: gateManage.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示新增闸机弹框
      showGateDialog: false,
      // 新增闸机表单数据对象
      gateForm: {
        name: '',
        nameId: '',
        park: '',
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
        name: [{
          required: true,
          message: '请输入闸机名称',
          trigger: 'blur'
        }],
        nameId: [{
          required: true,
          message: '请选择闸机设备',
          trigger: 'change'
        }],
        park: [{
          required: true,
          message: '请选择所属车场',
          trigger: 'change'
        }],
        resource: [{
          required: true,
          message: '请选择资源类型',
          trigger: 'change'
        }],
        sort: [{
          required: true,
          message: '请输入控制机序号',
          trigger: 'blur'
        }],
        camera: [{
          required: false,
          message: '请选择视频摄像头',
          trigger: 'change'
        }],
        status: [{
          required: true,
          message: '请选择启用状态',
          trigger: 'change'
        }],
        charge: [{
          required: true,
          message: '请选择是否计费',
          trigger: 'change'
        }],
        location: [{
          required: true,
          message: '请选择位置',
          trigger: 'change'
        }],
        classify: [{
          required: true,
          message: '请选择闸机类别',
          trigger: 'change'
        }],
      },
      // 设备列表
      deviceOptions: [],
      // 所属车场列表
      parkOptions: [],
      // 资源类型列表
      resourceOptions: [],
      // 是否正在提交数据
      isCommit: false,
      // 费用合计
      totalMoney: '0.00',
      // 是否正在搜索设备
      loading: false,
      // 是否显示开闸弹框
      showUnlockDialog: false,
      // 开闸备注说明
      description: '',
      // 当前操作数据对象
      currentObj: '',
      // 当前是编辑还是新增闸机
      isEdit: false,
      // 是否显示指令记录弹框
      showOrderDialog: false,
      // 指令表格数据
      orderTableData: [],
      // 指令表格列数据配置
      orderColumns: orderRecord.list,
      // 指令表格配置
      orderConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前闸机对象（指令记录）
      cgateObj: '',
      // 指令记录弹框标题
      orderTitle: '',
      // 是否显示添加临时卡弹框
      showAddCardDialog: false,
      // 临时卡卡号
      cardNumber: '',
      // 有效期
      indate: '',
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
    // 获取闸机位置
    this.getPositions()
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    /**
     * 开锁记录
     */
    openLockRecord (obj) {
      // 弹出提示弹框
      this.$confirm('确定要获取当天开锁记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: obj.id
        }
        this.$axios
          .post(this.urlObj.gateUnlockRecordUrl, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '获取成功！'
              })
            } else {
              let msg = res.Message ? res.Message : '获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      })
    },

    //重新下发
    again (obj) {
      this.$confirm('确定要重新下发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: obj.id
        }
        this.$axios
          .post(this.urlObj.gateCardAgainUrl, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '重新下发成功！'
              })
            } else {
              let msg = res.Message ? res.Message : '重新下发失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      })

    },

    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.searchVal = ''
      this.location = ''
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
        position: this.location,
        keyword: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.gates, data)
        .then(res => {
          if (res.Code === 200) {
            this.totalMoney = _.round(Number(res.Data.allmoney), 2).toFixed(2)
            res.Data.lists.data.forEach((item, index) => {
              item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
              item.statusColor = item.online_status == 3 ? 'rgb(255, 203, 60)' : item.online_status == 2 ?
                '#3ebb75' : '#333'
              item.money = _.round(Number(item.money), 2).toFixed(2)
              item.carname = item.cartemporary ? item.cartemporary.name : ''
              item.classify_text = item.is_enter == 1 ? "入口" : '出口'
              item.free_text = item.is_free == 1 ? '是' : item.is_free == 2 ? '否' : ''
              item.bjhide = item.delete_time > 0
              item.schide = item.delete_time > 0
              item.ophide = item.delete_time > 0
              item.ylhide = item.delete_time > 0
              item.boxhide = item.delete_time > 0
              item.rowDelete = item.delete_time > 0
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
        .post(this.urlObj.gatestatus, data)
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

    // 更新状态
    updateStatus (obj) {

      this.$confirm('确定要更新在线状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: obj.id
        }
        this.$axios
          .post(this.urlObj.update_status, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '在线状态更新成功！'
              })
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '在线状态更新失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      })


    },

    // 点击开闸按钮处理
    unlocking (obj) {
      this.currentObj = obj
      this.description = ''
      this.showUnlockDialog = true
    },

    // 开闸请求
    unlockRequest () {
      this.isCommit = true
      let data = {
        id: this.currentObj.id,
        desc: this.description
      }
      this.$axios
        .post(this.urlObj.gate_open, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '开闸成功！'
            })
            this.showUnlockDialog = false
          } else {
            let msg = res.Message ? res.Message : '开闸失败！'
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

    },

    // 点击编辑处理
    gateEdit (index) {
      let obj = this.tableData[index]
      this.currentObj = obj
      this.isEdit = true
      // 表单验证重置
      if (this.$refs.gateForm) {
        this.$refs.gateForm.resetFields()
      }
      this.gateForm = {
        name: obj.name,
        // nameId: obj.equipment_id,
        nameId: '',
        park: obj.ctid,
        resource: obj.resources_type_id,
        sort: obj.number,
        camera: obj.camera_url,
        status: obj.status,
        charge: obj.is_free,
        location: obj.position,
        classify: obj.is_enter,
      }
      this.deviceOptions = []
      this.parkOptions = []
      this.resourceOptions = []
      this.showGateDialog = true
      // 获取所属车场
      this.getParkList()
      // 获取资源类型
      this.getResources()
    },

    // 闸机删除处理
    gateDel (index) {
      this.$confirm('确定要删除当前闸机吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.tableData[index].id
        }
        this.$axios
          .post(this.urlObj.gatedelete, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '闸机删除成功！'
              })
            } else {
              let msg = res.Message ? res.Message : '闸机删除失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      })
    },

    // 添加临时卡
    addTestCard (obj) {
      this.currentObj = obj
      this.cardNumber = ''
      let dateTime = new Date()
      dateTime = new Date(dateTime.setDate(dateTime.getDate() + 1))
      let y = dateTime.getFullYear()
      let m = String(dateTime.getMonth() + 1).padStart(2, '0')
      let d = String(dateTime.getDate()).padStart(2, '0')
      let hh = String(dateTime.getHours()).padStart(2, '0')
      let mm = String(dateTime.getMinutes()).padStart(2, '0')
      this.indate = y + '-' + m + '-' + d + ' ' + hh + ':' + mm
      this.showAddCardDialog = true
    },

    // 确认添加临时卡
    addCardConfirm () {
      if (this.cardNumber.trim()) {
        let data = {
          id: this.currentObj.id,
          code: this.cardNumber
        }
        this.$axios
          .post(this.urlObj.addCard, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '临时卡添加成功！'
              })
            } else {
              let msg = res.Message ? res.Message : '临时卡添加失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      } else {
        this.$message({
          type: 'warning',
          message: '请输入临时卡号'
        })
      }
    },

    // 获取所属车场列表数据
    getParkList () {
      this.$axios
        .post(this.urlObj.allcars, {
          vid: this.choseVillageInfo.vid
        })
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

    // 获取资源类型数据
    getResources () {
      this.$axios
        .post(this.urlObj.carType, {
          type: "virtual"
        })
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

    // 获取位置
    getPositions () {
      this.$axios
        .post(this.urlObj.resources, {
          type: 'position'
        })
        .then(res => {
          if (res.Code === 200) {
            this.locationOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 闸机选择更改处理
    nameChange (val) {
      if (val) {
        this.gateForm.name = this.deviceOptions.find(item => item.id == val).sn
      } else {
        this.gateForm.name = ''
      }
    },

    // 获取设备数据
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true;
        let data = {
          vid: this.choseVillageInfo.vid,
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
          .catch(() => {
            this.loading = false
          })
      } else {
        this.deviceOptions = []
      }
    },

    // 点击新增闸机按钮处理
    addGate () {
      this.isEdit = false
      // 表单验证重置
      if (this.$refs.gateForm) {
        this.$refs.gateForm.resetFields()
      }
      this.gateForm = {
        name: '',
        nameId: '',
        park: '',
        resource: '',
        sort: '',
        camera: '',
        status: '',
        charge: '',
        location: '',
        classify: '',
      }
      this.deviceOptions = []
      this.parkOptions = []
      this.resourceOptions = []
      this.showGateDialog = true
      // 获取所属车场
      this.getParkList()
      // 获取资源类型
      this.getResources()
    },

    // 确认新增/编辑闸机
    gateSubmit () {
      if (!this.isCommit) {
        this.$refs.gateForm.validate(valid => {
          if (valid) {
            // 车场详情的新增闸机
            this.isCommit = true
            let data = {
              vid: this.choseVillageInfo.vid,
              ctid: this.gateForm.park,
              equipment_id: this.gateForm.nameId,
              name: this.gateForm.name,
              number: this.gateForm.sort,
              type: '',
              camera_url: this.gateForm.camera,
              status: this.gateForm.status,
              is_free: this.gateForm.charge,
              position: this.gateForm.location,
              resources_type_id: this.gateForm.resource,
              is_enter: this.gateForm.classify,
            }

            // 闸机编辑
            if (this.isEdit) {
              data.id = this.currentObj.id
            }

            this.$axios
              .post(this.urlObj.addgate, data)
              .then(res => {
                if (res.Code === 200) {
                  this.$message({
                    type: 'success',
                    message: this.isEdit ? '闸机编辑成功！' : '闸机添加成功！'
                  })
                  this.showGateDialog = false
                  this.tableLoad()
                } else {
                  let msg = res.Message ? res.Message : this.isEdit ? '闸机编辑失败！' : '闸机添加失败！'
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

    // 指令记录数据获取
    recordTableLoad () {
      let data = {
        page: this.orderConf.curPage,
        limit: this.orderConf.limit,
        vid: this.choseVillageInfo.vid,
        position: this.location,
        keyword: this.searchVal,
        gate_id: this.cgateObj ? this.cgateObj.id : ''
      }
      // 表格处于加载状态
      this.orderConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.command_list, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.orderConf.dataTotal = res.Data.total
            // 存放查询数据
            this.orderTableData = res.Data.data
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

    // 点击指令记录处理
    orderRecord () {
      this.cgateObj = ''
      this.orderTitle = '指令记录'
      this.showOrderDialog = true
      this.recordTableLoad()
    },

    // 点击闸机名称处理
    skipRecord (obj) {
      this.cgateObj = obj
      this.orderTitle = `指令记录（${obj.name}）`
      this.showOrderDialog = true
      this.recordTableLoad()
    },

    // 指令表格每页条数改变处理
    orderSizeChange (num) {
      this.orderConf.limit = num
      // 获取一次表格数据
      this.recordTableLoad()
    },

    // 指令表格 当前页码改变处理
    orderCurrentChange (num) {
      this.orderConf.curPage = num
      // 获取一次表格数据
      this.recordTableLoad()
    },
  }
}
