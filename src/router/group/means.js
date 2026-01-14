import Means from '@/views/Means.vue'

/* 基本资料 */
export default {
  meta: {
    title: '和喜物业-基本资料',
    loadContainer: true
  },
  path: 'Means',
  name: 'Means',
  component: Means,
  children: [
    {
      path: 'Material',
      name: 'Material',
      component: () => import('@/components/means/Material.vue')
    },
    {
      path: 'ClientManage',
      name: 'ClientManage',
      component: () => import('@/components/means/ClientManage.vue')
    },
    {
      path: 'Category',
      name: 'Category',
      component: () => import('@/components/means/Category.vue')
    },
    {
      path: 'Carport',
      name: 'Carport',
      component: () => import('@/components/means/Carport.vue')
    },
    {
      path: 'Rentcar',
      name: 'Rentcar',
      component: () => import('@/components/means/Rentcar.vue')
    },
    {
      path: 'InsideVehicle',
      name: 'InsideVehicle',
      component: () => import('@/components/means/InsideVehicle.vue')
    },
    {
      path: 'Novehicle',
      name: 'Novehicle',
      component: () => import('@/components/means/Novehicle.vue')
    },
    {
      path: 'Statement',
      name: 'Statement',
      component: () => import('@/components/means/Statement.vue')
    },
    {
      path: 'Icmanage',
      name: 'Icmanage',
      component: () => import('@/components/means/Icmanage.vue')
    },
    {
      path: 'Icstanding',
      name: 'Icstanding',
      component: () => import('@/components/means/Icstanding.vue')
    },
  ]
}

