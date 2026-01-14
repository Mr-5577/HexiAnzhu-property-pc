import icColumns from '../json/ic-columns.json'

export default {
  name: 'icmanage',
  data () {
    return {
      urlObj: {
        iclists: this.$api.state.Means.iclists.url,
        reclaim: this.$api.state.Means.reclaim.url,
        issueCar: this.$api.state.Means.issueCar.url,
        userSearch: this.$api.state.Means.userSearch.url,
        singlecard: this.$api.state.Means.singlecard.url,
        batchcard: this.$api.state.Means.batchcard.url,
        carddetail: this.$api.state.Means.carddetail.url,
        userVillage: this.$api.state.Public.userVillage.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        getOwners: this.$api.state.Public.getOwners.url,
        cardAgainUrl: this.$api.state.Means.cardAgain.url,
        card_delete: this.$api.state.Means.card_delete.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 状态绑定值
      statusVal: '',
      statusOptions: [
        {
          value: -1,
          label: '未激活'
        },
        {
          value: 1,
          label: '使用中'
        }
      ],
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: icColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前选择的表格数据列表
      tableSelected: [],
      // 是否显示回收IC卡弹框
      showRecycleDialog: false,
      // 表单数据对象
      ruleForm: {
        icCode: '',
        icId: ''
      },
      // 表单验证规则
      rules: {
        icCode: [
          { required: true, message: '请输入IC卡卡号', trigger: 'blur' }
        ],
        icId: [{ required: true, message: '请输入IC卡名称', trigger: 'blur' }]
      },
      // 是否正在提交数据
      isCommit: false,
      // 当前操作的表格数据的 index
      currentIndex: 0,
      // 是否显示ic卡详情
      showDetailDialog: false,
      // IC卡详情数据
      detailData: {},
      // 是否显示批量制卡弹框
      showBatchDialog: false,
      // 是否显示单独制卡弹框
      showSingleDialog: false,
      // 项目
      villageVal: '',
      villageOptions: [],
      // 楼栋
      buildVal: '',
      buildOptions: [],
      // 单元
      unitVal: '',
      unitOptions: [],
      // 筛选用户列表
      userList: [],
      // 用户搜索框绑定值
      autoValue: '',
      // 当前用户信息数据
      currentUser: {
        name: '张三',
        type: '业主',
        room: '1-1-01-01',
        cards: [
          {
            card: '',
            money: '20.00'
          }
        ]
      },
      // 用户列表
      allUserList: [],
      // 没有更多数据
      nomore: false,
      // 是否正在获取 用户
      userLoading: false
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
    this.getUserVillage()
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

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        status: this.statusVal,
        keyword: this.searchVal,
        page: this.conf.curPage,
        limit: this.conf.limit
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.iclists, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.vname =
                  item.village && item.village.villagename
                    ? item.village.villagename
                    : '--'
                item.ownername =
                  item.carnonmotor && item.carnonmotor.non_owner_name
                    ? item.carnonmotor.non_owner_name
                    : item.owner
                      ? item.owner.realname
                      : '--'
                item.ownertel =
                  item.carnonmotor && item.carnonmotor.non_owner_tel
                    ? item.carnonmotor.non_owner_tel
                    : item.owner
                      ? item.owner.tel
                      : '--'
              })
            }
            // 存放查询数据
            this.tableData = res.Data.data
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
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

    // 表格选择处理
    selectionChange (value) {
      this.tableSelected = value
    },

    // 点击回收IC卡按钮
    recycleCard () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showRecycleDialog = true
    },

    // 点击确认回收按钮处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            code: this.ruleForm.icCode,
            name: this.ruleForm.icId
          }
          this.$axios
            .post(this.urlObj.reclaim, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: 'IC卡回收成功！'
                })
                // 关闭弹框并重新获取数据
                this.showRecycleDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : 'IC卡回收失败！'
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
    },

    // 点击表格详情按钮处理
    cardDetail (index) {
      this.showDetailDialog = true
      this.getCardDetail(this.tableData[index].id)
    },
    cardAgain (index) {
      this.$confirm('确认重新下发此卡片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.cardAgainUrl, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '下发成功'
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
        .catch(() => { })
    },

    // 删除IC卡
    icDelet (index) {
      this.$confirm(`确定要删除当前IC卡吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .post(this.urlObj.card_delete, { id: this.tableData[index].id })
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: 'IC卡删除成功！'
                })
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : 'IC卡删除失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 获取IC卡详情数据
    getCardDetail (id) {
      this.$axios
        .post(this.urlObj.carddetail, { id: id })
        .then(res => {
          if (res.Code === 200) {
            this.detailData = res.Data[0]
          } else {
            let msg = res.Message ? res.Message : 'IC卡详情数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取用户权限下的项目数据
    getUserVillage () {
      this.$axios
        .post(this.urlObj.userVillage)
        .then(res => {
          if (res.Code === 200) {
            this.villageOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取项目数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取项目数据失败!'
          })
        })
    },

    // 获取楼栋数据
    getBuildData () {
      this.$axios
        .post(this.urlObj.buildOfVillage, { vid: this.villageVal })
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼栋数据失败!'
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
      this.$axios
        .post(this.urlObj.unitOfBuild, { bid: this.buildVal })
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取单元数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元下的业主
    getUserData () {
      this.userLoading = true
      let data = {
        vid: this.villageVal,
        bid_ids: [this.buildVal]
      }
      if (this.unitVal) {
        data.unit_ids = [this.unitVal]
      }
      this.$axios
        .post(this.urlObj.getOwners, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.cards = [
                {
                  card: '',
                  money: '20.00'
                }
              ]
            })
            this.userList = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取业主数据失败!'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.userLoading = false
        })
        .catch(() => { })
    },

    // 项目选择更改
    villChange (val) {
      this.buildVal = ''
      this.buildOptions = []
      this.unitVal = ''
      this.unitOptions = []
      this.userList = []
      if (val) {
        this.getBuildData()
      }
    },

    // 楼栋选择更改处理
    buildChange (val) {
      this.unitVal = ''
      this.unitOptions = []
      this.userList = []
      if (val) {
        this.getUnitData()
        this.getUserData()
      }
    },

    // 单元选择更改处理
    unitChange (val) {
      this.userList = []
      if (val) {
        this.getUserData()
      }
    },

    // 点击批量制卡处理
    bathCard () {
      this.villageVal = Number(this.choseVillageInfo.vid)
      this.buildVal = ''
      this.buildOptions = []
      this.unitVal = ''
      this.unitOptions = []
      this.userList = []
      this.getBuildData()
      this.showBatchDialog = true
    },

    // 批量制卡提交处理
    makeCard () {
      if (this.userList.length > 0) {
        let flag = true
        let userArr = []
        this.userList.forEach(item => {
          let arr = []
          item.cards.forEach(itm => {
            if (itm.card && itm.money) {
              arr.push({
                code: itm.card,
                money: itm.money,
                oid: item.oid
              })
            } else {
              flag = false
            }
          })
          userArr.push(arr)
        })
        if (flag) {
          this.isCommit = true
          let data = {
            vid: this.villageVal,
            cards: userArr
          }
          this.$axios
            .post(this.urlObj.batchcard, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '批量制卡成功！'
                })
                this.showBatchDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '批量制卡失败!'
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
        } else {
          this.$message({
            type: 'warning',
            message: '制卡信息不完整！'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择用户并填写制卡信息！'
        })
      }
    },

    // 点击单张制卡处理
    singleCard () {
      this.currentUser = null
      this.showSingleDialog = true
    },

    // 添加卡号
    addCard (obj) {
      obj.cards.unshift({
        card: '',
        money: '20.00'
      })
    },

    // 删除卡号
    delCard (obj, i) {
      obj.cards.splice(i, 1)
    },

    // 删除用户
    delUser (index) {
      this.userList.splice(index, 1)
    },

    // 搜索获取过户业主数据
    async querySearchAsync (queryStr, cb) {
      let value = {
        keywords: queryStr,
        page: 1,
        limit: 20,
        vid: this.choseVillageInfo.vid
      }
      let res = await this.$axios.post(this.urlObj.userSearch, value)
      if (res.Code === 200) {
        let first = {
          id: 0,
          realname: '姓名',
          sex: '性别',
          tel: '电话号码'
        }
        res.Data.data.unshift(first)
        this.allUserList = res.Data.data
        this.nomore = false
        cb(res.Data.data)
      } else {
        this.$refs.searchInput.$children[0].blur()
      }
    },

    // 加载更多用户数据
    async loadMore () {
      if (!this.nomore) {
        let value = {
          keywords: this.ruleForm.uname,
          page: Math.ceil(this.allUserList.length / 20) + 1,
          limit: 20
        }
        let res = await this.$axios.post(
          this.$api.state.Means.userSearch.url,
          value
        )
        if (res.Code === 200) {
          if (res.Data.data.length > 0) {
            this.allUserList = this.allUserList.concat(res.Data.data)
            this.$refs.searchInput.suggestions = this.allUserList
          } else {
            this.nomore = true
          }
        }
      }
    },

    // 选择用户处理
    handleSelect (user) {
      user.cards = [
        {
          card: '',
          money: '20.00'
        }
      ]
      this.currentUser = JSON.parse(JSON.stringify(user))
    },

    // 单张制卡 添加卡号
    aloneAddCard () {
      let obj = JSON.parse(JSON.stringify(this.currentUser))
      obj.cards.unshift({
        card: '',
        money: '20.00'
      })
      this.currentUser = obj
    },

    // 单张制卡 删除卡号
    aloneDelCard (i) {
      this.currentUser.cards.splice(i, 1)
    },

    // 单张制卡 提交
    aloneMakeCard () {
      if (this.currentUser && this.currentUser.cards.length > 0) {
        let flag = this.currentUser.cards.every(item => item.card && item.money)
        if (flag) {
          this.isCommit = true
          let data = {
            vid: this.choseVillageInfo.vid,
            oid: this.currentUser.id,
            cards: this.currentUser.cards.map(item => {
              return {
                code: item.card,
                money: item.money
              }
            })
          }
          this.$axios
            .post(this.urlObj.singlecard, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '制卡成功！'
                })
                this.showSingleDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '制卡失败!'
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
        } else {
          this.$message({
            type: 'warning',
            message: '制卡信息不完整！'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择业主并填写制卡信息！'
        })
      }
    }
  }
}
