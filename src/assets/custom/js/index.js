export default {
  name: 'custom',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'Announcement',
          name: '通知公告',
          token: 'List-MQ5qfQV93oJFNPDJQ0PrwPiV'
        },
        {
          id: 1,
          title: 'ReportRepair',
          name: '报事报修',
          token: 'List-60SyBu5SX0oedxLrulcxoGuj'
        },
        {
          id: 2,
          title: 'ComplaintAdvice',
          name: '投诉建议',
          token: 'List-51nHxXQLJyFVG39pQPpEdOuL'
        },
        {
          id: 3,
          title: 'Housekeeper',
          name: '楼栋管家',
          token: 'List-epHY71a0Z4Puz717OfiTepUs'
        },
        {
          id: 4,
          title: 'SmsPush',
          name: '短信推送',
          token: 'List-em9nINDVT3W1lgU2S7nqtdKm'
        },
        {
          id: 5,
          title: 'MessageTemplate',
          name: '短信模板管理',
          token: 'List-O1ohhaeRgZiqWakNEkVw0CYG'
        },
        {
          id: 6,
          title: 'Questionnaire',
          name: '问卷调查',
          token: 'List-b0Y7qfmMeNtkswE6WjSxolGd'
        },
        {
          id: 7,
          title: 'IntegratedService',
          name: '综合服务',
          token: 'List-b0Y7qfmMeNtkswE6WjSxolGd'
        },
        {
          id: 8,
          title: 'VisitQuery',
          name: '来访查询',
          token: 'List-b0Y7qfmMeNtkswE6WjSxolGd'
        },
        {
          id: 9,
          title: 'ActivityManagement',
          name: '活动管理',
          token: 'List-b0Y7qfmMeNtkswE6WjSxolGd'
        }
      ],
      // 当前有权限的标签列表
      authLabels: [],
      // 当前选择的标签
      activeIndex: 0,
    }
  },

  /**
   * 生命周期
   */
  created () {
    this.authLabels = this.labels.filter(item => {
      const flag = this.$menu.getters.judgeRole(item.token)
      if (flag) return item
    })

    let obj = this.authLabels.find(item => item.title === this.$route.name)
    this.activeIndex = obj ? obj.id : this.authLabels[0].id
    this.$router.push(
      { name: obj ? obj.title : this.authLabels[0].title }
    ).catch(() => { })
  },

  /**
   * 方法
   */
  methods: {
    // label 项切换处理
    labelChange (obj) {
      if (this.$route.name != obj.title) {
        this.activeIndex = obj.id
        this.$router.push({ name: obj.title }).catch(() => { })
      }
    },
  }
}
