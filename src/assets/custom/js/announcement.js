// 引入富文本编辑器
import Editor from 'wangeditor'
import invoiceCloumns from '../json/invoice-cloumns.json'

export default {
  name: 'announcement',
  data() {
    return {
      urlObj: {
        userVillage: this.$api.state.Public.userVillage.url,
        circularlist: this.$api.state.Custom.circularlist.url,
        addcircular: this.$api.state.Custom.addcircular.url,
        editcircular: this.$api.state.Custom.editcircular.url,
        circulardetail: this.$api.state.Custom.circulardetail.url,
        circularfield: this.$api.state.Custom.circularfield.url,
        delcircular: this.$api.state.Custom.delcircular.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: invoiceCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 发票状态绑定值
      statusVal: '',
      // 发票状态数据列表
      statusOptions: [],
      // 发票面值绑定值
      faceVal: '',
      // 发票面值数据列表
      faceOptions: [],
      // 日期选择值
      dateVal: '',
      // 当前弹框类型
      type: '',
      // 当前编辑项的 index
      currentIndex: '',
      // 是否显示新增/编辑弹框
      showEditDialog: false,
      // 富文本对象
      editor: null,
      // 当前操作类型
      type: 'add',
      // 小区列表数据
      villageList: [],
      // 表单数据对象
      ruleForm: {
        village: '',
        title: '',
        content: ''
      },
      // 表单验证规则
      rules: {
        village: [{ required: true, message: '请选择小区', trigger: 'change' }],
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'change' }
        ]
      },
      // 是否正在提交数据
      isCommit: false
    }
  },

  /**
   * 计算属性
   */
  computed: {
    vid() {
      return this.$store.state.vid
    }
  },

  /**
   *
   */
  watch: {
    vid() {
      this.tableLoad()
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 富文本初始化
    editorInit() {
      this.editor = new Editor(this.$refs.editorElem)
      // 配置 onchange 回调函数
      this.editor.config.onchange = newHtml => {
        this.ruleForm.content = newHtml
        this.$refs.ruleForm.validateField('content')
      }
      // // 自定义菜单配置
      this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'justify',
        'quote',
        'splitLine',
        'undo',
        'redo'
      ]
      this.editor.create() // 创建富文本实例
      if (this.ruleForm.content) {
        this.editor.txt.html(res.Data.content)
      }
    },

    // 获取表格数据
    tableLoad() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.vid
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.circularlist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cname = item.creater.realname
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

    // 表格每页条数改变处理
    sizeChange(num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange(num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 点击是否置顶
    toTop(obj) {
      this.statusChange(obj, 'is_top')
    },

    // 点击是否开启
    toOpen(obj) {
      this.statusChange(obj, 'is_show')
    },

    // 状态改变请求
    statusChange(obj, type) {
      let data = {
        id: this.tableData[obj.index].id,
        field: type
      }
      this.$axios
        .post(this.urlObj.circularfield, data)
        .then(res => {
          if (res.Code === 200) {
            this.tableData[obj.index][type] = obj.value
            let msg = ''
            if (type == 'is_show') {
              msg = obj.value == 1 ? '开启成功！' : '关闭成功！'
            } else {
              msg = obj.value == 1 ? '置顶成功！' : '置顶关闭成功！'
            }
            this.$message({
              type: 'success',
              message: msg
            })
          } else {
            let msg = res.Message ? res.Message : '状态改变失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取项目数据
    getVillageData() {
      this.$axios
        .post(this.urlObj.userVillage)
        .then(res => {
          if (res.Code === 200) {
            this.villageList = res.Data ? res.Data : []
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

    // 获取公告详情
    getInvoiceDetail() {
      let data = {
        id: this.tableData[this.currentIndex].id
      }
      this.$axios
        .post(this.urlObj.circulardetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.ruleForm.village = res.Data.vid
            this.ruleForm.title = res.Data.name
            this.ruleForm.content = res.Data.content
            if (this.editor.txt) {
              this.editor.txt.html(res.Data.content)
            }
          } else {
            let msg = res.Message ? res.Message : '公告详情数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击新增通告处理
    addInvoice() {
      this.type = 'add'
      this.showEditDialog = true
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.getVillageData()
      this.$nextTick(() => {
        this.editorInit()
      })
    },

    // 点击编辑处理
    editInvoice(index) {
      this.currentIndex = index
      this.type = 'edit'
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showEditDialog = true
      // 获取项目列表
      this.getVillageData()
      // 获取公告详情
      this.getInvoiceDetail()
      this.$nextTick(() => {
        this.editorInit()
      })
    },

    // 点击删除处理
    delInvoice(index) {
      this.$confirm('确定要删除当前通知公告吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.delcircular, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '通知公告删除成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '通知公告删除失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => {})
    },

    // 关闭弹框处理
    closeDialog() {
      // 销毁编辑器
      this.editor.destroy()
    },

    // 数据提交处理
    formSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let url = ''
          let data = {
            name: this.ruleForm.title,
            content: this.ruleForm.content
          }
          let msg = ''
          if (this.type == 'edit') {
            url = this.urlObj.editcircular
            data.id = this.tableData[this.currentIndex].id
            msg = '通知公告编辑'
          } else {
            url = this.urlObj.addcircular
            data.vid = this.ruleForm.village
            msg = '通知公告新增'
          }
          this.$axios
            .post(url, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: `${msg}成功！`,
                  type: 'success'
                })
                this.showEditDialog = false
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : `${msg}失败！`
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
    }
  }
}
