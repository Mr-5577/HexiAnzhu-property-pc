import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * 公共配置
 *
 **/

export default new Vuex.Store({
  state: {
    list: [
      {
        name: '',
        routePath: '',
        icon: ''
      },
      {
        name: '系统首页',
        routePath: '/Main',
        icon: 'home',
        token: 'Menu-fB6KJ7PXkRvzNS14TuwrhfxB4'
      },
      {
        name: '基本资料',
        routePath: '/Means',
        icon: 'means',
        token: 'Menu-PQPYUhnmWmShRcIBbNFbFXuJ'
      },
      {
        name: '基本设置',
        routePath: '/Setting',
        icon: 'setting',
        token: 'Menu-tfMBApjqT1qht8EDJlqSeAPQ'
      },
      {
        name: '物业收费',
        routePath: '/Charge',
        icon: 'charge',
        token: 'Menu-5GCGm6aRWoS99UgojLVlIT14M'
      },
      {
        name: '辅助业务',
        routePath: '/Assist',
        icon: 'assist',
        token: 'Menu-MP6VQZmLOO0QD7r5qgp38Rlbv'
      },
      {
        name: '财务报表',
        routePath: '/Report',
        icon: 'report',
        token: 'Menu-TyUdWpFjvP4rlGsqnTav3l6J'
      },
      {
        name: '车场管理',
        routePath: '/Car',
        icon: 'car',
        token: 'Menu-nhv5hM9wGbZh8F3bI7vhKrE1f'
      },
      {
        name: '临停管理',
        routePath: '/parkManage',
        icon: 'parkManage',
        token: 'Menu-5C0365F13F350C55B3B03105'
      },
      {
        name: '合同管理',
        routePath: '/Contract',
        icon: 'contract',
        token: 'Menu-K44jPZMvyKh838Lo1EX8mp8IY'
      },
      {
        name: '客户服务',
        routePath: '/Custom',
        icon: 'custom',
        token: 'Menu-n5XxumIBUFpWSmLEHvcG38lRr'
      },
      {
        name: '应用管理',
        routePath: '/Application',
        icon: 'application',
        token: 'Menu-hsu60m3xsBceQ69tPTu8BsUDN'
      },
      {
        name: '系统设置',
        routePath: '/System',
        icon: 'system',
        token: 'Menu-18ygEsgrSsuhbBKgoaF312My'
      },
      {
        name: '用户列表',
        routePath: '/Addressbook',
        icon: 'addressbook',
        token: 'Menu-FpGYRxfVTxpTJiGD8HytJOfO'
      },
      {
        name: '设备管理',
        routePath: '/DeviceManage',
        icon: 'deviceManage',
        token: 'Menu-5C0365F13F350C55B3B05555'
      },
      {
        name: '',
        routePath: '',
        icon: ''
      }
    ],
    childRoleList: []
  },
  getters: {
    // 判断一个token是否在子项权限里
    judgeRole: state => token => {
      return state.childRoleList.includes(token)
    }
  },
  mutations: {
    // 设置子项权限token
    setChildRoleList (state, data) {
      // 设置子权限信息
      state.childRoleList = data
    }
  }
})
