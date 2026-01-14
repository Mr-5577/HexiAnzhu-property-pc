import Application from '@/views/Application.vue'

/* 应用管理 */
export default {
  meta: {
    title: '和喜物业-应用管理',
    loadContainer: true
  },
  path: '/Application',
  name: 'Application',
  component: Application,
  children: [
    {
      path: 'ApplicationManage',
      name: 'ApplicationManage',
      component: () => import('@/components/application/ApplicationManage.vue')
    },
    {
      path: 'OnlineDetail',
      name: 'OnlineDetail',
      component: () => import('@/components/application/OnlineDetail.vue')
    }
  ]
}
