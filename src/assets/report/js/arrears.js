// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 欠费统计 json 文件
import arrearsColumn from '@/assets/report/json/arrears-column.json'
// 导入 物业欠费统计 json 文件
import arrearsWgf from '@/assets/report/json/arrears-wgf.json'
import arrearsInfo from '@/assets/report/json/arrears-info.json'

export default {
  name: 'arrears',
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
          label: '欠费统计',
          name: 'count',
          tableData: [],
          columns: arrearsColumn.list,
          static: true
        },
        {
          label: '欠费明细',
          name: 'info',
          tableData: [],
          columns: arrearsInfo.list,
          static: true
        },
        {
          label: '科目汇总',
          name: 'subject',
          tableData: [],
          columns: '',
          static: false
        },
        {
          label: '物业欠费统计',
          name: 'wg_count',
          tableData: [],
          columns: arrearsWgf.list,
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
        pay_time: obj.endTime
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
