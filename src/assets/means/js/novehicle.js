// 导入用户搜索、绑定组件
import userBind from '@/components/means/common/UserBind.vue'
// 导入大区、项目预选择页面
import areaVillageSelect from '@/components/common/AreaVillageSelect.vue'

export default {
  name: 'novehicle',
  components: {
    userBind,
    areaVillageSelect
  },
  data () {
    return {
      urlObj: {
        nomotorNum: this.$api.state.Means.nomotorNum.url,
        nomotorRegister: this.$api.state.Means.nomotorRegister.url,
        gettemporary: this.$api.state.Means.gettemporary.url,
        fixcarbyowner: this.$api.state.Means.fixcarbyowner.url,
      },
      // 当前大区 id
      aid: '',
      // 当前项目 id
      vid: '',
      // 是否选择了项目
      isRegister: false,
      // 是否正在加载数据
      isLoading: false,
      // 非机动车登记数量
      nomotorNum: 0,
      // 是否正在提交数据
      isCommit: false,
      // 表单数据对象
      ruleForm: {
        oid: '',
        uname: '',
        idcard: '',
        utype: '',
        plate: '',
        utel: '',
        ctype: '',
        subject: [],
        stime: '',
        icname: '',
        iccode: '',
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
        plate: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        utel: [
          { required: true, message: '请输入联系电话', trigger: 'change' }
        ],
        ctype: [
          { required: true, message: '请选择车辆类型', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '请选择收费科目', trigger: 'change' }
        ],
        stime: [
          { required: true, message: '请选择启用日期', trigger: 'change' }
        ],
        icname: [
          { required: true, message: '请输入IC卡名称', trigger: 'blur' }
        ],
        iccode: [
          { required: true, message: '请输入IC卡卡号', trigger: 'blur' }
        ],
      },
      // 车辆类型列表
      typeOptions: [],
      // 科目数据列表
      subOptions: [],
      // 是否有车场
      hasPark: false,
      // 表格单选值
      radioVal: '',
      // 已购车位表格数据
      stallData: []
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
      // 获取非机动车数量
      this.getNomotorNum()
      this.getCarType()
      this.getTemporary()
    },

    // 获取车辆类型
    getCarType () {
      let data = {
        type: 'car_nonmotor'
      }
      this.$axios
        .post(this.$api.state.Means.carType.url, data)
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '车辆类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '车辆类型数据获取失败！'
          })
        })
    },

    // 获取项目下是否存在非机动车临停车场
    getTemporary () {
      this.$axios
        .post(this.$api.state.Means.gettemporary.url, { vid: this.vid })
        .then(res => {
          if (res.Code === 200) {
            this.hasPark = res.Data.has_temporary == 1 ? true : false
          } else {
            let msg = res.Message ? res.Message : '非机动车临停车场数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取类型下面的科目
    getSubjectData (value) {
      this.ruleForm.subject = ''
      this.subOptions = []
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

    // 获取非机动车数量
    getNomotorNum () {
      this.isLoading = true
      this.$axios
        .post(this.urlObj.nomotorNum, { vid: this.vid })
        .then(res => {
          if (res.Code === 200) {
            this.nomotorNum = res.Data.num
          } else {
            let msg = res.Message ? res.Message : '非机动车数量获取失败！'
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
            message: '非机动车数量获取失败！'
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
      this.ruleForm.utel = obj.tel
      this.radioVal = ''
      if (this.$menu.getters.judgeRole('Btn-rui2opy5OYH4zbotd7HEd95KHs')) {
        this.getFixcarOwner()
      }
    },

    // 获取用户绑定非机动车
    getFixcarOwner () {
      let data = {
        oid: this.ruleForm.oid
      }
      this.$axios
        .post(this.urlObj.fixcarbyowner, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.name = this.ruleForm.uname
              item.tel = this.ruleForm.utel
              item.cycle = (item.starttime ? item.starttime : '') + (item.endtime ? ' - ' + item.endtime : '')
            })
            this.stallData = res.Data
          } else {
            let msg = res.Message ? res.Message : '绑定非机动车数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => { })
    },

    // 确认登记处理
    registerConfirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.vid,
            oid: this.ruleForm.oid,
            starttime: this.ruleForm.stime / 1000,
            non_owner_tel: this.ruleForm.utel,
            plates: this.ruleForm.plate,
            resources_type_id: this.ruleForm.ctype,
            subject_village_arr: this.ruleForm.subject,
          }
          if (this.radioVal) {
            data.car_id = this.radioVal
          }
          if (this.hasPark) {
            // data.ic_card_name = this.ruleForm.icname
            data.ic_card_code = this.ruleForm.iccode
          }
          this.registerRequst(data)
        }
      })
    },

    // 确认登记请求
    registerRequst (data) {
      this.$axios
        .post(this.urlObj.nomotorRegister, data)
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
            this.stallData = []
            // 重新获取一次登记车辆数量
            this.getNomotorNum()
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
    }
  }
}
