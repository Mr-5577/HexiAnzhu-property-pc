<template>
  <div class="public" id="arrearage-reason">
    <!-- 条件筛选部分 -->
    <Preselect
      v-show="showFilter"
      preType="arrearsanalysisstatistics"
      @verifySuccess="verifySuccess"
    ></Preselect>

    <!-- 报表组件部分 -->
    <Tables
      v-if="!showFilter"
      tableType="arrearsanalysisstatistics"
      :filter="filterObj"
      :conditions="filterText"
      :tableList="tableList"
      @queryAgain="showFilter = true"
    ></Tables>
  </div>
</template>

<script src="@/assets/report/js/arrearageReason.js"></script>

<style lang="less">
@import url('~@/assets/report/css/public.less');
</style>
