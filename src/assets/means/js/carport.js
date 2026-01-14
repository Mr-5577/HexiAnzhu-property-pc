// 导入用户搜索组件
import userBind from '@/components/means/common/UserBind.vue'
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'carport',
  components: {
    userBind
  },
  data () {
    return {
      // 接口对象
      urlObj: {
        treeData: this.$api.state.Means.treeData.url,
        parkingTree: this.$api.state.Means.parkingTree.url,
        carportInfo: this.$api.state.Means.carportInfo.url,
        bindUser: this.$api.state.Means.bindUser.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
        saveUploadInfo: this.$api.state.Public.saveUploadInfo.url,
        delFile: this.$api.state.Public.delFile.url
      },
      // 是否正在加载树形数据
      isLoading: false,
      // 是否正在加载车位详情数据
      infoLoading: false,
      // 是否正在启用车位
      starting: false,
      // 搜索框绑定值
      filterText: '',
      // 树控件数据
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      },
      // 当前选择的车位信息
      currentCarport: null,
      // 输入框绑定值
      filterText: '',
      // 当前车位信息
      carportInfo: [],
      // 图片/文件上传参数
      qiniuDatas: '',
      // 预览文件的 url
      dialogImageUrl: '',
      // 是否打开预览弹框
      dialogVisible: false,
      // 表单数据对象
      ruleForm: {
        oid: '',
        uname: '',
        idcard: '',
        utype: '',
        method: '',
        utel: '',
        stime: '',
        fileInfo: '',
        plateInfo: [
          {
            plates: '',
            name: '',
            tel: ''
          }
        ]
      },
      rules: {
        uname: [
          { required: true, message: '请输入客户姓名', trigger: 'change' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号码', trigger: 'change' }
        ],
        utype: [
          { required: true, message: '请输入客户类型', trigger: 'change' }
        ],
        method: [
          { required: true, message: '请输入使用方式', trigger: 'change' }
        ],
        utel: [
          { required: true, message: '请输入联系电话', trigger: 'change' }
        ],
        stime: [
          { required: true, message: '请选择启用日期', trigger: 'change' }
        ],
        fileInfo: [
          { required: true, message: '请上传合同文件', trigger: 'change' }
        ]
      },
      cvid: '',
    }
  },

  // 属性监听
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  /**
   * 生命周期
   */
  created () {
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

    // 获取树形结构数据
    async getTreeData (data, resolve) {
      // 获取城市、项目数据
      let res = await this.$axios.post(this.urlObj.treeData, data)
      this.isLoading = false
      let arr = []
      if (res.Code == 200) {
        res.Data.forEach(item => {
          if (data.vid) {
            item.disabled = false
          } else {
            item.disabled = true
            item.children.forEach(itm => {
              itm.isLeaf = false
            })
          }
          item.nodeid = item.type + item.id
        })
        arr = res.Data
      } else {
        this.$message({
          message: '获取数据失败！',
          type: 'error'
        })
      }
      resolve(arr)
    },

    // 搜索节点数据
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 加载节点数据
    async loadNode (node, resolve) {
      if (node.level == 0) {
        let data = {
          secondData: 0
        }
        this.isLoading = true
        this.getTreeData(data, resolve)
      } else if (node.level == 2) {
        let res = await this.$axios.post(this.urlObj.parkingTree, {
          vid: node.data.id
        })
        if (res.Code === 200) {
          let parks = []
          res.Data.forEach(item => {
            let obj = {
              id: item.id,
              type: 'type',
              nodeid: 'type' + item.id,
              isLeaf: item.car && item.car.length > 0 ? false : true,
              label: item.name,
              disabled: true,
              children: item.car ? item.car : []
            }
            parks.push(obj)
          })
          resolve(parks)
        } else {
          this.$message({
            message: '获取数据失败！',
            type: 'error'
          })
          resolve([])
        }
      } else if (node.level == 3) {
        node.data.children.forEach(item => {
          item.disabled = false
          item.type = 'carnum'
          item.nodeid = item.type + item.id
          item.label = item.sort
          item.isLeaf = true
        })
        resolve(node.data.children)
      } else {
        node.data.children.forEach(item => {
          item.disabled = true
          item.nodeid = item.type + item.id
        })
        resolve(node.data.children)
      }
    },

    // 节点点击事件
    nodeClick (data) {
      this.$nextTick(() => {
        if (!data.disabled) {
          this.$refs.tree.setCheckedNodes([data])
          this.checkChange(data)
        }
      })
    },

    // 节点复选框点击事件
    nodeCheck (data) {
      if (!data.disabled) {
        this.$refs.tree.setCheckedNodes([data])
        this.checkChange(data)
      }
    },

    // 车位选择更改处理
    checkChange (node) {
      if (!(this.currentCarport && this.currentCarport.id == node.id)) {
        // 表单验证重置
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields()
        }
        this.ruleForm = {
          oid: '',
          uname: '',
          idcard: '',
          utype: '',
          method: '',
          utel: '',
          stime: '',
          fileInfo: '',
          plateInfo: [
            {
              plates: '',
              name: '',
              tel: ''
            }
          ]
        }
        this.currentCarport = node
        this.infoLoading = true
        // 获取车位详情
        this.$axios
          .post(this.urlObj.carportInfo, { id: node.id })
          .then(res => {
            if (res.Code === 200) {
              this.cvid = res.Data.vid
              let subjects = res.Data.subject_arr.map(item => item.name)
              let moneys = res.Data.subject_arr.map(item => item.money)
              let arr = [
                {
                  name: '车位编号',
                  value: res.Data.sort ? res.Data.sort : '--'
                },
                {
                  name: '资源类型',
                  value: res.Data.resourcestype
                    ? res.Data.resourcestype.name
                    : '--'
                },
                {
                  name: '收费科目',
                  value: subjects.length > 0 ? subjects.join('、') : '--'
                },
                {
                  name: '车位面积',
                  value: res.Data.area ? res.Data.area + 'm²' : '--'
                },
                {
                  name: '每月费用',
                  value: moneys.length > 0 ? moneys.join('、') + '元' : '--'
                }
              ]
              this.carportInfo = arr
            } else {
              this.$message({
                message: '获取数据失败！',
                type: 'error'
              })
            }
            this.infoLoading = false
          })
          .catch(err => {
            this.$message({
              message: '获取数据失败！',
              type: 'error'
            })
            this.infoLoading = false
          })
      }
    },

    // 选择用户处理
    userSelected (obj) {
      this.ruleForm.oid = obj.id
      this.ruleForm.uname = obj.realname
      this.ruleForm.idcard = obj.idcard
      this.ruleForm.utype = obj.owner_type.name
      this.ruleForm.method = '购买'
      this.ruleForm.utel = obj.tel
      this.ruleForm.plateInfo[0].name = obj.realname
      this.ruleForm.plateInfo[0].tel = obj.tel
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

    // 文件保存到数据库
    saveFile (data, uid) {
      this.$axios.post(this.urlObj.saveUploadInfo, data).then(res => {
        if (res.Code === 200) {
          this.ruleForm.fileInfo = {
            id: res.Data.id,
            uid: uid
          }
          this.$refs.ruleForm.validateField('fileInfo')
        } else {
          let msg = res.Message ? res.Message : '文件信息保存失败！'
          this.$message({
            message: msg,
            type: 'error'
          })
        }
      })
    },

    // 文件、图片删除处理
    handleRemove () {
      // 删除数据库和七牛云文件
      this.$axios
        .post(this.urlObj.delFile, { id: this.ruleForm.fileInfo.id })
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
      this.ruleForm.fileInfo = ''
      this.$refs.ruleForm.validateField('fileInfo')
    },

    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 点击车牌添加图标处理
    addPlate () {
      let data = {
        name: '',
        phone: '',
        plate: ''
      }
      this.ruleForm.plateInfo.push(data)
    },

    // 点击车牌删除图标处理
    deletePlate (index) {
      this.ruleForm.plateInfo.splice(index, 1)
    },

    // 点击确认启用处理
    useConfirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.starting = true
          let data = {
            id: this.currentCarport.id,
            oid: this.ruleForm.oid,
            non_owner_tel: this.ruleForm.utel,
            starttime: this.ruleForm.stime / 1000,
            plates: this.ruleForm.plateInfo,
            ht_file_id: this.ruleForm.fileInfo.id
          }
          this.registerRequst(data)
        }
      })
    },

    // 确认启用请求
    registerRequst (data) {
      this.$axios
        .post(this.urlObj.bindUser, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '车位启用成功！'
            })
            // 删除当前车位
            this.$refs.tree.remove(this.currentCarport)
            this.currentCarport = null
            this.filterText = ''
            this.carportInfo = []
            this.dialogImageUrl = ''
          } else {
            let msg = res.Message ? res.Message : '车位启用失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.starting = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '车位启用失败！'
          })
          this.starting = false
        })
    }
  }
}
