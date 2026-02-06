// 引入富文本编辑器
import Editor from 'wangeditor'
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'
import workIcon from '@/components/common/workIcon.vue'
export default {
  name: 'activityManagement',
  components: {
    workIcon,
  },
  data() {
    return {
      urlObj: {
        userVillage: this.$api.state.Public.userVillage.url,
        getActivityList: this.$api.state.Custom.getActivityList.url,
        addActivity: this.$api.state.Custom.addActivity.url,
        editActivity: this.$api.state.Custom.editActivity.url,
        delActivity: this.$api.state.Custom.delActivity.url,
        pubActivity: this.$api.state.Custom.pubActivity.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0,
      },
      title:'',
      activityTypeList: [
        { id: 1, name: '预缴活动' },
        { id: 2, name: ' 社区活动' },
        { id: 3, name: '团购活动' },
      ],
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: [
        {
          label: '小区',
          prop: 'villagename',
          show: true,
        },
        {
          label: '活动名称',
          prop: 'title',
          show: true,
          color: '#999',
        },
        {
          label: '活动类型',
          prop: 'class_name',
          show: true,
          color: '#999',
          width: 100
        },
        {
          label: '发布日期',
          prop: 'publish_time',
          show: true,
          color: '#999',
        },
        {
          label: '发布人',
          prop: 'publish_man_name',
          show: true,
          color: '#999',
          width: 100
        },
        {
          label: '开始有效期',
          prop: 'begin_time',
          show: true,
          color: '#999',
        },
        {
          label: '结束有效期',
          prop: 'end_time',
          show: true,
          color: '#999',
        },
        {
          label: '是否启用',
          prop: 'is_enable_name',
          show: true,
          color: '#999',
          width: 100
        },
        {
          label: '是否弹窗',
          prop: 'is_popup_name',
          show: true,
          color: '#999',
          width: 100
        },
        {
          label: '操作',
          prop: '',
          width: 250,
          type: 'button',
          show: true,
          btns: [
            {
              name: '发布',
              type: 'primary',
              size: 'small',
              round: true,
              action: 'release',
              role: 'release',
              token: 'Btn-yLHizr3FGlCwcTcHDRr6toBf',
            },
            {
              name: '编辑',
              type: 'primary',
              size: 'small',
              round: true,
              action: 'edit',
              role: 'edit',
              token: 'Btn-yLHizr3FGlCwcTcHDRr6toBf',
            },
            {
              name: '删除',
              type: 'danger',
              size: 'small',
              round: true,
              action: 'delete',
              role: 'delete',
              token: 'Btn-VrSczfheKWLqyxuBFeno16kB',
            },
          ],
        },
      ],
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0,
      },
      // 当前弹框类型
      type: 'add',
      // 当前编辑项的 index
      currentIndex: '',
      // 是否显示新增/编辑弹框
      showEditDialog: false,
      // 富文本对象
      editor: null,
      // 小区列表数据
      villageList: [],
      // 表单数据对象
      ruleForm: {
        vid: '',
        title: '',
        class_id: '',
        link_url: '',
        begin_time: '',
        end_time: '',
        is_enable: 0,
        is_popup: 0,
        content: '',
      },
      // 表单验证规则
      rules: {
        vid: [{ required: true, message: '请选择项目', trigger: 'change' }],
        title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
        class_id: [
          { required: true, message: '请选择活动类型', trigger: 'change' },
        ],
        begin_time: [
          { required: true, message: '请选择开始有效期', trigger: 'change' },
        ],
        end_time: [
          { required: true, message: '请选择结束有效期', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入活动内容', trigger: 'change' },
        ],
      },
      // 是否正在提交数据
      isCommit: false,
      // 七牛云图片/文件上传凭证
      qiniuDatas: null,
      // 封面图片文件的信息
      coverFileInfo: [],
      coverFileList: [],
      // 弹窗图片文件的信息
      adFileInfo: [],
      adFileList: [],
      // 预览图片的 src
      imgSrc: '',
      // 预览图片列表
      imgList: [],
      showEnableSwitch: false, // 是否显示 启用的编辑
    }
  },

  /**
   * 计算属性
   */
  computed: {
    vid() {
      return this.$store.state.vid
    },
  },

  /**
   *
   */
  watch: {
    vid() {
      // this.tableLoad()
    },
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
    setTimeout(() => {
      this.tableLoad()
      this.getUploadToken()
    }, 200)
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
      this.title = ''
      this.keySearch()
    },
    keySearch() {
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0,
      }
      // 请求接口获取表单数据
      this.tableLoad()
    },
    // 获取文件上传 token
    getUploadToken() {
      this.$axios.post(this.urlObj.uploadToken).then((res) => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },
    // 自定义上传
    customUploadCoverImg(params) {
      params.url = this.$refs.coverImageUpload.uploadFiles[0].url
      const uploadInfo = qiniuUpload(params, this.qiniuDatas)
      const subscription = uploadInfo.observable.subscribe({
        // 上传开始,接收上传进度信息，result是带有total字段的 Object
        // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
        next: (res) => {},
        // 上传错误后失败报错
        error: (err) => {},
        // 接收成功后返回的信息
        complete: (res) => {
          this.coverFileInfo = uploadInfo.fileInfo ? [uploadInfo.fileInfo] : []
          this.coverFileList = [
            {
              name: '',
              url: `${this.qiniuDatas.domain}${res.key}`,
            },
          ]
        },
      })
    },
    // 文件、图片删除处理
    removeCoverImage() {
      this.coverFileInfo = []
      this.coverFileList = []
    },
    // 自定义上传
    customUploadAdImg(params) {
      params.url = this.$refs.adImageUpload.uploadFiles[0].url
      const uploadInfo = qiniuUpload(params, this.qiniuDatas)
      const subscription = uploadInfo.observable.subscribe({
        // 上传开始,接收上传进度信息，result是带有total字段的 Object
        // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
        next: (res) => {},
        // 上传错误后失败报错
        error: (err) => {},
        // 接收成功后返回的信息
        complete: (res) => {
          this.adFileInfo = uploadInfo.fileInfo ? [uploadInfo.fileInfo] : []
          this.adFileList = [
            {
              name: '',
              url: `${this.qiniuDatas.domain}${res.key}`,
            },
          ]
        },
      })
    },
    // 文件、图片删除处理
    removeAdImage() {
      this.adFileInfo = []
      this.adFileList = []
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
    // 富文本初始化
    editorInit() {
      this.editor = new Editor(this.$refs.editorElem)
      // 配置 onchange 回调函数
      this.editor.config.onchange = (newHtml) => {
        this.ruleForm.content = newHtml
        this.$refs.ruleForm.validateField('content')
      }
      // 自定义菜单配置
      this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'justify',
        'quote',
        'splitLine',
        'undo',
        'redo',
        'image',
      ]
      // ===================================== 七牛云图片上传配置 ==================================
      // 设置上传图片的服务器端地址
      this.editor.config.uploadImgServer = '' // 置空，需要自定义上传

      // 设置是否显示 base64 格式上传（默认 true）
      // 设置为 false 则强制使用服务器上传
      this.editor.config.showLinkImg = false

      // 自定义图片上传
      this.editor.config.customUploadImg = async (files, insertImgFn) => {
        // console.log('收到文件:', files)
        // console.log('七牛云凭证:', this.qiniuDatas)
        try {
          // 确保有上传凭证
          if (!this.qiniuDatas || !this.qiniuDatas.uptoken) {
            this.$message.error('上传凭证缺失，请刷新页面重试')
            return
          }
          // 使用 Promise.all 处理多个文件上传
          const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
              // 显示上传中状态
              // this.$message.info(`正在上传: ${file.name}`)

              // 调用七牛云上传
              let uploadInfo = qiniuUpload({ file }, this.qiniuDatas)

              uploadInfo.observable.subscribe({
                // 上传进度
                next: (res) => {
                  // console.log('上传进度:', res.total.percent)
                },
                // 上传错误
                error: (err) => {
                  // console.error('上传失败:', err)
                  reject(err)
                },
                // 上传完成
                complete: (res) => {
                  // console.log('上传完成响应:', res)
                  // 检查返回的数据
                  if (!res || !res.key) {
                    // console.error('返回数据异常:', res)
                    this.$message.error(`上传返回数据异常: ${file.name}`)
                    reject(new Error('返回数据异常'))
                    return
                  }
                  // 构建完整的图片URL
                  const imageUrl = `${this.qiniuDatas.domain}${res.key}`
                  // console.log('生成的图片URL:', imageUrl)
                  // 插入图片到编辑器
                  insertImgFn(imageUrl)
                  this.$message.success(`图片上传成功: ${file.name}`)
                  resolve({
                    url: imageUrl,
                    key: res.key,
                  })
                },
              })
            })
          })

          // 等待所有文件上传完成
          await Promise.all(uploadPromises)
          this.$message.success('所有图片上传完成')
        } catch (error) {
          // console.error('上传失败:', error)
          this.$message.error('上传失败: ' + (error.message || '未知错误'))
        }
      }

      // 设置上传图片的最大大小
      this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024 // 5M

      // 设置一次最多上传几张图片
      this.editor.config.uploadImgMaxLength = 1

      // 设置支持上传的图片类型
      this.editor.config.uploadImgAccept = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
      ]

      // ===================================== 七牛云图片上传配置结束 ===================================

      // 创建富文本实例
      this.editor.create()
      // 设置初始值
      if (this.ruleForm.content) {
        this.editor.txt.html(this.ruleForm.content)
      }
      // 组件销毁时清理
      this.$once('hook:beforeDestroy', () => {
        this.editor.destroy()
        this.editor = null
      })
    },

    // 获取表格数据
    tableLoad() {
      this.conf.loadStatus = true
      const params = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        title: this.title,
      }
      this.$axios
        .post(this.urlObj.getActivityList, params)
        .then((res) => {
          // 处理登录信息过期
          if (res.Code === 204) {
            this.$message.error(res.Message || '登录已过期！')
            // 跳转至登录
            this.$router.push({ path: this.$common.state.loginPath })
            return
          }
          if (res.Code === 200) {
            const dataList = res.Data.data || []
            // 转换数据状态
            dataList.forEach((item) => {
              item.is_popup = item.is_popup === 1 ? 1 : 0
              item.is_popup_name = item.is_popup === 1 ? '是' : '否'
              item.is_enable = item.is_enable === 1 ? 1 : 0
              item.is_enable_name = item.is_enable === 1 ? '是' : '否'
            })
            this.conf.dataTotal = res.Data.total
            this.tableData = dataList
            this.conf.emptyText = ''
          } else {
            this.conf.emptyText = res.Message || '数据加载失败'
            this.conf.dataTotal = 0
          }
        })
        .catch(() => {
          this.conf.emptyText = '服务器连接失败...'
          this.conf.dataTotal = 0
        })
        .finally(() => {
          this.conf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    sizeChange(num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange(num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 获取小区数据
    getVillageData() {
      this.$axios
        .post(this.urlObj.userVillage)
        .then((res) => {
          if (res.Code === 200) {
            this.villageList = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '项目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg,
            })
          }
        })
        .catch(() => {})
    },

    // 数据回显
    dataEcho() {
      const currentData = this.tableData[this.currentIndex] || null
      if (currentData) {
        this.ruleForm.vid = currentData.vid
        this.ruleForm.title = currentData.title
        this.ruleForm.class_id = currentData.class_id
        this.ruleForm.link_url = currentData.link_url
        this.ruleForm.begin_time = currentData.begin_time
        this.ruleForm.end_time = currentData.end_time
        this.ruleForm.is_enable = currentData.is_enable
        this.ruleForm.is_popup = currentData.is_popup
        this.ruleForm.content = currentData.content
        if (currentData.head_pic) {
          this.coverFileInfo = [{ qiniu_key: currentData.head_pic }]
          this.coverFileList = [
            {
              name: '',
              url: `${this.qiniuDatas.domain}${currentData.head_pic}`,
            },
          ]
        }
        if (currentData.window_pic) {
          this.adFileInfo = [{ qiniu_key: currentData.window_pic }]
          this.adFileList = [
            {
              name: '',
              url: `${this.qiniuDatas.domain}${currentData.window_pic}`,
            },
          ]
        }
        // 只有开启了启用才能显示并编辑
        if (currentData.is_enable === 1) {
          this.showEnableSwitch = true
        } else {
          this.showEnableSwitch = false
        }
      }
    },
    // 重置表单
    resetForm() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.imgSrc = ''
      this.imgList = []
      this.coverFileInfo = []
      this.coverFileList = []
      if (this.$refs.coverImageUpload) {
        this.$refs.coverImageUpload.clearFiles()
      }
      this.adFileInfo = []
      this.adFileList = []
      if (this.$refs.adImageUpload) {
        this.$refs.adImageUpload.clearFiles()
      }
      this.showEnableSwitch = false
    },
    // 点击新增通告处理
    addInvoice() {
      this.type = 'add'
      this.resetForm()
      this.showEditDialog = true
      // 获取小区列表
      this.getVillageData()
      this.$nextTick(() => {
        this.editorInit()
      })
    },

    // 点击编辑处理
    editEvent(index) {
      this.currentIndex = index
      this.type = 'edit'
      this.resetForm()
      this.showEditDialog = true
      // 获取小区列表
      this.getVillageData()
      // 数据回显
      this.dataEcho()
      this.$nextTick(() => {
        this.editorInit()
      })
    },

    // 点击删除处理
    deleteEvent(index) {
      this.$confirm('确定要删除当前活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id,
          }
          this.$axios
            .post(this.urlObj.delActivity, data)
            .then((res) => {
              if (res.Code === 200) {
                this.$message({
                  message: '活动删除成功！',
                  type: 'success',
                })
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '活动删除失败！'
                this.$message({
                  message: msg,
                  type: 'error',
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 发布
    releaseEvent(index) {
      const params = {
        id: this.tableData[index].id,
      }
      this.$axios.post(this.urlObj.pubActivity, params).then((res) => {
        if (res.Code === 200) {
          this.$message({
            message: '活动发布成功！',
            type: 'success',
          })
          // 重新获取表格数据
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '活动发布失败！'
          this.$message({
            message: msg,
            type: 'error',
          })
        }
      })
    },

    // 关闭弹框处理
    closeDialog() {
      this.resetForm()
      // 销毁编辑器
      this.editor.destroy()
    },

    // 数据提交处理
    formSubmit() {
      console.log('this.ruleForm', this.ruleForm)
      console.log('this.coverInfo', this.coverFileInfo, this.coverFileList)
      console.log('this.adInfo', this.adFileInfo, this.adFileList)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.coverFileInfo.length === 0) {
            this.$message.error('请上传封面图片')
            return false
          }
          if (this.adFileInfo.length === 0) {
            this.$message.error('请上传弹窗图片')
            return false
          }
          this.isCommit = true
          const postData = {
            ...this.ruleForm,
            head_pic: this.coverFileInfo[0].qiniu_key,
            window_pic: this.adFileInfo[0].qiniu_key,
          }
          // 区分新增/编辑
          const isEdit = this.type === 'edit'
          if (isEdit) {
            postData.id = this.tableData[this.currentIndex].id
          } else {
            postData.is_enable = 0
          }
          const url = isEdit
            ? this.urlObj.editActivity
            : this.urlObj.addActivity
          const msg = isEdit ? '活动编辑' : '活动新增'

          this.$axios
            .post(url, postData)
            .then((res) => {
              if (res.Code === 200) {
                this.$message.success(`${msg}成功！`)
                this.showEditDialog = false
                this.resetForm()
                this.tableLoad()
              } else {
                this.$message.error(res.Message || `${msg}失败！`)
              }
            })
            .catch(() => {
              this.$message.error('网络请求失败')
            })
            .finally(() => {
              this.isCommit = false
            })
        } else {
            this.$message.error('请检查表单！')
        }
      })
    },
  },
}
