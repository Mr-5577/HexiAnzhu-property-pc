<template>
  <div id="payment-history">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <input
            type="text"
            class="common-input"
            placeholder="请输入票据/订单号"
            v-model="searchVal"
            style="margin-left: 0;"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="tableLoad"
          >
            查询
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="payMethods"
          clearable
          placeholder="请选择付款方式"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in methodOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择缴费状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in statusOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          align="center"
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
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @detail="showDetial"
          @print="print"
          @buyBack="buyBack"
          @selectChange="selectChange"
        ></cus-table>
      </div>
    </div>

    <!-- 订单缴费详情弹框部分 -->
    <el-dialog
      :visible.sync="showDetailPop"
      title="订单缴费详情"
      width="60%"
      :close-on-click-modal="true"
    >
      <div class="table-wp">
        <cus-table
          :datas="popTableData"
          :cusColums="popColumns"
          :cusConf="popConf"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="name">实收</span>
          <span class="value">{{ realityMoney }}元</span>
          <span class="name">应收</span>
          <span class="value ys">{{ receivableMoney }}元</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chargeManage from '@/assets/charge/json/charge-manage.json'
import historyDetail from '@/assets/charge/json/history-detail-dialog.json'
// 导入打印 js 文件
import myPrint from '@/assets/common/js/LodopNew.js'

