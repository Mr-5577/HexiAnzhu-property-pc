<template>
  <div id="charging" v-loading="isSubmit" element-loading-text="数据提交中">
    <!-- 预选择页面 -->
    <div class="pre-selection" v-show="!isRegister">
      <area-village-select
        title="计费标准设置"
        btnName="开始设置"
        @registerPass="registerPass"
      ></area-village-select>
    </div>
    <div class="main-ct" v-if="isRegister">
      <!-- 重新查询按钮部分 -->
      <el-button
        icon="el-icon-search"
        class="query"
        @click="isRegister = false"
      >
        重新设置
      </el-button>
      <!-- 左边部分 -->
      <div class="left-wp">
        <!-- 树形结构+搜索部分 -->
        <subject-tree
          ref="subjectTree"
          :vid="vid"
          :showSearch="false"
          treeType="charge"
          @checkChange="checkChange"
        ></subject-tree>
      </div>
      <div class="right-wp" v-if="!currentSubject.id">
        <div class="empty">请在左侧选择科目！</div>
      </div>
      <div class="right-wp" v-loading="isLoading" v-else>
        <div class="title">
          <img
            src="@/assets/setting/image/subname.png"
            alt=""
            style="width: 1rem;height: 1rem;vertical-align:middle;margin-right:10px;"
          />
          <span>{{ subjectDetail.name }}</span>
          <el-switch
            v-if="
              currentSubject.is_end == 1 &&
                $menu.getters.judgeRole('Btn-QfTIBlCpVq152jHbu6rmKoGY')
            "
            v-model="switchVal"
            active-color="#3ebb75"
            inactive-color="#f2f2f2"
            inactive-text="启用"
            @change="switchChange"
          ></el-switch>
        </div>
        <el-scrollbar
          :style="{
            height:
              currentSubject.is_end == 1
                ? 'calc(100% - 8.5rem)'
                : 'calc(100% - 4.5rem)'
          }"
        >
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
                :disabled="currentSubject.is_end != 1"
              ></el-cascader>
              <el-select
                v-model="editForm[item.value]"
                clearable
                :disabled="item.readonly || currentSubject.is_end != 1"
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
                :disabled="item.readonly || currentSubject.is_end != 1"
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
                :disabled="currentSubject.is_end != 1"
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
                :disabled="currentSubject.is_end != 1"
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
              label="绑定车场"
              prop="carbind"
              v-if="
                editForm &&
                  editForm.isend &&
                  $menu.getters.judgeRole('Btn-QfTIBlCpVq156KuH5PrmKoG6')
              "
            >
              <el-select
                v-model="editForm.carbind"
                clearable
                placeholder="请选择车场"
              >
                <el-option
                  v-for="itm in carOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
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
              label="是否允许自定义时间"
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
                  :disabled="currentSubject.is_end != 1"
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
                  :disabled="currentSubject.is_end != 1"
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
                  :disabled="currentSubject.is_end != 1"
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
              v-if="currentSubject.is_end == 1"
              class="add"
              round
              plain
              icon="iconfont iconxinzeng"
              @click="addHandle"
            >
              新增费率
            </el-button>
            <el-button
              v-if="currentSubject.is_end == 1"
              class="detail"
              round
              plain
              icon="iconfont iconqingkuang"
              @click="detailHandle"
            >
              费率明细
            </el-button>
            <el-button
              v-if="
                currentSubject.is_end == 1 &&
                  $menu.getters.judgeRole('Btn-Hs0dINt8CDRmMnBePLozZ37c')
              "
              type="warning"
              round
              plain
              icon="iconfont iconfuzhi"
              @click="copyDialogInit"
            >
              复制收费标准
            </el-button>
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

        <div class="bottom-btn" v-if="currentSubject.is_end == 1">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-oMl18sy2ZRxOhedGcfptD0WY')"
            type="primary"
            round
            @click="editSubmit"
          >
            保存修改
          </el-button>
          <el-button type="info" round>取消</el-button>
        </div>
      </div>
    </div>

    <!-- 复制收费标准弹框 -->
    <el-dialog
      class="copyDialog"
      :visible.sync="showCopyPop"
      title="复制收费标准"
      width="56%"
      :close-on-click-modal="false"
    >
      <div class="select-wp">
        <div class="select-ct">
          <el-select
            v-model="copyVillage"
            clearable
            filterable
            placeholder="请选择项目"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in copyOptions"
              :key="itm.value"
              :label="itm.villagename"
              :value="itm.id"
            ></el-option>
          </el-select>
          <span class="text">复制到</span>
          <el-select
            v-model="copyToVillage"
            clearable
            filterable
            placeholder="请选择项目"
          >
            <el-option
              v-for="itm in copyOptions"
              :key="itm.value"
              :label="itm.villagename"
              :value="itm.id"
            ></el-option>
          </el-select>
        </div>
        <div class="btn-wp">
          <el-button
            type="primary"
            round
            plain
            icon="el-icon-refresh-right"
            @click="tableLoad"
          >
            刷新科目
          </el-button>
        </div>
      </div>
      <div class="table-wp">
        <el-scrollbar style="height: calc(100% - 2.5rem);">
          <cus-table
            :datas="tableData"
            :cusColums="columns"
            :cusConf="conf"
            :check="true"
            @selectionChange="selectionChange"
          ></cus-table>
        </el-scrollbar>
        <div class="radio-wp">
          <el-radio v-model="radioVal" :label="0">保留原设置</el-radio>
          <el-radio v-model="radioVal" :label="1">覆盖原设置</el-radio>
        </div>
      </div>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="copyConfirm"
        >
          开始复制
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showCopyPop = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      :title="isEdit ? '编辑费率' : '新增费率'"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="科目名称" prop="sname">
          <el-input
            readonly
            v-model="addForm.sname"
            placeholder="请输入科目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="基本单价(元)" prop="price">
          <el-input
            v-model="addForm.price"
            placeholder="请输入基本单价"
          ></el-input>
        </el-form-item>
        <el-form-item label="生效时间" prop="time">
          <el-date-picker
            v-model="addForm.time"
            type="date"
            align="center"
            value-format="timestamp"
            placeholder="请选择生效时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="addSave">
          提交保存
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

    <!-- 费率明细弹框 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      title="费率明细记录"
      width="60%"
    >
      <div class="table-wp">
        <cus-table
          :datas="detailTableData"
          :cusColums="detailColumns"
          :cusConf="detailConf"
          @edit="rateEdit"
          @ratedel="rateDel"
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

<script src="@/assets/setting/js/charging.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/charging.less');
</style>
