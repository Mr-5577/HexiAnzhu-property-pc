import workIcon from '@/components/common/workIcon.vue'
// 导入 计费管理 组件
import billManageColumns from '../json/bill-manage-columns.json'


export default {
  name: 'billManage',
  components: {
    workIcon
  },
  data () {
    return {
      urlObj: {
        villageend: this.$api.state.Charge.villageend.url,
        coststatistics: this.$api.state.Report.coststatistics.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 科目下拉框绑定值
      subjectVal: [],
      // 科目数据列表
      subOptions: [],
      // 日期选择框绑定值
      dateValue: [],
      // 划账弹框表格数据
      tableData: [],
      // 划账弹框表格列数据配置
      columns: billManageColumns.list,
      // 划账弹框表格配置
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
   * 计算属性
   */
  computed: {
    vid () {
      return this.$store.state.vid
    }
  },

  /**
   * 生命周期
   */
  created () {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.getSubjectList()
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
      this.subjectVal = []
      this.subOptions = []
      this.dateValue = []
      // 请求接口获取表单数据
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 请求接口获取表单数据
      this.tableLoad()
      this.getSubjectList()
    },

    // 获取科目列表数据
    getSubjectList () {
      let data = {
        vid: this.choseVillageInfo.vid
      }
      this.$axios
        .post(this.urlObj.villageend, data)
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

    // 表格数据加载
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.vid,
        subject_ids: this.subjectVal,
        starttime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        endtime:
          this.dateValue && this.dateValue[1] ? this.dateValue[1] / 1000 : '',
        is_excel: 0,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.coststatistics, data)
        .then(res => {
          if (res.Code === 200) {
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

    /* 导出EXCEL */
    exportExcel () {
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.vid,
        subject_ids: this.subjectVal,
        starttime:
          this.dateValue && this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        endtime:
          this.dateValue && this.dateValue[1] ? this.dateValue[1] / 1000 : '',
        is_excel: 1
      }
      this.$axios.post(this.urlObj.coststatistics, data).then(res => {
        if (res.Code === 200) {
          let arr = res.Data && res.Data.length > 0 ? res.Data : []
          this.exportDataHandle(arr)
        } else {
          let msg = res.Message ? res.Message : '订单列表数据获取失败！'
          $message({
            type: 'error',
            message: msg
          })
        }
      })
    },

    // 导出数据处理
    exportDataHandle (result) {
      try {
        require.ensure([], () => {
          // 引入excel.js
          let {
            export_json_to_excel
          } = require('@/assets/common/excel/Export2Excel')

          let header = [
            '资源名称',
            '客户姓名',
            '计费科目',
            '金额',
            '费用描述',
            '状态',
            '应收日期',
            '备注',
            '计费方式',
            '计费人'
          ]

          // 整理需要导出的数据
          let datas = []
          result.forEach(item => {
            let arr = [
              item.model_text,
              item.realname,
              item.subject_text,
              item.money,
              item.describe,
              item.status_text,
              item.ymonth,
              item.remarks,
              item.formula_text,
              item.operator_text
            ]
            datas.push(arr)
          })

          // 执行导出操作
          export_json_to_excel(header, datas, '计费管理报表')
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
    }
  }
}
