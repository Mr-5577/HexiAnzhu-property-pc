<template>
  <div id="order">
    <!-- 下载发票 -->
    <a
      ref="adom"
      :href="downloadUrl"
      target="_blank"
      style="display: none;"
    ></a>
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
            placeholder="请输入订单号码"
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
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-yY0u4TL5cNaRnxLYWs4evUl9')"
            type="primary"
            plain
            class="common-button"
            icon="iconfont iconxiugai"
            @click="viewRecord"
          >
            交款申请
          </el-button>
          <span
            v-if="$menu.getters.judgeRole('Btn-eZyXwlQ65nwMH38X3HZIAqov')"
            @click="exportExcel"
          >
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
          v-model="chargeStatus"
          clearable
          placeholder="请选择缴费状态"
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
          v-model="chargeChannel"
          clearable
          placeholder="请选择缴费渠道"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in channelOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="orderStatus"
          clearable
          placeholder="请选择订单状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in orderOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          align="center"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="tableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          ref="cusTable"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @buyBack="buyBack"
          @selectChange="selectChange"
          @detail="showDetial"
          @print="printOrder"
          @download="invoiceDownload"
          @invoiceAgain="invoiceAgain"
          @receiptAgain="receiptAgain"
          @changeTicket="changeTicket"
          @showQrcode="showQrcode"
          @implantation="implantation"
        ></cus-table>
        <div class="total">
          <span class="title">费用合计：</span>
          <span class="name">实收</span>
          <span class="official">{{ money }}</span>
          <span class="name">优惠</span>
          <span class="discounts">{{ yhmoney }}</span>
          <span class="name">应收</span>
          <span class="receb">{{ allmoney }}</span>
        </div>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
    <!-- 选择项目 -->

    <!-- 订单缴费详情弹框部分 -->
    <el-dialog
      class="orderDetail"
      :visible.sync="showDetailPop"
      title="订单缴费详情"
      width="60%"
      :close-on-click-modal="true"
    >
      <el-scrollbar style="height: 100%;">
        <div class="table-wp">
          <cus-table
            :datas="popTableData"
            :cusColums="popColumns"
            :cusConf="popConf"
          ></cus-table>
        </div>
        <div class="bt-wp">
          <div class="total">
            费用合计：
            <span class="name">实收</span>
            <span class="value">{{ realityMoney }}元</span>
            <span class="name">应收</span>
            <span class="value ys">{{ receivableMoney }}元</span>
          </div>
          <div class="remark">
            <div class="content">
              <span class="name">订单备注：</span>
              <p>
                {{ orderRemark }}
              </p>
            </div>
          </div>
        </div>

        <div class="table-wp table2">
          <div class="title">缴费明细</div>
          <cus-table
            :datas="infoTableData"
            :cusColums="infoColumns"
            :cusConf="infoConf"
          ></cus-table>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 交账申请弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="交账订单明细"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="date-filter">
        <!-- <el-date-picker
          v-if="dateRead"
          v-model="dateFilter[0]"
          readonly
          :clearable="false"
          type="datetime"
          placeholder="开始日期时间"
        ></el-date-picker>
        <date-picker
          v-else
          :to-body="false"
          v-model="dateFilter[0]"
          placeholder="开始日期时间"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          :min="smin"
          :max="smax"
        />
        ~
        <date-picker
          :to-body="false"
          v-model="dateFilter[1]"
          placeholder="结束日期时间"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          :min="emin"
          :max="emax"
        /> -->
        <el-date-picker
          v-model="dateFilter[0]"
          :readonly="dateRead"
          :clearable="false"
          type="datetime"
          :editable="false"
          :picker-options="pickerOptions1()"
          value-format="timestamp"
          placeholder="开始日期时间"
          @change="sdateChange"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="dateFilter[1]"
          type="datetime"
          :readonly="loadStime"
          :editable="false"
          value-format="timestamp"
          :picker-options="pickerOptions2()"
          placeholder="结束日期时间"
          @change="edateChange"
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
          type="warning"
          class="common-button"
          @click="auditHandle"
        >
          提交
        </el-button>
        <el-button
          v-if="showSearchTable"
          class="record"
          type="primary"
          icon="iconfont iconzu3638"
          @click="goBack"
        >
          交账记录
        </el-button>
      </div>
      <div class="table-wp">
        <el-table
          class="searchTable"
          v-if="showSearchTable && !searchConf.loadStatus"
          :data="searchTableData.data"
          height="calc(100% - 20px)"
          show-summary
          :summary-method="getSummaries"
          v-loading="searchConf.loadStatus"
          element-loading-text="数据获取中..."
          :empty-text="
            searchConf.emptyText ? searchConf.emptyText : searchConf.emptyText
          "
        >
          <el-table-column
            v-for="(item, index) in searchTableData.title"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
        </el-table>

        <cus-table
          v-else
          :datas="recordTableData"
          :cusColums="recordColumns"
          :cusConf="recordConf"
          :ispaging="true"
          @sizeChange="recordSizeChange"
          @currentChange="recordCurrentChange"
          @print="printHandle"
          @detail="recordInfo"
          @revocation="recordDevocation"
          @accountAgain="accountAgain"
          @accountDel="accountDel"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 交账明细弹框 -->
    <el-dialog
      class="infoDialog"
      :visible.sync="showInfoDialog"
      title="记录明细"
      width="80%"
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
          合计金额：
          <span class="money">{{ totalMoney }}元</span>
          <span class="num">
            共
            <span style="color: #3ebb75;">{{ rcdInfoData.length }}</span>
            条记录
          </span>
          <el-button type="primary empty" round @click="exportDetailExcel">
            导出Excel
          </el-button>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 换票弹框 -->
    <el-dialog
      class="ticketChange"
      :visible.sync="showTicketChange"
      title="换票"
      width="35%"
      :close-on-click-modal="true"
    >
      <el-form
        :model="changeForm"
        :rules="changeRules"
        ref="changeForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="发票代码" prop="code">
          <el-input
            v-model="changeForm.code"
            placeholder="请输入发票代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票号码" prop="number">
          <el-input
            v-model="changeForm.number"
            placeholder="请输入发票号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票类型" prop="type">
          <el-select
            v-model="changeForm.type"
            clearable
            placeholder="请选择发票类型"
          >
            <el-option
              v-for="itm in typeList"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showTicketChange = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 发票植入弹框 -->
    <el-dialog
      class="ticketChange"
      :visible.sync="showImplantDialog"
      title="发票植入"
      width="35%"
      :close-on-click-modal="true"
    >
      <el-form
        :model="implantForm"
        :rules="implantRules"
        ref="implantForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="发票代码" prop="code">
          <el-input
            v-model="implantForm.code"
            placeholder="请输入发票代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票号码" prop="number">
          <el-input
            v-model="implantForm.number"
            placeholder="请输入发票号码"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="implantSubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showImplantDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 二维码弹框 -->
    <el-dialog
      class="qrcodeDialog"
      :visible.sync="showQrcodeDialog"
      title="电子收据二维码"
      width="30%"
      :close-on-click-modal="true"
    >
      <!-- <div v-if="showQrcodeDialog" id="qrcode"></div> -->
      <div v-if="showQrcodeDialog && qrSrc" id="qrcode">
        <img :src="qrSrc" alt="" />
      </div>
      <div v-else style="color: #ccc;margin-top: 2.5rem;">
        正在生成二维码，请稍等
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="saveImage">
          保存图片
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showQrcodeDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 补开收据弹框 -->
    <el-dialog
      class="fillDialog"
      :visible.sync="showFillDialog"
      title="补开收据"
      width="28%"
      :close-on-click-modal="true"
    >
      <div class="select-wp">
        <div class="title">选择收据类型</div>
        <el-select
          :disabled="useReceiptType != 3"
          v-model="receiptType"
          placeholder="请选择收据类型"
        >
          <el-option label="电子收据" :value="1"></el-option>
          <el-option label="纸质收据" :value="2"></el-option>
        </el-select>
      </div>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          :disabled="filldisabled"
          type="primary"
          round
          @click="fillSubmit"
        >
          确认提交
        </el-button>
        <el-button
          :loading="isCommit"
          :disabled="filldisabled"
          type="info"
          round
          @click="showFillDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 打印横板/竖版选择弹框 -->
    <el-dialog
      class="printDialog"
      :visible.sync="showPrintDialog"
      title="打印类型"
      width="30%"
      :close-on-click-modal="true"
    >
      <el-radio v-model="radioVal" :label="1">竖版打印</el-radio>
      <el-radio v-model="radioVal" :label="2">横版打印</el-radio>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button type="primary" round @click="recordPrint">
          确定
        </el-button>
        <el-button type="info" round @click="showPrintDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 审批人选择弹框 -->
    <el-dialog
      class="auditDialog"
      :visible.sync="showAuditDialog"
      title="选择审批人"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="auditForm"
          :rules="auditRules"
          ref="auditForm"
          :hide-required-asterisk="true"
        >
          <el-form-item
            :label="`审批人${index + 1}`"
            :prop="'auditors.' + index + '.auditor'"
            :rules="auditRules.auditor"
            v-for="(item, index) in auditForm.auditors"
            :key="index"
          >
            <el-select
              v-model="item.auditor"
              filterable
              remote
              :remote-method="
                query => {
                  remoteMethod(query, item)
                }
              "
              :loading="loading"
              :placeholder="`请选择审批人${index + 1}`"
            >
              <el-option
                v-for="itm in item.options"
                :key="itm.id"
                :label="itm.text"
                :value="itm.id"
              ></el-option>
            </el-select>
            <i
              v-if="index != 0"
              @click="delAuditor(index)"
              class="el-icon-circle-close"
            ></i>
          </el-form-item>
          <el-form-item class="addUser">
            <div class="add" @click="addAuditor">添加审批人</div>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="auditorSubmit"
        >
          确认选择
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showAuditDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/charge/js/order.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/order.less');
</style>
