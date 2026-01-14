<!-- 楼栋管家统计表 -->

<template>
  <div class="public" id="discount-freestat">
    <!-- 条件筛选部分 -->
    <Preselect v-show="showFilter" preType="housekeepercostcountstatistics" @verifySuccess="verifySuccess"></Preselect>

    <!-- 报表组件部分 -->
    <Tables v-if="!showFilter" tableType="housekeepercostcountstatistics" :filter="filterObj" :conditions="filterText"
      :tableList="tableList" @queryAgain="showFilter = true"></Tables>
  </div>
</template>

<script src="@/assets/report/js/housekeepercostcountstatistics.js"></script>

<style lang="less">
  @import url('~@/assets/report/css/public.less');
</style>