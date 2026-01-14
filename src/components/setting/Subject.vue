<template>
  <div id="subject" v-loading="isSubmit" element-loading-text="数据提交中">
    <!-- 左边部分 -->
    <div class="left-wp">
      <!-- 上边树形结构+搜索部分 -->
      <div class="top">
        <subject-tree
          ref="subjectTree"
          :showSearch="true"
          @checkChange="checkChange"
          @setData="setData"
        ></subject-tree>
      </div>
      <!-- 底部新增科目部分 -->
      <div class="bottom">
        <el-button
          v-if="$menu.getters.judgeRole('Btn-OhBnIMrYNaQwP86op5S1RZgt')"
          type="primary"
          round
          @click="newHandle"
        >
          新增科目
        </el-button>
      </div>
    </div>
    <el-button
      v-if="$menu.getters.judgeRole('Btn-h0bgw6HmtW3JiUuOaF9xcZEd')"
      type="warning"
      round
      plain
      icon="iconfont iconqingkuang"
      @click="showCondition"
    >
      项目使用情况
    </el-button>
    <div class="right-wp" v-if="!currentSubject.id">
      <div class="empty">请在左侧选择科目！</div>
    </div>
    <div class="right-wp" v-loading="isLoading" v-else>
      <div class="title">
        <img
          src="@/assets/setting/image/subname.png"
          alt=""
          style="width: 1rem;height: 1rem;vertical-align:middle;margin-right: 0.5rem;"
        />
        <span>{{ subjectDetail.name }}</span>
        <el-switch
          v-if="$menu.getters.judgeRole('Btn-4IczafWSxOotLX6ZlyAmeuvE')"
          v-model="switchVal"
          active-color="#3ebb75"
          inactive-color="#f2f2f2"
          inactive-text="启用"
          @change="switchChange"
        ></el-switch>
      </div>
      <el-scrollbar style="height: calc(100% - 8.5rem);">
        <el-form
          :model="editForm"
          :rules="rules"
          :hide-required-asterisk="true"
          ref="editForm"
        >
          <el-form-item
            :label="item.name"
            :prop="item.value"
            v-for="(item, index) in editInfo"
            :key="index"
          >
            <el-cascader
              v-model="editForm[item.value]"
              :options="item.options"
              :props="item.props"
              clearable
              :show-all-levels="false"
              v-if="item.type == 'cascader'"
            ></el-cascader>
            <el-select
              v-model="editForm[item.value]"
              clearable
              :disabled="item.readonly"
              :placeholder="`请选择${item.name}`"
              v-else-if="item.type == 'select'"
            >
              <el-option
                v-for="itm in item.options"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
            <el-input
              v-else
              v-model="editForm[item.value]"
              :type="item.type"
              :disabled="item.readonly"
              :placeholder="`请输入${item.name}`"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="科目类型"
            prop="subType"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.subType"
              clearable
              placeholder="请选择科目类型"
            >
              <el-option
                v-for="itm in subjects"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计量单位"
            prop="unitVal"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.unitVal"
              clearable
              placeholder="请选择计量单位"
            >
              <el-option
                v-for="itm in units"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计算公式"
            prop="formulaVal"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.formulaVal"
              clearable
              placeholder="请选择计算公式"
            >
              <el-option
                v-for="itm in formulas"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收费模式"
            prop="pattern"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.pattern"
              clearable
              placeholder="请选择收费模式"
            >
              <el-option
                v-for="itm in patterns"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否在添加收费显示"
            prop="show"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.show"
              clearable
              placeholder="请选择是否在添加收费显示"
            >
              <el-option :key="0" label="不显示" :value="0"></el-option>
              <el-option :key="1" label="显示" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否是装修科目"
            prop="fitSub"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.fitSub"
              clearable
              placeholder="请选择是否是装修科目"
            >
              <el-option :key="0" label="否" :value="0"></el-option>
              <el-option :key="1" label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="沪友开票名称"
            prop="invoiceName"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.invoiceName"
              clearable
              placeholder="请选择沪友开票名称"
            >
              <el-option
                v-for="itm in inameOptions"
                :key="itm"
                :label="itm"
                :value="itm"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许多次退款"
            prop="isrefund"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.isrefund"
              clearable
              placeholder="请选择是否允许多次退款"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许编辑计算公式"
            prop="isformedit"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.isformedit"
              clearable
              placeholder="请选择是否允许编辑计算公式"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许自定义开始时间"
            prop="is_custom_time"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.is_custom_time"
              clearable
              placeholder="请选择是否允许自定义开始时间"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许选择目前欠费之前的时间"
            prop="is_choice_before"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.is_choice_before"
              clearable
              placeholder="请选择是否允许选择目前欠费之前的时间"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许跳交"
            prop="expire_chose_starttime"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.expire_chose_starttime"
              clearable
              placeholder="请选择是否允许跳交"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计费周期"
            prop="billing_rules"
            v-if="editForm && editForm.isend"
          >
            <el-select
              v-model="editForm.billing_rules"
              clearable
              placeholder="请选择计费周期"
            >
              <el-option label="按自然月" :value="1"></el-option>
              <el-option label="按月" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <!-- 计费优先级 -->
          <el-form-item
            class="priority"
            label="计费优先级"
            v-if="editForm && editForm.isend"
          >
            <el-form-item prop="priority1">
              <el-select
                v-model="editForm.priority1"
                clearable
                placeholder="请选择计费优先级"
              >
                <el-option
                  v-for="itm in priorityOptions1"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="line" :span="1">></span>
            <el-form-item prop="priority2">
              <el-select
                v-model="editForm.priority2"
                clearable
                placeholder="请选择计费优先级"
              >
                <el-option
                  v-for="itm in priorityOptions2"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="line" :span="1">></span>
            <el-form-item prop="priority3">
              <el-select
                v-model="editForm.priority3"
                clearable
                placeholder="请选择计费优先级"
              >
                <el-option
                  v-for="itm in priorityOptions3"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-form>
        <div class="btn-wp">
          <el-button
            type="primary"
            plain
            round
            icon="iconfont iconzu3638"
            @click="logHandle"
          >
            变更日志
          </el-button>
        </div>
      </el-scrollbar>

      <div class="bottom-btn">
        <el-button
          v-if="$menu.getters.judgeRole('Btn-lEBjoJTvcgmb2KhZAYwdnSRa')"
          type="primary"
          round
          @click="editSubmit"
        >
          保存修改
        </el-button>
      </div>
    </div>

    <!-- 新增科目弹框部分 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddPop"
      title="新增科目"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          :hide-required-asterisk="true"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item
            :label="item.name"
            :prop="item.value"
            v-for="(item, index) in infoList"
            :key="index"
          >
            <el-cascader
              v-model="ruleForm[item.value]"
              :options="item.options"
              :props="item.props"
              clearable
              :show-all-levels="false"
              v-if="item.type == 'cascader'"
            ></el-cascader>
            <el-select
              v-model="ruleForm[item.value]"
              clearable
              :placeholder="`请选择${item.name}`"
              v-else-if="item.type == 'select'"
            >
              <el-option
                v-for="itm in item.options"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
            <el-input
              v-else
              v-model="ruleForm[item.value]"
              :type="item.type"
              :readonly="item.readonly"
              :placeholder="`请输入${item.name}`"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="科目类型"
            prop="subType"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.subType"
              clearable
              placeholder="请选择科目类型"
            >
              <el-option
                v-for="itm in subjects"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计量单位" prop="unitVal" v-if="ruleForm.isend">
            <el-select
              v-model="ruleForm.unitVal"
              clearable
              placeholder="请选择计量单位"
            >
              <el-option
                v-for="itm in units"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计算公式"
            prop="formulaVal"
            v-if="ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.formulaVal"
              clearable
              placeholder="请选择计量单位"
            >
              <el-option
                v-for="itm in formulas"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收费模式"
            prop="pattern"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.pattern"
              clearable
              placeholder="请选择收费模式"
            >
              <el-option
                v-for="itm in patterns"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否在添加收费显示"
            prop="show"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.show"
              clearable
              placeholder="请选择是否在添加收费显示"
            >
              <el-option :key="0" label="不显示" :value="0"></el-option>
              <el-option :key="1" label="显示" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否是装修科目"
            prop="fitSub"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.fitSub"
              clearable
              placeholder="请选择是否是装修科目"
            >
              <el-option :key="0" label="否" :value="0"></el-option>
              <el-option :key="1" label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="沪友开票名称"
            prop="invoiceName"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.invoiceName"
              clearable
              placeholder="请选择沪友开票名称"
            >
              <el-option
                v-for="itm in inameOptions"
                :key="itm"
                :label="itm"
                :value="itm"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许多次退款"
            prop="isrefund"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.isrefund"
              clearable
              placeholder="请选择是否允许多次退款"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许编辑计算公式"
            prop="isformedit"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.isformedit"
              clearable
              placeholder="请选择是否允许编辑计算公式"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许自定义时间"
            prop="is_custom_time"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.is_custom_time"
              clearable
              placeholder="请选择是否允许自定义时间"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许选择目前欠费之前的时间"
            prop="is_choice_before"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.is_choice_before"
              clearable
              placeholder="请选择是否允许选择目前欠费之前的时间"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否允许跳交"
            prop="expire_chose_starttime"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.expire_chose_starttime"
              clearable
              placeholder="请选择是否允许跳交"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="计费周期"
            prop="billing_rules"
            v-if="ruleForm && ruleForm.isend"
          >
            <el-select
              v-model="ruleForm.billing_rules"
              clearable
              placeholder="请选择计费周期"
            >
              <el-option label="按自然月" :value="1"></el-option>
              <el-option label="按月" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <!-- 计费优先级 -->
          <el-form-item
            class="priority"
            label="计费优先级"
            v-if="ruleForm.isend"
          >
            <el-form-item prop="priority1">
              <el-select
                v-model="ruleForm.priority1"
                clearable
                placeholder="请选择计费优先级"
              >
                <el-option
                  v-for="itm in popPriorityOpt1"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="line" :span="1">></span>
            <el-form-item prop="priority2">
              <el-select
                v-model="ruleForm.priority2"
                clearable
                placeholder="请选择计费优先级"
              >
                <el-option
                  v-for="itm in popPriorityOpt2"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="line" :span="1">></span>
            <el-form-item prop="priority3">
              <el-select
                v-model="ruleForm.priority3"
                clearable
                placeholder="请选择计费优先级"
              >
                <el-option
                  v-for="itm in popPriorityOpt3"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="submitForm">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showAddPop = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 项目使用情况弹框部分 -->
    <el-dialog
      class="useDialog"
      :visible.sync="showUsePop"
      title="项目使用情况"
      width="50%"
      :close-on-click-modal="true"
    >
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="false"
        ></cus-table>
      </div>
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

<script src="@/assets/setting/js/subject.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/subject.less');
</style>
