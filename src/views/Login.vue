<template>
  <div id="login" class="login-main">
    <div class="login-body">
      <div class="login-logo"></div>
      <div class="change-box" @click="changeBox">
        <div class="change-text">{{changeBoxData.title}}</div>
        <img :src="changeBoxData.img" />
      </div>
      <template v-if="changeType == 'phone'">
        <div class="login-title">四川和喜物业信息管理系统</div>
        <el-form :model="accForm" :rules="rules" ref="accForm" class="login-form">
          <el-form-item prop="account_name" class="login-item">
            <el-input
              type="text"
              placeholder="请输入用户名或手机号"
              v-model="accForm.account_name"
              @keydown.native="keyDown($event)"
            ></el-input>
            <i class="fa fa-user"></i>
            <hr />
          </el-form-item>
          <el-form-item prop="account_pass" class="login-item">
            <el-input
              type="password"
              placeholder="请输入登录密码"
              v-model="accForm.account_pass"
              @keydown.native="keyDown($event)"
            ></el-input>
            <i class="fa fa-lock"></i>
            <hr />
          </el-form-item>
          <div class="login-btn-item">
            <div class="login-btn">
              <el-button
                type="primary"
                :loading="isSubmitLoading"
                @click="openCaptcha()"
              >
                {{ isSubmitLoading === true ? '登录中,请稍等...' : '登录' }}
              </el-button>
            </div>
          </div>
        </el-form>
      </template>
      
      <div v-else class="code-login">
        <div class="code-login-title">四川和喜物业信息管理系统</div>
        <div class="code-container">
          <div id="codeImg"></div>
        </div>
      </div>

      <div class="tip">
        <div>Copyright 四川和喜物业服务有限公司 </div>
        <div>
          云驰物业业务管理系统 V1.0
          <a href="http://beian.miit.gov.cn" target="_blank">
            蜀ICP备18023330号-1
          </a>
        </div>
        <div>开发者：成都云驰科技有限公司 028-83166986</div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import url('~@/assets/login/css/index.less');
</style>

<script src="@/assets/login/js/index.js"></script>
