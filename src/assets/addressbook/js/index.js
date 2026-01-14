// 导入 计费管理 组件
import addressColumn from '../json/address-column.json'


export default {
  name: 'addressBook',
  data () {
    return {
      urlObj: {
        villageend: this.$api.state.Charge.villageend.url,
        userlist: this.$api.state.Addressbook.userlist.url,
        getuservillage: this.$api.state.Addressbook.getuservillage.url,
        saverange: this.$api.state.Addressbook.saverange.url,
        getusernode: this.$api.state.Addressbook.getusernode.url,
        savenode: this.$api.state.Addressbook.savenode.url,
        getusergroup: this.$api.state.Addressbook.getusergroup.url,
        savenodegroup: this.$api.state.Addressbook.savenodegroup.url,
        resetpass: this.$api.state.Addressbook.resetpass.url,
      },
      // 搜索框绑定值
      searchVal: '',
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: addressColumn.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前操作的数据对象
      currentObj: null,
      // 当前操作类型
      optype: 'range',
      // 是否显示弹框
      showDialog: false,
      // 是否正在获取弹框数据
      isloading: false,
      // 当前弹框数据列表
      currentList: [],
      // 是否全选
      checkAll: false,
      // 是否正在提交数据
      isCommit: false,
    }
  },

  /**
   * 生命周期
   */
  created () {
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 点击查询处理
    keySearch () {
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

    // 表格数据加载
    tableLoad () {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        keywords: this.searchVal
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.userlist, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.data.forEach((item, index) => {
              item.index = (this.conf.curPage - 1) * this.conf.limit + index + 1
            })
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

    // 表格每页条数改变处理
    sizeChange (num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange (num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 设置权限范围
    setAuth (index) {
      this.optype = 'range'
      this.currentObj = this.tableData[index]
      this.currentList = []
      this.showDialog = true
      this.getRangeData()
    },

    // 设置个人权限
    personAuth (index) {
      this.optype = 'person'
      this.currentObj = this.tableData[index]
      this.currentList = []
      this.showDialog = true
      this.getPersonData()
    },

    // 设置分组权限
    groupAuth (index) {
      this.optype = 'group'
      this.currentObj = this.tableData[index]
      this.currentList = []
      this.showDialog = true
      this.getGroupData()
    },

    // 重置密码
    resetPass (index) {
      this.optype = 'reset'
      this.currentObj = this.tableData[index]
      this.$confirm(`确定要重置用户【${this.currentObj.realname}】的密码吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.post(this.urlObj.resetpass, { uid: this.currentObj.uid }).then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '重置密码成功！'
              })
            } else {
              let msg = res.Message ? res.Message : '重置密码失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          }).catch(() => { })
        })
        .catch(() => { })
    },

    // 获取权限范围数据
    getRangeData () {
      this.isloading = true
      this.$axios.post(this.urlObj.getuservillage, { uid: this.currentObj.uid }).then(res => {
        if (res.Code === 200) {
          let selecteds = []
          if (res.Data && res.Data.length > 0) {
            res.Data.forEach(item => {
              if (item.is_check) {
                selecteds.push(item)
              }
              let arr = []
              item.child.forEach(itm => {
                if (itm.is_check) {
                  arr.push(itm.r_id)
                }
              })
              item.checkids = arr
            })
          }
          this.currentList = res.Data ? res.Data : []
          this.checkAll = selecteds.length === this.currentList.length
        } else {
          let msg = res.Message ? res.Message : '获取权限范围数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isloading = false
      }).catch(() => {
        this.isloading = false
      })
    },

    // 获取个人权限数据
    getPersonData () {
      this.isloading = true
      this.$axios.post(this.urlObj.getusernode, { uid: this.currentObj.uid }).then(res => {
        if (res.Code === 200) {
          let selecteds = []
          if (res.Data && res.Data.length > 0) {
            res.Data.forEach(item => {
              if (item.is_check) {
                selecteds.push(item)
              }
              let arr = []
              if (item.child && item.child.length > 0) {
                item.child.forEach(itm => {
                  if (itm.is_check) {
                    arr.push(itm.nid)
                  }
                })
              }
              item.checkids = arr
            })
          }
          this.currentList = res.Data ? res.Data : []
          this.checkAll = selecteds.length === this.currentList.length
        } else {
          let msg = res.Message ? res.Message : '获取个人权限数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isloading = false
      })
      // .catch(() => {
      //   this.isloading = false
      // })
    },

    // 获取分组权限数据
    getGroupData () {
      this.isloading = true
      this.$axios.post(this.urlObj.getusergroup, { uid: this.currentObj.uid }).then(res => {
        if (res.Code === 200) {
          this.currentList = res.Data ? res.Data : []
        } else {
          let msg = res.Message ? res.Message : '获取分组权限数据失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isloading = false
      }).catch(() => {
        this.isloading = false
      })
    },

    // 一级分类选择更改
    handleCheckAll (val, item, name) {
      item.checkids = val ? item.child.map(itm => itm[name]) : []
      let selecteds = this.currentList.filter(item => item.is_check)
      this.checkAll = selecteds.length === this.currentList.length
    },

    // 二级分类选择更改
    handleChecked (val, item) {
      item.is_check = val.length === item.child.length
      let selecteds = this.currentList.filter(item => item.is_check)
      this.checkAll = selecteds.length === this.currentList.length
    },

    // 点击全选处理
    allChange (val, name) {
      if (val) {
        this.currentList.forEach(item => {
          item.is_check = val
          let arr = []
          item.child.forEach(itm => {
            itm.is_check = val
            arr.push(itm[name])
          })
          item.checkids = arr
        })
      } else {
        this.currentList.forEach(item => {
          item.is_check = val
          item.checkids = []
          item.child.forEach(itm => {
            itm.is_check = val
          })
        })
      }

    },

    // 点击保存修改处理
    editSave () {
      if (this.optype === 'range') {
        this.rangeRequest()
      } else if (this.optype === 'person') {
        this.personRequest()
      } else if (this.optype === 'group') {
        this.groupRequest()
      }
    },

    // 权限范围修改请求
    rangeRequest () {
      this.isCommit = true
      let arr = []
      this.currentList.forEach(item => {
        arr = arr.concat(item.checkids)
      })
      let data = {
        uid: this.currentObj.uid,
        range_arr: arr
      }
      this.$axios.post(this.urlObj.saverange, data).then(res => {
        if (res.Code === 200) {
          this.$message({
            type: 'success',
            message: '权限范围修改成功！'
          })
          this.showDialog = false
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '权限范围修改失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isCommit = false
      }).catch(() => {
        this.isCommit = false
      })
    },

    // 个人权限修改请求
    personRequest () {
      this.isCommit = true
      let arr = []
      this.currentList.forEach(item => {
        arr = arr.concat(item.checkids)
      })
      let data = {
        uid: this.currentObj.uid,
        node_arr: arr
      }
      this.$axios.post(this.urlObj.savenode, data).then(res => {
        if (res.Code === 200) {
          this.$message({
            type: 'success',
            message: '个人权限修改成功！'
          })
          this.showDialog = false
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '个人权限修改失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isCommit = false
      }).catch(() => {
        this.isCommit = false
      })
    },

    // 分组权限修改请求
    groupRequest () {
      this.isCommit = true
      let arr = []
      this.currentList.forEach(item => {
        if (item.is_check) {
          arr.push(item.ngid)
        }
      })
      let data = {
        uid: this.currentObj.uid,
        nodegroup: arr
      }
      this.$axios.post(this.urlObj.savenodegroup, data).then(res => {
        if (res.Code === 200) {
          this.$message({
            type: 'success',
            message: '分组权限修改成功！'
          })
          this.showDialog = false
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '分组权限修改失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isCommit = false
      }).catch(() => {
        this.isCommit = false
      })
    },
  }
}
