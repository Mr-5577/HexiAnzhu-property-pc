<template>
  <div id="prestore">
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
            placeholder="请输入业主姓名/手机号或房号"
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
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @checkRecord="checkRecord"
          @balanceMove="balanceMove"
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

    <!-- 预存款弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="预存款记录"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="popTableData"
          :cusColums="popColumns"
          :cusConf="popConf"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 零钱转移弹框部分 -->
    <el-dialog
      class="moveDialog"
      :visible.sync="showMoveDialog"
      title="零钱转移"
      width="36%"
      :close-on-click-modal="false"
    >
      <!-- 搜索部分 -->
      <el-autocomplete
        ref="searchInput"
        class="prestore-search"
        popper-class="my-autocomplete"
        v-model="autoValue"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入业主姓名、手机号或房号"
        @select="handleSelect"
      >
        <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div class="tr-item">
            <span class="td-item">{{ item.username }}</span>
            <span class="td-item">{{ item.tel }}</span>
            <span class="td-item">{{ item.title }}</span>
          </div>
          <div class="load-more" v-if="allUserList.length <= 1">
            暂无数据！
          </div>
        </template>
      </el-autocomplete>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="项目名称" prop="vname">
          <el-input
            v-model="ruleForm.vname"
            placeholder="请输入项目名称"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="选择楼栋" prop="build">
          <el-select
            v-model="ruleForm.build"
            clearable
            placeholder="请选择楼栋"
            @change="buildChange"
          >
            <el-option
              v-for="itm in buildOptions"
              :key="itm.id"
              :label="itm.block"
              :value="itm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择单元" prop="unit">
          <el-select
            v-model="ruleForm.unit"
            clearable
            placeholder="请选择单元"
            @change="unitChange"
          >
            <el-option
              v-for="itm in unitOptions"
              :key="itm.id"
              :label="itm.unit"
              :value="itm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择房号" prop="room">
          <el-select
            v-model="ruleForm.room"
            clearable
            placeholder="请选择房号"
            @change="roomChange"
          >
            <el-option
              v-for="itm in roomOptions"
              :key="itm.id"
              :label="itm.roomnum"
              :value="itm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择客户" prop="uid">
          <el-select v-model="ruleForm.uid" clearable placeholder="请选择客户">
            <el-option
              v-for="itm in userOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转移金额" prop="money">
          <span class="tip">(余额: {{ bmoney }})</span>
          <el-input
            type="number"
            v-model="ruleForm.money"
            placeholder="请输入转移金额"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="moveSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showMoveDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/charge/js/prestore.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/prestore.less');
</style>
