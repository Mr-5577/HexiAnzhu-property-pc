<template>
  <div id="other">
    <div class="main-wp">
      <el-scrollbar style="height: 100%;">
        <div class="main-ctn">
          <div class="title">临时收费</div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="付款对象" prop="uname">
              <el-input
                v-model="ruleForm.uname"
                placeholder="请输入付款对象"
              ></el-input>
            </el-form-item>
            <el-form-item label="收费事项" prop="matter">
              <el-input
                v-model="ruleForm.matter"
                placeholder="请输入收费事项"
              ></el-input>
            </el-form-item>
            <el-form-item label="收费类型" prop="type">
              <el-select
                v-model="ruleForm.type"
                placeholder="请选择收费类型"
                clearable
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收费金额" prop="money">
              <el-input
                type="number"
                v-model="ruleForm.money"
                placeholder="请输入收费金额"
              ></el-input>
            </el-form-item>
            <el-form-item label="收费方式" prop="method">
              <el-select
                v-model="ruleForm.method"
                placeholder="请选择收费方式"
                clearable
              >
                <el-option
                  v-for="item in methodOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="收费时间" prop="time">
              <el-date-picker
                v-model="ruleForm.time"
                :disabled="dateRead"
                type="datetime"
                align="center"
                value-format="timestamp"
                placeholder="请选择收费时间"
              ></el-date-picker>
            </el-form-item>

            <!-- 上传附件部分 -->
            <el-form-item
              v-if="ruleForm.method == freeId"
              class="remark-wp"
              label="上传附件"
              prop="fileInfo"
              style="margin-top: 1.5rem;"
            >
              <el-upload
                ref="upload"
                :action="qiniuDatas.domain"
                :http-request="customUpload"
                :on-remove="handleRemove"
                v-if="qiniuDatas.domain"
              >
                <el-button
                  type="primary"
                  style="width: 5rem;position: absolute;top: 0;left: 6rem;"
                >
                  点击上传
                </el-button>
              </el-upload>
            </el-form-item>

            <el-form-item class="remark-wp" label="备注信息" prop="remark">
              <el-input
                type="textarea"
                v-model="ruleForm.remark"
                resize="none"
                :rows="4"
                placeholder="请输入备注信息"
              ></el-input>
            </el-form-item>
            <el-checkbox v-model="ruleForm.isreceipt">生成发票</el-checkbox>
          </el-form>

          <div class="btn-wp">
            <el-button
              v-if="$menu.getters.judgeRole('Btn-e9Q9SZZyarsFtI6PKzLz3soC')"
              :loading="isCommit"
              type="primary"
              round
              @click="formSubmit"
            >
              确认收费
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script src="@/assets/charge/js/other.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/other.less');
</style>
