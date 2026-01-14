// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

export default {
  name: 'taxReturns',
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
          label: '当期纳税计算表',
          name: 'count',
          tableData: [],
          columns: [],
          static: true
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
        vids: obj.village,
        subject_ids: obj.subject,
        smonth: obj.stime,
        emonth: obj.etime
      }
      if (obj.village && obj.village.length > 0) {
        this.filterObj.vids = obj.village
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
