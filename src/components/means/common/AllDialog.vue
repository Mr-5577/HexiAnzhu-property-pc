<template>
  <div id="all-dialog">
    <el-dialog
      :class="cusClass"
      :visible="isShow"
      :title="title"
      :width="dialogWidth"
      @close="close"
      :close-on-click-modal="false"
    >
      <!-- 新增客户部分 -->
      <div class="new-wp" v-if="type == 1">
        <div style="padding: 1rem 1.5rem 0;">
          <el-autocomplete
            ref="searchInput"
            class="room-search"
            popper-class="my-autocomplete"
            v-model="autoValue"
            :debounce="0"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入业主姓名/手机号或房号"
            @select="handleSelect"
          >
            <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="tr-item">
                <span class="td-item">{{ item.realname }}</span>
                <span class="td-item">{{ item.sex ? item.sex : '未知' }}</span>
                <span class="td-item">{{ item.tel }}</span>
              </div>
              <div
                class="load-more"
                @click.stop="loadMore"
                v-if="
                  allUserList.length > 1 &&
                    item.id == allUserList[allUserList.length - 1].id
                "
              >
                {{ nomore ? '没有更多了' : '点击加载更多' }}
              </div>
              <div
                class="load-more"
                @click.stop="loadMore"
                v-if="allUserList.length <= 1"
              >
                暂无数据！
              </div>
            </template>
          </el-autocomplete>
        </div>
        <el-scrollbar style="height: calc(100% - 3rem);">
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="addForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="客户姓名" prop="oname">
              <el-input
                v-model="addForm.oname"
                placeholder="请输入客户姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户性别" prop="sex">
              <el-select
                v-model="addForm.sex"
                clearable
                placeholder="请选择客户性别"
              >
                <el-option
                  v-for="itm in sexOptions"
                  :key="itm.value"
                  :label="itm.label"
                  :value="itm.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idcard">
              <el-input
                v-model="addForm.idcard"
                placeholder="请输入身份证号"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户类别" prop="otype">
              <el-select
                v-model="addForm.otype"
                clearable
                placeholder="请选择客户类别"
              >
                <el-option
                  v-for="itm in typeOptions"
                  :key="itm.value"
                  :label="itm.label"
                  :value="itm.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input
                v-model="addForm.tel"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="迁入日期" prop="date">
              <el-date-picker
                v-model="addForm.date"
                type="date"
                value-format="timestamp"
                placeholder="选择迁入日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="开启计费"
              prop="switchVal"
              v-if="addForm.otype && addForm.otype == 3"
            >
              <el-switch
                v-model="addForm.switchVal"
                active-color="#3EBB75"
                inactive-color="#f2f2f2"
              ></el-switch>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>

      <!-- 房产过户部分 -->
      <div class="transfer-wp" v-if="type == 2">
        <div style="padding: 1rem 1.5rem 0;">
          <el-autocomplete
            ref="searchInput"
            class="room-search"
            popper-class="my-autocomplete"
            v-model="autoValue"
            :debounce="0"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入业主姓名/手机号或房号"
            @select="handleSelect"
          >
            <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="tr-item">
                <span class="td-item">{{ item.realname }}</span>
                <span class="td-item">{{ item.sex ? item.sex : '未知' }}</span>
                <span class="td-item">{{ item.tel }}</span>
              </div>
              <div
                class="load-more"
                @click.stop="loadMore"
                v-if="
                  allUserList.length > 1 &&
                    item.id == allUserList[allUserList.length - 1].id
                "
              >
                {{ nomore ? '没有更多了' : '点击加载更多' }}
              </div>
              <div
                class="load-more"
                @click.stop="loadMore"
                v-if="allUserList.length <= 1"
              >
                暂无数据！
              </div>
            </template>
          </el-autocomplete>
        </div>
        <el-scrollbar style="height: calc(100% - 3rem);">
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="removeForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="客户姓名" prop="oname">
              <el-input
                v-model="addForm.oname"
                placeholder="请输入客户姓名"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="客户性别" prop="sex">
              <el-select
                v-model="addForm.sex"
                clearable
                disabled
                placeholder="请选择客户性别"
              >
                <el-option
                  v-for="itm in sexOptions"
                  :key="itm.value"
                  :label="itm.label"
                  :value="itm.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idcard">
              <el-input
                v-model="addForm.idcard"
                placeholder="请输入身份证号"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="客户类别" prop="otype">
              <el-select
                v-model="addForm.otype"
                clearable
                disabled
                placeholder="请选择客户类别"
              >
                <el-option
                  v-for="itm in typeOptions"
                  :key="itm.value"
                  :label="itm.label"
                  :value="itm.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input
                v-model="addForm.tel"
                placeholder="请输入联系电话"
                disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>

      <!-- 变更日志部分 -->
      <div class="log-wp" v-if="type == 3">
        <cus-table
          ref="cusTable"
          title="客户信息"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></cus-table>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer" v-if="showFooter">
        <el-button type="primary" round @click="commit">提交保存</el-button>
        <el-button v-if="type == 1" type="info" round @click="formReset">
          重置
        </el-button>
        <el-button v-else type="info" round @click="close()">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 导入表格json 文件
