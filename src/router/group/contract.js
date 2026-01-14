/* 合同管理 */
export default {
  meta: {
    title: '和喜物业-合同管理',
    loadContainer: true
  },
  path: '/Contract',
  name: 'Contract',
  component: () => import('@/views/Contract.vue') // 合同管理
}
