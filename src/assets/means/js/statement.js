import workIcon from '@/components/common/workIcon.vue'

// 导入 小区对比表 json 文件
import plotTable from '@/assets/means/json/plot-table.json'
// 导入 资源类别表 json 文件
import resourceTable from '@/assets/means/json/resource-table.json'
// 导入 房产明细表 json 文件
import houseTable from '@/assets/means/json/house-table.json'
// 导入 车位明细表 json 文件
import carportTable from '@/assets/means/json/carport-table.json'
// 导入 月租车位明细 json 文件
import monthcarTable from '@/assets/means/json/monthcar-table.json'
// 导入 客户明细表 json 文件
import clientTable from '@/assets/means/json/client-table.json'
// 导入 房源客户明细表 json 文件
import houseClientTable from '@/assets/means/json/house-client-table.json'
// 导入 非机动车位明细表 json 文件
import novehicleTable from '@/assets/means/json/novehicle-table.json'
// 导入 内部员工车辆报表 json 文件
import insideTable from '@/assets/means/json/inside-table.json'
// 导入大区、项目预选择页面
import areaVillageSelect from '@/components/common/AreaVillageSelect.vue'

export default {
  name: 'statement',
  components: {
    areaVillageSelect,
    workIcon
  },
  data () {
    return {
      // 接口对象
      urlObj: {
        villageTable: this.$api.state.Means.villageTable.url,
        resourceTable: this.$api.state.Means.resourceTable.url,
        roomTable: this.$api.state.Means.roomTable.url,
        carportTable: this.$api.state.Means.carportTable.url,
        otherTable: this.$api.state.Means.otherTable.url,
        clientTable: this.$api.state.Means.clientTable.url,
        houseClientTable: this.$api.state.Means.houseClientTable.url,
        carnonmotorlist: this.$api.state.Means.carnonmotorlist.url,
        carinsidelist: this.$api.state.Means.carinsidelist.url,
        searchBuild: this.$api.state.Public.searchBuild.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        carType: this.$api.state.Means.carType.url,
        userType: this.$api.state.Means.userType.url,
      },
      // 是否选择了项目
      isRegister: false,
      // 大区id
      aid: '',
      // 选择的项目id
      vids: [],
      // 是否正在加载表格数据
      isLoading: false,
      // 当前 tabs 名
      activeName: 'first',
      // 表格基本配置
      conf: {},
      // 是否分页
      ispaging: true,
      // 表格列表
      tableList: [],
      // 是否正在获取导出表格数据
      isExport: false,
      // 楼栋绑定值
      buildVal: "",
      buildOptions: [],
      // 单元绑定值
      unitVal: "",
      unitOptions: [],
      // 资源绑定值
      resourceVal: "",
      resourceOptions: [],
      // 状态绑定值
      statusVal: "",
      statusOptions: [],
      // 使用关系
      relationVal: "",
      relationOptions: "",
      // 关键字
      searchVal: "",
      // 开始装修日期范围
      sdtime: [],
      // 结束装修日期范围
      edtime: [],
      // 进场日期范围
      enterTime: []
    }
  },

  /**
   * 属性监听
   */
  watch: {
    activeName () {
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.buildVal = ""
      this.unitVal = ""
      this.resourceVal = ""
      this.statusVal = ""
      this.relationVal = ""
      this.searchVal = ""
      this.sdtime = []
      this.edtime = []
      this.enterTime = []
      // 获取表格数据
      this.getTableData()
      if (this.activeName == 'third') {
        this.getResources({ type: "house" })
      } else if (this.activeName == 'fourth') {
        this.getResources({ type: "carfixed" })
      } else if (this.activeName == 'five') {
        this.getResources({ type: "carmonth" })
      } else if (this.activeName == 'eight') {
        this.getResources({ type: "car_nonmotor" })
      }
    },
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
   * 方法
   */
  methods: {
    // 数据重置（初始化）
    init () {
      this.activeName = 'first'
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      this.tableList = [
        {
          label: '小区对比表',
          name: 'first',
          tableData: [],
          columns: plotTable.list
        },
        {
          label: '资源类别表',
          name: 'second',
          tableData: [],
          columns: resourceTable.list
        },
        {
          label: '房产明细表',
          name: 'third',
          tableData: [],
          columns: houseTable.list
        },
        {
          label: '车位明细表',
          name: 'fourth',
          tableData: [],
          columns: carportTable.list
        },
        {
          label: '月租车位明细表',
          name: 'five',
          tableData: [],
          columns: monthcarTable.list
        },
        {
          label: '客户明细表',
          name: 'six',
          tableData: [],
          columns: clientTable.list
        },
        {
          label: '房源客户明细表',
          name: 'seven',
          tableData: [],
          columns: houseClientTable.list
        },
        {
          label: '非机动车位明细表',
          name: 'eight',
          tableData: [],
          columns: novehicleTable.list
        },
        {
          label: '内部员工车辆报表',
          name: 'nine',
          tableData: [],
          columns: insideTable.list
        }
      ]
    },

    // 点击开始登记按钮处理
    registerPass (data) {
      this.aid = data.aid
      this.vids = data.vid
      // 数据初始化
      this.init()
      this.isRegister = true
      this.getTableData()
      this.getBuildList()
    },

    // 不同表格的数据处理后赋值
    tableDataHandle (result, index) {
      if (result.total) {
        this.ispaging = true
        this.conf.dataTotal = result.total
      } else {
        this.ispaging = false
      }
      let arr = []
      switch (this.activeName) {
        case 'first':
          result.data.forEach((item, index) => {
            item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
          })
          arr = result.data
          break
        case 'second':
          result.forEach((item, index) => {
            item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
          })
          arr = result
          break
        case 'third':
          result.data.forEach((item, index) => {
            let obj = {}
            obj.id = item.id
            obj.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            obj.villageName = item.village ? item.village.villagename : '--'
            obj.resourceType = item.resourcestype ? item.resourcestype.name : ''
            obj.roomNum = item.roomnum
            obj.fitment = item.renovation && item.renovation.length > 0 ? item.renovation[0].startime : ''
            obj.endtime = item.renovation && item.renovation.length > 0 && item.renovation[0].endtime ? item.renovation[0].endtime : ''
            obj.buildArea = item.buildareas
            obj.useArea = item.useareas
            obj.buildName = (item.unit && item.unit.building) ? item.unit.building.block : '--'
            obj.owner = ''
            obj.ownerTel = ''
            obj.approach_time = item.renovation && item.renovation.length > 0 && item.renovation[0].approach_time_str ? item.renovation[0].approach_time_str : ''
            obj.fitmentStatus =
              item.isdecorate == 0
                ? '未装修'
                : item.isdecorate == 1
                  ? '已装修'
                  : '装修中'
            obj.deliveryStatus = item.check == 0 ? '未交房' : '已交房'
            obj.houseStatus = item.into_house  == 0 ? '未入住' : '已入住'
            obj.remark = item.remark
            if (item.ownerrooms && item.ownerrooms.length) {
              item.ownerrooms.forEach(itm => {
                let oname = itm.owner && itm.owner.realname ? itm.owner.realname : ''
                let otel = itm.owner && itm.owner.tel ? itm.owner.tel : ''
                obj.owner = obj.owner
                  ? obj.owner + '、' + oname
                  : obj.owner + oname
                obj.ownerTel = obj.ownerTel
                  ? obj.ownerTel + '、' + otel
                  : obj.ownerTel + otel
              })
            } else {
              obj.owner = '--'
            }
            arr.push(obj)
          })
          break
        case 'fourth':
          result.data.forEach((item, index) => {
            let plates = []
            if (item.carmotor && item.carmotor.length > 0) {
              item.carmotor.forEach(itm => {
                plates.push(itm.plates)
              })
            }
            let obj = {}
            obj.id = item.id
            obj.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            obj.villageName = item.village.villagename
            obj.type = '车位类型'
            obj.stall = item.name ? item.name : '--'
            obj.plates = plates.length > 0 ? plates.join('、') : '--'
            obj.area = item.area
            obj.owner = item.owner ? item.owner.realname : '--'
            obj.car_tel = item.car_tel ? item.car_tel : '--'
            obj.resourceType = item.resourcestype
              ? item.resourcestype.name
              : '--'
            obj.use_date = item.use_date ? item.use_date : '--'
            obj.statusColor = item.use_date_type == 'danger' ? '#f56c6c' : item.use_date_type == 'warning' ? '#ffcb3c' : '#333'
            obj.status_text = item.use_date_type == 'danger' ? '已超期' : item.use_date_type == 'warning' ? '即将超期' : item.use_date_type == 'normal' ? '正常' : '无'
            arr.push(obj)
          })
          break
        case 'five':
          result.data.forEach((item, index) => {
            let obj = {}
            obj.id = item.id
            obj.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            obj.villageName = item.village.villagename
            obj.resourcestype = item.resourcestype.name
            obj.owner = item.owner ? item.owner.realname : '--'
            obj.resourceType = item.resourcestype.name
            obj.plates = item.carmotor.map(itm => itm.plates).join('、')
            obj.use_date = item.use_date ? item.use_date : '--'
            obj.car_tel = item.car_tel ? item.car_tel : '--'
            obj.remark = item.remark ? item.remark : '--'
            obj.statusColor = item.use_date_type == 'danger' ? '#f56c6c' : item.use_date_type == 'warning' ? '#ffcb3c' : item.use_date_type == 'stop' ? '#909399' : '#333'
            obj.status_text = item.use_date_type == 'danger' ? '已超期' : item.use_date_type == 'warning' ? '即将超期' : item.use_date_type == 'stop' ? '停用' : item.use_date_type == 'normal' ? '正常' : '无'
            arr.push(obj)
          })
          break
        case 'six':
          result.data.forEach((item, index) => {
            let obj = {}
            obj.id = item.id
            obj.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            obj.villageName = item.village.villagename
            obj.owner = item.realname
            obj.idcard = item.idcard
            obj.tel = item.tel
            obj.rooms = ''
            obj.type = ''
            obj.carports = ''
            obj.monthCar = '--'
            obj.monthNum = 0
            obj.remark = item.remark
            if (item.owner_rooms && item.owner_rooms.length > 0) {
              item.owner_rooms.forEach(itm => {
                obj.rooms = obj.rooms
                  ? obj.rooms + '/' + itm.rooms.roomnum
                  : obj.rooms + itm.rooms.roomnum
                obj.type = obj.type
                  ? obj.type + '/' + itm.type.name
                  : obj.type + itm.type.name
              })
            } else {
              obj.rooms = '--'
            }
            if (item.car && item.car.length > 0) {
              item.car.forEach(itm => {
                obj.carports = obj.carports
                  ? obj.carports + '/' + itm.sort
                  : obj.carports + itm.sort
              })
            } else {
              obj.carports = '--'
            }
            if (item.carmonth && item.carmonth.length > 0) {
              let arr = []
              item.carmonth.forEach(itm => {
                if (itm.carmotor && itm.carmotor.length > 0) {
                  itm.carmotor.forEach(i => {
                    arr.push(i.plates)
                  })
                }
              })
              obj.monthCar = arr.length > 0 ? arr.join('/') : '--'
              obj.monthNum = item.carmonth.length
            }
            arr.push(obj)
          })
          break
        case 'seven':
          result.data.forEach((item, index) => {
            item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
          })
          arr = result.data
          break
        case 'eight':
          result.data.forEach((item, index) => {
            item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            item.villageName = item.village.villagename
            item.resourcestype = item.resourcestype.name
            item.owner = item.owner.realname
          })
          arr = result.data
          break
        case 'nine':
          result.data.forEach((item, index) => {
            let plates = []
            if (item.carmotor && item.carmotor.length > 0) {
              item.carmotor.forEach(itm => {
                plates.push(itm.plates)
              })
            }
            item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            item.villageName = item.village.villagename
            item.plates = plates.length > 0 ? plates.join('、') : '--'
          })
          arr = result.data
          break
      }
      this.tableList[index].tableData = arr
    },

    // 获取表格数据
    getTableData (is_excel) {
      if (!is_excel) {
        this.isLoading = true
      } else {
        this.isExport = true
      }
      let url = ''
      let index = 0
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vids: this.vids
      }
      switch (this.activeName) {
        case 'first':
          url = this.urlObj.villageTable
          index = 0
          break
        case 'second':
          url = this.urlObj.resourceTable
          index = 1
          break
        case 'third':
          data.bid = this.buildVal
          data.resources_type_id = this.resourceVal
          data.keywords = this.searchVal
          if (this.sdtime && this.sdtime.length > 0) {
            data.renovation_starttime_start = this.sdtime[0] / 1000
            data.renovation_starttime_end = this.sdtime[1] / 1000
          }
          if (this.edtime && this.edtime.length > 0) {
            data.renovation_endtime_start = this.edtime[0] / 1000
            data.renovation_endtime_end = this.edtime[1] / 1000
          }
          if (this.enterTime && this.enterTime.length > 0) {
            data.renovation_approach_time_start = this.enterTime[0] / 1000
            data.renovation_approach_time_end = this.enterTime[1] / 1000
          }
          url = this.urlObj.roomTable
          index = 2
          break
        case 'fourth':
          data.status = this.statusVal
          data.resources_type_id = this.resourceVal
          data.keywords = this.searchVal
          url = this.urlObj.carportTable
          index = 3
          break
        case 'five':
          data.status = this.statusVal
          data.resources_type_id = this.resourceVal
          data.keywords = this.searchVal
          url = this.urlObj.otherTable
          index = 4
          break
        case 'six':
          data.keywords = this.searchVal
          url = this.urlObj.clientTable
          index = 5
          break
        case 'seven':
          data.bid = this.buildVal
          data.unit = this.unitVal
          data.type_id = this.relationVal
          data.keywords = this.searchVal
          url = this.urlObj.houseClientTable
          index = 6
          this.getUserType()
          break
        case 'eight':
          data.status = this.statusVal
          data.resources_type_id = this.resourceVal
          url = this.urlObj.carnonmotorlist
          index = 7

          break
        case 'nine':
          data.status = this.statusVal
          data.keywords = this.searchVal
          url = this.urlObj.carinsidelist
          index = 8
          break
      }
      if (is_excel) {
        data.is_excel = 1
      }
      this.$axios.post(url, data).then(res => {
        if (res.Code === 200) {
          if (is_excel) {
            this.exportExcel(res.Data)
          } else {
            this.tableDataHandle(res.Data, index)
          }
        } else {
          let msg = res.Message ? res.Message : '表格数据获取失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isLoading = false
        this.isExport = false
      })
        .catch(err => {
          if (is_excel) {
            this.$message({
              type: 'error',
              message: '报表导出失败！'
            })
          }
          this.isLoading = false
          this.isExport = false
        })
    },

    // 表格每页条数改变处理
    sizeChange (num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.getTableData()
    },

    // 当前页码改变处理
    currentChange (num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.getTableData()
    },

    /* 导出EXCEL */
    exportExcel (result) {
      let tableName = ''
      let headers = []
      let datas = []
      switch (this.activeName) {
        case 'first':
          tableName = '小区对比表'
          headers = [
            '序号',
            '小区名称',
            '占地面积',
            '建筑面积',
            '使用面积',
            '未售',
            '已售',
            '已交房',
            '未交房',
            '交房率',
            '已装修',
            '装修中',
            '未装修',
            '固定车位',
            '启用',
            '月租车位',
            '备注'
          ]
          result.forEach((item, index) => {
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.villagename,
              item.allacreage,
              item.buildacreage,
              item.useacreage,
              item.vacancy_num,
              item.no_vacancy_num,
              item.check_num,
              item.no_check_num,
              item.deliver_rate,
              item.has_isdecorate_num,
              item.in_isdecorate_num,
              item.no_isdecorate_num,
              item.car_num,
              item.car_bind_num,
              item.carmonth_num,
              item.remarks
            ]
            datas.push(arr)
          })
          break
        case 'second':
          tableName = '资源类别表'
          headers = [
            '序号',
            '小区名称',
            '资源类别',
            '资源数量',
            '建筑面积',
            '已交房',
            '未交房',
            '未装修',
            '装修中',
            '已装修'
          ]
          result.forEach((item, index) => {
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.villagename,
              item.name,
              item.resources_num,
              item.buildareas,
              item.has_check,
              item.no_check,
              item.no_isdecorate,
              item.in_isdecorate,
              item.has_isdecorate
            ]
            datas.push(arr)
          })
          break
        case 'third':
          tableName = '房产明细表'
          headers = [
            '序号',
            '小区名称',
            '资源类别',
            '房号',
            '装修开始时间',
            '装修结束时间',
            '建筑面积',
            '使用面积',
            '楼栋名称',
            '业主姓名',
            '联系电话',
            '入场时间',
            '装修状态',
            '交房状态',
            '备注'
          ]
          result.forEach((item, index) => {
            item.owner = ''
            item.ownerTel = ''
            if (item.ownerrooms && item.ownerrooms.length) {
              item.ownerrooms.forEach(itm => {
                item.owner = item.owner
                  ? item.owner + '、' + itm.owner.realname
                  : item.owner + itm.owner.realname
                item.ownerTel = item.ownerTel
                  ? item.ownerTel + '、' + itm.owner.tel
                  : item.ownerTel + itm.owner.tel
              })
            } else {
              item.owner = '--'
            }
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.village ? item.village.villagename : '',
              item.resourcestype ? item.resourcestype.name : '',
              item.roomnum,
              item.renovation && item.renovation.length > 0 ? item.renovation[0].startime : '',
              item.renovation && item.renovation.length > 0 && item.renovation[0].endtime ? item.renovation[0].endtime : '',
              item.buildareas,
              item.useareas,
              item.unit ? item.unit.building.block : '',
              item.owner,
              item.ownerTel,
              item.renovation && item.renovation.length > 0 && item.renovation[0].approach_time_str ? item.renovation[0].approach_time_str : '',
              item.isdecorate == 0
                ? '未装修'
                : item.isdecorate == 1
                  ? '已装修'
                  : '装修中',
              item.check == 0 ? '未交房' : '已交房',
              item.remark
            ]
            datas.push(arr)
          })
          break
        case 'fourth':
          tableName = '车位明细表'
          headers = [
            '序号',
            '小区名称',
            '资源类别',
            '车位id',
            '车位编号',
            '车牌号',
            '面积',
            '业主姓名',
            '联系电话',
            '车位类别',
            '周期',
            '状态'
          ]
          result.forEach((item, index) => {
            let plates = []
            if (item.carmotor && item.carmotor.length > 0) {
              item.carmotor.forEach(itm => {
                plates.push(itm.plates)
              })
            }
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.village.villagename,
              '车位类型',
              item.id,
              item.name ? item.name : '--',
              plates.length > 0 ? plates.join('、') : '--',
              item.area,
              item.owner ? item.owner.realname : '--',
              item.car_tel ? item.car_tel : '--',
              item.resourcestype ? item.resourcestype.name : '--',
              item.use_date ? item.use_date : '--',
              item.use_date_type == 'danger' ? '已超期' : item.use_date_type == 'warning' ? '即将超期' : item.use_date_type == 'normal' ? '正常' : '无'
            ]
            datas.push(arr)
          })
          break
        case 'five':
          tableName = '月租车位明细表'
          headers = ['序号', '小区名称', '资源名称', '车牌号', '所属人', '联系电话', '备注', '周期', '状态']
          result.forEach((item, index) => {
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.village.villagename,
              item.resourcestype.name,
              item.carmotor.map(itm => itm.plates).join('、'),
              item.owner ? item.owner.realname : '--',
              item.car_tel ? item.car_tel : '--',
              item.remark ? item.remark : '--',
              item.use_date ? item.use_date : '--',
              item.use_date_type == 'danger' ? '已超期' : item.use_date_type == 'warning' ? '即将超期' : item.use_date_type == 'stop' ? '停用' : item.use_date_type == 'normal' ? '正常' : '无'
            ]
            datas.push(arr)
          })
          break
        case 'six':
          tableName = '客户明细表'
          headers = [
            '序号',
            '小区名称',
            '客户姓名',
            '客户id',
            '省份证号码',
            '联系电话',
            '拥有房屋',
            '使用关系',
            '拥有车位',
            '月租车位',
            '月租车位数',
            '备注'
          ]
          result.forEach((item, index) => {
            item.rooms = ''
            item.type = ''
            item.carports = ''
            item.rooms = ''
            if (item.owner_rooms && item.owner_rooms.length > 0) {
              item.owner_rooms.forEach(itm => {
                item.rooms = item.rooms
                  ? item.rooms + '/' + itm.rooms.roomnum
                  : item.rooms + itm.rooms.roomnum
                item.type = item.type
                  ? item.type + '/' + itm.type.name
                  : item.type + itm.type.name
              })
            } else {
              item.rooms = '--'
            }
            if (item.car && item.car.length > 0) {
              item.car.forEach(itm => {
                item.carports = item.carports
                  ? item.carports + '/' + itm.sort
                  : item.carports + itm.sort
              })
            } else {
              item.carports = '--'
            }
            if (item.carmonth && item.carmonth.length > 0) {
              let arr = []
              item.carmonth.forEach(itm => {
                if (itm.carmotor && itm.carmotor.length > 0) {
                  itm.carmotor.forEach(i => {
                    arr.push(i.plates)
                  })
                }
              })
              item.monthCar = arr.length > 0 ? arr.join('/') : '--'
              item.monthNum = item.carmonth.length
            }
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.village.villagename,
              item.realname,
              item.id,
              item.idcard,
              item.tel,
              item.rooms,
              item.type,
              item.carports,
              item.monthCar,
              item.monthNum,
              item.remark
            ]
            datas.push(arr)
          })
          break
        case 'seven':
          tableName = '房源客户明细表'
          headers = [
            '序号',
            '小区名称',
            '楼栋名称',
            '房屋全称',
            '建筑面积',
            '业主姓名、电话',
            '使用关系'
          ]
          result.forEach((item, index) => {
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.villagename,
              item.building,
              item.roomnum,
              item.buildareas,
              item.username,
              item.type
            ]
            datas.push(arr)
          })
          break
        case 'eight':
          tableName = '非机动车位明细表'
          headers = ['序号', '小区名称', '资源名称', '车辆类型', '所属人']
          result.forEach((item, index) => {
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.village.villagename,
              item.resourcestype.name,
              item.type_name,
              item.owner ? item.owner.realname : '--'
            ]
            datas.push(arr)
          })
          break
        case 'nine':
          tableName = '内部员工车辆报表'
          headers = ['序号', '小区名称', '员工姓名', '联系电话', '车牌号', '使用周期']
          result.forEach((item, index) => {
            let plates = []
            if (item.carmotor && item.carmotor.length > 0) {
              item.carmotor.forEach(itm => {
                plates.push(itm.plates)
              })
            }
            let arr = [
              (this.conf.curPage - 1) * this.conf.limit + index + 1,
              item.village.villagename,
              item.non_owner_name,
              item.non_owner_tel,
              plates.length > 0 ? plates.join('、') : '--',
              item.use_date
            ]
            datas.push(arr)
          })
          break
      }
      try {
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
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    },

    // 获取楼栋数据
    getBuildList () {
      let data = {
        vids: this.vids
      }
      this.$axios
        .post(this.urlObj.searchBuild, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼栋数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 获取单元数据
    getUnitList () {
      let data = {
        bid: this.buildVal
      }
      this.$axios
        .post(this.urlObj.unitOfBuild, data)
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取单元数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => { })
    },

    // 楼栋选择更改处理
    buildChange (value) {
      if (this.activeName == 'seven') {
        this.unitVal = ''
        this.unitOptions = []
        if (value) {
          // 获取单元数据
          this.getUnitList()
        }
      }
      this.getTableData()
    },

    // 获取资源类型数据
    getResources (data) {
      this.$axios
        .post(this.urlObj.carType, data)
        .then(res => {
          if (res.Code === 200) {
            this.resourceOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '资源数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },

    // 获取使用关系数据
    getUserType () {
      this.$axios
        .post(this.urlObj.userType)
        .then(res => {
          if (res.Code === 200) {
            this.relationOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '使用关系数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => { })
    },
  }
}
