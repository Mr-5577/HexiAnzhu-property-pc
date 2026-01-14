import Assist from '@/views/Assist.vue'

/* 辅助业务 */
export default {
  meta: {
    title: '和喜物业-辅助业务',
    loadContainer: true
  },
  path: '/Assist',
  name: 'Assist',
  component: Assist,
  children: [
    {
      path: 'BuyTicket',
      name: 'BuyTicket',
      component: () => import('@/components/assist/BuyTicket.vue')
    },
    {
      path: 'BatchGathering',
      name: 'BatchGathering',
      component: () => import('@/components/assist/BatchGathering.vue')
    }
  ]
}

