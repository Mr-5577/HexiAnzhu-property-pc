// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'
// 导入 业主房屋统计表 json 文件
import ownerColumn from '@/assets/report/json/owner-column.json'

export default {
  name: 'ownerHouse',
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
          label: '业主及房产统计报表',
          name: 'count',
          tableData: [],
          columns: ownerColumn.list,
          static: true
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
      this.filterObj = { vids: obj.village }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
