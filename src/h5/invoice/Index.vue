<template>
  <div class="invoice-index">
    下载发票
  </div>
</template>

<script>
export default {
  name: 'invoiceIndex',
  data() {
    return {
      // 接口数据对象
      urlObj: {
        download: '/charge/getinvoiceinfo'
      }
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    let title = document.getElementsByTagName('title')
    title[0].innerText = '下载发票'
    this.getInvoiceData()
  },

  /**
   * 方法
   */
  methods: {
    // 获取收据数据
    getInvoiceData() {
      this.$axios.post(this.urlObj.download, { id: 100 }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
