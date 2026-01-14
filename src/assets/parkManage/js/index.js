export default {
  name: 'car',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'StopCharge',
          name: '临停收费',
          token: 'List-2E529B13D469E483F5175A5F'
        },
        {
          id: 1,
          title: 'ChargeFees',
          name: '充电收费',
          token: 'empty'
        },
        {
          id: 2,
          title: 'YardManage',
          name: '车场管理',
          token: 'List-BE33C9B7705C5245AECBEEB2'
        },
        {
          id: 3,
          title: 'GateManage',
          name: '闸机管理',
          token: 'List-F5C008A36F1026C47B0A885F'
        },
        {
          id: 4,
          title: 'PilesManage',
          name: '充电桩管理',
          token: 'List-FB20A22616CF351F395944CE'
        },
        {
          id: 5,
          title: 'ChargeTemp',
          name: '收费模板',
          token: 'List-1F46E54135C5A12BAA250508'
        },
        {
          id: 6,
          title: 'ChargeOrder',
          name: '充电订单',
          token: 'List-5DA48B6241284A555B9D8361'
        }
      ],
      // 当前选择的标签
      activeIndex: 0,
      // 当前有权限的标签列表
      authLabels: [],
      // 当前选择组件名
      activeComp: 'StopCharge',
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
    labelChange (obj) {
      if (this.$route.name != obj.title) {
        this.activeIndex = obj.id
        this.$router.push({ name: obj.title }).catch(() => { })
      }
    },
  }
}
