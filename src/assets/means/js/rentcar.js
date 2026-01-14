// 导入用户搜索、绑定组件
import userBind from '@/components/means/common/UserBind.vue'
// 导入大区、项目预选择页面
import areaVillageSelect from '@/components/common/AreaVillageSelect.vue'

export default {
  name: 'rentcar',
  components: {
    userBind,
    areaVillageSelect
  },
  data () {
    return {
      // 接口数据对象
      urlObj: {
        monthParkInfo: this.$api.state.Means.monthParkInfo.url,
        addMonthCar: this.$api.state.Means.addMonthCar.url
      },
      // 当前大区 id
      aid: '',
      // 当前项目 id
      vid: '',
      // 开始登记通过
      isRegister: false,
      // 是否正在加载数据
      isLoading: false,
      // 月租车类型列表
      typeList: '',
      // 备注绑定值
      remarkValue: '',
      // 是否正在提交数据
      isCommit: false,
      // 表单数据对象
      ruleForm: {
        oid: '',
        uname: '',
        idcard: '',
        utype: '',
        method: '',
        utel: '',
        subject: [],
        stime: '',
        plateInfo: [
          {
            plates: ''
          }
        ],
        remark: ''
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
        subject: [
          { required: true, message: '请选择收费科目', trigger: 'change' }
        ],
        stime: [
          { required: true, message: '请选择启用日期', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      // 车辆类型列表
      typeOptions: [],
      // 科目数据列表
      subOptions: [],
    }
  },

  /**
   * 属性监听
   */
  watch: {
    isRegister (now) {
      if (now) {
        let charge = document.getElementById('means')
        charge.classList.add('register')
      } else {
        let charge = document.getElementById('means')
        charge.classList.remove('register')
      }
    }
  },

  /**
   * 生命周期
   */
  created () { },

  /**
   * 方法
   */
  methods: {
    // 开始登记通过处理
    registerPass (data) {
      this.aid = data.aid
      this.vid = data.vid
      this.isRegister = true
      this.typeList = ''
      this.getMonthParkInfo()
    },

    // 获取类型下面的科目
    getSubjectData (value) {
      if (value) {
        let data = {
          vid: this.vid,
          resource_type_id: value
        }
        this.$axios
          .post(this.$api.state.Public.subjectbytype.url, data)
          .then(res => {
            if (res.Code === 200) {
              this.subOptions = res.Data
            } else {
              let msg = res.Message ? res.Message : '科目数据获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '科目数据获取失败！'
            })
          })
      }
    },

    // 获取月租车位信息
    getMonthParkInfo () {
      this.isLoading = true
      this.$axios
        .post(this.urlObj.monthParkInfo, { vid: this.vid })
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.active = false
            })
            if (res.Data.length > 0) {
              res.Data[0].active = true
              // 获取科目类型
              this.getSubjectData(res.Data[0].resources_type_id)
            }
            this.typeList = res.Data
          } else {
            let msg = res.Message ? res.Message : '月租车位信息获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '月租车位信息获取失败！'
          })
          this.isLoading = false
        })
    },

    // 选择用户处理
    userSelected (obj) {
      this.ruleForm.oid = obj.id
      this.ruleForm.uname = obj.realname
      this.ruleForm.idcard = obj.idcard
      this.ruleForm.utype = obj.owner_type.name
      this.ruleForm.method = '租用'
      this.ruleForm.utel = obj.tel
    },

    // 点击添加图标处理
    addPlate () {
      let data = {
        plates: ''
      }
      this.ruleForm.plateInfo.push(data)
    },

    // 点击绑定车牌删除图标处理
    delPlate (index) {
      this.ruleForm.plateInfo.splice(index, 1)
    },

    // 确认登记处理
    registerConfirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            oid: this.ruleForm.oid,
            vid: this.vid,
            starttime: this.ruleForm.stime / 1000,
            resources_type_id: this.typeList.find(item => item.active).resources_type_id,
            non_owner_tel: this.ruleForm.utel,
            subject_village_arr: this.ruleForm.subject,
            remark: this.ruleForm.remark,
            plates: this.ruleForm.plateInfo.map(item => item.plates)
          }
          this.registerRequst(data)
        }
      })
    },

    // 确认登记请求
    registerRequst (data) {
      this.isCommit = true
      this.$axios
        .post(this.urlObj.addMonthCar, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '登记成功！'
            })
            // 表单验证重置
            if (this.$refs.ruleForm) {
              this.$refs.ruleForm.resetFields()
            }
            this.getMonthParkInfo()
          } else {
            let msg = res.Message ? res.Message : '确认登记失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isCommit = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '确认登记失败！'
          })
          this.isCommit = false
        })
    },

    // 左侧车位类型选择处理
    typeClick (obj) {
      if (!obj.active) {
        this.typeList.forEach(item => {
          item.active = false
        })
        obj.active = true
        this.subOptions = []
        this.ruleForm.plateInfo = [
          {
            plates: ''
          }
        ]
        // 表单验证重置
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields()
        }
        // 获取科目类型
        this.getSubjectData(obj.resources_type_id)
      }
    }
  }
}
