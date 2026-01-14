<template>
  <div id="charge-order">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="filterVillage({ name: '全部项目', vid: '' })"
            ></i>
          </span>
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
      <div class="select-wp">
        <el-select
          v-model="typeVal"
          clearable
          placeholder="请选择支付类型"
          @change="tableLoad"
        >
          <el-option label="月卡支付" :value="5"></el-option>
          <el-option label="微信支付" :value="6"></el-option>
          <el-option label="支付宝支付" :value="7"></el-option>
          <el-option label="翼支付支付" :value="16"></el-option>
        </el-select>
        <el-date-picker
          v-model="startTime"
          type="date"
          :picker-options="spickerOptions"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          @change="tableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="epickerOptions"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="tableLoad"
        ></el-date-picker>

        <el-button
          :loading="isExport"
          type="primary empty"
          round
          @click="exportDetailExcel"
        >
          导出Excel
        </el-button>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">{{ totalMoney }}元</span>
        </div>
        <div class="total2">
          实际费用：
          <span class="money">{{ discountMoney }}元</span>
        </div>
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

<script src="@/assets/parkManage/js/chargeOrder.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/chargeOrder.less');
</style>
