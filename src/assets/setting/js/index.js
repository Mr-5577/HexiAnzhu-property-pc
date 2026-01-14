export default {
  name: 'setting',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: "Subject",
          name: '科目管理',
          token: 'List-wgkFD7WqP5CUKuzNcQEt62Bn'
        },
        {
          id: 1,
          title: "Charging",
          name: '计费标准设置',
          token: 'List-vFt8Bge9auND51oqrxZjLzcK'
        },
        {
          id: 2,
          title: "Alone",
          name: '单独标准设置',
          token: 'List-TGg7xr6BSk3MJb0HlvZQ1dfy'
        },
        {
          id: 3,
          title: "Relevance",
          name: '计费关联设置',
          token: 'List-O95KGxL18d7WYvpIAQfsmFXr'
        },
        {
          id: 4,
          title: "Arrearage",
          name: '生成欠费',
          token: 'List-5mkjh3YvprNygMtA1idxZn4z'
        },
        {
          id: 5,
          title: "Payment",
          name: '付款方式',
          token: 'List-S01B9NIWdknHOrGlZFUig7aV'
        },
        {
          id: 6,
          title: "Invoice",
          name: '定额发票',
          token: 'List-FmMIACXZjqg9B5MYH1YeqWCn'
        },
        {
          id: 7,
          title: "Receipt",
          name: '电子收据',
          token: 'List-RGdA2HycjbrXeYtmSVnsKhD9'
        },
        {
          id: 8,
          title: "PaperReceipt",
          name: '纸质收据',
          token: 'List-32RDEHIxwnoMQWrUqpmbv0OZ'
        },
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
    this.$router.push({ name: obj ? obj.title : this.authLabels[0].title }).catch(() => { })
  },

  /**
   * 生命周期
   */
  mounted () {
    // 获取资源类别
    this.$store.dispatch('getResource')
    // 获取计费优先级
    this.$store.dispatch('getPrioritys')
    // 获取计量单位
    this.$store.dispatch('getUnits')
    // 获取计算公式
    this.$store.dispatch('getFormulas')
    // 获取科目类型
    this.$store.dispatch('getSubjects')
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
        this.$nextTick(() => {
          let charge = document.getElementById('setting')
          if (obj.id === 1) {
            let charging = document.getElementById('charging')
            let obj = this.$children.find(item => item.$el == charging)
            if (obj && obj.isRegister) {
              charge.classList.add('register')
            } else {
              charge.classList.remove('register')
            }
          } else {
            charge.classList.remove('register')
          }
        })
      }
    }
  }
}
