import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'visitQuery',
  components: {
    workIcon,
  },
  data() {
    return {
      urlObj: {
        visitHistory: this.$api.state.Custom.visitHistory.url,
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
      columns: [
        {
          label: '访客类型',
          prop: 'visitor_type_name',
          show: true,
          color: '#999',
        },
        {
          label: '访客姓名',
          prop: 'visitor_name',
          show: true,
          color: '#999',
        },
        {
          label: '身份证号',
          prop: 'visitor_card_no',
          show: true,
          color: '#999',
        },
        {
          label: '手机号',
          prop: 'visitor_tel',
          show: true,
          color: '#999',
        },
        {
          label: '业主房号',
          prop: 'owner_house_no',
          show: true,
          color: '#999',
        },
        {
          label: '业主手机号',
          prop: 'owner_tel',
          show: true,
          color: '#999',
        },
        {
          label: '到访日期',
          prop: 'visit_time',
          show: true,
          color: '#999',
        },
      ],
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0,
      },
      // 姓名
      visitorName: '',
      // 类型
      visitorType: '',
      typeOptions: [
        { typename: '访客', id: 0 },
        { typename: '外卖', id: 1 },
      ],
      visitorTel: '',
      // 开始日期
      startTime: '',
      // 结束日期
      endTime: '',

      // 图片/文件上传参数
      qiniuDatas: '',
      // 预览图片的url
      imgSrc: '',
      imgList: [],
    }
  },

  // 计算属性
  computed: {
    // 开始时间限制
    spickerOptions() {
      return {
        disabledDate: (time) => {
          if (time) {
            return this.endTime ? time.getTime() > this.endTime : false
          }
        },
      }
    },
    // 结束时间限制
    epickerOptions() {
      return {
        disabledDate: (time) => {
          if (time) {
            return this.startTime ? time.getTime() < this.startTime : false
          }
        },
      }
    },
  },

  /**
   * 生命周期
   */
  mounted() {
    let vid = sessionStorage.getItem('vid')
    let vname = sessionStorage.getItem('vname')
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    this.tableLoad()
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
      this.visitorName = ''
      this.visitorTel = ''
      this.visitorType = ''
      this.startTime = ''
      this.endTime = ''
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
        visitorName: this.visitorName,
        visitorTel: this.visitorTel,
        visitorType: this.visitorType,
        visitBeginTime: this.startTime,
        visitEndTime: this.endTime,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.visitHistory, data)
        .then((res) => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach((item) => {
                item.visitor_type_name =
                  item.visitor_type === 1 ? '外卖' : '访客'
              })
            }
            // 设置查询总数
            this.conf.dataTotal = res.Data.total
            // 存放查询数据
            this.tableData = res.Data.data
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
      console.log('预览', data)
      const fileUrls = data.fileUrls || []
      if (fileUrls.length > 0) {
        this.imgSrc = fileUrls[imgIndex]
        this.imgList = fileUrls
        this.$nextTick(() => {
          this.$refs.preview.clickHandler()
        })
      }
    },

    /* 导出EXCEL */
    exportDetailExcel() {
      try {
        // 获取报事报修数据
        let data = {
          is_excel: 1,
          page: this.conf.curPage,
          limit: this.conf.limit,
          vid: this.choseVillageInfo.vid,
          visitorName: this.visitorName,
          visitorTel: this.visitorTel,
          visitorType: this.visitorType,
          visitBeginTime: this.startTime,
          visitEndTime: this.endTime,
        }
        // 获取项目列表数据
        this.$axios.post(this.urlObj.visitHistory, data).then((res) => {
          if (res.Code === 200) {
            let tableName = '来访历史数据表'
            let headers = [
              '访客类型',
              '访客姓名',
              '身份证号',
              '手机号',
              '业主房号',
              '业主手机号',
              '到访日期',
            ]

            // 整理需要导出的数据
            let datas = []
            res.Data.forEach((item) => {
              const typeName = item.visitor_type === 1 ? '外卖' : '访客'
              let arr = [
                typeName,
                item.visitor_name,
                item.visitor_card_no,
                item.visitor_tel,
                item.owner_house_no,
                item.owner_tel,
                item.visit_time,
              ]
              datas.push(arr)
            })
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
            let msg = res.Message ? res.Message : '报事报修数据获取失败！'
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
  },
}
