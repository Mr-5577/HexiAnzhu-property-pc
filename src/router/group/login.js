/* 登录模块 */
export default [
  {
    meta: {
      title: '和喜物业-账号登录'
    },
    path: '/SignIn',
    name: 'SignIn',
    component: () => import('@/views/Login.vue') // 账号登录
  },
  {
    meta: {
      title: '和喜物业-账号登录'
    },
    path: '/Init',
    name: 'Init',
    component: () => import('@/views/Init.vue') // 二维码登录跳转
  },
  {
    meta: {
      title: '和喜物业-账号登录'
    },
    path: '/Oauth',
    name: 'Oauth',
    component: () => import('@/views/Oauth.vue') // 企业微信一键登录
  },
]
