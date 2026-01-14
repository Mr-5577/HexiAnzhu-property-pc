<template>
  <div id="device-category">
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
            v-model="statusVal"
            clearable
            placeholder="请选择默认状态"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in statusOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <input
            type="text"
            class="common-input"
            placeholder="请输入应用名称"
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
          @edit="appEdit"
          @imgPreview="imgPreview"
        ></cus-table>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/deviceManage/js/deviceCategory.js"></script>

<style lang="less">
@import url('~@/assets/deviceManage/css/deviceCategory.less');
</style>
