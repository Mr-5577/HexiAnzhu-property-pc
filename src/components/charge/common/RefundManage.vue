<template>
  <div id="refund-manage">
    <!-- 主页面 -->
    <div class="main-wp" v-show="!showDetail">
      <div class="title">
        退款管理
      </div>
      <div class="query-wp">
        <el-select
          v-model="subjectVal"
          clearable
          placeholder="请选择退款科目"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in subjectOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择退款状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in statusOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="tableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @selectionChange="selectionChange"
          @refund="tableRefund"
        ></cus-table>
      </div>
      <div class="btn-wp">
        <el-button
          :disabled="tableSelected.length === 0"
          type="primary"
          round
          @click="goRefund"
        >
          去退款
        </el-button>
      </div>
    </div>
    <!-- 退款明细、退款清单部分 -->
    <div class="detail-wp" v-show="showDetail">
      <el-scrollbar style="height: 100%;">
        <div class="refund-detial">
          <div class="title">退款明细</div>
          <div class="table-wp">
            <cus-table
              :datas="detailTable"
              :cusColums="detailColumns"
              :cusConf="detailConf"
              :check="true"
              @selectionChange="detailSelectChange"
              @textChange="moneyChange"
            ></cus-table>
          </div>
          <div class="total">
            合计退款
            <span>{{ refundTotal }}元</span>
          </div>
        </div>
        <div class="inventory">
          <div class="title">退款清单</div>
          <div class="table-wp">
            <cus-table
              :datas="inventoryTable"
              :cusColums="inventoryColumns"
              :cusConf="inventoryConf"
            ></cus-table>
          </div>
          <div class="btn-wp">
            <el-button
              :disabled="inventoryTable.length === 0"
              type="primary"
              round
              @click="refundConfirm"
            >
              确认退款
            </el-button>
            <el-button type="info" round @click="showDetail = false">
              取消
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 退款确认弹框部分 -->
    <el-dialog
      :visible="showDialog"
      title="退款确认"
      width="36%"
      :close-on-click-modal="false"
      @close="showDialog = false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          :hide-required-asterisk="true"
          ref="ruleForm"
        >
          <div
            class="refunds"
            v-for="(item, index) in ruleForm.refunds"
            :key="index"
          >
            <el-form-item
              label="退款金额"
              :prop="'refunds.' + index + '.money'"
              :rules="rules.money"
            >
              <el-input
                v-model="item.money"
                type="number"
                :readonly="isBatch"
                placeholder="请输入退款金额"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="退款方式"
              :prop="'refunds.' + index + '.method'"
              :rules="rules.method"
            >
              <el-select
                v-model="item.method"
                clearable
                placeholder="请选择退款方式"
              >
                <el-option
                  v-for="itm in methodOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <i
              v-if="index != 0"
              @click="delRefund(index)"
              class="el-icon-circle-close"
            ></i>
          </div>
          <el-form-item
            label="退款时间"
            prop="dateVal"
            v-if="!isBatch && showDate"
          >
            <el-date-picker
              v-model="ruleForm.dateVal"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              :default-value="defaultValue"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="add-content" v-if="!isBatch">
            <div class="add-more" @click="addMore">继续添加</div>
          </el-form-item>

          <el-form-item
            label="截止日期"
            prop="endTime"
            v-if="currentType == 'carmonth'"
          >
            <el-date-picker
              v-model="ruleForm.endTime"
              type="date"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="remark" label="退款原因" prop="remarkVal">
            <el-input
              type="textarea"
              :rows="3"
              resize="none"
              v-model="ruleForm.remarkVal"
              placeholder="请输入退款原因"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import refundCloumns from '@/assets/charge/json/refund-cloumns.json'
import refundDetailColumns from '@/assets/charge/json/refund-detail-columns.json'
import refundInventoryColumns from '@/assets/charge/json/refund-inventory-columns.json'

