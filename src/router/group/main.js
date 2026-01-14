import Means from './means.js'
import Setting from './setting.js'
import Charge from './charge.js'
import Assist from './assist.js'
import Report from './report.js'
import Car from './car.js'
import Contract from './contract.js'
import Custom from './custom.js'
import Application from './application.js'
import System from './system.js'
import Addressbook from './addressbook.js'
import ParkManage from './parkManage.js'
import DeviceManage from './deviceManage.js'


/* 主框架模块 */
export default [
  {
    path: '/',
    component: () => import('@/components/common/EstContainer.vue'),
    redirect: '/Main',
    children: [
      {
        meta: {
          title: '和喜物业-首页',
          loadContainer: true
        },
        path: 'Main',
        name: 'Main',
        component: () => import('@/views/Main.vue')
      },
      Means,
      Setting,
      Charge,
      Assist,
      Report,
      Car,
      Contract,
      Custom,
      Application,
      System,
      Addressbook,
      ParkManage,
      DeviceManage
    ]
  },
  {
    meta: {
      title: '404错误页面'
    },
    path: '/ErrorMsg',
    name: 'ErrorMsg',
    component: () => import('@/views/ErrorMsg.vue')
  }
]
