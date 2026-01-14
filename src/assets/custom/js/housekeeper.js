import invoiceCloumns from '../json/invoice-cloumns.json'

export default {
  name: 'housekeeper',
  data () {
    return {
      urlObj: {
        buildings: this.$api.state.Custom.buildings.url,
        editunitsteward: this.$api.state.Custom.editunitsteward.url,
        getUsers: this.$api.state.Public.getUsers.url
      },
      // 当前选择的项目信息
      choseVillageInfo: {
        name: '全部项目',
        vid: 0
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: invoiceCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 表格选择的数据
      tableSelected: [],
      // 当前操作的数据对象
      currentObj: '',
      // 用户搜索框绑定值
      autoValue: '',
      // 搜索结果列表
      allUserList: [],
      // 当前用户信息数据
      currentUser: {},
      // 是否显示弹框
      showDialog: false,
      // 是否是批量操作
      isBatch: false,
      // 是否正在提交数据
      isCommit: false
    }
  },

  /**
   * 生命周期
   */
  mounted () {
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
    filterVillage (choseInfo) {
      // 参数赋值
      this.choseVillageInfo.name = choseInfo.name
      this.choseVillageInfo.vid = choseInfo.vid
      this.tableLoad()
    },

    cellClass (row) {
      if (row.columnIndex == 1) {
        return 'unit'
      }
    },

    // 获取表格数据
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        vid: this.choseVillageInfo.vid
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.buildings, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                let users = []
                let tels = []
                let arr = []
                item.unit.forEach(itm => {
                  let obj = {
                    id: itm.id,
                    pid: item.id,
                    name: itm.unit,
                    steward: itm.stewards ? itm.stewards.realname : '',
                    phone: itm.stewards_tel,
                    uid: item.stewards_id,
                    level: 2,
                    nodeid: `unit${itm.id}`
                  }
                  if (!users.includes(obj.steward)) {
                    users.push(obj.steward)
                  }
                  if (!tels.includes(obj.phone)) {
                    tels.push(obj.phone)
                  }
                  arr.push(obj)
                })
                item.name = item.block
                item.steward = users.join('/')
                item.phone = tels.join('/')
                item.children = arr
                item.level = 1
                item.nodeid = `build${item.id}`
              })
            }
            // 存放查询数据
            this.tableData = res.Data ? res.Data : []
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

    // 设置选择状态
    toggleSelection (rows, flag) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.tableRef.toggleRowSelection(row, flag)
        })
      } else {
        this.$refs.tableRef.clearSelection()
      }
    },

    // 点击每行的选择框处理
    rowSelect (selection, row) {
      if (selection.indexOf(row) > -1 && row.level === 1) {
        this.toggleSelection(row.children, true)
      }
      if (selection.indexOf(row) === -1 && row.level === 1) {
        this.toggleSelection(row.children, false)
      }
      if (selection.indexOf(row) > -1 && row.level === 2) {
        let all = this.tableData.filter(item => {
          if (item.id === row.pid) {
            return item
          }
        })
        let flag = true
        all[0].children.forEach(item => {
          if (!selection.includes(item)) {
            flag = false
          }
        })

        if (flag) {
          this.toggleSelection(all, true)
        } else {
          this.toggleSelection(all, 'indeterminate')
        }
      }
      if (selection.indexOf(row) === -1 && row.level === 2) {
        let all = this.tableData.filter(item => {
          if (item.id === row.pid) {
            return item
          }
        })
        this.toggleSelection(all, false)
      }
    },

    // 设置全选
    selectAll (selection) {
      let flag = false
      selection.forEach(item => {
        if (item.level === 1) {
          flag = true
          this.toggleSelection(item.children, true)
        }
      })
      if (!flag) {
        this.toggleSelection()
      }
    },

    // 选择改变处理
    selectionChange () {
      this.tableSelected = this.$refs.tableRef.selection
    },

    // 点击更换管家按钮处理
    stewardChange (row) {
      this.isBatch = false
      this.currentObj = row
      this.currentUser = {
        uid: row.uid,
        realname: row.steward,
        mobile: row.phone,
      }
      this.showDialog = true
    },

    // 批量设置
    setBatch () {
      this.isBatch = true
      this.showDialog = true
    },

    // 搜索获取业主数据
    async querySearchAsync (queryStr, cb) {
      if (queryStr) {
        let value = {
          keywords: queryStr
        }
        let res = await this.$axios.post(this.urlObj.getUsers, value)
        if (res.Code === 200) {
          let first = {
            id: 0,
            realname: '姓名',
            mobile: '电话号码',
            idcard: '身份证号'
          }
          res.Data.unshift(first)
          this.allUserList = res.Data
          this.nomore = false
          cb(res.Data)
        } else {
          this.$refs.searchInput.$children[0].blur()
        }
      } else {
        cb([])
      }
    },

    // 选择用户处理
    handleSelect (user) {
      this.currentUser = user
    },

    // 设置管家提交数据
    confirm () {
      if (this.currentUser.uid) {
        if (this.currentUser.mobile) {
          this.isCommit = true
          let data = {
            uid: this.currentUser.uid,
            mobile: this.currentUser.mobile,
            unit_ids: []
          }
          if (this.isBatch) {
            let selected = this.$refs.tableRef.selection
            data.unit_ids = []
            selected.forEach(item => {
              if (item.level == 2) {
                data.unit_ids.push(item.id)
              }
            })
          } else {
            data.unit_ids = [this.currentObj.id]
          }
          this.$axios
            .post(this.urlObj.editunitsteward, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '楼栋管家设置成功！'
                })
                this.showDialog = false
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '楼栋管家信息提交失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.isCommit = false
            })
            .catch(() => {
              this.isCommit = false
            })
        } else {
          this.$message({
            type: 'warning',
            message: '请输入联系电话！'
          })
        }

      } else {
        this.$message({
          type: 'warning',
          message: '请选择楼栋管家！'
        })
      }
    }
  }
}
