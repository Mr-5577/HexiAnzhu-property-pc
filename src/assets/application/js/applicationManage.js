import applicationColumns from '../json/application-columns.json'
import appDetail from '../json/app-detail.json'
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'applicationManage',
  data () {
    return {
      urlObj: {
        uploadToken: this.$api.state.Public.uploadToken.url,
        applist: this.$api.state.Application.applist.url,
        addapplication: this.$api.state.Application.addapplication.url,
        editapplication: this.$api.state.Application.editapplication.url,
        applicationvillage: this.$api.state.Application.applicationvillage.url,
        saveapplication: this.$api.state.Application.saveapplication.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: applicationColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 表格数据
      detailTableData: [],
      // 表格列数据配置
      detailColumns: appDetail.list,
      // 表格配置
      detailConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 状态绑定值
      statusVal: '',
      statusOptions: [
        {
          value: 1,
          label: '关闭'
        },
        {
          value: 2,
          label: '开启'
        }
      ],
      // 当前是编辑还是新增
      type: 'add',
      // 当前编辑得应用 index
      currentIndex: '',
      // 是否显示应用详情弹框
      showDetailDialog: false,
      // 是否显示添加/编辑应用弹框
      showEditDialog: false,
      // 新增/编辑应用弹框标题
      dialogTitle: '新增应用',
      // 弹框状态列表
      statusList: [
        {
          value: 0,
          label: '关闭'
        },
        {
          value: 1,
          label: '开启'
        }
      ],
      // 表单数据对象
      ruleForm: {
        appName: '',
        defaultState: '',
        isOutside: '',
        appid: '',
        appAdress: '',
        appSort: ''
      },
      // 表单验证规则
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        defaultState: [
          { required: true, message: '请选择默认状态', trigger: 'change' }
        ],
        isOutside: [
          { required: true, message: '请选择是否外链', trigger: 'change' }
        ],
        appid: [
          { required: false, message: '请输入应用appid', trigger: 'blur' }
        ],
        appAdress: [
          { required: false, message: '请输入应用地址', trigger: 'blur' }
        ],
        appSort: [
          { required: true, message: '请选择应用排序', trigger: 'blur' }
        ]
      },
      // 图片/文件上传参数
      qiniuDatas: '',
      // 当前要上传文件的信息
      fileInfo: [],
      fileList: [],
      // 是否正在提交数据
      isCommit: false,
      // 预览图片的 src
      imgSrc: '',
      // 预览图片列表
      imgList: []
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

    // 点击表格图片处理
    imgPreview (obj) {
      this.handlePictureCardPreview({ url: obj.image_host })
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        keywords: this.searchVal,
        status: this.statusVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.applist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.status_text = item.status == 1 ? '开启' : '关闭'
              })
            }
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

    // 获取表格数据
    detailTableLoad (index) {
      // 表格处于加载状态
      this.detailConf.loadStatus = true
      let data = {
        id: this.tableData[index].id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.applicationvillage, data)
        .then(res => {
          if (res.Code === 200) {
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

    // 点击查询处理
    keySearch () {
      // 请求接口获取表单数据
      this.tableLoad()
    },

    // // 表格每页条数改变处理
    // sizeChange(num) {
    //   this.conf.limit = num
    //   // 获取一次表格数据
    //   this.tableLoad()
    // },

    // // 表格每页条数改变处理
    // detailSizeChange(num) {
    //   this.detailConf.limit = num
    //   // 获取一次表格数据
    //   this.detailTableLoad()
    // },

    // // 当前页码改变处理
    // currentChange(num) {
    //   this.conf.curPage = num
    //   // 获取一次表格数据
    //   this.tableLoad()
    // },

    // // 当前页码改变处理
    // detailCurrentChange(num) {
    //   this.detailConf.curPage = num
    //   // 获取一次表格数据
    //   this.detailTableLoad()
    // },

    // 查看应用详情
    showDetail (index) {
      this.currentIndex = index
      this.showDetailDialog = true
      // 获取一次表格数据
      this.detailTableLoad(index)
    },

    // 弹框显示初始化
    addApp () {
      this.type = 'add'
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.dialogTitle = '新增应用'
      this.fileInfo = []
      this.fileList = []
      this.imgSrc = ''
      this.imgList = []
      this.showEditDialog = true
    },

    // 应用编辑
    appEdit (index) {
      this.showEditDialog = true
      this.currentIndex = index
      this.type = 'edit'
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.dialogTitle = '编辑应用设置'
      this.ruleForm.appName = this.tableData[index].name
      this.ruleForm.defaultState = this.tableData[index].status
      this.ruleForm.isOutside = this.tableData[index].is_outside
      this.ruleForm.appid = this.tableData[index].appid
      this.ruleForm.appAdress = this.tableData[index].url
      this.ruleForm.appSort = this.tableData[index].sort
      if (this.tableData[index].image) {
        this.fileInfo = [{ qiniu_key: this.tableData[index].image }]
        this.fileList = [
          {
            name: '',
            url: this.tableData[index].image_host
          }
        ]
      }
      this.imgSrc = ''
      this.imgList = []
    },

    // 新增/编辑确认处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let url = this.urlObj.addapplication
          // 提交数据
          let data = {
            name: this.ruleForm.appName,
            status: this.ruleForm.defaultState,
            is_outside: this.ruleForm.isOutside,
            appid: this.ruleForm.appid ? this.ruleForm.appid : '',
            url: this.ruleForm.appAdress,
            sort: this.ruleForm.appSort,
          }
          if (this.fileInfo.length > 0) {
            data.image = this.fileInfo[0].qiniu_key
          }
          if (this.type == 'edit') {
            url = this.urlObj.editapplication
            data.id = this.tableData[this.currentIndex].id
          }
          this.$axios
            .post(url, data)
            .then(res => {
              if (res.Code === 200) {
                let msg =
                  this.type == 'edit' ? '应用编辑成功！' : '添加应用成功！'
                this.$message({
                  type: 'success',
                  message: msg
                })
                // 关闭弹框并重新获取数据
                this.showEditDialog = false
                this.tableLoad()
              } else {
                let tip =
                  this.type == 'edit' ? '应用编辑失败！' : '添加应用失败！'
                let msg = res.Message ? res.Message : tip
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

    // 新增/编辑弹框关闭处理
    editDialogClose () {
      this.$refs.upload.clearFiles()
    },

    // 是否开启改变
    toOpen (obj) {
      this.detailTableData[obj.index].status = obj.value
    },

    // 排序修改
    textChange (obj) {
      this.detailTableData[obj.index].sort = obj.value
    },

    // 详情弹框确认处理
    detailEdit () {
      if (this.detailTableData.length > 0) {
        let arr = []
        this.detailTableData.forEach(item => {
          let obj = {
            vid: item.id,
            status: item.status,
            sort: item.sort,
            image: item.image
          }
          arr.push(obj)
        })
        let data = {
          app_id: this.tableData[this.currentIndex].id,
          village: arr
        }
        this.isCommit = true

        this.$axios
          .post(this.urlObj.saveapplication, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              // 关闭弹框并重新获取数据
              this.showDetailDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '保存失败！'
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
    }
  }
}
