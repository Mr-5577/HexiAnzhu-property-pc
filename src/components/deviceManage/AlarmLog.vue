<template>
  <div id="facility-manage">
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

           <el-date-picker
             v-model="s_time"
             type="date"
             placeholder="选择日期"
             value-format="timestamp"
             class="common-input"
           ></el-date-picker>

          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch"
          >
            查询
          </el-button>
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

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/deviceManage/js/alarmLog.js"></script>

<style lang="less">
@import url('~@/assets/deviceManage/css/alarmLog.less');
</style>
