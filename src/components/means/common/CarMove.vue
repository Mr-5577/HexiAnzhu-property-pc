<template>
  <div id="car-move">
    <el-dialog
      :visible="isShow"
      title="车位变更过户"
      width="50%"
      @close="close"
    >
      <!-- 房产过户部分 -->
      <div class="transfer-wp">
        <el-scrollbar style="height: 100%;">
          <div style="padding: 1rem;">
            <el-autocomplete
              ref="searchInput"
              class="car-search"
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
                  <span class="td-item">
                    {{ item.sex ? item.sex : '未知' }}
                  </span>
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
          <div class="title">基本信息录入</div>
          <div class="content">
            <div
              class="new-item"
              v-for="(item, index) in infoList"
              :key="index"
            >
              <div class="name">{{ item.name }}</div>
              <el-input
                :type="item.type"
                v-model="item.value"
                :readonly="item.readonly"
                :placeholder="'请输入' + item.name"
              ></el-input>
            </div>
          </div>
          <div class="title">车牌信息录入</div>
          <ul class="info-wp">
            <li v-for="(item, index) in plateInfo" :key="index">
              <div class="info-item">
                <div class="name">
                  <span style="color: #f56c6c;">*</span>
                  车牌号
                </div>
                <el-input
                  v-model="item.plates"
                  placeholder="请输入内容"
                ></el-input>
              </div>
              <div class="info-item">
                <div class="name">
                  <span style="color: #f56c6c;">*</span>
                  车主姓名
                </div>
                <el-input
                  v-model="item.name"
                  placeholder="请输入内容"
                ></el-input>
              </div>
              <div class="info-item">
                <div class="name">
                  <span style="color: #f56c6c;">*</span>
                  联系电话
                </div>
                <el-input
                  v-model="item.tel"
                  type="number"
                  placeholder="请输入内容"
                ></el-input>
              </div>
              <div class="info-item del" v-if="plateInfo.length > 1">
                <div class="name"></div>
                <i class="el-icon-delete-solid" @click="deletePlate(index)"></i>
              </div>
            </li>
            <li class="ico-wp">
              <div class="info-item">
                <i class="iconfont iconxinzeng" @click="addPlate"></i>
              </div>
            </li>
          </ul>
          <div class="title">备注说明</div>
          <el-input
            type="textarea"
            :rows="3"
            resize="none"
            v-model="remarkVal"
          ></el-input>
        </el-scrollbar>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="commit">
          提交保存
        </el-button>
        <el-button :loading="isCommit" type="info" round @click="close()">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CarMove',
  data() {
    return {
      // 接口数据对象
      urlObj: {
        userSearch: this.$api.state.Means.userSearch.url,
        userType: this.$api.state.Means.userType.url,
        carRemove: this.$api.state.Means.carRemove.url,
        checkhascost: this.$api.state.Means.checkhascost.url
      },
      // 当前车位信息
      currentStall: '',
      // 是否显示弹框
      isShow: false,
      // 房产客户信息项
      infoList: [],
      // 用户搜索框绑定值
      autoValue: '',
      // 当前选择的用户
      currentUser: '',
      // 业主列表
      allUserList: [],
      // 没有更多用户数据
      nomore: false,
      // 车牌信息
      plateInfo: [],
      // 备注输入框绑定值
      remarkVal: '',
      // 是否正在提交数据
      isCommit: false
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
    // 车位过户初始化
    init(obj) {
      this.isShow = true
      this.currentStall = obj
      this.infoList = [
        {
          name: '车主姓名',
          value: '',
          type: 'text',
          readonly: false
        },
        {
          name: '身份证号',
          value: '',
          type: 'text',
          readonly: false
        },
        {
          name: '联系电话',
          value: '',
          type: 'number',
          readonly: false
        },
        {
          name: '车位编号',
          value: obj.sort,
          type: 'text',
          readonly: true
        }
      ]
      if (obj.carmotor.length > 0) {
        let arr = []
        obj.carmotor.forEach(item => {
          let value = {
            id: item.id,
            name: item.name,
            tel: item.tel,
            plates: item.plates
          }
          arr.push(value)
        })
        this.plateInfo = arr
      } else {
        this.plateInfo = [
          {
            name: '',
            tel: '',
            plates: ''
          }
        ]
      }
    },

    // 搜索获取过户业主数据
    async querySearchAsync(queryStr, cb) {
      let value = {
        keywords: queryStr,
        page: 1,
        limit: 20,
        vid: this.currentStall.vid
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
          vid: this.currentStall.vid
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
      let arr = this.infoList.slice(0)
      arr[0].value = user.realname
      arr[1].value = user.idcard
      arr[2].value = user.tel
      this.infoList = arr
    },

    // 点击车牌添加图标处理
    addPlate() {
      let data = {
        name: '',
        plates: '',
        tel: ''
      }
      this.plateInfo.push(data)
    },

    // 点击车牌删除图标处理
    deletePlate(index) {
      this.plateInfo.splice(index, 1)
    },

    // 弹框关闭处理
    close() {
      this.isShow = false
    },

    // 修改输入框值是否为空验证
    inputVerify(data) {
      let msg = '请填写'
      this.infoList.forEach(item => {
        item.value = item.type == 'text' ? item.value.trim() : item.value
        if (item.value === '') {
          if (msg.length > 3) {
            msg = msg + '、' + item.name
          } else {
            msg = msg + item.name
          }
        }
      })
      let plates = []
      this.plateInfo.forEach(item => {
        if (item.name && item.tel && item.plates) {
          plates.push(item)
        } else if (!item.name && !item.tel && !item.plates) {
        } else {
          if (msg.length > 3 && !msg.includes('车牌信息')) {
            msg = msg + '、' + '车牌信息'
          } else if (!msg.includes('车牌信息')) {
            msg = msg + '车牌信息'
          }
        }
      })
      if (plates.length > 0) {
        data.plates = plates
      } else {
        if (msg.length > 3 && !msg.includes('车牌信息')) {
          msg = msg + '、' + '车牌信息'
        } else if (!msg.includes('车牌信息')) {
          msg = msg + '车牌信息'
        }
      }
      if (msg.length > 3) {
        this.$message({
          type: 'warning',
          message: msg
        })
        return false
      } else {
        return true
      }
    },

    // 提交数据处理
    commit() {
      let data = {}
      let flag = false
      flag = this.inputVerify(data)
      data.oid = this.currentUser.id
      if (!flag) {
        return
      }
      if (!data.oid) {
        this.$message({
          type: 'warning',
          message: '请选择客户！'
        })
        return
      }
      this.isCommit = true
      // 判断是否存在欠费
      this.judgeArrearage(data)
    },

    // 判断是否存在欠费
    judgeArrearage(data) {
      this.$axios
        .post(this.urlObj.checkhascost, { id: this.currentStall.id })
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.status == 1) {
              this.$confirm(
                `当前业主存在欠费，过户后欠费将自动更新到新业主名下，是否继续?`,
                '提示',
                {
                  confirmButtonText: '继续',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
                .then(() => {
                  this.moveRequest(data)
                })
                .catch(() => {
                  this.isCommit = false
                })
            } else {
              this.moveRequest(data)
            }
          } else {
            let msg = res.Message ? res.Message : '数据提交失败！'
            this.$message({
              type: 'error',
              message: msg
            })
            this.isCommit = false
          }
        })
    },

    // 过户请求
    moveRequest(data) {
      data.id = this.currentStall.id
      data.remark = this.remarkVal
      data.non_owner_name = this.infoList[0].value
      data.non_owner_id = this.infoList[1].value
      data.non_owner_tel = this.infoList[2].value
      // 提交数据请求
      this.$axios
        .post(this.urlObj.carRemove, data)
        .then(res => {
          if (res.Code === 200) {
            this.isShow = false
            // 重新获取车位详情数据
            this.$emit('moveSuccess')
          } else {
            let msg = res.Message ? res.Message : '数据提交失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isCommit = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '数据提交失败！'
          })
          this.isCommit = false
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
#car-move {
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    height: 65%;
    .el-dialog__body {
      height: calc(100% - 158px);
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  .transfer-wp {
    height: 100%;
    .el-autocomplete.car-search {
      width: 100%;
    }
    .el-scrollbar__view {
      overflow: hidden;
      .title {
        margin: 0 20px 10px;
        color: #333;
        line-height: 30px;
        font-size: 16px;
        font-weight: 700;
      }
      .content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .new-item {
          width: 33%;
          padding: 0 20px 30px;
          box-sizing: border-box;
          .name {
            color: #666;
            font-size: 15px;
            line-height: 24px;
            margin-bottom: 10px;
          }
          .el-select {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
        }
      }
      .info-wp {
        li {
          margin-bottom: 20px;
          display: flex;
          .info-item {
            box-sizing: border-box;
            width: 30%;
            padding: 0 20px;
            .name {
              height: 24px;
              font-size: 15px;
              color: #666;
              line-height: 24px;
              margin-bottom: 10px;
            }
            i {
              line-height: 40px;
              font-size: 16px;
              cursor: pointer;
              color: #ccc;
            }
            i:hover {
              color: #ffcb3c;
            }
          }
          .info-item.del {
            width: 10%;
          }
        }
        li.ico-wp {
          margin-top: 30px;
          .info-item {
            i {
              display: inline-block;
              width: 100%;
              height: 40px;
              border: 1px dashed #d2d2d2;
              border-radius: 5px;
              box-sizing: border-box;
              text-align: center;
              line-height: 40px;
              color: #afafaf;
              cursor: pointer;
            }
          }
        }
      }
      .el-textarea {
        padding: 0 20px;
        box-sizing: border-box;
        margin-bottom: 10px;
        textarea {
          border: none;
          background-color: #f7f7f7;
          border-radius: 6px;
        }
      }
    }
  }
}
</style>
