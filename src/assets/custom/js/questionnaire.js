import questColumns from '../json/quest-columns.json'
import questGrade from '../json/quest-grade.json'
import questUser from '../json/quest-user.json'
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

let id = 0
export default {
  name: 'questionnaire',
  data () {
    return {
      urlObj: {
        bigarea: this.$api.state.Public.bigarea.url,
        village: this.$api.state.Public.village.url,
        areaVillage: this.$api.state.Public.areaVillage.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
        questList: this.$api.state.Custom.questList.url,
        topicList: this.$api.state.Custom.topicList.url,
        questAdd: this.$api.state.Custom.questAdd.url,
        problemAdd: this.$api.state.Custom.problemAdd.url,
        getCommentCount: this.$api.state.Custom.getCommentCount.url,
        getComment: this.$api.state.Custom.getComment.url,
        questexport: this.$api.state.Custom.questexport.url,
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: questColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前操作行 index
      cindex: "",
      // 是否显示新增弹框
      showAddDialog: false,
      // 是否正在加载问题库
      topicLoading: false,
      // 模板标题
      tempTitle: "",
      // 问卷前言
      tempRemark: "",
      // 结束语
      overRemark: "",
      // 图片/文件上传参数
      qiniuDatas: '',
      // 当前要上传文件的信息
      fileInfo: [],
      // 预览图片的 src
      imgSrc: '',
      // 预览图片列表
      imgList: [],
      // 题库选择列表
      topicSelects: [],
      // 题库列表
      topicList: [],
      // 题库列表当前页
      topicCurrentPage: 1,
      // 题库列表当前分页大小
      topicPageSize: 20,
      // 题库总条数
      topicTotal: 0,
      // 是否正在提交数据
      isCommit: false,
      // 是否显示新增/编辑弹框
      showEditDialog: false,
      // 表单数据对象
      ruleForm: {
        type: '',
        content: '',
        options: [
          {
            value: ''
          },
          {
            value: ''
          }
        ]
      },
      // 表单验证规则
      rules: {
        type: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
        content: [
          { required: true, message: '请输入问题内容', trigger: 'blur' }
        ]
      },
      // 是否正在新增问题
      isTopicCommit: false,
      // 是否显示问卷模板分析弹框
      showStatDialog: false,
      // 问卷评分表格数据
      questTableData: [],
      // 问卷评分表格列数据配置
      questColumns: questGrade.list,
      // 问卷评分表格配置
      questConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 项目评分表格数据
      proTableData: [],
      // 项目评分表格列数据配置
      proColumns: questGrade.list,
      // 项目评分表格配置
      proConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 参与用户表格数据
      userTableData: [],
      // 参与用户表格列数据配置
      userColumns: questUser.list,
      // 参与用户表格配置
      userConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 项目级联选择器绑定值
      villageVal: [],
      // 项目级联选择器配置
      villageOptions: [],
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
    this.getUploadToken()
  },

  /**
   * 方法
   */
  methods: {
    // 获取大区数据
    getAreaData () {
      this.$axios.post(this.urlObj.areaVillage).then(res => {
        if (res.Code === 200) {
          this.villageOptions = res.Data
          let bid = Number(sessionStorage.getItem('bid'))
          let cid = Number(sessionStorage.getItem('cid'))
          this.villageVal = [[bid, cid, Number(this.vid)]]
        } else {
          let msg = res.Message ? res.Message : '获取大区、项目数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.questList, data)
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
      this.tempTitle = ""
      this.tempRemark = ""
      this.overRemark = ""
      this.fileInfo = []
      this.imgSrc = ""
      this.imgList = []
      this.topicList = []
      this.topicSelects = []
      this.topicCurrentPage = 1
      this.topicPageSize = 20
      this.topicTotal = 0
      this.isCommit = false
      this.showAddDialog = true
      // 获取题库
      this.getTopicData()
    },

    // 新增模板弹框关闭处理
    addDialogClose () {
      this.$refs.upload.clearFiles()
      this.fileInfo = []
      this.imgSrc = ""
      this.imgList = []
      this.showAddDialog = false
    },

    // 获取题库数据
    getTopicData (id) {
      this.topicLoading = true
      let data = {
        page: this.topicCurrentPage,
        limit: this.topicPageSize,
      }
      this.$axios.post(this.urlObj.topicList, data).then(res => {
        if (res.Code === 200) {
          this.topicTotal = res.Data.total ? res.Data.total : 0
          this.topicList = res.Data.data ? res.Data.data : []
          if (id) {
            let obj = this.topicList.find(item => item.id == id)
            if (obj) {
              this.topicSelects.push(obj)
            }
          }
        } else {
          let msg = res.Message ? res.Message : '获取题库数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.topicLoading = false
      })
    },

    // 题库每页条数改变处理
    topicSizeChange (num) {
      this.topicPageSize = num
      // 获取一次表格数据
      this.getTopicData()
    },

    // 题库当前页码改变处理
    topicCurrentChange (num) {
      this.topicCurrentPage = num
      // 获取一次表格数据
      this.getTopicData()
    },

    // 获取文件上传 token
    getUploadToken () {
      this.$axios.post(this.urlObj.uploadToken).then(res => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    // 自定义上传
    customUpload (params) {
      params.url = this.$refs.upload.uploadFiles[0].url
      let uploadInfo = qiniuUpload(params, this.qiniuDatas)
      var subscription = uploadInfo.observable.subscribe({
        // 上传开始
        // 接收上传进度信息，result是带有total字段的 Object
        // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
        next: result => { },
        // 上传错误后失败报错
        error: errResult => { },
        // 接收成功后返回的信息
        complete: result => {
          this.fileInfo = [uploadInfo.fileInfo]
        }
      })
    },

    // 文件、图片删除处理
    handleRemove () {
      this.fileInfo = []
    },

    // 图片预览
    handlePictureCardPreview (file) {
      this.imgSrc = file.url
      this.imgList = [file.url]
      this.$nextTick(() => {
        this.$refs.preview.clickHandler()
      })
    },

    // 是否显示题库添加图标
    showAdd (obj) {
      let ids = this.topicSelects.map(item => item.id)
      return !ids.includes(obj.id)
    },

    // 点击题库添加图标处理
    topicAdd (obj) {
      let arr = this.topicSelects.map(item => item.id)
      if (!arr.includes(obj.id)) {
        this.topicSelects.push(obj)
      }
    },

    // 点击 删除 处理
    topicDel (index) {
      this.topicSelects.splice(index, 1)
    },

    // 点击新增问题图标处理
    questAdd () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm = {
        type: '',
        content: '',
        options: [
          { value: '' },
          { value: '' },
        ]
      }
      this.showEditDialog = true
    },

    // 点击添加选项按钮
    addOption () {
      this.ruleForm.options.push({ value: "" })
    },

    // 删除选项
    delOption (index) {
      this.ruleForm.options.splice(index, 1)
    },

    // 数据提交处理
    topicSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isTopicCommit = true
          let data = {
            type: this.ruleForm.type,
            name: this.ruleForm.content,
            answer: this.ruleForm.options.map(item => {
              return {
                label: item.value
              }
            })
          }
          this.$axios
            .post(this.urlObj.problemAdd, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '题库添加成功！',
                  type: 'success'
                })
                this.showEditDialog = false
                // 重新获取题库数据
                this.getTopicData(res.Data.id)
              } else {
                let msg = res.Message ? res.Message : '添加题库失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
              this.isTopicCommit = false
            })
            .catch(() => {
              this.isTopicCommit = false
            })
        }
      })
    },

    // 新增问卷模板提交
    tempSubmit () {
      let ids = this.topicSelects.map(item => item.id)
      if (!this.tempTitle) {
        this.$message({
          message: '请填写问卷模板标题！',
          type: 'warning'
        })
        return
      }
      if (ids.length === 0) {
        this.$message({
          message: '请选择问卷题库！',
          type: 'warning'
        })
        return
      }
      this.isCommit = true
      let data = {
        name: this.tempTitle,
        header: this.tempRemark,
        footer: this.overRemark,
        url: this.fileInfo[0].qiniu_key,
        problem_id: ids
      }
      this.$axios
        .post(this.urlObj.questAdd, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '问卷模板添加成功！',
              type: 'success'
            })
            this.showAddDialog = false
            // 重新获取题库数据
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '问卷模板添加失败！'
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

    // 点击表格查看按钮处理
    examine (index) {
      this.cindex = index
      this.showStatDialog = true
      // 获取大区和项目
      this.getAreaData()
      // 获取统计数据
      this.getGatherData()
      // 获取项目统计数据
      this.getVillageGather([this.vid])
      // 获取用户汇总数据
      this.getUserGather()
    },

    // 获取统计汇总数据
    getGatherData () {
      // 表格处于加载状态
      this.questConf.loadStatus = true
      let data = {
        id: this.tableData[this.cindex].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getCommentCount, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.questTableData = res.Data
            // 关闭加载状态
            this.questConf.loadStatus = false
            // 清空空数据提示
            this.questConf.emptyText = ''
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
            this.questTableData = []
            this.questConf.emptyText = res.Message
            this.questConf.dataTotal = 0
            this.questConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.questTableData = []
          this.questConf.emptyText = '服务器连接失败...'
          this.questConf.dataTotal = 0
          this.questConf.loadStatus = false
        })
    },

    // 获取统计汇总数据
    getVillageGather (vids) {
      // 表格处于加载状态
      this.proConf.loadStatus = true
      let data = {
        id: this.tableData[this.cindex].id,
        vid: vids
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getCommentCount, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.proTableData = res.Data
            // 关闭加载状态
            this.proConf.loadStatus = false
            // 清空空数据提示
            this.proConf.emptyText = ''
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
            this.proTableData = []
            this.proConf.emptyText = res.Message
            this.proConf.dataTotal = 0
            this.proConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.proTableData = []
          this.proConf.emptyText = '服务器连接失败...'
          this.proConf.dataTotal = 0
          this.proConf.loadStatus = false
        })
    },

    // 项目选择改变处理
    villageChange (value) {
      let vids = value.map(item => item[item.length - 1])
      this.getVillageGather(vids)
      this.getUserGather()
    },

    // 获取用户汇总数据
    getUserGather () {
      // 表格处于加载状态
      this.userConf.loadStatus = true
      let data = {
        id: this.tableData[this.cindex].id,
        vid: this.villageVal.length > 0 ? this.villageVal.map(item => item[item.length - 1]) : [this.vid]
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getComment, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach((item, index) => {
                item.index = (this.userConf.curPage - 1) * this.userConf.limit + index + 1
                item.vname = item.village.villagename ? item.village.villagename : ''
                item.userName = item.owner.realname ? item.owner.realname : ''
                item.roomNum = item.rooms.roomnum ? item.rooms.roomnum : ''
                item.userTel = item.owner.tel ? item.owner.tel : ''
              })
            }
            // 存放查询数据
            this.userTableData = res.Data.data
            // 关闭加载状态
            this.userConf.loadStatus = false
            // 清空空数据提示
            this.userConf.emptyText = ''
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
            this.userTableData = []
            this.userConf.emptyText = res.Message
            this.userConf.dataTotal = 0
            this.userConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.userTableData = []
          this.userConf.emptyText = '服务器连接失败...'
          this.userConf.dataTotal = 0
          this.userConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    userSizeChange (num) {
      this.userConf.limit = num
      // 获取一次表格数据
      this.getUserGather()
    },

    // 当前页码改变处理
    userCurrentChange (num) {
      this.userConf.curPage = num
      // 获取一次表格数据
      this.getUserGather()
    },

    // 点击用户详情
    userExamine (index) {
      let obj = this.userTableData[index]
      let str = `id=${this.tableData[this.cindex].id}&vid=${obj.vid}&owner_id=${obj.owner_id}&rooms_id=${obj.rooms_id}`
      window.open('http://q.ygddzy.cn/#/readHome?' + encodeURIComponent(str))
    },

    /* 导出EXCEL */
    exportData () {
      let data = {
        vid: this.villageVal.map(item => item[item.length - 1]),
        id: this.tableData[this.cindex].id,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.questexport, data)
        .then(res => {
          if (res.Code === 200) {
            this.exportRecordExcel(res.Data)
          } else {
            let msg = res.Message ? res.Message : '短信发送记录导出失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    /** 处理数据并导出 */
    exportRecordExcel (result) {
      let tableName = ''
      let headers = []
      let datas = []
      tableName = '短信发送记录'
      headers = [
        '项目',
        '姓名',
        '房号',
        '电话',
      ]
      datas = result.map(item => {
        let arr = [
          item.villagename,
          item.realname,
          item.roomnum,
          item.tel,
        ]
        item.problem.forEach((itm, index) => {
          if (index === 0) {
            headers.push(itm.problem_name)
          }
          arr.push(itm.problem_answer)
        })
        return arr
      })

      try {
        require.ensure([], () => {
          // 引入excel.js
          let {
            export_json_to_excel
          } = require('@/assets/common/excel/Export2Excel')

          // 执行导出操作
          export_json_to_excel(headers, datas, tableName)
        })

        this.$notify({
          type: 'success',
          title: '温馨提示',
          message: '导出报表成功',
          duration: 1500
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    },
  }
}
