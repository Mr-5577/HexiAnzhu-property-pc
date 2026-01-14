<template>
  <div
    id="car-record"
    v-loading="isExport"
    element-loading-text="正在导出，请稍等"
  >
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="
                choseVillageInfo = {
                  name: '全部项目',
                  vid: 0
                }
                keySearch()
              "
            ></i>
          </span>
          <el-select
            class="parkSelect"
            v-model="parkVal"
            clearable
            placeholder="请选择车场类型"
            @change="keySearch(true)"
          >
            <el-option
              v-for="itm in parkOptions"
              :key="itm.id"
              :label="itm.village_name"
              :value="itm.id"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="startTime"
            type="date"
            :picker-options="spickerOptions"
            placeholder="缴费开始日期"
            value-format="timestamp"
            @change="keySearch(true)"
          ></el-date-picker>
          ~
          <el-date-picker
            v-model="endTime"
            type="date"
            :picker-options="epickerOptions"
            placeholder="缴费结束日期"
            value-format="timestamp"
            @change="keySearch(true)"
          ></el-date-picker>
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-fzZFTdJ0yYeRtQ5uyN9V825g')"
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="dialogInit()"
          >
            生成临停费用
          </el-button>
          <span @click="getExportData">
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

    <!-- 生成临停费用弹框部分 -->
    <el-dialog
      class="temporary"
      :visible.sync="showDialog"
      title="生成临停费用"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="停车场" prop="parkValue">
            <el-select
              v-model="ruleForm.parkValue"
              placeholder="请选择停车场"
              @change="parkChange"
            >
              <el-option
                v-for="item in parkOptions"
                :key="item.id"
                :label="item.village_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="date-wp" label="临停周期" required>
            <el-col :span="11">
              <el-form-item prop="startDate">
                <el-date-picker
                  type="datetime"
                  :readonly="hasLast"
                  placeholder="选择入场时间"
                  :picker-options="pickerOptions"
                  v-model="ruleForm.startDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                  @change="startChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate">
                <el-date-picker
                  type="datetime"
                  placeholder="选择截止时间"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="ruleForm.endDate"
                  style="width: 100%;"
                  @change="endChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="临停总金额" prop="allMoney" v-show="showMoney">
            <el-input
              v-model="ruleForm.allMoney"
              :readonly="true"
              placeholder="请输入临停总金额"
            ></el-input>
          </el-form-item>
          <el-form-item label="临停优惠金额" prop="yhmoney" v-show="showMoney">
            <el-input
              v-model="ruleForm.yhmoney"
              :readonly="true"
              placeholder="请输入临停优惠金额"
            ></el-input>
          </el-form-item>
          <el-form-item label="临停实收金额" prop="ssmoney" v-show="showMoney">
            <el-input
              v-model="ruleForm.ssmoney"
              type="number"
              :readonly="!moneyEdit"
              placeholder="请输入临停实收金额"
              @input="moneyChange"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="是否生成发票"
            prop="isreceipt"
            v-show="showMoney"
          >
            <el-select
              v-model="ruleForm.isreceipt"
              placeholder="请选择是否生成发票"
            >
              <el-option
                v-for="item in receiptOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收据类型"
            prop="receiptType"
            v-if="receiptType == 3 && showMoney"
          >
            <el-select
              v-model="ruleForm.receiptType"
              placeholder="请选择收据类型"
              clearable
            >
              <el-option label="电子收据" :value="1"></el-option>
              <el-option label="纸质收据" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否生成纸质收据"
            prop="isPaper"
            v-if="
              (receiptType == 2 ||
                (receiptType == 3 && ruleForm.receiptType == 2)) &&
                showMoney
            "
          >
            <el-select
              v-model="ruleForm.isPaper"
              placeholder="请选择是否生成纸质收据"
              clearable
            >
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          确认生成
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/car/js/carRecord.js"></script>

<style lang="less">
@import url('~@/assets/car/css/carRecord.less');
</style>
