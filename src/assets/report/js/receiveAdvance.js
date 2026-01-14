// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'
import receivableDetail from '@/assets/report/json/receivable-detail.json'

export default {
  name: 'receiveAdvance',
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
          label: '预收统计',
          name: 'count',
          tableData: [],
          columns: '',
          static: false
        },
        {
          label: '预收明细',
          name: 'info',
          tableData: [],
          columns: receivableDetail.list,
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
        bid_ids: obj.build,
        unit_ids: obj.unit,
        rooms_ids: obj.room,
        subject_ids: obj.subject,
        starttime: obj.stime,
        endtime: obj.etime,
        pay_time: obj.endTime,
        pay_type: obj.payment
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
