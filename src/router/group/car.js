import Car from '@/views/Car.vue'

/* 车场管理 */
export default {
  meta: {
    title: '和喜物业-车场管理',
    loadContainer: true
  },
  path: '/Car',
  name: 'Car',
  component: Car,
  children: [
    {
      path: 'ParkingList',
      name: 'ParkingList',
      component: () => import('@/components/car/ParkingList.vue')
    },
    {
      path: 'CarQuery',
      name: 'CarQuery',
      component: () => import('@/components/car/CarQuery.vue')
    },
    {
      path: 'CarRecord',
      name: 'CarRecord',
      component: () => import('@/components/car/CarRecord.vue')
    }
  ]
}