export default {
  name: 'paymentHistory',
  props: ['vid', 'oid'],
  data() {
    return {
      urlObj: {
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        historycost: this.$api.state.Charge.historycost.url,
        sndetail: this.$api.state.Charge.sndetail.url,
        changepaytype: this.$api.state.Charge.changepaytype.url,
        resalesn: this.$api.state.Charge.resalesn.url,
        issueReceipt: this.$api.state.Charge.issueReceipt.url
      },
      // 搜索框绑定值
      searchVal: '',
      // 付款方式下拉框绑定值
      payMethods: '',
      methodOptions: [],
      // 缴费状态绑定值
      statusVal: '',
      statusOptions: [
        {
          value: 1,
          label: '未缴纳'
        },
        {
          value: 2,
          label: '已缴纳'
        }
      ],
      // 日期选择框绑定值
      dateValue: [],
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: chargeManage.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否显示明细弹框
      showDetailPop: false,
      // 表格数据
      popTableData: [],
      // 表格列数据配置
      popColumns: historyDetail.list,
      // 表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 实收金额
      realityMoney: '',
      // 应收金额
      receivableMoney: ''
    }
  },

  mounted() {
    // let date = new Date()
    // let y = date.getFullYear()
    // let m = date.getMonth() + 1
    // let d = date.getDate()
    // let start = new Date(y + '-' + m + '-' + d + ' 00:00:00').getTime()
    // let end = date.getTime()
    // // 时间选择器初始化
    // this.dateValue = [start, end]
    this.getPaymentType()
  },

  methods: {
    // 获取支付方式
    getPaymentType() {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.methodOptions = res.Data ? res.Data : []
            this.tableLoad()
          } else {
            let msg = res.Message ? res.Message : '获取支付方式失败！'
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
        is_page: 1,
        page: this.conf.curPage,
        limit: this.conf.limit,
        oid: this.oid,
        status: this.statusVal,
        pay_type: this.payMethods,
        keywords: this.searchVal
      }
      if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        data.stime = this.dateValue[0] / 1000
        data.etime = this.dateValue[1] / 1000
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.historycost, data)
        .then(res => {
          if (res.Code === 200) {
            // 设置查询总数
            this.conf.dataTotal = res.Data.list.total
            if (res.Data.list.data && res.Data.list.data.length > 0) {
              let ids = this.methodOptions.map(item => item.id)
              res.Data.list.data.forEach(item => {
                item.cname = item.creater ? item.creater.realname : ''
                item.status_text = item.status == 0 ? '未缴纳' : '已缴纳'
                item.disabled = item.pstatus == 1 ? false : true
                item.options = this.methodOptions
                item.type = ids.includes(item.type)
                  ? item.type
                  : item.payment
                  ? item.payment.name
                  : ''
              })
            }
            // 存放查询数据
            this.tableData = res.Data.list.data
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

    // 支付方式更改处理
    selectChange(index) {
      let data = {
        id: this.tableData[index].id,
        pay_type: this.tableData[index].type
      }
      this.$axios
        .post(this.urlObj.changepaytype, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              message: '支付方式修改成功！',
              type: 'success'
            })
          } else {
            let msg = res.Message ? res.Message : '支付方式修改失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          // 重新获取一次数据
          this.tableLoad()
        })
        .catch(() => {})
    },

    // 获取弹框表格数据
    getDialogTable(data) {
      // 表格处于加载状态
      this.popConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.sndetail, data)
        .then(res => {
          if (res.Code === 200) {
            this.realityMoney = res.Data.allmoney ? res.Data.allmoney : '0.00'
            this.receivableMoney = res.Data.money ? res.Data.money : '0.00'
            if (res.Data.deatil && res.Data.deatil.length > 0) {
              res.Data.deatil.forEach(item => {
                item.subname = item.subject.name
              })
            }
            // 存放查询数据
            this.popTableData = res.Data.deatil
            // 关闭加载状态
            this.popConf.loadStatus = false
            // 清空空数据提示
            this.popConf.emptyText = ''
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
            this.popTableData = []
            this.popConf.emptyText = res.Message
            this.popConf.dataTotal = 0
            this.popConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.popTableData = []
          this.popConf.emptyText = '服务器连接失败...'
          this.popConf.dataTotal = 0
          this.popConf.loadStatus = false
        })
    },

    // 查看详情
    showDetial(index) {
      this.showDetailPop = true
      this.getDialogTable({ id: this.tableData[index].id })
    },

    // 打印
    print(index) {
      let data = {
        id: this.tableData[index].id
      }
      this.$axios
        .post(this.urlObj.issueReceipt, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.id = data.id
            // 开始打印
            myPrint.startLodop(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取打印收据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 返销
    buyBack(index) {
      this.$confirm('此操作将返销当前订单，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 返销确认请求
          let data = {
            id: this.tableData[index].id
          }
          this.$axios
            .post(this.urlObj.resalesn, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  message: '订单返销成功！',
                  type: 'success'
                })
                // 重新获取一次表格数据
                this.tableLoad()
              } else {
                let msg = res.Message ? res.Message : '订单返销失败！'
                this.$message({
                  message: msg,
                  type: 'error'
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less">
#payment-history {
  font-family: 'Source Han Sans CN';
  width: 100%;
  height: calc(100% - 60px);
  .top {
    background-color: hsl(0, 0%, 100%);
    padding: 15px 20px;
  }
  .main-wp {
    border-top: 1px solid #ebebeb;
    overflow: hidden;
    height: calc(100% - 71px);
    background-color: #fff;
    display: block !important;
    .select-wp {
      padding: 15px 20px;
      .el-select {
        width: 20%;
        max-width: 220px;
        margin-right: 20px;
      }
      .el-date-editor {
        width: 31%;
        max-width: 355px;
        background-color: #f2f2f2;
        border: none;
        .el-range__icon,
        .el-range-separator,
        .el-input__icon {
          line-height: 34px;
        }
      }
    }
    .table-wp {
      height: calc(100% - 70px);
      position: relative;
      .el-table th {
        background-color: #f7f7f7;
      }
      .el-table td {
        .el-select {
          input {
            background-color: transparent !important;
            text-align: center;
          }
          .el-select__caret {
            color: #3ebb75;
          }
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
    height: 75%;
    .el-dialog__body {
      height: calc(100% - 68px) !important;
      padding: 0 !important;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 10px;
      .table-wp {
        width: 100%;
        height: calc(100% - 61px);
        position: relative;
        > #CusTable {
          .el-table {
            height: 100%;
            .el-table__body-wrapper {
              height: calc(100% - 56px);
              overflow-y: auto;
            }
          }
        }
        .total {
          padding: 20px 30px;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          color: #333;
          .name {
            font-size: 14px;
            color: #333;
            font-weight: normal;
            margin-left: 30px;
          }
          .value {
            color: #333;
            font-size: 16px;
            font-weight: 700;
            margin-left: 10px;
          }
          .value.ys {
            color: #ffc72f;
          }
        }
      }
    }
  }
}
</style>
