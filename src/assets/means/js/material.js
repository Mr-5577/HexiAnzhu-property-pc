// 预导入图片
import img1 from '@/assets/means/image/total-area.png'
import img2 from '@/assets/means/image/covered-area.png'
import img3 from '@/assets/means/image/carport.png'
import img4 from '@/assets/means/image/usable-area.png'
import img5 from '@/assets/means/image/volume.png'
import img6 from '@/assets/means/image/afforest.png'
import img7 from '@/assets/means/image/public-place.png'
import img8 from '@/assets/means/image/home.png'
import img9 from '@/assets/means/image/building.png'
import img10 from '@/assets/means/image/unit.png'
import img11 from '@/assets/means/image/structure.png'
import img12 from '@/assets/means/image/rate.png'
import img13 from '@/assets/means/image/steward.png'
import img14 from '@/assets/means/image/house-name.png'
import img15 from '@/assets/means/image/check-out.png'
import img16 from '@/assets/means/image/fitment.png'
import img17 from '@/assets/means/image/residence.png'
import img18 from '@/assets/means/image/date.png'
import img19 from '@/assets/means/image/changeDate.png'
import img20 from '@/assets/means/image/label.png';

// 导入表格json 文件
import roomTable from '@/assets/means/json/room-table.json'
// 导入树形结构组件
import treeSearch from '@/components/common/TreeSearch.vue'
// 导入信息编辑组件
import infoEdit from '@/components/means/common/InfoEdit.vue'
// 导入弹框组件
import allDialog from '@/components/means/common/AllDialog.vue'
// 导入固定车位、月租车位详情
import stallDetail from '@/components/means/common/StallDetail.vue'
// 导入下发失败记录表格json 文件
import issueColumns from '@/assets/means/json/issue-columns.json'
// 导入下发失败记录表格json 文件
import vehicleIssue from '@/assets/means/json/vehicle-issue.json'
// 导入批量修改表格json 文件
import batchColumns from '@/assets/means/json/batch-columns.json'
// 导入表格json 文件
import logTable from '@/assets/means/json/log-table.json'

