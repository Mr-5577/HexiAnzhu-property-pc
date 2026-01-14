// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 现金台账明细 json 文件
import standingDetail from '@/assets/report/json/standing-detail.json'
// 导入 科目组合数据 json 文件
import standingComb from '@/assets/report/json/standing-comb.json'

export default {
  name: 'standing',
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
          label: '现金台账统计',
          name: 'count',
          tableData: [],
          columns: '',
          static: false
        },
        {
          label: '现金台账明细',
          name: 'info',
          tableData: [],
          columns: standingDetail.list,
          static: true
        },
        {
          label: '收费科目组合',
          name: 'subject_pay',
          tableData: [],
          columns: standingComb.list,
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
        endtime: obj.etime
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
