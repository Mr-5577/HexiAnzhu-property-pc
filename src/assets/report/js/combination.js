// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue'
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue'

// 导入 组合统计 json 文件
import combinationColumn from '@/assets/report/json/combination-column.json'
// 导入 资源明细 json 文件
import combinationDetail from '@/assets/report/json/combination-detail.json'
// 导入 科目汇总 json 文件
import combinationSubject from '@/assets/report/json/combination-subject.json'

export default {
  name: 'combination',
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
          label: '组合统计',
          name: 'count',
          tableData: [],
          columns: combinationColumn.list,
          static: true
        },
        {
          label: '资源明细',
          name: 'info',
          tableData: [],
          columns: combinationDetail.list,
          static: true
        },
        {
          label: '科目汇总',
          name: 'subject',
          tableData: [],
          columns: combinationSubject.list,
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
        pay_type: obj.payment,
        subject_ids: obj.subject,
        ys_starttime: obj.stime,
        ys_endtime: obj.etime,
        ss_starttime: obj.sstime,
        ss_endtime: obj.setime,
        model: obj.pattern,
        check: obj.check,
      }
      this.filterText = obj.filterText
      this.showFilter = false
    }
  }
}
