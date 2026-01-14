// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 汇总表 json 文件
import advanceSummary from '@/assets/report/json/advance-summary.json'
// 导入 客户明细表 json 文件
import advanceClient from '@/assets/report/json/advance-client.json'
// 导入 订单明细表 json 文件
import advanceOrder from '@/assets/report/json/advance-order.json'

export default {
  name: 'addvanceDeposites',
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
          label: '预存款汇总表',
          name: 'count',
          tableData: [],
          columns: advanceSummary.list,
          static: true
        },
        {
          label: '客户明细表',
          name: 'owner_info',
          tableData: [],
          columns: advanceClient.list,
          static: true
        },
        {
          label: '订单明细表',
          name: 'order_info',
          tableData: [],
          columns: advanceOrder.list,
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
        start_time: obj.stime,
        end_time: obj.etime
      }
      if (obj.village && obj.village.length > 0) {
        this.filterObj.vids = obj.village
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
