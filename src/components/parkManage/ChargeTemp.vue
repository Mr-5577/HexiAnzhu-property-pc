<template>
  <div id="charge-temp">
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
              @click.stop="filterVillage({ name: '全部项目', vid: '' })"
            ></i>
          </span>
          <el-select
            v-model="mode"
            clearable
            placeholder="请选择收费模式"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in modeOptions"
              :key="itm.mode"
              :label="itm.mode_text"
              :value="itm.mode"
            ></el-option>
          </el-select>
          <input
            type="text"
            class="common-input"
            placeholder="输入添加入名字查询"
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
            v-if="$menu.getters.judgeRole('Btn-DEFCD9C5A89FACC8C9452F8F')"
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="addCharge"
          >
            新增收费标准
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
          @setVal="tableSetVal"
          @detail="tableDetail"
          @edit="tempEdit"
        ></cus-table>
      </div>
    </div>

    <!-- 新增收费标准弹框部分 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      :title="isEdit ? '编辑收费标准' : '新增收费标准'"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="模板名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入模板名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="收费模式" prop="mode">
            <el-select
              v-model="ruleForm.mode"
              placeholder="请选择收费模式"
              @change="modeChange"
            >
              <el-option
                v-for="itm in modeOptions"
                :key="itm.mode"
                :label="itm.mode_text"
                :value="itm.mode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="`有效时间（${ruleForm.mode == 'day' ? '天' : '小时'}）`"
            prop="time"
          >
            <el-input
              v-model="ruleForm.time"
              disabled
              placeholder="请输入有效时间"
            ></el-input>
          </el-form-item>
          <el-form-item label="收费金额" prop="money">
            <el-input
              v-model="ruleForm.money"
              type="number"
              placeholder="请输入收费金额"
            ></el-input>
          </el-form-item>
          <el-form-item label="通行模式" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择通行模式">
              <el-option label="限次" :value="1"></el-option>
              <el-option label="不限次" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.type == 1"
            label="通行次数"
            prop="number"
          >
            <el-input
              v-model="ruleForm.number"
              type="number"
              placeholder="请输入通行次数"
            ></el-input>
          </el-form-item>

          <el-form-item class="remark" label="资费说明" prop="remark">
            <el-input
              type="textarea"
              v-model="ruleForm.remark"
              placeholder="请输入资费说明"
              resize="none"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="addSubmit">
          {{ isEdit ? '确认修改' : '确认新增' }}
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

    <!-- 应用车场弹框 -->
    <el-dialog
      class="useDialog"
      :visible.sync="showUseDialog"
      title="应用车场"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-tabs
        v-model="activeName"
        v-loading="loadDetail"
        element-loading-text="数据加载中"
      >
        <el-tab-pane
          :label="item.deptname"
          :name="item.deptname"
          v-for="item in detailList"
          :key="item.deptid"
        >
          <el-scrollbar style="height: 100%;">
            <div
              class="content"
              v-for="(itm, i) in item.lowerDepartment"
              :key="i"
            >
              <div class="cname">
                {{ itm.deptname }}
              </div>
              <ul>
                <li
                  :class="[
                    itm.lowerDepartment.every(v => v.checked) ? 'active' : ''
                  ]"
                  @click="selectAll(itm)"
                >
                  全部
                </li>
                <li
                  :class="[ite.checked ? 'active' : '']"
                  v-for="(ite, j) in itm.lowerDepartment"
                  :key="j"
                  @click="ite.checked = !ite.checked"
                >
                  {{ ite.deptname }}
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer">
        <el-button
          :disabled="!$menu.getters.judgeRole('Btn-F44614A8C5A89C0CD4AF0BE9')"
          :loading="isCommit"
          type="primary"
          round
          @click="useSubmit"
        >
          确认应用
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showUseDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/parkManage/js/chargeTemp.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/chargeTemp.less');
</style>
