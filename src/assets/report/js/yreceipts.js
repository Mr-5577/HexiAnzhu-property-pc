// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'
// 导入 实收统计 json 文件
import yreceiptsStatistics from '@/assets/report/json/yreceipts-statistics.json'
import sreceiptsInfo from '@/assets/report/json/sreceipts-info.json'

export default {
  name: 'yreceipts',
  components: {
    Preselect,
    Tables
  },

  data () {
    return {
      // 是否显示条件筛选页面
      showFilter: true,
      // 当前筛选条件数据
      filterObj: {},
      filterText: {},
      // 表格列表
      tableList: [
        {
          label: '应收统计',
          name: 'count',
          tableData: [],
          columns: yreceiptsStatistics.list,
          static: true
        },
        {
          label: '应收明细',
          name: 'info',
          tableData: [],
          columns: sreceiptsInfo.list,
          static: true
        },
        {
          label: '科目汇总',
          name: 'subject',
          tableData: [],
          columns: '',
          static: false
        }
      ]
    }
  },

  /**
   * 生命周期
   */
  mounted () { },

  /**
   * 方法
   */
  methods: {
    // 验证成功处理
    verifySuccess (obj) {
      this.filterObj = {
        type: '',
        vids: obj.village,
        bid_ids: obj.build,
        unit_ids: obj.unit,
        rooms_ids: obj.room,
        subject_ids: obj.subject,
        starttime: obj.stime,
        endtime: obj.etime
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
