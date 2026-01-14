/* 通信录 */
import DeviceManage from '@/views/DeviceManage.vue'
export default {
  meta: {
    title: '和喜物业-设备管理',
    loadContainer: true
  },
  path: '/DeviceManage',
  name: 'DeviceManage',
  component: DeviceManage,
  children: [
    {
      path: 'FacilityManage',
      name: 'FacilityManage',
      component: () => import('@/components/deviceManage/FacilityManage.vue')
    },
    {
      path: 'DeviceCategory',
      name: 'DeviceCategory',
      component: () => import('@/components/deviceManage/DeviceCategory.vue')
    },
    {
      path: 'AlarmLog',
      name: 'AlarmLog',
      component: () => import('@/components/deviceManage/AlarmLog.vue')
    },
    
  ]
}