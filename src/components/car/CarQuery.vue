<template>
  <div id="car-query">
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
          <input
            type="text"
            class="common-input"
            placeholder="输入停车场名称/编号查询"
            v-model="searchVal"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch(true)"
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
          @issue="issueAgain"
          @paymentRecords="paymentRecords"
          @postRecords="postRecords"
        ></cus-table>
      </div>
      <div class="notice">
        注意：周期为1970-01-01表示平台上无此车辆
      </div>
    </div>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 缴费记录弹框部分 -->
    <el-dialog
      class="payDialog"
      :visible.sync="showPayDialog"
      :title="carName + '缴费记录'"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="payTableData"
          :cusColums="payColumns"
          :cusConf="payConf"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 过车记录弹框部分 -->
    <el-dialog
      class="postDialog"
      :visible.sync="showPostDialog"
      :title="carName + '过车记录'"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="postTableData"
          :cusColums="postColumns"
          :cusConf="postConf"
          :ispaging="true"
          @sizeChange="postSizeChange"
          @currentChange="postCurrentChange"
        ></cus-table>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/assets/car/js/carQuery.js"></script>

<style lang="less">
@import url('~@/assets/car/css/carQuery.less');
</style>
