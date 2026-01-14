<template>
  <div id="online-detail">
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
            @click="keySearch(true)"
          >
            查询
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
          @edit="appEdit"
          @imgPreview="imgPreview"
        ></cus-table>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 编辑弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      title="编辑应用"
      width="36%"
      :close-on-click-modal="false"
      @close="editDialogClose"
    >
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
            readonly
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
        <el-form-item label="应用地址" prop="appAdress">
          <el-input
            v-model="ruleForm.appAdress"
            placeholder="请输入应用地址"
            readonly
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

<script src="@/assets/application/js/onlineDetail.js"></script>

<style lang="less">
@import url('~@/assets/application/css/onlineDetail.less');
</style>
