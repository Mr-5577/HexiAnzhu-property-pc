import ClipboardJS from 'clipboard'
import templateColumns from '../json/template-columns.json'

export default {
  name: 'messageTemplate',
  data () {
    return {
      urlObj: {
        smstemps: this.$api.state.Custom.smstemps.url,
        setstatus: this.$api.state.Custom.setstatus.url,
        tempvillage: this.$api.state.Custom.tempvillage.url,
        savevillage: this.$api.state.Custom.savevillage.url,
        smsconfig: this.$api.state.Custom.smsconfig.url,
        addsmstemp: this.$api.state.Custom.addsmstemp.url,
        editsmstemp: this.$api.state.Custom.editsmstemp.url,
        getquest: this.$api.state.Custom.getquest.url,
        tempdetail: this.$api.state.Custom.tempdetail.url,
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: templateColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前编辑项的 index
      currentIndex: '',
      // 是否显示新增/编辑弹框
      showEditDialog: false,
      // 当前操作类型
      type: 'add',
      // 短信预制模板列表
      modelList: [],
      // 模板类型
      typeVal: '',
      typeOptions: [],
      // 模板名称
      nameVal: '',
      // 短信模板编号
      codeVal: '',
      // 调查问卷
      questVal: '',
      questOptions: [],
      // 模板内容
      tempContent: '',
      // 是否正在提交数据
      isCommit: false,
      // 是否显示应用车场弹框
      showUseDialog: false,
      // 应用车场详情数据列表
      detailList: [],
      // 当前tab 名
      activeName: '',
      // 当前详情的收费模板index
      cIndex: '',
      // 是否正在加载详情数据
      loadDetail: false,
      // 复制对象
      clipboard: null,
      // 是否正在加载详情数据
      detailLoading: false,
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

  /**
   *
   */
  watch: {
    vid () {
      this.tableLoad()
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        type: 'normal',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.smstemps, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cuser = item.creater.realname
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

    // 点击新增模板处理
    addTemplate () {
      this.type = 'add'
      this.modelList = []
      this.typeVal = ''
      this.nameVal = ''
      this.codeVal = ''
      this.questVal = ''
      this.questOptions = []
      this.tempContent = ''
      this.showEditDialog = true
      this.getSmsConfig()
      this.getQuestData()
    },

    // 项目选择处理
    villageSelect (index) {
      this.cIndex = index
      this.showUseDialog = true
      this.getTempDatas()
    },

    // 获取模板可用范围数据
    getTempDatas () {
      this.loadDetail = true
      let data = {
        id: this.tableData[this.cIndex].id,
        type: 'area'
      }
      this.$axios
        .post(this.urlObj.tempvillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.activeName = res.Data && res.Data.length > 0 ? res.Data[0].deptname : ''
            this.detailList = res.Data && res.Data.length > 0 ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '应用车场数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.loadDetail = false
        })
        .catch(() => {
          this.loadDetail = false
        })
    },

    // 点击全部按钮处理
    selectAll (obj) {
      if (obj.village.every(item => item.checked)) {
        obj.village.forEach(item => {
          item.checked = false
        })
      } else {
        obj.village.forEach(item => {
          item.checked = true
        })
      }
    },

    // 确认应用处理
    useSubmit () {
      this.isCommit = true
      let selects = []
      this.detailList.forEach(item => {
        item.city.forEach(itm => {
          itm.village.forEach(i => {
            if (i.checked) {
              selects.push(i.id)
            }
          })
        })
      })
      let data = {
        id: this.tableData[this.cIndex].id,
        vids: selects
      }
      this.$axios
        .post(this.urlObj.savevillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              dangerouslyUseHTMLString: true,
              message: '模板可用范围设置成功！'
            })
            this.showUseDialog = false
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '模板可用范围设置失败！'
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

    // 启用状态改变处理
    statusChange (obj) {
      let data = {
        id: this.tableData[obj.index].id,
      }
      this.$axios
        .post(this.urlObj.setstatus, data)
        .then(res => {
          if (res.Code === 200) {
            this.tableData[obj.index][obj.col_name] = obj.value
            this.$message({
              type: 'success',
              message: obj.value == 1 ? '启用成功！' : '关闭成功！'
            })
          } else {
            let msg = res.Message ? res.Message : obj.value == 1 ? '启用失败！' : '关闭失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击编辑处理
    editInvoice (index) {
      this.currentIndex = index
      this.type = 'edit'
      this.modelList = []
      this.questOptions = []
      this.showEditDialog = true
      this.getDetailData()
      this.getSmsConfig()
      this.getQuestData()
    },

    // 获取短信模板详情数据
    getDetailData () {
      this.detailLoading = true
      let data = {
        id: this.tableData[this.currentIndex].id
      }
      this.$axios
        .post(this.urlObj.tempdetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.typeVal = res.Data.use_type
            this.nameVal = res.Data.name
            this.codeVal = res.Data.template_code
            this.questVal = res.Data.questionnaire_id
            this.tempContent = res.Data.content
          } else {
            let msg = res.Message ? res.Message : '获取短信模板预制内容失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.detailLoading = false
        })
    },

    // 获取问卷调查数据
    getQuestData () {
      this.$axios
        .post(this.urlObj.getquest)
        .then(res => {
          if (res.Code === 200) {
            this.questOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取问卷调查数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
    },

    // 获取短信模板预制内容
    getSmsConfig () {
      this.$axios
        .post(this.urlObj.smsconfig)
        .then(res => {
          if (res.Code === 200) {
            this.modelList = res.Data ? res.Data : []
            this.$nextTick(() => {
              this.copyText()
            })
          } else {
            let msg = res.Message ? res.Message : '获取短信模板预制内容失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
    },

    // 复制文本内容
    copyText () {
      let that = this
      this.clipboard = new ClipboardJS('.copyText');

      this.clipboard.on('success', function (e) {
        that.$message({
          type: 'success',
          message: '复制成功！',
          duration: 1000
        })
        e.clearSelection();
      });

      this.clipboard.on('error', function (e) {
        that.$message({
          type: 'error',
          message: '复制失败！'
        })
      });
    },

    // 弹框关闭处理
    editClose () {
      this.clipboard.destroy();
      this.showEditDialog = false
    },

    // 数据提交处理
    formSubmit () {
      if (!this.nameVal) {
        this.$message({
          type: 'warning',
          message: '请输入短信模板名称!'
        })
        return
      }
      if (!(this.codeVal.trim())) {
        this.$message({
          type: 'warning',
          message: '请输入短信模板编号!'
        })
        return
      }
      if (!this.typeVal) {
        this.$message({
          type: 'warning',
          message: '请选择模板类型!'
        })
        return
      }
      if (this.typeVal == 3 && !this.questVal) {
        this.$message({
          type: 'warning',
          message: '请选择调查问卷!'
        })
        return
      }
      if (!this.tempContent) {
        this.$message({
          type: 'warning',
          message: '请输入模板内容!'
        })
        return
      }

      this.isCommit = true
      let arr = this.modelList.filter(item => this.tempContent.includes(item.show_key))
      let url = ''
      let data = {
        name: this.nameVal,
        template_code: this.codeVal,
        use_type: this.typeVal,
        content: this.tempContent,
        use_value: arr.map(item => item.key)
      }
      if (this.typeVal == 3) {
        data.questionnaire_id = this.questVal
      }
      let msg = ''
      if (this.type == 'edit') {
        url = this.urlObj.editsmstemp
        data.id = this.tableData[this.currentIndex].id
        msg = '短信模板编辑'
      } else {
        url = this.urlObj.addsmstemp
        msg = '短信模板新增'
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
  }
}
