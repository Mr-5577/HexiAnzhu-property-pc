// 导入树形结构组件
import subjectTree from '@/components/setting/common/SubjectTree.vue'
import subUseDialog from '../json/sub-use-dialog.json'
import subLog from '../json/sub-log.json'
import { mapState } from 'vuex'

export default {
  name: 'subject',
  components: {
    subjectTree
  },

  data () {
    return {
      urlObj: {
        villages: this.$api.state.System.village.list.url,
        subDetail: this.$api.state.Setting.subDetail.url,
        openCloseSub: this.$api.state.Setting.openCloseSub.url,
        useCondition: this.$api.state.Setting.useCondition.url,
        newSubject: this.$api.state.Setting.newSubject.url,
        subjectLog: this.$api.state.Setting.subjectLog.url,
        subEdit: this.$api.state.Setting.subEdit.url,
        getpatterns: this.$api.state.Setting.getpatterns.url,
        getinvoices: this.$api.state.Setting.getinvoices.url
      },
      // 树形控件数据
      treeData: null,
      // 开关绑定值
      switchVal: false,
      // 是否正在加载 科目详情
      isLoading: false,
      // 当前选择的科目
      currentSubject: {},
      // 科目详情数据
      subjectDetail: {},
      // 是否显示新增弹框
      showAddPop: false,
      // 编辑信息列表
      editInfo: [],
      // 表单数据对象
      editForm: null,
      // 弹框表单数据对象
      ruleForm: {
        pid: '',
        code: '',
        subName: '',
        price: '',
        alias: '',
        isend: '',
        subType: '',
        isOpen: '',
        source: [],
        sort: '',
        tax_rate: '',
        unitVal: '',
        formulaVal: '',
        pattern: '',
        show: '',
        fitSub: '',
        invoiceName: '',
        isrefund: '',
        isformedit: '',
        is_custom_time: '',
        is_choice_before: '',
        expire_chose_starttime: '',
        billing_rules: '',
        priority1: '',
        priority2: '',
        priority3: '',
        online: '',
        invoice_type: '',
        isRefund: '',
        isCharge: ''
      },
      // 表单验证对象
      rules: {
        pid: [{ required: true, message: '请选择上级节点', trigger: 'change' }],
        code: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
        subName: [
          { required: true, message: '请输入科目名称', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        alias: [{ required: true, message: '请输入打印别名', trigger: 'blur' }],
        isend: [
          { required: true, message: '请选择是否为末级', trigger: 'change' }
        ],
        subType: [
          { required: true, message: '请选择科目类型', trigger: 'change' }
        ],
        isOpen: [
          { required: true, message: '请选择是否开启计费', trigger: 'change' }
        ],
        source: [
          { required: true, message: '请选择可用资源', trigger: 'change' }
        ],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        tax_rate: [{ required: true, message: '请输入税率', trigger: 'blur' }],
        unitVal: [
          { required: true, message: '请选择计量单位', trigger: 'change' }
        ],
        formulaVal: [
          { required: true, message: '请选择计算公式', trigger: 'change' }
        ],
        pattern: [
          { required: true, message: '请选择收费模式', trigger: 'change' }
        ],
        show: [
          { required: true, message: '请选择是否在添加收费显示', trigger: 'change' }
        ],
        fitSub: [
          { required: true, message: '请选择是否是装修科目', trigger: 'change' }
        ],
        invoiceName: [
          { required: false, message: '请选择沪友开票名称', trigger: 'change' }
        ],
        isrefund: [
          { required: true, message: '请选择是否允许多次退款', trigger: 'change' }
        ],
        isformedit: [
          { required: true, message: '请选择是否允许编辑计算公式', trigger: 'change' }
        ],
        is_custom_time: [
          { required: true, message: '请选择是否允许自定义开始时间', trigger: 'change' }
        ],
        is_choice_before: [
          { required: true, message: '请选择是否允许选择目前欠费之前的时间', trigger: 'change' }
        ],
        expire_chose_starttime: [
          { required: true, message: '请选择是否允许跳交', trigger: 'change' }
        ],
        billing_rules: [
          { required: true, message: '请选择计费周期', trigger: 'change' }
        ],
        priority1: [
          { required: true, message: '请选择计费优先级1', trigger: 'change' }
        ],
        priority2: [
          { required: true, message: '请选择计费优先级2', trigger: 'change' }
        ],
        priority3: [
          { required: true, message: '请选择计费优先级3', trigger: 'change' }
        ],
        online: [
          { required: true, message: '请选择是否线上缴费', trigger: 'change' }
        ],
        invoice_type: [
          { required: true, message: '请选择是否开具发票', trigger: 'change' }
        ],
        isRefund: [
          { required: true, message: '请选择是否允许退款', trigger: 'change' }
        ],
        isCharge: [
          { required: true, message: '请选择是否生成欠费', trigger: 'change' }
        ]
      },
      // 是否正在提交数据
      isCommit: false,
      // 正在提交编辑数据
      isSubmit: false,
      // 是否显示使用情况弹框
      showUsePop: false,
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: subUseDialog.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 收费模式列表
      patterns: [],
      // 是否显示变更日志弹框
      showLogDialog: false,
      // 表格数据
      logTableData: [],
      // 表格列数据配置
      logColumns: subLog.list,
      // 表格配置
      logConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 基本信息数据列表
      infoList: [],
      // 沪友开票名称列表
      inameOptions: []
    }
  },

  /**
   * 计算属性
   */
  computed: {
    ...mapState(['resource', 'prioritys', 'units', 'formulas', 'subjects']),

    // 计费优先级1
    priorityOptions1 () {
      let arr = [this.editForm.priority2, this.editForm.priority3]
      let options = []
      this.prioritys.forEach(item => {
        if (!arr.includes(item.id)) {
          options.push(item)
        }
      })
      return options
    },

    // 计费优先级2
    priorityOptions2 () {
      let arr = [this.editForm.priority1, this.editForm.priority3]
      let options = []
      this.prioritys.forEach(item => {
        if (!arr.includes(item.id)) {
          options.push(item)
        }
      })
      return options
    },

    // 计费优先级3
    priorityOptions3 () {
      let arr = [this.editForm.priority1, this.editForm.priority2]
      let options = []
      this.prioritys.forEach(item => {
        if (!arr.includes(item.id)) {
          options.push(item)
        }
      })
      return options
    },

    // 弹框计费优先级1
    popPriorityOpt1 () {
      let arr = [this.ruleForm.priority2, this.ruleForm.priority3]
      let options = []
      this.prioritys.forEach(item => {
        if (!arr.includes(item.id)) {
          options.push(item)
        }
      })
      return options
    },

    // 弹框计费优先级2
    popPriorityOpt2 () {
      let arr = [this.ruleForm.priority1, this.ruleForm.priority3]
      let options = []
      this.prioritys.forEach(item => {
        if (!arr.includes(item.id)) {
          options.push(item)
        }
      })
      return options
    },

    // 弹框计费优先级3
    popPriorityOpt3 () {
      let arr = [this.ruleForm.priority1, this.ruleForm.priority2]
      let options = []
      this.prioritys.forEach(item => {
        if (!arr.includes(item.id)) {
          options.push(item)
        }
      })
      return options
    }
  },

  watch: {
    resource (newData) {
      if (this.resource.length > 0) {
        this.infoList[7].options = newData
      }
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    this.dataInit()
    this.getPatterns()
    this.getInvoices()
  },

  /**
   * 方法
   */
  methods: {
    dataInit () {
      let arr = [
        {
          name: '上级节点',
          value: 'pid',
          type: 'cascader',
          props: { checkStrictly: true, label: 'name', value: 'id' },
          readonly: false,
          options: []
        },
        {
          name: '科目编码',
          value: 'code',
          type: 'text',
          readonly: false
        },
        {
          name: '科目名称',
          value: 'subName',
          type: 'text',
          readonly: false
        },
        {
          name: '价格',
          value: 'price',
          type: 'number',
          readonly: false
        },
        {
          name: '打印别名',
          value: 'alias',
          type: 'text',
          readonly: false
        },
        {
          name: '是否为末级',
          value: 'isend',
          type: 'select',
          options: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ],
          readonly: false
        },
        {
          name: '是否开启计费',
          value: 'isOpen',
          type: 'select',
          options: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ],
          readonly: false
        },
        {
          name: '可用资源',
          value: 'source',
          type: 'cascader',
          props: { checkStrictly: true, label: 'label', value: 'id' },
          options: [],
          readonly: false
        },
        {
          name: '排序',
          value: 'sort',
          type: 'text',
          options: [],
          readonly: false
        },
        {
          name: '税率',
          value: 'tax_rate',
          type: 'text',
          options: [],
          readonly: false
        },
        {
          name: '是否线上缴费',
          value: 'online',
          type: 'select',
          options: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ],
          readonly: false
        },
        {
          name: '是否开具发票',
          value: 'invoice_type',
          type: 'select',
          options: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ],
          readonly: false
        }
      ]
      if (this.$menu.getters.judgeRole('Btn-NkxXgoLdf5rKVRT1Ve37D2oS')) {
        arr.push({
          name: '是否允许退款',
          value: 'isRefund',
          type: 'select',
          options: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ],
          readonly: false
        })
        arr.push({
          name: '是否生成欠费',
          value: 'isCharge',
          type: 'select',
          options: [
            {
              value: 0,
              label: '否'
            },
            {
              value: 1,
              label: '是'
            }
          ],
          readonly: false
        })
      }
      this.infoList = arr
    },

    // 设置新增科目弹框父级节点选择数据
    setData (obj) {
      let arr = JSON.parse(JSON.stringify(obj))
      arr.unshift({ id: 0, name: '顶级节点' })
      this.infoList[0].options = arr
    },

    // 左侧树控件选择更改
    checkChange (obj) {
      if (!this.currentSubject.id || obj.id != this.currentSubject.id) {
        this.currentSubject = obj
        // 获取科目详情
        this.getSubjectDetail(obj.id)
      }
    },

    // 获取收费模式
    getPatterns () {
      this.$axios
        .post(this.urlObj.getpatterns)
        .then(res => {
          if (res.Code === 200) {
            this.patterns = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取收费模式失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取沪友开票名称列表
    getInvoices () {
      this.$axios
        .post(this.urlObj.getinvoices)
        .then(res => {
          if (res.Code === 200) {
            this.inameOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取沪友开票名称数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取科目详情
    getSubjectDetail (id) {
      this.isLoading = true
      let data = {
        id: id
      }
      this.$axios
        .post(this.urlObj.subDetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.subjectDetail = res.Data
            let infos = JSON.parse(JSON.stringify(this.infoList))
            infos.shift()
            infos[4].readonly = true
            this.editInfo = infos
            let obj = {
              pid: '',
              code: res.Data.code,
              subName: res.Data.name,
              price: res.Data.price,
              alias: res.Data.alias,
              isend: res.Data.is_end,
              subType: res.Data.subject_type ? res.Data.subject_type : '',
              isOpen: res.Data.is_open,
              source: res.Data.resource_type_id,
              sort: res.Data.sort,
              tax_rate: res.Data.tax_rate,
              online: res.Data.is_online,
              invoice_type: res.Data.is_invoice,
            }
            if (this.$menu.getters.judgeRole('Btn-NkxXgoLdf5rKVRT1Ve37D2oS')) {
              obj.isRefund = res.Data.is_refund
              obj.isCharge = res.Data.is_refund_create
            }
            if (res.Data.is_end == 1) {
              obj.unitVal = res.Data.subjectBillTemplate
                ? res.Data.subjectBillTemplate.unit
                : ''
              obj.formulaVal = res.Data.subjectBillTemplate
                ? res.Data.subjectBillTemplate.formula
                : ''
              obj.pattern = res.Data.subjectBillTemplate
                ? res.Data.subjectBillTemplate.patterns
                : ''
              if (res.Data.subjectFeesSort.length > 0) {
                obj.priority1 = res.Data.subjectFeesSort[0].type
                obj.priority2 = res.Data.subjectFeesSort[1].type
                obj.priority3 = res.Data.subjectFeesSort[2].type
              } else {
                obj.priority1 = ''
                obj.priority2 = ''
                obj.priority3 = ''
              }
              obj.show = res.Data.is_add_arrears
              obj.fitSub = res.Data.is_renovation
              obj.invoiceName = res.Data.invoice_name
              obj.isrefund = res.Data.is_many_refund
              obj.isformedit = res.Data.is_edit_template
              obj.is_custom_time = res.Data.is_custom_time
              obj.is_choice_before = res.Data.is_choice_before
              obj.expire_chose_starttime = res.Data.expire_chose_starttime
              obj.billing_rules = res.Data.billing_rules
            }
            this.editForm = obj
            this.switchVal = res.Data.is_open == 1 ? true : false
            // 表单验证重置
            if (this.$refs.editForm) {
              this.$refs.editForm.resetFields()
            }
          } else {
            let msg = res.Message ? res.Message : '科目详情数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },

    // 点击新增科目处理
    newHandle () {
      // 数据初始化
      this.ruleForm = {
        pid: '',
        code: '',
        subName: '',
        price: '',
        alias: '',
        isend: '',
        subType: '',
        isOpen: '',
        source: [],
        unitVal: '',
        formulaVal: '',
        pattern: '',
        priority1: '',
        priority2: '',
        priority3: '',
        online: '',
        invoice_type: '',
        isRefund: '',
        isCharge: '',
        isrefund: 0,
        isformedit: 0,
        is_custom_time: 0,
        is_choice_before: 0,
        expire_chose_starttime: 0,
        billing_rules: 1,
      }
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showAddPop = true
    },

    // 点击新增科目确认按钮
    submitForm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            pid: this.ruleForm.pid[this.ruleForm.pid.length - 1],
            is_open: this.ruleForm.isOpen,
            name: this.ruleForm.subName,
            code: this.ruleForm.code,
            price: parseInt(this.ruleForm.price),
            resource_type_id: this.ruleForm.source[this.ruleForm.source.length - 1],
            subject_type: this.ruleForm.subType,
            is_end: this.ruleForm.isend,
            alias: this.ruleForm.alias,
            order: this.ruleForm.sort,
            tax_rate: this.ruleForm.tax_rate,
            is_invoice: this.ruleForm.invoice_type,
            is_online: this.ruleForm.online,
          }
          if (this.$menu.getters.judgeRole('Btn-NkxXgoLdf5rKVRT1Ve37D2oS')) {
            data.is_refund = this.ruleForm.isRefund
            data.is_refund_create = this.ruleForm.isCharge
          }
          if (data.is_end) {
            data.sort = [
              {
                sort: 3,
                type: this.ruleForm.priority1
              },
              {
                sort: 2,
                type: this.ruleForm.priority2
              },
              {
                sort: 1,
                type: this.ruleForm.priority3
              }
            ]
            data.template = {
              unit: parseInt(this.ruleForm.unitVal),
              formula: parseInt(this.ruleForm.formulaVal),
              patterns: this.ruleForm.pattern
            }
            data.is_add_arrears = this.ruleForm.show
            data.is_renovation = this.ruleForm.fitSub
            data.invoice_name = this.ruleForm.invoiceName
            data.is_many_refund = this.ruleForm.isrefund
            data.is_edit_template = this.ruleForm.isformedit
            data.is_custom_time = this.ruleForm.is_custom_time
            data.is_choice_before = this.ruleForm.is_choice_before
            data.expire_chose_starttime = this.ruleForm.expire_chose_starttime
            data.billing_rules = this.ruleForm.billing_rules
          }
          this.isCommit = true
          // 新增科目请求
          this.$axios
            .post(this.urlObj.newSubject, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '新增科目成功！'
                })
                this.showAddPop = false
                // 重新获取一次树结构数据
                this.$refs.subjectTree.getTreeData()
              } else {
                let msg = res.Message ? res.Message : '新增科目失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.isCommit = false
            })
            .catch(err => {
              this.isCommit = false
            })
        }
      })
    },

    // 点击保存修改按钮处理
    editSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            id: this.subjectDetail.id,
            pid: this.subjectDetail.pid,
            is_open: this.editForm.isOpen,
            name: this.editForm.subName,
            code: this.editForm.code,
            price: parseInt(this.editForm.price),
            resource_type_id: this.editForm.source[this.editForm.source.length - 1],
            subject_type: this.editForm.subType,
            is_end: this.editForm.isend,
            alias: this.editForm.alias,
            order: this.editForm.sort,
            tax_rate: this.editForm.tax_rate,
            is_invoice: this.editForm.invoice_type,
            is_online: this.editForm.online
          }
          if (this.$menu.getters.judgeRole('Btn-NkxXgoLdf5rKVRT1Ve37D2oS')) {
            data.is_refund = this.editForm.isRefund
            data.is_refund_create = this.editForm.isCharge
          }
          if (data.is_end) {
            data.sort = [
              {
                id: this.subjectDetail.subjectFeesSort[0]
                  ? this.subjectDetail.subjectFeesSort[0].id
                  : '',
                sort: 3,
                type: this.editForm.priority1
              },
              {
                id: this.subjectDetail.subjectFeesSort[1]
                  ? this.subjectDetail.subjectFeesSort[1].id
                  : '',
                sort: 2,
                type: this.editForm.priority2
              },
              {
                id: this.subjectDetail.subjectFeesSort[2]
                  ? this.subjectDetail.subjectFeesSort[2].id
                  : '',
                sort: 1,
                type: this.editForm.priority3
              }
            ]
            data.template = {
              unit: parseInt(this.editForm.unitVal),
              formula: parseInt(this.editForm.formulaVal),
              patterns: this.editForm.pattern
            }
            data.is_add_arrears = this.editForm.show
            data.is_renovation = this.editForm.fitSub
            data.invoice_name = this.editForm.invoiceName
            data.is_many_refund = this.editForm.isrefund
            data.is_edit_template = this.editForm.isformedit
            data.is_custom_time = this.editForm.is_custom_time
            data.is_choice_before = this.editForm.is_choice_before
            data.expire_chose_starttime = this.editForm.expire_chose_starttime
            data.billing_rules = this.editForm.billing_rules
          }
          this.isSubmit = true
          // 新增科目请求
          this.$axios
            .post(this.urlObj.subEdit, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '科目修改成功！'
                })
              } else {
                let msg = res.Message ? res.Message : '科目修改失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.isSubmit = false
            })
            .catch(err => {
              this.isSubmit = false
            })
        }
      })
    },

    // 显示项目使用情况弹框
    showCondition () {
      this.showUsePop = true
      this.tableLoad()
    },

    // 获取项目使用情况表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.useCondition)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.tableData = res.Data
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

    // 开关状态改变处理
    switchChange (value) {
      let data = {
        id: this.subjectDetail.id,
        is_open: value ? 1 : 0
      }
      // 新增科目请求
      this.$axios
        .post(this.urlObj.openCloseSub, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: value ? '启用成功！' : '关闭成功！'
            })
            // 获取一次详情数据
            this.getSubjectDetail(this.subjectDetail.id)
          } else {
            let msg = res.Message
              ? res.Message
              : value
                ? '启用失败！'
                : '关闭失败！'
            this.$message({
              type: 'error',
              message: msg
            })
            this.switchVal = !value
          }
        })
        .catch(err => {
          this.switchVal = !value
        })
    },

    // 点击变更日志按钮处理
    logHandle () {
      this.showLogDialog = true
      this.logTableLoad()
    },

    // 获取项目使用情况表格数据
    logTableLoad () {
      // 表格处于加载状态
      this.logConf.loadStatus = true
      let data = {
        id: this.subjectDetail.id,
        page: this.logConf.curPage,
        limit: this.logConf.limit
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.subjectLog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cname = item.createuser.realname
              })
            }
            // 设置查询总数
            this.logConf.dataTotal = res.Data.total
            // 存放查询数据
            this.logTableData = res.Data.data
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
      this.logTableLoad()
    },

    // 当前页码改变处理
    logCurrentChange (num) {
      this.logConf.curPage = num
      // 获取一次表格数据
      this.logTableLoad()
    }
  }
}
