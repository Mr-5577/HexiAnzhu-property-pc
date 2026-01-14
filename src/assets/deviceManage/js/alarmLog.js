import deviceColumns from '../json/device-alarmLog-columns.json'
import workIcon from '@/components/common/workIcon.vue'
let id = 0;
export default {
  name: 'alarmLog',
  components:{
    workIcon
  },
  data () {
    return {
      urlObj: {
        applist: this.$api.state.Application.applist.url,
        category: this.$api.state.DeviceManage.category.url,
        equipments: this.$api.state.DeviceManage.equipments.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 设备类型
      deviceType: '',
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: deviceColumns.list,
      s_time:'',
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
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
      this.deviceType = ''
      this.searchVal = ''
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

    // 合同类型数据加载
    lazyLoad (node, resolve) {
      this.$axios
        .post(this.urlObj.category, { pid: node.value })
        .then(res => {
          if (res.Code === 200) {
            resolve(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取设备类型数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        category: this.deviceType[this.deviceType.length - 1],
        keywords: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.equipments, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.list.forEach(item => {
              item.statusColor = item.status == 1 ? '#333' : '#999'
            })
            this.conf.dataTotal = res.Data.count
            // 存放查询数据
            this.tableData = res.Data.list
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
  }
}
