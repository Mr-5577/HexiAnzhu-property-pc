// 导入表格json 文件
import logTable from '@/assets/means/json/log-table.json'

export default {
  name: 'category',
  data () {
    return {
      // 接口对象
      urlObj: {
        treeData: this.$api.state.Means.treeData.url,
        resourceType: this.$api.state.Means.resourceType.url,
        resourceInfo: this.$api.state.Means.resourceInfo.url,
        resourceAdd: this.$api.state.Means.resourceAdd.url,
        resourceStop: this.$api.state.Means.resourceStop.url,
        resourceOptions: this.$api.state.Means.resourceOptions.url,
        editresources: this.$api.state.Means.editresources.url,
        logData: this.$api.state.Means.logData.url,
      },
      // 是否正在加载左侧列表数据
      treeLoading: false,
      // 是否正在加载类型详情数据
      isLoading: false,
      // 类型列表
      typeList: [],
      // 资源类型详情数据对象
      typeInfo: {},
      // 当前选择的资源类别 id
      currenTypeId: '',
      // 当前选择的资源类别名称
      currenTypeName: '',
      // 是否显示添加类型弹框
      isShow: false,
      // 资源名称绑定值
      typeName: '',
      // 类别下拉框绑定值
      typeValue: [],
      // 备注绑定值
      markValue: '',
      // 是否正在提交数据
      isCommit: false,
      // 是否正在停用
      isStop: false,
      // 是否显示修改资源弹框
      showEdit: false,
      // 修改弹框资源名称
      etypeName: '',
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      },
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

  /**
   * 生命周期
   */
  created () {
    this.getResourceType()
  },

  /**
   * 方法
   */
  methods: {
    // 节点点击事件
    nodeClick (data) {
      this.$nextTick(() => {
        if (!data.disabled) {
          this.$refs.tree.setCheckedNodes([data])
          this.currenTypeId = data.id
          this.currenTypeName = data.label
          // 获取节点详情
          this.getResourceInfo(data.id)
        }
      })
    },

    // 节点复选框点击事件
    nodeCheck (data) {
      if (!data.disabled) {
        this.$refs.tree.setCheckedNodes([data])
        this.currenTypeId = data.id
        this.currenTypeName = data.label
        // 获取节点详情
        this.getResourceInfo(data.id)
      }
    },

    // 获取资源类别数据
    getResourceType () {
      this.treeLoading = true
      this.$axios
        .post(this.urlObj.resourceType)
        .then(res => {
          if (res.Code === 200) {
            this.typeList = res.Data
          } else {
            this.$message({
              type: 'error',
              message: '获取资源类别数据失败！'
            })
          }
          this.treeLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取资源类别数据失败！'
          })
          this.treeLoading = false
        })
    },

    // 获取资源类别详情数据
    getResourceInfo (id) {
      this.isLoading = true
      this.$axios
        .post(this.urlObj.resourceInfo, { id: id })
        .then(res => {
          if (res.Code === 200) {
            this.typeInfo = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取资源类别详情失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取资源类别详情失败！'
          })
          this.isLoading = false
        })
    },

    // 点击新增资源类别处理
    openDialog () {
      this.typeName = ''
      this.typeValue = []
      this.markValue = ''
      this.isShow = true
    },

    // 弹框关闭处理
    close () {
      this.isShow = false
    },

    // 点击提交保存按钮处理
    confirm () {
      if (!this.typeName.trim() && this.typeValue.length === 0) {
        this.$message({
          type: 'warning',
          message: '请填写资源名称和资源类别！'
        })
      } else if (!this.typeName.trim()) {
        this.$message({
          type: 'warning',
          message: '请填写资源名称！'
        })
      } else if (this.typeValue.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择资源类别！'
        })
      } else {
        let data = {
          name: this.typeName.trim(),
          pid: this.typeValue[this.typeValue.length - 1],
          remarks: this.markValue.trim()
        }
        this.isCommit = true
        this.$axios
          .post(this.urlObj.resourceAdd, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '资源类别添加成功！'
              })
              this.isShow = false
              // 重新获取一次资源类别数据
              this.getResourceType()
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
    },

    // 点击停用按钮处理
    typeStop () {
      this.$confirm('此操作将删除当前资源类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 停用请求
        this.isStop = true
        this.$axios
          .post(this.urlObj.resourceStop, { id: this.currenTypeId })
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: `${this.currenTypeName}已停用！`
              })
              this.getResourceType()
              this.currenTypeId = ''
              this.currenTypeName = ''
            } else {
              let msg = res.Message ? res.Message : '停用失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isStop = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '停用失败！'
            })
            this.isStop = false
          })
      })
    },

    // 点击修改按钮处理
    editHandle () {
      this.etypeName = this.typeInfo.name
      this.showEdit = true
    },

    // 编辑提交
    editSubmit () {
      if (this.etypeName.trim()) {
        this.isCommit = true
        let data = {
          id: this.typeInfo.id,
          name: this.etypeName
        }
        this.$axios
          .post(this.urlObj.editresources, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '资源类型修改成功！'
              })
              this.showEdit = false
              this.getResourceType()
              // 获取详情数据
              this.getResourceInfo(this.typeInfo.id)
            } else {
              this.$message({
                type: 'error',
                message: '资源类型修改失败！'
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
          message: '请输入资源名称'
        })
      }
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
        id: this.currenTypeId,
        type: 'resources_type'
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
