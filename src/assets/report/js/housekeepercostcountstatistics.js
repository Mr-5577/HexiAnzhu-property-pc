// 楼栋管家统计表

// 导入 条件筛选 组件
import Preselect from '@/components/report/common/Preselect.vue';
// 导入 报表组件 组件
import Tables from '@/components/report/common/Tables.vue';

export default {
  name: 'apportion',
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
          label: '楼栋管家统计表',
          name: 'count',
          tableData: [],
          columns: '',
          static: false
        },
      ]
    }
  },

  /**
   * 生命周期
   */
  mounted() { },

  /**
   * 方法
   */
  methods: {
    // 验证成功处理
    verifySuccess(obj) {
      this.filterObj = {
        vids: obj.village,
        ys_starttime: obj.stime,
        ys_endtime: obj.etime,
        ss_starttime: obj.sstime,
        ss_endtime: obj.setime,
        subject_ids: obj.subject,
        model: obj.pattern,
        check: obj.check,
      };
      this.filterText = obj.filterText;
      this.showFilter = false
    }
  }
}
