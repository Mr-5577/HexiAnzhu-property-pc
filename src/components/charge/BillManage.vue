<template>
  <div id="bill-manage">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
          </span>

          <el-select
            v-model="subjectVal"
            multiple
            collapse-tags
            clearable
            placeholder="请选择科目"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in subOptions"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            align="center"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="tableLoad"
          ></el-date-picker>
        </div>
        <div class="common-right">
          <span class="ico-wp" @click="exportExcel">
            <workIcon
              name="export"
              class="common-right-icon"
              title="导出"
            ></workIcon>
          </span>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></cus-table>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
    <!-- 选择项目 -->
  </div>
</template>

<script src="@/assets/charge/js/billManage.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/billManage.less');
</style>
