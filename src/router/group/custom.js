import Custom from '@/views/Custom.vue'

/* 客户服务 */
export default {
  meta: {
    title: '和喜物业-客户服务',
    loadContainer: true
  },
  path: '/Custom',
  name: 'Custom',
  component: Custom,
  children: [
    {
      path: 'Announcement',
      name: 'Announcement',
      component: () => import('@/components/custom/Announcement.vue')
    },
    {
      path: 'ReportRepair',
      name: 'ReportRepair',
      component: () => import('@/components/custom/ReportRepair.vue')
    },
    {
      path: 'ComplaintAdvice',
      name: 'ComplaintAdvice',
      component: () => import('@/components/custom/ComplaintAdvice.vue')
    },
    {
      path: 'ActiveManage',
      name: 'ActiveManage',
      component: () => import('@/components/custom/ActiveManage.vue')
    },
    {
      path: 'Housekeeper',
      name: 'Housekeeper',
      component: () => import('@/components/custom/Housekeeper.vue')
    },
    {
      path: 'SmsPush',
      name: 'SmsPush',
      component: () => import('@/components/custom/SmsPush.vue')
    },
    {
      path: 'MessageTemplate',
      name: 'MessageTemplate',
      component: () => import('@/components/custom/MessageTemplate.vue')
    },
    {
      path: 'Questionnaire',
      name: 'Questionnaire',
      component: () => import('@/components/custom/Questionnaire.vue')
    },
    {
      path: 'IntegratedService',
      name: 'IntegratedService',
      component: () => import('@/components/custom/IntegratedService.vue')
    },
  ]
}
