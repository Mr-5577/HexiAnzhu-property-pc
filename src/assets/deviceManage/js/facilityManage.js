import deviceColumns from '../json/device-columns.json'
import workIcon from '@/components/common/workIcon.vue'
let id = 0;
export default {
  name: 'facilityManage',
  components: {
    workIcon
  },
  data() {
    return {
      urlObj: {
        treeData: this.$api.state.Means.treeData.url,
        applist: this.$api.state.Application.applist.url,
        category: this.$api.state.DeviceManage.category.url,
        equipments: this.$api.state.DeviceManage.equipments.url,
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 设备类型
      deviceType: '',
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: deviceColumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否正在提交数据
      isCommit: false,
      showAddDeviceDialog: false, //新增设备弹窗
      rules: {
        village: [{
          required: false,
          message: '请选择项目',
          trigger: 'change'
        }],
      },
      ruleForm: {
        village: []
      },
      // 当前选择的项目数据
      villageSelected: [],
    }
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
    // 获取项目数据
    this.getVillageData()
  },

  /**
   * 方法
   */
  methods: {
    // 获取城市-项目数据
    getVillageData() {
      this.$axios
        .post(this.urlObj.treeData)
        .then(res => {
          if (res.Code === 200) {
            let content = ''
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                let village = ''
                if (item.children && item.children.length > 0) {
                  item.children.forEach(itm => {
                    if (itm.id == this.vid) {
                      village =
                        village +
                        `<li id="${itm.id}" pid="${item.id}" class="active">${itm.label}</li>`
                      this.villageSelected = [{
                        id: itm.id,
                        name: itm.label
                      }]
                      this.ruleForm.village = [itm.label]
                      this.villageChange()
                    } else {
                      village =
                        village +
                        `<li id="${itm.id}" pid="${item.id}">${itm.label}</li>`
                    }
                  })
                }
                let city = ''

                if (
                  item.children.length === 1 &&
                  item.children[0].id == this.vid
                ) {
                  city = `
                  <div class="city">
                    <div class="title">${item.label}</div>
                    <ul>
                      <li id="0" pid="${item.id}" class="active">全选</li>
                      ${village}
                    </ul>
                  </div>
                `
                } else {
                  city = `
                  <div class="city">
                    <div class="title">${item.label}</div>
                    <ul>
                      <li id="0" pid="${item.id}">全选</li>
                      ${village}
                    </ul>
                  </div>
                `
                }
                content = content + city
              })
              console.log('this.ruleForm 111===',this.ruleForm);
            }
            // 设置下拉框样式、滚动
            let drop = document.querySelector(
              '.el-select-dropdown.customSelect'
            )
            drop.style.width = '45%'
            drop.style.height = '45%'
            let scro = document.querySelector(
              '.el-select-dropdown.customSelect .el-scrollbar'
            )
            scro.style.display = 'block'
            scro.style.height = '100%'
            let wrap = document.querySelector(
              '.el-select-dropdown.customSelect .el-scrollbar .el-select-dropdown__wrap'
            )
            wrap.style.height = '100%'
            wrap.style.maxHeight = '500px'
            wrap.style.overflowX = 'auto'
            let empty = document.querySelector(
              '.el-select-dropdown.customSelect .el-select-dropdown__empty'
            )
            empty.style.display = 'none'

            // 数据渲染（追加元素）
            let scontent = document.querySelector(
              '.el-select-dropdown.customSelect .el-scrollbar__view'
            )
            if (
              res.Data &&
              res.Data.length === 1 &&
              res.Data[0].children.length === 1 &&
              res.Data[0].children[0].id == this.vid
            ) {
              scontent.innerHTML = `<div class="select-content active">
              <div class="select-all">选择全部</div>
              ${content}</div>`
            } else {
              scontent.innerHTML = `<div class="select-content">
              <div class="select-all">选择全部</div>
              ${content}</div>`
            }

            // 绑定按钮事件
            this.bindIncident()


          } else {
            this.$message({
              type: 'error',
              message: '项目数据获取失败！'
            })
          }
        })
        .catch(() => {})
    },
    // 项目下拉框按钮绑定事件
    bindIncident() {
      console.log('this.ruleForm ===',this.ruleForm);
      this.$nextTick(() => {
        // 全选按钮事件绑定
        let content = document.querySelector('.select-content .select-all')
        content.addEventListener(
          'click',
          () => {
            if (content.classList.contains('active')) {
              content.classList.remove('active')
              lis.forEach(item => {
                item.classList.remove('active')
              })
            } else {
              content.classList.add('active')
              lis.forEach(item => {
                item.classList.add('active')
              })
            }
            this.setVillage()
          },
          false
        )

        // 项目按钮事件绑定
        let lis = document.querySelectorAll('.select-content ul li')
        lis.forEach(item => {
          item.onclick = e => {
            let el = e.target
            let pid = el.getAttribute('pid')
            if (el.getAttribute('id') == '0') {
              let cli = document.querySelectorAll(
                `.select-content ul li[pid='${pid}']`
              )
              if (el.classList.contains('active')) {
                cli.forEach(item => {
                  item.classList.remove('active')
                })
                el.classList.remove('active')
                content.classList.remove('active')
              } else {
                cli.forEach(item => {
                  item.classList.add('active')
                })
                el.classList.add('active')
                let lidoms = document.querySelectorAll('.select-content ul li')
                let flag = true
                for (let i = 0; i < lidoms.length; i++) {
                  if (!lidoms[i].classList.contains('active')) {
                    flag = false
                    break
                  }
                }
                if (flag) {
                  content.classList.add('active')
                }
              }
            } else {
              let all = document.querySelector(
                `.select-content ul li[id='0'][pid='${pid}']`
              )
              if (el.classList.contains('active')) {
                el.classList.remove('active')
                all.classList.remove('active')
                content.classList.remove('active')
              } else {
                el.classList.add('active')
                let alis = document.querySelectorAll(
                  `.select-content ul li[pid='${pid}']`
                )
                let flag = true
                for (let i = 1; i < alis.length; i++) {
                  if (!alis[i].classList.contains('active')) {
                    flag = false
                    break
                  }
                }
                if (flag) {
                  all.classList.add('active')
                }
                let lidoms = document.querySelectorAll('.select-content ul li')
                let flag1 = true
                for (let i = 0; i < lidoms.length; i++) {
                  if (!lidoms[i].classList.contains('active')) {
                    flag1 = false
                    break
                  }
                }
                if (flag1) {
                  content.classList.add('active')
                }
              }
            }
            this.setVillage()
          }
        })
      })
    },
    // 设置项目数据
    setVillage() {
      let lidoms = document.querySelectorAll('.select-content ul li')
      let arr = []
      lidoms.forEach(item => {
        if (
          item.classList.contains('active') &&
          item.getAttribute('id') != '0'
        ) {
          arr.push({
            id: item.getAttribute('id'),
            name: item.innerText
          })
        }
      })
      this.villageSelected = arr

      console.log('this.ruleForm.village===', this.ruleForm.village);
      this.ruleForm.village = arr.map(item => item.name)
      this.villageChange()
    },
    // 项目选择更改处理
    villageChange() {
      // this.ruleForm.build = []
      // this.ruleForm.unit = []
      // this.ruleForm.room = []
      // this.buildOptions = []
      // this.unitOptions = []
      // this.roomOptions = []
      // if (this.ruleForm.village.length == 1 && this.showBuild) {
      //   // 获取楼栋数据
      //   this.getBuildData()
      // }
    },
    /**
     * 新增设备
     */
    addDeviceSubmit() {
      this.isCommit = true
      setTimeout(() => {
        this.isCommit = false
      }, 1200)
    },
    // 筛选选择项目
    filterVillage(choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.deviceType = ''
      this.searchVal = ''
      this.conf = {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      }
      // 请求接口获取表单数据
      this.tableLoad()
    },

    // 合同类型数据加载
    lazyLoad(node, resolve) {
      this.$axios
        .post(this.urlObj.category, {
          pid: node.value
        })
        .then(res => {
          if (res.Code === 200) {
            resolve(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取设备类型数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
        })
    },

    // 获取表格数据
    tableLoad() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        vid: this.choseVillageInfo.vid,
        category: this.deviceType[this.deviceType.length - 1],
        keywords: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.equipments, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.list.forEach(item => {
              item.statusColor = item.status == 1 ? '#333' : '#999'
            })
            this.conf.dataTotal = res.Data.count
            // 存放查询数据
            this.tableData = res.Data.list
            // 关闭加载状态
            this.conf.loadStatus = false
            // 清空空数据提示
            this.conf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.tableData = []
            this.conf.emptyText = res.Message
            this.conf.dataTotal = 0
            this.conf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.tableData = []
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
        dataTotal: 0
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
  }
}
