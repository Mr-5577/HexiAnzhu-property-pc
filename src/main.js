import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Print from 'vue-print-nb'
import './plugins/element.js'
import '@/assets/common/font-awesome-4.7.0/css/font-awesome.min.css'
import common_ from '@/store/common.js'
import api_ from '@/store/api.js'
import menu_ from '@/store/menu.js'
import global_ from '@/components/common/Global.vue'
// 引入字体图标样式文件
import '@/assets/common/fonts/iconfont.css'
import "./plugins/rem.js";

import FilterVillage from '@/components/common/FilterVillage.vue'

import _ from 'lodash'

// 按需加载 vxe-table
import XEUtils from 'xe-utils'
import { VXETable, Table, Column, Header, Colgroup } from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})

Vue.use(Table).use(Column).use(Header).use(Colgroup)

Vue.config.productionTip = false
Vue.use(Print)
Vue.prototype.$common = common_
Vue.prototype.$api = api_
Vue.prototype.$menu = menu_
Vue.prototype.$global = global_

// 全局组件注册
Vue.component('filter-village', FilterVillage)
Vue.component('cus-table', () => import('./components/common/CusTable.vue'))
Vue.component('y-pagination', () =>
  import('./components/common/YPagination.vue')
)

//监听滚动事件
Vue.directive('scrollEvent', {
  bind (el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      binding.value();
    });
  }
})

//监听滚动结束事件
Vue.directive('scrollEnd', {
  bind (el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
    var timer;
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        binding.value();
      }, 1000);
    });
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
