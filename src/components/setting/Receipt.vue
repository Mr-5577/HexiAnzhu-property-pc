<template>
  <div id="receipt">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <workIcon name="build"></workIcon>
            {{ choseVillageInfo.name }}
          </span>
          <input
            type="text"
            class="common-input"
            placeholder="请输入票据单号查询"
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
      <div class="select-wp">
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择票据状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in statusOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="paymentVal"
          clearable
          placeholder="请选择收款方式"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in paymentOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="userVal"
          clearable
          placeholder="请选择开票人员"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in userOptions"
            :key="itm.uid"
            :label="itm.realname"
            :value="itm.uid"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="tableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @print="receiptPrint"
          @cancel="receiptCancel"
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

<script src="@/assets/setting/js/receipt.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/receipt.less');
</style>
