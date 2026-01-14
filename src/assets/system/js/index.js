import workIcon from '@/components/common/workIcon.vue'
import addVillage from '@/components/system/addVillage.vue'
import editVillage from '@/components/system/editVillage.vue'
import tableColumns from '../json/table-cloumns.json'

export default {
  components: {
    workIcon,
    addVillage,
    editVillage
  },
  data () {
    return {
      urlObj: {
        villages: this.$api.state.System.village.list.url,
        downloadtemp: this.$api.state.System.downloadtemp.url,
        importrooms: this.$api.state.System.importrooms.url,
        downloadcartemp: this.$api.state.System.downloadcartemp.url,
        importcars: this.$api.state.System.importcars.url,
        createpayqrcode: this.$api.state.System.createpayqrcode.url,
        getAreas: this.$api.state.Public.getAreas.url,
        getCompany: this.$api.state.Public.getCompany.url,
        getVillage: this.$api.state.Public.getVillage.url,
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
      columns: tableColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示打印内容
      showPrint: false,
      // 上传基本信息
      qiniuDatas: '',
      // 是否显示导入数据弹框
      showImportDialog: false,
      ruleForm: {
        areaVal: '',
        companyVal: '',
        village: '',
        type: '',
        fileInfo: '',
      },
      rules: {
        areaVal: [{ required: true, message: '请选择所属大区', trigger: 'change' }],
        companyVal: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
        village: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
        type: [{ required: true, message: '请选择导入类型', trigger: 'change' }],
        fileInfo: [{ required: true, message: '请上传文件', trigger: 'change' }],
      },
      // 大区数据列表
      areaOptions: [],
      // 公司数据列表
      companyOptions: [],
      // 项目数据列表
      villOptions: [],
      // 是否正在提交数据
      isCommit: false,
      // 是否显示收据二维码弹框
      showQrcodeDialog: false,
      // 二维码地址
      qrSrc: '',
    }
  },

  /**
   * 计算属性
   */
  computed: {
    /* table表格列筛选 */
    tabColumsChecked () {
      let tabColumsChecked = []
      this.columns.forEach((v, i) => {
        // 判断是否显示该列
        if (v.show === true) {
          if (v.type === 'button') {
            // 判断行按钮是否拥有操作权限
            v.btns.forEach((bv, bi) => {
              if (
                bv.role &&
                !this.$global.btnRoleAuth(
                  this.$api['state']['System']['village'][bv.role]['token'],
                  this.$menu.state.childRoleList
                )
              ) {
                // 无权限删除该按钮
                v.btns.splice(v.bi, 1)
              }
            })
          } else if (v.type && v.role) {
            // 判断行编辑是否拥有操作权限
            if (
              !this.$global.btnRoleAuth(
                this.$api['state']['System']['village'][v.role]['token'],
                this.$menu.state.childRoleList
              )
            ) {
              // 无权限，disabled
              this.$set(v, 'disabled', true)
            }
          }

          tabColumsChecked.push(v)
        }
      })

      return tabColumsChecked
    }
  },

  /**
   * 生命周期
   */
  mounted () {
    // let vid = sessionStorage.getItem('vid')
    // let vname = sessionStorage.getItem('vname')
    // if (vid) {
    //   this.choseVillageInfo.vid = vid
    //   this.choseVillageInfo.name = vname
    // }
    this.tableLoad()
    this.getUploadToken()
  },

  /**
   * 方法
   */
  methods: {
    // 获取文件上传 token
    getUploadToken () {
      this.$axios.post(this.$api.state.Public.uploadToken.url).then(res => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    /* 点击编辑按钮 */
    clickEditCol (item) {
      this.$refs.showEditVillage.showDialog(this.tableData[item])
    },

    /* 设置表格每页页码数 */
    tablePageSize (limit, page) {
      this.conf.limit = limit
      // 判断查询当前页  *  条数 > 总条数不进行查询
      if (page === 1 || limit * page <= this.conf.dataTotal) {
        // 请求接口获取表单数据
        this.tableLoad()
      }
    },

    /* 设置当前在哪页 */
    tableChosePage (curPage) {
      this.conf.curPage = curPage
      // 请求接口获取表单数据
      this.tableLoad()
    },

    /* 监听table编辑事件 */
    tableSetVal (obj) {
      let _this = this
      _this
        .$axios({
          url: _this.$api.state.System.village.edit.url,
          method: 'post',
          responseType: 'json',
          data: {
            token: _this.$api.state.System.village.edit.token,
            sign: 'single',
            vid: _this.tableData[obj.index].vid,
            field: obj.col_name,
            val: obj.value
          }
        })
        .then(res => {
          if (res.Code === 200) {
            // 编辑成功
            _this.$message({
              message: res.Message,
              type: 'success'
            })

            // 存放更改值
            _this.$set(_this.tableData[obj.index], obj.col_name, obj.value)
          } else if (res.Code === 204) {
            // 登录信息过期
            _this.$message({
              message: res.Message,
              type: 'error'
            })

            // 跳转至登录
            _this.$router.push({
              path: _this.$common.state.loginPath
            })
          } else {
            _this.$message({
              message: res.Message,
              type: 'error'
            })
          }
        })
        .catch(() => {
          _this.$message({
            message: '服务器连接失败',
            type: 'error'
          })
        })
    },

    // 获取表格数据
    tableLoad (pageReload = false) {
      if (pageReload === true) {
        //重置表格分页数据
        this.$set(this.conf, 'curPage', 1)
      }
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        token: this.$api.state.System.village.list.token,
        vid: this.choseVillageInfo.vid,
        keywords: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.villages, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach(item => {
              item.check = false
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

    /* 关键字查询 */
    keySearch () {
      // 参数赋值
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 请求接口获取表单数据
      this.tableLoad(true)
    },

    /* 筛选选择项目 */
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.searchVal = ''

      // 请求接口获取表单数据
      this.keySearch(true)
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
    },

    // 获取大区数据
    getAreaData () {
      this.$axios.post(this.urlObj.getAreas).then(res => {
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
    },

    // 获取公司数据
    getCompanyData (val) {
      this.ruleForm.companyVal = ""
      this.companyOptions = []
      this.ruleForm.village = ""
      this.villOptions = []
      if (val) {
        this.$axios.post(this.urlObj.getCompany, { bgid: val }).then(res => {
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
      }
    },

    // 获取项目数据
    getVillageData (val) {
      this.ruleForm.village = ''
      this.villOptions = []
      if (val) {
        this.$axios.post(this.urlObj.getVillage, { pid: val }).then(res => {
          if (res.Code === 200) {
            this.villOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取项目数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
      }
    },

    // 导入数据
    importData () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm = {
        areaVal: '',
        companyVal: '',
        village: '',
        type: '',
        fileInfo: '',
      }
      this.areaOptions = []
      this.companyOptions = []
      this.villOptions = []
      this.showImportDialog = true
      // 获取大区数据
      this.getAreaData()
    },

    // 下载模板
    tempDownload (type) {
      if (type == 'car') {
        this.$axios.post(this.urlObj.downloadcartemp).then(res => {
          if (res.Code === 200) {
            const link = document.createElement('a');
            const body = document.querySelector('body');
            link.href = res.Data.path;
            link.download = '车位导入模板.xlsx';
            link.style.display = 'none';
            body.appendChild(link);
            link.click();
            body.removeChild(link);
          } else {
            let msg = res.Message ? res.Message : '车位模板下载失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
      } else {
        this.$axios.post(this.urlObj.downloadtemp).then(res => {
          if (res.Code === 200) {
            const link = document.createElement('a');
            const body = document.querySelector('body');
            link.href = res.Data.path;
            link.download = '房源导入模板.xlsx';
            link.style.display = 'none';
            body.appendChild(link);
            link.click();
            body.removeChild(link);
          } else {
            let msg = res.Message ? res.Message : '房源模板下载失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
      }
    },

    // 自定义上传
    customUpload (params) {
      this.ruleForm.fileInfo = params.file
      this.$refs.ruleForm.validateField('fileInfo')
    },

    // 文件删除处理
    handleRemove () {
      this.ruleForm.fileInfo = ''
      this.$refs.ruleForm.validateField('fileInfo')
    },

    // 导入数据提交处理
    importSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 创建form对象
          let fd = new FormData()
          // 通过append向form对象添加数据
          fd.append("excelfile", this.ruleForm.fileInfo)
          fd.append("vid", this.ruleForm.village)
          let url = ''
          let text = ''
          if (this.ruleForm.type == 1) {
            url = this.urlObj.importrooms
            text = '房源'
          } else {
            url = this.urlObj.importcars
            text = '车位'
          }
          this.$axios({
            method: 'post',
            url: url,
            data: fd,
            headers: { type: 'upload' }
          }).then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: `${text}数据导入成功！`
              })
              // 清空文件列表
              this.$refs.upload.clearFiles()
              this.showImportDialog = false
            } else {
              let msg = res.Message ? res.Message : `${text}数据导入失败！`
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

    // 展示收据二维码
    showQrcode (index) {
      this.qrSrc = ''
      this.showQrcodeDialog = true
      // 获取小程序二维码
      this.$axios.post(this.urlObj.createpayqrcode, { vid: this.tableData[index].vid }).then(res => {
        if (res.Code === 200) {
          this.qrSrc = res.Data
        } else {
          let msg = res.Message ? res.Message : '获取小程序二维码失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
      }).catch(() => { })
    },

    // 保存二维码图片
    saveImage () {
      let qrImage = document.querySelector('#qrcode img')
      let url = qrImage.src
      let a = document.createElement('a') // 生成一个a元素
      let event = new MouseEvent('click') // 创建一个单击事件
      a.download = '机动车续费二维码' // 设置图片名称
      a.href = url // 将生成的URL设置为a.href属性
      a.dispatchEvent(event) // 触发a的单击事件
    },
  }
}
