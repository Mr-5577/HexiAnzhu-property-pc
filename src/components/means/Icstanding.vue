<template>
  <div id="ic-standing">
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
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-D1B0D93857FE0020971B9991')"
            type="warning"
            plain
            class="common-button"
            icon="iconfont iconxinzeng"
            @click="addCard"
          >
            新增领卡
          </el-button>
          <el-button
            v-if="$menu.getters.judgeRole('Btn-D1B0D93857FE0020971B9992')"
            type="primary"
            plain
            class="common-button"
            icon="iconfont iconzu3638"
            @click="cardRecord"
          >
            领卡记录
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
        ></cus-table>
        <div class="number-wp">
          <div class="num-item">
            <span class="name">领回合计：</span>
            <span class="value">{{ total1 }}</span>
          </div>
          <div class="num-item">
            <span class="name">销售合计：</span>
            <span class="value">{{ total2 }}</span>
          </div>
          <div class="num-item">
            <span class="name">剩余张数：</span>
            <span class="value yellow">{{ total3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增领卡 弹框 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      title="新增领卡"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="领用人员" prop="user">
            <el-input
              readonly
              v-model="ruleForm.user"
              placeholder="请输入领用人员"
            ></el-input>
          </el-form-item>
          <el-form-item label="领用时间" prop="time">
            <el-date-picker
              v-model="ruleForm.time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择领用时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="领用数量" prop="number">
            <el-input
              type="number"
              v-model="ruleForm.number"
              placeholder="请输入领用数量"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          确认领卡
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showAddDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 领卡记录弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="领卡记录"
      width="60%"
      :close-on-click-modal="false"
    >
      <cus-table
        :datas="recordTableData"
        :cusColums="recordColumns"
        :cusConf="recordConf"
        :ispaging="false"
      ></cus-table>
    </el-dialog>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/means/js/icstanding.js"></script>

<style lang="less">
@import url('~@/assets/means/css/icstanding.less');
</style>
