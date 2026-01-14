// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 押金汇总表 json 文件
import depositSummary from '@/assets/report/json/deposit-summary.json'
// 导入 客户明细表 json 文件
import depositClient from '@/assets/report/json/deposit-client.json'
// 导入 订单明细表 json 文件
import depositOrder from '@/assets/report/json/deposit-order.json'

export default {
  name: 'deposit',
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
          label: '押金汇总表',
          name: 'count',
          tableData: [],
          columns: depositSummary.list,
          static: true
        },
        {
          label: '客户明细表',
          name: 'owner_info',
          tableData: [],
          columns: depositClient.list,
          static: true
        },
        {
          label: '订单明细表',
          name: 'order_info',
          tableData: [],
          columns: depositOrder.list,
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
