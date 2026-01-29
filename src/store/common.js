import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * 公共配置
 *
 **/

export default new Vuex.Store({
  state: {
    socketUrl: process.env.VUE_APP_WEBSOCKET, // socket 正式
    baseUrl: process.env.VUE_APP_API_BASE_URL, // 正式地址

    loginPath: '/SignIn', // VUE前端登录地址
    captcha_url: 'https://ssl.captcha.qq.com/TCaptcha.js', // 007腾讯防水墙公网地址
    captcha_appid: '2099388674', // 007腾讯防水墙appid
    frame_copyright: '',

  },
  mutations: {
    setCopyright (state, text) {
      state.frame_copyright = text
    }
  }
})
