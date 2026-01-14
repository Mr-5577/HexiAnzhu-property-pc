<template>
  <div
    id="hydropower"
    v-loading="uploading || commiting"
    :element-loading-text="
      uploading
        ? '正在导入数据'
        : commiting
        ? '数据提交中，请稍等'
        : '数据加载中'
    "
  >
    <!-- 下载模板 -->
    <a :href="aurl" target="_blank" ref="adom" style="display: none;"></a>
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
          </span>
          <el-date-picker
            v-model="dateVal"
            type="date"
            :clearable="false"
            :editable="false"
            align="center"
            value-format="timestamp"
            placeholder="请选择抄表日期"
          ></el-date-picker>
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="tableLoad"
          >
            查询
          </el-button>
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-7kQxYQRWP5Dfj1zrTpZOlUzX')"
            type="primary"
            plain
            round
            icon="iconfont iconxiugai"
            @click="enterHandle"
          >
            初始录入
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
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="resourceVal"
          placeholder="请选择资源类型"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in resourceOptions"
            :key="itm.type"
            :label="itm.name"
            :value="itm.type"
          ></el-option>
        </el-select>
        <el-select
          v-model="buildVal"
          clearable
          placeholder="请选择楼栋"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in buildOptions"
            :key="itm.id"
            :label="itm.block"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-input
          v-model="keywords"
          placeholder="输入姓名/房号/车牌号或车位"
          @change="tableLoad"
        ></el-input>
        <div class="btn-wp">
          <el-upload
            ref="upload"
            action="/charge/importwaterbyexcel"
            :limit="1"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="customUpload"
            accept=".xls,.xlsx"
            :disabled="!dateVal"
            v-if="$menu.getters.judgeRole('Btn-jeWfh3BU6iUEooViPnc83fq2')"
          >
            <el-button type="primary" round>批量导入</el-button>
          </el-upload>

          <el-button
            v-if="$menu.getters.judgeRole('Btn-0OLB4Mh6HteARORP8cNGgZZO')"
            type="primary empty"
            round
            @click="downloadTemp"
          >
            下载模板
          </el-button>
        </div>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="$menu.getters.judgeRole('Btn-eq62SfOVcLO1mcxiFQ5Lfbfs')"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @checkRecord="checkRecord"
          @edit="sourceEdit"
          @textChange="textChange"
          @nameChange="nameChange"
          @commit="degCommit"
          @selectionChange="selectionChange"
        ></cus-table>
        <div class="btn-wp">
          <el-button
            type="primary empty"
            round
            :disabled="tableSelected.length === 0"
            @click="batchCommit"
            v-if="$menu.getters.judgeRole('Btn-eq62SfOVcLO1mcxiFQ5Lfbfs')"
          >
            批量提交已选({{ tableSelected.length }})
          </el-button>
        </div>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
    <!-- 选择项目 -->

    <!-- 初始度数录入弹框 -->
    <el-dialog
      class="enterDialog"
      :visible.sync="showEnterDialog"
      title="初始度数录入"
      width="38%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="search-wp">
          <!-- 搜索部分 -->
          <el-autocomplete
            ref="searchInput"
            class="hy-search"
            popper-class="my-autocomplete"
            v-model="autoValue"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入业主姓名/手机号/房号/车牌号或车位"
            @select="handleSelect"
          >
            <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="tr-item">
                <span class="td-item">{{ item.username }}</span>
                <span class="td-item">{{ item.tel }}</span>
                <span class="td-item">{{ item.title }}</span>
              </div>
              <div class="load-more" v-if="allUserList.length <= 1">
                暂无数据！
              </div>
            </template>
          </el-autocomplete>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="资源名称" prop="resourceName">
            <el-input
              v-model="ruleForm.resourceName"
              :readonly="true"
              placeholder="请输入资源名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户姓名" prop="uname">
            <el-input
              v-model="ruleForm.uname"
              :readonly="true"
              placeholder="请输入客户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="resourceType">
            <el-select
              v-model="ruleForm.resourceType"
              placeholder="请选择资源类型"
              clearable
              @change="typeChange"
            >
              <el-option
                v-for="item in resourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="三表名称" prop="threeName">
            <el-input
              v-model="ruleForm.threeName"
              placeholder="请输入三表名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="倍率" prop="rate">
            <el-input
              :min="1"
              type="number"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model.number="ruleForm.rate"
              placeholder="请输入倍率"
            ></el-input>
          </el-form-item>
          <el-form-item label="缴费科目" prop="subject">
            <el-select
              v-model="ruleForm.subject"
              clearable
              multiple
              collapse-tags
              placeholder="请选择缴费科目"
            >
              <el-option
                v-for="item in subOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始读数" prop="number">
            <el-input
              v-model="ruleForm.number"
              placeholder="请输入起始读数"
            ></el-input>
          </el-form-item>
          <el-form-item label="抄表日期" prop="readTime">
            <el-date-picker
              v-model="ruleForm.readTime"
              type="date"
              align="center"
              value-format="timestamp"
              placeholder="请选择抄表日期"
            ></el-date-picker>
          </el-form-item>
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
          @click="showEnterDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      title="编辑三表信息"
      width="32%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="editForm"
          :rules="editRules"
          ref="editForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="三表名称" prop="threeName">
            <el-input
              v-model="editForm.threeName"
              placeholder="请输入三表名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="倍率" prop="rate">
            <el-input
              :min="1"
              type="number"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model.number="editForm.rate"
              placeholder="请输入倍率"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="editSubmit">
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

    <!-- 水电使用记录弹框 -->
    <el-dialog
      class="recordDialog"
      :visible.sync="showRecordDialog"
      title="水电使用记录"
      width="80%"
      :close-on-click-modal="true"
    >
      <div class="filter-wp">
        <el-date-picker
          v-model="startTime"
          type="month"
          :picker-options="spickerOptions"
          placeholder="开始月份"
          value-format="yyyy-MM"
          @change="popTableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="month"
          :picker-options="epickerOptions"
          placeholder="结束月份"
          value-format="yyyy-MM"
          @change="popTableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="popTableData"
          :cusColums="popColumns"
          :cusConf="popConf"
          :ispaging="true"
          @sizeChange="popSizeChange"
          @currentChange="popCurrentChange"
          @delRecord="delRecord"
        ></cus-table>
        <el-button
          type="primary"
          plain
          round
          icon="iconfont iconzu3638"
          @click="recordLogHandle"
        >
          变更日志
        </el-button>
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

<script src="@/assets/charge/js/hydropower.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/hydropower.less');
</style>
