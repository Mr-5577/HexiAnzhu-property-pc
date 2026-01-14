import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './group/login.js'
import Main from './group/main.js'

Vue.use(VueRouter)
let baseRoutes = []
let routes = baseRoutes.concat(
  Login,
  Main,
)
let router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 设置title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 判断当前路由是否设置，未设置跳转到错误页面
  if (to.matched.length === 0) {
    from.name
      ? next({
        name: from.name
      })
      : next('/ErrorMsg')
  } else {
    next()
  }
})
export default router
