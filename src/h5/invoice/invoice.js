import Vue from 'vue'
import '../../plugins/axios'
import Index from './Index.vue'
import router from '../../router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Index)
}).$mount('#invoice')
