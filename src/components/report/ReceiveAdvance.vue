<template>
  <div class="public" id="receive-advance">
    <!-- 条件筛选部分 -->
    <Preselect
      v-show="showFilter"
      preType="advancecollectstatistics"
      @verifySuccess="verifySuccess"
    ></Preselect>

    <!-- 报表组件部分 -->
    <Tables
      v-if="!showFilter"
      tableType="advancecollectstatistics"
      :filter="filterObj"
      :conditions="filterText"
      :tableList="tableList"
      @queryAgain="showFilter = true"
    ></Tables>
  </div>
</template>

<script src="@/assets/report/js/receiveAdvance.js"></script>

<style lang="less">
@import url('~@/assets/report/css/public.less');
</style>
