import workIcon from '@/components/common/workIcon.vue'
import tableCloumns from '../json/table-cloumns.json'
import ContractDetail from '@/components/contract/ContractDetail.vue'

export default {
  name: 'contract',
  components: {
    workIcon,
    ContractDetail
  },
  data () {
    return {
      urlObj: {
        contractType: this.$api.state.Contract.contractType.url,
        getAreas: this.$api.state.Public.getAreas.url,
        getCompany: this.$api.state.Public.getCompany.url,
        getVillage: this.$api.state.Public.getVillage.url,
        contractList: this.$api.state.Contract.contractList.url,
        expireList: this.$api.state.Contract.expireList.url,
        settime: this.$api.state.Contract.settime.url,
        edittype: this.$api.state.Contract.edittype.url,
      },
      // 定时器对象
      leftScroll: null,
      // 即将到期合同列表
      contractList: [],
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: tableCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 合同类型
      contractType: [],
      // 所属大区
      areaVal: '',
      areaOptions: [],
      // 所属公司
      companyVal: '',
      companyOptions: [],
      // 所属项目
      villageVal: '',
      villageOptions: [],
      // 状态
      statusVal: '',
      // 是否显示打印内容
      showPrint: false,
      // 表单数据对象
      ruleForm: {
        stime: '',
        etime: '',
        ctype: '',
        stype: '',
      },
      // 表单验证规则
      rules: {
        stime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        etime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        ctype: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        stype: [{ required: true, message: '请选择二级类型', trigger: 'change' }],
      },
      // 是否显示设置起止日期/合同类型弹框
      showSetDialog: false,
      // 当前设置日期/类型的 index
      setIndex: '',
      // 当前操作类型(1: 日期；2: 类型)
      otype: 1,
      // 合同类型选择列表数据
      ctypeOptions: [],
      // 二级类型选择列表
      stypeOptions: [],
      // 是否正在提交数据
      isCommit: false,
    }
  },

  // 计算属性
  computed: {
    // 开始时间限制
    spickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            let etime = this.ruleForm.etime
            return etime ? time.getTime() > etime : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            let stime = this.ruleForm.stime
            return stime ? time.getTime() < stime : false
          }
        }
      }
    },
  },

  /**
   * 生命周期
   */
  mounted () {
    let msg1 = document.getElementById('msg1')
    msg1.style.left = '0px'
    this.leftScroll = setInterval(this.myScrollTop, 50)
    this.getContractList()
    this.getAreaData()
    this.tableLoad()
  },

  destroyed () {
    clearInterval(this.leftScroll)
  },

  /**
   * 方法
   */
  methods: {
    // 文本滚动
    myScrollTop () {
      let msg1 = document.getElementById('msg1')
      if (Math.abs(parseInt(msg1.style.left)) > msg1.scrollWidth) {
        let content = document.getElementById('content')
        msg1.style.left = content.clientWidth + 'px'
      } else {
        msg1.style.left = parseInt(msg1.style.left) - 3 + 'px'
      }
    },

    // 移除滚动
    scrollOver () {
      clearInterval(this.leftScroll)
    },

    // 鼠标离开继续滚动
    scrollOut () {
      this.leftScroll = setInterval(this.myScrollTop, 50)
    },

    // 获取即将到期合同数据
    getContractList () {
      this.$axios
        .post(this.urlObj.expireList)
        .then(res => {
          if (res.Code === 200) {
            this.contractList = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取合同数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 合同类型数据加载
    lazyLoad (node, resolve) {
      this.$axios
        .post(this.urlObj.contractType, { pid: node.value })
        .then(res => {
          if (res.Code === 200) {
            resolve(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取合同类型数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 获取大区
    getAreaData () {
      this.$axios
        .post(this.urlObj.getAreas)
        .then(res => {
          if (res.Code === 200) {
            this.areaOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取大区数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 获取公司
    getCompanyData (id) {
      this.$axios
        .post(this.urlObj.getCompany, { bgid: id })
        .then(res => {
          if (res.Code === 200) {
            this.companyOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取公司数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 获取项目
    getVillageData (id) {
      this.$axios
        .post(this.urlObj.getVillage, { pid: id })
        .then(res => {
          if (res.Code === 200) {
            this.villageOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取项目数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 大区选择更改
    areaChange (value) {
      this.companyVal = ''
      this.companyOptions = []
      this.villageVal = ''
      this.villageOptions = []
      if (value) {
        this.getCompanyData(value)
      }
      this.tableLoad()
    },

    // 公司选择更改
    companyChange (value) {
      this.villageVal = ''
      this.villageOptions = []
      if (value) {
        this.getVillageData(value)
      }
      this.tableLoad()
    },

    // 首页表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        keywords: this.searchVal,
        type_id: this.contractType[0] ? this.contractType[0] : '',
        type_s_id: this.contractType[1] ? this.contractType[1] : '',
        a_id: this.areaVal,
        c_id: this.companyVal,
        p_id: this.villageVal,
        expire: this.statusVal,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.contractList, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach(item => {
              item.cname = item.cuser ? item.cuser.realname : ''
              item.supname = item.supplier ? item.supplier.sname : ''
              item.vtype = item.type ? item.type.ct_name : ''
              item.villagename = item.village_arr ? item.village_arr.join('、') : ''
              item.exec_start_time = item.exec_start_time ? item.exec_start_time : '无'
              item.exec_end_time = item.exec_end_time ? item.exec_end_time : '无'
              let date = new Date(item.co_createtime * 1000)
              let y = date.getFullYear()
              let m =
                date.getMonth() + 1 < 10
                  ? '0' + (date.getMonth() + 1)
                  : date.getMonth() + 1
              let d =
                date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
              item.co_createtime = y + '-' + m + '-' + d
              if (item.expire == 3) {
                item.statusColor = 'rgb(245, 108, 108)'
              }
            })
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

    // 查看合同详情
    showDetail (index) {
      let id = this.tableData[index].co_id
      this.$refs.contractDetail.init(id)
    },

    // 设置起止日期
    setDate (index) {
      this.setIndex = index
      this.otype = 1
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showSetDialog = true
      if (this.tableData[index].starttime) {
        this.ruleForm.stime = this.tableData[index].starttime * 1000
      }
      if (this.tableData[index].endtime) {
        this.ruleForm.etime = this.tableData[index].endtime * 1000
      }
    },

    // 设置合同类型
    setType (index) {
      this.setIndex = index
      this.otype = 2
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showSetDialog = true
      this.ruleForm.ctype = this.tableData[index].type_id ? this.tableData[index].type_id : ''
      this.ruleForm.stype = this.tableData[index].type_s_id ? this.tableData[index].type_s_id : ''
      this.getContractTypes()
      if (this.ruleForm.stype) {
        this.getSecondTypes()
      }
    },

    // 获取合同类型
    getContractTypes () {
      this.$axios.post(this.urlObj.contractType).then(res => {
        if (res.Code === 200) {
          this.ctypeOptions = res.Data ? res.Data : []
        } else {
          let msg = res.Message ? res.Message : '获取合同类型数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => { })
    },

    // 合同类型值改变处理
    ctypeChange (value) {
      this.ruleForm.stype = ''
      this.stypeOptions = []
      if (value) {
        this.getSecondTypes()
      }
    },

    // 获取二级类型
    getSecondTypes () {
      this.$axios.post(this.urlObj.contractType, { pid: this.ruleForm.ctype }).then(res => {
        if (res.Code === 200) {
          this.stypeOptions = res.Data ? res.Data : []
        } else {
          let msg = res.Message ? res.Message : '获取二级类型数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => { })
    },

    // 设置起止日期/合同类型提交处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let url = ''
          let data = ''
          if (this.otype === 1) {
            url = this.urlObj.settime
            data = {
              co_id: this.tableData[this.setIndex].co_id,
              starttime: this.ruleForm.stime / 1000,
              endtime: this.ruleForm.etime / 1000,
            }
          } else {
            url = this.urlObj.edittype
            data = {
              co_id: this.tableData[this.setIndex].co_id,
              type_id: this.ruleForm.ctype,
              type_s_id: this.ruleForm.stype,
            }
          }
          this.$axios.post(url, data).then(res => {
            if (res.Code === 200) {
              let msg = this.otype === 1 ? '起止日期设置成功！' : '合同类型设置成功！'
              this.$message({
                type: 'success',
                message: msg
              })
              this.showSetDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '提交失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isCommit = false
          }).catch(() => {
            this.isCommit = false
          })
        }
      })
    },

    // 点击滚动区的合同处理
    toDetail (id) {
      this.$refs.contractDetail.init(id)
    },

    // 打印处理
    printHandle () {
      this.showPrint = true;
      setTimeout(() => {
        this.showPrint = false;
      }, 500)
    },

    // 筛选 复选框改变处理
    checkChange () {
      let arr = JSON.parse(JSON.stringify(this.columns))
      this.columns = arr
    }
  }
}
