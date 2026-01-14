<template>
  <div id="buy-ticket">
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
            v-model="subjectVal"
            placeholder="请选择缴费科目"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in subOptions"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
          <el-select class="typeSelect" v-model="typeVal" @change="typeChange">
            <el-option
              v-for="itm in typeOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
 
          <el-date-picker
            v-if="typeVal == '1'"
            v-model="ymonth"
            type="month"
            placeholder="欠费截止时间"
            value-format="yyyyMM"
            @change="tableChange"
            style="margin-right: 20px;"
          ></el-date-picker>

          <input
            type="text"
            class="common-input"
            placeholder="请输入业主姓名/房号查询"
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
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="buildVal"
          multiple
          collapse-tags
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
        <el-select
          v-model="unitVal"
          multiple
          collapse-tags
          clearable
          placeholder="请选择单元"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in unitOptions"
            :key="itm.id"
            :label="itm.block + '-' + itm.unit"
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
          @print="tablePrint"
          @selectionChange="selectionChange"
        ></cus-table>
        <div class="btn-wp">
          <el-button
            v-if="
              typeVal == 1 &&
                $menu.getters.judgeRole('Btn-8T8pvt8682KusCWzwDjwGKke')
            "
            :disabled="tableSelected.length === 0"
            class="empty"
            type="primary"
            round
            @click="batchPrint"
          >
            打印票据已选({{ tableSelected.length }})本
          </el-button>
          <el-button
            v-if="
              typeVal != 1 &&
                $menu.getters.judgeRole('Btn-rqdb4JUalfbEi3TwmPn675NN')
            "
            :disabled="tableSelected.length === 0"
            class="empty"
            type="primary"
            round
            @click="batchPrint"
          >
            确认收款已选({{ tableSelected.length }})本
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

    <!-- 确认收款弹框 -->
    <el-dialog
      class="gatheringDialog"
      :visible.sync="showGatheringDialog"
      title="确认收款"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="title">选择支付方式</div>
        <div class="payments">
          <el-radio-group v-model="radioVal">
            <el-radio
              :label="item.id"
              v-for="item in paymentList"
              :key="item.id"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </div>
        <div class="title">选择支付时间</div>
        <el-date-picker
          v-model="dateVal"
          type="datetime"
          value-format="timestamp"
          placeholder="请选择支付时间"
        ></el-date-picker>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showGatheringDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/assist/js/buyTicket.js"></script>

<style lang="less">
@import url('~@/assets/assist/css/buyTicket.less');
</style>
