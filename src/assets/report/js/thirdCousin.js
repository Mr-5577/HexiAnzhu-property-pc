// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 三表明细 json 文件
import thirdDetail from '@/assets/report/json/third-detail.json'

export default {
  name: 'thirdCousin',
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
          label: '三表抄表统计',
          name: 'count',
          tableData: [],
          columns: '',
          static: false
        },
        {
          label: '三表抄表明细',
          name: 'info',
          tableData: [],
          columns: thirdDetail.list,
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
        subject_ids: obj.subject,
        starttime: obj.stime,
        endtime: obj.etime
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
