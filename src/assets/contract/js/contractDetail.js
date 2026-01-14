import planColumns from '../json/plan-columns.json'
import shareColumns from '../json/share-columns.json'

export default {
  name: 'contractDetail',
  data () {
    return {
      urlObj: {
        contractDetail: this.$api.state.Contract.contractDetail.url,
        contractVillage: this.$api.state.Contract.contractVillage.url,
        getsubject: this.$api.state.Charge.getsubject.url,
        addplan: this.$api.state.Contract.addplan.url,
        collectionplan: this.$api.state.Contract.collectionplan.url,
        detailplan: this.$api.state.Contract.detailplan.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        examineplan: this.$api.state.Contract.examineplan.url,
        refundplan: this.$api.state.Contract.refundplan.url,
        delplan: this.$api.state.Contract.delplan.url,
        stopplan: this.$api.state.Contract.stopplan.url,
        subjectbydep: this.$api.state.Contract.subjectbydep.url,
        getreceipttype: this.$api.state.Charge.getreceipttype.url,
        getsubjectbyvillage: this.$api.state.Contract.getsubjectbyvillage.url,
        getdepandvillage: this.$api.state.Contract.getdepandvillage.url,
        plancost: this.$api.state.Contract.plancost.url,
        signplan: this.$api.state.Contract.signplan.url,
        createplancost: this.$api.state.Contract.createplancost.url,
      },
      // 当前项目名称
      vname: '',
      // 是否显示详情弹框
      showDialog: false,
      // 是否正在加载数据
      isLoading: false,
      // 当前合同id
      contractId: '',
      // 合同详情数据
      cntDetail: {},
      // 审核文件列表
      auditFiles: [],
      // 签署文件列表
      signeFiles: [],
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: planColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否显示添加收款计划弹框
      showAddDialog: false,
      // 表单数据对象
      addForm: {
        village: '',
        subject: '',
        money: '',
        number: '',
        dateVal: '',
        cycle: '',
        remark: ''
      },
      // 表单验证规则
      addRules: {
        village: [
          { required: true, message: '请选择收款项目', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '请选择收款科目', trigger: 'change' }
        ],
        money: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
        number: [
          { required: true, message: '请输入收款次数', trigger: 'blur' }
        ],
        dateVal: [
          { required: true, message: '请选择收款日期', trigger: 'change' }
        ],
        cycle: [
          { required: true, message: '请选择收款周期', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      // 收款项目列表
      villageOptions: [],
      // 科目列表
      subOptions: [],
      subProps: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // 周期列表
      cycleOptions: [
        {
          value: 1,
          label: '季度'
        },
        {
          value: 2,
          label: '半年'
        },
        {
          value: 3,
          label: '年'
        },
        {
          value: 4,
          label: '一次性'
        }
      ],
      // 是否显示计划收款弹框
      showPlanDialog: false,
      // 当前操作计划的 id
      planId: '',
      // 是否显示计划收款详情弹框
      showInfoDialog: false,
      // 表单数据对象
      ruleForm: {
        vname: '',
        uname: '',
        dateVal: '',
        ymoney: '',
        smoney: '',
        paymentTerm: '',
        bill: 0,
        receiptType: 1,
        isPaper: '',
        remark: ''
      },
      // 表单验证规则
      rules: {
        vname: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        uname: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        dateVal: [
          { required: true, message: '请选择收款时间', trigger: 'change' }
        ],
        ymoney: [
          { required: true, message: '请输入应收金额', trigger: 'blur' }
        ],
        smoney: [
          { required: true, message: '请输入实收金额', trigger: 'blur' }
        ],
        paymentTerm: [
          { required: true, message: '请选择收款方式', trigger: 'change' }
        ],
        bill: [
          { required: true, message: '请选择打印票据', trigger: 'change' }
        ],
        receiptType: [
          { required: true, message: '请选择收据类型', trigger: 'change' }
        ],
        isPaper: [
          { required: true, message: '请选择是否生成纸质收据', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      // 是否正在加载计划详情数据
      detailLoading: false,
      // 收款方式列表
      payOptions: [],
      // 是否开票
      billOptions: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      // 是否正在提交数据
      isCommit: false,
      // 计划详情数据
      planInfo: {},
      // 是否禁用收款时间
      dateDisabled: true,
      // 文件路径
      aurl: '',
      // 当前项目支持的收据类型
      receiptType: '',
      // 是否显示分摊详情弹框
      showShareDialog: false,
      // 分摊详情表格数据
      shareTableData: [],
      // 分摊详情表格列数据配置
      shareColumns: shareColumns.list,
      // 分摊详情表格配置
      shareConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
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
   * 属性监听
   */
  watch: {
    vid () {
      this.vname = sessionStorage.getItem('vname')
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    this.vname = sessionStorage.getItem('vname')
  },

  /**
   * 方法
   */
  methods: {
    // 弹框初始化处理
    init (id) {
      this.contractId = id
      this.cntDetail = {}
      this.auditFiles = []
      this.signeFiles = []
      this.tableData = []
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      }
      this.showDialog = true
      this.getContractDetail()
    },

    // 获取合同详情数据
    getContractDetail () {
      this.isLoading = true
      this.$axios
        .post(this.urlObj.contractDetail, { id: this.contractId })
        .then(res => {
          if (res.Code === 200) {
            res.Data.file.forEach(item => {
              if (item.cf_type1 == 1) {
                this.auditFiles.push(item)
              } else {
                this.signeFiles.push(item)
              }
            })
            res.Data.plan.forEach(item => {
              item.subName = item.subject ? item.subject.name : '--'
              item.cname = item.creater ? item.creater.realname : '--'
              item.vname = item.village ? item.village.deptname : '--'
              item.status_text = item.status == 1 ? '已收款' : item.status == 2 ? '已退款' : item.status == 3 ? '已终止' : '未收款'
              item.check_text =
                item.check == 0
                  ? '审核中'
                  : item.check == 1
                    ? '已通过'
                    : item.check == 2
                      ? '已拒绝'
                      : ''
              item.passHide = item.check != 0 || item.examine_node == 0
              item.returnHide = item.check != 0 || item.examine_node == 0
              item.skhide = !(item.check == 1 && item.status == 0)
              item.tkhide = !(item.refund_subject == 1 && item.status == 1)
              item.delHide = !(
                (item.check == 0 || item.check == 2) &&
                item.status == 0
              )
              item.zzHide = item.status == 0 && item.check == 1 ? false : true
            })
            this.cntDetail = res.Data ? res.Data : {}
            this.tableData = res.Data && res.Data.plan ? res.Data.plan : ''
          } else {
            let msg = res.Message ? res.Message : '获取合同详情数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
          this.isLoading = false
        })
    },

    // 点击合同审核文件处理
    fileClick (file) {
      this.$confirm('选择一个操作类型?', '提示', {
        confirmButtonText: '下载',
        cancelButtonText: '预览',
        distinguishCancelAndClose: true,
      }).then((res) => {
        this.aurl = file.host_url
        this.$nextTick(() => {
          this.$refs.adom.click()
        })
      }).catch((res) => {
        if (res === 'cancel') {
          this.aurl = file.view_url
          this.$nextTick(() => {
            this.$refs.adom.click()
          })
        }
      });
    },

    // 点击添加收款计划按钮处理
    addPlan () {
      // 表单验证重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.addForm = {
        village: '',
        subject: '',
        money: '',
        number: '',
        dateVal: '',
        cycle: '',
        remark: ''
      }
      this.villageOptions = []
      this.subOptions = []
      this.getVillageList()
      this.showAddDialog = true
    },

    // 获取计划收款项目
    getVillageList () {
      let data = {
        id: this.contractId
      }
      this.$axios
        .post(this.urlObj.getdepandvillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.villageOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取收款项目数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 收款项目值改变处理
    villageChange (value) {
      this.addForm.subject = ''
      this.subOptions = []
      if (value) {
        this.getSubjects(value[value.length - 1])
      }
    },

    // 获取收款科目
    getSubjects (value) {
      let data = {
        vid: value
      }
      this.$axios
        .post(this.urlObj.getsubjectbyvillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.subOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取科目数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取计划详情数据
    getPlanDetail () {
      this.detailLoading = true
      let data = {
        id: this.planId
      }
      this.$axios
        .post(this.urlObj.detailplan, data)
        .then(res => {
          if (res.Code === 200) {
            this.planInfo = res.Data ? res.Data : {}
            if (this.showPlanDialog) {
              this.ruleForm.ymoney = res.Data.cost_money ? res.Data.cost_money : 0
              this.ruleForm.smoney = res.Data.cost_money ? res.Data.cost_money : 0
            }
          } else {
            let msg = res.Message ? res.Message : '获取计划详情数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.detailLoading = false
        })
        .catch(() => {
          this.detailLoading = false
        })
    },

    // 获取收款方式
    getPayments () {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.payOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取收款方式失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 添加计划表单验证
    addSubmit () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 提交数据
          let data = {
            co_id: this.contractId,
            p_id: this.addForm.village[0],
            v_id: this.addForm.village[1],
            subject_id: this.addForm.subject,
            money: this.addForm.money,
            date: this.addForm.dateVal / 1000,
            cycle: this.addForm.cycle,
            num: this.addForm.number,
            remarks: this.addForm.remark
          }
          this.$axios
            .post(this.urlObj.addplan, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '添加收款计划成功！'
                })
                this.showAddDialog = false
                // 重新获取一次详情数据
                this.init(this.contractId)
              } else {
                let msg = res.Message ? res.Message : '添加收款计划失败！'
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

    // 显示计划收款弹框
    showGather (index) {
      this.planId = this.tableData[index].id
      // 重置表单
      if (this.$refs.planForm) {
        this.$refs.planForm.resetFields()
      }
      this.ruleForm.vname = this.vname
      this.ruleForm.uname = this.cntDetail.supplier ? this.cntDetail.supplier.sname : ''
      this.ruleForm.dateVal = new Date().getTime()
      if (this.$menu.getters.judgeRole('Btn-YkAL5trW0MiaydUa6uxxsuCA')) {
        this.dateDisabled = false
      } else {
        this.dateDisabled = true
      }
      this.showPlanDialog = true
      this.getPlanDetail()
      this.getPayments()
      this.getReceiptType()
    },

    // 获取当前项目支持的收据类型
    getReceiptType () {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getreceipttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.receiptType = res.Data ? res.Data.use_receipt_type : ''
          } else {
            let msg = res.Message ? res.Message : '获取收据类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 显示计划收款详情弹框
    showDetail (index) {
      this.planId = this.tableData[index].id
      this.showInfoDialog = true
      this.getPlanDetail()
    },

    // 确认收款处理
    submitForm () {
      this.$refs.planForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 提交数据
          let data = {
            id: this.planId,
            realname: this.ruleForm.uname,
            pay_time: this.ruleForm.dateVal / 1000,
            allmoney: this.ruleForm.ymoney,
            money: this.ruleForm.smoney,
            pay_type: this.ruleForm.paymentTerm,
            is_bill: this.ruleForm.bill,
            remark: this.ruleForm.remark
          }
          if (this.receiptType == 3) {
            data.receipt_type = this.ruleForm.receiptType
            if (this.ruleForm.receiptType == 2) {
              data.is_open_receiptpaper = this.ruleForm.isPaper
            }
          } else if (this.receiptType == 2) {
            data.is_open_receiptpaper = this.ruleForm.isPaper
          }
          this.$axios
            .post(this.urlObj.collectionplan, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '确认收款成功！'
                })
                this.showPlanDialog = false
                // 重新获取一次详情数据
                this.init(this.contractId)
              } else {
                let msg = res.Message ? res.Message : '确认收款失败！'
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

    // 点击退款按钮处理
    refundMoney (index) {
      this.$confirm('确定要对当前计划进行退款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.refundplan, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '退款成功！'
                })
                // 重新获取一次详情数据
                this.init(this.contractId)
              } else {
                let msg = res.Message ? res.Message : '退款失败！'
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

    // 点击通过按钮处理
    planPass (index) {
      this.$confirm('确定要通过当前申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.planId = this.tableData[index].id
          this.auditRequest(1)
        })
        .catch(() => { })
    },

    // 点击驳回按钮处理
    planReject (index) {
      this.$confirm('确定要驳回当前申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.planId = this.tableData[index].id
          this.auditRequest(2)
        })
        .catch(() => { })
    },

    // 审核请求
    auditRequest (value) {
      let data = {
        id: this.planId,
        check: value
      }
      this.$axios
        .post(this.urlObj.examineplan, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: value == 1 ? '申请已通过！' : '申请已驳回！'
            })
            // 重新获取一次详情数据
            this.init(this.contractId)
          } else {
            let tip = value == 1 ? '申请通过失败！' : '申请驳回失败！'
            let msg = res.Message ? res.Message : tip
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击删除按钮处理
    delPlan (index) {
      this.$confirm('确定要删除当前计划吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.delplan, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '计划删除成功！'
                })
                // 重新获取一次详情数据
                this.init(this.contractId)
              } else {
                let msg = res.Message ? res.Message : '计划删除失败！'
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

    // 点击终止按钮处理
    cancelPlan (index) {
      this.$confirm('确定要终止当前计划吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.stopplan, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '计划终止成功！'
                })
                // 重新获取一次详情数据
                this.init(this.contractId)
              } else {
                let msg = res.Message ? res.Message : '计划终止失败！'
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

    // 点击分摊详情按钮
    shareDetails (index) {
      this.shareTableData = []
      this.showShareDialog = true
      // 表格处于加载状态
      this.shareConf.loadStatus = true
      let data = {
        plan_id: this.tableData[index].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.plancost, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.shareTableData = res.Data
            // 关闭加载状态
            this.shareConf.loadStatus = false
            // 清空空数据提示
            this.shareConf.emptyText = ''
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
            this.shareTableData = []
            this.shareConf.emptyText = res.Message
            this.shareConf.dataTotal = 0
            this.shareConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.shareTableData = []
          this.shareConf.emptyText = '服务器连接失败...'
          this.shareConf.dataTotal = 0
          this.shareConf.loadStatus = false
        })
    },

    // 标记计划已收款
    signGather (index) {
      this.$confirm(`确定要把当前计划标记为已收款吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.post(this.urlObj.signplan, { id: this.tableData[index].id }).then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '标记已收款成功！'
              })
              // 重新获取一次详情数据
              this.init(this.contractId)
            } else {
              let msg = res.Message ? res.Message : '标记已收款失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          }).catch(() => { })
        })
        .catch(() => { })
    },

    // 点击刷新按钮处理
    refresh () {
      this.$axios.post(this.urlObj.createplancost, { co_id: this.contractId }).then(res => {
        if (res.Code === 200) {
          this.$message({
            type: 'success',
            message: '刷新成功！'
          })
          // 重新获取一次详情数据
          this.init(this.contractId)
        } else {
          let msg = res.Message ? res.Message : '刷新失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => { })
    },
  }
}
