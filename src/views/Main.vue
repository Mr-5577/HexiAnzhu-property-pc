<template>
  <div id="home">
    <div class="chart-item" v-loading="isLoading1">
      <h3>实收收缴率统计</h3>
      <div id="captureCont"></div>
    </div>
    <div class="chart-item" v-loading="isLoading2">
      <h3>欠费收缴率统计</h3>
      <div id="captureCont2"></div>
    </div>
    <div class="chart-item" v-loading="isLoading3">
      <h3>应收统计</h3>
      <div id="barCont"></div>
    </div>
    <div class="chart-item" v-loading="isLoading4">
      <h3>欠费统计</h3>
      <div id="barCont2"></div>
    </div>
  </div>
</template>

<script src="@/assets/main/js/index.js"></script>

<style lang="less">
@import url('~@/assets/main/css/index.less');
</style>
