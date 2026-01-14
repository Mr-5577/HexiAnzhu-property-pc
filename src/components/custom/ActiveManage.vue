<template>
  <div id="active-manage">
    <div class="top">
      <div class="main">
        <div class="common-left">
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
            @click="keySearch(true)"
          >
            查询
          </el-button>
        </div>
        <div class="common-right">
          <el-button
            type="primary"
            round
            plain
            icon="el-icon-search"
            @click="dialogInit('entering')"
          >
            录入发票
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select v-model="statusVal" clearable placeholder="请选择发票状态">
          <el-option
            v-for="itm in statusOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-select v-model="faceVal" clearable placeholder="请选择发票面值">
          <el-option
            v-for="itm in faceOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @send="invoiceSend"
        ></cus-table>
        <div class="btn-wp">
          <el-button type="primary" round @click="dialogInit('custom')">
            自定义发放
          </el-button>
          <el-button
            class="empty"
            type="primary"
            round
            @click="dialogInit('grant')"
          >
            发放已选(20)本
          </el-button>
        </div>
      </div>
    </div>

    <!-- 弹框部分 -->
    <el-dialog
      :class="[
        type == 'entering' ? 'entering' : type == 'custom' ? 'custom' : ''
      ]"
      :visible.sync="showDialog"
      :title="dialogTitle"
      width="36%"
      :close-on-click-modal="false"
    >
      <!-- 录入发票部分 -->
      <div class="entering-wp" v-if="type == 'entering'">
        <div class="input-wp">
          <div class="input-item">
            <div class="name">发票代码</div>
            <el-input
              v-model="dialogData.invoiceCode"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">发票面值</div>
            <el-select
              v-model="dialogData.faceValue"
              clearable
              placeholder="请选择发票面值"
            >
              <el-option
                v-for="itm in dialogData.faceOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-item">
            <div class="name">首张单号</div>
            <el-input
              v-model="dialogData.firstBill"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">末张单号</div>
            <el-input
              v-model="dialogData.lastBill"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">本数</div>
            <el-input
              v-model="dialogData.sheetNum"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">发放大区</div>
            <el-select
              v-model="dialogData.area"
              clearable
              placeholder="请选择发放大区"
            >
              <el-option
                v-for="itm in dialogData.areaOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <!-- 自定义发放 -->
      <div class="grant-custom" v-else-if="type == 'custom'">
        <div class="input-wp">
          <div class="input-item">
            <div class="name">发票代码</div>
            <el-input
              v-model="dialogData.invoiceCode"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">发票面值</div>
            <el-select
              v-model="dialogData.faceValue"
              clearable
              placeholder="请选择发票面值"
            >
              <el-option
                v-for="itm in dialogData.faceOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-item">
            <div class="name">首张单号</div>
            <el-input
              v-model="dialogData.firstBill"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">末张单号</div>
            <el-input
              v-model="dialogData.lastBill"
              placeholder="请输入发票代码"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">发放大区</div>
            <el-select
              v-model="dialogData.village"
              clearable
              placeholder="请选择发放项目"
            >
              <el-option
                v-for="itm in dialogData.villageOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-item">
            <div class="name">发放人员</div>
            <el-select
              v-model="dialogData.grantUser"
              clearable
              placeholder="请选择发放大区"
            >
              <el-option
                v-for="itm in dialogData.userOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="sheet">
          总计本数:
          <span>{{ dialogData.sheetNum }}</span>
        </div>
        <div class="total">
          总计数量:
          <span>{{ dialogData.total }}</span>
        </div>
      </div>

      <!-- 发放部分 -->
      <div class="grant-wp" v-else>
        <div class="input-wp">
          <div class="input-item">
            <div class="name">发放项目</div>
            <el-select
              v-model="dialogData.village"
              clearable
              placeholder="请选择发票面值"
            >
              <el-option
                v-for="itm in dialogData.villageOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-item">
            <div class="name">发放人员</div>
            <el-select
              v-model="dialogData.grantUser"
              clearable
              placeholder="请选择发放大区"
            >
              <el-option
                v-for="itm in dialogData.userOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          提交保存
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

<script src="@/assets/custom/js/activeManage.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/activeManage.less');
</style>
