import Setting from '@/views/Setting.vue'

/* 基本设置 */
export default {
  meta: {
    title: '和喜物业-基本设置',
    loadContainer: true
  },
  path: 'Setting',
  name: 'Setting',
  component: Setting,
  children: [
    {
      path: 'Subject',
      name: 'Subject',
      component: () => import('@/components/setting/Subject.vue')
    },
    {
      path: 'Charging',
      name: 'Charging',
      component: () => import('@/components/setting/Charging.vue')
    },
    {
      path: 'Alone',
      name: 'Alone',
      component: () => import('@/components/setting/Alone.vue')
    },
    {
      path: 'Relevance',
      name: 'Relevance',
      component: () => import('@/components/setting/Relevance.vue')
    },
    {
      path: 'Arrearage',
      name: 'Arrearage',
      component: () => import('@/components/setting/Arrearage.vue')
    },
    {
      path: 'Payment',
      name: 'Payment',
      component: () => import('@/components/setting/Payment.vue')
    },
    {
      path: 'Invoice',
      name: 'Invoice',
      component: () => import('@/components/setting/Invoice.vue')
    },
    {
      path: 'Receipt',
      name: 'Receipt',
      component: () => import('@/components/setting/Receipt.vue')
    },
    {
      path: 'PaperReceipt',
      name: 'PaperReceipt',
      component: () => import('@/components/setting/PaperReceipt.vue')
    }
  ]
}
