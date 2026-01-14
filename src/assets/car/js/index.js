export default {
  name: 'car',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'ParkingList',
          name: '停车场列表',
          token: 'List-Oat2WGsWTuRDRbCRb6sXr46L'
        },
        {
          id: 1,
          title: 'CarQuery',
          name: '车辆查询',
          token: 'List-ZzTsg6DVOWnj43uBv3Gb7lCN'
        },
        {
          id: 2,
          title: 'CarRecord',
          name: '临停车辆记录',
          token: 'List-nWl8uc7S3fLkUk7IVXBto0Dc'
        }
      ],
      // 当前选择的标签
      activeIndex: 0,
      // 当前有权限的标签列表
      authLabels: [],
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
