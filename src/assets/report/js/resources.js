// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'
// 导入 小区对比表 json 文件
import plotTable from '@/assets/means/json/plot-table.json'
// 导入 资源类别表 json 文件
import resourceTable from '@/assets/means/json/resource-table.json'
// 导入 房产明细表 json 文件
import houseTable from '@/assets/means/json/house-table.json'

export default {
  name: 'resources',
  components: {
    Preselect,
    Tables
  },

  data() {
    return {
      // 是否显示条件筛选页面
      showFilter: true,
      // 当前筛选条件数据
      filterObj: {},
      filterText: {},
      // 表格列表
      tableList: [
        {
          label: '实收统计',
          name: 'first',
          tableData: [],
          columns: plotTable.list
        },
        {
          label: '实收明细',
          name: 'second',
          tableData: [],
          columns: resourceTable.list
        },
        {
          label: '科目汇总',
          name: 'third',
          tableData: [],
          columns: houseTable.list
        }
      ]
    }
  },

  /**
   * 生命周期
   */
  mounted() {},

  /**
   * 方法
   */
  methods: {
    // 验证成功处理
    verifySuccess(obj) {
      this.filterObj = obj
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