export default {
  name: 'refundManage',
  props: ['vid', 'oid'],
  data() {
    return {
      urlObj: {
        refundList: this.$api.state.Charge.refundList.url,
        refundCost: this.$api.state.Charge.refundCost.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        refundsubject: this.$api.state.Charge.refundsubject.url
      },
      // 状态选择框绑定值
      statusVal: '',
      statusOptions: [
        {
          id: 1,
          name: '未退款'
        },
        {
          id: 2,
          name: '退款中'
        },
        {
          id: 3,
          name: '已退款'
        }
      ],
      // 科目选择框绑定值
      subjectVal: '',
      subjectOptions: [],
      // 日期选择框绑定值
      dateVal: [],
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: refundCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 当前退款类型
      currentType: '',
      // 当前退款项 index
      currentIndex: 0,
      // 当前表格选中的数据
      tableSelected: [],
      // 明细表格数据
      detailTable: [],
      // 明细表格列数据配置
      detailColumns: refundDetailColumns.list,
      // 明细表格配置
      detailConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 清单表格数据
      inventoryTable: [],
      // 清单表格列数据配置
      inventoryColumns: refundInventoryColumns.list,
      // 清单表格配置
      inventoryConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否显示退款明细
      showDetail: false,
      // 合计退款
      refundTotal: '0.00',
      // 是否显示退款确认弹框
      showDialog: false,
      // 当前是批量退款还是单个退款
      isBatch: false,
      // 弹框表单数据对象
      ruleForm: {
        refunds: [
          {
            money: '',
            method: ''
          }
        ],
        dateVal: [],
        endTime: '',
        remarkVal: ''
      },
      // 表单验证对象
      rules: {
        money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        method: [
          { required: true, message: '请选择退款方式', trigger: 'change' }
        ],
        dateVal: [
          { required: true, message: '请选择退款时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ]
      },
      // 退款方式
      methodOptions: [],
      // 是否打印退款单
      printOptions: [],
      // 时间选择框配置
      pickerOptions: {},
      // 时间选择器默认时间
      defaultValue: '',
      // 是否正在提交数据
      isCommit: false,
      // 是否显示时间选择框
      showDate: true
    }
  },

  mounted() {
    this.getRefundSubjects()
    this.tableLoad()
  },

  methods: {
    // 获取可以退款的科目数据
    getRefundSubjects() {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.refundsubject, data)
        .then(res => {
          if (res.Code === 200) {
            this.subjectOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取退款科目数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 获取退款方式
    getPaymentType() {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.methodOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取退款方式失败！'
            this.$message({
              message: msg,
              type: 'error'
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
        owner_id: this.oid,
        subject_id: this.subjectVal,
        refund_status: this.statusVal,
        create_time: this.dateVal[0] ? this.dateVal[0] / 1000 : '',
        end_time: this.dateVal[1] ? this.dateVal[1] / 1000 : ''
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.refundList, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data.data && res.Data.data.length > 0) {
              res.Data.data.forEach(item => {
                item.payee = item.creater ? item.creater.realname : ''
                item.refund_status_text =
                  item.refund_status == 1
                    ? '退款中'
                    : item.refund_status == 2
                    ? '已退款'
                    : '未退款'
                item.disabled =
                  item.refund_status == 2 || item.open_refund == 0
                    ? true
                    : false
                item.ktmoney = _.round(
                  _.subtract(item.real_money, item.refund_money),
                  2
                )
                // 时间戳转 年月日
                let date = new Date(item.pay_time * 1000)
                let y = date.getFullYear()
                let m =
                  date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1
                let d =
                  date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                item.pay_time = y + '-' + m + '-' + d
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

    // 单个退款处理
    tableRefund(index) {
      this.currentIndex = index
      this.currentType = this.tableData[index].resources_model_type
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.refunds = [
        {
          money: '',
          method: ''
        }
      ]
      this.isBatch = false
      this.ruleForm.refunds[0].money = this.tableData[index].ktmoney
      if (
        this.tableData[index].previewCostRepair.stime &&
        this.tableData[index].previewCostRepair.etime
      ) {
        this.showDate = true
        this.defaultValue = this.tableData[index].previewCostRepair.stime * 1000
        this.pickerOptions = {
          disabledDate: time => {
            if (time) {
              let flag =
                time.getTime() <
                  this.tableData[index].previewCostRepair.stime * 1000 ||
                time.getTime() >
                  this.tableData[index].previewCostRepair.etime * 1000
              return flag
            }
          }
        }
      } else {
        this.showDate = false
      }

      this.showDialog = true
      // 获取退款方式
      this.getPaymentType()
    },

    // 点击去退款按钮处理
    goRefund() {
      let types = []
      let arr = JSON.parse(JSON.stringify(this.tableSelected))
      let total = 0
      let notRefund = false
      arr.forEach(item => {
        if (item.refund_status == 2 || item.open_refund == 0) {
          notRefund = true
        }
        if (!types.includes(item.resources_model_type)) {
          types.push(item.resources_model_type)
        }
        item.stime = item.previewCostRepair.stime
          ? item.previewCostRepair.stime * 1000
          : ''
        item.etime = item.previewCostRepair.etime
          ? item.previewCostRepair.etime * 1000
          : ''
        total = _.round(_.add(Number(total), Number(item.ktmoney)), 2)
      })
      if (types.length > 1) {
        this.$message({
          type: 'warning',
          message: '存在多种类型，请选择同一类型退款！'
        })
      } else if (notRefund) {
        this.$message({
          type: 'warning',
          message: '存在不能退款的订单,请重新选择！'
        })
      } else {
        this.currentType = types[0]
        this.detailTable = arr
        this.refundTotal = total
        this.showDetail = true
      }
    },

    // 修改金额处理
    moneyChange() {
      let total = 0
      this.detailTable.forEach(item => {
        total = _.round(_.add(Number(total), Number(item.ktmoney)), 2)
      })
      this.refundTotal = total
    },

    // 退款明细表格选择更改处理
    detailSelectChange(value) {
      this.inventoryTable = value
    },

    // 点击继续添加处理
    addMore() {
      this.ruleForm.refunds.push({
        money: '',
        method: ''
      })
    },

    // 删除
    delRefund(index) {
      this.ruleForm.refunds.splice(index, 1)
    },

    // 退款确认处理
    refundConfirm() {
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.refunds = [
        {
          money: '',
          method: ''
        }
      ]
      let total = 0
      this.inventoryTable.forEach(item => {
        total = _.round(_.add(Number(total), Number(item.ktmoney)), 2)
      })
      this.isBatch = true
      this.ruleForm.refunds[0].money = total
      this.showDialog = true
      this.getPaymentType()
    },

    // 表单数据提交处理
    formSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isCommit = true
          let data = { list: [] }
          // 判断是单个退款还是批量退款
          if (this.isBatch) {
            this.inventoryTable.forEach(item => {
              let obj = {
                id: item.id,
                money: item.ktmoney,
                stime: item.stime / 1000,
                etime: item.etime / 1000,
                payment_id: this.ruleForm.refunds[0].method,
                remark: this.ruleForm.remarkVal
              }
              data.list.push(obj)
            })
          } else {
            data.list = [
              {
                id: this.tableData[this.currentIndex].id,
                many_paytype: [],
                remark: this.ruleForm.remarkVal
              }
            ]
            if (this.showDate) {
              data.list[0].stime = this.ruleForm.dateVal[0] / 1000
              data.list[0].etime = this.ruleForm.dateVal[0] / 1000
            }
            this.ruleForm.refunds.forEach(item => {
              data.list[0].many_paytype.push({
                money: item.money,
                payment_id: item.method
              })
            })
          }
          if (this.currentType == 'carmonth') {
            data.car_endtime = this.ruleForm.endTime / 1000
          }
          this.$axios
            .post(this.urlObj.refundCost, data)
            .then(res => {
              if (res.Code === 200) {
                let msg = ''
                let type = ''
                if (res.Data.success_num > 0) {
                  if (res.Data.error_num == 0) {
                    msg = '退款成功！'
                    type = 'success'
                  } else {
                    msg = `退款成功条数：${res.Data.success_num}；失败条数：${
                      res.Data.error_num
                    }；错误信息：【${res.Data.error_msg.join(';')}】`
                    type = 'warning'
                  }
                  this.showDialog = false
                  this.showDetail = false
                  // 重新获取一次表格数据
                  this.tableLoad()
                } else {
                  msg = `退款成功条数：${res.Data.success_num}；失败条数：${
                    res.Data.error_num
                  }；错误信息：【${res.Data.error_msg.join(';')}】`
                  type = 'error'
                }
                this.$message({
                  type: type,
                  message: msg
                })
              } else {
                let msg = res.Message ? res.Message : '退款失败！'
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
        }
      })
    }
  }
}
</script>

<style lang="less">
#refund-manage {
  font-family: 'Source Han Sans CN';
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  .main-wp {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
    .title {
      color: #333;
      font-size: 16px;
      font-weight: 700;
      padding: 25px 30px;
    }
    .query-wp {
      position: absolute;
      top: 15px;
      right: 30px;
      width: calc(100% - 150px);
      text-align: right;
      .input-wp {
        width: 220px;
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
      }
      .el-select {
        margin-right: 15px;
        width: 23%;
      }
      .el-date-editor {
        width: 230px;
        border: none;
        background-color: #f2f2f2;
        .el-input__icon {
          line-height: 34px;
        }
      }
    }
    .table-wp {
      height: calc(100% - 70px);
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
        width: 120px;
      }
      .el-button + .el-button {
        margin-left: 20px !important;
      }
    }
  }
  .detail-wp {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .refund-detial,
    .inventory {
      background-color: #fff;
      .title {
        padding: 15px 20px;
        color: #333;
        font-size: 16px;
        font-weight: 700;
      }
      .table-wp {
        min-height: 210px;
        .el-table {
          min-height: 210px;
          th {
            background-color: #f7f7f7 !important;
          }
        }
      }
      .total {
        padding: 15px 30px;
        background-color: #fff;
        font-size: 15px;
        font-weight: 700;
        line-height: 20px;
        color: #333;
        text-align: right;
        border-radius: 6px;
        > span {
          font-size: 16px;
          margin-left: 10px;
        }
      }
    }
    .inventory {
      border-top: 15px solid #f2f2f2;
      margin-top: 15px;
      .btn-wp {
        padding: 15px 30px;
        text-align: center;
        .el-button + .el-button {
          margin-left: 100px !important;
        }
      }
    }
  }
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    height: 55%;
    .el-dialog__body {
      padding: 0 15px;
      box-sizing: border-box;
      height: calc(100% - 156px);
      .el-form {
        .refunds {
          position: relative;
          > i {
            position: absolute;
            top: 23px;
            right: 15px;
            font-size: 20px;
            color: #999;
            cursor: pointer;
          }
        }
        .add-content {
          height: 101px;
          padding-top: 55px !important;
        }
        .el-form-item {
          display: inline-block;
          width: 50%;
          padding: 15px 15px 5px;
          box-sizing: border-box;
          margin-bottom: 0 !important;
          .el-cascader,
          .el-select,
          .el-date-editor {
            width: 100%;
          }
          .el-date-editor {
            background-color: #f2f2f2;
            border: none;
          }
          .add-more {
            text-align: center;
            background-color: #f2f2f2;
            border-radius: 5px;
            cursor: pointer;
          }
        }
        .el-form-item.remark {
          display: block;
          width: 100%;
          .el-textarea {
            textarea {
              border: none;
              background-color: #f2f2f2;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      padding: 25px 30px;
      .el-button + .el-button {
        margin-left: 50px !important;
      }
    }
  }
}
</style>