export default {
  name: 'material',
  components: {
    treeSearch,
    infoEdit,
    allDialog,
    stallDetail
  },

  data () {
    return {
      // 接口数据对象
      urlObj: {
        villageInfo: this.$api.state.Means.villageInfo.url,
        buildInfo: this.$api.state.Means.buildInfo.url,
        roomInfo: this.$api.state.Means.roomInfo.url,
        ownerInfo: this.$api.state.Means.ownerInfo.url,
        tableList: this.$api.state.System.village.list.url,
        villageEdit: this.$api.state.Means.villageEdit.url,
        buildEdit: this.$api.state.Means.buildEdit.url,
        ownerEdit: this.$api.state.Means.ownerEdit.url,
        stallNumber: this.$api.state.Means.stallNumber.url,
        emigration: this.$api.state.Means.emigration.url,
        charge: this.$api.state.Means.charge.url,
        issueTable: this.$api.state.Means.issueTable.url,
        issuefaillist: this.$api.state.Means.issuefaillist.url,
        issueAgain: this.$api.state.Means.issueAgain.url,
        nonissuefail: this.$api.state.Means.nonissuefail.url,
        batchTable: this.$api.state.Means.batchTable.url,
        delayTime: this.$api.state.Means.delayTime.url,
        subjectList: this.$api.state.Public.subjectList.url,
        carType: this.$api.state.Means.carType.url,
        userSearch: this.$api.state.Means.userSearch.url,
        virtualAdd: this.$api.state.Means.virtualAdd.url,
        logData: this.$api.state.Means.logData.url,
        editrooms: this.$api.state.Means.editrooms.url,
        setintohouse: this.$api.state.Means.setintohouse.url,
        addfixcar: this.$api.state.Means.addfixcar.url,
        virtualtypetree: this.$api.state.Means.virtualtypetree.url,
        subjectbytype: this.$api.state.Public.subjectbytype.url,
      },
      // 是否正在加载数据
      isLoading: false,
      // 是否正在编辑项目
      isEditVillage: false,
      // 是否正在编辑楼栋
      isEditBuild: false,
      // 是否正在编辑业主
      isEditOwner: false,
      // 是否显示房产信息
      showHouseInfo: false,
      // 是否显示车位信息
      showStallInfo: false,
      // 是否显示月租车信息
      showCarInfo: false,
      // 是否显示非机动车信息
      showNoCarInfo: false,
      // 是否显示门禁卡信息
      showCardInfo: false,
      // 当前选择数据
      currentData: '',
      // 当前项目名
      villageName: '',
      // 当前选择信息统计列表
      infoList: [],
      // 项目详情数据
      villageData: {},
      // 项目基本信息项列表
      villageList: [],
      // 楼栋详情数据
      buildData: {},
      // 楼栋基本信息列表项
      buildList: [],
      // 房间详情数据
      roomData: {},
      // 房间基本信息列表项
      roomList: [],
      // 业主详情数据
      ownerData: {},
      // 房间表格数据
      tableData: [],
      // 表格配置项
      columns: roomTable.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前弹框类型(1新增客户；2房产过户；3变更日志)
      dialogType: 1,
      // 是否显示弹框
      showDialog: false,
      // 备注文本域绑定值
      textareaValue: '',
      // 固定车位数量
      stallNum: '',
      // 是否正在提交业主数据
      isCommit: false,
      // 是否显示下发失败记录弹框
      showIssueDialog: false,
      // 是否显示批量修改弹框
      showBatchDialog: false,
      // 下发失败记录表格数据
      issueTableData: [],
      // 下发失败记录表格配置项
      issueColumns: issueColumns.list,
      // 下发失败记录表格配置
      issueConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 下发失败表格选择数据列表
      tableSelected: [],
      // 批量修改表格数据
      batchTableData: [],
      // 修改表格选择数据列表
      editSelected: [],
      // 批量修改表格配置项
      batchColumns: batchColumns.list,
      // 批量修改表格配置
      batchConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示日期选择弹框
      showTimeDialog: false,
      // 到期时间绑定值
      dateVal: '',
      // 是否显示添加虚拟资源弹框
      showOtherDialog: false,
      // 表单数据对象
      ruleForm: {
        name: '',
        area: '',
        type: '',
        rtype: [],
        firstTime: '',
        subject: [],
        uname: '',
        remark: ''
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        area: [{ required: true, message: '请输入资源面积', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        rtype: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        firstTime: [
          { required: true, message: '请选择首次缴费时间', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '请选择缴费科目', trigger: 'change' }
        ],
        uname: [{ required: true, message: '请选择客户', trigger: 'change' }],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      // 资源类型列表
      typeOptions: [],
      // 缴费科目列表
      subjectOptions: [],
      // 当前用户信息数据
      currentUser: {},
      // 用户列表
      allUserList: [],
      // 没有更多数据
      nomore: false,
      // 是否显示业主变更日志
      isShowLog: false,
      // 业主变更日志表格数据
      logTableData: [],
      // 业主变更日志表格配置项
      logColumns: logTable.list,
      // 业主变更日志表格配置
      logConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否禁用入住状态开关
      swtDisabled: false,
      // 是否显示新增固定车位弹框
      showAddDialog: false,
      // 表单数据对象
      addForm: {
        name: '',
        area: '',
        type: '',
        subject: [],
      },
      // 表单验证规则
      addRules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        area: [{ required: true, message: '请输入资源面积', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '请选择缴费科目', trigger: 'change' }
        ],
      },
      // 项目备注
      villageRemark: '',
      // 房屋备注输入框获得焦点时的值
      roomFocusRemark: "",
      // 业主备注
      ownerRemark: "",
      // 是否是非机动车
      isNonvehicle: false,
      // 资源数据是否是树形结构
      rtype: 'select',
      // 是否显示修改房屋信息 弹框
      showRoomEdit: false,
      // 修改房屋信息表单数据对象
      editForm: {
        buildareas: '',
        check: '',
        remark: '',
      },
      // 修改房屋信息表单验证规则
      editRules: {
        buildareas: [{ required: true, message: '请输入建筑面积', trigger: 'blur' }],
        check: [{ required: true, message: '请选择交房状态', trigger: 'change' }],
        remark: [
          { required: false, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
    }
  },

  /**
   * 属性监听
   */
  watch: {},

  methods: {
    // 数据重置
    dataInit () {
      this.isEditVillage = false
      this.isEditBuild = false
      this.isEditOwner = false
      this.showHouseInfo = false
      this.showStallInfo = false
      this.showCarInfo = false
      this.showNoCarInfo = false
      this.showCardInfo = false
      this.villageData = false
      this.villageList = false
      this.buildData = false
      this.buildList = false
      this.roomData = false
      this.roomList = false
      this.ownerData = false
    },

    // 获取项目、楼栋、房间、业主详情数据
    getInfoData (obj, flag) {
      let url = ''
      let data = {
        id: obj.id
      }
      switch (obj.type) {
        case 'village':
          url = this.urlObj.villageInfo
          break
        case 'building':
          url = this.urlObj.buildInfo
          break
        case 'rooms':
          url = this.urlObj.roomInfo
          this.infoList = this.roomList
          break
        case 'owner':
          url = this.urlObj.ownerInfo
          data.roomid = obj.roomid
          break
      }
      this.$axios
        .post(url, data)
        .then(res => {
          this.isLoading = false
          if (res.Code === 200) {
            switch (obj.type) {
              case 'village':
                this.villageData = res.Data
                this.villageList = [
                  {
                    icon: img1,
                    value: res.Data.allacreage ? res.Data.allacreage : 0,
                    name: '总占地面积(m²)'
                  },
                  {
                    icon: img2,
                    value: res.Data.buildacreage ? res.Data.buildacreage : 0,
                    name: '总建筑面积(m²)'
                  },
                  {
                    icon: img3,
                    value: res.Data.parkingnum ? res.Data.parkingnum : 0,
                    name: '车位数量(个)'
                  },
                  {
                    icon: img4,
                    value: res.Data.useacreage ? res.Data.useacreage : 0,
                    name: '总使用面积(m²)'
                  },
                  {
                    icon: img5,
                    value: res.Data.far + '%',
                    name: '容积率'
                  },
                  {
                    icon: img6,
                    value: res.Data.greenrate + '%',
                    name: '绿化率'
                  },
                  {
                    icon: img7,
                    value: res.Data.publicareas ? res.Data.publicareas : 0,
                    name: '公共场所面积(m²)'
                  },
                  {
                    icon: img3,
                    value: res.Data.villagecarsetting[0] ? res.Data.villagecarsetting[0].num : 0,
                    name: '月租车位数量(个)'
                  },
                  {
                    icon: img8,
                    value: res.Data.house_num ? res.Data.house_num : 0,
                    name: '房屋数量(套)'
                  },
                  {
                    icon: img4,
                    value: res.Data.pay_area ? res.Data.pay_area : 0,
                    name: '交付面积(m²)'
                  },
                ]
                this.villageName =
                  res.Data.villagename + '(' + res.Data.villageaddr + ')'
                this.infoList = this.villageList
                break
              case 'building':
                this.buildData = res.Data
                this.buildList = [
                  {
                    icon: img9,
                    value: res.Data.block ? res.Data.block : '--',
                    name: '楼栋名称'
                  },
                  {
                    icon: img10,
                    value: res.Data.unitnum ? res.Data.unitnum : 0,
                    name: '单元数(个)'
                  },
                  {
                    icon: img11,
                    value: res.Data.buildingtype.buildtypename
                      ? res.Data.buildingtype.buildtypename
                      : '--',
                    name: '楼宇结构'
                  },
                  {
                    icon: img12,
                    value: res.Data.property_standard
                      ? res.Data.property_standard
                      : 0,
                    name: '物业费费率'
                  },
                  {
                    icon: img13,
                    value: res.Data.stewards
                      ? res.Data.stewards.realname
                      : '--',
                    name: '楼栋管家'
                  },
                  {
                    icon: img19,
                    value: res.Data.chargedate ? res.Data.chargedate : '--',
                    name: '交房时间'
                  }
                ]
                this.infoList = this.buildList
                break
              case 'rooms':
                let rooms =
                  res.Data.ownerrooms && res.Data.ownerrooms.length > 0
                    ? res.Data.ownerrooms
                    : []
                let arr = rooms.map(item => {
                  let obj = {
                    id: item.oid,
                    isLeaf: true,
                    label: item.owner.realname + ' - ' + item.type.name,
                    roomid: res.Data.id,
                    type: 'owner',
                    nodeid: 'owner' + item.oid
                  }
                  return obj
                })
                // 房产过户后刷新树形结构
                if (flag) {
                  let search = this.$refs.treeSearch
                  // 搜索情况
                  if (search.showSearch) {
                    search.searchHandle()
                  } else {
                    let tree = search.$refs.tree
                    let node = tree.getNode(this.currentData.nodeid)
                    node.isLeaf = false
                    node.expanded = true
                    tree.updateKeyChildren(this.currentData.nodeid, arr)
                  }
                }
                res.Data.into_house = res.Data.into_house ? true : false
                this.roomData = res.Data
                this.tableData = []
                res.Data.ownerrooms.forEach(item => {
                  let obj = {
                    id: item.id,
                    realname: item.owner.realname,
                    type: item.type.name,
                    charge_type: item.charge_type,
                    move_time: item.move_time,
                    tel: item.owner.tel,
                    idcard: item.owner.idcard
                  }
                  this.tableData.push(obj)
                })
                let sval = ''
                let scontent = ''
                if (res.Data.subject_arr && res.Data.subject_arr.length > 0) {
                  res.Data.subject_arr.forEach((item, index) => {
                    if (index === 0) {
                      sval = sval + item.price
                    } else {
                      sval = sval + '/' + item.price
                    }
                    scontent = scontent + item.name + ':' + item.price + '元/m²;'
                  })
                }
                this.roomList = [
                  {
                    icon: img14,
                    value: res.Data.roomnum ? res.Data.roomnum : '--',
                    name: '房屋全称'
                  },
                  {
                    icon: img2,
                    value: res.Data.buildareas ? res.Data.buildareas : 0,
                    name: '建筑面积(m²)',
                    type: 'input'
                  },
                  {
                    icon: img9,
                    value: res.Data.unit.building.block
                      ? res.Data.unit.building.block
                      : '--',
                    name: '楼栋号'
                  },
                  {
                    icon: img12,
                    value: sval ? sval : '--',
                    name: '费率(元/m²)',
                    content: scontent
                  },
                  {
                    icon: img15,
                    value: res.Data.check == 0 ? '未交房' : '已交房',
                    name: '房屋状态'
                  },
                  {
                    icon: img16,
                    value:
                      res.Data.isdecorate == 0
                        ? '未装修'
                        : res.Data.isdecorate == 1
                          ? '已装修'
                          : '装修中',
                    name: '装修状态'
                  },
                  {
                    icon: img18,
                    value: res.Data.renovation_endtime
                      ? res.Data.renovation_endtime
                      : '--',
                    name: '装修结束日期'
                  },
                  {
                    icon: img17,
                    value: res.Data.resourcestype
                      ? res.Data.resourcestype.name
                      : '--',
                    name: '房屋类型',
                    type: res.Data.renovation_type
                  },
                  {
                    icon: img18,
                    value: res.Data.turned
                      ? res.Data.turned
                      : res.Data.unit && res.Data.unit.building ? res.Data.unit.building.initial : '--',
                    name: '交房日期'
                  },
                  {
                    icon: img20,
                    value: res.Data.isvacancy
                      ? res.Data.isvacancy
                      : res.Data.isvacancy == 0 ? '已售' : '未售',
                    name: '销售状态'
                  }
                ]
                this.infoList = this.roomList
                break
              case 'owner':
                this.ownerData = res.Data
                this.infoList = [
                  {
                    name: '业主名',
                    value: res.Data.realname
                  },
                  {
                    name: '联系电话',
                    value: res.Data.tel
                  },
                  {
                    name: '身份证号',
                    value: res.Data.idcard
                  },
                  {
                    name: '绑定房产(套)',
                    value: res.Data.owner_rooms.length
                  },
                  {
                    name: '绑定车位(个)',
                    value: res.Data.car.length
                  },
                  {
                    name: '绑定月租车(辆)',
                    value: res.Data.carmonth.length
                  },
                  {
                    name: '绑定非机动车(辆)',
                    value: res.Data.carnonmotor.length
                  }
                ]
                break
            }
          } else {
            this.$message({
              type: 'error',
              message: '数据获取失败！'
            })
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    // 房产过户后重新获取详情数据
    getRoomData () {
      this.getInfoData({ type: 'rooms', id: this.roomData.id }, true)
    },

    // 设置当前车位数量
    setNumber (num) {
      this.stallNum = num
      this.isLoading = false
    },

    // 树形搜索组件选择改变处理
    checkChange (obj) {
      if (
        !(
          this.currentData.id &&
          this.currentData.id == obj.id &&
          this.currentData.type == obj.type
        )
      ) {
        this.isLoading = true
        // 重置一次数据
        this.dataInit()
        this.currentData = obj
        switch (obj.type) {
          case 'parking':
            this.isLoading = obj.loading
            this.stallNum = obj.number
            break
          case 'type':
            this.isLoading = obj.loading
            this.stallNum = obj.children.length
            break
          case 'monthpark':
            this.isLoading = obj.loading
            this.stallNum = obj.number
            break
          case 'monthitem':
            this.isLoading = obj.loading
            this.stallNum = obj.number
            break
          case 'inside':
            this.isLoading = obj.loading
            this.stallNum = obj.number
            break
          case 'novehicle':
            this.isLoading = obj.loading
            this.stallNum = obj.number
            break
          case 'other':
            this.isLoading = obj.loading
            this.stallNum = obj.number
            break
          case 'car':
            this.$nextTick(() => {
              if (this.$refs.stallDetail) {
                this.$refs.stallDetail.init(obj)
              }
            })
            break
          case 'carmonth':
            this.$nextTick(() => {
              if (this.$refs.stallDetail) {
                this.$refs.stallDetail.init(obj)
              }
            })
            break
          case 'insideitem':
            this.$nextTick(() => {
              if (this.$refs.stallDetail) {
                this.$refs.stallDetail.init(obj)
              }
            })
            break
          case 'car_nonmotor':
            this.$nextTick(() => {
              if (this.$refs.stallDetail) {
                this.$refs.stallDetail.init(obj)
              }
            })
            break
          case 'lastvirtual':
            this.$nextTick(() => {
              if (this.$refs.stallDetail) {
                this.$refs.stallDetail.init(obj)
              }
            })
            break
          default:
            this.getInfoData(obj)
        }
      }
    },

    // 点击修改项目处理
    villageEdit () {
      this.villageRemark = this.villageData.remarks
      this.isEditVillage = true
    },

    // 项目编辑确认
    villageEditConfirm () {
      let form = this.$refs.villageEdit.$refs.ruleForm
      let formData = this.$refs.villageEdit.ruleForm
      form.validate(valid => {
        if (valid) {
          let data = {
            id: this.villageData.id,
            city_id: this.villageData.city_id,
            villagename: formData.vname,
            villageaddr: formData.vaddr,
            allacreage: formData.area,
            buildacreage: formData.barea,
            parkingnum: formData.pnum,
            useacreage: formData.uarea,
            far: formData.far,
            greenrate: formData.greenrate,
            publicareas: formData.public,
            carmonth_num: formData.mnum,
            house_num: formData.hnum,
            pay_area: formData.payArea,
            remarks: this.villageRemark
          }
          this.editCommit(data, 'village')
        }
      })
    },

    // 修改提交处理
    editCommit (data, type) {
      this.isCommit = true
      let url = ''
      switch (type) {
        case 'village':
          url = this.urlObj.villageEdit
          break
        case 'building':
          url = this.urlObj.buildEdit
          break
        case 'owner':
          url = this.urlObj.ownerEdit
          break
      }
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            let msg = ''
            switch (type) {
              case 'village':
                this.isEditVillage = false
                msg = '项目信息修改成功！'
                let obj = JSON.parse(JSON.stringify(this.currentData))
                obj.label = data.villagename
                this.nodeUpdate(obj)
                break
              case 'building':
                this.isEditBuild = false
                msg = '楼栋信息修改成功！'
                break
              case 'owner':
                this.isEditOwner = false
                msg = '业主信息修改成功！'
                break
            }
            this.$message({
              type: 'success',
              message: msg
            })
            // 重新获取一次数据
            this.getInfoData(this.currentData)
          } else {
            let msg = res.Message ? res.Message : '数据提交失败！'
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
            message: '数据提交失败！'
          })
          this.isCommit = false
        })
    },

    // 点击修改楼栋按钮处理
    buildEdit () {
      this.isEditBuild = true
    },

    // 楼栋编辑确认
    buildEditConfirm () {
      let form = this.$refs.bulidEdit.$refs.ruleForm
      let formData = this.$refs.bulidEdit.ruleForm
      form.validate(valid => {
        if (valid) {
          let data = {
            id: this.buildData.id,
            block: formData.bname,
            buildareas: formData.barea,
            useareas: formData.uarea,
            greenareas: formData.greenrate,
            buildstructure: formData.type
          }
          this.editCommit(data, 'building')
        }
      })
    },

    // 入住状态改变处理
    checkinChange (value) {
      this.swtDisabled = true
      let data = {
        id: this.currentData.id,
        into_house: value ? 1 : 0
      }
      this.$axios
        .post(this.urlObj.setintohouse, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '入住状态修改成功！'
            })
          } else {
            let msg = res.Message ? res.Message : '入住状态修改失败！'
            this.$message({
              type: 'error',
              message: msg
            })
            this.roomData.into_house = !value
          }
          this.swtDisabled = false
        })
        .catch(() => {
          this.roomData.into_house = !value
          this.swtDisabled = false
        })
    },

    // 修改房屋面积
    roomAreaChange (obj) {
      let data = {
        id: this.currentData.id,
        buildareas: obj.value
      }
      this.$axios
        .post(this.urlObj.editrooms, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '房屋面积修改成功！'
            })
          } else {
            let msg = res.Message ? res.Message : '房屋面积修改失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 点击修改房屋信息按钮
    showEditDialog () {
      this.editForm = {
        id: this.currentData.id,
        buildareas: this.roomData.buildareas,
        check: this.roomData.check,
        remark: this.roomData.remark,
      }
      this.showRoomEdit = true
    },

    // 修改房屋信息
    editSubmit () {
      let form = this.$refs.editForm
      form.validate(valid => {
        if (valid) {
          this.isCommit = true
          this.$axios
            .post(this.urlObj.editrooms, this.editForm)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '房屋信息修改成功！'
                })
                // 重新获取一次数据
                this.getInfoData(this.currentData)
                this.showRoomEdit = false
              } else {
                let msg = res.Message ? res.Message : '房屋信息修改失败！'
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

    // 点击修改业主处理
    ownerEdit () {
      this.ownerRemark = this.ownerData.remark
      this.isEditOwner = true
    },

    // 业主编辑确认
    ownerEditConform () {
      let form = this.$refs.ownerEdit.$refs.ruleForm
      let formData = this.$refs.ownerEdit.ruleForm
      form.validate(valid => {
        if (valid) {
          let data = {
            id: this.ownerData.id,
            roomid: this.currentData.roomid,
            sex: formData.sex,
            idcard: formData.idcard,
            type_id: formData.otype,
            tel: formData.tel,
            charge_type: formData.charge,
            remark: this.ownerRemark
          }
          this.editCommit(data, 'owner')
        }
      })
    },

    // 点击新增客户、房产过户、变更日志按钮处理
    dialogShow (type) {
      this.dialogType = type
      this.showDialog = true
    },

    // 关闭弹框处理
    dialogClose () {
      this.showDialog = false
    },

    // 设置客户是否开启计费
    chargeChange (obj) {
      // 计费状态改变请求
      let data = {
        id: this.tableData[obj.index].id,
        charge_type: obj.value
      }
      this.$axios
        .post(this.urlObj.charge, data)
        .then(res => {
          if (res.Code === 200) {
            let u_name = this.tableData[obj.index].realname
            this.$message({
              type: 'success',
              message: obj.value
                ? `客户${u_name}计费已开启！`
                : `客户${u_name}计费已关闭！`
            })
            // 重新获取数据
            this.getInfoData(this.currentData)
            this.$set(this.tableData[obj.index], obj.col_name, obj.value)
          } else {
            let msg = res.Message
              ? res.Message
              : obj.value
                ? '计费开启失败！'
                : '计费关闭失败'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 客户迁出处理
    emigration (index) {
      // 弹出迁出提示弹框
      this.$confirm('确定要迁出当前客户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.roomData.ownerrooms[index].id
        }
        this.$axios
          .post(this.urlObj.emigration, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '客户迁出成功！'
              })
              // 重新获取一次数据
              this.getInfoData({ type: 'rooms', id: this.roomData.id })
            } else {
              let msg = res.Message ? res.Message : '客户迁出失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },

    // 获取批量修改表格数据
    getBatchTable () {
      this.batchConf.loadStatus = true
      let data = {
        page: this.batchConf.curPage,
        limit: this.batchConf.limit,
        vid: this.currentData.vid
      }
      // 获取批量修改表格数据
      this.$axios
        .post(this.urlObj.batchTable, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach(item => {
              let plates = []
              item.carmotor.forEach(itm => {
                plates.push(itm.plates)
              })
              item.plates = plates.join('、')
            })
            this.batchTableData = res.Data.data
            this.batchConf.dataTotal = res.Data.total
            // 清空空数据提示
            this.batchConf.emptyText = ''
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
            this.batchTableData = []
            this.batchConf.emptyText = res.Message
            this.batchConf.dataTotal = 0
          }
          this.batchConf.loadStatus = false
        })
        .catch(err => {
          // 服务器连接失败
          this.batchTableData = []
          this.batchConf.emptyText = '服务器连接失败...'
          this.batchConf.dataTotal = 0
          this.batchConf.loadStatus = false
        })
    },

    // 获取下发失败记录表格数据
    getIssueTable () {
      // 获取下发失败记录表格数据
      this.issueConf.loadStatus = true
      let data = {
        page: this.issueConf.curPage,
        limit: this.issueConf.limit,
        vid: this.currentData.vid
      }

      let url = this.isNonvehicle ? this.urlObj.issuefaillist : this.urlObj.issueTable

      this.issueColumns = this.isNonvehicle ? vehicleIssue.list : issueColumns.list

      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            // 非机动车下发失败记录
            if (this.isNonvehicle) {
              res.Data.data.forEach(item => {
                item.uname = item.owner ? item.owner.realname : ''
                item.utel = item.owner ? item.owner.tel : ''
                item.cname = item.creator && item.creator.realname ? item.creator.realname : ''
                item.gate_name = item.gate && item.gate.name ? item.gate.name : ''
                arr.push(item)
              })
            } else {
              res.Data.data.forEach(item => {
                let plates = []
                item.car_data.carmotor.forEach(itm => {
                  plates.push(itm.plates)
                })
                let obj = {
                  id: item.id,
                  non_owner_name: item.car_data.non_owner_name,
                  non_owner_tel: item.car_data.non_owner_tel,
                  plates: plates.join('、'),
                  msg: item.msg,
                  creater: item.creater.realname,
                  create_time: item.create_time
                }
                arr.push(obj)
              })
            }
            this.issueTableData = arr
            this.issueConf.dataTotal = res.Data.total
            // 清空空数据提示
            this.issueConf.emptyText = ''
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
            this.issueTableData = []
            this.issueConf.emptyText = res.Message
            this.issueConf.dataTotal = 0
          }
          this.issueConf.loadStatus = false
        })
        .catch(err => {
          // 服务器连接失败
          this.issueTableData = []
          this.issueConf.emptyText = '服务器连接失败...'
          this.issueConf.dataTotal = 0
          this.issueConf.loadStatus = false
        })
    },

    // 点击批量修改按钮处理
    batchEdit () {
      this.showBatchDialog = true
      this.getBatchTable()
    },

    // 新增固定车位
    addParking () {
      // 表单验证重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.typeOptions = []
      this.subjectOptions = []
      this.showAddDialog = true
      this.getResourceType('carfixed')
    },

    // 资源类型选择更改处理
    typeChange (val) {
      this.subjectOptions = []
      this.addForm.subject = []
      if (val) {
        this.getSubjectofType()
      }
    },

    // 获取车位类型下的缴费科目
    getSubjectofType () {
      let data = {
        vid: this.currentData.vid,
        resource_type_id: this.addForm.type
      }
      this.$axios
        .post(this.urlObj.subjectbytype, data)
        .then(res => {
          if (res.Code === 200) {
            this.subjectOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '缴费科目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '缴费科目数据获取失败！'
          })
        })
    },

    // 固定车位新增确认
    addSubmit () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 提交数据
          let data = {
            vid: this.currentData.vid,
            sort: this.addForm.name,
            resources_type_id: this.addForm.type,
            area: this.addForm.area,
            subject_village_arr: this.addForm.subject
          }
          this.$axios
            .post(this.urlObj.addfixcar, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '固定车位添加成功！'
                })
                this.showAddDialog = false
                let node = this.$refs.treeSearch.$refs.tree.getNode(
                  this.currentData.nodeid
                )
                node.loaded = false
                node.expand()
              } else {
                let msg = res.Message ? res.Message : '固定车位添加失败！'
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

    // 点击下发失败记录按钮处理
    issueRecord () {
      this.tableSelected = []
      this.showIssueDialog = true
      this.issueConf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.isNonvehicle = this.currentData.type == "novehicle" ? true : false
      this.getIssueTable()
    },

    // 设置表格每页页码数
    issueSizeChange (num) {
      this.issueConf.limit = num
      // 获取一次表格数据
      this.getIssueTable()
    },

    // 设置当前在哪页
    issueCurrentChange (num) {
      this.issueConf.curPage = num
      // 获取一次表格数据
      this.getIssueTable()
    },

    // 设置表格每页页码数
    batchSizeChange (num) {
      this.batchConf.limit = num
      // 获取一次表格数据
      this.getBatchTable()
    },

    // 设置当前在哪页
    batchCurrentChange (num) {
      this.batchConf.curPage = num
      // 获取一次表格数据
      this.getBatchTable()
    },

    // 点击批量下发按钮处理
    batchIssue () {
      // 弹出提示弹框
      this.$confirm('确定要重新下发选中的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        let url = ''
        if (this.isNonvehicle) {
          data.iifid = this.tableSelected.map(item => item.id)
          url = this.urlObj.nonissuefail
        } else {
          data.ids = this.tableSelected.map(item => item.id)
          url = this.urlObj.issueAgain
        }
        this.$axios
          .post(url, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '批量下发成功！'
              })
              // 关闭弹框
              this.showIssueDialog = false
            } else {
              let msg = res.Message ? res.Message : '批量下发失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },

    // 下发失败表格选择改变处理
    selectionChange (arr) {
      this.tableSelected = arr
    },

    // 批量修改表格选择改变处理
    editSelectionChange (arr) {
      this.editSelected = arr
    },

    // 点击批量延期按钮处理
    batchDelay () {
      this.dateVal = ''
      this.showTimeDialog = true
    },

    // 确认延期处理
    confirm () {
      if (this.dateVal) {
        let data = {
          ids: this.editSelected.map(item => item.id),
          endtime: this.dateVal / 1000
        }
        this.$axios
          .post(this.urlObj.delayTime, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '延长到期时间成功！'
              })
              // 关闭弹框
              this.showTimeDialog = false
              this.showBatchDialog = false
            } else {
              let msg = res.Message ? res.Message : '延长到期时间失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择到期时间！'
        })
      }
    },

    // 添加虚拟资源
    addOther () {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.typeOptions = []
      this.subjectOptions = []
      this.currentUser = {}
      this.allUserList = []
      this.nomore = false
      this.showOtherDialog = true
      this.getSubjects()
      // this.getResourceType('virtual')
      this.getResourceTypeTree()
    },

    // 获取缴费科目
    getSubjects () {
      this.$axios
        .post(this.urlObj.subjectList, { vid: this.currentData.vid })
        .then(res => {
          if (res.Code === 200) {
            this.subjectOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '缴费科目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '缴费科目数据获取失败！'
          })
        })
    },

    // 获取资源类型列表
    getResourceType (type) {
      this.$axios
        .post(this.urlObj.carType, { type: type })
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '资源类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '资源类型数据获取失败！'
          })
        })
    },

    // 获取资源类型 树形数据
    getResourceTypeTree () {
      this.$axios
        .post(this.urlObj.virtualtypetree)
        .then(res => {
          if (res.Code === 200) {
            this.rtype = res.Data.type
            this.typeOptions = res.Data && res.Data.data ? res.Data.data : []
          } else {
            let msg = res.Message ? res.Message : '资源类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '资源类型数据获取失败！'
          })
        })
    },

    // 搜索获取过户业主数据
    async querySearchAsync (queryStr, cb) {
      let value = {
        keywords: queryStr,
        page: 1,
        limit: 20,
        vid: this.currentData.vid
      }
      let res = await this.$axios.post(this.urlObj.userSearch, value)
      if (res.Code === 200) {
        let first = {
          id: 0,
          realname: '姓名',
          sex: '性别',
          tel: '电话号码'
        }
        res.Data.data.unshift(first)
        this.allUserList = res.Data.data
        this.nomore = false
        cb(res.Data.data)
      } else {
        this.$refs.searchInput.$children[0].blur()
      }
    },

    // 加载更多用户数据
    async loadMore () {
      if (!this.nomore) {
        let value = {
          keywords: this.ruleForm.uname,
          page: Math.ceil(this.allUserList.length / 20) + 1,
          limit: 20
        }
        let res = await this.$axios.post(
          this.$api.state.Means.userSearch.url,
          value
        )
        if (res.Code === 200) {
          if (res.Data.data.length > 0) {
            this.allUserList = this.allUserList.concat(res.Data.data)
            this.$refs.searchInput.suggestions = this.allUserList
          } else {
            this.nomore = true
          }
        }
      }
    },

    // 选择用户处理
    handleSelect (user) {
      this.currentUser = user
      this.ruleForm.uname = user.realname
    },

    // 搜索框失去焦点处理
    autoBlur () {
      this.ruleForm.uname = this.currentUser.realname
    },

    // 添加虚拟资源提交
    formSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          // 提交数据
          let data = {
            vid: this.currentData.vid,
            name: this.ruleForm.name,
            oid: this.currentUser.id,
            area: this.ruleForm.area,
            turned: this.ruleForm.firstTime / 1000,
            bz: this.ruleForm.remark,
            subject_village_arr: this.ruleForm.subject
          }
          if (this.rtype == 'select') {
            data.resources_type_id = this.ruleForm.type
          } else {
            data.resources_type_id = this.ruleForm.rtype[this.ruleForm.rtype.length - 1]
          }
          this.$axios
            .post(this.urlObj.virtualAdd, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '虚拟资源添加成功！'
                })
                this.showOtherDialog = false
                let node = this.$refs.treeSearch.$refs.tree.getNode(
                  this.currentData.nodeid
                )
                node.loaded = false
                node.expand()
              } else {
                let msg = res.Message ? res.Message : '添加虚拟资源失败！'
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

    // 查看业主信息变更日志
    showWonerLog () {
      this.isShowLog = true
      this.getLogTableData()
    },

    // 获取日志表格数据
    getLogTableData () {
      // 表格处于加载状态
      this.logConf.loadStatus = true
      let data = {
        page: this.logConf.curPage,
        limit: this.logConf.limit,
        id: this.ownerData.id,
        type: 'owner'
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.logData, data)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            res.Data.data.forEach(item => {
              let obj = {
                createuser: item.createuser ? item.createuser.realname : '',
                create_time: item.create_time,
                content: item.content
              }
              arr.push(obj)
            })
            // 存放查询数据
            this.logTableData = arr
            // 关闭加载状态
            this.logConf.loadStatus = false
            // 清空空数据提示
            this.logConf.emptyText = ''
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
            this.logTableData = []
            this.logConf.emptyText = res.Message
            this.logConf.dataTotal = 0
            this.logConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.logTableData = []
          this.logConf.emptyText = '服务器连接失败...'
          this.logConf.dataTotal = 0
          this.logConf.loadStatus = false
        })
    },

    // 表格每页条数改变处理
    logSizeChange (num) {
      this.logConf.limit = num
      // 获取一次表格数据
      this.getLogTableData()
    },

    // 当前页码改变处理
    logCurrentChange (num) {
      this.logConf.curPage = num
      // 获取一次表格数据
      this.getLogTableData()
    },

    // 内部车辆删除成功处理
    delSuccess () {
      this.$refs.treeSearch.delNode(this.currentData)
      this.currentData = ''
    },

    // 节点数据更新
    nodeUpdate (data) {
      this.$refs.treeSearch.nodeUpdate(this.currentData, data)
    },
  }
}
