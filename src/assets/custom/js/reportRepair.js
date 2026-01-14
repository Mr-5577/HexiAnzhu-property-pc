// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'
import reportColumns from '../json/report-columns.json'
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'reportRepair',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        repairlist: this.$api.state.Custom.repairlist.url,
        getrepairtype: this.$api.state.Custom.getrepairtype.url,
        searchrooms: this.$api.state.Custom.searchrooms.url,
        addrepair: this.$api.state.Custom.addrepair.url,
        repairdetail: this.$api.state.Custom.repairdetail.url,
        handleuser: this.$api.state.Custom.handleuser.url,
        repairdispatch: this.$api.state.Custom.repairdispatch.url,
        nmentusers: this.$api.state.Custom.nmentusers.url,
        repairchange: this.$api.state.Custom.repairchange.url,
        returnvisit: this.$api.state.Custom.returnvisit.url,
        repairhandle: this.$api.state.Custom.repairhandle.url,
        repairclose: this.$api.state.Custom.repairclose.url,
        uploadToken: this.$api.state.Public.uploadToken.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 搜索框绑定值
      searchVal: '',
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: reportColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 报修类型
      typeVal: '',
      typeOptions: [],
      // 业务状态
      statusVal: '',
      statusOptions: [
        {
          value: 1,
          label: '待接单'
        },
        {
          value: 2,
          label: '已处理'
        },
        {
          value: 3,
          label: '处理中'
        },
        {
          value: 4,
          label: '已接单'
        },
        {
          value: 5,
          label: '已回访'
        },
        {
          value: 6,
          label: '超期'
        }
      ],
      // 是否显示新增弹框
      showAddDialog: false,
      // 表单数据对象
      ruleForm: {
        type: '',
        uname: '',
        tel: '',
        room: '',
        desc: ''
      },
      // 表单验证规则
      rules: {
        type: [
          { required: true, message: '请选择报修类型', trigger: 'change' }
        ],
        uname: [
          { required: true, message: '请输入业主姓名', trigger: 'change' }
        ],
        tel: [{ required: true, message: '请输入业主电话', trigger: 'change' }],
        room: [
          { required: true, message: '请输入业主房号', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入具体情况描述', trigger: 'blur' }
        ]
      },
      // 用户搜索框绑定值
      autoValue: '',
      // 搜索结果列表
      allUserList: [],
      // 当前用户信息数据
      currentUser: {},
      // 是否正在提交数据
      isCommit: false,
      // 是否显示详情弹框
      showDetailDialog: false,
      // 是否正在加载详情数据
      isLoading: false,
      // 是否显示记录
      showRecord: false,
      // 报修详情数据
      detailObj: '',
      // 处理人
      userVal: '',
      userOptions: [],
      // 派单要求
      content: '',
      // 是否正在搜索改派人员
      loading: false,
      // 改派人员
      reassign: '',
      reassignOptions: [],
      // 图片/文件上传参数
      qiniuDatas: '',
      // 当前要上传文件的信息
      fileInfo: [],
      fileList: [],
      // 预览文件的 url
      dialogImageUrl: '',
      // 是否打开预览弹框
      dialogVisible: false,
      // 预览图片的url
      imgSrc: '',
      imgList: []
    }
  },

  // 计算属性
  computed: {
    // 开始时间限制
    spickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.endTime ? time.getTime() > this.endTime : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions () {
      return {
        disabledDate: time => {
          if (time) {
            return this.startTime ? time.getTime() < this.startTime : false
          }
        }
      }
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.tableLoad()
    this.getTypeList()
  },

  /**
   * 方法
   */
  methods: {
    // 筛选选择项目
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.searchVal = ''
      this.typeVal = ''
      this.statusVal = ''
      this.startTime = ''
      this.endTime = ''
      this.keySearch()
    },

    // 获取报事报修类型
    getTypeList () {
      this.$axios
        .post(this.urlObj.getrepairtype, { type: 1 })
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取报事报修类型失败！'
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
        page: this.conf.curPage,
        limit: this.conf.limit,
        keywords: this.searchVal,
        vid: this.choseVillageInfo.vid,
        type: this.typeVal,
        status: this.statusVal,
      }
      if (this.startTime) {
        data.starttime = this.startTime / 1000
      }
      if (this.endTime) {
        data.endtime = this.endTime / 1000
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.repairlist, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.vname = item.village ? item.village.villagename : ''
                item.tname = item.type ? item.type.typename : ''
                if (item.status != 1 && item.status != 4 && res.Data.close_auth == 1) {
                  item.bdhide = false
                } else {
                  item.bdhide = true
                }
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

    // 新增 保修类型值改变处理
    typeChange (val) {
      if (val) {
        let obj = this.typeOptions.find(item => item.id == val)
        if (obj.is_public === 1) {
          this.rules = {
            type: [
              { required: true, message: '请选择报修类型', trigger: 'change' }
            ],
            uname: [
              { required: false, message: '请输入业主姓名', trigger: 'change' }
            ],
            tel: [{ required: false, message: '请输入业主电话', trigger: 'change' }],
            room: [
              { required: false, message: '请输入业主房号', trigger: 'change' }
            ],
            desc: [
              { required: true, message: '请输入具体情况描述', trigger: 'blur' }
            ]
          }
        } else {
          this.rules = {
            type: [
              { required: true, message: '请选择报修类型', trigger: 'change' }
            ],
            uname: [
              { required: true, message: '请输入业主姓名', trigger: 'change' }
            ],
            tel: [{ required: true, message: '请输入业主电话', trigger: 'change' }],
            room: [
              { required: true, message: '请输入业主房号', trigger: 'change' }
            ],
            desc: [
              { required: true, message: '请输入具体情况描述', trigger: 'blur' }
            ]
          }
        }
      }
    },

    // 新增报事报修
    newReport () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.showAddDialog = true
    },

    // 搜索获取业主数据
    async querySearchAsync (queryStr, cb) {
      if (queryStr) {
        let value = {
          keyword: queryStr,
          vid: this.choseVillageInfo.vid
        }
        let res = await this.$axios.post(this.urlObj.searchrooms, value)
        if (res.Code === 200) {
          res.Data = res.Data ? res.Data : []
          let first = {
            id: 0,
            realname: '姓名',
            tel: '电话号码',
            roomnum: '房号'
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
    },

    // 选择用户处理
    handleSelect (user) {
      this.currentUser = user
      this.ruleForm.uname = user.realname
      this.ruleForm.tel = user.tel
      this.ruleForm.room = user.roomnum
    },

    // 新增数据提交处理
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.choseVillageInfo.vid,
            type: this.ruleForm.type,
            title: this.ruleForm.desc
          }
          if (this.currentUser.id) {
            data.name = this.currentUser.realname
              ? this.currentUser.realname
              : ''
            data.tel = this.currentUser.tel ? this.currentUser.tel : ''
            data.room = this.currentUser.roomnum ? this.currentUser.roomnum : ''
            data.unit = this.currentUser.unit ? this.currentUser.unit : ''
          }
          this.$axios
            .post(this.urlObj.addrepair, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '新增报事报修成功！',
                  type: 'success'
                })
                this.showAddDialog = false
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '新增报事报修失败！'
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

    // 进入详情页面
    showDetail (index) {
      this.showRecord = false
      this.detailObj = []
      this.userVal = ''
      this.content = ''
      this.reassign = ''
      this.reassignOptions = []
      this.showDetailDialog = true
      this.getDetailData(this.tableData[index].id)
      this.getHandleUser()
      // 获取文件上传 token
      this.getUploadToken()
    },

    // 获取详情数据
    getDetailData (id) {
      this.isLoading = true
      this.$axios
        .post(this.urlObj.repairdetail, { id: id })
        .then(res => {
          if (res.Code === 200) {
            res.Data.hasRecord =
              (res.Data.list.chuli && res.Data.list.chuli.length > 0) ||
              (res.Data.list.genjin && res.Data.list.genjin.length > 0) ||
              (res.Data.list.huifang && res.Data.list.huifang.length > 0)
            this.detailObj = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取报修详情数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    // 点击闭单按钮处理
    orderClose (index) {
      this.$confirm('此操作将关闭当前报事报修订单，确定继续操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.repairclose, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '闭单成功！',
                  type: 'success'
                })
                // 重新获取表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '闭单失败！'
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

    // 获取派单人员数据
    getHandleUser () {
      this.$axios
        .post(this.urlObj.handleuser, { id: this.detailObj.id })
        .then(res => {
          if (res.Code === 200) {
            this.userOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取处理人员数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击派单按钮处理
    sendOrders () {
      if (!this.userVal && !this.content) {
        this.$message({
          type: 'warning',
          message: '处理人和派单要求不能为空！'
        })
      } else if (!this.userVal) {
        this.$message({
          type: 'warning',
          message: '请选择处理人！'
        })
      } else if (!this.content) {
        this.$message({
          type: 'warning',
          message: '请填写派单要求！'
        })
      } else {
        let data = {
          id: this.detailObj.id,
          handler_uid: this.userVal,
          content: this.content
        }
        this.$axios
          .post(this.urlObj.repairdispatch, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '派单成功！'
              })
              // 关闭弹框重新获取表格数据
              this.showDetailDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '派单失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      }
    },

    // 搜索改派人员
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        // 获取数据
        this.$axios
          .post(this.urlObj.nmentusers, { keywords: query })
          .then(res => {
            if (res.Code === 200) {
              this.reassignOptions = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '获取改派人员数据失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.gaipaiOptions = []
      }
    },

    // 改派订单处理
    reassignOrder () {
      if (!this.reassign) {
        this.$message({
          type: 'warning',
          message: '请选择改派人员！'
        })
      } else {
        let data = {
          id: this.detailObj.id,
          user_id: this.reassign
        }
        this.$axios
          .post(this.urlObj.repairchange, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '订单改派成功！'
              })
              // 关闭弹框重新获取表格数据
              this.showDetailDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '订单改派失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      }
    },

    // 确认回访处理
    returnVisit () {
      if (!this.content) {
        this.$message({
          type: 'warning',
          message: '请输入回访结果！'
        })
      } else {
        let data = {
          id: this.detailObj.id,
          content: this.content
        }
        this.$axios
          .post(this.urlObj.returnvisit, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '回访成功！'
              })
              // 关闭弹框重新获取表格数据
              this.showDetailDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '回访失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      }
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
      uploadInfo.observable.subscribe({
        // 上传开始
        next: () => { },
        error: () => { },
        complete: () => {
          uploadInfo.fileInfo.uid = params.file.uid
          // 接收成功后返回的信息
          this.fileInfo.push(uploadInfo.fileInfo)
        }
      })
    },

    // 文件、图片删除处理
    handleRemove (obj) {
      let index = this.fileInfo.findIndex(item => item.uid == obj.uid)
      if (index != -1) {
        this.fileInfo.splice(index, 1)
      }
    },

    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 完成订单处理
    handleFinish () {
      if (!this.content) {
        this.$message({
          type: 'warning',
          message: '请输入处理结果！'
        })
      } else {
        let arr = this.fileInfo.map(item => item.qiniu_key)
        let data = {
          id: this.detailObj.id,
          content: this.content
        }
        if (arr.length > 0) {
          data.img_arr = arr
        }
        this.$axios
          .post(this.urlObj.repairhandle, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '订单已完成处理！'
              })
              // 关闭弹框重新获取表格数据
              this.showDetailDialog = false
              this.tableLoad()
            } else {
              let msg = res.Message ? res.Message : '订单完成处理失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => { })
      }
    },

    // 弹框图片预览
    imgPreview (url) {
      this.imgSrc = url
      this.imgList = [url]
      this.$nextTick(() => {
        this.$refs.preview.clickHandler()
      })
    },

    /* 导出EXCEL */
    exportDetailExcel () {
      try {
        // 获取报事报修数据
        let data = {
          page: this.conf.curPage,
          limit: this.conf.limit,
          keywords: this.searchVal,
          vid: this.choseVillageInfo.vid,
          type: this.typeVal,
          status: this.statusVal,
          is_excel: 1,
        }
        if (this.startTime) {
          data.starttime = this.startTime / 1000
        }
        if (this.endTime) {
          data.endtime = this.endTime / 1000
        }
        // 获取项目列表数据
        this.$axios
          .post(this.urlObj.repairlist, data)
          .then(res => {
            if (res.Code === 200) {
              let tableName = '报事报修数据表'
              let headers = [
                '来源',
                '项目',
                '业主',
                '房号',
                '类型',
                '内容',
                '电话',
                '状态',
                '提交时间',
                '处理时间',
                '处理人',
                '派单人',
                '升级次数'
              ]

              // 整理需要导出的数据
              let datas = []
              res.Data.forEach(item => {
                let arr = [
                  item.from_text,
                  item.village.villagename,
                  item.name,
                  item.room,
                  item.type.typename,
                  item.repaircon,
                  item.tel,
                  item.status_text,
                  item.create_time,
                  item.followtime,
                  item.handler,
                  item.distributeer,
                  item.upgrade_num
                ]
                datas.push(arr)
              })
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
            } else {
              let msg = res.Message ? res.Message : '报事报修数据获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
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
