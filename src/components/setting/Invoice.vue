<template>
  <div id="invoice">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            v-if="modelVal == 1"
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <workIcon name="build"></workIcon>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="
                choseVillageInfo = {
                  name: '全部项目',
                  vid: 0
                }
              "
            ></i>
          </span>
          <el-select
            v-model="modelVal"
            placeholder="请选择模式"
            @change="modelChange"
          >
            <el-option label="明细模式" :value="1"></el-option>
            <el-option label="汇总模式" :value="2"></el-option>
          </el-select>
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
            v-if="this.$menu.getters.judgeRole('Btn-uqWieVe7m32wKriBWaItkTG6')"
            type="primary"
            round
            plain
            icon="iconfont iconxiugai"
            @click="dialogInit('entering')"
          >
            录入发票
          </el-button>
          <span class="ex-icon" @click="$refs.cusTable.exportExcel()">
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
          v-if="modelVal == 1"
          v-model="statusVal"
          clearable
          placeholder="请选择发票状态"
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
          v-model="auditVal"
          clearable
          placeholder="请选择审核状态"
          @change="tableLoad"
        >
          <el-option label="未审核" :value="1"></el-option>
          <el-option label="已通过" :value="2"></el-option>
          <el-option label="已驳回" :value="3"></el-option>
        </el-select>
        <el-select
          v-model="faceVal"
          clearable
          placeholder="请选择发票面值"
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
          v-if="modelVal == 1"
          v-model="dateVal"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="tableLoad"
        ></el-date-picker>

        <el-button
          v-if="
            modelVal == 1 &&
              this.$menu.getters.judgeRole('Btn-XmjOfoiI0fW0gzqC1Lveo3fY')
          "
          type="primary"
          round
          @click="dialogInit('custom')"
        >
          自定义发放
        </el-button>
      </div>
      <div class="table-wp">
        <cus-table
          ref="cusTable"
          :title="modelVal == 1 ? '定额发票明细表' : '定额发票汇总表'"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :check="true"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @enterPass="enterPass"
          @enterReject="enterReject"
          @cancelPass="cancelPass"
          @cancelReject="cancelReject"
          @send="invoiceSend"
          @turnover="turnOver"
          @selectionChange="selectionChange"
          @auditPass="auditPass"
          @auditReject="auditReject"
        ></cus-table>
        <div class="btn-wp" v-if="modelVal == 1">
          <el-scrollbar style="width: 100%;height:2.75rem;">
            <el-button
              v-if="
                this.$menu.getters.judgeRole('Btn-XmjOfoiI0fW0gzqC1Lveo3fY')
              "
              type="primary"
              :disabled="tableSelected.length == 0"
              round
              @click="batchSend"
            >
              发放已选({{ tableSelected.length }})本
            </el-button>
            <el-button
              v-if="
                this.$menu.getters.judgeRole('Btn-O3YVRDw40KkuuSnt4osbqk49')
              "
              class="empty"
              :disabled="tableSelected.length == 0"
              type="primary"
              round
              @click="batchTurn"
            >
              移交已选({{ tableSelected.length }})本
            </el-button>
            <el-button
              v-if="
                this.$menu.getters.judgeRole('Btn-YtoO8p5SN3qFjwyyinA36YZV')
              "
              class="empty"
              :disabled="tableSelected.length == 0"
              type="primary"
              round
              @click="batchAudit"
            >
              录入审批({{ tableSelected.length }})本
            </el-button>
            <el-button
              v-if="
                this.$menu.getters.judgeRole('Btn-Up6M61GGH2Pk8yq2vsNPpAVJ')
              "
              class="empty"
              :disabled="tableSelected.length == 0"
              type="primary"
              round
              @click="cancelAudit"
            >
              缴销审批({{ tableSelected.length }})本
            </el-button>
          </el-scrollbar>
        </div>
        <div class="btn-wp" v-else>
          <el-button
            v-if="this.$menu.getters.judgeRole('Btn-XmjOfoiI0fW0gzqC1Lveo3fY')"
            class="empty"
            type="primary"
            :disabled="tableSelected.length == 0"
            round
            @click="auditHandle(true)"
          >
            批量通过(共{{ tableSelected.length }})本
          </el-button>
          <el-button
            v-if="this.$menu.getters.judgeRole('Btn-O3YVRDw40KkuuSnt4osbqk49')"
            class="empty"
            :disabled="tableSelected.length == 0"
            type="warning"
            round
            @click="auditHandle(false)"
          >
            批量驳回(共{{ tableSelected.length }})本
          </el-button>
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

    <!-- 弹框部分 -->
    <el-dialog
      :class="[
        type == 'entering' ? 'entering' : type == 'custom' ? 'custom' : 'grant'
      ]"
      :visible.sync="showDialog"
      :title="dialogTitle"
      width="36%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <!-- 录入发票部分 -->
        <div class="form-wp">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :hide-required-asterisk="true"
          >
            <el-form-item
              label="发票代码"
              prop="code"
              v-if="type == 'entering' || type == 'custom'"
            >
              <el-input
                v-model="ruleForm.code"
                placeholder="请输入发票代码"
                @change="checkbill"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="发票面值"
              prop="faceValue"
              v-if="type == 'entering'"
            >
              <el-input
                v-model="ruleForm.faceValue"
                type="number"
                placeholder="请输入发票面值"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="发票面值"
              prop="faceVal"
              v-if="type == 'custom'"
            >
              <el-select
                v-model="ruleForm.faceVal"
                clearable
                placeholder="请选择发票面值"
                @change="checkbill"
              >
                <el-option
                  v-for="itm in faceOptions"
                  :key="itm.value"
                  :label="itm.label"
                  :value="itm.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="首张单号"
              prop="first"
              v-if="type == 'entering' || type == 'custom'"
            >
              <el-input
                v-model="ruleForm.first"
                placeholder="请输入首张单号"
                @change="checkbill"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="末张单号"
              prop="last"
              v-if="type == 'entering' || type == 'custom'"
            >
              <el-input
                v-model="ruleForm.last"
                placeholder="请输入末张单号"
                @change="checkbill"
              ></el-input>
            </el-form-item>
            <el-form-item label="本数" prop="number" v-if="type == 'entering'">
              <el-input
                v-model="ruleForm.number"
                type="number"
                placeholder="请输入发票本数"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="发放大区"
              prop="area"
              v-if="type == 'entering'"
            >
              <el-select
                v-model="ruleForm.area"
                clearable
                placeholder="请选择发放大区"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="审核人员"
              prop="auditor"
              v-if="type == 'entering'"
            >
              <el-select
                v-model="ruleForm.auditor"
                clearable
                filterable
                remote
                placeholder="请输入审核人姓名"
                :remote-method="remoteMethod"
                :loading="isLoading"
              >
                <el-option
                  v-for="item in auditorOptions"
                  :key="item.uid"
                  :label="
                    `${
                      item.company.shortname
                        ? item.company.shortname
                        : item.company.deptname
                    } - ${item.realname} - ${item.position.posname}`
                  "
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 发放部分 -->
            <el-form-item
              label="发放项目"
              prop="village"
              v-if="type != 'entering'"
            >
              <el-select
                v-model="ruleForm.village"
                placeholder="请选择发放项目"
                clearable
                @change="villageChange"
              >
                <el-option
                  v-for="item in villageOptions"
                  :key="item.id"
                  :label="item.villagename"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="领用人员"
              prop="user"
              v-if="type != 'entering'"
            >
              <el-select
                v-model="ruleForm.user"
                clearable
                placeholder="请选择领用人员"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.uid"
                  :label="item.realname"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 自定义发放 -->
          <div class="num-wp" v-if="type == 'custom'">
            <div class="sheet">
              总计本数:
              <span>{{ sheetNum }}</span>
            </div>
            <div class="total">
              总计数量:
              <span>{{ total }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
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

    <!-- 批量审核弹框部分 -->
    <el-dialog
      class="auditDialog"
      :visible.sync="showAuditDialog"
      :title="isAlone ? '发票审批' : '批量审批'"
      width="36%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="title" v-if="!isAlone">
          确定{{ isPass ? '通过' : '驳回' }}
          <span>已选{{ tableSelected.length }}本</span>
          发票吗？
        </div>
        <div class="name">审核附言</div>
        <el-input
          type="textarea"
          v-model="auditRemark"
          resize="none"
          :rows="4"
        ></el-input>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="auditSubmit"
        >
          {{ isPass ? '确认通过' : '确认驳回' }}
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

<script src="@/assets/setting/js/invoice.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/invoice.less');
</style>
