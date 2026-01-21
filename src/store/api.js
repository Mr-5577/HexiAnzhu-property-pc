import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * 各接口请求地址
 *
 **/

export default new Vuex.Store({
  state: {
    // 测试服
    // domain: 'http://192.169.8.11:8081',
    // 后台站点域名
    // domain: 'http://pnewerpest.test:8093',
    Public: {
      // 获取大区和项目数据
      areaVillage: {
        url: '/common/get_tree_village'
      },
      // 通用类
      bigarea: {
        // 大区信息 不含权限范围
        url: '/common/bigarea.api'
      },
      // 获取用户权限下的大区
      getAreas: {
        // 大区信息 不含权限范围
        url: '/common/get-areas'
      },
      // 获取大区下的公司
      getCompany: {
        url: '/common/company'
      },
      // 获取公司下的项目
      getVillage: {
        url: '/common/getdepvillage'
      },
      // 获取大区下所有项目
      village: {
        url: '/common/get-villages'
      },
      // 项目信息 - 可搜索
      searchvillage: {
        url: '/common/get-search-village'
      },
      // 获取用户权限下的项目数据
      userVillage: {
        url: '/common/getuservillage'
      },
      company: {
        // 公司信息 不含权限范围
        url: '/common/company.api'
      },
      com_vill: {
        // 公司、项目信息 不含权限范围
        url: '/common/com_vill.api'
      },
      city_vill: {
        // 城市、项目信息 不含权限范围
        url: '/common/city_vill.api'
      },
      user: {
        // 用户信息
        url: '/common/user.api'
      },
      // 获取七牛云上传token
      uploadToken: {
        url: '/upload/getqiniutoken'
      },
      // 保存七牛云的文件信息到数据库
      saveUploadInfo: {
        url: '/upload/savefilebyqiniu'
      },
      // 删除文件并删除七牛云的文件
      delFile: {
        url: '/upload/delfilebyqiniu'
      },
      // 搜索项目下的楼栋(项目多选模式)
      searchBuild: {
        url: '/common/searchbuildingmultiple'
      },
      // 根据项目id获取楼栋数据
      buildOfVillage: {
        url: '/common/searchbuilding'
      },
      // 搜索单元（楼栋多选模式）
      searchUnit: {
        url: '/common/searchunitmultiple'
      },
      // 根据楼栋id 获取单元数据
      unitOfBuild: {
        url: '/common/searchunit'
      },
      // 根据单元id 获取房屋数据
      roomOfUnit: {
        url: '/common/searchrooms'
      },
      // 获取全局的缴费科目数据
      allsubject: {
        url: '/common/getsubjectdata'
      },
      // 获取项目下科目列表
      subjectList: {
        url: '/common/get-village-subject-data'
      },
      // 搜索用户
      getUsers: {
        url: '/common/searchuser'
      },
      // 获取资源类型下的收费科目
      subjectbytype: {
        url: '/common/getsubjectbytype'
      },
      // 获取房屋下的业主
      userOfRoom: {
        url: '/common/searchownerbyrooms'
      },
      // 获取-车场列表
      carlist: {
        url: '/common/getCarparkList'
      },
      // 获取用户列表
      getAuditors: {
        url: '/common/get-users'
      },
      // 搜索房屋下的业主
      getOwners: {
        url: '/common/serachroomsowner'
      }
    },
    Login: {
      // 登录类
      account: {
        // 普通账号
        url: '/login/account.api'
      },
      out: {
        // 退出
        url: '/login/signout.api'
      },
      qy_login_config: {
        // 获取企业微信登录配置
        url: '/login/qy_login_config',
      },
      login_qy: {
        // 企业微信登录
        url: '/login/login_qy',
      },
      qywx_jssdk: {
        // 获取企业微信jssdk配置参数信息
        url: '/login/qywx_jssdk',
      },
      login_sso: {
        //内部系统单点登录
        url: '/login/login_sso',
      },
    },
    Frame: {
      //框架类
      info: {
        // 获取基础信息
        url: '/frame/info.api'
      },
      role: {
        // 获取子权限信息
        url: '/frame/role.api'
      },
      // 修改密码
      editpass: {
        // 获取子权限信息
        url: '/frame/editpass'
      }
    },
    Main: {
      // 首页图表数据
      home: {
        url: '/reportstatistics/index'
      },
    },
    Means: {
      //基础设置类
      /** 基础资料管理 */

      // 搜索用户
      userSearch: {
        url: '/basicdata/searchowner'
      },
      // 删除固定车
      delfixcar: {
        url: '/car/delfixcar',
        token: 'Btn-w9SmvzXiRtwGOF64nQLEQxp0',
      },

      // 获取科目信息
      subjects_list: {
        url: '/subjects/list.api',
        token: 'List-8B6nyrxKQd44g1Ukfr0UZf2ZQ',
        list: true
      },
      // 获取 市-项目-楼栋信息
      treeData: {
        url: '/basicdata/treedata.api'
      },
      // 获取基础资料房屋的每个层级的数据
      getbasedata: {
        url: '/basicdata/getbasedata'
      },
      // 搜索所有资源数据
      searchbasedata: {
        url: '/basicdata/searchbasedata'
      },
      // 获取项目详情
      villageInfo: {
        url: '/basicdata/villageinfo'
      },
      // 项目编辑接口
      villageEdit: {
        url: '/basicdata/villageeidt'
      },
      // 获取楼栋信息
      buildInfo: {
        url: '/basicdata/buildinginfo'
      },
      // 楼栋编辑接口
      buildEdit: {
        url: '/basicdata/buildingedit'
      },
      // 楼栋编辑接口
      buildType: {
        url: '/basicdata/buildingstructuretypedata'
      },
      // 获取房间信息
      roomInfo: {
        url: '/basicdata/roomsdata'
      },
      // 修改房屋信息
      editrooms: {
        url: '/basicdata/editrooms'
      },
      // 修改房屋入住状态
      setintohouse: {
        url: '/basicdata/setintohouse'
      },
      // 获取业主信息
      ownerInfo: {
        url: '/basicdata/ownerinfo'
      },
      // 业主编辑接口
      ownerEdit: {
        url: '/basicdata/owneredit'
      },
      // 获取客户类型
      userType: {
        url: '/basicdata/roomstypedata'
      },
      // 添加房屋人员
      addOwner: {
        url: '/basicdata/addownerrooms'
      },
      // 房产过户
      roomsChange: {
        url: '/basicdata/ownerroomschange'
      },
      // 房产变更日志
      logData: {
        url: '/basicdata/logdata'
      },
      // 获取某个类型的全部操作日志
      logdataall: {
        url: '/basicdata/logdataall'
      },
      // 客户迁出
      emigration: {
        url: '/basicdata/ownerroomsdel'
      },
      // 客户计费状态改变接口
      charge: {
        url: '/basicdata/editownerroomscharge'
      },
      // 获取车位资源类型
      parkResource: {
        url: '/basicdata/resourcescardata'
      },
      // 获取树形固定车位
      parking: {
        url: '/basicdata/fixparking'
      },
      // 添加固定车位
      addfixcar: {
        url: '/car/addfixcar'
      },
      //卡片重新下发
      cardAgain: {
        url: '/iccard/card_again'
      },

      // 获取固定车位详情
      parkingInfo: {
        url: '/basicdata/fixparkinginfo'
      },
      // 修改固定车位信息
      parkingEdit: {
        url: '/basicdata/fixparkingedit'
      },
      // 删除固定车位车牌
      delPlate: {
        url: '/basicdata/carmotordel'
      },
      // 获取固定车位数量
      stallNumber: {
        url: '/basicdata/fixparkingcount'
      },
      // 修改固定车资源类型和科目
      editcarsub: {
        url: '/car/editcarresourcestype'
      },
      // 获取固定车关联的非机动车列表
      carbyfixcar: {
        url: '/basicdata/getnomotorcarbyfixcar'
      },
      // 固定车解绑非机动车
      unbindnomotor: {
        url: '/basicdata/unbindnomotorcarbyfixcar'
      },
      // 车位过户
      carRemove: {
        url: '/basicdata/transfercar'
      },
      // 车位过户之前预先检查是否存在欠费提示
      checkhascost: {
        url: '/basicdata/checktransfercarhascost'
      },
      // 修改月租车位信息
      monthParkingEdit: {
        url: '/basicdata/monthcaredit'
      },
      // 修改月租车资源类型和科目
      monthresourcesedit: {
        url: '/car/editcarmonthresourcestype'
      },
      // 获取树形月租车位
      monthParking: {
        url: '/basicdata/monthcar'
      },
      // 获取月租车详情
      monthParkingInfo: {
        url: '/basicdata/monthcarinfo'
      },
      // 月租车报停、启用
      monthStartStop: {
        url: '/basicdata/stopstartmonthcar'
      },
      // 解绑月租车的业主
      monthUnbind: {
        url: '/basicdata/unbindcarmonthowner'
      },
      // 月租车变更业主
      changeOwner: {
        url: '/basicdata/changecarnonthowner'
      },
      // 删除月租车
      delmonthcar: {
        url: '/basicdata/delmonthcar'
      },
      // 获取月租车停用启用记录
      carmonthstoplog: {
        url: '/basicdata/carmonthstoplog'
      },
      // 删除非机动车
      delcarnomotor: {
        url: '/basicdata/delcarnomotor'
      },
      // 获取树形非机动车
      novehicle: {
        url: '/basicdata/nomotordata'
      },
      // 获取非机动车详情
      novehicleInfo: {
        url: '/basicdata/nomotorinfo'
      },
      // 非机动车编辑
      novehicleEdit: {
        url: '/basicdata/nomotoredit'
      },
      // 获取客户下面绑定的固定车
      fixcarbyowner: {
        url: '/owner/searchfixcarbyowner'
      },
      // 获取内部车辆数据
      insideVehicle: {
        url: '/basicdata/carinsidetreedata'
      },
      // 获取内部车辆详情
      insideDetail: {
        url: '/basicdata/carinsideinfo'
      },
      // 编辑内部车辆信息
      insideEdit: {
        url: '/basicdata/carinsideedit'
      },
      // 删除内部车辆
      carinsidedel: {
        url: '/basicdata/carinsidedel'
      },
      // 重新下发
      issueCar: {
        url: '/car/issueagainbyphp'
      },
      // 获取下发失败数据列表
      issueTable: {
        url: '/basicdata/carissuefaillist'
      },
      // 获取非机动车下发失败数据
      issuefaillist: {
        url: '/basicdata/carnonmotorissuefaillist'
      },
      // 重新下发失败的非机动车数据
      nonissuefail: {
        url: '/basicdata/carnonmotoragainissuefail'
      },
      // 重新下发失败的车辆数据
      issueAgain: {
        url: '/basicdata/againissuefail'
      },
      // 获取车辆缴费信息
      carcostlog: {
        url: '/basicdata/carcostlog'
      },
      // 获取内部员工车辆分页列表
      batchTable: {
        url: '/basicdata/carinsidelist'
      },
      // 延长内部车到期时间
      delayTime: {
        url: '/basicdata/carinsideextendtime'
      },
      // 获取项目下的虚拟资源
      virtuaList: {
        url: '/basicdata/virtualresourcelist'
      },
      // 添加虚拟资源
      virtualAdd: {
        url: '/basicdata/addvirtualresource'
      },
      // 编辑虚拟资源
      virtualEdit: {
        url: '/basicdata/editvirtualresource'
      },
      // 获取虚拟资源详情
      virtualDetail: {
        url: '/basicdata/virtualresourceinfo'
      },
      // 修改虚拟资源类型
      editvirtualtype: {
        url: '/basicdata/editvirtualresourceresourcestype'
      },
      // 获取其它资源的资源类型数据
      virtualtypetree: {
        url: '/basicdata/getvirtualresourcestype'
      },
      // 获取车辆操作日志
      carecord: {
        url: '/basicdata/carecord'
      },
      // 获取业主名下的资源数量
      ownresources: {
        url: '/basicdata/getownerresourcesnum'
      },

      /** 客户管理 */

      // 获取客户树形数据
      clientTree: {
        url: '/owner/treedata'
      },

      // 搜索用户
      clientSearch: {
        url: '/owner/searchowner'
      },

      // 获取客户详情
      clientDetail: {
        url: '/owner/ownerinfo'
      },

      // 编辑业主信息
      editowner: {
        url: '/owner/editowner'
      },

      // 获取客户下面绑定的房屋
      userRooms: {
        url: '/owner/searchroombyowner'
      },

      // 获取亲属关系
      folkstype: {
        url: '/owner/folkstype'
      },

      // 添加客户
      addClient: {
        url: '/owner/addowner'
      },

      /** 资源类别处理 */

      // 获取资源类别数据
      resourceType: {
        url: '/basicdata/resourcestreedata'
      },
      // 资源类别详情
      resourceInfo: {
        url: '/basicdata/resourcesinfo'
      },
      // 新增资源类别
      resourceAdd: {
        url: '/basicdata/resourcesadd'
      },
      // 停用资源类别
      resourceStop: {
        url: '/basicdata/resourcesdel'
      },
      // 获取资源类型数据
      resourceOptions: {
        url: '/basicdata/getresourcestype'
      },
      // 修改资源类别
      editresources: {
        url: '/basicdata/editresources'
      },

      /** 车位启用 */

      // 获取树形固定车位数据
      parkingTree: {
        url: '/car/getparkingtreedata'
      },
      // 获取车位详情
      carportInfo: {
        url: '/car/parkinginfo'
      },
      // 车位绑定业主
      bindUser: {
        url: '/car/binduser'
      },

      /** 月租车登记 */

      // 获取月租车位信息
      monthParkInfo: {
        url: '/car/monthparkingnum'
      },
      // 月租车登记
      addMonthCar: {
        url: '/car/addmonthcar'
      },

      /** 内部车辆管理 */

      // 添加内部员工车辆
      addInsideCar: {
        url: '/car/addcarinside'
      },

      /** 非机动车登记 */

      // 获取非机动车数量
      nomotorNum: {
        url: '/car/nomotornum'
      },
      // 非机动车登记
      nomotorRegister: {
        url: '/car/addnomotorcar'
      },
      // 获取资源类型数据
      carType: {
        url: '/basicdata/resourcestype'
      },
      // 获取项目下是否存在非机动车临停车场
      gettemporary: {
        url: '/car/getvillagehastemporary'
      },

      /** 基础资料报表 */

      // 小区对比表
      villageTable: {
        url: '/reportstatistics/villagecontrast'
      },
      // 资源类别表
      resourceTable: {
        url: '/reportstatistics/resourcestypelist'
      },
      // 房产明细表
      roomTable: {
        url: '/reportstatistics/roomslist'
      },
      // 车位明细表
      carportTable: {
        url: '/reportstatistics/carlist'
      },
      // 其他资源明细
      otherTable: {
        url: '/reportstatistics/carmonthlist'
      },
      // 客户明细表
      clientTable: {
        url: '/reportstatistics/ownerlist'
      },
      // 房源客户明细表
      houseClientTable: {
        url: '/reportstatistics/ownerroomslist'
      },
      // 非机动车明细表
      carnonmotorlist: {
        url: '/reportstatistics/carnonmotorlist'
      },
      // 内部员工车报表
      carinsidelist: {
        url: '/reportstatistics/carinsidelist'
      },

      /** IC卡管理 */

      // 获取ic卡列表
      iclists: {
        url: '/iccard/lists'
      },
      // IC 卡详情
      carddetail: {
        url: '/iccard/detail'
      },
      // Ic卡回收
      reclaim: {
        url: '/iccard/reclaim'
      },
      // Ic卡删除
      card_delete: {
        url: '/iccard/card_delete'
      },
      // 单张制卡
      singlecard: {
        url: '/iccard/single_card'
      },
      // 批量制卡
      batchcard: {
        url: '/iccard/batch_card'
      },

      /** IC卡台账 */

      // 获取台账 卡列表
      standlist: {
        url: '/iccardrecord/list'
      },
      // 添加领用记录
      addrecord: {
        url: '/iccardrecord/add'
      },
      // 获取领用记录
      recordlist: {
        url: '/iccardrecord/record'
      },
    },
    Setting: {
      //基础设置类
      // 获取计算公式
      formulas: {
        url: '/setting/basic-setting/get-formula'
      },
      // 获取计量单位的值
      getUnit: {
        url: '/setting/basic-setting/get-unit'
      },
      // 获取科目类型
      subjectType: {
        url: '/setting/basic-setting/get-subject-type'
      },
      // 获取收费模式
      getpatterns: {
        url: '/setting/basic-setting/get-patterns'
      },
      // 获取单独设置资源类型
      getResourceTypes: {
        url: '/setting/basic-setting/get-resource-types'
      },
      // 获取收费模式
      getinvoices: {
        url: '/setting/basic-setting/get-invoice-name'
      },
      // 获取左侧树形节点数据
      treeData: {
        url: '/setting/basic-setting/index'
      },
      // 获取科目详情数据
      subDetail: {
        url: '/setting/basic-setting/read'
      },
      // 获取收费优先级数据
      billPriority: {
        url: '/setting/basic-setting/get-owner-type'
      },
      // 开启-关闭 末级科目
      openCloseSub: {
        url: '/setting/basic-setting/open-subject'
      },
      // 项目使用情况
      useCondition: {
        url: '/setting/basic-setting/get-subject-use-log'
      },
      // 新增科目
      newSubject: {
        url: '/setting/basic-setting/save'
      },
      // 更变日志
      subjectLog: {
        url: '/setting/basic-setting/get-subject-logs'
      },
      // 编辑科目 - 路由带参
      subEdit: {
        url: '/setting/basic-setting/update-subject'
      },
      // 新增费率
      addRate: {
        url: '/setting/basic-setting/addsubjectvillageprice'
      },
      // 获取项目科目下的价格数据
      rateDetail: {
        url: '/setting/basic-setting/getsubjectvillagepricelist'
      },
      // 修改项目科目下的计费时间的价格
      rateEdit: {
        url: '/setting/basic-setting/editsubjectvillageprice'
      },
      // 删除项目科目下的计费时间的价格
      rateDelete: {
        url: '/setting/basic-setting/delsubjectvillageprice'
      },

      /** 计费标准 */
      // 科目获取左侧树形节点数据
      chargeTree: {
        url: '/setting/basic-setting/get-subject-village-tree'
      },
      // 开启-关闭 末级科目
      subOpenClose: {
        url: '/setting/basic-setting/open-subject-village'
      },
      // 更新 计费标准设置
      uploadCharge: {
        url: '/setting/basic-setting/update-village'
      },
      // 科目--复制科目 - 到项目
      copySub: {
        url: '/setting/basic-setting/copy-subject'
      },
      // 科目管理 获取末级科目 数据
      endSubjects: {
        url: '/setting/basic-setting/get-end-subject-list'
      },
      // 计费标准变更日志
      chargeLog: {
        url: '/setting/basic-setting/get-village-use-log'
      },

      /** 单独标准设置 */
      // 表格数据列表
      aloneList: {
        url: '/setting/basic-setting/get-subject-village-list'
      },
      // 更变日志
      changeLog: {
        url: '/setting/basic-setting/get-village-by-rooms-log'
      },
      // 更新房源对应价格级科目信息
      infoEdit: {
        url: '/setting/basic-setting/update-village-by-rooms'
      },

      /** 计费关联设置 */
      //  科目关联资源列表
      resources: {
        url: '/setting/basic-setting/get-subject-relation-resources'
      },
      // 关联删除
      delResources: {
        url: '/setting/basic-setting/del-resources-subject-map'
      },
      // 资源与科目的关联
      relevanceSub: {
        url: '/setting/basic-setting/add-resources-subject-map'
      },
      // 资源信息
      sourceInfo: {
        url: '/setting/basic-setting/get-resources'
      },

      /** 生成欠费 */
      // 根据项目 获取所有科目信息
      subjectList: {
        url: '/setting/basic-setting/get-subject-by-village'
      },
      // 获取批次
      batchList: {
        url: '/setting/basic-setting/get-batch-list'
      },
      // 获取批次下资源列表数据（表格）
      batchRooms: {
        url: '/setting/basic-setting/get-rooms'
      },
      // 生成欠费接口
      generateArrears: {
        url: '/setting/basic-setting/generate-arrears'
      },
      // 生成欠费进程 数量
      processCounts: {
        url: '/setting/basic-setting/process-count'
      },
      // 更新记录
      batchLog: {
        url: '/setting/basic-setting/get-batch-log'
      },
      // 欠费生成 - 更新欠费操作日志
      updateFail: {
        url: '/setting/basic-setting/update-arrears-fail'
      },
      // 欠费生成 - 获取批量欠费报错日志
      errorLog: {
        url: '/setting/basic-setting/generate-arrears-error-log'
      },
      // 新增批次
      addBatch: {
        url: '/setting/basic-setting/batch-store'
      },
      // 获取 批次管理(批次对应楼栋信息)
      getBatchData: {
        url: '/setting/basic-setting/get-batch-by-building'
      },
      // 添加无关联批次的房源
      addrooms: {
        url: '/setting/basic-setting/add-rooms-by-batch'
      },

      /** 付款方式 */

      // 获取付款方式列表
      paymentList: {
        url: '/setting/basic-setting/payment-type-list'
      },
      // 区域下项目绑定的支付方式
      paymentOfVillage: {
        url: '/setting/basic-setting/payment-type-list-by-village'
      },
      // 新增付款方式
      addPayment: {
        url: '/setting/basic-setting/payment-type-store'
      },
      // 更变日志
      paymentLog: {
        url: '/setting/basic-setting/get-payment-type-log'
      },
      // 绑定解绑
      paymentUnbind: {
        url: '/setting/basic-setting/payment-type-bind'
      },
      // 开启、关闭
      paymentOpen: {
        url: '/setting/basic-setting/payment-type-open'
      },
      // 付款方式排序
      paymentSort: {
        url: '/setting/basic-setting/payment-type-update-sort'
      },

      /** 定额发票 */

      // 发票列表
      invoiceList: {
        url: '/quotabill/list'
      },
      // 获取大区定额票
      mainlist: {
        url: '/quotabill/mainlist'
      },
      // 录入大区下的定额发票
      addquo: {
        url: '/quotabill/addquotabillmain'
      },
      // 审核录入的大区发票
      examinemain: {
        url: '/quotabill/examinemain'
      },
      // 录入发票
      addBill: {
        url: '/quotabill/addquotabill'
      },
      // 检查发票是否存在
      checkbill: {
        url: '/quotabill/checkbill'
      },
      // 发放票据
      grantBill: {
        url: '/quotabill/grant'
      },
      // 审核录入的发票
      examine: {
        url: '/quotabill/examine'
      },
      // 移交发票
      transferuser: {
        url: '/quotabill/transferuser'
      },
      // 自定义发放
      customGrant: {
        url: '/quotabill/customgrant'
      },
      // 搜索审核人
      searchuser: {
        url: '/quotabill/searchuser'
      },
      // 获取领用人
      getcollaruser: {
        url: '/quotabill/getcollaruser'
      },
      // 审核缴销
      examinecancel: {
        url: '/quotabill/examinecancel'
      },

      /** 收据管理 */

      // 获取电子收据开票人数据
      getelectronic: {
        url: '/setting/basic-setting/getelectronicreceiptcreate'
      },
      // 电子收据列表
      receiptlist: {
        url: '/setting/basic-setting/electronicreceiptlist'
      },
      // 打印电子收据
      receiptprint: {
        url: '/setting/basic-setting/printelectronicreceipt'
      },
      // 作废电子收据
      receiptcancel: {
        url: '/setting/basic-setting/cancelelectronicreceipt'
      },

      /** 纸质收据 */

      // 获取纸质收据列表数据
      paperreceiptlist: {
        url: '/setting/basic-setting/receipt-list'
      },
      // 获取纸质收据 录入收据
      addreceipt: {
        url: '/setting/basic-setting/add-bill-receipt'
      },
      // 获取发放明细
      grantdetails: {
        url: '/setting/basic-setting/receipt-grant-details'
      },
      // 发放到大区
      receiptgrant: {
        url: '/setting/basic-setting/receipt-grant'
      },
      // 发放到个人
      receiptmember: {
        url: '/setting/basic-setting/receipt-grant-member'
      },
      // 获取收据发放用户
      getmember: {
        url: '/setting/basic-setting/get-receipt-member'
      },
      // 移交收据
      moveReceipt: {
        url: '/setting/basic-setting/grant-member-by-receipt'
      },
      // 拆分收据
      receipttransfer: {
        url: '/setting/basic-setting/receipt-transfer'
      },

      /** 交账管理 */

      // 表格数据列表
      manageList: {
        url: '/setting/order/get-account-record-manage-list'
      },

      // 表格数据列表
      accountList: {
        url: '/setting/order/get-account-record-list'
      },
      // 账单详情数据
      recordInfoList: {
        url: '/setting/order/get-account-record-info-list'
      },
      // 交账申请 - 重新提交
      accountAudit: {
        url: '/setting/order/apply-account-record'
      },
      // 交账记录 获取交账订单明细、打印
      orderDetail: {
        url: '/setting/order/get-details-by-id'
      },
      // 交账记录详情
      accountDetail: {
        url: '/setting/order/get-account-record-details'
      },
      // 撤回交账
      revAccount: {
        url: '/setting/order/with-draw-account-record'
      },
      // 交账 驳回、通过
      accountApprove: {
        url: '/setting/order/pass-or-refuse-account-record'
      },
      // 交账管理 - 交账删除
      accountdel: {
        url: '/setting/order/del-account-record'
      },
      // 获取上次提交时间
      lastTime: {
        url: '/setting/order/get_account_record_last_time'
      }
    },
    Charge: {
      /** vip 退款 */

      // 获取能进行vip退款的科目信息
      vipSubject: {
        url: '/charge/getviprefundsubject'
      },
      // 查询vip支付方式的科目缴费数据
      vipChargeInfo: {
        url: '/charge/viprefundsearchsubject'
      },
      // 进行VIP退款
      vipRefund: {
        url: '/charge/viprefundtiem'
      },

      /** 装修信息 */
      // 获取房屋或虚拟资源的装修预展示信息
      fitmentInfo: {
        url: '/house/houserenovationdetail'
      },
      // 获取装修缴费的科目
      fitmentSub: {
        url: '/house/getrenovationsubject'
      },
      // 开始装修
      fitmentStart: {
        url: '/house/startrenovation'
      },
      // 追加装修订单
      appendren: {
        url: '/house/appendrenovationsn'
      },
      // 获取资源的装修信息
      fitmentResource: {
        url: '/house/renovationdetail'
      },
      // 结束装修
      fitmentEnd: {
        url: '/house/endrenovation'
      },
      // 设置入场时间
      settime: {
        url: '/house/setapproachtime'
      },

      /** 添加收费 */

      // 获取项目开收据类型
      getreceipttype: {
        url: '/charge/getvillagereceipttype'
      },
      // 获取科目收费公式
      getformula: {
        url: '/charge/getsubjectformula'
      },
      // 搜索缴费主体
      searchdata: {
        url: '/charge/searchdata'
      },
      // 获取项目下面的缴费科目
      getsubject: {
        url: '/charge/getsubject'
      },
      // 获取资源科目关联数据
      subjectlist: {
        url: '/charge/resourcessubjectlist'
      },
      // 获取资源科目关联数据
      getMonthDay: {
        url: '/charge/getvillagecarmonthpayday'
      },
      // 获取科目收费模版
      billtemplate: {
        url: '/charge/getbilltemplate'
      },
      // 预览生成欠费明细
      chargepreview: {
        url: '/charge/previewcreatearrears'
      },
      // 生成欠费
      createarrears: {
        url: '/charge/createarrears'
      },
      // 获取资源下面的欠费数据
      getresourcesarrears: {
        url: '/charge/getresourcesarrears'
      },
      // 获取选中资源的预缴信息
      sourcesprepayment: {
        url: '/charge/getresourcesprepayment'
      },
      // 获取车辆最后一次缴费信息
      getcarlastcost: {
        url: '/charge/getcarlastcost'
      },
      // 获取项目下的支付方式
      getpaymenttype: {
        url: '/charge/getpaymenttype'
      },
      // 获取所选资源的缴费时间类型
      paytimetype: {
        url: '/charge/getresourcespaytimetype'
      },
      // 获取科目下的缴费价格和计量单位（临时收费使用）
      subjectpriceunit: {
        url: '/charge/subjectpriceunit'
      },
      // 获取用户余额
      getownerbalance: {
        url: '/charge/getownerbalance'
      },
      // 获取当前登录用户正在使用的收据号
      userusereceipt: {
        url: '/charge/getloginuserusereceipt'
      },
      // 进行缴费
      addsn: {
        url: '/charge/addsn'
      },
      // 获取免单支付方式的id
      getfreeid: {
        url: '/charge/getfreeorderpayment'
      },
      // 获取订单开票的信息
      getsnreceipt: {
        url: '/charge/getsnreceipt'
      },
      // 获取房屋下绑定的人员（收费切换数据）
      getroomsowner: {
        url: '/charge/getroomsowner'
      },
      // 获取业主名下的所有欠费信息
      getownerarrears: {
        url: '/charge/getownerarrears'
      },
      // 获取资源详情
      getResource: {
        url: '/charge/resourcesinfo'
      },
      // 获取业主名下的其它资源信息
      getOtherResource: {
        url: '/charge/ownerresources'
      },
      // 生成临时性收费的临时数据
      createarrearstemp: {
        url: '/charge/createarrearstemp'
      },
      // 设置房屋为已交房
      setRoomCheck: {
        url: '/charge/setroomcheck'
      },

      /** 历史缴费记录 */
      // 获取历史缴费记录
      historycost: {
        url: '/charge/historycost'
      },
      // 获取订单缴费明细
      sndetail: {
        url: '/charge/sndetail'
      },
      // 修改支付方式
      changepaytype: {
        url: '/charge/changepaytype'
      },
      // 返销订单
      resalesn: {
        url: '/charge/resalesn'
      },

      /** 欠费调整 */
      // 获取欠费列表
      getArrearages: {
        url: '/charge/getresourcesarrearshasapply'
      },
      // 获取欠费信息详情
      arrearagesDetail: {
        url: '/charge/getarrearsdetail'
      },
      // 提交修改欠费金额审批
      arrearagesEdit: {
        url: '/charge/editarrearsapply'
      },
      // 获取资源下的业主信息
      resourceOwner: {
        url: '/charge/getresourcesowner'
      },

      /** 退款管理 */
      // 获取退款的欠费信息列表
      refundList: {
        url: '/charge/getrefundcostlist'
      },
      // 进行退款
      refundCost: {
        url: '/charge/refundcost'
      },
      // 获取可以退款的科目数据
      refundsubject: {
        url: '/charge/getrefundsubject'
      },

      /** 订单管理 */
      // 获取订单列表
      orderList: {
        url: '/charge/orderlist'
      },
      // 补开收据
      repairReceipt: {
        url: '/charge/repairreceipt'
      },
      // 补开发票
      repairinvoice: {
        url: '/charge/repairinvoice'
      },
      // 订单植入发票
      importsninvoice: {
        url: '/charge/importsninvoice'
      },
      // 换票
      changetickets: {
        url: '/charge/changetickets'
      },
      // 下载发票
      getinvoiceinfo: {
        url: '/charge/getinvoiceinfo'
      },
      // 获取发票类型
      getfptype: {
        url: '/charge/getfptype'
      },
      // 获取电子收据二维码访问结果
      getqrcode: {
        url: '/charge/electronicreceiptqrcodeinfo'
      },
      // 打印收据，或是下发发票
      issueReceipt: {
        url: '/charge/getreceiptinfo'
      },
      // 获取订单小程序二维码
      getwxqrcode: {
        url: '/charge/createappletsqrcode'
      },

      /** 水电录入 */
      // 获取三表资源类型
      waterresourcestype: {
        url: '/charge/getwaterresourcestype'
      },
      // 获取资源数据
      searchdatabyweg: {
        url: '/charge/searchdatabyweg'
      },
      // 获取三表类型（搜索使用）
      watersearchtype: {
        url: '/charge/getwatersearchtype'
      },
      // 搜索水电气表数据
      searchwater: {
        url: '/charge/searchwater'
      },
      // 初始水电录入
      initwater: {
        url: '/charge/initwater'
      },
      // 修改三表的表名
      editwatername: {
        url: '/charge/editwatername'
      },
      // 修改三表的信息
      editwater: {
        url: '/charge/editwater'
      },
      // 录入水电气使用数量并生成欠费
      inputwaternumber: {
        url: '/charge/inputwaternumber'
      },
      // 获取水电气欠费缴费明细
      watercostlist: {
        url: '/charge/watercostlist'
      },
      // 删除水电气欠费
      watercostdel: {
        url: '/charge/watercostdel'
      },
      // 获取三表的目前读数
      getwegnumber: {
        url: '/charge/getwegnumber'
      },
      // 获取水电录入excel导入模版
      waterexcel: {
        url: '/charge/getimportwaterexcel'
      },
      // 从excel中导入水电录入数据
      waterbyexcel: {
        url: '/charge/importwaterbyexcel'
      },
      // 批量录入水电表数量并生成欠费
      batchwaterel: {
        url: '/charge/inputwaternumbermany'
      },

      /** 其他收费 */
      // 添加临时收费订单
      addtempsn: {
        url: '/charge/addtempsn'
      },

      /** 欠费管理 */
      // 查询出末级科目数据
      villageend: {
        url: '/charge/getsubjectvillageend'
      },
      // 获取欠费统计数据
      scountlist: {
        url: '/charge/searcharrearscountlist'
      },
      // 获取欠费原因数据
      getarrearsreson: {
        url: '/charge/getarrearsreson'
      },
      // 给欠费数据设置欠费原因
      setarrearsreson: {
        url: '/charge/setarrearsreson'
      },
      // 欠费发送催收短信
      sendmsgarrears: {
        url: '/charge/sendmsgarrears'
      },
      // 获取发送短信列表
      getsendmsglist: {
        url: '/charge/getsendmsglist'
      },
      // 重新发送失败的短信
      sendmsgagain: {
        url: '/charge/sendmsgagain'
      },
      // 新增欠费说明
      costaddreason: {
        url: '/charge/costaddreason'
      },
      // 编辑欠费说明
      costeditreason: {
        url: '/charge/costeditreason'
      },
      // 删除欠费说明
      costdelreason: {
        url: '/charge/costdelreason'
      },
      // 获取欠费说明列表
      costreasonlist: {
        url: '/charge/costreasonlist'
      },
      // 获取欠费周期数据
      getcostcycle: {
        url: '/charge/getcostcycle'
      },
      // 计算拆分欠费时间段的金额
      costsplitmoney: {
        url: '/charge/countcostsplitmoney'
      },
      // 拆分欠费
      splitcost: {
        url: '/charge/splitcost'
      },
      // 批量删除欠费
      delcost: {
        url: '/charge/delcost'
      },

      /** 收费管理 */

      // 获取已缴费的欠费明细
      searchpaycost: {
        url: '/charge/searchpaycost'
      },
      // 验证该科目选择的资源类型是不是房屋
      checksubjecttype: {
        url: '/charge/checksubjecttype'
      },

      /** 预存明细 */

      // 获取用户余额数据
      balancelist: {
        url: '/charge/ownerbalancelist'
      },
      // 获取用户余额变动日志
      balancelog: {
        url: '/charge/ownerbalancelog'
      },
      // 余额转移
      balancemove: {
        url: '/charge/transferownerbalance'
      },

      /** 票据缴纳 */

      // 缴费发票列表
      cancellist: {
        url: '/quotabill/cancellist'
      },
      // 获取面值数据
      getfacevalue: {
        url: '/quotabill/getfacevalue'
      },
      // 部分缴销
      cancelsection: {
        url: '/quotabill/cancelsection'
      },
      // 发票缴销明细
      cancellog: {
        url: '/quotabill/cancellog'
      },
      // 批量缴销
      batchCancel: {
        url: '/quotabill/cancel'
      },
      // 撤回缴销明细
      removecancel: {
        url: '/quotabill/removecancel'
      },
      // 缴销合计记录
      cancelcountlog: {
        url: '/quotabill/cancelcountlog'
      },
      // 查询指定日期的未提交合计的缴销记录
      searchcancel: {
        url: '/quotabill/searchcancel'
      },
      // 添加缴销统计
      addcancelcount: {
        url: '/quotabill/addcancelcount'
      },
      // 撤回缴销合计记录
      removecount: {
        url: '/quotabill/removecount'
      },
      // 获取缴销合计明细
      cancelcountinfo: {
        url: '/quotabill/cancelcountinfo'
      },

      /** 一键划账 */
      // 获取三表欠费的统计数据
      getwegarrears: {
        url: '/charge/getwegarrears'
      },
      // 批量划账（水电气三表欠费缴纳）
      batchbalance: {
        url: '/charge/batchbalancepaycost'
      },
      // 获取三表绑定资源类型搜索条件
      resourceList: {
        url: '/charge/getwegresourcestype'
      },
      // 获取一键划账的欠费数据
      transferarrears: {
        url: '/charge/gettransferarrears'
      },
      // 批量一键划账
      batchbalancepaycost: {
        url: '/charge/batchbalancepaycost'
      },
      // 获取预存款格式化规则
      getadvanceformat: {
        url: '/charge/getadvanceformat'
      },

      /** 附件管理 */

      // 获取附件列表
      getfilelist: {
        url: '/file/getfilelist'
      },
      // 预览附件
      viewfile: {
        url: '/file/viewfile'
      },
      // 获取附件所属的操作明细
      filedetail: {
        url: '/file/filecreatedatadetail'
      },
    },
    Assist: {
      /** 批量打票 */

      // 获取三表的资源类型id
      resourcetypeid: {
        url: '/assist/getwegresourcetypeid'
      },
      // 按照资源查询指定科目的欠费数据
      subjectarrears: {
        url: '/assist/resourcessubjectarrears'
      },
      // 批量打票（添加未交费订单，并开收据）
      batchopensn: {
        url: '/assist/batchopensn'
      },
      // 查询未缴费的订单数据
      nopayorder: {
        url: '/assist/nopayorder'
      },
      // 批量确认收款
      batchcollectionsn: {
        url: '/assist/batchcollectionsn'
      },
      // 批量生成已缴费订单
      batchopenpaysn: {
        url: '/assist/batchopenpaysn'
      },
      // 查询已缴费的订单数据
      haspayorder: {
        url: '/assist/haspayorder'
      },
      // 批量打印收据
      batchprint: {
        url: '/assist/batchprintreceipt'
      },
    },
    Report: {
      // 实收统计报表
      sstatistics: {
        url: '/reportstatistics/netreceiptsstatistics'
      },
      // 应收统计报表
      ystatistics: {
        url: '/reportstatistics/receivablestatistics'
      },
      // 欠费统计报表
      arrearsstatistics: {
        url: '/reportstatistics/arrearsstatistics'
      },
      // 获取预收统计表查询科目数据
      getadvancesub: {
        url: '/reportstatistics/getadvancecollectsubjectdata'
      },
      // 预收统计报表
      advanceTable: {
        url: '/reportstatistics/advancecollectstatistics'
      },
      // 退款统计报表
      refundstatistics: {
        url: '/reportstatistics/refundstatistics'
      },
      // 业主及房产统计表
      ownerrooms: {
        url: '/reportstatistics/ownerroomsstatistics'
      },
      // 项目的资源明细表
      villageresources: {
        url: '/reportstatistics/villageresourcesinfostatistics'
      },
      // 财务月报表
      financemonth: {
        url: '/reportstatistics/financemonthstatistics'
      },
      // 财务月报表明细数据
      financemonthinfo: {
        url: '/reportstatistics/financemonthstatisticsinfo'
      },
      // 现金台账表
      cashaccount: {
        url: '/reportstatistics/cashaccountstatistics'
      },
      // 组合报表
      combination: {
        url: '/reportstatistics/combinationstatistics'
      },
      // 获取三表缴费的科目
      getwegsubject: {
        url: '/reportstatistics/getwegsubject'
      },
      // 三表抄表统计报表
      wegcoststat: {
        url: '/reportstatistics/wegcoststatistics'
      },
      // 预算统计报表
      budgetstatistics: {
        url: '/reportstatistics/budgetstatistics'
      },
      // 分摊统计报表
      sharestatistics: {
        url: '/reportstatistics/sharestatistics'
      },
      // 停车场收费统计报表
      carrecords: {
        url: '/reportstatistics/carrecordstatistics'
      },
      // 计费管理报表
      coststatistics: {
        url: '/reportstatistics/costcountstatistics'
      },
      // 获取报表查询结果
      getworkerquerynum: {
        url: '/reportstatistics/getworkerquerynum'
      },
      // 删除查询队列里没执行完成的任务
      delselectlist: {
        url: '/reportstatistics/delselectlist'
      },
      // 新建查询
      addreportquery: {
        url: '/reportstatistics/addreportquery'
      },
      // 下载查询报表结果文件
      downloadreportfile: {
        url: '/reportstatistics/downloadreportfile'
      },
      // 获取用户查询报表记录
      getquerylist: {
        url: '/reportstatistics/getreportquerylist'
      },
      // 重新查询报表
      againreportquery: {
        url: '/reportstatistics/againreportquery'
      },
      // 获取报表查询结果内容
      reportquerydetail: {
        url: '/reportstatistics/reportquerydetail'
      },
      // 押金统计报表
      deposits: {
        url: '/reportstatistics/depositstatistics'
      },
      // 预存款统计表
      advancedeposits: {
        url: '/reportstatistics/advancedepositstatistics'
      },
      // 获取押金类科目数据
      depositsubject: {
        url: '/reportstatistics/getdepositsubjectdata'
      },
    },
    Car: {
      /** 停车场列表 */

      // 获取海康停车场数据
      carparklistbyhk: {
        url: '/car/carparklistbyhk'
      },

      /** 车辆查询 */

      // 查询车辆信息（海康）
      searchCarInfo: {
        url: '/car/searchcarmotorhk'
      },
      // 获取车辆缴费记录
      carpaylog: {
        url: '/car/carpaylog'
      },
      // 获取车辆过车记录
      carpassinglog: {
        url: '/car/carpassinglog'
      },

      /** 临停车辆记录 */

      // 获取停车场数据
      carparkdata: {
        url: '/car/getcarparkdata'
      },
      // 临停车辆记录
      tempcarrecord: {
        url: '/car/tempcarrecord'
      },
      // 获取停车场上一次临停订单信息
      parklastcost: {
        url: '/car/getparklastcost'
      },
      // 查询时间段的临停费用
      searchmoney: {
        url: '/car/searchtempcarmoney'
      },
      // 生成现金临停费用订单
      createtempcarsn: {
        url: '/car/createtempcarsn'
      }
    },
    ParkManage: {
      // 获取闸机类型、闸机位置、充电桩类型

      //获取开锁记录
      gate_unlock_record: {
        url: '/cartemporary/gate_unlock_record'
      },

      resources: {
        url: '/cartemporary/resources'
      },
      // 闸机列表
      gates: {
        url: '/cartemporary/gates'
      },
      // 更新状态
      update_status: {
        url: '/cartemporary/gate_online_status'
      },
      // 远程开锁
      gate_open: {
        url: '/cartemporary/gate_open'
      },
      //闸机上门禁卡重新下发
      gate_card_again: {
        url: '/cartemporary/gate_card_again'
      },
      // 获取收费模板
      modes: {
        url: '/cartemporary/modes'
      },
      // 获取收费模板
      estatelist: {
        url: '/cartemporary/getEstateList'
      },
      // 获取收费模板
      devicelist: {
        url: '/cartemporary/getDeviceList'
      },
      // 添加车场
      addcar: {
        url: '/cartemporary/addcar'
      },
      // 车场列表
      cars: {
        url: '/cartemporary/cars'
      },
      // 车场详情
      cardetail: {
        url: '/cartemporary/cardetail'
      },
      // 添加闸机
      addgate: {
        url: '/cartemporary/addgate'
      },
      // 删除闸机
      gatedelete: {
        url: '/cartemporary/gate_delete'
      },
      // 添加临时卡
      addCard: {
        url: '/cartemporary/gate_temp_card'
      },
      // 添加充电桩
      addpile: {
        url: '/cartemporary/addchargepile'
      },
      // 充电桩详情
      chargeOrders: {
        url: '/cartemporary/getChargeOrders'
      },
      // 车场列表数据
      allcars: {
        url: '/cartemporary/allcars'
      },
      // 闸机状态更新
      gatestatus: {
        url: '/cartemporary/gatestatus'
      },
      // 充电桩列表
      chargepiles: {
        url: '/cartemporary/chargepiles'
      },
      // 充电桩状态更新
      chargepilestatus: {
        url: '/cartemporary/chargepilestatus'
      },
      // 收费模板列表
      charges: {
        url: '/cartemporary/charges'
      },
      // 收费模板状态更新
      chargestatus: {
        url: '/cartemporary/chargestatus'
      },
      // 添加收费模板
      addcharge: {
        url: '/cartemporary/addcharge'
      },
      // 应用车场
      applied: {
        url: '/cartemporary/applied'
      },
      // 收费模板应用车场详情
      appliedcars: {
        url: '/cartemporary/appliedcars'
      },
      // 临停收费
      orders: {
        url: '/cartemporary/orders'
      },
      // 临停收费
      status: {
        url: '/cartemporary/status'
      },
      // 闸机指令列表
      command_list: {
        url: '/cartemporary/gate_command_list'
      },
    },
    Contract: {
      // 获取合同类型
      contractType: {
        url: '/contract/getcontracttype'
      },
      // 获取合同列表
      contractList: {
        url: '/contract/contractlist'
      },
      // 获取合同详情
      contractDetail: {
        url: '/contract/contractdetail'
      },
      // 获取合同下绑定的项目
      contractVillage: {
        url: '/contract/getcontractvillage'
      },
      // 添加收款计划
      addplan: {
        url: '/contract/addplan'
      },
      // 根据部门获取项目
      getvillagebydep: {
        url: '/contract/getvillagebydep'
      },
      // 根据项目id获取所绑定项目的科目
      getsubjectbyvillage: {
        url: '/contract/getsubjectbyvillage'
      },
      // 根据项目
      getdepandvillage: {
        url: '/contract/getdepandvillage'
      },
      // 修改收款计划
      editplan: {
        url: '/contract/editplan'
      },
      // 审核收款计划
      examineplan: {
        url: '/contract/examineplan'
      },
      // 收款计划详情
      detailplan: {
        url: '/contract/detailplan'
      },
      // 收款计划进行收款
      collectionplan: {
        url: '/contract/collectionplan'
      },
      // 标记计划为已收款
      signplan: {
        url: '/contract/signplan'
      },
      // 删除收款计划
      delplan: {
        url: '/contract/delplan'
      },
      // 终止收款计划
      stopplan: {
        url: '/contract/stopplan'
      },
      // 收款计划进行退款
      refundplan: {
        url: '/contract/refundplan'
      },
      // 获取即将到期合同数据
      expireList: {
        url: '/contract/getexpireplancontract'
      },
      // 根据部门表id获取所绑定项目的科目
      subjectbydep: {
        url: '/contract/getsubjectbydep'
      },
      // 设置合同起止日期
      settime: {
        url: '/contract/settime'
      },
      // 修改合同类型
      edittype: {
        url: '/contract/edittype'
      },
      // 获取合同下的收款计划的欠费明细
      plancost: {
        url: '/contract/getcontractplancost'
      },
      // 生成欠费（审核通过的合同）
      createplancost: {
        url: '/contract/createplancost'
      }
    },
    Custom: {
      /** 通知公告 */

      // 获取通知公告列表
      circularlist: {
        url: '/customer/circularlist'
      },
      // 新增公告
      addcircular: {
        url: '/customer/addcircular'
      },
      // 编辑公告
      editcircular: {
        url: '/customer/editcircular'
      },
      // 获取公告详情
      circulardetail: {
        url: '/customer/circulardetail'
      },
      // 编辑公告的单个状态字段（是否显示，是否置顶）
      circularfield: {
        url: '/customer/setcircularsinglefieldstatus'
      },
      // 删除通知公告
      delcircular: {
        url: '/customer/delcircular'
      },

      /** 报事报修 */

      // 获取报事报修类型
      getrepairtype: {
        url: '/customer/getrepairtype'
      },
      // 获取报事报修列表
      repairlist: {
        url: '/customer/repairlist'
      },
      // 搜索业主以及绑定的房屋信息
      searchrooms: {
        url: '/customer/searchownerrooms'
      },
      // 添加报事报修
      addrepair: {
        url: '/customer/addrepair'
      },
      // 获取报事报修详情
      repairdetail: {
        url: '/customer/repairdetail'
      },
      // 获取可以进行派单的人员数据
      handleuser: {
        url: '/customer/getrepairhandleuser'
      },
      // 搜索改派工单的人员数据
      nmentusers: {
        url: '/customer/getreassignmentusers'
      },
      // 报事报修进行派单
      repairdispatch: {
        url: '/customer/repairdispatch'
      },
      // 报事报修处理完成
      repairhandle: {
        url: '/customer/repairhandle'
      },
      // 报事报修改派
      repairchange: {
        url: '/customer/repairchange'
      },
      // 报事报修回访
      returnvisit: {
        url: '/customer/repairreturnvisit'
      },
      // 报事报修超过5天升级（定时器每小时运行一次）
      repairtimeout: {
        url: '/customer/repairtimeout'
      },
      // 报事报修闭单
      repairclose: {
        url: '/customer/repairclose'
      },

      /** 投诉建议 */

      // 获取投诉建议列表
      complaintlist: {
        url: '/customer/complaintlist'
      },
      // 添加投诉建议
      addcomplaint: {
        url: '/customer/addcomplaint'
      },
      // 获取投诉建议详情
      complaintdetail: {
        url: '/customer/complaintdetail'
      },
      // 获取可以进行派单的人员数据
      complaintUser: {
        url: '/customer/getcomplainthandleuser'
      },
      // 投诉建议进行派单
      compdispatch: {
        url: '/customer/complaintdispatch'
      },
      // 投诉建议处理完成
      complainthandle: {
        url: '/customer/complainthandle'
      },
      // 投诉建议改派
      complaintchange: {
        url: '/customer/complaintchange'
      },
      // 投诉建议回访
      complreturn: {
        url: '/customer/complaintreturnvisit'
      },
      // 投诉建议闭单
      complaintclose: {
        url: '/customer/complaintclose'
      },
      // 投诉建议升级（定时器每小时运行一次）
      complainttimeout: {
        url: '/customer/complainttimeout'
      },

      /** 楼栋管家 */

      // 获取楼栋管家列表
      buildings: {
        url: '/customer/buildingstewardlist'
      },
      // 更换单元管家
      editunitsteward: {
        url: '/customer/editunitsteward'
      },
      // 修改楼栋管家联系方式
      editstewardtel: {
        url: '/customer/editstewardtel'
      },

      /** 短信推送 */

      // 获取短信推送记录
      smslist: {
        url: '/sms/smssendcountlist'
      },
      // 发送短信
      sendmsg: {
        url: '/sms/sendmsg'
      },
      // 获取发送短信明细
      getmsglist: {
        url: '/sms/getsendmsglist'
      },
      // 重新发送失败的短信
      sendmsgagain: {
        url: '/sms/sendmsgagain'
      },

      /** 短信模板管理 */

      // 获取短信模版列表
      smstemps: {
        url: '/sms/smstemplatelist'
      },
      // 设置短信模版状态
      setstatus: {
        url: '/sms/setstatus'
      },
      // 获取绑定了某个短信模版的项目数据
      tempvillage: {
        url: '/sms/gettemplatevillage'
      },
      // 保存短信模版所绑定的项目
      savevillage: {
        url: '/sms/savetemplatevillage'
      },
      // 获取短信模版预制内容
      smsconfig: {
        url: '/sms/getvalueconfig'
      },
      // 添加短信模版
      addsmstemp: {
        url: '/sms/addsmstemplate'
      },
      // 编辑短信模版
      editsmstemp: {
        url: '/sms/editsmstemplate'
      },
      // 获取问卷调查数据
      getquest: {
        url: '/sms/getquestionnaire'
      },
      // 获取短信模版内容
      tempdetail: {
        url: '/sms/getsmstemplate'
      },
      // 获取短信模版内容大致长度以及使用短信条数
      tempcontent: {
        url: '/sms/countcontentlength'
      },

      /** 问卷调查 */
      // 获取问卷调查列表
      questList: {
        url: '/question/index'
      },
      // 获取题库列表
      topicList: {
        url: '/question/getProblem'
      },
      // 问卷调查-新增
      questAdd: {
        url: '/question/storeQuestion'
      },
      // 问卷调查-问题新增
      problemAdd: {
        url: '/question/storeProblem'
      },
      // 查询结果 统计(分数/选择)
      getCommentCount: {
        url: '/question/getCommentCount'
      },
      // 获取评论列表信息 分页
      getComment: {
        url: '/question/getComment'
      },
      // 问卷调查导出
      questexport: {
        url: '/question/export'
      },
      // 综合服务列表
      getComprehensiveList: {
        url: '/customer/getComprehensiveList'
      },
      // 来访查询
      visitHistory: {
        url: '/customer/visitHistory'
      },
      // 获取活动列表
      getActivityList: {
        url: '/customer/getActivityList'
      },
      // 添加活动
      addActivity: {
        url: '/customer/addActivity'
      },
      // 修改活动
      editActivity: {
        url: '/customer/editActivity'
      },
      // 删除活动
      delActivity: {
        url: '/customer/delActivity'
      },
      // 发布活动
      pubActivity: {
        url: '/customer/pubActivity'
      },
    },
    Application: {
      // 获取应用列表
      applist: {
        url: '/application/applist'
      },
      // 添加应用
      addapplication: {
        url: '/application/addapplication'
      },
      // 编辑应用
      editapplication: {
        url: '/application/editapplication'
      },
      // 获取应用在项目下的配置
      applicationvillage: {
        url: '/application/applicationvillage'
      },
      // 保存应用在项目下的单独配置
      saveapplication: {
        url: '/application/editapplicationvillage'
      },
      // 获取项目下的应用配置
      villageapplication: {
        url: '/application/villageapplication'
      },
      // 保存项目下的应用配置
      editvillageapp: {
        url: '/application/editvillageapplication'
      }
    },
    System: {
      // 系统设置类
      village: {
        //项目
        list: {
          // 获取项目列表
          url: '/village/list.api',
          token: 'List-AozQhuLqiXr681tFpjNAXl8Zv'
        },
        add: {
          // 新增项目数据
          url: '/village/add.api',
          token: 'btn-qzByRJdF3M6Pibf9jtpUIuRIh7'
        },
        edit: {
          // 修改项目数据
          url: '/village/edit.api',
          token: 'btn-mtJCAWOuJuNEWMNc1xt7sogVzI'
        }
      },
      // 获取导入房源excel模版
      downloadtemp: {
        url: '/village/getimportroomsexcel'
      },
      // 从excel中导入房源数据
      importrooms: {
        url: '/village/importroomsbyexcel'
      },
      // 获取导入固定车excel模版
      downloadcartemp: {
        url: '/car/getimportcarexcel'
      },
      // 从excel中导入车位数据
      importcars: {
        url: '/car/importcarbyexcel'
      },
      // 生成慧管家小程序缴费页面二维码
      createpayqrcode: {
        url: '/village/createpayqrcode'
      },
    },
    Addressbook: {
      // 获取用户列表
      userlist: {
        url: '/user/userlist'
      },
      // 获取用户权限范围
      getuservillage: {
        url: '/user/getuservillage'
      },
      // 修改用户权限范围
      saverange: {
        url: '/user/saverange'
      },
      // 获取用户物业权限节点
      getusernode: {
        url: '/user/getusernode'
      },
      // 修改用户节点
      savenode: {
        url: '/user/savenode'
      },
      // 获取用户权限组数据
      getusergroup: {
        url: '/user/getusernodegroup'
      },
      // 修改用户权限组
      savenodegroup: {
        url: '/user/savenodegroup'
      },
      // 重置密码
      resetpass: {
        url: '/user/resetpass'
      },
    },
    DeviceManage: {
      // 设备品类列表
      category: {
        url: '/equipment/equipment_category'
      },
      // 获取用户列表
      equipments: {
        url: '/equipment/equipment_list'
      },
      // 搜索设备
      equisearch: {
        url: '/equipment/equipment_search'
      },
    }
  }
})
