// 导入树形结构组件
import subjectTree from '@/components/setting/common/SubjectTree.vue'
import relevanceCloumns from '../json/relevance-cloumns.json'

export default {
  name: 'relevance',
  components: {
    subjectTree
  },

  data () {
    return {
      urlObj: {
        treeData: this.$api.state.Setting.treeData.url,
        resources: this.$api.state.Setting.resources.url,
        delResources: this.$api.state.Setting.delResources.url,
        relevanceSub: this.$api.state.Setting.relevanceSub.url,
        sourceInfo: this.$api.state.Setting.sourceInfo.url,
        getResourceTypes: this.$api.state.Setting.getResourceTypes.url,
      },
      // 当前选择的科目
      currentSub: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: relevanceCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否显示批量关联弹框
      showDialog: false,
      // 是否正在加载数据
      treeLoading: false,
      // 搜索框绑定值
      filterText: '',
      // 树控件绑定值
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      // 弹框中当前选择的科目
      popCurrentSub: '',
      // 默认选择的节点 key
      checkedKeys: [],
      checked: [],
      // 表格中当前选择的数据列表
      tableSelected: [],
      // 是否正在提交数据
      isCommit: false,
      // 资源类型
      typeVal: '',
      typeOptions: [],
      // 搜索框绑定值
      keywords: '',
    }
  },

  /**
   * 计算属性
   */
  computed: {
    vid () {
      return this.$store.state.vid
    }
  },

  // 属性监听
  watch: {
    // 输入关键字筛选
    filterText (val) {
      this.$refs.resourceTree.filter(val)
    },
    // 全局项目改变处理
    vid () {
      this.tableLoad()
    }
  },

  /**
   * 生命周期
   */
  created () {
    this.getResouceType()
  },

  /**
   * 方法
   */
  methods: {
    // 获取资源类型
    getResouceType () {
      this.$axios.post(this.urlObj.getResourceTypes).then(res => {
        if (res.Code === 200) {
          this.typeOptions = res.Data ? res.Data : []
        } else {
          let msg = res.Message ? res.Message : '资源类型获取失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    // 左侧树控件选择更改
    checkChange (obj) {
      this.currentSub = obj
      this.tableLoad()
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.vid,
        subject_id: this.currentSub.id,
        model_type: this.typeVal,
        name: this.keywords
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.resources, data)
        .then(res => {
          if (res.Code === 200) {
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

    // 点击批量关联设置按钮处理
    batchHandle () {
      this.filterText = ''
      this.treeData = []
      this.showDialog = true
    },

    // 科目选择更改处理
    subChange (obj) {
      this.popCurrentSub = obj
      this.treeData = []
      if (obj.is_end == 1) {
        // 获取资源树形结构数据
        let data = {
          vid: this.vid,
          type: obj.subject_type,
          subject_village_id: obj.id,
          resource_type_id: obj.resource_type_id
        }
        this.getVillageTree(data)
      }
    },

    // 树形结构遍历方法
    getTreeKeys (data) {
      for (var i in data) {
        if (data[i].checked) {
          this.checked.push(data[i].node_id)
        }
        if (data[i].children) {
          this.getTreeKeys(data[i].children)
        }
      }
    },

    // 获取树形结构数据
    getVillageTree (data) {
      this.treeLoading = true
      this.$axios
        .post(this.urlObj.sourceInfo, data)
        .then(res => {
          if (res.Code === 200) {
            this.treeData = res.Data ? res.Data : []
            this.checked = []
            this.getTreeKeys(this.treeData)
            this.checkedKeys = this.checked
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.treeLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
          this.treeLoading = false
        })
    },

    // 项目数控件搜索
    filterNode (value, data) {
      if (!value) return true
      if (data.name) {
        return data.name.indexOf(value) !== -1
      } else {
        return false
      }
    },

    // 批量关联确认处理
    confirm () {
      let tree = this.$refs.resourceTree
      let arr = tree.getCheckedNodes()
      let checked = []
      arr.forEach(item => {
        if (item.is_end && item.is_end == 1) {
          let obj = {
            id: item.id,
            oid: item.oid ? item.oid : 0,
            resourcesType: item.resourcesType ? item.resourcesType : '',
            resources_type_id: item.resources_type_id
              ? item.resources_type_id
              : 0
          }
          checked.push(obj)
        }
      })
      if (this.popCurrentSub.id && checked.length > 0) {
        this.isCommit = true
        let data = {
          vid: this.vid,
          type: this.popCurrentSub.subject_type,
          subject_village_id: this.popCurrentSub.id,
          resources: checked,
          resources_type_id: this.popCurrentSub.resource_type_id
        }
        this.batchRelevance(data)
      } else if (!this.popCurrentSub.id) {
        this.$message({
          type: 'warning',
          message: '请选择科目和资源！'
        })
      } else if (checked.length == 0) {
        this.$message({
          type: 'warning',
          message: '至少选择一个资源！'
        })
      }
    },

    // 批量关联请求
    batchRelevance (data) {
      this.$axios
        .post(this.urlObj.relevanceSub, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '批量关联成功！',
              type: 'success'
            })
          } else {
            let msg = res.Message ? res.Message : '批量关联失败！'
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
    },

    // 表格多选改变处理
    selectionChange (arr) {
      this.tableSelected = arr
    },

    // 表格删除处理
    resourceDel (index) {
      this.$confirm('确定删除当前资源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: [this.tableData[index].id]
          }
          this.delRequest(data)
        })
        .catch(() => { })
    },

    // 点击批量删除按钮处理
    batchDel () {
      this.$confirm('确定要批量删除当前选择的资源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = this.tableSelected.map(item => item.id)
          this.delRequest({ id: ids })
        })
        .catch(() => { })
    },

    // 删除请求
    delRequest (data) {
      this.$axios
        .post(this.urlObj.delResources, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            // 重新获取一次表格数据
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '删除失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    }
  }
}
