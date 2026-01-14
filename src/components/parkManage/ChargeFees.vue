<template>
  <div id="charge-fees">
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
          <input
            type="text"
            class="common-input"
            placeholder="输入订单金额查询"
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
        <el-select v-model="statusVal" clearable placeholder="请选择订单状态">
          <el-option
            v-for="itm in statusOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="startTime"
          type="date"
          :picker-options="spickerOptions"
          placeholder="请选择开始日期"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="epickerOptions"
          placeholder="请选择截止日期"
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
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">2546555.03元</span>
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

<script src="@/assets/parkManage/js/chargeFees.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/chargeFees.less');
</style>
