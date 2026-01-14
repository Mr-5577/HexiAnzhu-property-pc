// 导入树形结构组件
import treeSearch from '@/components/common/TreeSearch.vue'
// 导入装修信息组件
import Fitment from '@/components/charge/common/Fitment.vue'
// 导入添加费用
import ChargeAdd from '@/components/charge/common/ChargeAdd.vue'
// 导入历史缴费
import PaymentHistory from '@/components/charge/common/PaymentHistory.vue'
// 导入欠费调整
import ChargeAdjust from '@/components/charge/common/ChargeAdjust.vue'
// 导入退款管理
import RefundManage from '@/components/charge/common/RefundManage.vue'
// 欠费记录表格列数据
import recordCloumns from '../json/record-cloumns.json'
// 最近缴费记录表格列数据
// import recentlyCloumns from '../json/recently-cloumns.json'
// 预缴预存表格列数据
// import prepayCloumns from '../json/prepay-cloumns.json'
// 预存款表格列数据
// import depositCloumns from '../json/deposit-columns.json'
// 缴费清单表格列数据
// import inventoryCloumns from '../json/inventory-cloumns.json'

// 导入打印 js 文件
import myPrint from '@/assets/common/js/LodopNew.js'
import { _ } from 'core-js'

// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'addCharge',
  components: {
    treeSearch,
    Fitment,
    ChargeAdd,
    PaymentHistory,
    ChargeAdjust,
    RefundManage,
  },
  data () {
    return {
      urlObj: {
        searchdata: this.$api.state.Charge.searchdata.url,
        getroomsowner: this.$api.state.Charge.getroomsowner.url,
        getownerbalance: this.$api.state.Charge.getownerbalance.url,
        userusereceipt: this.$api.state.Charge.userusereceipt.url,
        getresourcesarrears: this.$api.state.Charge.getresourcesarrears.url,
        getcarlastcost: this.$api.state.Charge.getcarlastcost.url,
        sourcesprepayment: this.$api.state.Charge.sourcesprepayment.url,
        getownerarrears: this.$api.state.Charge.getownerarrears.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        addsn: this.$api.state.Charge.addsn.url,
        getResource: this.$api.state.Charge.getResource.url,
        getOtherResource: this.$api.state.Charge.getOtherResource.url,
        vipSubject: this.$api.state.Charge.vipSubject.url,
        vipChargeInfo: this.$api.state.Charge.vipChargeInfo.url,
        vipRefund: this.$api.state.Charge.vipRefund.url,
        getfreeid: this.$api.state.Charge.getfreeid.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
        saveUploadInfo: this.$api.state.Public.saveUploadInfo.url,
        delFile: this.$api.state.Public.delFile.url,
        issueReceipt: this.$api.state.Charge.issueReceipt.url,
        getinvoiceinfo: this.$api.state.Charge.getinvoiceinfo.url,
        balancemove: this.$api.state.Charge.balancemove.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        roomOfUnit: this.$api.state.Public.roomOfUnit.url,
        userOfRoom: this.$api.state.Public.userOfRoom.url,
        getreceipttype: this.$api.state.Charge.getreceipttype.url,
        ownresources: this.$api.state.Means.ownresources.url,
        getadvanceformat: this.$api.state.Charge.getadvanceformat.url,
        settime: this.$api.state.Charge.settime.url,
        setRoomCheck: this.$api.state.Charge.setRoomCheck.url,
      },
      // 当前项目id
      currentVid: '',
      // 当前项目名称
      currentVname: '',
      // 当前用户信息数据
      currentUser: {},
      // 当前操作菜单index (0: 收费界面；1：添加费用；2：历史缴费；3：欠费调整；4：退款管理)
      opIndex: 0,
      // 当前用户的余额
      ownerBalance: '0.00',
      // 资源信息数据
      resourceInfo: null,
      // 其他资源信息
      otherResourceInfo: null,
      // 用户列表数据
      typeVal: '',
      typeOptions: [],
      // 开关绑定值
      switchVal: false,
      // 欠费记录表格数据/配置
      recordTable: [],
      recordColumns: recordCloumns.list,
      recordConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前选择的欠费记录数据
      recordSelected: [],
      // 欠费合计金额
      recordTotal: '0.00',

      // // 最近缴费记录表格数据/配置
      // recentlyTable: [],
      // recentlyColumns: recentlyCloumns.list,
      // recentlyConf: {
      //   loadStatus: false,
      //   emptyText: '',
      //   curPage: 1,
      //   limit: 10,
      //   dataTotal: 0
      // },
      // // 预缴预存表格数据/配置
      // prepayTable: [],
      // prepayColumns: prepayCloumns.list,
      // prepayConf: {
      //   loadStatus: false,
      //   emptyText: ''
      // },
      // // 预存款表格数据/配置
      // depositTable: [],
      // depositColumns: depositCloumns.list,
      // depositConf: {
      //   loadStatus: false,
      //   emptyText: ''
      // },
      // // 当前选择的预缴数据
      // prepaySelected: [],
      // // 当前选择的预存款
      // depositSelected: [],
      // inventoryColumns: inventoryCloumns.list,
      // inventoryConf: {
      //   loadStatus: false,
      //   emptyText: '',
      //   curPage: 1,
      //   limit: 10,
      //   dataTotal: 0
      // },

      // 是否显示缴费信息 弹框
      showPaymentDialog: false,
      // 表单数据列表
      infoList: [],
      // 是否使用余额
      useBalance: false,
      // 弹框表单数据对象
      ruleForm: {
        vname: '',
        buyer: '',
        code: '',
        identify: '',
        bank: '',
        method: '',
        amount: '',
        discounts: '',
        reality: '',
        gathering: '',
        isReceipt: '',
        receiptType: '',
        isPaper: '',
        fileInfo: [],
        remark: ''
      },
      // 表单验证对象
      rules: {
        vname: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
        buyer: [
          { required: true, message: '请输入购买方名称', trigger: 'blur' }
        ],
        code: [{ required: false, message: '请输入房号/电话', trigger: 'blur' }],
        identify: [
          { required: false, message: '请输入纳税人识别号', trigger: 'blur' }
        ],
        bank: [
          { required: false, message: '请输入开户行账号', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择收费方式', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入应收金额', trigger: 'blur' }
        ],
        discounts: [
          { required: true, message: '请输入优惠金额', trigger: 'blur' }
        ],
        reality: [
          { required: true, message: '请输入实收金额', trigger: 'blur' }
        ],
        gathering: [
          { required: true, message: '请选择收款时间', trigger: 'change' }
        ],
        isReceipt: [
          { required: true, message: '请选择是否生成发票', trigger: 'change' }
        ],
        receiptType: [
          { required: true, message: '请选择收据类型', trigger: 'change' }
        ],
        isPaper: [
          { required: true, message: '请选择是否生成纸质收据', trigger: 'change' }
        ],
        fileInfo: [
          {
            type: 'array',
            required: true,
            message: '请上传附件！',
            trigger: 'change'
          }
        ],
      },
      // 是否显示vip 退款弹框
      showVipDialog: false,
      vipForm: {
        subject: '',
        name: '',
        area: '',
        price: '',
        etime: '',
        rtime: ''
      },
      vipRules: {
        subject: [{ required: true, message: '请选择科目', trigger: 'change' }],
        name: [
          { required: true, message: '请输入资源名称', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请输入资源面积', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入资源单价', trigger: 'change' }
        ],
        etime: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        rtime: [
          { required: true, message: '请选择退款日期', trigger: 'change' }
        ]
      },
      // 是否正在提交数据
      isCommit: false,
      // 科目列表数据
      subOptions: [],
      // 日期限制条件
      pickerOptions: {},
      // 图片/文件上传参数
      qiniuDatas: {},
      // 支付方式 免单 id
      freeId: null,
      // 要下载的发票的链接
      downloadUrl: '',
      // 是否显示零钱转移弹框
      showMoveDialog: false,
      // 表单数据对象
      moveForm: {
        vname: '',
        build: '',
        unit: '',
        room: '',
        uid: '',
        money: ''
      },
      // 表单规则对象
      moveRules: {
        vname: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        build: [{ required: false, message: '请选择楼栋', trigger: 'change' }],
        unit: [{ required: false, message: '请选择单元', trigger: 'change' }],
        room: [{ required: false, message: '请选择房号', trigger: 'change' }],
        uid: [{ required: true, message: '请选择客户', trigger: 'change' }],
        money: [{ required: true, message: '请输入转移金额', trigger: 'blur' }]
      },
      // 楼栋
      buildOptions: [],
      // 单元
      unitOptions: [],
      // 房号
      roomOptions: [],
      // 客户
      userOptions: [],
      // 用户搜索框绑定值
      autoValue: '',
      // 用户筛选列表
      allUserList: [],
      // 当前用户信息数据
      currentMoveUser: {},
      // 是否是零钱充值
      isRecharge: false,
      // 当前项目支持的收据类型
      receiptType: '',
      // 当前用户拥有资源列表
      ownresources: [],
      // 是否正在加载左侧数据
      loading: false,
      // 预存款格式化规则
      roundMethod: '',
      // 入场时间选择框绑定值
      dateVal: '',
      // 欠费记录老数据
      oldRecords: [],
      // 欠费记录资源名称列表
      recordNames: [],
      nameVal: '',
    }
  },

  /**
   * 计算属性
   */
  computed: {
    // 缴费清单表格数据/配置
    // inventoryTable () {
    //   let arr = []
    //   if (this.recordSelected.length > 0) {
    //     this.recordSelected.forEach(item => {
    //       let obj = {
    //         id: item.id,
    //         suject_id: item.suject_id,
    //         title: item.title,
    //         ymonth: item.ymonth,
    //         subName: item.subName,
    //         money: item.money,
    //         discount_money: item.discount_money,
    //         real_money: _.round(
    //           _.subtract(item.money, item.discount_money),
    //           2
    //         )
    //       }
    //       arr.push(obj)
    //     })
    //   }
    //   if (this.prepaySelected.length > 0) {
    //     this.prepaySelected.forEach(itm => {
    //       let date = new Date(itm.start_time)
    //       let y = date.getFullYear()
    //       let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    //       let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    //       itm.start_time_text = y + '-' + m + '-' + d
    //       let selects = this.selectedDataHandle(itm)
    //       selects.forEach(item => {
    //         let obj = {
    //           id: item.id,
    //           suject_id: item.suject_id,
    //           price: item.price,
    //           start_time: item.start_time_text,
    //           title: item.title,
    //           ymonth: item.start_time_text,
    //           subName: item.subject_name,
    //           money: item.total,
    //           discount_money: '0.00',
    //           real_money: item.total
    //         }
    //         arr.push(obj)
    //       })
    //     })
    //   }
    //   if (this.depositSelected.length > 0) {
    //     this.depositSelected.forEach(item => {
    //       let obj = {
    //         price: '',
    //         start_time: '',
    //         title: item.title,
    //         ymonth: '--',
    //         subName: item.subject_name,
    //         money: item.money ? item.money : '0.00',
    //         discount_money: '0.00',
    //         real_money: item.money ? item.money : '0.00'
    //       }
    //       arr.push(obj)
    //     })
    //   }
    //   return arr
    // },

    // 合计金额
    inventAmount () {
      let total = 0
      // this.inventoryTable.forEach(item => {
      //   total = _.round(_.add(total, Number(item.money)), 2)
      // })
      this.recordSelected.forEach(item => {
        total = _.add(Number(total), Number(item.money))
      })
      return _.round(total, 2).toFixed(2)
    }
  },

  /**
   * 属性监听
   */
  watch: {
    'ruleForm.discounts' (val) {
      this.ruleForm.reality = _.round(_.subtract(this.ruleForm.amount, val), 2)
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
    // 树形结构选择处理
    checkChange (obj) {
      if (obj.type === "village") {
        this.currentVid = obj.id
        this.currentVname = obj.label
      }
      if (obj.id != this.currentUser.id) {
        // 清空 临时收费数据
        sessionStorage.removeItem("tempArr")
        sessionStorage.removeItem("preArr")
        this.switchVal = false
        if (obj.search) {
          this.currentUser = obj
          this.pageInit()
        } else {
          if (obj.type === 'owner') {
            this.currentUser = {
              id: obj.roomid,
              oid: obj.id,
              tel: '',
              title: '',
              type: 'rooms',
              type_name: '房屋',
              username: obj.label
            }
            this.pageInit()
          } else if (obj.type === 'car') {
            this.currentUser = {
              id: obj.id,
              oid: obj.oid,
              tel: '',
              title: '',
              type: 'car',
              type_name: '固定车',
              username: obj.non_owner_name
            }
            this.pageInit()
          } else if (obj.type === 'carmonth') {
            this.currentUser = {
              id: obj.id,
              oid: obj.oid,
              tel: '',
              title: '',
              type: 'carmonth',
              type_name: '月租车',
              username: obj.label
            }
            this.pageInit()
          } else if (obj.type === "car_nonmotor") {
            this.currentUser = {
              id: obj.id,
              oid: obj.oid,
              tel: '',
              title: '',
              type: 'car_nonmotor',
              type_name: '非机动车',
              username: obj.label
            }
            this.pageInit()
          } else if (obj.type === "lastvirtual") {
            this.currentUser = {
              id: obj.id,
              oid: obj.oid,
              tel: '',
              title: '',
              type: "virtual_resource",
              type_name: '其他资源',
              username: obj.name
            }
            this.pageInit()
          } else {
            this.currentUser = {}
          }
        }
      }
    },

    // 点击清空临时欠费按钮处理
    tempClear () {
      sessionStorage.removeItem("tempArr")
      sessionStorage.removeItem("preArr")
      this.pageInit()
    },

    // 页面初始化请求
    pageInit () {
      this.recordSelected = []
      // this.prepaySelected = []
      // this.depositSelected = []
      this.opIndex = 0
      this.recordTotal = '0.00'
      this.ownresources = []
      // 获取用户余额
      this.getOwnerBalance()
      // 获取欠费记录
      this.getChargeRecord()
      // 获取拥有资源
      this.getOwnresources()
      if (this.currentUser.type != 'owner') {
        // 获取预缴预存数据
        // this.getPrepayTable()
        // 获取资源信息数据
        this.getResourceInfo()
        // 获取其他资源信息
        this.getOtherResource()
        // 获取车辆最近缴费记录
        // this.getRecentlyTable()
        if (this.currentUser.type == 'rooms') {
          this.typeVal = this.currentUser.oid
          this.getRoomsOwner()
        }
      }
    },

    // 零钱预存
    recharge () {
      this.isRecharge = true
      this.getFreeId()
      this.getUploadToken()
      this.getPaymentType(1)
      this.getReceiptType()
      // 获取费用四舍五入方式
      this.getRoundMethod()
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.vname = this.currentVname
      this.ruleForm.buyer = this.currentUser.username
      this.ruleForm.method = ''
      this.ruleForm.amount = ''
      this.ruleForm.isReceipt = 0
      this.ruleForm.gathering = new Date()
      this.ruleForm.receiptType = 1
      let arr = [
        {
          name: '小区名称',
          value: 'vname',
          type: 'text',
          readonly: true
        },
        {
          name: '购买方名称',
          value: 'buyer',
          type: 'text',
          readonly: false
        },
        {
          name: '收费方式',
          value: 'method',
          type: 'select',
          options: [],
          readonly: false
        },
        {
          name: '应收金额',
          value: 'amount',
          type: 'number',
          readonly: false
        },
        {
          name: '收款时间',
          value: 'gathering',
          type: 'time',
          options: [],
          readonly: !this.$menu.getters.judgeRole('Btn-AW0xMrF2Y8BbUJHMIzt0iOCL')
        },
        {
          name: '是否生成发票',
          value: 'isReceipt',
          type: 'select',
          options: [
            {
              id: 0,
              name: '否'
            },
            {
              id: 1,
              name: '是'
            }
          ],
          readonly: false
        }
      ]
      this.infoList = arr
      this.useBalance = false
      this.showPaymentDialog = true
    },

    // 零钱转移
    balanceMove () {
      // 表单验证重置
      if (this.$refs.moveForm) {
        this.$refs.moveForm.resetFields()
      }
      this.moveForm.vname = this.currentVname
      this.showMoveDialog = true
      this.getBuildData()
    },

    // 搜索获取业主数据
    async querySearchAsync (queryStr, cb) {
      if (this.currentVid) {
        if (queryStr) {
          let value = {
            keywords: queryStr,
            vid: this.currentVid
          }
          let res = await this.$axios.post(this.urlObj.searchdata, value)
          if (res.Code === 200) {
            let first = {
              id: 0,
              username: '姓名',
              tel: '电话号码',
              title: '资源名称'
            }
            res.Data.returnData.unshift(first)
            this.allUserList = res.Data.returnData
            cb(res.Data.returnData)
          } else {
            this.$refs.searchInput.$children[0].blur()
          }
        } else {
          cb([])
        }
      } else {
        this.$refs.searchInput.close()
        this.$message({
          type: 'warning',
          message: '请选择项目后再搜索！'
        })
      }
    },

    // 选择用户处理
    handleSelect (user) {
      this.currentMoveUser = user
      this.moveForm.build = ''
      this.moveForm.unit = ''
      this.moveForm.room = ''
      this.unitOptions = []
      this.roomOptions = []
      this.moveForm.uid = user.oid
      this.userOptions = [
        {
          value: user.oid,
          label: user.username
        }
      ]
    },

    // 获取楼栋数据
    getBuildData () {
      let data = {
        vid: this.currentVid
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '楼栋数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元数据
    getUnitData () {
      let data = {
        bid: this.moveForm.build
      }
      this.$axios
        .post(this.urlObj.unitOfBuild, data)
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '单元数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取房屋数据
    getRoomData () {
      let data = {
        unit: this.moveForm.unit
      }
      this.$axios
        .post(this.urlObj.roomOfUnit, data)
        .then(res => {
          if (res.Code === 200) {
            this.roomOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '房屋数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取用户数据
    getUserData () {
      let data = {
        id: this.moveForm.room
      }
      this.$axios
        .post(this.urlObj.userOfRoom, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.label = item.owner ? item.owner.realname : ''
              item.value = item.oid
            })
            this.userOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '用户数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 楼栋选择更改处理
    buildChange () {
      this.moveForm.unit = ''
      this.moveForm.room = ''
      this.moveForm.uid = ''
      this.unitOptions = []
      this.roomOptions = []
      this.userOptions = []
      if (this.moveForm.build) {
        // 获取单元数据
        this.getUnitData()
      }
    },

    // 单元选择更改处理
    unitChange () {
      this.moveForm.room = ''
      this.moveForm.uid = ''
      this.roomOptions = []
      this.userOptions = []
      if (this.moveForm.unit) {
        // 获取房间数据
        this.getRoomData()
      }
    },

    // 房间选择更改处理
    roomChange () {
      this.moveForm.uid = ''
      this.userOptions = []
      if (this.moveForm.room) {
        // 获取用户数据
        this.getUserData()
      }
    },

    // 零钱转移提交
    moveSubmit () {
      this.$refs.moveForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            o_oid: this.currentUser.oid,
            n_oid: this.moveForm.uid,
            money: this.moveForm.money
          }
          this.$axios
            .post(this.urlObj.balancemove, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '零钱转移成功！'
                })
                this.showMoveDialog = false
                // 获取用户余额
                this.getOwnerBalance()
              } else {
                let msg = res.Message ? res.Message : '零钱转移失败！'
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

    // 点击 进行缴费 tab 处理
    gotoPay () {
      if (this.opIndex != 0) {
        this.pageInit()
      }
    },

    // 其它资源点击处理
    toOther (obj) {
      let info = {
        id: obj.id,
        oid: this.currentUser.oid,
        tel: obj.tel,
        title: obj.name,
        type: obj.type,
        type_name: obj.type_name,
        username: obj.realname
      }
      this.currentUser = info
      this.pageInit()
    },

    // 获取基本信息
    getBasicInfo () {
      // 获取用户余额
      this.getOwnerBalance()
      if (this.currentUser.type != 'owner') {
        // 获取资源信息数据
        this.getResourceInfo()
        // 获取其他资源信息
        this.getOtherResource()
      }
    },

    // 获取房源用户
    getRoomsOwner () {
      let data = {
        roomid: this.currentUser.id
      }
      this.$axios
        .post(this.urlObj.getroomsowner, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.name = item.type.name + '-' + item.owner.realname
              })
            }
            this.typeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取房源用户失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取用户余额
    getOwnerBalance () {
      let data = {
        oid: this.currentUser.oid
      }
      this.$axios
        .post(this.urlObj.getownerbalance, data)
        .then(res => {
          if (res.Code === 200) {
            this.ownerBalance = res.Data.money ? res.Data.money : '0.00'
            // this.depositTable = [
            //   {
            //     title: this.currentUser.title,
            //     type_name: this.currentUser.type_name,
            //     realname: this.currentUser.username,
            //     subject_name: '预存款',
            //     balance: this.ownerBalance,
            //     money: ''
            //   }
            // ]
          } else {
            let msg = res.Message ? res.Message : '获取用户余额失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取当前用户拥有资源
    getOwnresources () {
      this.loading = true
      let data = {
        id: this.currentUser.oid
      }
      this.$axios
        .post(this.urlObj.ownresources, data)
        .then(res => {
          if (res.Code === 200) {
            this.ownresources = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取用户拥有资源数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 获取资源信息数据
    getResourceInfo () {
      let data = {
        oid: this.currentUser.oid,
        id: this.currentUser.id,
        type: this.currentUser.type
      }
      this.$axios
        .post(this.urlObj.getResource, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.approach_time) {
              let time = new Date(res.Data.approach_time * 1000)
              let y = time.getFullYear()
              let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
              let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
              res.Data.approach_time = y + '-' + m + '-' + d
            }

            this.resourceInfo = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取资源信息失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取其他资源信息
    getOtherResource () {
      let data = {
        oid: this.currentUser.oid,
        vid: this.currentVid,
        exclude_id: this.currentUser.id,
        exclude_type: this.currentUser.type
      }
      this.$axios
        .post(this.urlObj.getOtherResource, data)
        .then(res => {
          if (res.Code === 200) {
            this.otherResourceInfo = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取其他资源信息失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取欠费记录数据
    getChargeRecord () {
      this.recordConf.loadStatus = true
      // let data = {
      //   resources_id: this.currentUser.id,
      //   type: this.currentUser.type,
      //   oid: this.currentUser.oid
      // }
      let data = {
        oid: this.currentUser.oid,
        vid: this.currentVid,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getownerarrears, data)
        .then(res => {
          if (res.Code === 200) {
            let money = 0
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.subName = item.subject ? item.subject.name : ''
                item.cname = item.creater ? item.creater.realname : ''
                money = money + Number(item.money)
              })
            }
            let arr = []
            if (sessionStorage.getItem('tempArr')) {
              arr = JSON.parse(sessionStorage.getItem('tempArr'))
            }
            arr.forEach((item, index) => {
              item.title = item.resources_name
              item.type_name = item.resources_type_name
              item.subName = item.subject_text
              item.describe = item.remarks
              item.cname = item.creater_name
              item.istemp = true
              item.index = index
              money = money + Number(item.money)
            })
            res.Data = arr.concat(res.Data)
            this.recordTotal = _.round(money, 2).toFixed(2)
            // 存放查询数据
            this.recordTable = res.Data ? res.Data : []
            this.oldRecords = JSON.parse(JSON.stringify(this.recordTable))
            // 提取科目数据
            this.nameVal = ""
            this.recordNames = []
            let names = []
            this.oldRecords.forEach(item => {
              if (!names.includes(item.title)) {
                names.push(item.title)
                this.recordNames.push({
                  value: item.title,
                  label: item.title
                })
              }
            })
            // 关闭加载状态
            this.recordConf.loadStatus = false
            // 清空空数据提示
            this.recordConf.emptyText = ''
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
            this.recordTable = []
            this.recordConf.emptyText = res.Message
            this.recordConf.dataTotal = 0
            this.recordConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.recordTable = []
          this.recordConf.emptyText = '服务器连接失败...'
          this.recordConf.dataTotal = 0
          this.recordConf.loadStatus = false
        })
    },

    // 欠费记录筛选资源名称处理
    recordNameChange (value) {
      this.recordSelected = []
      if (value) {
        this.recordTable = this.oldRecords.filter(item => item.title == value)
      } else {
        this.recordTable = JSON.parse(JSON.stringify(this.oldRecords))
      }
    },

    selectAllEvent ({ records }) {
      this.recordSelected = records
    },

    selectChangeEvent ({ records }) {
      this.recordSelected = records
    },

    // // 欠费记录勾选处理
    // recordSelectionChange (value) {
    //   this.recordSelected = value
    // },

    // 获取车辆最近缴费记录
    // getRecentlyTable () {
    //   this.recentlyConf.loadStatus = true
    //   let data = {
    //     id: this.currentUser.id,
    //     type: this.currentUser.type
    //   }
    //   // 获取项目列表数据
    //   this.$axios
    //     .post(this.urlObj.getcarlastcost, data)
    //     .then(res => {
    //       if (res.Code === 200) {
    //         // 存放查询数据
    //         this.recentlyTable = res.Data && !(res.Data instanceof Array) ? [res.Data] : []
    //         // 关闭加载状态
    //         this.recentlyConf.loadStatus = false
    //         // 清空空数据提示
    //         this.recentlyConf.emptyText = ''
    //       } else if (res.Code === 204) {
    //         // 登录信息过期
    //         this.$message({
    //           message: res.Message,
    //           type: 'error'
    //         })
    //         // 跳转至登录
    //         this.$router.push({
    //           path: this.$common.state.loginPath
    //         })
    //       } else {
    //         this.recentlyTable = []
    //         this.recentlyConf.emptyText = res.Message
    //         this.recentlyConf.dataTotal = 0
    //         this.recentlyConf.loadStatus = false
    //       }
    //     })
    //     .catch(() => {
    //       // 服务器连接失败
    //       this.recentlyTable = []
    //       this.recentlyConf.emptyText = '服务器连接失败...'
    //       this.recentlyConf.dataTotal = 0
    //       this.recentlyConf.loadStatus = false
    //     })
    // },

    // 获取预缴预存数据
    // getPrepayTable () {
    //   this.prepayConf.loadStatus = true
    //   let data = {
    //     id: this.currentUser.id,
    //     type: this.currentUser.type,
    //     oid: this.currentUser.oid
    //   }
    //   // 获取项目列表数据
    //   this.$axios
    //     .post(this.urlObj.sourcesprepayment, data)
    //     .then(res => {
    //       if (res.Code === 200) {
    //         if (res.Data && res.Data.length > 0) {
    //           res.Data.forEach(item => {
    //             if (item.edit_day == 1) {
    //               this.$set(this.prepayColumns, 3, {
    //                 "type": "date",
    //                 "label": "预缴起始月",
    //                 "prop": "start_time",
    //                 "old_time": 'old_time',
    //                 "show": true,
    //                 "color": "#999",
    //                 "dateType": "date"
    //               })
    //             }
    //             item.number = 1
    //             item.price = _.round(item.price, 2)
    //             item.total = item.price
    //             item.start_time = item.start_time * 1000
    //             item.old_time = item.start_time
    //             let date = new Date(item.start_time)
    //             let y = date.getFullYear()
    //             let m =
    //               date.getMonth() + 1 < 10
    //                 ? '0' + (date.getMonth() + 1)
    //                 : date.getMonth() + 1
    //             let d =
    //               date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    //             item.start_time_text = y + '-' + m + '-' + d
    //           })
    //         }
    //         // 存放查询数据
    //         this.prepayTable = res.Data ? res.Data : []
    //         // 关闭加载状态
    //         this.prepayConf.loadStatus = false
    //         // 清空空数据提示
    //         this.prepayConf.emptyText = ''
    //       } else if (res.Code === 204) {
    //         // 登录信息过期
    //         this.$message({
    //           message: res.Message,
    //           type: 'error'
    //         })
    //         // 跳转至登录
    //         this.$router.push({
    //           path: this.$common.state.loginPath
    //         })
    //       } else {
    //         this.prepayTable = []
    //         this.prepayConf.emptyText = res.Message
    //         this.prepayConf.dataTotal = 0
    //         this.prepayConf.loadStatus = false
    //       }
    //     })
    //     .catch((err) => {
    //       // 服务器连接失败
    //       this.prepayTable = []
    //       this.prepayConf.emptyText = '服务器连接失败...'
    //       this.prepayConf.dataTotal = 0
    //       this.prepayConf.loadStatus = false
    //     })
    // },

    // 预缴预存勾选处理
    // prepaySelectionChange (value) {
    //   this.prepaySelected = value
    // },

    // 预缴预存（根据选择的数量处理）
    // selectedDataHandle (obj) {
    //   let y = Number(obj.start_time_text.split('-')[0])
    //   let m = Number(obj.start_time_text.split('-')[1])
    //   let arr = []
    //   for (let i = 0; i < obj.number; i++) {
    //     let obj1 = JSON.parse(JSON.stringify(obj))
    //     let y1 = y + parseInt((i + m) / 12)
    //     let m1 = ''
    //     if ((i + m) % 12 === 0) {
    //       y1 = y1 - 1
    //       m1 = 12
    //     } else {
    //       m1 = ((i + m) % 12) < 10 ? '0' + ((i + m) % 12) : (i + m) % 12
    //     }
    //     obj1.start_time_text = y1 + '' + m1
    //     obj1.total = obj.price
    //     arr.push(obj1)
    //   }
    //   return arr
    // },

    // 预存款勾选处理
    // depositSelectionChange (arr) {
    //   this.depositSelected = arr
    // },

    // 获取科目数据
    getSubjects () {
      let data = {
        vid: this.currentVid
      }
      this.$axios
        .post(this.urlObj.vipSubject, data)
        .then(res => {
          if (res.Code === 200) {
            this.subOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取科目数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 点击vip退款按钮处理
    vipRefund () {
      // 表单验证重置
      if (this.$refs.vipForm) {
        this.$refs.vipForm.resetFields()
      }
      this.subOptions = []
      this.pickerOptions = {
        disabledDate: () => false
      }
      // 获取科目列表数据
      this.getSubjects()
      this.showVipDialog = true
    },

    // 科目选择更改处理
    subChange () {
      // 获取科目缴费数据
      let data = {
        resources_id: this.currentUser.id,
        resources_type: this.currentUser.type,
        subject_id: this.vipForm.subject
      }
      this.$axios
        .post(this.urlObj.vipChargeInfo, data)
        .then(res => {
          if (res.Code === 200) {
            this.vipForm.name = res.Data.name
            this.vipForm.area = res.Data.area
            this.vipForm.price = res.Data.price
            this.vipForm.etime = res.Data.end_time * 1000
            this.pickerOptions = {
              disabledDate: time => {
                if (time) {
                  return time.getTime() > this.vipForm.etime
                }
              }
            }
          } else {
            let msg = res.Message ? res.Message : '获取缴费数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // vip退款弹框确认
    vipSubmit () {
      this.$refs.vipForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = {
            resources_id: this.currentUser.id,
            resources_type: this.currentUser.type,
            subject_id: this.vipForm.subject,
            refund_start_time: this.vipForm.rtime / 1000
          }
          this.$axios
            .post(this.urlObj.vipRefund, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '退款成功！',
                  type: 'success'
                })
                // 关闭弹框
                this.showVipDialog = false
              } else {
                let msg = res.Message ? res.Message : '退款失败！'
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

    // // 预缴数量改变处理
    // numChange (obj) {
    //   if (!obj.value || obj.value == 0) {
    //     this.prepayTable[obj.index].number = 1
    //     this.prepayTable[obj.index].total = this.prepayTable[obj.index].price
    //   } else {
    //     this.prepayTable[obj.index].number = parseInt(obj.value)
    //     let total = _.round(
    //       _.multiply(this.prepayTable[obj.index].price, obj.value),
    //       2
    //     )
    //     this.prepayTable[obj.index].total = total
    //   }
    // },

    // 点击确认缴费按钮处理
    paymentInit () {
      this.isRecharge = false
      this.getFreeId()
      this.getUploadToken()
      this.getPaymentType()
      this.getReceiptType()
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.vname = this.currentVname
      this.ruleForm.buyer = this.currentUser.username
      this.ruleForm.code = this.resourceInfo.name + (this.resourceInfo.tel ? ('/' + this.resourceInfo.tel) : '')
      this.ruleForm.identify = ''
      this.ruleForm.bank = ''
      this.ruleForm.method = ''
      this.ruleForm.amount = this.inventAmount
      this.ruleForm.reality = this.inventAmount
      this.ruleForm.discounts = 0
      this.ruleForm.isReceipt = 0
      this.ruleForm.gathering = new Date()
      this.ruleForm.receiptType = 1
      this.ruleForm.isPaper = ''
      this.ruleForm.fileInfo = []
      this.ruleForm.remark = ''
      // 是否允许优惠
      let isDiscounts = true
      let subs = []
      this.recordSelected.forEach(item => {
        if (!subs.includes(item.subName)) {
          subs.push(item.subName)
        }
      })
      isDiscounts = subs.length > 1 ? false : true
      let arr = [
        {
          name: '小区名称',
          value: 'vname',
          type: 'text',
          readonly: true
        },
        {
          name: '购买方名称',
          value: 'buyer',
          type: 'text',
          readonly: false
        },
        {
          name: '房号/电话',
          value: 'code',
          type: 'text',
          readonly: true
        },
        {
          name: '纳税人识别号',
          value: 'identify',
          type: 'text',
          readonly: false
        },
        {
          name: '开户行账号',
          value: 'bank',
          type: 'text',
          readonly: false
        },
        {
          name: '收费方式',
          value: 'method',
          type: 'select',
          options: [],
          readonly: false
        },
        {
          name: '应收金额',
          value: 'amount',
          type: 'number',
          readonly: true,
          useBalance: true,
        },
        {
          name: '优惠金额',
          value: 'discounts',
          type: 'number',
          readonly: !isDiscounts
        },
        {
          name: '实收金额',
          value: 'reality',
          type: 'number',
          readonly: true
        },
        {
          name: '收款时间',
          value: 'gathering',
          type: 'time',
          options: [],
          readonly: !this.$menu.getters.judgeRole('Btn-AW0xMrF2Y8BbUJHMIzt0iOCL')
        },
        {
          name: '是否生成发票',
          value: 'isReceipt',
          type: 'select',
          options: [
            {
              id: 0,
              name: '否'
            },
            {
              id: 1,
              name: '是'
            }
          ],
          readonly: false
        }
      ]
      this.infoList = arr
      this.useBalance = false
      this.showPaymentDialog = true
    },

    // 获取四舍五入方式
    getRoundMethod () {
      let data = {
        oid: this.currentUser.oid
      }
      this.$axios
        .post(this.urlObj.getadvanceformat, data)
        .then(res => {
          if (res.Code === 200) {
            this.roundMethod = res.Data ? res.Data : ''
          } else {
            let msg = res.Message ? res.Message : '获取预存款格式化规则失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取当前项目支持的收据类型
    getReceiptType () {
      let data = {
        vid: this.currentVid
      }
      this.$axios
        .post(this.urlObj.getreceipttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.receiptType = res.Data ? res.Data.use_receipt_type : ''
          } else {
            let msg = res.Message ? res.Message : '获取收据类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取支付方式
    getPaymentType (receipts) {
      let data = {
        vid: this.currentVid
      }
      if (receipts) {
        data.receipts = receipts
        data.is_pre = 1
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            if (this.isRecharge) {
              this.infoList[2].options = res.Data ? res.Data : []
            } else {
              this.infoList[5].options = res.Data ? res.Data : []
            }
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

    moneyChange (obj) {
      if (this.isRecharge && obj.value == 'amount') {
        // 保留整数
        if (this.roundMethod.patterns == 1) {
          this.ruleForm.amount = _.round(Number(this.ruleForm.amount)).toFixed(0)
        } else if (this.roundMethod.patterns == 2) {
          // 保留一位小数
          this.ruleForm.amount = _.round(Number(this.ruleForm.amount), 1).toFixed(1)
        } else {
          // 保留两位小数
          this.ruleForm.amount = _.round(Number(this.ruleForm.amount), 2).toFixed(2)
        }
      }
    },

    // 确认缴费提交处理
    paymentConfirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 提取欠费ids
          let arrearageIds = []
          let allArr = []
          let tempArr = []
          let preArr = JSON.parse(sessionStorage.getItem('preArr')) ? JSON.parse(sessionStorage.getItem('preArr')) : []
          let uuids = []
          this.recordSelected.forEach(item => {
            // 是否是临时性费用
            if (item.istemp) {
              allArr.push({
                subject_id: item.subject_id,
                oid: item.owner_id,
                resources_model_id: item.resources_model_id,
                resources_model_type: item.resources_model_type,
                money: item.money,
                price: item.price,
                unit: item.unit,
                remarks: item.remarks,
              })
              if (item.cost_type == 'temp') {
                tempArr.push({
                  subject_id: item.subject_id,
                  oid: item.owner_id,
                  resources_model_id: item.resources_model_id,
                  resources_model_type: item.resources_model_type,
                  money: item.money,
                  price: item.price,
                  unit: item.unit,
                  remarks: item.remarks,
                })
              } else {
                if (!uuids.includes(item.uuid)) {
                  uuids.push(item.uuid)
                }
              }
            } else {
              arrearageIds.push(item.id)
            }
          })
          let selectPre = preArr.filter(item => uuids.includes(item.uuid))

          // 提取预缴数据
          // let prepay = []
          // let prepayMoney = 0
          // this.prepaySelected.forEach((item, index) => {
          //   let obj = {
          //     id: item.id,
          //     type: item.type,
          //     subject_id: item.subject_id,
          //     start_time: item.start_time / 1000,
          //     num: item.number
          //   }
          //   prepayMoney = _.add(prepayMoney, Number(item.total))
          //   prepay.push(obj)
          // })

          let data = null

          if (this.isRecharge) {
            data = {
              vid: this.currentVid,
              oid: this.currentUser.oid,
              realname: this.ruleForm.buyer,
              pay_type: this.ruleForm.method,
              bz: this.ruleForm.remark,
              allmoney: this.ruleForm.amount,
              discount_money: '',
              use_balance: 0,
              nsrsbh: '',
              khhzh: '',
              is_bill: this.ruleForm.isReceipt,
              pay_time: this.ruleForm.gathering / 1000,
              balance: 1,
              balance_money: this.ruleForm.amount
            }
          } else {
            data = {
              vid: this.currentVid,
              oid: this.currentUser.oid,
              realname: this.ruleForm.buyer,
              pay_type: this.ruleForm.method,
              cost_ids: arrearageIds,
              tempdata: tempArr,
              prepayment: selectPre,
              bz: this.ruleForm.remark,
              allmoney: this.ruleForm.amount,
              discount_money: this.ruleForm.discounts,
              use_balance: this.useBalance ? 1 : 0,
              nsrsbh: this.ruleForm.identify,
              khhzh: this.ruleForm.bank,
              is_bill: this.ruleForm.isReceipt,
              pay_time: this.ruleForm.gathering / 1000
            }
          }
          if (this.receiptType == 3) {
            data.receipt_type = this.ruleForm.receiptType
            if (this.ruleForm.receiptType == 2) {
              data.is_open_receiptpaper = this.ruleForm.isPaper
            }
          } else if (this.receiptType == 2) {
            data.is_open_receiptpaper = this.ruleForm.isPaper
          }
          if (this.ruleForm.method == this.freeId) {
            data.md_file_ids = this.ruleForm.fileInfo.map(item => item.id)
          }
          this.$axios
            .post(this.urlObj.addsn, data)
            .then(res => {
              if (res.Code === 200) {
                // 清除临时性收费
                if (allArr.length > 0) {
                  let ids = this.recordSelected.map(item => item.index)
                  let arr = JSON.parse(sessionStorage.getItem('tempArr'))
                  let newArr = arr.filter((item, index) => {
                    return !ids.includes(index)
                  })
                  sessionStorage.setItem('tempArr', JSON.stringify(newArr))
                }
                this.$message({
                  type: 'success',
                  message: '缴费成功！'
                })
                if (res.Data.fp_num > 0) {
                  this.$confirm('确定要下载发票吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                    .then(() => {
                      // 下载发票
                      this.invoiceDownload(res.Data.sn_id)
                    })
                    .catch(() => { })
                } else if (res.Data.re_num > 0) {
                  this.$confirm('确定要打印收据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                    .then(() => {
                      // 打印收据
                      this.printOrder(res.Data.sn_id)
                    })
                    .catch(() => { })
                }
                // 关闭弹框
                this.showPaymentDialog = false
                // 重新获取数据
                this.pageInit()
              } else {
                let msg = res.Message ? res.Message : '缴费失败！'
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

    // 打印
    printOrder (id) {
      let data = {
        id: id,
        type: 2
      }
      // 获取打印数据
      this.$axios
        .post(this.urlObj.issueReceipt, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.id = id
            // 开始打印
            myPrint.startLodop(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取打印数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 下载发票
    invoiceDownload (id) {
      // 获取发票链接
      this.$axios
        .post(this.urlObj.getinvoiceinfo, { id: id })
        .then(res => {
          if (res.Code === 200) {
            this.downloadUrl = res.Data.pdf_url
            this.$nextTick(() => {
              let adom = this.$refs.adom
              adom.click()
            })
          } else {
            let msg = res.Message ? res.Message : '获取发票链接失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 点击未装修、已装修、装修中 按钮处理
    showFitment (type) {
      if (
        this.$menu.getters.judgeRole('Btn-78oi6mDGaHh4xE000ywAbS3A') ||
        type == 1
      ) {
        this.$refs.fitment.init(type, this.currentUser)
      }
    },
    /**
     * 
     * 点击是否交房状态
     * 
     */
    onDeliveryHouse(type) {
      if (this.$menu.getters.judgeRole('Btn-q1WPuhfALwUEjeO00baQDlHS9Y')) {
        const h = this.$createElement;
        this.$msgbox({
          title: '温馨提示',
          message: h('p', null, [
            h('span', null, '是否确认修改交房状态为'),
            h('span', { style: 'font-weight: bold' }, '【已交房】'),
            h('span', null, '，状态修改为已交房后不可再修改'),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.isCommit = true;
          this.$axios
            .post(this.urlObj.setRoomCheck, { id: this.resourceInfo.id, type: type, })
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
                // 获取资源信息数据
                this.getResourceInfo()
              } else {
                this.$message({
                  message: res.Message,
                  type: 'error'
                })
              }
              this.isCommit = false;
            })
            .catch(() => {
              this.isCommit = false;
            })
        })
        .catch(() => { })
      }
    },

    // 点击其他资源装修状态按钮
    showOtherFitment (type, obj) {
      obj.oid = this.currentUser.oid
      this.$refs.fitment.init(type, obj)
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

    // 添加入场时间
    dateChange () {
      let time = new Date(this.dateVal)
      let y = time.getFullYear()
      let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
      let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      let ndate = y + '-' + m + '-' + d
      this.$confirm(`此操作将把入场时间设置为：${ndate}，设置后不能修改，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.resourceInfo.id,
            type: this.resourceInfo.type,
            approach_time: this.dateVal / 1000,
          }
          this.$axios.post(this.urlObj.settime, data).then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '入场时间设置成功！'
              })
              // 获取资源信息数据
              this.getResourceInfo()
            } else {
              let msg = res.Message ? res.Message : '设置入场时间失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
        })
        .catch(() => { })
    }
  }
}
