<template>
  <div id="payment">
    <div class="left-wp">
      <div class="top-wp">
        <div class="title">付款方式配置</div>
        <el-select
          v-model="paymentVal"
          placeholder="请选择付款方式"
          @change="getTreeData"
        >
          <el-option
            v-for="itm in paymentOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
      </div>
      <div class="tree-wp">
        <el-scrollbar style="height: 100%;" v-loading="isLoading">
          <!-- 树形结构部分 -->
          <div class="tree-wrap">
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="nodeid"
              accordion
              show-checkbox
              :props="defaultProps"
              :default-expanded-keys="expandedKeys"
              :default-checked-keys="checkedKeys"
              @check="nodeCheck"
              @node-expand="nodeExpand"
              @node-collapse="nodeCollapse"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <i
                  class="iconfont icondaqu"
                  v-if="node.data.type == 'city'"
                ></i>
                <i
                  class="iconfont iconxiangmu"
                  v-if="node.data.type == 'village'"
                ></i>
                <span class="label">{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="right-wp">
      <div class="title">付款方式设置</div>
      <el-scrollbar style="height: calc(100% - 8.6rem);">
        <div class="empty" v-if="paymentOptions.length == 0">
          请添加付款方式！
        </div>
        <ul>
          <!--使用draggable组件-->
          <draggable
            v-model="paymentOptions"
            chosenClass="chosen"
            forceFallback="true"
            animation="500"
            @end="dragEnd"
          >
            <transition-group>
              <li v-for="item in paymentOptions" v-bind:key="item.id">
                <span>{{ item.name }}</span>
                <el-switch
                  :value="item.is_open == 1 ? true : false"
                  active-color="#3ebb75"
                  inactive-color="#ccc"
                  inactive-text="开启"
                  @change="switchChange(item)"
                ></el-switch>
              </li>
            </transition-group>
          </draggable>
        </ul>
      </el-scrollbar>
      <div class="btn-wp">
        <el-button
          v-if="this.$menu.getters.judgeRole('Btn-FBNKr6GmWvS1Z8k7D2u9aiPT')"
          type="success"
          round
          plain
          icon="iconfont iconxinzeng"
          @click="addDialogInit"
        >
          新增付款方式
        </el-button>
        <el-button
          type="primary"
          round
          plain
          icon="iconfont iconzu3638"
          @click="logDialogInit"
        >
          变更日志
        </el-button>
      </div>
    </div>

    <!-- 新增付款方式弹框部分 -->
    <el-dialog
      class="addPayDialog"
      :visible.sync="showAddPop"
      title="新增付款方式"
      width="34%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="付款方式名称" prop="payName">
          <el-input
            v-model="ruleForm.payName"
            placeholder="请输入付款方式名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="付款方式简称" prop="short">
          <el-input
            v-model="ruleForm.short"
            placeholder="请输入付款方式简称"
          ></el-input>
        </el-form-item>
        <el-form-item label="开发商支付类" prop="devPayVal">
          <el-select
            v-model="ruleForm.devPayVal"
            clearable
            placeholder="请选择开发商支付类"
          >
            <el-option
              v-for="itm in devOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启" prop="openStatus">
          <el-select
            v-model="ruleForm.openStatus"
            clearable
            placeholder="请选择是否开启"
          >
            <el-option
              v-for="item in openOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
          @click="showAddPop = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 变更日志弹框部分 -->
    <el-dialog
      class="logDialog"
      :visible.sync="showLogPop"
      title="付款方式变更日志"
      width="50%"
      :close-on-click-modal="true"
    >
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
    </el-dialog>
  </div>
</template>

<script src="@/assets/setting/js/payment.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/payment.less');
</style>