import logTable from '@/assets/means/json/log-table.json'

export default {
  name: 'AllDialog',
  props: {
    // 当前弹框类型（新增客户、房产过户、变更日志）
    type: Number,
    // 当前房间号
    roomid: Number,
    // 当前vid
    vid: Number,
    // 是否显示弹框
    showDialog: Boolean
  },
  data() {
    return {
      // 接口数据对象
      urlObj: {
        addOwner: this.$api.state.Means.addOwner.url,
        roomsChange: this.$api.state.Means.roomsChange.url,
        logData: this.$api.state.Means.logData.url,
        userSearch: this.$api.state.Means.userSearch.url,
        userType: this.$api.state.Means.userType.url
      },
      // 是否显示弹框
      isShow: this.showDialog,
      // 弹框标题
      title: '',
      // 弹框宽度
      dialogWidth: '50%',
      // 是否显示 footer
      showFooter: false,
      // 当前弹框类名
      cusClass: 'new-wp',
      // 日志表格数据
      tableData: [],
      // 表格配置项
      columns: logTable.list,
      // 表格基本配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 用户搜索框绑定值
      autoValue: '',
      // 当前选择的用户
      currentUser: '',
      // 业主列表
      allUserList: [],
      // 没有更多用户数据
      nomore: false,
      // 性别
      sexOptions: [
        {
          label: '未知',
          value: 0
        },
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      // 客户类型
      typeOptions: [],
      // 是否开启计费绑定值
      switchVal: false,
      // 新增客户表单
      addForm: {
        oname: '',
        sex: '',
        idcard: '',
        otype: '',
        tel: '',
        date: '',
        switchVal: ''
      },
      addRules: {
        oname: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择客户性别', trigger: 'change' }],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        otype: [
          { required: true, message: '请选择客户类别', trigger: 'change' }
        ],
        tel: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        date: [
          { required: true, message: '请选择迁入日期', trigger: 'change' }
        ],
        switchVal: [
          { required: false, message: '是否开启计费', trigger: 'change' }
        ]
      }
    }
  },

  watch: {
    showDialog(val) {
      if (val) {
        switch (this.type) {
          case 1:
            this.newInit()
            break
          case 2:
            this.transferInit()
            break
          case 3:
            this.logInit()
            break
        }
      }
      this.isShow = val
    }
  },

  /**
   * 生命周期
   */
  created() {},

  /**
   * 方法
   */
  methods: {
    // 新增客户初始化
    newInit() {
      this.title = '新增客户'
      this.showFooter = true
      this.dialogWidth = '32%'
      this.cusClass = 'new'
      this.currentUser = ''
      // 表单重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      // 表单重置
      if (this.$refs.removeForm) {
        this.$refs.removeForm.resetFields()
      }
      this.getUserType()
    },

    // 房产过户初始化
    transferInit() {
      this.title = '房产过户'
      this.showFooter = true
      this.dialogWidth = '32%'
      this.cusClass = 'transfer'
      // 表单重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      // 表单重置
      if (this.$refs.removeForm) {
        this.$refs.removeForm.resetFields()
      }
      // 获取客户类型
      this.getUserType()
    },

    // 变更日志初始化
    logInit() {
      this.title = '变更日志'
      this.showFooter = false
      this.dialogWidth = '57%'
      this.cusClass = 'log'
      this.getTableData()
    },

    // 获取客户类型
    getUserType() {
      this.$axios
        .post(this.urlObj.userType)
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '客户类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '客户类型数据获取失败！'
          })
        })
    },

    // 获取日志表格数据
    getTableData() {
      // 表格处于加载状态
      this.conf.loadStatus = true
      let data = {
        page: this.conf.curPage,
        limit: this.conf.limit,
        id: this.roomid,
        type: 'rooms'
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.logData, data)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            res.Data.data.forEach(item => {
              let obj = {
                createuser: item.createuser ? item.createuser.realname : '',
                create_time: item.create_time,
                content: item.content
              }
              arr.push(obj)
            })
            // 存放查询数据
            this.tableData = arr
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
    sizeChange(num) {
      this.conf.limit = num
      // 获取一次表格数据
      this.getTableData()
    },

    // 当前页码改变处理
    currentChange(num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.getTableData()
    },

    // 搜索获取过户业主数据
    async querySearchAsync(queryStr, cb) {
      let value = {
        keywords: queryStr,
        page: 1,
        limit: 20,
        vid: this.vid
      }
      let res = await this.$axios.post(this.urlObj.userSearch, value)
      if (res.Code === 200) {
        let first = {
          id: 0,
          realname: '姓名',
          sex: '性别',
          tel: '电话号码'
        }
        res.Data.data.unshift(first)
        this.allUserList = res.Data.data
        this.nomore = false
        cb(res.Data.data)
      } else {
        this.$refs.searchInput.$children[0].blur()
      }
    },

    // 加载更多用户数据
    async loadMore() {
      if (!this.nomore) {
        let value = {
          keywords: this.autoValue,
          page: Math.ceil(this.allUserList.length / 20) + 1,
          limit: 20,
          vid: this.vid
        }
        let res = await this.$axios.post(
          this.$api.state.Means.userSearch.url,
          value
        )
        if (res.Code === 200) {
          if (res.Data.data.length > 0) {
            this.allUserList = this.allUserList.concat(res.Data.data)
            this.$refs.searchInput.suggestions = this.allUserList
          } else {
            this.nomore = true
          }
        }
      }
    },

    // 选择用户处理
    handleSelect(user) {
      this.currentUser = user
      this.addForm.oname = user.realname
      this.addForm.sex = user.sex == '男' ? 1 : user.sex == '女' ? 2 : 0
      this.addForm.tel = user.tel
      this.addForm.idcard = user.idcard
      this.addForm.otype = user.owner_type.id ? user.owner_type.id : ''
    },

    // 新增客户表单重置
    formReset() {
      this.currentUser = ''
      // 表单重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
    },

    // 弹框关闭处理
    close() {
      this.$emit('closeDialog')
    },

    // 提交数据处理
    commit() {
      let url = ''
      let data = {}
      let flag = false
      // 新增客户
      if (this.type == 1) {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            flag = true
            url = this.urlObj.addOwner
            data.roomid = this.roomid
            data.realname = this.addForm.oname
            data.sex = this.addForm.sex
            data.idcard = this.addForm.idcard
            data.type_id = this.addForm.otype
            data.tel = this.addForm.tel
            data.move_time = this.addForm.date / 1000
            if (this.currentUser.id) {
              data.oid = this.currentUser.id
            }
            if (this.addForm.otype == 3) {
              data.charge_type = this.addForm.switchVal ? 1 : 0
            }
          }
        })
      } else if (this.type == 2) {
        // 房产过户
        this.$refs.removeForm.validate(valid => {
          if (valid) {
            flag = true
            url = this.urlObj.roomsChange
            data.oid = this.currentUser.id
            data.roomid = this.roomid
          }
        })
      }
      if (!flag) {
        return
      }
      // 提交数据请求
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            let msg = ''
            switch (this.type) {
              case 1:
                msg = '添加客户成功！'
                break
              case 2:
                msg = '房产过户成功！'
                break
            }
            this.$message({
              type: 'success',
              message: msg
            })
            this.close()
            // 重新获取一次详情数据
            this.$emit('getRoomData')
          } else {
            let msg = res.Message ? res.Message : '数据提交失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '数据提交失败！'
          })
        })
    }
  }
}
</script>

