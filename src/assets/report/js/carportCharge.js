// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 组合统计 json 文件
import carportColumn from '@/assets/report/json/carport-column.json'

export default {
  name: 'carportCharge',
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
          label: '停车场收费统计表',
          name: 'carport',
          tableData: [],
          columns: carportColumn.list,
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
        pay_type: obj.payment,
        start_time: obj.stime,
        end_time: obj.etime,
      }
      if (obj.village && obj.village.length > 0) {
        this.filterObj.vids = obj.village
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
