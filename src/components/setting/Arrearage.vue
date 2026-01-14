<template>
  <div id="arrearage">
    <el-button
      type="primary"
      round
      class="empty"
      style="position: absolute;top: 0.3rem;right:1.5rem;z-index: 1000;"
      @click="goBack"
      v-if="showAdd"
    >
      返回
    </el-button>

    <!-- 添加费用部分 -->
    <ChargeAdd
      :vid="currentObj.vid"
      :currentUser="currentObj"
      :checkeds="[currentObj.nodeid]"
      v-if="showAdd"
    ></ChargeAdd>

    <!-- 主页面部分 -->
    <div class="main-wp" v-else>
      <div class="left-wp">
        <div class="header">
          <div class="title">选择欠费目标</div>
          <!-- <el-button type="primary" plain round icon="iconfont iconzu3638">
            变更日志
          </el-button> -->
        </div>
        <div class="input-wp">
          <div class="village">
            <div class="name">欠费项目</div>
            <el-select
              v-model="villageVal"
              clearable
              filterable
              placeholder="请选择欠费项目"
              @change="villageChange"
            >
              <el-option
                v-for="itm in vilOptions"
                :key="itm.id"
                :label="itm.villagename"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
          <div class="batch">
            <div class="name">欠费批次</div>
            <el-select
              v-model="batchVal"
              clearable
              placeholder="请选择欠费批次"
              @change="batchChange"
            >
              <el-option
                v-for="itm in batchOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
          <div class="subject">
            <div class="name">欠费科目</div>
            <el-select
              v-model="subVal"
              clearable
              placeholder="请选择欠费科目"
              @change="tableLoad"
            >
              <el-option
                v-for="itm in subOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="date-wp">
          <div class="name">欠费日期</div>
          <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
            :picker-options="startOptions"
            @change="startChange"
          ></el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="endDate"
            type="month"
            placeholder="结束日期"
            value-format="yyyy-MM"
            :picker-options="endOptions"
            @change="endChange"
          ></el-date-picker>
        </div>
        <el-button
          v-if="$menu.getters.judgeRole('Btn-j5NhSVMm3wQcD9AXfYHL0quZ')"
          :loading="isCommit"
          type="primary"
          round
          @click="generateOwe"
        >
          生成欠费
        </el-button>
      </div>
      <div class="right-wp">
        <div class="header">
          <span class="title">当前选中批次资源</span>
          <el-switch
            v-model="switchVal"
            active-color="#3ebb75"
            inactive-color="#f2f2f2"
          ></el-switch>
          <div class="btn-switch">
            <el-button
              type="info"
              round
              plain
              icon="iconfont iconzu3638"
              @click="processCount()"
            >
              查看欠费状态
            </el-button>
            <el-button
              v-if="$menu.getters.judgeRole('Btn-X5HpnYgI41xfJwQ2aTmNDL07')"
              type="primary"
              round
              plain
              icon="iconfont iconzu3638"
              @click="dialogInit('log')"
            >
              更新记录
            </el-button>
            <el-button
              v-if="$menu.getters.judgeRole('Btn-X5HpnYgI41xfJwQ2aTmNDL07')"
              type="warning"
              round
              plain
              icon="iconfont iconzu3638"
              @click="failDialogInit"
            >
              欠费失败记录
            </el-button>
          </div>
        </div>
        <div class="table-wp" v-show="switchVal">
          <div class="tip" v-if="!batchVal">选择一个欠费批次查看！</div>
          <cus-table
            v-else
            :datas="tableData"
            :cusColums="columns"
            :cusConf="conf"
            :ispaging="true"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></cus-table>
        </div>
        <div :class="['btn-wp', switchVal ? '' : 'hide']">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-ykiH3PoNlr5n4FKWcbe8vLmq')"
            type="success"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="dialogInit('add')"
          >
            新增批次
          </el-button>
          <el-button
            v-if="$menu.getters.judgeRole('Btn-LfErTSYy3VCRWHZdltqvkxjs')"
            type="warning"
            round
            plain
            icon="iconfont iconpici"
            @click="dialogInit('manage')"
          >
            批次管理
          </el-button>
        </div>
      </div>

      <!-- 新增批次弹框 -->
      <el-dialog
        class="addDialog"
        :visible.sync="showAddPop"
        title="新增批次"
        width="60%"
        :close-on-click-modal="false"
      >
        <div class="select-wp">
          <div class="select-item">
            <div class="title">关联项目</div>
            <el-select
              v-model="relatedVillage"
              clearable
              placeholder="请选择关联项目"
              @change="villChange"
            >
              <el-option
                v-for="itm in vilOptions"
                :key="itm.id"
                :label="itm.villagename"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
          <div class="select-item">
            <div class="title">楼栋</div>
            <el-select
              v-model="buildVal"
              clearable
              multiple
              collapse-tags
              placeholder="请选择楼栋"
              @change="buildChange"
            >
              <el-option
                v-for="itm in buildOptions"
                :key="itm.id"
                :label="itm.block"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
          <div class="select-item">
            <div class="title">单元</div>
            <el-select
              v-model="unitVal"
              clearable
              multiple
              collapse-tags
              placeholder="请选择单元"
              @change="getDialogTable"
            >
              <el-option
                v-for="itm in unitOptions"
                :key="itm.id"
                :label="itm.block + '/' + itm.unit"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>

          <div class="line"></div>

          <div class="select-item">
            <div class="title">批次名称</div>
            <el-input
              v-model="batchName"
              placeholder="请输入批次名称"
            ></el-input>
          </div>

          <div class="select-item">
            <div class="title">首次交房时间</div>
            <el-date-picker
              v-model="firstDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </div>
        <div class="table-wp">
          <cus-table
            :datas="dialogTable.tableData"
            :cusColums="dialogTable.columns"
            :cusConf="dialogTable.conf"
            :ispaging="true"
            :check="true"
            @sizeChange="dialogSizeChange"
            @currentChange="dialogCurrentChange"
            @selectionChange="selectionChange"
          ></cus-table>
        </div>
        <!-- dialog footer 部分 -->
        <span slot="footer">
          <el-button
            :disabled="
              !(
                relatedVillage &&
                batchName &&
                firstDate &&
                tableSelected.length > 0
              )
            "
            :loading="isCommit"
            type="primary"
            round
            @click="confirm"
          >
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

      <!-- 批次管理弹框 -->
      <el-dialog
        class="manageDialog"
        :visible.sync="showManagePop"
        title="批次管理"
        width="50%"
        :close-on-click-modal="true"
      >
        <div class="table-wp">
          <cus-table
            :datas="dialogTable.tableData"
            :cusColums="dialogTable.columns"
            :cusConf="dialogTable.conf"
            :ispaging="true"
            @sizeChange="dialogSizeChange"
            @currentChange="dialogCurrentChange"
            @addSource="addSource"
          ></cus-table>
        </div>
      </el-dialog>

      <!-- 更新记录弹框 -->
      <el-dialog
        class="logDialog"
        :visible.sync="showLogPop"
        title="更新记录"
        width="50%"
        :close-on-click-modal="true"
      >
        <div class="table-wp">
          <cus-table
            :datas="dialogTable.tableData"
            :cusColums="dialogTable.columns"
            :cusConf="dialogTable.conf"
            :ispaging="true"
            @sizeChange="dialogSizeChange"
            @currentChange="dialogCurrentChange"
          ></cus-table>
        </div>
      </el-dialog>

      <!-- 添加房源弹框 -->
      <el-dialog
        class="addDialog house"
        :visible.sync="showAddSource"
        title="添加房源"
        width="60%"
        :close-on-click-modal="false"
      >
        <div class="select-wp">
          <div class="select-item">
            <div class="title">关联项目</div>
            <el-select
              v-model="relatedVillage"
              clearable
              disabled
              placeholder="请选择关联项目"
            >
              <el-option
                v-for="itm in vilOptions"
                :key="itm.id"
                :label="itm.villagename"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
          <div class="select-item">
            <div class="title">楼栋</div>
            <el-select
              v-model="buildVal"
              clearable
              multiple
              collapse-tags
              placeholder="请选择楼栋"
              @change="addBuildChange"
            >
              <el-option
                v-for="itm in buildOptions"
                :key="itm.id"
                :label="itm.block"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
          <div class="select-item">
            <div class="title">单元</div>
            <el-select
              v-model="unitVal"
              clearable
              multiple
              collapse-tags
              placeholder="请选择单元"
              @change="getHouseTables"
            >
              <el-option
                v-for="itm in unitOptions"
                :key="itm.id"
                :label="itm.block + '/' + itm.unit"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="table-wp">
          <cus-table
            :datas="addTableData"
            :cusColums="addColumns"
            :cusConf="addConf"
            :ispaging="true"
            :check="true"
            @sizeChange="addSizeChange"
            @currentChange="addCurrentChange"
            @selectionChange="addSelectionChange"
          ></cus-table>
        </div>
        <!-- dialog footer 部分 -->
        <span slot="footer">
          <el-button
            :disabled="addTableSelected.length == 0"
            :loading="isCommit"
            type="primary"
            round
            @click="addSubmit"
          >
            提交保存
          </el-button>
          <el-button
            :loading="isCommit"
            type="info"
            round
            @click="showAddSource = false"
          >
            取消
          </el-button>
        </span>
      </el-dialog>

      <!-- 欠费失败记录弹框 -->
      <el-dialog
        class="failDialog"
        :visible.sync="showFailDialog"
        title="欠费失败记录"
        width="50%"
        :close-on-click-modal="true"
      >
        <div class="table-wp">
          <cus-table
            :datas="failTableData"
            :cusColums="failColumns"
            :cusConf="failConf"
            :ispaging="true"
            @sizeChange="failSizeChange"
            @currentChange="failCurrentChange"
            @addAgain="addAgain"
          ></cus-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="@/assets/setting/js/arrearage.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/arrearage.less');
</style>
