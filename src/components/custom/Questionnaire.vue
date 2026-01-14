<template>
  <div id="questionnaire">
    <div class="main-wp">
      <div class="title">问卷调查模板</div>
      <el-button
        v-if="$menu.getters.judgeRole('Btn-ROzxMU6stCmEau9HVoQBFekq')"
        class="addbtn"
        type="primary"
        round
        plain
        icon="iconfont iconxinzeng"
        @click="addTemplate"
      >
        新建模板
      </el-button>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @examine="examine"
        ></cus-table>
      </div>
    </div>

    <!-- 新增模板弹框部分 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      title="新增问卷模板"
      width="80%"
      :close-on-click-modal="false"
      @close="addDialogClose"
    >
      <div class="dialog-wp">
        <div class="left-wp">
          <el-scrollbar style="height: 100%;">
            <div class="content">
              <el-input
                v-model="tempTitle"
                placeholder="请输入问卷模板标题"
              ></el-input>
              <div class="upload-wp">
                <el-upload
                  ref="upload"
                  :action="qiniuDatas.domain"
                  list-type="picture-card"
                  :http-request="customUpload"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <span>(顶部banner-建议尺寸702*320)</span>
              </div>
              <el-input
                type="textarea"
                v-model="tempRemark"
                resize="none"
                :rows="8"
                placeholder="请输入问卷前言"
              ></el-input>
              <el-input
                type="textarea"
                v-model="overRemark"
                resize="none"
                :rows="4"
                placeholder="请输入结束语"
                style="margin-top: 0;"
              ></el-input>
              <ul>
                <li v-for="(item, index) in topicSelects" :key="index">
                  <div class="name">
                    {{ item.name }}
                  </div>
                  <!-- 单选组 -->
                  <el-radio-group v-if="item.type == 1">
                    <el-radio
                      v-for="(itm, i) in item.problemAnswer"
                      :key="i"
                      :label="itm.label"
                    >
                      {{ itm.label }}
                    </el-radio>
                  </el-radio-group>
                  <!-- 单选组 -->
                  <!-- 多选组 -->
                  <el-checkbox-group disabled v-if="item.type == 2">
                    <el-checkbox
                      v-for="(itm, i) in item.problemAnswer"
                      :key="i"
                      :label="itm.label"
                    ></el-checkbox>
                  </el-checkbox-group>
                  <!-- 多选组 -->
                  <span class="del" @click="topicDel(index)">删除</span>
                </li>
                <li
                  v-if="$menu.getters.judgeRole('Btn-cjfqtUXNBvEmKHpInSZJQdux')"
                  class="add"
                  @click="questAdd"
                >
                  <i class="iconfont iconxinzeng"></i>
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </div>
        <div class="right-wp" v-loading="topicLoading">
          <div class="title">问题库</div>
          <el-scrollbar style="height: calc(100% - 4.5rem);">
            <div class="content">
              <div class="empty" v-if="topicList.length == 0">暂无数据！</div>
              <ul v-else>
                <li v-for="(item, index) in topicList" :key="index">
                  <div class="name">
                    <span class="type">
                      {{
                        item.type == 1
                          ? '单选题'
                          : item.type == 2
                          ? '多选题'
                          : '问答题'
                      }}
                    </span>
                    |
                    <span class="text">
                      {{ item.name }}
                    </span>
                  </div>
                  <!-- 单选组 -->
                  <el-radio-group v-if="item.type == 1">
                    <el-radio
                      v-for="(itm, i) in item.problemAnswer"
                      :key="i"
                      :label="itm.key"
                    >
                      {{ itm.label }}
                    </el-radio>
                  </el-radio-group>
                  <!-- 单选组 -->
                  <!-- 多选组 -->
                  <el-checkbox-group disabled v-if="item.type == 2">
                    <el-checkbox
                      v-for="(itm, i) in item.problemAnswer"
                      :key="i"
                      :label="itm.label"
                    ></el-checkbox>
                  </el-checkbox-group>
                  <!-- 多选组 -->
                  <span
                    class="add-ico"
                    v-if="showAdd(item)"
                    @click="topicAdd(item)"
                  >
                    <i class="iconfont iconxinzeng"></i>
                  </span>
                </li>
              </ul>
            </div>
          </el-scrollbar>
          <el-pagination
            @size-change="topicSizeChange"
            @current-change="topicCurrentChange"
            :current-page="topicCurrentPage"
            :page-sizes="[20, 50, 100, 300]"
            :page-size="topicPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="topicTotal"
          ></el-pagination>
        </div>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="tempSubmit">
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

    <!-- 新增问题部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      title="新增问题"
      width="50%"
      :close-on-click-modal="false"
      @close="showEditDialog = false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="问题类型" prop="type">
            <el-select
              v-model="ruleForm.type"
              clearable
              placeholder="请选择问题类型"
            >
              <el-option label="单选" :value="1"></el-option>
              <el-option label="多选" :value="2"></el-option>
              <el-option label="问答题" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="content" label="问题内容" prop="content">
            <el-input
              v-model="ruleForm.content"
              placeholder="请输入问题内容"
            ></el-input>
          </el-form-item>
          <div class="check-wp" v-if="ruleForm.type == 1 || ruleForm.type == 2">
            <div class="title">问题选项设置</div>
            <el-form-item
              v-for="(item, index) in ruleForm.options"
              :key="index"
              :label="`选项${index + 1}`"
              :prop="'options.' + index + '.value'"
              :rules="{
                required: true,
                message: '请输入选项名称',
                trigger: 'blur'
              }"
            >
              <el-input
                v-model="item.value"
                placeholder="请输入选项名称"
              ></el-input>
              <i
                v-if="ruleForm.options.length > 2"
                class="del el-icon-circle-close"
                @click="delOption(index)"
              ></i>
            </el-form-item>
            <el-form-item class="add" label=" ">
              <span class="add-ico" @click="addOption">
                <i class="iconfont iconxinzeng"></i>
              </span>
            </el-form-item>
          </div>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isTopicCommit"
          type="primary"
          round
          @click="topicSubmit"
        >
          确认新增
        </el-button>
        <el-button
          :loading="isTopicCommit"
          type="info"
          round
          @click="showEditDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 数据统计弹框部分 -->
    <el-dialog
      class="statDialog"
      :visible.sync="showStatDialog"
      title="问卷模板数据分析"
      width="80%"
      :close-on-click-modal="false"
      @close="showStatDialog = false"
    >
      <div class="dialog-wp">
        <div class="left-wp">
          <el-scrollbar style="height: 100%;">
            <div class="content">
              <div class="title">问卷评分汇总</div>
              <div class="table-wp">
                <cus-table
                  :datas="questTableData"
                  :cusColums="questColumns"
                  :cusConf="questConf"
                  :ispaging="false"
                ></cus-table>
              </div>
              <div class="select-title">
                <div class="title">项目评分汇总</div>
                <el-cascader
                  v-model="villageVal"
                  :options="villageOptions"
                  :props="{ multiple: true }"
                  collapse-tags
                  :show-all-levels="false"
                  @change="villageChange"
                ></el-cascader>
              </div>
              <div class="table-wp">
                <cus-table
                  :datas="proTableData"
                  :cusColums="proColumns"
                  :cusConf="proConf"
                  :ispaging="false"
                ></cus-table>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="right-wp">
          <div class="title">参与用户汇总</div>
          <div class="table-wp">
            <cus-table
              :datas="userTableData"
              :cusColums="userColumns"
              :cusConf="userConf"
              :ispaging="true"
              @sizeChange="userSizeChange"
              @currentChange="userCurrentChange"
              @examine="userExamine"
            ></cus-table>
          </div>
        </div>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="exportData">
          导出数据
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showStatDialog = false"
        >
          返回
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

<script src="@/assets/custom/js/questionnaire.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/questionnaire.less');
</style>
