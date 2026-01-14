<template>
  <div id="sms-push">
    <!-- <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
          </span>
        </div>
      </div>
    </div> -->
    <div class="main-wp">
      <div class="select-wp">
        <el-date-picker
          v-model="startTime"
          type="date"
          :picker-options="spickerOptions"
          placeholder="请选择开始日期"
          value-format="timestamp"
          @change="tableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="epickerOptions"
          placeholder="请选择截止日期"
          value-format="timestamp"
          @change="tableLoad"
        ></el-date-picker>
      </div>
      <el-button
        v-if="$menu.getters.judgeRole('Btn-C4oF3MWPAh9ISbCtWPyuSq9h')"
        class="addbtn"
        type="primary"
        round
        plain
        icon="iconfont iconxinzeng"
        @click="addPush"
      >
        新增推送
      </el-button>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @detail="tableDetail"
        ></cus-table>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 新增推送弹框部分 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      title="新增推送"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="dialog-wp">
        <div class="left-wp">
          <el-scrollbar style="height: 100%">
            <div class="left-main">
              <el-select
                v-model="tempVal"
                clearable
                filterable
                placeholder="请选择推送模板"
                @change="tempChange"
              >
                <el-option
                  v-for="itm in tempOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
              <el-input
                type="textarea"
                v-model="currentTemp.content"
                resize="none"
                :rows="12"
                readonly
                placeholder="请输入推送备注说明"
              ></el-input>
              <el-input
                type="textarea"
                v-model="pushRemark"
                resize="none"
                :rows="4"
                placeholder="请输入推送备注说明"
              ></el-input>
              <el-select
                v-model="pushVillages"
                clearable
                multiple
                collapse-tags
                @change="villageChange"
                placeholder="请选择推送项目"
                style="margin-top: 1rem"
              >
                <el-option
                  v-for="itm in villageOptions"
                  :key="itm.id"
                  :label="itm.villagename"
                  :value="itm.id"
                ></el-option>
              </el-select>
              <ul class="selects" v-if="selectedVillages.length > 0">
                <li
                  :class="[itm.active ? 'active' : '']"
                  v-for="(itm, index) in selectedVillages"
                  :key="index"
                  @click="villageClick(itm)"
                >
                  <span>{{ itm.villagename }}</span>
                  <span class="select-num">
                    <span>已选{{ itm.selects ? itm.selects.length : 0 }}</span>
                    <i class="el-icon-caret-right"></i>
                  </span>
                </li>
              </ul>
              <div class="tip">
                本次推送预计使用
                <span class="num">{{ sendNumber }}</span>
                条短信，单条计费
                <span class="num">
                  {{ tempContent.price ? tempContent.price : 0 }}
                </span>
                元，合计
                <span class="num">{{ sendTotal }}</span>
                元
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="right-wp">
          <div class="select-wp">
            <el-select
              v-model="buildVal"
              multiple
              clearable
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
            <el-select
              v-model="unitVal"
              multiple
              clearable
              collapse-tags
              placeholder="请选择单元"
              @change="ownerTableLoad"
            >
              <el-option
                v-for="itm in unitOptions"
                :key="itm.id"
                :label="itm.block + '/' + itm.unit"
                :value="itm.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="statusVal"
              clearable
              placeholder="请选择交房状态"
              @change="ownerTableLoad"
            >
              <el-option label="未交房" :value="1"></el-option>
              <el-option label="已交房" :value="2"></el-option>
            </el-select>
            <el-select
              v-model="typeVal"
              clearable
              placeholder="请选择客户类型"
              @change="typeChange"
            >
              <el-option
                v-for="itm in typeOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </div>
          <div
            class="table-wp"
            v-loading="ownerConf.loadStatus"
            element-loading-text="数据获取中..."
          >
            <!-- <cus-table
              :datas="ownerTableData"
              :cusColums="ownerColumns"
              :cusConf="ownerConf"
              :ispaging="false"
              :check="true"
            ></cus-table> -->
            <vxe-table
              border
              v-if="!ownerConf.loadStatus"
              ref="xTable1"
              height="100%"
              show-overflow
              highlight-hover-row
              :sort-config="{ trigger: 'cell' }"
              row-id="roomid"
              :checkbox-config="{
                checkRowKeys: defaultSelecteRows
              }"
              :empty-text="
                ownerConf.emptyText ? ownerConf.emptyText : '暂无数据'
              "
              :data="ownerTableData"
              @checkbox-all="selectAllEvent"
              @checkbox-change="selectChangeEvent"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="block" title="楼栋"></vxe-column>
              <vxe-column field="roomnum" title="房号"></vxe-column>
              <vxe-column field="realname" title="姓名"></vxe-column>
              <vxe-column field="tel" title="电话"></vxe-column>
              <vxe-column field="check_text" title="交房"></vxe-column>
              <vxe-column field="isdecorate_text" title="装修"></vxe-column>
              <vxe-column field="type_name" title="类型"></vxe-column>
            </vxe-table>
          </div>
        </div>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="pushSubmit">
          确认提交
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

    <!-- 短信发送记录弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="短信发送记录"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="select-wp">
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择发送状态"
          @change="recordTableLoad"
        >
          <el-option label="成功" :value="1"></el-option>
          <el-option label="失败" :value="2"></el-option>
        </el-select>
        <el-input
          v-model="keywords"
          placeholder="请输入关键字查询"
          @change="recordTableLoad"
        ></el-input>
        <!-- <span class="export" @click="exportRecordData">
          <workIcon
            name="export"
            class="common-right-icon"
            title="导出"
          ></workIcon>
        </span> -->
      </div>
      <div class="table-wp">
        <cus-table
          :datas="recordTableData"
          :cusColums="recordColumns"
          :cusConf="recordConf"
          :ispaging="true"
          :check="true"
          @sizeChange="recordSizeChange"
          @currentChange="recordCurrentChange"
          @selectionChange="recordSelectionChange"
          @send="sendAgain"
        ></cus-table>
        <el-button
          class="batch"
          v-if="$menu.getters.judgeRole('Btn-5s6CdGxjaXPBLknyrwsKmxDO')"
          :disabled="recordSelects.length === 0"
          type="primary empty"
          round
          @click="batchSendAgain"
        >
          批量重新发送({{ recordSelects.length }})条
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/assets/custom/js/smsPush.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/smsPush.less');
</style>
