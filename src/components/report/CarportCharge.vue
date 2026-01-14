<template>
  <div class="public" id="carportCharge">
    <!-- 条件筛选部分 -->
    <Preselect
      v-show="showFilter"
      preType="carrecordstatistics"
      @verifySuccess="verifySuccess"
    ></Preselect>

    <!-- 报表组件部分 -->
    <Tables
      v-if="!showFilter"
      tableType="carrecordstatistics"
      :filter="filterObj"
      :conditions="filterText"
      :tableList="tableList"
      @queryAgain="showFilter = true"
    ></Tables>
  </div>
</template>

<script src="@/assets/report/js/carportCharge.js"></script>

<style lang="less">
@import url('~@/assets/report/css/public.less');
</style>
