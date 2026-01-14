// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'other',
  data () {
    return {
      urlObj: {
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        subjectList: this.$api.state.Public.subjectList.url,
        addtempsn: this.$api.state.Charge.addtempsn.url,
        getfreeid: this.$api.state.Charge.getfreeid.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
        saveUploadInfo: this.$api.state.Public.saveUploadInfo.url,
        delFile: this.$api.state.Public.delFile.url
      },
      // 表单数据对象
      ruleForm: {
        uname: '',
        matter: '',
        type: '',
        money: '',
        method: '',
        time: '',
        remark: '',
        isreceipt: false,
        fileInfo: [],
      },
      // 表单验证对象
      rules: {
        uname: [{ required: true, message: '请输入付款对象', trigger: 'blur' }],
        matter: [
          { required: true, message: '请输入收费事项', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择收费类型', trigger: 'change' }
        ],
        money: [{ required: true, message: '请输入收费金额', trigger: 'blur' }],
        method: [
          { required: true, message: '请选择收费方式', trigger: 'change' }
        ],
        time: [{ required: true, message: '请选择收费时间', trigger: 'change' }],
        fileInfo: [
          {
            type: 'array',
            required: true,
            message: '请上传附件！',
            trigger: 'change'
          }
        ],
      },
      // 收费类型列表
      typeOptions: [],
      // 收费方式列表
      methodOptions: [],
      // 是否正在提交数据
      isCommit: false,
      // 时间选择器是否是只读
      dateRead: false,
      // 图片/文件上传参数
      qiniuDatas: {},
      // 支付方式 免单 id
      freeId: null,
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
      this.getPaymentType()
      this.getSubject()
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    // 判断是否有选择时间的权限
    if (this.$menu.getters.judgeRole('Btn-2DHOrylYLGlWBvaT8By3Jf8d')) {
      this.dateRead = false
    } else {
      this.dateRead = true
      this.ruleForm.time = new Date()
    }
    this.getPaymentType()
    this.getSubject()
    this.getFreeId()
    this.getUploadToken()
  },

  /**
   * 方法
   */
  methods: {
    // 获取支付方式
    getPaymentType () {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.methodOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取支付方式失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取科目数据
    getSubject () {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.subjectList, data)
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
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

    // 表单提交验证
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.vid,
            realname: this.ruleForm.uname,
            describe: this.ruleForm.matter,
            subject_id: this.ruleForm.type,
            money: this.ruleForm.money,
            pay_type: this.ruleForm.method,
            pay_time: this.ruleForm.time / 1000,
            remark: this.ruleForm.remark,
            is_bill: this.ruleForm.isreceipt ? 1 : 0
          }
          if (this.ruleForm.method == this.freeId) {
            data.md_file_ids = this.ruleForm.fileInfo.map(item => item.id)
          }
          this.$axios
            .post(this.urlObj.addtempsn, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '收费成功！'
                })
                // 表单验证重置
                if (this.$refs.ruleForm) {
                  this.$refs.ruleForm.resetFields()
                }
                this.ruleForm.remark = ''
                this.ruleForm.isreceipt = false
              } else {
                let msg = res.Message ? res.Message : '收费失败！'
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

    // 获取免单 id
    getFreeId () {
      this.$axios.post(this.urlObj.getfreeid).then(res => {
        if (res.Code === 200) {
          this.freeId = res.Data.payment_id
        }
      })
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
        complete: result => {
          this.saveFile(uploadInfo.fileInfo, params.file.uid)
        }
      })
    },

    // 文件、图片删除处理
    handleRemove (file) {
      let index = this.ruleForm.fileInfo.findIndex(
        item => item.uid === file.uid
      )
      if (index != -1) {
        // 删除数据库和七牛云文件
        this.$axios
          .post(this.urlObj.delFile, { id: this.ruleForm.fileInfo[index].id })
          .then(res => {
            if (res.Code != 200) {
              let msg = res.Message ? res.Message : '文件删除失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          .catch(() => { })
        this.ruleForm.fileInfo.splice(index, 1)
        this.$refs.ruleForm.validateField('fileInfo')
      }
    },

    // 文件保存到数据库
    saveFile (data, uid) {
      this.$axios.post(this.urlObj.saveUploadInfo, data).then(res => {
        if (res.Code === 200) {
          this.ruleForm.fileInfo.push({
            id: res.Data.id,
            uid: uid
          })
        } else {
          let msg = res.Message ? res.Message : '文件信息保存失败！'
          this.$message({
            message: msg,
            type: 'error'
          })
        }
        this.$refs.ruleForm.validateField('fileInfo')
      })
    },
  }
}
