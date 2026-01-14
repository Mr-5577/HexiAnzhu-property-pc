// 导入表格json 文件
import kinsfolkTable from '@/assets/means/json/kinsfolk.json'
// 导入表格json 文件
import logTable from '@/assets/means/json/log-table.json'

export default {
  name: 'clientManage',
  data () {
    return {
      // 接口对象
      urlObj: {
        clientTree: this.$api.state.Means.clientTree.url,
        clientSearch: this.$api.state.Means.clientSearch.url,
        clientDetail: this.$api.state.Means.clientDetail.url,
        userType: this.$api.state.Means.userType.url,
        userRooms: this.$api.state.Means.userRooms.url,
        folkstype: this.$api.state.Means.folkstype.url,
        addClient: this.$api.state.Means.addClient.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        roomOfUnit: this.$api.state.Public.roomOfUnit.url,
        editowner: this.$api.state.Means.editowner.url,
        logData: this.$api.state.Means.logData.url,
      },
      // 是否显示新增客户弹框
      isShow: false,
      // 是否正在加载树形数据
      treeLoading: false,
      // 是否正在加载客户详情数据
      isLoading: false,
      // 搜索框绑定值
      filterText: '',
      // 树控件数据
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      },
      // 用户信息列表
      userInfos: [],
      // 楼栋、单元、房号选择列表
      roomInfos: [],
      // 用户搜索框绑定值
      userSearch: '',
      // 当前选择的用户
      selectUser: '',
      // 业主列表
      allUserList: [],
      // 是否正在加载用户数据
      userLoading: false,
      // 是否正在加载更多
      loadMore: false,
      // 没有更多用户数据
      nomore: false,
      // 当前选择的客户
      currentUser: '',
      // 是否展开租用房产
      houseActive: false,
      // 是否展开固定车位
      fixcarActive: false,
      // 是否展开月租车位
      monthcarActive: false,
      // 是否展开非机动车
      novehicleActive: false,
      // 当前用户详情数据
      userDetail: '',
      // 房间表格数据
      tableData: [],
      // 表格配置项
      columns: kinsfolkTable.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否正在提交数据
      isCommit: false,
      root: '',
      resolve: '',
      // 当前展开的项目 id
      expNode: null,
      // 是否显示编辑弹框
      showEditDialog: false,
      // 表单数据对象
      ruleForm: {
        uname: '',
        sex: '',
        tel: '',
        idcard: ''
      },
      rules: {
        uname: [{ required: this.$menu.getters.judgeRole('Btn-b884fRdAyqhSEuFfQG1257Sr') ? true : false, message: '请输入客户姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择客户性别', trigger: 'change' }],
        tel: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }]
      },
      // 新增客户表单对象
      addForm: {
        uname: '',
        sex: '',
        tel: '',
        idcard: '',
        barea: '',
        village: '',
        otype: '',
        charge: '',
        relation: '',
        build: '',
        unit: '',
        room: ''
      },
      addRules: {
        uname: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择客户性别', trigger: 'change' }],
        tel: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        barea: [
          { required: true, message: '请选择所属大区', trigger: 'change' }
        ],
        village: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        otype: [
          { required: true, message: '请选择客户类型', trigger: 'change' }
        ],
        charge: [
          { required: true, message: '请选择是否计费', trigger: 'change' }
        ],
        relation: [
          { required: true, message: '请选择关系', trigger: 'change' }
        ],
        build: [{ required: false, message: '请选择楼栋', trigger: 'change' }],
        unit: [{ required: false, message: '请选择单元', trigger: 'change' }],
        room: [{ required: false, message: '请选择房号', trigger: 'change' }]
      },
      // 所属大区
      areaOptions: [],
      // 所属项目
      villageOptions: [],
      // 客户类型
      typeOptions: [],
      // 关系列表
      relationOptions: [],
      // 楼栋
      buildOptions: [],
      // 单元
      unitOptions: [],
      // 房号
      roomOptions: [],
      // 是否显示变更日志弹框
      isShowLog: false,
      // 变更日志表格数据
      logTableData: [],
      logColumns: logTable.list,
      logConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      }
    }
  },

  // 属性监听
  watch: {
    filterText () {
      // this.$refs.tree.filter(val)
      if (this.expNode) {
        let node = this.$refs.tree.getNode(this.expNode.nodeid)
        node.loaded = false
        node.expand()
      }
    }
  },

  /**
   * 方法
   */
  methods: {
    // 获取树形结构数据
    async getTreeData (resolve) {
      // 获取城市、项目数据
      let res = await this.$axios.post(this.urlObj.clientTree)
      this.treeLoading = false
      let arr = []
      if (res.Code == 200) {
        res.Data.forEach(item => {
          item.nodeid = item.type + item.id
          item.disabled = true
        })
        arr = res.Data
        this.treeData = res.Data
      } else {
        this.$message({
          message: '获取数据失败！',
          type: 'error'
        })
      }
      resolve(arr)
    },

    // 获取树形结构 用户 数据
    async getUserTree (node, resolve) {
      // 获取城市、项目数据
      let data = {
        vid: node.data.id,
        page: 1,
        limit: 20,
        keywords: this.filterText
      }
      let res = await this.$axios.post(this.urlObj.clientSearch, data)
      let arr = []
      if (res.Code == 200) {
        res.Data.data.forEach(item => {
          item.nodeid = item.unique
        })
        arr = res.Data.data
      } else {
        this.$message({
          message: '获取数据失败！',
          type: 'error'
        })
      }
      resolve(arr)
      this.loadMoreUser(node)
    },

    // 显示/加载更多
    loadMoreUser (node) {
      this.$nextTick(() => {
        setTimeout(() => {
          let tree = this.$refs.tree.$el
          let current = tree.querySelector(
            '.el-tree-node__children .el-tree-node.is-expanded .el-tree-node__children'
          )
          let mel = current.querySelector('.moreDom')
          if (mel) {
            current.removeChild(mel)
          }
          let more = document.createElement('div')
          more.classList.add('moreDom')
          more.innerText =
            node.childNodes.length < 20 ? '没有更多啦！' : '加载更多'
          more.style.textAlign = 'center'
          more.style.fontSize = '14px'
          more.style.padding = '10px'
          more.style.cursor = 'pointer'
          more.style.color = node.childNodes.length < 20 ? '#ccc' : '#333'
          current.appendChild(more)
          let that = this
          function loadmore (e) {
            e.stopPropagation()
            more.innerText = '加载中...'
            // 获取客户数据
            let data = {
              vid: node.data.id,
              page: Math.ceil(node.childNodes.length / 20) + 1,
              limit: 20,
              keywords: this.filterText
            }
            that.$axios
              .post(that.urlObj.clientSearch, data)
              .then(res => {
                if (res.Code === 200) {
                  if (res.Data.data.length > 0) {
                    current.removeChild(more)
                    res.Data.data.forEach(item => {
                      item.nodeid = item.unique
                    })
                    let arr = node.childNodes.map(item => item.data)
                    arr = arr.concat(res.Data.data)
                    that.$refs.tree.updateKeyChildren(node.data.nodeid, arr)
                    that.$nextTick(() => {
                      more.innerText = '加载更多'
                      current.appendChild(more)
                    })
                  } else {
                    more.innerText = '没有更多啦！'
                    more.style.color = '#ccc'
                    more.removeEventListener('click', loadmore, false)
                    more.addEventListener(
                      'click',
                      e => {
                        e.stopPropagation()
                      },
                      false
                    )
                  }
                } else {
                  let msg = res.Message ? res.Message : '数据获取失败！'
                  that.$message({
                    type: 'error',
                    message: msg
                  })
                }
              })
              .catch(() => {
                that.$message({
                  type: 'error',
                  message: '数据获取失败！'
                })
              })
          }
          if (node.childNodes.length < 20) {
            more.addEventListener(
              'click',
              e => {
                e.stopPropagation()
              },
              false
            )
          } else {
            more.addEventListener('click', loadmore, false)
          }
        })
      })
    },

    // 节点展开处理
    nodeExpand (data) {
      if (data.type === 'village') {
        this.expNode = {
          id: data.id,
          nodeid: data.nodeid
        }
      } else {
        this.expNode = null
      }
    },

    // 获取客户详情
    getClientDetail (data) {
      this.isLoading = true
      this.currentUser = data
      this.houseActive = false
      this.fixcarActive = false
      this.monthcarActive = false
      this.novehicleActive = false
      this.$axios
        .post(this.urlObj.clientDetail, data)
        .then(res => {
          if (res.Code === 200) {
            let binds = []
            let rents = []
            res.Data.data.owner_rooms.forEach(item => {
              if (item.is_owner) {
                binds.push(item)
              } else {
                rents.push(item)
              }
            })
            res.Data.data.binds = binds
            res.Data.data.rents = rents
            this.userDetail = res.Data.data
            let arr = []
            res.Data.folks.forEach(item => {
              let obj = {
                name: item.folk_user.realname,
                sex: item.folk_user.sex,
                relation: item.type.name,
                tel: item.folk_user.tel,
                idcard: item.folk_user.idcard
              }
              arr.push(obj)
            })
            this.tableData = arr
          } else {
            this.$message({
              type: 'error',
              message: '客户详情数据获取失败！'
            })
          }
          this.isLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '客户详情数据获取失败！'
          })
          this.isLoading = false
        })
    },

    // 加载节点数据
    async loadNode (node, resolve) {
      this.root = node
      this.resolve = resolve
      if (node.level == 0) {
        this.treeLoading = true
        this.getTreeData(resolve)
      } else if (node.level == 2) {
        this.getUserTree(node, resolve)
      } else {
        node.data.children.forEach(item => {
          item.disabled = true
          item.nodeid = item.type + item.id
        })
        resolve(node.data.children)
      }
    },

    // 节点点击事件
    nodeClick (data) {
      this.$nextTick(() => {
        if (!data.disabled) {
          this.$refs.tree.setCheckedNodes([data])
          if (!this.currentUser || this.currentUser.id != data.id) {
            this.getClientDetail(data)
          }
        }
      })
    },

    // 节点复选框点击事件
    nodeCheck (data) {
      if (!data.disabled) {
        this.$refs.tree.setCheckedNodes([data])
        if (!this.currentUser || this.currentUser.id != data.id) {
          this.getClientDetail(data)
        }
      }
    },

    // 获取客户类别
    getUserType () {
      this.$axios
        .post(this.urlObj.userType)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.id = item.value
            })
            this.typeOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '客户类别数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取亲属关系
    getFolkstype () {
      this.$axios
        .post(this.urlObj.folkstype)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.id = item.value
            })
            this.relationOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '亲属关系数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击新增客户处理
    openDialog () {
      // 表单验证重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      let options = []
      this.treeData.forEach(item => {
        let obj = {
          label: item.label,
          value: item.id
        }
        options.push(obj)
      })
      this.areaOptions = options
      this.userSearch = ''
      this.selectUser = ''
      this.allUserList = []
      this.nomore = false
      this.isShow = true
      // 获取用户类型
      this.getUserType()
    },

    // 大区值改变处理
    bareaChange (newVal) {
      this.addForm.village = ''
      this.villageOptions = []
      this.userSearch = ''
      this.allUserList = []
      this.selectUser = ''
      this.addForm.build = ''
      this.buildOptions = []
      this.addForm.unit = ''
      this.unitOptions = []
      this.addForm.room = ''
      this.roomOptions = []
      if (newVal) {
        let area = this.treeData.find(item => {
          return item.id == newVal
        })
        this.villageOptions = area.children
      }
    },

    // 项目值改变处理
    villageChange (newVal) {
      this.userSearch = ''
      this.allUserList = []
      this.selectUser = ''
      this.addForm.build = ''
      this.buildOptions = []
      this.addForm.unit = ''
      this.unitOptions = []
      this.addForm.room = ''
      this.roomOptions = []
      if (newVal) {
        // 获取楼栋
        this.getBuildData()
      }
    },

    // 获取楼栋数据
    getBuildData () {
      let data = {
        vid: this.addForm.village
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
        bid: this.addForm.build
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
        unit: this.addForm.unit
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

    // 客户类型更改处理
    otypeChange (value) {
      if (value == 4) {
        // 获取亲属关系
        this.getFolkstype()
      }
    },

    // 楼栋值改变处理
    buildChange (value) {
      this.addForm.unit = ''
      this.unitOptions = []
      this.addForm.room = ''
      this.roomOptions = []
      if (value) {
        this.getUnitData()
      }
    },

    // 单元值改变处理
    unitChange (value) {
      this.addForm.room = ''
      this.roomOptions = []
      if (value) {
        this.getRoomData()
      }
    },

    // 获取用户 房号
    getUserRooms (paging) {
      if (this.addForm.village) {
        if (paging) {
          this.loadMore = true
        } else {
          this.nomore = false
          this.userLoading = true
        }
        let data = {
          keywords: this.userSearch.trim(),
          vid: this.addForm.village,
          page: paging ? Math.ceil(this.allUserList.length / 20) + 1 : 1,
          limit: 20
        }
        this.$axios
          .post(this.urlObj.userRooms, data)
          .then(res => {
            if (res.Code === 200) {
              if (!paging) {
                this.selectUser = ''
              }
              if (res.Data.data.length > 0) {
                res.Data.data.forEach(item => {
                  item.active = false
                })
                this.allUserList = paging
                  ? this.allUserList.concat(res.Data.data)
                  : res.Data.data
              } else if (paging) {
                this.nomore = true
              } else {
                this.allUserList = []
              }
            } else {
              let msg = res.Message ? res.Message : '用户数据获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.userLoading = false
            this.loadMore = false
          })
          .catch(err => {
            this.userLoading = false
            this.loadMore = false
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择所属项目后再试一次！'
        })
      }
    },

    // 用户列表数据选择处理
    liClick (index) {
      let arr = this.allUserList.slice(0)
      arr.forEach(item => {
        item.active = false
      })
      arr[index].active = true
      this.selectUser = arr[index]
      this.allUserList = arr
    },

    // 弹框关闭处理
    close () {
      this.isShow = false
    },

    // 点击提交保存按钮处理
    confirm () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let data = {
            village_id: this.addForm.village,
            realname: this.addForm.uname,
            sex: this.addForm.sex,
            tel: this.addForm.tel,
            idcard: this.addForm.idcard,
            owner_type: this.addForm.otype
          }
          // 选择亲属情况
          if (this.addForm.otype === 4) {
            if (this.selectUser && this.selectUser.oid) {
              data.bind_room = 1
              data.roomid = this.selectUser.roomid
              data.bind_folks = 1
              data.bind_owner_id = this.selectUser.oid
              data.bind_folk_id = this.addForm.relation
            } else {
              this.$message({
                type: 'warning',
                message: '请选择业主'
              })
              return
            }
          } else {
            data.bind_room = this.addForm.room ? 1 : 0
            data.roomid = this.addForm.room
            data.bind_folks = 0
            data.charge_type = this.addForm.charge
          }

          this.isCommit = true
          // 获取资源类别详情
          this.$axios
            .post(this.urlObj.addClient, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '客户添加成功！'
                })
                this.isShow = false
                // 重新获取一次资源类别数据
                this.loadNode(this.root, this.resolve)
              } else {
                let msg = res.Message ? res.Message : '数据提交失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.isCommit = false
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '数据提交失败！'
              })
              this.isCommit = false
            })
        }
      })
    },

    // 点击编辑按钮处理
    editHandle () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.uname = this.userDetail.realname
      this.ruleForm.sex = this.userDetail.sex == '男' ? 1 : 2
      this.ruleForm.tel = this.userDetail.tel
      this.ruleForm.idcard = this.userDetail.idcard
      this.showEditDialog = true
    },

    // 编辑提交验证
    editSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.userDetail.id,
            sex: this.ruleForm.sex,
            idcard: this.ruleForm.idcard,
            tel: this.ruleForm.tel
          }
          if (this.$menu.getters.judgeRole('Btn-b884fRdAyqhSEuFfQG1257Sr')) {
            data.realname = this.ruleForm.uname
          }
          this.$axios
            .post(this.urlObj.editowner, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '业主信息修改成功！'
                })
                this.showEditDialog = false
                // 重新获取一次业主详情
                this.getClientDetail(this.currentUser)
                // 修改左侧树形结构数据
                let node = this.$refs.tree.getNode(this.currentUser)
                node.data.label = data.realname
              } else {
                let msg = res.Message ? res.Message : '业主信息修改失败！'
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

    // 点击变更日志按钮处理
    logHandle () {
      this.isShowLog = true
      this.getLogTableData()
    },

    // 获取日志表格数据
    getLogTableData () {
      // 表格处于加载状态
      this.logConf.loadStatus = true
      let data = {
        page: this.logConf.curPage,
        limit: this.logConf.limit,
        id: this.currentUser.id,
        type: 'owner'
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.logData, data)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            res.Data.data.forEach(item => {
              let obj = {
                createuser: item.createuser ? item.createuser.realname : '',
                create_time: item.create_time,
                content: item.content
              }
              arr.push(obj)
            })
            // 存放查询数据
            this.logTableData = arr
            // 关闭加载状态
            this.logConf.loadStatus = false
            // 清空空数据提示
            this.logConf.emptyText = ''
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
            this.logTableData = []
            this.logConf.emptyText = res.Message
            this.logConf.dataTotal = 0
            this.logConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.logTableData = []
          this.logConf.emptyText = '服务器连接失败...'
          this.logConf.dataTotal = 0
          this.logConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    logSizeChange (num) {
      this.logConf.limit = num
      // 获取一次表格数据
      this.getLogTableData()
    },

    // 当前页码改变处理
    logCurrentChange (num) {
      this.logConf.curPage = num
      // 获取一次表格数据
      this.getLogTableData()
    },
  }
}
