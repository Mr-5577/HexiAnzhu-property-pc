<template>
  <div id="visit-query">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <!-- <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <workIcon name="build"></workIcon>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="
                choseVillageInfo = {
                  name: '全部项目',
                  vid: '',
                }
                keySearch()
              "
            ></i>
          </span> -->
          <input
            type="text"
            class="common-input"
            placeholder="请输入姓名"
            v-model="visitorName"
            style="margin-left: 0"
          />
          <input
            type="text"
            class="common-input"
            placeholder="请输入电话"
            v-model="visitorTel"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch()"
          >
            查询
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="visitorType"
          clearable
          placeholder="请选择来访类型"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in typeOptions"
            :key="itm.id"
            :label="itm.typename"
            :value="itm.id"
          ></el-option>
        </el-select>

        <el-date-picker
          v-model="startTime"
          type="datetime"
          :picker-options="spickerOptions"
          placeholder="请选择开始日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="tableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="datetime"
          :picker-options="epickerOptions"
          placeholder="请选择截止日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="tableLoad"
        ></el-date-picker>

        <el-button type="primary empty" round @click="exportDetailExcel">
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

    <!-- 图片预览部分 -->
    <el-image
      ref="preview"
      :src="imgSrc"
      :preview-src-list="imgList"
      :z-index="10000"
    ></el-image>
  </div>
</template>

<script src="@/assets/custom/js/visitQuery.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/visitQuery.less');
</style>
