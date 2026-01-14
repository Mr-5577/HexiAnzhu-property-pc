<template>
  <div id="charge-adjust">
    <div class="title">欠费列表</div>
    <div class="table-wp">
      <cus-table
        :datas="tableData"
        :cusColums="columns"
        :cusConf="conf"
        :ispaging="true"
        :check="true"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        @moneyEdit="moneyEdit"
        @selectionChange="selectionChange"
      ></cus-table>
    </div>
    <div class="btn-wp">
      <el-button
        :disabled="tableSelected.length == 0"
        type="primary"
        round
        @click="chargeTransfer"
      >
        转移欠费
      </el-button>
      <el-button
        :disabled="tableSelected.length == 0"
        type="primary empty"
        round
        @click="deleteCharge"
      >
        删除欠费({{ tableSelected.length }})
      </el-button>
    </div>

    <!-- 修改金额/转移欠费弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      :title="dialogTitle"
      width="38%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="header" v-if="type == 'transfer'">
          <div class="msg-item">
            <div class="info">
              <span class="name">欠费资源</span>
              <span class="value">{{ currentArrea.resource }}</span>
            </div>
            <div class="info">
              <span class="name">总欠金额</span>
              <span class="value money">{{ currentArrea.money }}元</span>
            </div>
          </div>
          <div class="msg-item">
            <div class="info">
              <span class="name">资源类型</span>
              <span class="value">{{ currentArrea.resourceType }}</span>
            </div>
            <div class="info">
              <span class="name">欠费笔数</span>
              <span class="value">{{ currentArrea.num }}笔</span>
            </div>
          </div>
          <div class="msg-item">
            <div class="info">
              <span class="name">原欠费人</span>
              <span class="value">{{ currentArrea.user }}</span>
            </div>
          </div>
        </div>
        <div class="header" v-else>
          <!-- 修改金额 -->
          <div class="left" v-if="type == 'editmoney'">
            <div class="info-item">
              <span class="name">科目名称</span>
              <span class="value">{{ currentArrea.subName }}</span>
            </div>
            <div class="info-item">
              <span class="name">收费对象</span>
              <span class="value">{{ currentArrea.user }}</span>
            </div>
            <div class="info-item">
              <span class="name">修改前金额</span>
              <span class="value money">{{ currentArrea.money }}元</span>
            </div>
          </div>
          <!-- 删除欠费 -->
          <div class="left" v-if="type == 'delete'">
            <div class="info-item">
              <span class="name">科目名称</span>
              <span class="value">{{ currentArrea.subjects }}</span>
            </div>
            <div class="info-item">
              <span class="name">合计条数</span>
              <span class="value">{{ currentArrea.num }}</span>
            </div>
            <div class="info-item">
              <span class="name">合计金额</span>
              <span class="value money">{{ currentArrea.money }}元</span>
            </div>
          </div>
          <div class="right">
            <div class="name">欠费描述</div>
            <div class="value">{{ currentArrea.des }}</div>
          </div>
        </div>
        <div class="money-edit" v-if="type == 'editmoney'">
          <div class="title">修改金额(元)</div>
          <el-input
            type="number"
            v-model="moneyVal"
            placeholder="请输入修改后金额"
          ></el-input>
        </div>
        <div class="select-wp" v-if="type == 'transfer'">
          <div class="name">转移给</div>
          <el-select
            v-model="movePeople"
            filterable
            clearable
            placeholder="请选择人员"
          >
            <el-option
              v-for="itm in moveOptions"
              :key="itm.id"
              :label="itm.realname"
              :value="itm.id"
            ></el-option>
          </el-select>

          <i class="upload el-icon-upload" @click="showUpload"></i>
        </div>
        <div class="remark-wp">
          <div class="title">备注说明</div>
          <el-input
            type="textarea"
            :rows="3"
            resize="none"
            v-model="remarkVal"
            placeholder="请输入备注信息"
          ></el-input>
        </div>
        <div class="audit-wp" v-if="type != 'transfer'">
          <i class="upload el-icon-upload" @click="showUpload"></i>
          <div class="title">审批人员设置</div>
          <ul>
            <li v-for="(item, index) in userList" :key="index">
              <i
                class="del el-icon-circle-close"
                v-if="userList.length > 1"
                @click="delAuditor(index)"
              ></i>
              <div class="name">审批人{{ index + 1 }}</div>
              <el-select
                :ref="'remoteSelect' + index"
                v-model="item.value"
                filterable
                remote
                placeholder="输入姓名、手机号搜索"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.uid"
                  :label="
                    `${
                      item.company.shortname
                        ? item.company.shortname
                        : item.company.deptname
                    } - ${item.realname} -${item.position.posname}`
                  "
                  :value="item.uid"
                ></el-option>
              </el-select>
            </li>
            <li class="add">
              <div class="name"></div>
              <div class="label" @click="addAuditor">
                <i class="iconfont iconxinzeng"></i>
                添加审批人员
              </div>
            </li>
          </ul>
        </div>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showEditDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 上传附件弹框部分 -->
    <el-dialog
      class="uploadDialog"
      :visible.sync="showUploadDialog"
      title="上传附件"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="table-wp">
          <cus-table
            :datas="fileInfos"
            :cusColums="popColumns"
            :cusConf="popConf"
            @delete="fileDelete"
          ></cus-table>
        </div>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-upload
          class="upload"
          ref="upload"
          :action="qiniuDatas ? qiniuDatas.domain : ''"
          :http-request="customUpload"
          :show-file-list="false"
        >
          <el-button type="primary" round>
            上传新附件
          </el-button>
        </el-upload>

        <el-button type="info" round @click="showUploadDialog = false">
          返回
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import chargeListCloumns from '@/assets/charge/json/charge-list-cloumns.json'
import uploadCloumns from '@/assets/charge/json/upload-cloumns.json'
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'chargeAdjust',
  props: ['currentUser'],
  data() {
    return {
      urlObj: {
        getArrearages: this.$api.state.Charge.getArrearages.url,
        resourceOwner: this.$api.state.Charge.resourceOwner.url,
        getUsers: this.$api.state.Public.getUsers.url,
        arrearagesEdit: this.$api.state.Charge.arrearagesEdit.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
        delFile: this.$api.state.Public.delFile.url,
        saveUploadInfo: this.$api.state.Public.saveUploadInfo.url
      },
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: chargeListCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前选择的列表数据
      tableSelected: [],
      // 当前编辑的欠费数据
      currentArrea: {},
      // 表格列数据配置
      popColumns: uploadCloumns.list,
      // 表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否显示弹框
      showEditDialog: false,
      // 是否显示上传附件弹框
      showUploadDialog: false,
      // 是否正在提交数据
      isCommit: false,
      // 当前弹框类型（修改、删除、转移）
      type: 'editmoney',
      // 修改金额绑定值
      moneyVal: '',
      // 转移人
      movePeople: '',
      moveOptions: [],
      // 备注绑定值
      remarkVal: '',
      // 是否正在远程搜索
      loading: false,
      // 用户列表
      userList: [
        {
          value: ''
        }
      ],
      userOptions: [],
      // 图片/文件上传参数
      qiniuDatas: '',
      // 当前上传文件的信息
      fileInfos: [],
      // 上传文件 key 列表
      fileKeys: []
    }
  },

  /**
   * 计算属性
   */
  computed: {
    dialogTitle() {
      let title = '修改欠费金额'
      switch (this.type) {
        case 'editmoney':
          title = '修改欠费金额'
          break
        case 'delete':
          title = '删除欠费'
          break
        case 'transfer':
          title = '转移欠费'
          break
      }
      return title
    }
  },

  mounted() {
    this.tableLoad()
    this.getUploadToken()
  },

  methods: {
    // 获取文件上传 token
    getUploadToken() {
      this.$axios.post(this.urlObj.uploadToken).then(res => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    // 获取表格数据
    tableLoad() {
      this.conf.loadStatus = true
      let data = {
        resources_id: this.currentUser.id,
        type: this.currentUser.type,
        oid: this.currentUser.oid
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.getArrearages, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              let money = 0
              res.Data.forEach(item => {
                item.subName = item.subject ? item.subject.name : '--'
                item.cname = item.creater ? item.creater.realname : '--'
                money = money + Number(item.money)
                item.is_apply = item.is_apply == 1 ? true : false
                item.apply_type = item.apply_type ? item.apply_type : '--'
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
      this.tableLoad()
    },

    // 当前页码改变处理
    currentChange(num) {
      this.conf.curPage = num
      // 获取一次表格数据
      this.tableLoad()
    },

    // 表格选择更改处理
    selectionChange(value) {
      this.tableSelected = value
    },

    // 获取转交人列表数据
    getTransferList() {
      let data = {
        id: this.currentUser.id,
        type: this.currentUser.type
      }
      this.$axios
        .post(this.urlObj.resourceOwner, data)
        .then(res => {
          if (res.Code === 200) {
            this.moveOptions = res.Data
          } else {
            let msg = res.Message ? res.Message : '获取转交人列表数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 审批人远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        // 获取审批人数据
        let data = {
          keywords: query
        }
        this.$axios
          .post(this.urlObj.getUsers, data)
          .then(res => {
            if (res.Code === 200) {
              this.userOptions = res.Data
            } else {
              let msg = res.Message ? res.Message : '获取转交人列表数据失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.userOptions = []
      }
    },

    // 修改金额
    moneyEdit(index) {
      this.type = 'editmoney'
      this.currentArrea = {
        id: this.tableData[index].id,
        subName: this.tableData[index].subject
          ? this.tableData[index].subject.name
          : '--',
        user: this.tableData[index].owner
          ? this.tableData[index].owner.realname
          : '--',
        money: this.tableData[index].money,
        des: this.tableData[index].describe
      }
      this.moneyVal = ''
      this.remarkVal = ''
      this.userList = [{ value: '' }]
      this.userOptions = []
      this.showEditDialog = true
    },

    // 转移欠费
    chargeTransfer() {
      // 判断是否存在审批中的数据
      let isApply = this.tableSelected.some(item => item.is_apply == 1)
      if (isApply) {
        this.$message({
          type: 'warning',
          message: '存在审批中的数据，不能批量转移！'
        })
      } else {
        this.type = 'transfer'
        let total = 0
        this.tableSelected.forEach(item => {
          total = total + Number(item.money)
        })
        this.currentArrea = {
          resource: this.tableSelected[0].title,
          resourceType: this.tableSelected[0].resources_model_type,
          user: this.tableData[0].owner
            ? this.tableData[0].owner.realname
            : '--',
          money: _.round(total, 2),
          num: this.tableSelected.length
        }
        this.movePeople = ''
        this.moveOptions = []
        this.remarkVal = ''
        this.userList = [{ value: '' }]
        this.userOptions = []
        this.showEditDialog = true
        // 获取转交人列表数据
        this.getTransferList()
      }
    },

    // 删除欠费
    deleteCharge() {
      // 判断是否存在审批中的数据
      let isApply = this.tableSelected.some(item => item.is_apply == 1)
      if (isApply) {
        this.$message({
          type: 'warning',
          message: '存在审批中的数据，不能批量删除！'
        })
      } else {
        this.type = 'delete'
        let total = 0
        let subjects = []
        this.tableSelected.forEach(item => {
          total = total + Number(item.money)
          if (!subjects.includes(item.subject.name)) {
            subjects.push(item.subject.name)
          }
        })
        this.currentArrea = {
          subjects: subjects.join('、'),
          des: this.tableSelected[0].describe,
          money: _.round(total, 2),
          num: this.tableSelected.length
        }
        this.remarkVal = ''
        this.userList = [{ value: '' }]
        this.userOptions = []
        this.showEditDialog = true
      }
    },

    // 添加审批人
    addAuditor() {
      this.userList.push({ value: '' })
    },

    // 删除审批人
    delAuditor(index) {
      this.userList.splice(index, 1)
    },

    // 点击上传图标处理
    showUpload() {
      this.showUploadDialog = true
    },

    // 自定义上传
    customUpload(params) {
      params.url = this.$refs.upload.uploadFiles[0].url
      let uploadInfo = qiniuUpload(params, this.qiniuDatas)
      uploadInfo.observable.subscribe({
        // 上传开始
        // 接收上传进度信息，result是带有total字段的 Object
        // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
        next: result => {},
        // 上传错误后失败报错
        error: errResult => {},
        complete: result => {
          // 保存文件到数据库
          this.fileSave(uploadInfo.fileInfo)
          // 获取当前日期
          let date = new Date()
          let y = date.getFullYear()
          let m =
            date.getMonth() + 1 < 10
              ? '0' + (date.getMonth() + 1)
              : date.getMonth() + 1
          let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          uploadInfo.fileInfo.time = y + '-' + m + '-' + d
          uploadInfo.fileInfo.size =
            _.round(_.divide(uploadInfo.fileInfo.size, 1024), 2) + 'kb'
          // 接收成功后返回的信息
          this.fileInfos.push(uploadInfo.fileInfo)
        }
      })
    },

    // 保存图片到数据库
    fileSave(data) {
      this.$axios.post(this.urlObj.saveUploadInfo, data).then(res => {
        if (res.Code === 200) {
          this.fileKeys.push(res.Data.id)
        } else {
          let msg = res.Message ? res.Message : '文件保存失败！'
          this.$message({
            message: msg,
            type: 'error'
          })
        }
      })
    },

    // 文件删除处理
    fileDelete(index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            id: this.fileKeys[index]
          }
          // 删除七牛云文件
          this.$axios.post(this.urlObj.delFile, data).then(res => {
            if (res.Code === 200) {
              this.$message({
                message: '文件删除成功！',
                type: 'success'
              })
            } else {
              let msg = res.Message ? res.Message : '文件删除失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          this.fileInfos.splice(index, 1)
          this.fileKeys.splice(index, 1)
        })
        .catch(() => {})
    },

    // 提交数据处理
    confirm() {
      let ids = []
      let uids = []
      this.tableSelected.forEach(item => {
        ids.push(item.id)
      })
      this.userList.forEach(item => {
        if (item.value && !uids.includes(item.value)) {
          uids.push(item.value)
        }
      })
      let data = {
        ids: ids,
        op_type: this.type,
        bz: this.remarkVal,
        file: this.fileKeys,
        approval_uids: uids
      }
      if (this.type == 'editmoney') {
        data.money = this.moneyVal
        data.ids = [this.currentArrea.id]
      } else if (this.type == 'transfer') {
        data.transfer_oid = this.movePeople
      }
      // 数据验证
      let flag = false
      let msg = ''
      switch (this.type) {
        case 'editmoney':
          if (!data.money && data.approval_uids.length == 0) {
            msg = '请填写修改金额并选择审批人'
            flag = true
          } else if (!data.money) {
            msg = '请填写修改金额'
            flag = true
          } else if (data.approval_uids.length == 0) {
            msg = '请选择审批人'
            flag = true
          }
          break
        case 'transfer':
          if (!data.transfer_oid) {
            msg = '请选择转交人'
            flag = true
          }
          if (data.file.length == 0) {
            msg = '请上传附件'
            flag = true
          }
          // if (!data.transfer_oid && data.approval_uids.length == 0) {
          //   msg = '请选择转交人和审批人'
          //   flag = true
          // } else if (!data.transfer_oid) {
          //   msg = '请选择转交人'
          //   flag = true
          // } else if (data.approval_uids.length == 0) {
          //   msg = '请选择审批人'
          //   flag = true
          // }
          break
        case 'delete':
          if (data.approval_uids.length == 0) {
            msg = '请选择审批人'
            flag = true
          }
          break
      }
      if (flag) {
        this.$message({
          type: 'warning',
          message: msg
        })
      } else {
        this.commitRequest(data)
      }
    },

    // 提交请求
    commitRequest(data) {
      this.isCommit = true
      this.$axios
        .post(this.urlObj.arrearagesEdit, data)
        .then(res => {
          if (res.Code === 200) {
            let msg =
              this.type == 'delete'
                ? '欠费删除成功！'
                : this.type == 'transfer'
                ? '欠费转移成功！'
                : '欠费编辑成功！'
            this.$message({
              message: msg,
              type: 'success'
            })
            // 关闭弹框
            this.showEditDialog = false
            // 重新获取一次表格数据
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '数据提交失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.isCommit = false
        })
        .catch(() => {
          this.isCommit = false
        })
    }
  }
}
</script>

<style lang="less">
#charge-adjust {
  font-family: 'Source Han Sans CN';
  width: 100%;
  height: calc(100% - 60px);
  background-color: #fff;
  position: relative;
  .title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
    padding: 15px 20px;
  }
  .table-wp {
    height: calc(100% - 50px);
    .el-table th {
      background-color: #f7f7f7;
    }
  }
  .btn-wp {
    position: absolute;
    bottom: 10px;
    left: 30px;
    background-color: #fff;
    .el-button {
      width: 130px;
    }
    .el-button + .el-button {
      margin-left: 20px !important;
    }
    .el-button + .el-button.is-disabled {
      color: #c0c4cc;
      background-color: #fff;
      opacity: 0.6;
    }
  }

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    .el-dialog__body {
      height: calc(100% - 158px);
      padding: 0 30px !important;
      box-sizing: border-box;
    }
  }

  .editDialog {
    .el-dialog {
      height: 70%;
      .el-dialog__body {
        .header {
          background-color: #f2f2f2;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          padding: 15px;
          margin-top: 20px;
          .msg-item {
            padding: 15px;
            box-sizing: border-box;
            .info {
              .name {
                color: #999;
                font-size: 14px;
              }
              .value {
                color: #333;
                font-size: 14px;
                margin-left: 10px;
              }
              .value.money {
                color: #ffcb3c;
              }
            }
            .info:first-child {
              margin-bottom: 20px;
            }
          }
          .left {
            flex: 1;
            padding: 5px 10px;
            box-sizing: border-box;
            .info-item {
              margin-bottom: 15px;
              .name {
                margin-right: 10px;
                color: #999;
                font-size: 14px;
              }
              .value {
                color: #333;
                font-size: 14px;
              }
              .value.money {
                color: #ffcb3c;
              }
            }
            .info-item:last-child {
              margin-bottom: 0;
            }
          }
          .right {
            flex: 1;
            padding: 5px 10px;
            box-sizing: border-box;
            .name {
              color: #999;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .value {
              color: #333;
              font-size: 14px;
            }
          }
        }
        .money-edit {
          margin-top: 20px;
          .title {
            color: #666;
            font-size: 14px;
            padding: 0;
            font-weight: 400;
            margin-bottom: 10px;
          }
          .el-input {
            width: 47%;
          }
        }
        .select-wp {
          margin-top: 20px;
          .name {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          .el-select {
            width: 47%;
          }
          i.upload {
            font-size: 24px;
            color: #ccc;
            cursor: pointer;
            background-color: #eeeeee;
            padding: 8px;
            border-radius: 4px;
            vertical-align: middle;
            margin-left: 20px;
          }
          i.upload:hover {
            color: #3ebb75;
            background-color: #e1f8df;
          }
        }
        .remark-wp {
          margin-top: 20px;
          .title {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            padding: 0;
            font-weight: normal;
          }
          .el-textarea__inner {
            background-color: #f2f2f2;
            border: none;
            color: #333;
            font-size: 14px;
          }
        }
        .audit-wp {
          margin-top: 30px;
          position: relative;
          i.upload {
            position: absolute;
            top: -6px;
            right: 10px;
            font-size: 24px;
            color: #ccc;
            cursor: pointer;
            background-color: #eeeeee;
            padding: 4px;
            border-radius: 4px;
          }
          i.upload:hover {
            color: #3ebb75;
            background-color: #e1f8df;
          }
          .title {
            font-size: 14px;
            color: #333;
            padding: 0;
            margin-bottom: 10px;
          }
          > ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            li {
              width: 47%;
              padding: 10px 0;
              box-sizing: border-box;
              position: relative;
              i.del {
                display: none;
                position: absolute;
                top: 11px;
                right: 10px;
                color: #ccc;
                font-size: 18px;
                cursor: pointer;
              }
              .name {
                height: 20px;
                line-height: 20px;
                color: #333;
                font-size: 14px;
                margin-bottom: 10px;
              }
              .el-select {
                width: 100%;
              }
            }
            li:hover {
              i.del {
                display: inline-block;
              }
            }
            li.add {
              .label {
                background-color: #e1f8df;
                border-radius: 5px;
                color: #3ebb75;
                height: 40px;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
                i {
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
    }
  }

  .uploadDialog {
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        padding: 30px 30px 15px !important;
        .el-scrollbar__view {
          min-height: 100%;
          box-sizing: border-box;
          background-color: #f7f7f7;
        }
        .table-wp {
          height: 100%;
          background: #f7f7f7;
          border-radius: 6px;
          overflow: hidden;
          .el-table {
            background: #f7f7f7;
            th,
            td {
              background-color: #f7f7f7;
              border-color: #f7f7f7 !important;
            }
            td .cell {
              button.el-button--error {
                background-color: #f8e2e2;
                color: #ff6d6d;
                border: none;
              }
            }
          }
          .el-table td,
          .el-table th.is-leaf {
            border-bottom: 1px solid #f7f7f7;
          }
        }
        .el-table::before {
          display: none;
        }
      }
      .el-dialog__footer {
        .upload {
          display: inline-block;
          margin-right: 100px;
        }
      }
    }
  }
}
</style>
