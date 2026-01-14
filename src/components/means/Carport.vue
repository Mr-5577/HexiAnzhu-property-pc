<template>
  <div id="carport" v-loading="starting" element-loading-text="车位启用中">
    <!-- 左侧部分 -->
    <div class="left-wp">
      <div class="title">选择启用车位</div>
      <!-- 搜索框部分 -->
      <div class="search-wrap">
        <el-input
          placeholder="请输入项目名或编码"
          suffix-icon="iconfont iconzu3664"
          v-model="filterText"
          class="search"
        ></el-input>
      </div>
      <el-scrollbar style="height: calc(100% - 6.25rem);" v-loading="isLoading">
        <!-- 树形结构部分 -->
        <div class="tree-wrap">
          <el-tree
            lazy
            ref="tree"
            class="filter-tree"
            :data="treeData"
            node-key="nodeid"
            accordion
            show-checkbox
            check-strictly
            :props="defaultProps"
            :filter-node-method="filterNode"
            :load="loadNode"
            @node-click="nodeClick"
            @check="nodeCheck"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <i class="iconfont icondaqu" v-if="node.data.type == 'city'"></i>
              <i
                class="iconfont iconxiangmu"
                v-if="node.data.type == 'village'"
              ></i>
              <i class="iconfont iconcheku" v-if="node.data.type == 'type'"></i>
              <span class="label">{{ node.label }}</span>
              <span v-if="node.loading">
                <i
                  class="el-icon-loading"
                  style="color: #ccc;margin-right: 0.25rem;vertical-align: middle;font-size: 0.7rem;position: relative; z-index: 100;"
                ></i>
                <span style="font-size: 0.6rem;color: #ccc;">正在加载</span>
              </span>
            </span>
          </el-tree>
        </div>
      </el-scrollbar>
    </div>
    <!-- 右边部分 -->
    <div class="right-wp" v-loading="infoLoading">
      <div class="empty" v-if="!currentCarport || infoLoading">
        请在左侧选择具体车位！
      </div>
      <div class="right-main" v-else>
        <div class="top-wp">
          <div class="title">
            <i class="iconfont iconcheku"></i>
            <span>车位启用</span>
          </div>
          <ul class="info-wp">
            <li v-for="(item, index) in carportInfo" :key="index">
              <span class="name">{{ item.name }}</span>
              <span class="value">{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="bottom-wp">
          <el-scrollbar style="height: 100%">
            <user-bind :vid="cvid" @userSelected="userSelected"></user-bind>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              :hide-required-asterisk="true"
            >
              <el-form-item label="客户姓名" prop="uname">
                <el-input
                  v-model="ruleForm.uname"
                  placeholder="请输入客户姓名"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="身份证号码" prop="idcard">
                <el-input
                  v-model="ruleForm.idcard"
                  placeholder="请输入身份证号码"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="客户类型" prop="utype">
                <el-input
                  v-model="ruleForm.utype"
                  placeholder="请输入客户类型"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="使用方式" prop="method">
                <el-input
                  v-model="ruleForm.method"
                  placeholder="请输入使用方式"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="utel">
                <el-input
                  v-model="ruleForm.utel"
                  placeholder="请输入联系电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="启用日期" prop="stime">
                <el-date-picker
                  v-model="ruleForm.stime"
                  type="date"
                  align="center"
                  value-format="timestamp"
                  placeholder="请选择启用日期"
                ></el-date-picker>
              </el-form-item>

              <!-- 上传附件部分 -->
              <el-form-item
                class="file-upload"
                label="上传合同文件"
                prop="fileInfo"
              >
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
                <el-dialog :visible.sync="dialogVisible" top="5vh">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </el-form-item>
              <div class="title">绑定车牌</div>
              <ul class="info-wp">
                <li v-for="(item, index) in ruleForm.plateInfo" :key="index">
                  <el-form-item
                    label="车牌号"
                    :prop="'plateInfo.' + index + '.plates'"
                    :rules="{
                      required: true,
                      message: '请输入车牌号',
                      trigger: 'blur'
                    }"
                  >
                    <el-input
                      v-model="item.plates"
                      placeholder="请输入车牌号"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="车主姓名"
                    :prop="'plateInfo.' + index + '.name'"
                    :rules="{
                      required: true,
                      message: '请输入车主姓名',
                      trigger: 'blur'
                    }"
                  >
                    <el-input
                      v-model="item.name"
                      placeholder="请输入车主姓名"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="联系电话"
                    :prop="'plateInfo.' + index + '.tel'"
                    :rules="{
                      required: true,
                      message: '请输入联系电话',
                      trigger: 'blur'
                    }"
                  >
                    <el-input
                      v-model="item.tel"
                      placeholder="请输入联系电话"
                    ></el-input>
                  </el-form-item>
                  <div class="info-item" v-if="ruleForm.plateInfo.length > 1">
                    <div class="name"></div>
                    <i
                      class="el-icon-delete-solid"
                      @click="deletePlate(index)"
                    ></i>
                  </div>
                </li>
                <li class="ico-wp">
                  <div class="info-item">
                    <i class="iconfont iconxinzeng" @click="addPlate"></i>
                  </div>
                </li>
              </ul>
            </el-form>
            <div class="btn-wp">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-yDhyCBkmkyzD0xSdyNLKYfME')"
                type="primary"
                round
                @click="useConfirm"
              >
                确认启用
              </el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="@/assets/means/js/carport.js"></script>

<style lang="less">
@import url('~@/assets/means/css/carport.less');
</style>
