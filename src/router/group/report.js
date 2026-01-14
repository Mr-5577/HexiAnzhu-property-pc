import Report from '@/views/Report.vue'

/* 财务报表 */
export default {
  meta: {
    title: '和喜物业-财务报表',
    loadContainer: true
  },
  path: '/Report',
  name: 'Report',
  component: Report,
  children: [
    {
      path: 'Sreceipts',
      name: 'Sreceipts',
      component: () => import('@/components/report/Sreceipts.vue')
    },
    {
      path: 'Yreceipts',
      name: 'Yreceipts',
      component: () => import('@/components/report/Yreceipts.vue')
    },
    {
      path: 'Arrears',
      name: 'Arrears',
      component: () => import('@/components/report/Arrears.vue')
    },
    {
      path: 'ReceiveAdvance',
      name: 'ReceiveAdvance',
      component: () => import('@/components/report/ReceiveAdvance.vue')
    },
    {
      path: 'Refund',
      name: 'Refund',
      component: () => import('@/components/report/Refund.vue')
    },
    {
      path: 'OwnerHouse',
      name: 'OwnerHouse',
      component: () => import('@/components/report/OwnerHouse.vue')
    },
    {
      path: 'Resources',
      name: 'Resources',
      component: () => import('@/components/report/Resources.vue')
    },
    {
      path: 'Finance',
      name: 'Finance',
      component: () => import('@/components/report/Finance.vue')
    },
    {
      path: 'Standing',
      name: 'Standing',
      component: () => import('@/components/report/Standing.vue')
    },
    {
      path: 'Combination',
      name: 'Combination',
      component: () => import('@/components/report/Combination.vue')
    },
    {
      path: 'ThirdCousin',
      name: 'ThirdCousin',
      component: () => import('@/components/report/ThirdCousin.vue')
    },
    {
      path: 'Budget',
      name: 'Budget',
      component: () => import('@/components/report/Budget.vue')
    },
    {
      path: 'Apportion',
      name: 'Apportion',
      component: () => import('@/components/report/Apportion.vue')
    },
    {
      path: 'CarportCharge',
      name: 'CarportCharge',
      component: () => import('@/components/report/CarportCharge.vue')
    },
    {
      path: 'TaxReturns',
      name: 'TaxReturns',
      component: () => import('@/components/report/TaxReturns.vue')
    },
    {
      path: 'Deposit',
      name: 'Deposit',
      component: () => import('@/components/report/Deposit.vue')
    },
    {
      path: 'AdvanceDeposites',
      name: 'AdvanceDeposites',
      component: () => import('@/components/report/AdvanceDeposites.vue')
    },
    {
      path: 'ArrearageReason',
      name: 'ArrearageReason',
      component: () => import('@/components/report/ArrearageReason.vue')
    },
    {
      path: 'RecoverSituation',
      name: 'RecoverSituation',
      component: () => import('@/components/report/RecoverSituation.vue')
    },
    {
      path: 'ArrearageDuration',
      name: 'ArrearageDuration',
      component: () => import('@/components/report/ArrearageDuration.vue')
    },
    {
      path: 'HousingCreditTable',
      name: 'HousingCreditTable',
      component: () => import('@/components/report/HousingCreditTable.vue')
    },
    {
      path: 'Housekeepercostcountstatistics',
      name: 'Housekeepercostcountstatistics',
      component: () => import('@/components/report/Housekeepercostcountstatistics.vue')
    },
  ]
}

