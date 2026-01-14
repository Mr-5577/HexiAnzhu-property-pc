<template>
  <div id="bill-pay">
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
            placeholder="请输入票据单号"
            v-model="searchVal"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="tableLoad"
          >
            查询
          </el-button>
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-BEvf6KBNl34enXRkLe4JGYyw')"
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="viewRecord"
          >
            缴销记录
          </el-button>
          <span @click="exportExcel">
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
          v-model="statusVal"
          clearable
          placeholder="请选择状态"
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
          v-model="faceVal"
          clearable
          placeholder="请选择面值"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in faceOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateValue"
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
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @selectionChange="selectionChange"
          @bfcancellation="bfcancellation"
          @detail="showDetail"
          @cancellation="cancellation"
        ></cus-table>
        <div class="btn-wp">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-nYTlsoB4VJibZJmDODzqWg6V')"
            :disabled="tableSelected.length === 0"
            class="empty"
            type="primary"
            round
            @click="batchCancellation()"
          >
            {{ `缴销已选(${tableSelected.length})本` }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 部分缴销弹框 -->
    <el-dialog
      class="bfjxDialog"
      :visible.sync="showBfjxDialog"
      title="部分缴销"
      width="28%"
      :close-on-click-modal="false"
    >
      <div class="title">缴销单号</div>
      <el-input
        v-model="cancellationOdd"
        placeholder="请输入已使用的单号"
      ></el-input>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="bfjxConfirm"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showBfjxDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 缴销明细弹框 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      title="缴销明细"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="popTableData"
          :cusColums="popColumns"
          :cusConf="popConf"
          :ispaging="true"
          @sizeChange="popSizeChange"
          @currentChange="popCurrentChange"
          @revocation="revocation"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 缴销记录弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="缴销记录"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="date-filter">
        <el-date-picker
          v-model="dateFilter"
          :clearable="false"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button
          type="primary"
          class="common-button"
          icon="el-icon-search"
          @click="searchTable"
        >
          查询
        </el-button>
        <el-button
          v-if="showSearchTable"
          type="primary"
          class="common-button"
          @click="addRecord"
        >
          提交
        </el-button>
      </div>
      <div class="table-wp">
        <cus-table
          v-if="showSearchTable"
          :datas="searchTableData"
          :cusColums="searchColumns"
          :cusConf="searchConf"
        ></cus-table>
        <cus-table
          v-else
          :datas="recordTableData"
          :cusColums="recordColumns"
          :cusConf="recordConf"
          :ispaging="true"
          @sizeChange="recordSizeChange"
          @currentChange="recordCurrentChange"
          @detail="recordInfo"
          @revocation="recordDevocation"
          @print="recordPrint"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 缴销记录明细弹框 -->
    <el-dialog
      class="infoDialog"
      :visible.sync="showInfoDialog"
      title="记录明细"
      width="55%"
      :close-on-click-modal="true"
    >
      <el-scrollbar style="height: 100%;">
        <div class="table-wp">
          <cus-table
            :datas="rcdInfoData"
            :cusColums="rcdInfoColumns"
            :cusConf="rcdInfoConf"
          ></cus-table>
        </div>
        <div class="total">
          费用合计：
          <span class="money">{{ totalMoney }}元</span>
          <span class="num">
            共
            <span style="color: #3ebb75;">{{ rcdInfoData.length }}</span>
            条记录
          </span>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script src="@/assets/charge/js/billPay.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/billPay.less');
</style>
