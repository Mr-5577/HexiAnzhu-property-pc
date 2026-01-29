import Charge from '@/views/Charge.vue'

/* 物业收费 */
export default {
  meta: {
    title: '和喜物业-物业收费',
    loadContainer: true
  },
  path: 'Charge',
  name: 'Charge',
  component: Charge,
  children: [
    {
      path: 'AddCharge',
      name: 'AddCharge',
      component: () => import('@/components/charge/AddCharge.vue')
    },
    {
      path: 'Order',
      name: 'Order',
      component: () => import('@/components/charge/Order.vue')
    },
    {
      path: 'Hydropower',
      name: 'Hydropower',
      component: () => import('@/components/charge/Hydropower.vue')
    },
    {
      path: 'Other',
      name: 'Other',
      component: () => import('@/components/charge/Other.vue')
    },
    {
      path: 'Arrearages',
      name: 'Arrearages',
      component: () => import('@/components/charge/Arrearages.vue')
    },
    {
      path: 'ChargeManage',
      name: 'ChargeManage',
      component: () => import('@/components/charge/ChargeManage.vue')
    },
    {
      path: 'Prestore',
      name: 'Prestore',
      component: () => import('@/components/charge/Prestore.vue')
    },
    {
      path: 'BillPay',
      name: 'BillPay',
      component: () => import('@/components/charge/BillPay.vue')
    },
    {
      path: 'AkeyDeposit',
      name: 'AkeyDeposit',
      component: () => import('@/components/charge/AkeyDeposit.vue')
    },
    {
      path: 'BillManage',
      name: 'BillManage',
      component: () => import('@/components/charge/BillManage.vue')
    },
    {
      path: 'Accounts',
      name: 'Accounts',
      component: () => import('@/components/charge/Accounts.vue')
    },
    {
      path: 'FileManage',
      name: 'FileManage',
      component: () => import('@/components/charge/FileManage.vue')
    },
    {
      path: 'GiveawayManage',
      name: 'GiveawayManage',
      component: () => import('@/components/charge/GiveawayManage.vue')
    },
  ]
}
