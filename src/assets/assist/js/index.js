export default {
  name: 'assist',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'BuyTicket',
          name: '批量打票',
          token: 'List-QC85FXv2NxEdnT4qsowwEEVP'
        },
        {
          id: 1,
          title: 'BatchGathering',
          name: '批量收款',
          token: 'List-0JA9bc5RxvXjTfwf86Kojhqv'
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
