<template>
  <div id="activityManagement">
    <div class="main-wp">
      <div class="title">活动管理列表</div>
      <el-button
        v-if="$menu.getters.judgeRole('Btn-Ebwpz7tsvyBdvNwfaeZ7Bozd')"
        class="addbtn"
        type="primary"
        round
        plain
        icon="iconfont iconxinzeng"
        @click="addInvoice"
      >
        新增活动
      </el-button>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @edit="editEvent"
          @delete="deleteEvent"
          @release="releaseEvent"
        ></cus-table>
      </div>
    </div>

    <!-- 弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      :title="type == 'edit' ? '编辑活动' : '新增活动'"
      width="40%"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-scrollbar style="height: 100%">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="小区" prop="vid">
            <el-select
              v-model="ruleForm.vid"
              clearable
              placeholder="请选择小区"
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
          <el-form-item label="活动标题" prop="title">
            <el-input
              v-model="ruleForm.title"
              placeholder="请输入活动标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动类型" prop="class_id">
            <el-select
              v-model="ruleForm.class_id"
              clearable
              placeholder="请选择活动类型"
            >
              <el-option
                v-for="itm in activityTypeList"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="链接" prop="link_url">
            <el-input
              v-model="ruleForm.link_url"
              placeholder="若录入链接,发布后将使用链接内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="开始有效期" prop="begin_time">
            <el-date-picker
              style="width: 100%"
              v-model="ruleForm.begin_time"
              type="datetime"
              placeholder="请选择开始有效期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束有效期" prop="end_time">
            <el-date-picker
              style="width: 100%"
              v-model="ruleForm.end_time"
              type="datetime"
              placeholder="请选择结束有效期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="是否启用" prop="is_enable" v-if="showEnableSwitch">
            <el-switch
              v-model="ruleForm.is_enable"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item :class="{'popup-from': !showEnableSwitch}" label="是否弹窗" prop="is_popup">
            <el-switch
              v-model="ruleForm.is_popup"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item
            class="coverImage"
            label="封面图片(建议比例3:2)"
            prop="coverFileList"
          >
            <el-upload
              ref="coverImageUpload"
              :action="qiniuDatas ? qiniuDatas.domain : ''"
              :limit="1"
              list-type="picture-card"
              :file-list="coverFileList"
              :http-request="customUploadCoverImg"
              :on-preview="handlePictureCardPreview"
              :on-remove="removeCoverImage"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item
            class="adImage"
            label="弹框图片(建议比例3:4)"
            prop="adFileList"
          >
            <el-upload
              ref="adImageUpload"
              :action="qiniuDatas ? qiniuDatas.domain : ''"
              :limit="1"
              list-type="picture-card"
              :file-list="adFileList"
              :http-request="customUploadAdImg"
              :on-preview="handlePictureCardPreview"
              :on-remove="removeAdImage"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item class="content" label="活动内容" prop="content">
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

    <!-- 图片预览部分 -->
    <el-image
      ref="preview"
      :src="imgSrc"
      :preview-src-list="imgList"
      :z-index="10000"
    ></el-image>
  </div>
</template>

<script src="@/assets/custom/js/activityManagement.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/activityManagement.less');
</style>
