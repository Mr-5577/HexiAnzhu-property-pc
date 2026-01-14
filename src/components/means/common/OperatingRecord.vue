<template>
  <div id="operating-record">
    <el-dialog
      :visible="isShow"
      title="车位操作记录"
      width="85%"
      @close="close"
    >
      <div class="transfer-wp">
        <el-scrollbar style="height: 100%;">
          <div
            class="table-wp"
            v-if="carType == 'car' || carType == 'carmonth'"
          >
            <cus-table
              ref="table1"
              title=""
              :datas="tableData1"
              :cusColums="columns1"
              :cusConf="conf1"
              @transfer="carTransfer"
            ></cus-table>
          </div>
          <div
            class="table-wp"
            v-if="carType == 'car' || carType == 'carmonth'"
          >
            <div class="title">缴费信息</div>
            <cus-table
              ref="table2"
              title="缴费信息"
              :datas="tableData2"
              :cusColums="columns2"
              :cusConf="conf2"
            ></cus-table>
          </div>
          <div class="table-wp">
            <div class="title">操作记录</div>
            <cus-table
              ref="table3"
              title="操作记录"
              :datas="tableData3"
              :cusColums="columns3"
              :cusConf="conf3"
            ></cus-table>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 导入固定车位信息表格json 文件
import parkingInfo from '@/assets/means/json/parking-info.json'
// 导入月租车位信息表格json 文件
import mparkingInfo from '@/assets/means/json/mparking-info.json'
// 导入车位交费记录表格json 文件
import parkingPayment from '@/assets/means/json/parking-payment.json'
// 导入车位操作表格json 文件
import parkingRecord from '@/assets/means/json/parking-record.json'

export default {
  name: 'CarMove',
  data() {
    return {
      // 接口数据对象
      urlObj: {
        userType: this.$api.state.Means.userType.url,
        carcostlog: this.$api.state.Means.carcostlog.url,
        carecord: this.$api.state.Means.carecord.url
      },
      // 是否显示弹框
      isShow: false,
      // 当前车辆类型
      carType: '',
      // 车牌信息表格数据
      tableData1: [],
      // 表格配置项
      columns1: parkingInfo.list,
      // 表格基本配置
      conf1: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 车牌信息表格数据
      tableData2: [],
      // 表格配置项
      columns2: parkingPayment.list,
      // 表格基本配置
      conf2: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 车牌信息表格数据
      tableData3: [],
      // 表格配置项
      columns3: parkingRecord.list,
      // 表格基本配置
      conf3: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      }
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
    init(obj, type) {
      let subs = obj.subject_arr.map(item => item.name)
      let moneys = obj.subject_arr.map(item => item.money)
      this.columns1 = type == 'car' ? parkingInfo.list : mparkingInfo.list
      this.tableData1 = [
        {
          sort: obj.sort ? obj.sort : '--',
          utype: type == 'car' ? '购买' : '租用',
          suject: subs.length > 0 ? subs.join('/') : '--',
          money: moneys.length > 0 ? moneys.join('/') : '--',
          etime: obj.endtime ? obj.endtime : '--',
          remark: obj.remark ? obj.remark : '--'
        }
      ]
      this.isShow = true
      this.carType = type
      // 获取车辆操作记录
      this.getCarRecord({
        carid: obj.id,
        car_type: type == 'car' ? 'car' : 'carmonth'
      })
      // 获取车辆缴费信息
      let data = {
        id: obj.id,
        type: type == 'car' ? 'car' : 'carmonth'
      }
      this.getCarPayInfo(data)
    },

    // 获取车辆缴费信息
    getCarPayInfo(data) {
      // 表格处于加载状态
      this.conf2.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carcostlog, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.stime_text = item.previewCostRepair.stime_text
                item.etime_text = item.previewCostRepair.etime_text
                item.pay_text = item.paymentType.name
                item.status_text = item.status == 1 ? '已交' : '未交'
              })
            }
            // 存放查询数据
            this.tableData2 = res.Data
            // 关闭加载状态
            this.conf2.loadStatus = false
            // 清空空数据提示
            this.conf2.emptyText = ''
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
            this.tableData2 = []
            this.conf2.emptyText = res.Message
            this.conf2.dataTotal = 0
            this.conf2.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.tableData2 = []
          this.conf2.emptyText = '服务器连接失败...'
          this.conf2.dataTotal = 0
          this.conf2.loadStatus = false
        })
    },

    // 获取车辆操作日志
    getCarRecord(data) {
      // 表格处于加载状态
      this.conf3.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carecord, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.pname = item.plates ? item.plates.join('、') : '--'
                item.oname = item.owner ? item.owner.realname : '--'
                item.otel = item.owner ? item.owner.tel : '--'
                item.oidcard = item.owner ? item.owner.idcard : '--'
                item.cname = item.creater ? item.creater.realname : '--'
              })
            }
            // 存放查询数据
            this.tableData3 = res.Data ? res.Data : []
            // 关闭加载状态
            this.conf3.loadStatus = false
            // 清空空数据提示
            this.conf3.emptyText = ''
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
            this.tableData3 = []
            this.conf3.emptyText = res.Message
            this.conf3.dataTotal = 0
            this.conf3.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.tableData3 = []
          this.conf3.emptyText = '服务器连接失败...'
          this.conf3.dataTotal = 0
          this.conf3.loadStatus = false
        })
    },

    // 点击车位过户按钮
    carTransfer() {
      this.$emit('carTransfer')
    },

    // 关闭弹框
    close() {
      this.isShow = false
    }
  }
}
</script>

<style lang="less">
#operating-record {
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    height: 85%;
    .el-dialog__body {
      height: calc(100% - 68px);
      padding: 20px;
      box-sizing: border-box;
    }
  }
  .transfer-wp {
    width: 100%;
    height: 100%;
    .table-wp {
      width: 100%;
      .title {
        color: #333;
        font-size: 15px;
        font-weight: 700;
        line-height: 24px;
        padding: 20px 0;
      }
      .el-table {
        background-color: #f7f7f7;
        border-radius: 6px;
        overflow: hidden;
        th {
          background-color: #f7f7f7;
          border-color: #f7f7f7;
          padding: 20px 0;
        }
      }
      .el-table::before {
        display: none;
      }
    }
  }
}
</style>
