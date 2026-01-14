<template>
  <div class="public" id="budget">
    <!-- 条件筛选部分 -->
    <Preselect
      v-show="showFilter"
      preType="budgetstatistics"
      @verifySuccess="verifySuccess"
    ></Preselect>

    <!-- 报表组件部分 -->
    <Tables
      v-if="!showFilter"
      tableType="budgetstatistics"
      :filter="filterObj"
      :conditions="filterText"
      :tableList="tableList"
      @queryAgain="showFilter = true"
    ></Tables>
  </div>
</template>

<script src="@/assets/report/js/budget.js"></script>

<style lang="less">
@import url('~@/assets/report/css/public.less');
</style>
