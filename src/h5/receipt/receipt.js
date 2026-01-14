import Vue from 'vue'
import '../../plugins/axios'
import Index from './Index.vue'
import router from '../../router'

new Vue({
  router,
  render: h => h(Index)
}).$mount('#receipt')
