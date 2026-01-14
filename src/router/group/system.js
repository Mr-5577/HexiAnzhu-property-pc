/* 系统设置 */
export default {
  meta: {
    title: '和喜物业-系统设置',
    loadContainer: true
  },
  path: '/System',
  name: 'System',
  component: () => import('@/views/System.vue') // 系统设置
}
