/* 通信录 */
export default {
  meta: {
    title: '和喜物业-用户列表',
    loadContainer: true
  },
  path: '/Addressbook',
  name: 'Addressbook',
  component: () => import('@/views/Addressbook.vue')
}

