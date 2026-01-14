<template>
  <div id="contract">
    <div class="msg-wp">
      <i class="el-icon-warning"></i>
      <div id="content" @mouseover="scrollOver" @mouseout="scrollOut">
        <ul id="msg1">
          <li
            v-for="item in contractList"
            :key="item.co_id"
            @click="toDetail(item.co_id)"
          >
            {{
              item.ptime +
                ' ' +
                item.villagename +
                '-合同编号-' +
                item.co_sn +
                '-有收款计划'
            }}
          </li>
        </ul>
      </div>
    </div>

    <div class="top">
      <div class="main">
        <div class="common-left">
          <el-cascader
            v-model="contractType"
            :props="{
              value: 'type_id',
              label: 'ct_name',
              checkStrictly: true,
              lazy: true,
              lazyLoad
            }"
            clearable
            @change="tableLoad"
            placeholder="请选择合同类型"
          ></el-cascader>
          <input
            type="text"
            class="common-input"
            placeholder="请输入合同单号/合同标题查询"
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
            class="common-button"
            plain
            icon="el-icon-plus"
            @click="$refs.showAddVillage.showDialog()"
            v-if="
              $global.btnRoleAuth(
                $api.state.System.village.add.token,
                $menu.state.childRoleList
              )
            "
          >
            新增项目
          </el-button>
          <el-dropdown trigger="click" :hide-on-click="false">
            <workIcon
              name="filtr"
              class="common-right-icon"
              title="筛选"
            ></workIcon>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in columns" :key="i">
                <el-checkbox v-model="v.show" @change="checkChange">
                  {{ v.label }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="$refs.cusTable.exportExcel()">
            <workIcon
              name="export"
              class="common-right-icon"
              title="导出"
            ></workIcon>
          </span>
          <span
            class="last-ico"
            @click="printHandle"
            v-print="{ id: '#tablePrint', popTitle: '合同列表' }"
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
          v-model="areaVal"
          clearable
          placeholder="请选择所属大区"
          @change="areaChange"
        >
          <el-option
            v-for="itm in areaOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="companyVal"
          clearable
          placeholder="请选择所属公司"
          @change="companyChange"
        >
          <el-option
            v-for="itm in companyOptions"
            :key="itm.deptid"
            :label="itm.deptname"
            :value="itm.deptid"
          ></el-option>
        </el-select>
        <el-select
          v-model="villageVal"
          clearable
          placeholder="请选择所属项目"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in villageOptions"
            :key="itm.deptid"
            :label="itm.deptname"
            :value="itm.deptid"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择状态"
          @change="tableLoad"
        >
          <el-option label="未到期" :value="1"></el-option>
          <el-option label="即将到期" :value="2"></el-option>
          <el-option label="已到期" :value="3"></el-option>
        </el-select>
      </div>
      <div class="table-wp">
        <cus-table
          ref="cusTable"
          title="合同数据表"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @detail="showDetail"
          @setDate="setDate"
          @setType="setType"
        ></cus-table>
      </div>
    </div>

    <!-- 设置起止日期/合同类型弹框部分 -->
    <el-dialog
      class="setDialog"
      :visible.sync="showSetDialog"
      :title="otype === 1 ? '设置起止日期' : '设置合同类型'"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <!-- 起止日期设置 -->
        <el-form-item v-if="otype === 1" label="开始日期" prop="stime">
          <el-date-picker
            v-model="ruleForm.stime"
            type="date"
            :picker-options="spickerOptions"
            value-format="timestamp"
            placeholder="请选择开始日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="otype === 1" label="结束日期" prop="etime">
          <el-date-picker
            v-model="ruleForm.etime"
            type="date"
            :picker-options="epickerOptions"
            value-format="timestamp"
            placeholder="请选择结束日期"
          ></el-date-picker>
        </el-form-item>

        <!-- 合同类型设置 -->
        <el-form-item v-if="otype === 2" label="合同类型" prop="ctype">
          <el-select
            v-model="ruleForm.ctype"
            clearable
            placeholder="请选择合同类型"
            @change="ctypeChange"
          >
            <el-option
              v-for="itm in ctypeOptions"
              :key="itm.type_id"
              :label="itm.ct_name"
              :value="itm.type_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="otype === 2" label="二级类型" prop="stype">
          <el-select
            v-model="ruleForm.stype"
            clearable
            placeholder="请选择二级类型"
          >
            <el-option
              v-for="itm in stypeOptions"
              :key="itm.type_id"
              :label="itm.ct_name"
              :value="itm.type_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showSetDialog = false"
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
            <th>待审计划</th>
            <th>合同编号</th>
            <th>合同标题</th>
            <th>对方单位</th>
            <th>所属项目</th>
            <th>项目类别</th>
            <th>含税金额</th>
            <th>不含税金额</th>
            <th>税率</th>
            <th>税额</th>
            <th>结算金额</th>
            <th>已收款金额</th>
            <th>未收款金额</th>
            <th>经办人</th>
            <th>发起时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.plan_count }}</td>
            <td>{{ item.co_sn }}</td>
            <td>{{ item.co_title }}</td>
            <td>{{ item.supname }}</td>
            <td>{{ item.vname }}</td>
            <td>{{ item.vtype }}</td>
            <td>{{ item.co_money }}</td>
            <td>{{ item.conottax_money }}</td>
            <td>{{ item.con_rate }}</td>
            <td>{{ item.con_tax_amount }}</td>
            <td>{{ item.co_balance }}</td>
            <td>{{ item.plan_sum }}</td>
            <td>{{ item.uncollected }}</td>
            <td>{{ item.cname }}</td>
            <td>{{ item.co_createtime }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!tableData.length" class="table-empty">
        <span>暂无数据!</span>
      </div>
    </div>

    <!-- 合同详情弹框组件部分 -->
    <contract-detail ref="contractDetail"></contract-detail>
  </div>
</template>

<script src="@/assets/contract/js/index.js"></script>

<style lang="less">
@import url('~@/assets/contract/css/index.less');
</style>
