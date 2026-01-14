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
          <el-cascader
            v-model="deviceType"
            :props="{
              value: 'id',
              label: 'name',
              checkStrictly: true,
              lazy: true,
              lazyLoad
            }"
            clearable
            @change="tableLoad"
            placeholder="请选择设备类型"
          ></el-cascader>
          <input
            type="text"
            class="common-input"
            placeholder="输入设备名称、设备编号查询"
            v-model="searchVal"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch"
          >
            查询
          </el-button>
          <el-button
            type="primary"
            class="common-button"
            @click="showAddDeviceDialog = true"
          >
            新增设备
          </el-button>
        </div>
        <div class="common-right">
          <span @click="$refs.cusTable.exportExcel()">
            <workIcon
              name="export"
              class="common-right-icon"
              title="导出"
            ></workIcon>
          </span>
          <!-- @click="printHandle" -->
          <span
            class="last-ico"

            v-print="{ id: '#tablePrint', popTitle: '合同列表' }"
          >
            <workIcon
              name="print"
              class="common-right-icon"
              title="打印"
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

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <el-dialog class="importDialog"
      :visible.sync="showAddDeviceDialog"
      title="新增设备"
      width="36%"
      :close-on-click-modal="false"
      @close="showAddDeviceDialog = false">
      
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="项目选择" prop="village">
          <el-select
            class="village"
            v-model="ruleForm.village"
            multiple
            collapse-tags
            popper-class="customSelect"
            placeholder="默认全部"
            :popper-append-to-body="true"
          ></el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="addDeviceSubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showAddDeviceDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/deviceManage/js/facilityManage.js"></script>

<style lang="less">
@import url('~@/assets/deviceManage/css/facilityManage.less');
</style>
