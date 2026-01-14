// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

export default {
  name: 'apportion',
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
          label: '欠费时长统计表',
          name: 'count',
          tableData: [],
          columns: '',
          static: false
        },
        {
          label: '欠费时长明细表',
          name: 'info',
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
        subject_ids: obj.subject,
        end_time: obj.endTime,
        pay_stime: obj.stime,
        pay_etime: obj.etime,
        bid_ids: obj.build,
        unit_ids: obj.unit,
        year_num: obj.yearNum,
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
