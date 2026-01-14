export default {
  name: 'report',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'Sreceipts',
          name: '实收统计',
          token: 'List-9ieN3EdaS27rb1Qcsx32CzM2'
        },
        {
          id: 1,
          title: 'Yreceipts',
          name: '应收统计',
          token: 'List-rUUCxBrhrvqVu1VXQ2ljXvhz'
        },
        {
          id: 2,
          title: 'Arrears',
          name: '欠费统计',
          token: 'List-qqhg3MtMMvZaTWfGEI99kYqN'
        },
        {
          id: 3,
          title: 'ReceiveAdvance',
          name: '资源预收统计',
          token: 'List-pAb4gLAATdmEudMGzfSBvc5x'
        },
        {
          id: 4,
          title: 'Refund',
          name: '退款统计',
          token: 'List-G9YKIizGAWW4eCFdV3ibzSwU'
        },
        // {
        //   id: 5,
        //   title: 'OwnerHouse',
        //   name: '业主及房产统计',
        //   token: ''
        // },
        // {
        //   id: 6,
        //   title: 'Resources',
        //   name: '资源明细',
        //   token: ''
        // },
        {
          id: 7,
          title: 'Finance',
          name: '财务月报表',
          token: 'List-w7aXIiLVEhX1roxVrgRCHDlM'
        },
        {
          id: 8,
          title: 'Standing',
          name: '现金台账表',
          token: 'List-KLIuhakiIwmjbBhehwF7XxuW'
        },
        {
          id: 9,
          title: 'Combination',
          name: '组合报表',
          token: 'List-5LFtubbBMHbmWhIMjEUGBf9a'
        },
        {
          id: 10,
          title: 'ThirdCousin',
          name: '三表抄表统计',
          token: 'List-eXBLmh6k1yrX0jWBtAtFCnpf'
        },
        {
          id: 11,
          title: 'Budget',
          name: '预算统计',
          token: 'List-NSWxrPCwj12DoG8hFvLL0KyH'
        },
        {
          id: 12,
          title: 'Apportion',
          name: '分摊统计',
          token: 'List-H76eDKPvYjKpj5GisclYOaAI'
        },
        {
          id: 13,
          title: 'CarportCharge',
          name: '停车场收费统计',
          token: 'List-23sjVl32gOS0FmqYJbmIIsQY'
        },
        {
          id: 14,
          title: 'TaxReturns',
          name: '当期纳税计算表',
          token: 'List-9NMPdmDuwrWePynFjVCelgIk'
        },
        {
          id: 15,
          title: 'Deposit',
          name: '押金统计表',
          token: 'List-i3p3EsmrBBFLgPHVSMzL6zZj'
        },
        {
          id: 16,
          title: 'AdvanceDeposites',
          name: '预存款统计表',
          token: 'List-HlbgB8FjDYTpMCORAMEChKpI'
        },
        {
          id: 17,
          title: 'ArrearageReason',
          name: '欠费原因分析',
          token: 'List-FbgOioJZ1QN0cdf6LFordury'
        },
        {
          id: 18,
          title: 'RecoverSituation',
          name: '收回情况统计',
          token: 'List-5X1uMHjMmdzAAuIYostomszp'
        },
        {
          id: 19,
          title: 'ArrearageDuration',
          name: '欠费时长分析',
          token: 'List-yliDV5keNbm9Yz0VxXDYrRRM'
        },
        {
          id: 20,
          title: 'HousingCreditTable',
          name: '房源收费一览表',
          token: 'List-bkNafiErjLqSvgfbqMY6lrIH'
        },
        {
          id: 21,
          title: 'Housekeepercostcountstatistics',
          name: '楼栋管家统计表',
          token: 'List-A25e0jzlXbuYfZnVRUasEmiT'
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
    this.$router.push(
      { name: obj ? obj.title : this.authLabels[0].title }
    ).catch(() => { })
  },

  /**
   * 生命周期
   */
  mounted () {
    // websocket 链接
    if (typeof WebSocket === 'undefined') {
      this.$message({
        type: 'error',
        message: '您的浏览器不支持socket'
      })
    } else {
      // 实例化socket
      window.$socket2 = new WebSocket(this.$common.state.socketUrl)
    }
    // 链接websocket
    window.$socket2.onopen = () => {
      var jsondata = {
        type: 'bind',
        uuid: sessionStorage.getItem('uuid')
      }
      var str = JSON.stringify(jsondata)
      window.$socket2.send(str)
    }
    // 监听socket错误信息
    window.$socket2.onerror = () => {
      this.$message({
        type: 'warning',
        message: 'websocket 连接失败！'
      })
    }
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
      }
    },
  },
}
