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
          label: '含税统计表',
          name: 'normal',
          tableData: [],
          columns: '',
          static: false
        },
        {
          label: '不含税统计表',
          name: 'ex_tax',
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
        pay_type: obj.payment,
        subject_ids: obj.subject,
        smonth: obj.stime,
        emonth: obj.etime
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
