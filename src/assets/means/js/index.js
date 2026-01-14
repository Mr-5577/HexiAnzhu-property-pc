export default {
  name: 'means',
  data () {
    return {
      // 顶部标签列表数据
      labels: [
        {
          id: 0,
          title: 'Material',
          name: '基础资料管理',
          token: 'List-c9k3ntT9MFnRvHyqR8vvU2wA'
        },
        {
          id: 1,
          title: 'ClientManage',
          name: '客户管理',
          token: 'List-dMvtx9xScb5Gf0tBnM756WOB'
        },
        {
          id: 2,
          title: 'Category',
          name: '资源类别设置',
          token: 'List-afZjTIDfCr7TVNFaW7HKOxTa'
        },
        {
          id: 3,
          title: 'Carport',
          name: '车位启用',
          token: 'List-b5En1zQmcBTo8yKH3TyxUNK7'
        },
        {
          id: 4,
          title: 'Rentcar',
          name: '月租车登记',
          token: 'List-p2foDAlbFwENYtcE4bAc0J85'
        },
        {
          id: 5,
          title: 'InsideVehicle',
          name: '内部车管理',
          token: 'List-JnyWB2t1zTS9VWOmllpFtaSL'
        },
        {
          id: 6,
          title: 'Novehicle',
          name: '非机动车登记',
          token: 'List-WhTH0sySfs6InqzaxUuyIjqE'
        },
        {
          id: 7,
          title: 'Statement',
          name: '基础资料报表',
          token: 'List-WLK2gD5XBsLxqiDQ5oMZHOaX'
        },
        {
          id: 8,
          title: 'Icmanage',
          name: 'IC卡管理',
          token: 'List-D1B0D93857FE0020971B8168'
        },
        {
          id: 9,
          title: 'Icstanding',
          name: 'IC卡台账',
          token: 'List-D1B0D93857FE0020971B9999'
        }
      ],
      // 当前有权限的标签列表
      authLabels: [],
      // 当前选择的标签
      activeIndex: '',
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
        this.$nextTick(() => {
          let charge = document.getElementById('means')
          if (obj.id === 7) {
            let statement = document.getElementById('statement')
            let obj = this.$children.find(item => item.$el == statement)
            if (obj && obj.isRegister) {
              charge.classList.add('register')
            } else {
              charge.classList.remove('register')
            }
          } else if (obj.id === 4) {
            let rentcar = document.getElementById('rentcar')
            let obj = this.$children.find(item => item.$el == rentcar)
            if (obj && obj.isRegister) {
              charge.classList.add('register')
            } else {
              charge.classList.remove('register')
            }
          } else if (obj.id === 6) {
            let novehicle = document.getElementById('novehicle')
            let obj = this.$children.find(item => item.$el == novehicle)
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
