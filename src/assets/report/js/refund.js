// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 欠费统计 json 文件
import arrearsColumn from '@/assets/report/json/arrears-column.json'
import refundDetail from '@/assets/report/json/refund-detail.json'

export default {
  name: 'refund',
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
          label: '退款统计',
          name: 'count',
          tableData: [],
          columns: arrearsColumn.list,
          static: true
        },
        {
          label: '退款明细',
          name: 'info',
          tableData: [],
          columns: refundDetail.list,
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
        type: '',
        vids: obj.village,
        starttime: obj.stime,
        endtime: obj.etime,
        subject_ids: obj.subject
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
