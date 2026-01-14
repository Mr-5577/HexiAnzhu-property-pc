<template>
  <div id="message-template">
    <div class="main-wp">
      <div class="title">短信模板列表</div>
      <el-button
        v-if="$menu.getters.judgeRole('Btn-Xqv5STKA4tR08oZdiH0Et3me')"
        class="addbtn"
        type="primary"
        round
        plain
        icon="iconfont iconxinzeng"
        @click="addTemplate"
      >
        新增模板
      </el-button>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @villageSelect="villageSelect"
          @statusChange="statusChange"
          @edit="editInvoice"
        ></cus-table>
      </div>
    </div>

    <!-- 弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      :title="type == 'edit' ? '编辑短信模板' : '新增短信模板'"
      width="45%"
      :close-on-click-modal="false"
      @close="editClose"
    >
      <el-scrollbar style="height: 100%;" v-loading="detailLoading">
        <ul v-if="modelList.length > 0">
          <li
            class="copyText"
            :data-clipboard-text="item.show_key"
            v-for="item in modelList"
            :key="item.id"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="type-code">
          <el-input
            v-model="nameVal"
            placeholder="请输入模板名称"
          ></el-input>
          <el-input
            v-model="codeVal"
            placeholder="请输入短信模板编号"
          ></el-input>
        </div>
        <div class="type-code">
          <el-select v-model="typeVal" clearable placeholder="请选择模板类型">
            <el-option label="通用" :value="1"></el-option>
            <el-option label="欠费管理" :value="2"></el-option>
            <el-option label="问卷调查" :value="3"></el-option>
          </el-select>
          <el-select
            v-if="typeVal == 3"
            class="quest"
            v-model="questVal"
            clearable
            filterable
            placeholder="请选择调查问卷"
          >
            <el-option
              v-for="itm in questOptions"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
        </div>
        <div class="title">短信模板内容</div>
        <el-input
          class="content"
          type="textarea"
          v-model="tempContent"
          resize="none"
          :rows="13"
          placeholder="请输入模板内容"
        ></el-input>
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

    <!--项目应用选择弹框 -->
    <el-dialog
      class="useDialog"
      :visible.sync="showUseDialog"
      title="模板可用范围"
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
            <div class="content" v-for="itm in item.city" :key="itm.id">
              <div class="cname">
                {{ itm.city }}
              </div>
              <ul>
                <li
                  :class="[itm.village.every(v => v.checked) ? 'active' : '']"
                  @click="selectAll(itm)"
                >
                  全部
                </li>
                <li
                  :class="[ite.checked ? 'active' : '']"
                  v-for="ite in itm.village"
                  :key="ite.id"
                  @click="ite.checked = !ite.checked"
                >
                  {{ ite.villagename }}
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer">
        <el-button
          :disabled="!$menu.getters.judgeRole('Btn-Xqv5STKA4tR08oZdiH0Et3me')"
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
  </div>
</template>

<script src="@/assets/custom/js/messageTemplate.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/messageTemplate.less');
</style>
