<template>
  <div id="application-manage">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <el-select
            v-model="statusVal"
            clearable
            placeholder="请选择默认状态"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in statusOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <input
            type="text"
            class="common-input"
            placeholder="请输入应用名称"
            v-model="searchVal"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch"
          >
            查询
          </el-button>
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-Rl9zIwyFw6fLHz1Rtz25Tgi1')"
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="addApp"
          >
            新增应用
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
          @showDetail="showDetail"
          @edit="appEdit"
          @imgPreview="imgPreview"
        ></cus-table>
      </div>
    </div>

    <!-- 应用详情弹框部分 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      title="应用详情"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <el-scrollbar style="height: 100%;">
          <cus-table
            :datas="detailTableData"
            :cusColums="detailColumns"
            :cusConf="detailConf"
            @toOpen="toOpen"
            @textChange="textChange"
            @imgPreview="imgPreview"
          ></cus-table>
        </el-scrollbar>
      </div>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          v-if="$menu.getters.judgeRole('Btn-vQi75j121aqU0ijwaQBiQ8p3')"
          :loading="isCommit"
          type="primary"
          round
          @click="detailEdit"
        >
          保存修改
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showDetailDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      :title="dialogTitle"
      width="36%"
      :close-on-click-modal="false"
      @close="editDialogClose"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="应用名称" prop="appName">
            <el-input
              v-model="ruleForm.appName"
              placeholder="请输入应用名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="默认状态" prop="defaultState">
            <el-select
              v-model="ruleForm.defaultState"
              clearable
              placeholder="请选择默认状态"
            >
              <el-option
                v-for="itm in statusList"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否外链" prop="isOutside">
            <el-select
              v-model="ruleForm.isOutside"
              clearable
              placeholder="请选择是否外链"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用appid" prop="appid">
            <el-input
              v-model="ruleForm.appid"
              placeholder="请输入应用appid"
            ></el-input>
          </el-form-item>
          <el-form-item label="应用地址" prop="appAdress">
            <el-input
              v-model="ruleForm.appAdress"
              placeholder="请输入应用地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="应用排序" prop="appSort">
            <el-input
              type="number"
              v-model="ruleForm.appSort"
              placeholder="请输入应用排序"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="file-upload">
          <div class="title">应用图标</div>
          <el-upload
            ref="upload"
            :action="qiniuDatas.domain"
            :limit="1"
            list-type="picture-card"
            :file-list="fileList"
            :http-request="customUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
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

    <!-- 图片预览部分 -->
    <el-image
      ref="preview"
      :src="imgSrc"
      :preview-src-list="imgList"
      :z-index="10000"
    ></el-image>
  </div>
</template>

<script src="@/assets/application/js/applicationManage.js"></script>

<style lang="less">
@import url('~@/assets/application/css/applicationManage.less');
</style>
