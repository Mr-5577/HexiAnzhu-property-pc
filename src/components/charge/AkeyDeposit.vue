<template>
  <div id="akey-deposit">
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
            placeholder="请输入关键字查询"
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
          v-model="subjectVal"
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
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择预存款状态"
          @change="tableLoad"
        >
          <el-option label="预存款充足" :value="1"></el-option>
          <el-option label="预存款不足" :value="2"></el-option>
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
          :ispaging="ispaging"
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @selectionChange="selectionChange"
        ></cus-table>
        <el-button
          v-if="$menu.getters.judgeRole('Btn-PZliaaUDuDq7fJSQuh7c6HGK')"
          :disabled="tableSelected.length === 0"
          :loading="isCommit"
          type="primary"
          round
          @click="remitAccount"
        >
          一键划账
        </el-button>
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

<script src="@/assets/charge/js/akeyDeposit.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/akeyDeposit.less');
</style>
