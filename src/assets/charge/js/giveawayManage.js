// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'
import { formatDate } from '@/assets/common/js/date.js'
import workIcon from '@/components/common/workIcon.vue'
import giveawayCloumns from '../json/giveaway-manage.json'
import paymentCloumns from '../json/payment.json'
export default {
  name: 'integratedService',
  components: {
    workIcon,
  },
  data() {
    return {
      urlObj: {
        getGiftList: this.$api.state.Charge.getGiftList.url,
        receiveGift: this.$api.state.Charge.receiveGift.url,
        getDiscountsSolution: this.$api.state.Charge.getDiscountsSolution.url,
        getDiscountsSolutionDetail:
          this.$api.state.Charge.getDiscountsSolutionDetail.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0,
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: giveawayCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0,
      },
      // 状态
      status: -1,
      statusOptions: [
        { id: -1, name: '全部' },
        { id: 0, name: '未领取' },
        { id: 1, name: '已全部领取' },
        { id: 2, name: '已部分领取' },
      ],
      roomnum: '', // 房号
      realname: '', // 业主姓名
      tel: '', // 手机号

      // 图片/文件上传参数
      qiniuDatas: '',
      // 预览图片的url
      imgSrc: '',
      imgList: [],

      // 是否显示缴费详情弹框
      showPaymentDetailDialog: false,
      paymentDetailData: {
        name: '',
        roomnum: '',
        realname: '',
        tel: '',
        product_type: '',
        buildareas: '',
      },
      // 缴费详情内表格配置
      paymentConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0,
      },
      promotionTableData: [],
      promotionColumns: paymentCloumns.promotionList,
      paymentTableData: [],
      paymentColumns: paymentCloumns.list,
      // 领取登记详情弹窗
      showSignForDetailDialog: false,
      signForData: {
        gift_name_unit: '',
        gift_num: '',
        gift_num_receive: '',
        gift_num_notReceive: '',
        status_name: '',
        realname: '',
        time: '',
        gift_num_receive_this: 1,
      },
      // 发放人，为当前登录人
      issuerName: '',
      isCommit: false,
    }
  },

  // 计算属性
  computed: {},

  /**
   * 生命周期
   */
  mounted() {
    this.getUploadToken()
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    this.issuerName = sessionStorage.getItem('realname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    setTimeout(() => {
      this.tableLoad()
    }, 100)
  },

  /**
   * 方法
   */
  methods: {
    // 筛选选择项目
    filterVillage(choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.status = -1
      this.roomnum = ''
      this.realname = ''
      this.tel = ''
      this.keySearch()
    },

    // 获取表格数据
    tableLoad() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        roomnum: this.roomnum,
        realname: this.realname,
        tel: this.tel,
        status: this.status,
      }
      // 获取列表数据
      this.$axios
        .post(this.urlObj.getGiftList, data)
        .then((res) => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach((item) => this.processTableItem(item))
            }
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.tableData = res.Data.data || []
            // 关闭加载状态
            this.conf.loadStatus = false
            // 清空空数据提示
            this.conf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error',
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath,
            })
          } else {
            this.datas = []
            this.conf.emptyText = res.Message
            this.conf.dataTotal = 0
            this.conf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.datas = []
          this.conf.emptyText = '服务器连接失败...'
          this.conf.dataTotal = 0
          this.conf.loadStatus = false
        })
    },
    // 对每一项数据进行处理
    processTableItem(item) {
      // 组合名称和单位
      item.gift_name_unit =
        item.gift_name && item.gift_unit
          ? `${item.gift_name}/${item.gift_unit}`
          : ''
      // 计算待领取数量, 总数量gift_num 减去 已领取数量gift_num_receive 的值（处理非数字情况）
      item.gift_num_notReceive = Math.max(
        0,
        (Number(item.gift_num) || 0) - (Number(item.gift_num_receive) || 0)
      )
      // 判断gift_num_receive值来处理是否禁用 领取登记 按钮
      item.canSignFor = (Number(item.gift_num_notReceive) || 0) <= 0
      // 映射状态名称
      item.status_name =
        this.statusOptions?.find((it) => it.id === item.status)?.name || ''
    },
    // 点击查询处理
    keySearch() {
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0,
      }
      // 请求接口获取表单数据
      this.tableLoad()
    },

    // 表格每页条数改变处理
    sizeChange(num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange(num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 获取文件上传 token
    getUploadToken() {
      this.$axios.post(this.urlObj.uploadToken).then((res) => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    // 弹框图片预览
    imgPreview(data, imgIndex) {
      const fileUrls = data.fileUrls || []
      if (fileUrls.length > 0) {
        this.imgSrc = fileUrls[imgIndex]
        this.imgList = fileUrls
        this.$nextTick(() => {
          this.$refs.preview.clickHandler()
        })
      }
    },

    // 导出EXCEL
    exportDetailExcel() {
      try {
        // 获取报事报修数据
        let data = {
          is_excel: 1,
          page: this.conf.curPage,
          limit: this.conf.limit,
          vid: this.choseVillageInfo.vid,
          roomnum: this.roomnum,
          realname: this.realname,
          tel: this.tel,
          status: this.status,
        }
        // 获取项目列表数据
        this.$axios.post(this.urlObj.getGiftList, data).then((res) => {
          if (res.Code === 200) {
            let tableName = '赠品管理数据表'
            let headers = [
              '业主姓名',
              '房号',
              '产品类型',
              '面积',
              '手机号',
              '礼品名称及规格',
              '总赠品数量',
              '已领取数量',
              '待领取数量',
              '领取状态',
            ]
            let dataList = res.Data || []
            // 处理每一项数据
            dataList.forEach((item) => this.processTableItem(item))
            // 需要导出的数据
            const datas = dataList.map((item) => [
              item.realname,
              item.roomnum,
              item.product_type,
              item.buildareas,
              item.tel,
              item.gift_name_unit,
              item.gift_num,
              item.gift_num_receive,
              item.gift_num_notReceive,
              item.status_name,
            ])
            require.ensure([], () => {
              // 引入excel.js
              let {
                export_json_to_excel,
              } = require('@/assets/common/excel/Export2Excel')

              // 执行导出操作
              export_json_to_excel(headers, datas, tableName)
            })

            this.$notify({
              type: 'success',
              title: '温馨提示',
              message: '导出报表成功',
              duration: 1500,
            })
          } else {
            let msg = res.Message ? res.Message : '赠品管理数据获取失败！'
            this.$message({
              type: 'error',
              message: msg,
            })
          }
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500,
        })
      }
    },

    // 查看详情
    async viewDetail(index) {
      const currentData = this.tableData[index]
      this.promotionTableData = []
      this.paymentTableData = []
      if (currentData) {
        this.paymentDetailData = {
          name: this.choseVillageInfo.name,
          roomnum: currentData.roomnum,
          realname: currentData.realname,
          tel: currentData.tel,
          product_type: currentData.product_type,
          buildareas: currentData.buildareas,
        }
        // 显示弹窗
        this.showPaymentDetailDialog = true
        // 表格加载 loading
        this.paymentConf.loadStatus = true
        const params = {
          order_id: currentData.order_id,
        }
        try {
          const promotionRes = await this.$axios.post(this.urlObj.getDiscountsSolution, params)
          if (promotionRes.Code === 200) {
            const list = promotionRes.Data || []
            // 处理数据，新增 discount_description 字段
            const processedList = list.map(item => {
              let description = '暂无优惠'
              try {
                if (item.discount_desc) {
                  const descArray = JSON.parse(item.discount_desc)
                  if (Array.isArray(descArray) && descArray.length > 0) {
                    // 遍历数组，生成描述文本
                    const descTexts = descArray.map(desc => {
                      const month = desc.month || ''
                      const discFee = desc.disc_fee || '0'
                      return `${month}优惠${discFee}元`
                    })
                    description = descTexts.join('; ')
                  }
                }
              } catch (error) {
                description = '暂无优惠'
              }
              return {
                ...item,
                discount_description: description
              }
            })
            this.promotionTableData = processedList
          }
          const detailRes = await this.$axios.post(this.urlObj.getDiscountsSolutionDetail, params)
          if (detailRes.Code === 200) {
            this.paymentTableData = detailRes.Data || []
          }
        } catch (error) {
          
        } finally {
          this.paymentConf.loadStatus = false
        }
      }
    },

    // 领取登记详情
    signForDetail(index) {
      const currentData = this.tableData[index]
      if (currentData && Number(currentData.gift_num_notReceive) <= 0) {
        this.$message({
          type: 'error',
          message: '待领取数量为0，不可操作领取登记',
        })
        return
      }
      this.signForData = {
        id: currentData.id,
        gift_name_unit: currentData.gift_name_unit,
        gift_num: currentData.gift_num,
        gift_num_receive: currentData.gift_num_receive,
        gift_num_notReceive: currentData.gift_num_notReceive,
        status_name: currentData.status_name,
        realname: currentData.realname,
        time: formatDate('-', 's'),
        gift_num_receive_this: 1,
      }
      this.showSignForDetailDialog = true
    },
    validateReceiveCount(value, max) {
      // 验证非负整数
      if (!/^\d+$/.test(value)) {
        return '请输入有效的整数'
      }
      const numValue = Number(value)
      // 验证不能为0
      if (numValue === 0) {
        return '领取数量不能为0'
      }
      // 验证不能超过最大值
      if (numValue > max) {
        return `领取数量不能超过待领取数`
      }
      return null
    },
    handleSubmit() {
      const value = this.signForData.gift_num_receive_this
      const max = this.signForData.gift_num_notReceive
      const validationError = this.validateReceiveCount(value, max)
      if (validationError) {
        this.$message({
          type: 'error',
          message: validationError,
        })
        return
      }
      this.isCommit = true
      const data = {
        id: this.signForData.id,
        gift_num_receive_this: Number(this.signForData.gift_num_receive_this),
      }
      this.$axios
        .post(this.urlObj.receiveGift, data)
        .then((res) => {
          if (res.Code === 200) {
            this.$message({
              message: '领取成功！',
              type: 'success',
            })
            // 重新获取表格数据
            this.tableLoad()
            this.showSignForDetailDialog = false
            // 表单重置
            this.signForData = {
              gift_name_unit: '',
              gift_num: '',
              gift_num_receive: '',
              gift_num_notReceive: '',
              status_name: '',
              realname: '',
              time: '',
              gift_num_receive_this: 1,
            }
          }
        })
        .finally(() => {
          this.isCommit = false
        })
    },
  },
}
