import ParkManage from '@/views/ParkManage.vue'

/* 临停管理 */
export default {
  meta: {
    title: '和喜物业-临停管理',
    loadContainer: true
  },
  path: 'parkManage',
  name: 'parkManage',
  component: ParkManage,
  children: [
    {
      path: 'StopCharge',
      name: 'StopCharge',
      component: () => import('@/components/parkManage/StopCharge.vue')
    },
    {
      path: 'ChargeFees',
      name: 'ChargeFees',
      component: () => import('@/components/parkManage/ChargeFees.vue')
    },
    {
      path: 'YardManage',
      name: 'YardManage',
      component: () => import('@/components/parkManage/YardManage.vue')
    },
    {
      path: 'GateManage',
      name: 'GateManage',
      component: () => import('@/components/parkManage/GateManage.vue')
    },
    {
      path: 'PilesManage',
      name: 'PilesManage',
      component: () => import('@/components/parkManage/PilesManage.vue')
    },
    {
      path: 'ChargeTemp',
      name: 'ChargeTemp',
      component: () => import('@/components/parkManage/ChargeTemp.vue')
    },
    {
      path: 'ChargeOrder',
      name: 'ChargeOrder',
      component: () => import('@/components/parkManage/ChargeOrder.vue')
    },
  ]
}
