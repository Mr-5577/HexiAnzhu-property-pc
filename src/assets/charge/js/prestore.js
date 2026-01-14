import prestoreCloumns from '../json/prestore-cloumns.json'
import prestoreRecord from '../json/prestore-record.json'

export default {
  name: 'prestore',
  data () {
    return {
      urlObj: {
        balancelist: this.$api.state.Charge.balancelist.url,
        balancelog: this.$api.state.Charge.balancelog.url,
        searchdata: this.$api.state.Charge.searchdata.url,
        balancemove: this.$api.state.Charge.balancemove.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        roomOfUnit: this.$api.state.Public.roomOfUnit.url,
        userOfRoom: this.$api.state.Public.userOfRoom.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: prestoreCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示记录弹框
      showRecordDialog: false,
      // 弹框表格数据
      popTableData: [],
      // 弹框表格列数据配置
      popColumns: prestoreRecord.list,
      // 弹框表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示零钱转移弹框
      showMoveDialog: false,
      // 表单数据对象
      ruleForm: {
        vname: '',
        build: '',
        unit: '',
        room: '',
        uid: '',
        money: ''
      },
      // 表单规则对象
      rules: {
        vname: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        build: [{ required: false, message: '请选择楼栋', trigger: 'change' }],
        unit: [{ required: false, message: '请选择单元', trigger: 'change' }],
        room: [{ required: false, message: '请选择房号', trigger: 'change' }],
        uid: [{ required: true, message: '请选择客户', trigger: 'change' }],
        money: [{ required: true, message: '请输入转移金额', trigger: 'blur' }]
      },
      // 楼栋
      buildOptions: [],
      // 单元
      unitOptions: [],
      // 房号
      roomOptions: [],
      // 客户
      userOptions: [],
      // 用户搜索框绑定值
      autoValue: '',
      // 用户筛选列表
      allUserList: [],
      // 当前用户信息数据
      currentUser: {},
      // 是否正在提交数据
      isCommit: false,
      // 零钱转移的 index
      mindex: 0,
      // 零钱余额
      bmoney: 0
    }
  },

  mounted () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.tableLoad()
  },

  methods: {
    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        keywords: this.searchVal.trim()
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.balancelist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.realname = item.owner ? item.owner.realname : '--'
                item.tel = item.owner ? item.owner.tel : '--'
                item.bmoney = item.owner && item.owner.balance ? item.owner.balance.money : '--'
                item.sex = item.owner ? item.owner.sex : '--'
                item.utime = item.create_time ? item.create_time : '--'
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

    // 获取弹框表格数据
    popTableLoad (data) {
      // 表格处于加载状态
      this.popConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.balancelog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.code = item.sn.sn ? item.sn.sn : '--'
                item.transferUser = item.transferowner ? item.transferowner.realname : '--'
                item.payname = item.sn.payment ? item.sn.payment.name : ''
              })
            }
            // 存放查询数据
            this.popTableData = res.Data ? res.Data : []
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

    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.searchVal = ''
      // 请求接口获取表单数据
      this.keySearch()
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

    // 点击表格查看记录
    checkRecord (index) {
      // 获取一次表格数据
      this.popTableLoad({ oid: this.tableData[index].oid })
      this.showRecordDialog = true
    },

    // 零钱转移
    balanceMove (index) {
      this.mindex = index
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.vname = this.choseVillageInfo.name
      this.bmoney = this.tableData[index].owner.balance.money
      this.showMoveDialog = true
      this.getBuildData()
    },

    // 搜索获取业主数据
    async querySearchAsync (queryStr, cb) {
      if (this.choseVillageInfo.vid) {
        if (queryStr) {
          let value = {
            keywords: queryStr,
            vid: this.choseVillageInfo.vid
          }
          let res = await this.$axios.post(this.urlObj.searchdata, value)
          if (res.Code === 200) {
            let first = {
              id: 0,
              username: '姓名',
              tel: '电话号码',
              title: '资源名称'
            }
            res.Data.returnData.unshift(first)
            this.allUserList = res.Data.returnData
            cb(res.Data.returnData)
          } else {
            this.$refs.searchInput.$children[0].blur()
          }
        } else {
          cb([])
        }
      } else {
        this.$refs.searchInput.close()
        this.$message({
          type: 'warning',
          message: '请选择项目后再搜索！'
        })
      }
    },

    // 选择用户处理
    handleSelect (user) {
      this.currentUser = user
      this.ruleForm.build = ''
      this.ruleForm.unit = ''
      this.ruleForm.room = ''
      this.unitOptions = []
      this.roomOptions = []
      this.ruleForm.uid = user.oid
      this.userOptions = [
        {
          value: user.oid,
          label: user.username
        }
      ]
    },

    // 获取楼栋数据
    getBuildData () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '楼栋数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元数据
    getUnitData () {
      let data = {
        bid: this.ruleForm.build
      }
      this.$axios
        .post(this.urlObj.unitOfBuild, data)
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '单元数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取房屋数据
    getRoomData () {
      let data = {
        unit: this.ruleForm.unit
      }
      this.$axios
        .post(this.urlObj.roomOfUnit, data)
        .then(res => {
          if (res.Code === 200) {
            this.roomOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '房屋数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取用户数据
    getUserData () {
      let data = {
        id: this.ruleForm.room
      }
      this.$axios
        .post(this.urlObj.userOfRoom, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.label = item.owner ? item.owner.realname : ''
              item.value = item.oid
            })
            this.userOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '用户数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 楼栋选择更改处理
    buildChange () {
      this.ruleForm.unit = ''
      this.ruleForm.room = ''
      this.ruleForm.uid = ''
      this.unitOptions = []
      this.roomOptions = []
      this.userOptions = []
      if (this.ruleForm.build) {
        // 获取单元数据
        this.getUnitData()
      }
    },

    // 单元选择更改处理
    unitChange () {
      this.ruleForm.room = ''
      this.ruleForm.uid = ''
      this.roomOptions = []
      this.userOptions = []
      if (this.ruleForm.unit) {
        // 获取房间数据
        this.getRoomData()
      }
    },

    // 房间选择更改处理
    roomChange () {
      this.ruleForm.uid = ''
      this.userOptions = []
      if (this.ruleForm.room) {
        // 获取用户数据
        this.getUserData()
      }
    },

    // 零钱转移提交
    moveSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            o_oid: this.tableData[this.mindex].oid,
            n_oid: this.ruleForm.uid,
            money: this.ruleForm.money
          }
          this.$axios
            .post(this.urlObj.balancemove, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '零钱转移成功！'
                })
                this.showMoveDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '零钱转移失败！'
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
  }
}
