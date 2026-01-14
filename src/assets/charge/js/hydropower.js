import hydropCloumns from '../json/hydrop-cloumns.json'
import hydropRecord from '../json/hydrop-record.json'
import hydropLog from '../json/hydrop-log.json'
import hydropLogAll from '../json/hydrop-log-all.json'

export default {
  name: 'hydropower',
  data () {
    return {
      urlObj: {
        subjectbytype: this.$api.state.Public.subjectbytype.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        waterresourcestype: this.$api.state.Charge.waterresourcestype.url,
        searchwater: this.$api.state.Charge.searchwater.url,
        watersearchtype: this.$api.state.Charge.watersearchtype.url,
        inputwaternumber: this.$api.state.Charge.inputwaternumber.url,
        watercostlist: this.$api.state.Charge.watercostlist.url,
        watercostdel: this.$api.state.Charge.watercostdel.url,
        searchdatabyweg: this.$api.state.Charge.searchdatabyweg.url,
        initwater: this.$api.state.Charge.initwater.url,
        editwatername: this.$api.state.Charge.editwatername.url,
        editwater: this.$api.state.Charge.editwater.url,
        waterexcel: this.$api.state.Charge.waterexcel.url,
        waterbyexcel: this.$api.state.Charge.waterbyexcel.url,
        batchwaterel: this.$api.state.Charge.batchwaterel.url,
        logData: this.$api.state.Means.logData.url,
        logdataall: this.$api.state.Means.logdataall.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 抄表日期绑定值
      dateVal: '',
      // 资源类型下拉框绑定值
      resourceVal: '',
      // 资源类型数据列表
      resourceOptions: [],
      // 楼栋绑定值
      buildVal: '',
      // 楼栋数据列表
      buildOptions: [],
      // 关键字绑定值
      keywords: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: hydropCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前选择的表格的 index
      currentIndex: '',
      // 是否显示初始录入弹框
      showEnterDialog: false,
      // 用户搜索框绑定值
      autoValue: '',
      // 当前用户信息数据
      currentUser: {},
      // 表单数据对象
      ruleForm: {
        resourceName: '',
        uname: '',
        resourceType: '',
        threeName: '',
        rate: 1,
        subject: [],
        number: '',
        readTime: ''
      },
      // 表单验证对象
      rules: {
        resourceName: [
          { required: true, message: '请填写资源名称', trigger: 'change' }
        ],
        uname: [
          { required: true, message: '请填写客户姓名', trigger: 'change' }
        ],
        resourceType: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        threeName: [
          { required: true, message: '请输入三表名称', trigger: 'blur' }
        ],
        rate: [
          { required: true, message: '请输入倍率', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请选择缴费科目', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请填写起始读数', trigger: 'blur' }
        ],
        readTime: [
          { required: true, message: '请选择抄表日期', trigger: 'change' }
        ]
      },
      // 资源类型列表
      typeOptions: [],
      // 缴费科目列表
      subOptions: [],
      // 是否正在提交数据
      isCommit: false,
      // 是否显示记录弹框
      showRecordDialog: false,
      // 表格数据
      popTableData: [],
      // 表格列数据配置
      popColumns: hydropRecord.list,
      // 表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示编辑弹框
      showEditDialog: false,
      // 表单数据对象
      editForm: {
        threeName: '',
        rate: 1,
      },
      // 表单验证对象
      editRules: {
        threeName: [
          { required: true, message: '请输入三表名称', trigger: 'blur' }
        ],
        rate: [
          { required: true, message: '请输入倍率', trigger: 'blur' }
        ]
      },
      aurl: '',
      // 是否正在提交数据
      uploading: false,
      // 上传列表
      fileList: [],
      // 是否正在提交数据
      commiting: false,
      // 表格当前选择的数据列表
      tableSelected: [],
      // 是否显示变更日志弹框
      showLogDialog: false,
      // 表格数据
      logTableData: [],
      // 表格列数据配置
      logColumns: hydropLog.list,
      // 表格配置
      logConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
    }
  },

  // 计算属性
  computed: {
    // 开始时间限制
    spickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.endTime ? time.getTime() > new Date(this.endTime).getTime() : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.startTime ? time.getTime() < new Date(this.startTime).getTime() : false
          }
        }
      }
    }
  },

  mounted () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    // 给定默认日期
    this.dateVal = new Date().getTime()
    // 获取资源列表
    this.getResourceType()
    // 获取项目下的楼栋
    this.getBuildList()
  },

  methods: {
    // 获取资源类型
    getResourceType () {
      this.$axios
        .post(this.urlObj.waterresourcestype)
        .then(res => {
          if (res.Code === 200) {
            this.resourceOptions = res.Data
            this.resourceVal =
              res.Data && res.Data.length > 0 ? res.Data[0].type : ''
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '获取资源类型数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取楼栋列表
    getBuildList () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼栋数据失败！'
            this.$message({
              message: msg,
              type: 'error'
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
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        type: this.resourceVal,
        bid: this.buildVal,
        keywords: this.keywords
      }
      this.$axios
        .post(this.urlObj.searchwater, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.oname = item.owner ? item.owner.realname : ''
                item.money = '0.00'
                item.cnumber = ''
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

    // 记录弹框获取表格数据
    popTableLoad () {
      // 表格处于加载状态
      this.popConf.loadStatus = true
      let data = {
        page: this.popConf.curPage,
        limit: this.popConf.limit,
        type: this.resourceVal,
        id: this.tableData[this.currentIndex].id,
        starttime: this.startTime ? this.startTime.split('-').join('') : '',
        endtime: this.endTime ? this.endTime.split('-').join('') : '',
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.watercostlist, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.popConf.dataTotal = res.Data.total
            // 存放查询数据
            this.popTableData = res.Data.data
            // 关闭加载状态
            this.popConf.loadStatus = false
            // 清空空数据提示
            this.popConf.emptyText = ''
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
            this.popTableData = []
            this.popConf.emptyText = res.Message
            this.popConf.dataTotal = 0
            this.popConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.popTableData = []
          this.popConf.emptyText = '服务器连接失败...'
          this.popConf.dataTotal = 0
          this.popConf.loadStatus = false
        })
    },

    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.resourceVal = ''
      this.buildVal = ''
      this.keywords = ''
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 获取资源列表
      this.getResourceType()
      // 获取项目下的楼栋
      this.getBuildList()
    },

    // 表格每页条数改变处理
    sizeChange (num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 记录弹框表格每页条数改变处理
    popSizeChange (num) {
      this.popConf.limit = num
      // 获取一次表格数据
      this.popTableLoad()
    },

    // 当前页码改变处理
    currentChange (num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 记录弹框当前页码改变处理
    popCurrentChange (num) {
      this.popConf.curPage = num
      // 获取一次表格数据
      this.popTableLoad()
    },

    // 资源名称修改处理
    nameChange (obj) {
      let data = {
        type: this.resourceVal,
        id: this.tableData[obj.index].id,
        name: obj.value
      }
      // 度数修改请求
      this.$axios
        .post(this.urlObj.editwatername, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '资源名称修改成功！',
              type: 'success'
            })
          } else {
            let msg = res.Message ? res.Message : '资源名称修改失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          // 刷新数据
          this.tableLoad()
        })
        .catch(() => { })
    },

    // 修改度数处理
    textChange (obj) {
      let data = this.tableData[obj.index]
      let num = obj.value - data.number
      if (num < 0) {
        this.$message({
          type: 'warning',
          message: '本次度数不能小于上次度数！'
        })
        data.money = '0.00'
        data.cnumber = ''
      } else {
        data.cnumber = obj.value
        let money = 0
        data.subject.forEach(item => {
          money = _.add(Number(money),
            _.round(_.multiply(_.multiply(Number(num), Number(item.price)), Number(data.magnification)), 1)
          )
        })
        data.money = money.toFixed(2)
      }
    },

    // 点击初始录入按钮处理
    enterHandle () {
      this.autoValue = ''
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showEnterDialog = true
    },

    // 搜索获取业主数据
    async querySearchAsync (queryStr, cb) {
      if (this.choseVillageInfo.vid) {
        if (queryStr) {
          let value = {
            keywords: queryStr,
            vid: this.choseVillageInfo.vid
          }
          let res = await this.$axios.post(this.urlObj.searchdatabyweg, value)
          if (res.Code === 200) {
            let first = {
              id: 0,
              username: '姓名',
              tel: '电话号码',
              title: '资源名称'
            }
            res.Data.unshift(first)
            this.allUserList = res.Data
            this.nomore = false
            cb(res.Data)
          } else {
            this.$refs.searchInput.$children[0].blur()
          }
        } else {
          cb([])
        }
      } else {
        this.$refs.searchInput.close()
        this.$message({
          type: 'warning',
          message: '请选择项目后再搜索！'
        })
      }
    },

    // 选择用户处理
    handleSelect (user) {
      this.currentUser = user
      this.ruleForm.resourceName = user.title
      this.ruleForm.uname = user.username
    },

    // 资源类型改变处理
    typeChange (value) {
      this.ruleForm.subject = ''
      this.subOptions = []
      if (value) {
        let data = {
          vid: this.choseVillageInfo.vid,
          resource_type_id: value
        }
        // 获取缴费科目
        this.$axios
          .post(this.urlObj.subjectbytype, data)
          .then(res => {
            if (res.Code === 200) {
              this.subOptions = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '获取缴费科目数据失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          .catch(() => { })
      }
    },

    // 提交数据处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let index = this.resourceOptions.findIndex(
            item => item.id == this.ruleForm.resourceType
          )
          let data = {
            id: this.currentUser.id,
            oid: this.currentUser.oid,
            vid: this.choseVillageInfo.vid,
            type: this.resourceOptions[index].type,
            resources_type: this.currentUser.type,
            resources_type_id: this.resourceOptions[index].id,
            number: this.ruleForm.number,
            subject_id: this.ruleForm.subject,
            input_time: this.ruleForm.readTime / 1000,
            name: this.ruleForm.threeName,
            magnification: this.ruleForm.rate
          }
          this.$axios
            .post(this.urlObj.initwater, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '录入成功！',
                  type: 'success'
                })
                // 关闭弹框
                this.showEnterDialog = false
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '录入失败！'
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

    // 点击表格提交按钮处理
    degCommit (index) {
      this.currentIndex = index
      if (this.tableData[index].cnumber) {
        this.commiting = true
        let data = {
          type: this.resourceVal,
          id: this.tableData[index].id,
          number: this.tableData[index].cnumber,
          time: parseInt(this.dateVal / 1000)
        }
        // 度数修改请求
        this.$axios
          .post(this.urlObj.inputwaternumber, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                message: '本次度数录入成功！',
                type: 'success'
              })
              // 刷新数据
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '录入本次度数失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
            this.commiting = false
          })
          .catch(() => {
            this.commiting = false
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请输入本次度数'
        })
      }
    },

    // 批量提交处理
    batchCommit () {
      const verify = (item) => item.cnumber
      if (this.tableSelected.every(verify)) {
        this.commiting = true
        let data = this.tableSelected.map(item => {
          return {
            id: item.id,
            type: this.resourceVal,
            number: item.cnumber,
            time: parseInt(this.dateVal / 1000),
          }
        })
        // 度数修改请求
        this.$axios
          .post(this.urlObj.batchwaterel, { data })
          .then(res => {
            if (res.Code === 200) {
              if (res.Data.error_num > 0) {
                let msg = '失败信息：' + res.Data.error_msg.join(';')
                this.$message({
                  message: msg,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '批量提交成功！',
                  type: 'success'
                })
              }
              // 刷新数据
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '批量提交失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
            this.commiting = false
          })
          .catch(() => {
            this.commiting = false
          })
      } else {
        this.$message({
          type: 'warning',
          message: '存在本次度数为空的数据',
        })
      }
    },

    // 点击表格查看记录按钮
    checkRecord (index) {
      this.currentIndex = index
      this.startTime = ''
      this.endTime = ''
      this.showRecordDialog = true
      // 获取记录弹框表格数据
      this.popTableLoad()
    },

    // 点击表格编辑按钮处理
    sourceEdit (index) {
      this.currentIndex = index
      // 表单验证重置
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      this.editForm.threeName = this.tableData[index].name
      this.editForm.rate = this.tableData[index].magnification ? this.tableData[index].magnification : ''
      this.showEditDialog = true
    },

    // 编辑提交处理
    editSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            id: this.tableData[this.currentIndex].id,
            type: this.tableData[this.currentIndex].type_text,
            name: this.editForm.threeName,
            magnification: this.editForm.rate
          }
          this.$axios
            .post(this.urlObj.editwater, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '编辑成功！',
                  type: 'success'
                })
                // 关闭弹框
                this.showEditDialog = false
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '编辑失败！'
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

    // 表格勾选处理
    selectionChange (arr) {
      this.tableSelected = arr;
    },

    // 删除记录
    delRecord (index) {
      this.$confirm('此操作将永久删除当前记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.popTableData[index].id
          }
          this.$axios
            .post(this.urlObj.watercostdel, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.popTableLoad()
              } else {
                let msg = res.Message ? res.Message : '记录删除失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },

    // 自定义上传
    customUpload (params) {
      this.uploading = true
      // 创建form对象
      let fd = new FormData()
      // 通过append向form对象添加数据
      fd.append("file", params.file)
      this.$axios({
        method: 'post',
        url: this.urlObj.waterbyexcel,
        data: fd,
        headers: { type: 'upload' }
      }).then(res => {
        if (res.Code === 200) {
          if (res.Data.error_num && res.Data.error_num > 0) {
            let msg = '错误信息：' + res.Data.error_msg.join(';')
            this.$message({
              type: 'warning',
              message: msg,
            })
          } else {
            this.$message({
              type: 'success',
              message: '批量导入成功！'
            })
          }
          // 重新获取表格数据
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '批量导入失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.uploading = false
        this.fileList = []
        this.$refs.upload.clearFiles()
      })
        .catch(() => {
          this.uploading = false
          this.fileList = []
          this.$refs.upload.clearFiles()
        })
    },

    // 下载模板
    downloadTemp () {
      let data = {
        vid: this.choseVillageInfo.vid,
        type: this.resourceVal,
        bid: this.buildVal,
        keywords: this.keywords
      }
      this.$axios({
        method: 'post',
        url: this.urlObj.waterexcel,
        data: data,
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob([res])//构造一个blob对象来处理数据
        if ('download' in document.createElement('a')) { //支持a标签download的浏览器
          const link = document.createElement('a')//创建a标签
          link.download = '水电批量导入模板.xlsx' //a标签添加属性
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()//执行下载
          URL.revokeObjectURL(link.href) //释放url
          document.body.removeChild(link)//释放标签
        } else { //其他浏览器
          navigator.msSaveBlob(blob, fileName)
        }
      })
        .catch(() => { })
    },

    // 点击变更日志按钮处理
    logHandle () {
      this.logTableData = []
      this.logColumns = hydropLogAll.list
      // 表格配置
      this.logConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.showLogDialog = true
      this.logTableLoad()
    },

    // 点击记录 变更日志按钮处理
    recordLogHandle () {
      this.logTableData = []
      this.logColumns = hydropLog.list
      // 表格配置
      this.logConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.showLogDialog = true
      this.logTableLoad(this.tableData[this.currentIndex].id)
    },

    // 获取项目使用情况表格数据
    logTableLoad (id) {
      // 表格处于加载状态
      this.logConf.loadStatus = true
      let url = this.urlObj.logdataall
      let data = {
        page: this.logConf.curPage,
        limit: this.logConf.limit,
        type: this.resourceVal,
      }
      if (id) {
        data.id = id
        url = this.urlObj.logData
      } else {
        data.vid = this.choseVillageInfo.vid
      }
      // 获取项目列表数据
      this.$axios
        .post(url, data)
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
