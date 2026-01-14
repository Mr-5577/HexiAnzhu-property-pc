// 导入树形结构组件
import subjectTree from '@/components/setting/common/SubjectTree.vue'
import copyCharging from '../json/copy-charging.json'
import rateDetail from '../json/rate-detail.json'
import subLog from '../json/sub-log.json'

// 导入大区、项目预选择页面
import areaVillageSelect from '@/components/common/AreaVillageSelect.vue'
import { mapState } from 'vuex'

export default {
  name: 'charging',
  components: {
    subjectTree,
    areaVillageSelect
  },

  data () {
    return {
      urlObj: {
        subDetail: this.$api.state.Setting.subDetail.url,
        villages: this.$api.state.System.village.list.url,
        addRate: this.$api.state.Setting.addRate.url,
        rateDetail: this.$api.state.Setting.rateDetail.url,
        rateEdit: this.$api.state.Setting.rateEdit.url,
        rateDelete: this.$api.state.Setting.rateDelete.url,
        subOpenClose: this.$api.state.Setting.subOpenClose.url,
        uploadCharge: this.$api.state.Setting.uploadCharge.url,
        copySub: this.$api.state.Setting.copySub.url,
        endSubjects: this.$api.state.Setting.endSubjects.url,
        userVillage: this.$api.state.Public.userVillage.url,
        getpatterns: this.$api.state.Setting.getpatterns.url,
        chargeLog: this.$api.state.Setting.chargeLog.url,
        carlist: this.$api.state.Public.carlist.url,
        getinvoices: this.$api.state.Setting.getinvoices.url
      },
      // 当前大区 id
      aid: '',
      // 当前项目 id
      vid: '',
      // 是否已选择项目
      isRegister: false,
      // 是否正在加载科目详情
      isLoading: false,
      // 弹框表单数据对象
      editForm: {
        pid: '',
        code: '',
        subName: '',
        price: '',
        alias: '',
        isend: '',
        subType: '',
        isOpen: '',
        online: '',
        invoice_type: '',
        isRefund: '',
        isCharge: '',
        source: [],
        sort: '',
        tax_rate: '',
        unitVal: '',
        formulaVal: '',
        pattern: '',
        carbind: '',
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
        priority3: ''
      },
      // 表单验证对象
      rules: {
        pid: [{ required: true, message: '请选择上级节点', trigger: 'change' }],
        code: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
        subName: [
          { required: true, message: '请输入科目名称', trigger: 'blur' }
        ],
        price: [{ required: false, message: '请输入价格', trigger: 'blur' }],
        alias: [{ required: true, message: '请输入打印别名', trigger: 'blur' }],
        isend: [
          { required: false, message: '请选择是否为末级', trigger: 'change' }
        ],
        subType: [
          { required: true, message: '请选择科目类型', trigger: 'change' }
        ],
        isOpen: [
          { required: true, message: '请选择是否开启计费', trigger: 'change' }
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
        isCharge: [
          { required: true, message: '请选择是否生成欠费', trigger: 'change' }
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
        carbind: [
          { required: false, message: '请选择车场', trigger: 'change' }
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
        priority1: [
          { required: true, message: '请选择计费优先级1', trigger: 'change' }
        ],
        priority2: [
          { required: true, message: '请选择计费优先级2', trigger: 'change' }
        ],
        priority3: [
          { required: true, message: '请选择计费优先级3', trigger: 'change' }
        ]
      },
      // 当前选择的科目
      currentSubject: {},
      // 当前科目详情
      subjectDetail: {},
      // 开关绑定值
      switchVal: '',
      // 是否显示复制收费标准弹框
      showCopyPop: false,
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: copyCharging.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否正在提交数据
      isCommit: false,
      // 复制项目
      copyVillage: '',
      copyOptions: [],
      // 复制到项目
      copyToVillage: '',
      // 单选框绑定值
      radioVal: 0,
      // 表格中选中的数据
      tableSelected: [],
      // 是否显示新增弹框
      showAddDialog: false,
      addForm: {
        sname: '',
        price: '',
        time: ''
      },
      addRules: {
        sname: [{ required: true, message: '请输入项目', trigger: 'change' }],
        price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
        time: [{ required: true, message: '请选择生效时间', trigger: 'blur' }]
      },
      // 是否显示费率明细弹框
      showDetailDialog: false,
      // 费率明细表格数据
      detailTableData: [],
      // 费率明细表格列数据配置
      detailColumns: rateDetail.list,
      // 费率明细表格配置
      detailConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前是否是编辑费率
      isEdit: false,
      // 当前编辑数据在表格中的index
      cindex: 0,
      // 收费模式列表
      patterns: [],
      // 车场列表
      carOptions: [],
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
      // 是否正在修改数据
      isSubmit: false,
      // 沪友开票名称列表
      inameOptions: []
    }
  },

  /**
   * 计算属性
   */
  computed: {
    ...mapState(['resource', 'prioritys', 'units', 'formulas', 'subjects']),
    // 基本信息数据列表
    editInfo () {
      let arr = [
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
          readonly: true
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
          readonly: true
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
      if (this.resource.length > 0) {
        arr[8].options = this.resource
      }
      return arr
    },

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
    }
  },

  /**
   * 属性监听
   */
  watch: {
    isRegister (now) {
      if (now) {
        let charge = document.getElementById('setting')
        charge.classList.add('register')
      } else {
        let charge = document.getElementById('setting')
        charge.classList.remove('register')
      }
    }
  },

  /**
   * 生命周期
   */
  mounted () { },

  /**
   * 方法
   */
  methods: {
    // 开始登记通过处理
    registerPass (data) {
      this.aid = data.aid
      this.vid = data.vid
      this.isRegister = true
      this.getPatterns()
      this.getCarList()
      this.getInvoices()
    },

    // 左侧树控件选择更改
    checkChange (obj) {
      if (!this.currentSubject.id || obj.id != this.currentSubject.id) {
        this.currentSubject = obj
        this.switchVal = obj.is_setting == 1 ? true : false
        // 获取科目详情
        this.getSubjectDetail()
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

    // 获取车场列表
    getCarList () {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.carlist, data)
        .then(res => {
          if (res.Code === 200) {
            this.carOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取车场数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取科目详情
    getSubjectDetail () {
      this.isLoading = true
      let data = {
        id: this.currentSubject.id,
        vid: this.vid,
        is_setting:
          this.currentSubject.is_setting || this.currentSubject.is_setting == 0
            ? this.currentSubject.is_setting
            : ''
      }
      this.$axios
        .post(this.urlObj.subDetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.subjectDetail = res.Data
            let obj = {
              pid: '',
              code: res.Data.code,
              subName: res.Data.name,
              price: res.Data.price,
              alias: res.Data.alias,
              isend: res.Data.is_end,
              subType: res.Data.subject_type ? res.Data.subject_type : '',
              isOpen: res.Data.is_open,
              online: res.Data.is_online,
              invoice_type: res.Data.is_invoice,
              source: res.Data.resource_type_id,
              sort: res.Data.sort,
              tax_rate: res.Data.tax_rate
            }
            if (this.$menu.getters.judgeRole('Btn-NkxXgoLdf5rKVRT1Ve37D2oS')) {
              obj.isRefund = res.Data.is_refund
              obj.isCharge = res.Data.is_refund_create
            }
            if (this.$menu.getters.judgeRole('Btn-QfTIBlCpVq156KuH5PrmKoG6')) {
              obj.carbind = res.Data.car_park_id
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

    // 点击保存修改按钮处理
    editSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.isSubmit = true
          let data = {
            id: this.subjectDetail.id,
            vid: this.vid,
            resource_type_id: this.editForm.source[this.editForm.source.length - 1],
            subject_type: this.editForm.subType,
            is_invoice: this.editForm.invoice_type,
            is_online: this.editForm.online,
            tax_rate: this.editForm.tax_rate,
            order: this.editForm.sort,
            name: this.editForm.subName,
            code: this.editForm.code,
            alias: this.editForm.alias,
            is_open: this.editForm.isOpen,
            is_end: this.editForm.isend,
            price: this.editForm.price
          }
          if (this.$menu.getters.judgeRole('Btn-NkxXgoLdf5rKVRT1Ve37D2oS')) {
            data.is_refund = this.editForm.isRefund
            data.is_refund_create = this.editForm.isCharge
          }
          if (this.$menu.getters.judgeRole('Btn-QfTIBlCpVq156KuH5PrmKoG6')) {
            data.car_park_id = this.editForm.carbind
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
          // 新增科目请求
          this.$axios
            .post(this.urlObj.uploadCharge, data)
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

    // 点击复制收费标准按钮处理
    copyDialogInit () {
      this.copyVillage = ''
      this.copyToVillage = ''
      this.tableSelected = []
      this.showCopyPop = true
      this.getVillageData()
      this.tableLoad()
    },

    // 获取项目数据
    getVillageData () {
      this.$axios
        .post(this.urlObj.userVillage)
        .then(res => {
          if (res.Code === 200) {
            this.copyOptions = res.Data
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

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        vid: this.copyVillage
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.endSubjects, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.for_text = item.subjectBillTemplate
                  ? item.subjectBillTemplate.formula_text
                  : ''
              })
            }
            // 存放查询数据
            this.tableData = res.Data ? res.Data : []
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

    // 表格选择改变处理
    selectionChange (arr) {
      this.tableSelected = arr
    },

    // 数据提交处理
    copyConfirm () {
      let subs = this.tableSelected.map(item => item.id)
      if (this.copyToVillage && subs.length > 0) {
        this.isCommit = true
        let data = {
          cover: this.radioVal,
          vid: this.copyToVillage,
          from_vid: this.copyVillage,
          subject_id: subs
        }
        this.$axios
          .post(this.urlObj.copySub, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '收费标准复制成功！'
              })
              // 关闭弹框，重新获取详情数据
              this.showCopyPop = false
              this.getSubjectDetail()
            } else {
              let msg = res.Message ? res.Message : '收费标准复制失败！'
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
              message: msg
            })
            this.isCommit = false
          })
      } else if (!this.copyToVillage && subs.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要复制的科目和复制到哪个项目！'
        })
      } else if (!this.copyToVillage) {
        this.$message({
          type: 'warning',
          message: '请选择要复制到哪个项目！'
        })
      } else if (subs.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要复制的科目'
        })
      }
    },

    // 点击新增费率按钮处理
    addHandle () {
      // 表单验证重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.addForm.sname = this.currentSubject.name
      this.isEdit = false
      this.showAddDialog = true
    },

    // 新增费率保存
    addSave () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {}
          if (this.isEdit) {
            data = {
              id: this.detailTableData[this.cindex].id,
              price: this.addForm.price,
              time: this.addForm.time / 1000
            }
          } else {
            data = {
              subject_id: this.currentSubject.id,
              price: this.addForm.price,
              time: this.addForm.time / 1000
            }
          }
          let url = this.isEdit ? this.urlObj.rateEdit : this.urlObj.addRate
          this.$axios
            .post(url, data)
            .then(res => {
              let tip = this.isEdit ? '编辑费率' : '新增费率'
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: `${tip}成功！`
                })
                this.showAddDialog = false
                if (this.isEdit) {
                  // 获取明细数据
                  this.detailTableLoad()
                } else {
                  // 获取科目详情数据
                  this.getSubjectDetail()
                }
              } else {
                let msg = res.Message ? res.Message : `${tip}失败！`
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

    // 点击详情按钮处理
    detailHandle () {
      this.showDetailDialog = true
      // 获取表格数据
      this.detailTableLoad()
    },

    // 获取表格数据
    detailTableLoad () {
      // 表格处于加载状态
      this.detailConf.loadStatus = true
      let data = {
        id: this.currentSubject.id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.rateDetail, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.sname = this.currentSubject.name
              item.cname = item.creater ? item.creater.realname : ''
            })
            // 存放查询数据
            this.detailTableData = res.Data ? res.Data : []
            // 关闭加载状态
            this.detailConf.loadStatus = false
            // 清空空数据提示
            this.detailConf.emptyText = ''
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
            this.detailTableData = []
            this.detailConf.emptyText = res.Message
            this.detailConf.dataTotal = 0
            this.detailConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.detailTableData = []
          this.detailConf.emptyText = '服务器连接失败...'
          this.detailConf.dataTotal = 0
          this.detailConf.loadStatus = false
        })
    },

    // 点击费率明细表编辑按钮处理
    rateEdit (index) {
      this.cindex = index
      // 表单验证重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.isEdit = true
      this.addForm.sname = this.currentSubject.name
      this.addForm.price = this.detailTableData[index].price
      this.addForm.time = new Date(
        this.detailTableData[index].start_time
      ).getTime()
      this.showAddDialog = true
    },

    // 点击费率明细表删除按钮处理
    rateDel (index) {
      this.$confirm('确定要删除当前明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .post(this.urlObj.rateDelete, {
              id: this.detailTableData[index].id
            })
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '记录删除成功！'
                })
                this.detailTableLoad()
              } else {
                let msg = res.Message ? res.Message : '记录删除失败！'
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

    // 开关状态改变处理
    switchChange (value) {
      let data = {
        id: this.subjectDetail.id,
        vid: this.vid,
        is_open: value ? 1 : 0,
        is_setting: this.currentSubject.is_setting
      }
      this.$axios
        .post(this.urlObj.subOpenClose, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: value ? '启用成功,请设置科目价格！' : '关闭成功！'
            })
            // 设置默认选择的节点
            this.$refs.subjectTree.setDefaultChecked(res.Data.nodeid)
            this.$refs.subjectTree.typeVal = 0
            this.currentSubject.id = res.Data.id
            this.currentSubject.nodeid = res.Data.nodeid
            this.currentSubject.is_setting = 1
            // 刷新树形结构数据
            this.$refs.subjectTree.getTreeData()
            // 获取节点详情数据
            this.getSubjectDetail()
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
        vid: this.vid,
        page: this.logConf.curPage,
        limit: this.logConf.limit
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.chargeLog, data)
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
