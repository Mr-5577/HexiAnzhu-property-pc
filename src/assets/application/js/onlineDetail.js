import onlineColumns from '../json/online-columns.json'
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'onlineDetail',
  data() {
    return {
      urlObj: {
        uploadToken: this.$api.state.Public.uploadToken.url,
        villageapplication: this.$api.state.Application.villageapplication.url,
        editvillageapp: this.$api.state.Application.editvillageapp.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: onlineColumns.list,
      // 表格配置
      conf: {
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
      // 当前编辑得应用 index
      currentIndex: '',
      // 是否显示添加/编辑应用弹框
      showEditDialog: false,
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
  mounted() {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.tableLoad()
    this.getUploadToken()
  },

  /**
   * 方法
   */
  methods: {
    // 筛选选择项目
    filterVillage(choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.statusVal = ''
      this.searchVal = ''
      this.tableLoad()
    },

    // 获取文件上传 token
    getUploadToken() {
      this.$axios.post(this.urlObj.uploadToken).then(res => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    // 自定义上传
    customUpload(params) {
      params.url = this.$refs.upload.uploadFiles[0].url
      let uploadInfo = qiniuUpload(params, this.qiniuDatas)
      var subscription = uploadInfo.observable.subscribe({
        // 上传开始
        next: result => {},
        error: errResult => {},
        complete: result => {
          // 接收成功后返回的信息
          this.fileInfo = [uploadInfo.fileInfo]
        }
      })
    },

    // 文件、图片删除处理
    handleRemove() {
      this.fileInfo = []
    },

    // 图片预览
    handlePictureCardPreview(file) {
      this.imgSrc = file.url
      this.imgList = [file.url]
      this.$nextTick(() => {
        this.$refs.preview.clickHandler()
      })
    },

    // 点击表格图片处理
    imgPreview(obj) {
      this.handlePictureCardPreview({ url: obj.image_host })
    },

    // 获取表格数据
    tableLoad() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid,
        keywords: this.searchVal,
        status: this.statusVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.villageapplication, data)
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

    // 点击查询处理
    keySearch() {
      // 请求接口获取表单数据
      this.tableLoad()
    },

    // 应用编辑
    appEdit(index) {
      this.showEditDialog = true
      this.currentIndex = index
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.dialogTitle = '编辑应用设置'
      this.ruleForm.appName = this.tableData[index].name
      this.ruleForm.defaultState = this.tableData[index].status
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
    formSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 提交数据
          let data = {
            vid: this.choseVillageInfo.vid,
            application: [
              {
                app_id: this.tableData[this.currentIndex].id,
                status: this.ruleForm.defaultState,
                sort: this.ruleForm.appSort
              }
            ]
          }
          if (this.fileInfo.length > 0) {
            data.application[0].image = this.fileInfo[0].qiniu_key
          }
          this.$axios
            .post(this.urlObj.editvillageapp, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '应用编辑成功！'
                })
                // 关闭弹框并重新获取数据
                this.showEditDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '应用编辑失败！'
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
    editDialogClose() {
      this.$refs.upload.clearFiles()
    }
  }
}
