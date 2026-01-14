<template>
  <div id="arrearages">
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
            v-model="typeVal"
            placeholder="请选择类型"
            @change="tableLoad"
          >
            <el-option label="欠费明细" :value="2"></el-option>
            <el-option label="欠费统计" :value="1"></el-option>
          </el-select>
          <input
            type="text"
            class="common-input"
            placeholder="请输入姓名/房号/车牌号或车位"
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
          <span @click="getExportData">
            <workIcon
              name="export"
              class="common-right-icon"
              title="导出"
            ></workIcon>
          </span>
          <span
            v-if="$menu.getters.judgeRole('Btn-FDefkBASck2RmkklXTDhIfij')"
            @click="printHandle"
            v-print="{ id: '#tablePrint', popTitle: '欠费列表' }"
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
      <div class="select-wp">
        <el-select
          v-model="subjectVal"
          clearable
          placeholder="请选择欠费科目"
          @change="subjectChange"
        >
          <el-option
            v-for="itm in subOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="buildVal"
          clearable
          placeholder="请选择楼栋"
          @change="buildChange"
          v-if="isRoom == 'rooms'"
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
          clearable
          placeholder="请选择单元"
          @change="tableLoad"
          v-if="isRoom == 'rooms'"
        >
          <el-option
            v-for="itm in unitOptions"
            :key="itm.id"
            :label="itm.unit"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          align="center"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="tableLoad"
        ></el-date-picker>

        <el-button
          v-if="
            typeVal == 1 &&
              $menu.getters.judgeRole('Btn-loHASAOCLV23SGXRWs1J7bhf')
          "
          type="primary"
          round
          @click="RecordInit"
        >
          短信发送记录
        </el-button>
      </div>
      <div class="table-wp">
        <cus-table
          ref="seleTable"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @selectionChange="selectionChange"
          @print="arrearagePrint"
          @detail="desRecord"
          @addMsg="addMsg"
          @split="splitStart"
        ></cus-table>
        <div class="btn-wp">
          <el-button
            v-if="
              typeVal == 1 &&
                $menu.getters.judgeRole('Btn-ZFBVu9LLBTmnRUSEsVHZTEPG')
            "
            :disabled="tableSelected.length === 0"
            type="primary"
            round
            @click="sendNote"
          >
            发送短信({{ tableSelected.length }})条
          </el-button>
          <el-button
            v-if="
              typeVal == 2 &&
                $menu.getters.judgeRole('Btn-wtNgnHsqUdIRipro9UdnFeUg')
            "
            :disabled="tableSelected.length === 0"
            type="primary"
            round
            @click="addReason"
          >
            欠费原因({{ tableSelected.length }})条
          </el-button>
          <el-button
            v-if="$menu.getters.judgeRole('Btn-5w00kBx59ms59aTa53411xCY')"
            :disabled="tableSelected.length === 0"
            type="primary empty"
            round
            @click="batchPrint"
          >
            批量打印已选({{ tableSelected.length }})
          </el-button>
          <el-button
            v-if="
              typeVal == 2 &&
                $menu.getters.judgeRole('Btn-QDfdR4Or5TVFVSY9IE9hM6J3')
            "
            :disabled="tableSelected.length === 0"
            type="warning empty"
            round
            @click="batchDel"
          >
            批量删除({{ tableSelected.length }})条
          </el-button>
        </div>
        <span class="total" v-if="typeVal == 1">
          合计金额：
          <span>{{ totalMoney }}元</span>
        </span>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
    <!-- 选择项目 -->

    <!-- 欠费拆分 弹框 -->
    <el-dialog
      class="splitDialog"
      :visible.sync="showSplitDialog"
      title="欠费记录拆分"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item class="remark" label="拆分时间" prop="stime">
            <el-date-picker
              v-model="ruleForm.stime"
              type="date"
              align="center"
              value-format="timestamp"
              :picker-options="pickerOptions"
              placeholder="请选择拆分时间"
              @change="stimeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            :label="`拆分金额（${oneTime}）`"
            type="number"
            prop="oneMoney"
            v-show="ruleForm.stime"
          >
            <el-input
              v-model="ruleForm.oneMoney"
              type="number"
              placeholder="请输入第一段拆分金额"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="`拆分金额（${twoTime}）`"
            prop="twoMoney"
            v-show="ruleForm.stime"
          >
            <el-input
              v-model="ruleForm.twoMoney"
              placeholder="请输入第二段拆分金额"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="splitSubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showSplitDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑说明弹框 -->
    <el-dialog
      class="descDialog"
      :visible.sync="showDescDialog"
      :title="isAdd ? '新增欠费说明' : '编辑欠费说明'"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="title">欠费说明</div>
      <el-input
        type="textarea"
        v-model="descVal"
        resize="none"
        :rows="5"
        placeholder="请填写欠费说明"
      ></el-input>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="descSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showDescDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 欠费说明记录弹框 -->
    <el-dialog
      class="descRecordDialog"
      :visible.sync="showDescRecordDialog"
      title="欠费说明记录"
      width="55%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="descTableData"
          :cusColums="descColumns"
          :cusConf="descConf"
          @edit="descEdit"
          @delete="descDel"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 批量添加欠费原因弹框 -->
    <el-dialog
      class="reasonDialog"
      :visible.sync="showReasonDialog"
      title="添加欠费原因"
      width="30%"
      :close-on-click-modal="true"
    >
      <div class="title">选择欠费原因</div>
      <div class="tip" v-if="reasonList.length == 0">暂无欠费原因数据！</div>
      <el-radio-group v-model="radioVal" v-else>
        <el-radio :label="item.id" v-for="item in reasonList" :key="item.id">
          {{ item.name }}
        </el-radio>
      </el-radio-group>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showReasonDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 打印内容部分 -->
    <div id="tablePrint" v-show="showPrint">
      <table>
        <thead style="display: table-header-group; font-weight: bold">
          <tr>
            <th>资源名称</th>
            <th>科目名称</th>
            <th>客户姓名</th>
            <th>联系电话</th>
            <th>欠费周期</th>
            <th>欠费金额</th>
            <th>上次推送</th>
            <th>欠费原因</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.resources_name }}</td>
            <td>{{ item.subject_name }}</td>
            <td>{{ item.owner_name }}</td>
            <td>{{ item.owner_tel }}</td>
            <td>{{ item.cycle }}</td>
            <td>{{ item.money }}</td>
            <td>{{ item.last_send_time }}</td>
            <td>{{ item.arrearsreson }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!tableData.length" class="table-empty">
        <span>暂无数据!</span>
      </div>
    </div>

    <!-- 短信发送记录弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="短信发送记录"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="select-wp">
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择发送状态"
          @change="recordTableLoad"
        >
          <el-option label="成功" :value="1"></el-option>
          <el-option label="失败" :value="2"></el-option>
        </el-select>
        <el-date-picker
          v-model="sendDate"
          type="daterange"
          align="center"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="recordTableLoad"
        ></el-date-picker>
        <el-input
          v-model="keywords"
          placeholder="请输入关键字查询"
          @change="recordTableLoad"
        ></el-input>
        <span class="export" @click="exportRecordData">
          <workIcon
            name="export"
            class="common-right-icon"
            title="导出"
          ></workIcon>
        </span>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="recordTableData"
          :cusColums="recordColumns"
          :cusConf="recordConf"
          :ispaging="true"
          :check="true"
          @sizeChange="recordSizeChange"
          @currentChange="recordCurrentChange"
          @selectionChange="recordSelectionChange"
          @send="sendAgain"
        ></cus-table>
        <el-button
          class="batch"
          v-if="$menu.getters.judgeRole('Btn-2ZtEucmLizAeXjt76DBsZK2M')"
          :disabled="recordSelects.length === 0"
          type="primary empty"
          round
          @click="batchSendAgain"
        >
          批量重新发送({{ recordSelects.length }})条
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/assets/charge/js/arrearages.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/arrearages.less');
</style>
