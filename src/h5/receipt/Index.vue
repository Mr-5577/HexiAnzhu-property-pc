<template>
  <div class="receipt-index">
    <div class="empty" v-if="!receiptObj">暂无数据！</div>
    <div v-else>
      <div class="title">
        收据信息
        <span>{{ receiptObj.receipt_num }}</span>
      </div>
      <div class="content">
        <div class="info">
          <div class="name">小区名称</div>
          <div class="value">{{ receiptObj.villagename }}</div>
        </div>
        <div class="info">
          <div class="name">房号</div>
          <div class="value">
            {{ receiptObj.roomnum }}
          </div>
        </div>
        <div class="info">
          <div class="name">业主</div>
          <div class="value">{{ receiptObj.owner_name }}</div>
        </div>
        <div class="info">
          <div class="name">日期</div>
          <div class="value">{{ receiptObj.date }}</div>
        </div>
      </div>
      <div
        class="content"
        v-for="(item, index) in receiptObj.subject_detail"
        :key="index"
      >
        <div class="info">
          <div class="name project">{{ item.project }}</div>
          <div class="value money">{{ item.mainmoney }}</div>
        </div>
        <div class="desc">{{ item.zy }}</div>
      </div>
      <div class="content">
        <div class="info">
          <div class="name">渠道</div>
          <div class="value">{{ receiptObj.pay_type }}</div>
        </div>
        <div class="info">
          <div class="name">收款人</div>
          <div class="value">{{ receiptObj.creater }}</div>
        </div>
        <div class="info">
          <div class="name">交款人</div>
          <div class="value">{{ receiptObj.owner_name }}</div>
        </div>
        <div class="info">
          <div class="name">收款单位</div>
          <div class="value">
            {{ receiptObj.payee }}
          </div>
        </div>
      </div>

      <div class="total">
        合计
        <span>￥{{ receiptObj.money }}</span>
      </div>
      <div class="total">
        人民币(大写)
        <span>{{ receiptObj.capitalization_money }}</span>
      </div>

      <div class="btn-wp">
        <button v-if="receiptObj.has_invoice" @click="downloadInvoice">
          下载发票
        </button>
        <button v-else @click="supInvoice">补开发票</button>
      </div>
    </div>
    <div class="dialog" v-show="showMsg">{{ msg }}</div>
    <a ref="adom" :href="fpurl" target="_blank" v-show="false"></a>
  </div>
</template>

<script>
export default {
  name: 'receiptIndex',
  data() {
    return {
      // 接口数据对象
      urlObj: {
        receipt: '/charge/electronicreceiptqrcodeinfo',
        download: '/charge/downloadinvoicebyqrcode',
        repair: '/charge/repairinvoice'
      },
      // 当前收据 id
      rid: '',
      // 收据信息
      receiptObj: null,
      // 消息
      msg: '',
      // 是否显示提示信息
      showMsg: false,
      // 发票下载地址
      fpurl: ''
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    this.rid = location.search.split('=')[1]
    let title = document.getElementsByTagName('title')
    title[0].innerText = '收据信息'
    this.getReceiptData(this.rid)
  },

  /**
   * 方法
   */
  methods: {
    // 获取收据数据
    getReceiptData(id) {
      let data = {
        id: id
      }
      this.$axios
        .post(this.urlObj.receipt, data)
        .then(res => {
          if (res.Code === 200) {
            this.receiptObj = res.Data ? res.Data : null
          } else {
            this.msg = res.Message ? res.Message : '获取收据数据失败！'
            this.showMsg = true
            setTimeout(() => {
              this.showMsg = false
            }, 1500)
          }
        })
        .catch(() => {
          this.msg = '获取收据数据失败！'
          this.showMsg = true
          setTimeout(() => {
            this.showMsg = false
          }, 1500)
        })
    },

    // 下载发票
    downloadInvoice() {
      let data = {
        id: this.rid
      }
      this.$axios
        .post(this.urlObj.download, data)
        .then(res => {
          if (res.Code === 200) {
            this.fpurl = res.Data.pdf_url
            this.$nextTick(() => {
              this.$refs.adom.click()
            })
          } else {
            this.msg = res.Message ? res.Message : '发票下载失败！'
            this.showMsg = true
            setTimeout(() => {
              this.showMsg = false
            }, 1500)
          }
        })
        .catch(() => {
          this.msg = '发票下载失败！'
          this.showMsg = true
          setTimeout(() => {
            this.showMsg = false
          }, 1500)
        })
    },

    // 补开发票
    supInvoice() {
      let data = {
        id: this.rid
      }
      this.$axios
        .post(this.urlObj.repair, data)
        .then(res => {
          if (res.Code === 200) {
            this.msg = '补开发票成功！'
            this.showMsg = true
            setTimeout(() => {
              this.showMsg = false
            }, 1500)
            this.getReceiptData(this.rid)
          } else {
            this.msg = res.Message ? res.Message : '补开发票失败！'
            this.showMsg = true
            setTimeout(() => {
              this.showMsg = false
            }, 1500)
          }
        })
        .catch(() => {
          this.msg = '补开发票失败！'
          this.showMsg = true
          setTimeout(() => {
            this.showMsg = false
          }, 1500)
        })
    }
  }
}
</script>

<style lang="less">
body {
  margin: 0;
}
.receipt-index {
  padding: 30px 12px;
  .empty {
    text-align: center;
    color: #ccc;
    line-height: 20px;
    font-size: 14px;
  }
  .title {
    color: #333;
    font-weight: 700;
    font-size: 16px;
    > span {
      float: right;
    }
  }
  .content {
    margin-top: 15px;
    padding: 15px;
    background-color: #f9f9fa;
    border-radius: 6px;
    .info {
      display: flex;
      margin-top: 15px;
      line-height: 20px;
      .name {
        width: 80px;
        color: #999;
        font-size: 15px;
      }
      .name.project {
        color: #333;
        flex: 1;
      }
      .value {
        flex: 1;
        text-align: right;
        color: #333;
        font-size: 15px;
      }
      .value.money {
        width: 100px;
        color: rgb(255, 194, 26);
      }
    }
    .info:first-child {
      margin-top: 0;
    }
    .desc {
      color: #999;
      line-height: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .total {
    margin-top: 15px;
    font-size: 15px;
    color: #999;
    line-height: 22px;
    > span {
      margin-left: 15px;
      color: #333;
    }
  }
  .total:last-child {
    margin-top: 10px;
  }
  .btn-wp {
    margin-top: 50px;
    button {
      width: 100%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background-color: #ffcf5a;
      color: #fff;
      border-radius: 6px;
      outline: none;
      border: none;
      font-size: 14px;
    }
    button:hover,
    button:focus {
      opacity: 0.6;
    }
  }
  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #4c4c4c;
    border-radius: 8px;
    padding: 10px;
    color: #fff;
    font-size: 14px;
  }
}
</style>
