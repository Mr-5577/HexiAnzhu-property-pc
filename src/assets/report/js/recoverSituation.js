// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 欠费收回统计表 json 文件
import recoverCount from '@/assets/report/json/recover-count.json'
// 导入 欠费收回明细表 json 文件
import recoverInfo from '@/assets/report/json/recover-info.json'

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
          label: '收回情况统计表',
          name: 'count',
          tableData: [],
          columns: recoverCount.list,
          static: true
        },
        {
          label: '收回情况明细表',
          name: 'info',
          tableData: [],
          columns: recoverInfo.list,
          static: true
        },
        {
          label: '收回情况分析表',
          name: 'analysis',
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
        smonth: obj.stime,
        emonth: obj.etime,
        pay_stime: obj.sstime,
        pay_etime: obj.setime,
        bid_ids: obj.build,
        unit_ids: obj.unit,
        year_num: obj.yearNum,
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
