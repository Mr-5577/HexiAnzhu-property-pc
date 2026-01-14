import paymentLog from '../json/payment-log.json'
//导入draggable组件
import draggable from 'vuedraggable'

export default {
  name: 'payment',
  components: {
    draggable
  },
  data () {
    return {
      // 接口对象
      urlObj: {
        paymentList: this.$api.state.Setting.paymentList.url,
        paymentOfVillage: this.$api.state.Setting.paymentOfVillage.url,
        addPayment: this.$api.state.Setting.addPayment.url,
        paymentLog: this.$api.state.Setting.paymentLog.url,
        paymentUnbind: this.$api.state.Setting.paymentUnbind.url,
        paymentOpen: this.$api.state.Setting.paymentOpen.url,
        paymentSort: this.$api.state.Setting.paymentSort.url,
      },
      // 是否正在加载数据
      isLoading: false,
      // 支付方式绑定值
      paymentVal: '',
      // 支付方式选择列表
      paymentOptions: [],
      // 树控件数据
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 是否显示新增付款方式弹框
      showAddPop: false,
      // 弹框表单数据
      ruleForm: {
        payName: '',
        short: '',
        devPayVal: '',
        openStatus: ''
      },
      // 表单验证对象
      rules: {
        payName: [
          { required: true, message: '请输入付款方式名称', trigger: 'blur' }
        ],
        short: [
          { required: true, message: '请输入付款方式简称', trigger: 'blur' }
        ],
        devPayVal: [
          { required: true, message: '请选择开发商支付类', trigger: 'change' }
        ],
        openStatus: [
          { required: true, message: '请选择是否开启', trigger: 'change' }
        ]
      },
      // 开发商支付类列表
      devOptions: [
        {
          value: 0,
          label: '非实收方式'
        },
        {
          value: 1,
          label: '实收方式'
        }
      ],
      // 是否开启列表
      openOptions: [
        {
          value: 0,
          label: '默认不开启'
        },
        {
          value: 1,
          label: '默认开启'
        }
      ],
      // 是否显示变更日志弹框
      showLogPop: false,
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: paymentLog.list,
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
      // 默认选择
      checkedKeys: [],
      // 默认展开的节点
      expandedKeys: []
    }
  },

  // 生命周期
  created () {
    this.getPaymentList(true)
  },

  // 方法
  methods: {
    // 获取付款方式列表
    getPaymentList (flag) {
      this.$axios
        .post(this.urlObj.paymentList)
        .then(res => {
          if (res.Code == 200) {
            this.paymentOptions = res.Data ? res.Data : []
            this.paymentVal =
              res.Data && res.Data.length > 0 ? res.Data[0].id : ''
            if (flag) {
              this.getTreeData()
            }
          } else {
            let msg = res.Message ? res.Message : '获取付款方式失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取树形结构数据
    getTreeData () {
      this.isLoading = true
      let data = {
        payment_type_id: this.paymentVal
      }
      // 获取城市、项目数据
      this.$axios
        .post(this.urlObj.paymentOfVillage, data)
        .then(res => {
          if (res.Code == 200) {
            let arr = []
            res.Data.forEach(item => {
              item.disabled = false
              if (item.children && item.children.length > 0) {
                item.children.forEach(itm => {
                  if (itm.checked) {
                    arr.push(itm.nodeid)
                  }
                })
              }
            })
            this.checkedKeys = arr
            this.treeData = res.Data
            this.isLoading = false
          } else {
            this.$message({
              message: '获取数据失败！',
              type: 'error'
            })
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    // 节点复选框点击事件
    nodeCheck (data, node) {
      let nodes = []
      let childKeys = node.checkedKeys.filter(item =>
        item.startsWith('village')
      )
      if (childKeys.length > this.checkedKeys.length) {
        childKeys.forEach(item => {
          if (!this.checkedKeys.includes(item)) {
            nodes.push(item)
          }
        })
        let arr = []
        this.treeData.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(itm => {
              if (nodes.includes(itm.nodeid)) {
                arr.push(itm.id)
              }
            })
          }
        })
        let data = {
          add_vid: arr,
          id: this.paymentVal
        }
        this.payBind(data)
      } else {
        this.checkedKeys.forEach(item => {
          if (!childKeys.includes(item)) {
            nodes.push(item)
          }
        })
        let arr = []
        this.treeData.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(itm => {
              if (nodes.includes(itm.nodeid)) {
                arr.push(itm.id)
              }
            })
          }
        })
        let data = {
          del_vid: arr,
          id: this.paymentVal
        }
        this.payBind(data)
      }
    },

    // 节点展开触发
    nodeExpand (data) {
      this.expandedKeys = [data.nodeid]
    },

    // 节点关闭
    nodeCollapse () {
      this.expandedKeys = []
    },

    // 绑定/解绑请求
    payBind (data) {
      this.$axios
        .post(this.urlObj.paymentUnbind, data)
        .then(res => {
          if (res.Code == 200) {
            let tip = data.add_vid ? '绑定成功！' : '解绑成功！'
            this.$message({
              message: tip,
              type: 'success'
            })
            this.getTreeData()
          } else {
            let tip = data.add_vid ? '绑定失败！' : '解绑失败'
            let msg = res.Message ? res.Message : tip
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 支付方式绑定切换处理
    switchChange (item) {
      if (item.is_open == 0) {
        item.is_open = 1
      } else {
        item.is_open = 0
      }
      let data = {
        is_open: item.is_open,
        id: item.id
      }
      this.$axios
        .post(this.urlObj.paymentOpen, data)
        .then(res => {
          if (res.Code == 200) {
            let tip =
              item.is_open == 1 ? '付款方式开启成功！' : '付款方式关闭成功！'
            this.$message({
              message: tip,
              type: 'success'
            })
            // 重新获取一次付款方式
            this.getPaymentList(false)
          } else {
            let tip =
              item.is_open == 1 ? '付款方式开启失败！' : '付款方式关闭失败'
            let msg = res.Message ? res.Message : tip
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取变更日志表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.paymentLog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.cname = item.createuser ? item.createuser.realname : ''
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

    // 点击新增付款方式按钮处理
    addDialogInit () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showAddPop = true
    },

    // 点击变更日志按钮处理
    logDialogInit () {
      this.showLogPop = true
      this.tableLoad()
    },

    // 数据提交处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            name: this.ruleForm.payName,
            short: this.ruleForm.short,
            receipts: this.ruleForm.devPayVal,
            is_open: this.ruleForm.openStatus
          }
          this.$axios
            .post(this.urlObj.addPayment, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '新增付款方式成功！',
                  type: 'success'
                })
                // 关闭弹框重新获取表格数据
                this.showAddPop = false
                this.getPaymentList(false)
              } else {
                let msg = res.Message ? res.Message : '新增付款方式失败！'
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
    },

    // 拖拽结束
    dragEnd () {
      let data = this.paymentOptions.map((item, index) => {
        return {
          id: item.id,
          sort: index + 1
        }
      })
      this.$axios.post(this.urlObj.paymentSort, { sort: data }).then(res => {
        if (res.Code === 200) {
          this.$message({
            type: 'success',
            message: '支付方式排序成功！'
          })
        } else {
          let msg = res.Message ? res.Message : '支付方式排序失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => { })
    }
  }
}