<style lang="less">
.my-autocomplete {
  li {
    padding: 0;
    line-height: 40px;
    .tr-item {
      display: flex;
      justify-content: space-between;
      .td-item {
        flex: 1;
        text-align: center;
      }
    }
    .tr-item:hover {
      background-color: #e1f8df;
    }
    .load-more {
      text-align: center;
      color: #ccc;
      background: #fff;
    }
  }
  li:first-child {
    color: #999;
    cursor: default;
    pointer-events: none;
  }
  li:hover {
    background-color: #fff;
  }
}
#all-dialog {
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    height: 65%;
    .el-dialog__body {
      height: calc(100% - 158px);
      padding: 0;
      box-sizing: border-box;
    }
  }
  .el-dialog__wrapper.new {
    .el-dialog {
      height: 63%;
    }
  }
  .el-dialog__wrapper.transfer {
    .el-dialog {
      height: 61%;
    }
  }
  .el-dialog__wrapper.log {
    .el-dialog {
      height: 75%;
      .el-dialog__body {
        height: calc(100% - 68px);
        padding: 10px 0 20px;
        .el-table .cell {
          text-align: center;
        }
      }
    }
  }
  .new-wp,
  .transfer-wp {
    height: 100%;
    .el-autocomplete.room-search {
      width: 100%;
      margin: 0;
    }
    .el-scrollbar__view {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-form {
        display: flex;
        flex-wrap: wrap;
        padding: 15px 15px 0;
        .el-form-item {
          width: 50%;
          padding: 0 15px;
          box-sizing: border-box;
          margin-bottom: 30px !important;
          .el-date-editor,
          .el-select {
            width: 100%;
          }
        }
      }
    }
  }
  .log-wp {
    height: 100%;
  }
}
</style>
