<template>
  <div id="paper-receipt">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <input
            type="text"
            class="common-input"
            placeholder="请输入票据单号查询"
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
            @click="entryHandle"
          >
            录入收据
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="areaVal"
          clearable
          placeholder="请选择大区"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in areaOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择票据状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in statusOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @detail="showDetail"
          @grant="showGrant"
        ></cus-table>
      </div>
    </div>

    <!-- 录入收据弹框部分 -->
    <el-dialog
      class="entryDialog"
      :visible.sync="showEntryDialog"
      title="录入收据"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="form-wp">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="首张单号" prop="first">
              <el-input
                v-model="ruleForm.first"
                placeholder="请输入首张单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="末张单号" prop="last">
              <el-input
                v-model="ruleForm.last"
                placeholder="请输入末张单号"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="entrySubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showEntryDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 收据明细弹框部分 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="收据发放详情"
      width="80%"
      :close-on-click-modal="true"
    >
      <div class="table-wp">
        <cus-table
          :datas="popTableData"
          :cusColums="popColumns"
          :cusConf="popConf"
          :ispaging="false"
          @move="moveReceipt"
          @resolution="resolution"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 发放弹框部分 -->
    <el-dialog
      class="grantDialog"
      :visible.sync="showGrantDialog"
      :title="grantTitle"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="form-wp">
          <el-form
            :model="grantForm"
            :rules="grantRules"
            ref="grantForm"
            :hide-required-asterisk="true"
          >
            <el-form-item
              v-if="grantTitle === '发放到大区'"
              label="选择大区"
              prop="area"
            >
              <el-select
                v-model="grantForm.area"
                filterable
                clearable
                placeholder="请选择发放大区"
              >
                <el-option
                  v-for="itm in areaOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="grantTitle === '发放到个人'"
              label="首张单号"
              prop="first"
            >
              <el-input
                v-model="grantForm.first"
                placeholder="请输入首张单号"
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="grantTitle === '发放到个人'"
              label="末张单号"
              prop="last"
            >
              <el-input
                v-model="grantForm.last"
                placeholder="请输入末张单号"
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="grantTitle === '发放到个人'"
              label="发放项目"
              prop="village"
            >
              <el-select
                v-model="grantForm.village"
                filterable
                remote
                :remote-method="villageRemote"
                :loading="loading"
                placeholder="请选择发放项目"
                @change="villageChange"
              >
                <el-option
                  v-for="itm in grantVillages"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="grantTitle === '发放到个人'"
              label="发放人员"
              prop="user"
            >
              <el-select
                v-model="grantForm.user"
                filterable
                placeholder="请选择发放人员"
              >
                <el-option
                  v-for="itm in grantUsers"
                  :key="itm.uid"
                  :label="itm.realname"
                  :value="itm.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="grantSubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showGrantDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 移交/拆分收据弹框部分 -->
    <el-dialog
      class="moveDialog"
      :visible.sync="showMoveDialog"
      :title="isMove ? '移交收据' : '拆分收据'"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="form-wp">
          <el-form
            :model="moveForm"
            :rules="moveRules"
            ref="moveForm"
            :hide-required-asterisk="true"
          >
            <el-form-item v-if="!isMove" label="首张单号" prop="first">
              <el-input
                v-model="moveForm.first"
                placeholder="请输入首张单号"
              ></el-input>
            </el-form-item>

            <el-form-item v-if="!isMove" label="末张单号" prop="last">
              <el-input
                v-model="moveForm.last"
                placeholder="请输入末张单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="选择项目" prop="village">
              <el-select
                v-model="moveForm.village"
                filterable
                remote
                :remote-method="villageRemote"
                :loading="loading"
                placeholder="请选择项目"
                @change="villageChange"
              >
                <el-option
                  v-for="itm in grantVillages"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择人员" prop="user">
              <el-select
                v-model="moveForm.user"
                filterable
                placeholder="请选择人员"
              >
                <el-option
                  v-for="itm in grantUsers"
                  :key="itm.uid"
                  :label="itm.realname"
                  :value="itm.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="moveSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showMoveDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/setting/js/paperReceipt.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/paperReceipt.less');
</style>
