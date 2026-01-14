export default {
  name: 'setting',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'AddCharge',
          name: '综合收费',
          token: 'List-OVWj8pKVdojCXEuaMHXEpByJ'
        },
        {
          id: 1,
          title: 'Order',
          name: '缴费记录',
          token: 'List-6TE8RNomlJUVMiKdqz94HnZV'
        },
        {
          id: 2,
          title: 'Hydropower',
          name: '水电录入',
          token: 'List-whpMfIKHEJGiikz1QIw0L9Jf'
        },
        // {
        //   id: 3,
        //   title: 'Other',
        //   name: '其他收费',
        //   token: 'List-V8KFcWEsQUmzWmEAIh25N3Ic'
        // },
        {
          id: 4,
          title: 'Arrearages',
          name: '欠费管理',
          token: 'List-BZsUNBZmCIfgitxOMVYzTgar'
        },
        {
          id: 5,
          title: 'ChargeManage',
          name: '收费管理',
          token: 'List-lYaS3YH3wbVwMHNOErereNHp'
        },
        {
          id: 6,
          title: 'Prestore',
          name: '预存明细',
          token: 'List-YpyG00YrmJfgC3QhL6h1KAPi'
        },
        {
          id: 7,
          title: 'BillPay',
          name: '票据缴销',
          token: 'List-vcpQKL9btuL7Lx69VqUsnFvy'
        },
        {
          id: 8,
          title: 'AkeyDeposit',
          name: '一键划账',
          token: 'List-79XRfjDGJuMo3Q7yK6EDb4Xp'
        },
        {
          id: 9,
          title: 'BillManage',
          name: '计费管理',
          token: 'List-g0LSHd8uuknzFJmVcklD46uE'
        },
        {
          id: 10,
          title: "Accounts",
          name: '交账管理',
          token: 'List-sAjP2Baitdr0FTO1mYwMDC8u'
        },
        {
          id: 11,
          title: "FileManage",
          name: '附件管理',
          token: 'List-GDATZvzbQZ5UXjjlOyy37V5O'
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
