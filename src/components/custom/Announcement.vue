<template>
  <div id="announcement">
    <div class="main-wp">
      <div class="title">通知公告列表</div>
      <el-button
        v-if="$menu.getters.judgeRole('Btn-Ebwpz7tsvyBdvNwfaeZ7Bozd')"
        class="addbtn"
        type="primary"
        round
        plain
        icon="iconfont iconxinzeng"
        @click="addInvoice"
      >
        新增通告
      </el-button>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @totop="toTop"
          @open="toOpen"
          @edit="editInvoice"
          @delInvoice="delInvoice"
        ></cus-table>
      </div>
    </div>

    <!-- 弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      :title="type == 'edit' ? '编辑通告' : '新增通告'"
      width="40%"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="通告小区" prop="village">
            <el-select
              v-model="ruleForm.village"
              clearable
              placeholder="请选择通告小区"
              :disabled="type == 'edit'"
            >
              <el-option
                v-for="itm in villageList"
                :key="itm.id"
                :label="itm.villagename"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公告标题" prop="title">
            <el-input
              v-model="ruleForm.title"
              placeholder="请输入公告标题"
            ></el-input>
          </el-form-item>
          <el-form-item class="content" label="公告内容" prop="content">
            <div ref="editorElem"></div>
          </el-form-item>
          <!-- <el-form-item class="remark" label="备注信息" prop="remark">
            <el-input
              type="textarea"
              v-model="ruleForm.remark"
              resize="none"
              :rows="3"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item> -->
        </el-form>
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
          @click="showEditDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/custom/js/announcement.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/announcement.less');
</style>
