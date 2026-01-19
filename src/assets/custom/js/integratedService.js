// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'integratedService',
  components: {
    workIcon,
  },
  data() {
    return {
      urlObj: {
        getComprehensiveList: this.$api.state.Custom.getComprehensiveList.url,
        getrepairtype: this.$api.state.Custom.getrepairtype.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0,
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: [
        {
          label: '项目名称',
          prop: 'villagename',
          show: true,
          color: '#999',
        },
        {
          label: '业务类型',
          prop: 'typename',
          show: true,
          color: '#999',
        },
        {
          label: '留言内容',
          prop: 'content',
          show: true,
          color: '#999',
        },
        {
          label: '联系人',
          prop: 'name',
          show: true,
          color: '#999',
        },
        {
          label: '联系电话',
          prop: 'tel',
          show: true,
          color: '#999',
        },
        {
          type: "img",
          label: '留言附图',
          prop: 'fileUrls',
          show: true,
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
      // 类型
      typeVal: '',
      typeOptions: [],
      tel: '',

      // 图片/文件上传参数
      qiniuDatas: '',
      // 预览图片的url
      imgSrc: '',
      imgList: [],
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
    if (vid) {
      this.choseVillageInfo.vid = vid
      this.choseVillageInfo.name = vname
    }
    setTimeout(() => {
      this.tableLoad()
      this.getTypeList()
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
      this.searchVal = ''
      this.typeVal = ''
      this.tel = ''
      this.keySearch()
    },

    // 获取类型
    getTypeList() {
      this.$axios
        .post(this.urlObj.getrepairtype, { type: 4 })
        .then((res) => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取类型失败！'
            this.$message({
              type: 'error',
              message: msg,
            })
          }
        })
        .catch(() => {})
    },

    // 获取表格数据
    tableLoad() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        type: this.typeVal,
        content: this.searchVal,
        tel: this.tel,
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getComprehensiveList, data)
        .then((res) => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach((item) => {
                if (item.filepath && this.qiniuDatas) {
                  try {
                    const fileArray = JSON.parse(item.filepath);
                    item.fileUrls = fileArray.map(file => `${this.qiniuDatas.domain}${file}`);
                  } catch (e) {
                    console.error('解析filepath失败:', e);
                    item.fileUrls = [];
                  }
                }
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
          type: this.typeVal,
          content: this.searchVal,
          tel: this.tel,
        }
        // 获取项目列表数据
        this.$axios.post(this.urlObj.getComprehensiveList, data).then((res) => {
          if (res.Code === 200) {
            let tableName = '综合服务数据表'
            let headers = [
              '项目名称',
              '业务类型',
              '留言内容',
              '联系人',
              '联系电话',
            ]

            // 整理需要导出的数据
            let datas = []
            res.Data.forEach((item) => {
              let arr = [
                item.villagename,
                item.typename,
                item.content,
                item.name,
                item.tel,
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
