<template>
  <div id="charge-manage">
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
            placeholder="请输入姓名/房号/车牌号/车位"
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
        <div class="common-right">
          <span
            v-if="$menu.getters.judgeRole('Btn-3iFJEwSDprZnzw93tgxfs06X')"
            @click="getExportData"
          >
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
      <div class="select-wp">
        <el-select
          v-model="subjectVal"
          clearable
          placeholder="请选择欠费科目"
          @change="subjectChange"
        >
          <el-option
            v-for="itm in subOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="buildVal"
          clearable
          placeholder="请选择楼栋"
          @change="buildChange"
          v-if="isRoom == 'rooms'"
        >
          <el-option
            v-for="itm in buildOptions"
            :key="itm.id"
            :label="itm.block"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="unitVal"
          clearable
          placeholder="请选择单元"
          @change="tableLoad"
          v-if="isRoom == 'rooms'"
        >
          <el-option
            v-for="itm in unitOptions"
            :key="itm.id"
            :label="itm.unit"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="paymentVal"
          clearable
          placeholder="请选择缴费方式"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in paymentOptions"
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

<script src="@/assets/charge/js/chargeManage.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/chargeManage.less');
</style>
