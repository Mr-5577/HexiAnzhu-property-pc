<template>
  <div id="alone">
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
            placeholder="请输入业主姓名、电话、房号"
            v-model="searchVal"
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
        <div class="common-right">
          <el-button
            type="primary"
            plain
            round
            icon="iconfont iconzu3638"
            @click="viewLog"
          >
            变更日志
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="typeVal"
          placeholder="请选择资源类型"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in typeOptions"
            :key="itm.model_type"
            :label="itm.text"
            :value="itm.model_type"
          ></el-option>
        </el-select>
        <el-select
          class="sub"
          v-model="subVal"
          clearable
          multiple
          collapse-tags
          filterable
          placeholder="选择科目搜索"
          @change="subChange"
        >
          <el-option
            v-for="itm in subOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @edit="tableEdit"
          @selectionChange="selectionChange"
        ></cus-table>
        <el-button
          v-if="this.$menu.getters.judgeRole('Btn-zAMDbYPFhCdNfK3qs1jeLTrQ')"
          class="empty"
          type="primary"
          :disabled="tableSelected.length == 0"
          round
          @click="batchSetting"
        >
          批量设置({{ tableSelected.length }})
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

    <!-- 设置计费标准弹框 -->
    <el-dialog
      class="chargeDialog"
      :visible.sync="showChargeDialog"
      :title="isBatch ? '计费标准批量设置' : '计费标准设置'"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="editForm"
          :rules="rules"
          :hide-required-asterisk="true"
          ref="editForm"
        >
          <el-form-item label="计费科目" prop="subValue">
            <el-input
              v-model="editForm.subValue"
              readonly
              placeholder="请输入计费科目"
            ></el-input>
          </el-form-item>

          <el-form-item label="基本单价(元)" prop="priceValue">
            <el-input
              v-model="editForm.priceValue"
              type="number"
              placeholder="请输入计费科目"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="editSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showChargeDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 变更日志弹框部分 -->
    <el-dialog
      class="logDialog"
      :visible.sync="showLogDialog"
      title="变更日志"
      width="50%"
      :close-on-click-modal="true"
    >
      <div class="table-wp">
        <cus-table
          :datas="logTableData"
          :cusColums="logColumns"
          :cusConf="logConf"
          :ispaging="true"
          @sizeChange="logSizeChange"
          @currentChange="logCurrentChange"
        ></cus-table>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/assets/setting/js/alone.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/alone.less');
</style>
