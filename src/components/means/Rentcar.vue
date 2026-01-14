<template>
  <div id="rentcar">
    <!-- 预选择页面 -->
    <div class="pre-selection" v-show="!isRegister">
      <area-village-select
        title="月租车登记"
        @registerPass="registerPass"
      ></area-village-select>
    </div>
    <div
      class="loading"
      v-loading="isLoading"
      v-if="isRegister && isLoading"
    ></div>
    <div class="main-wp" v-if="isRegister && !isLoading">
      <!-- 重新查询按钮部分 -->
      <el-button
        icon="el-icon-search"
        class="query"
        @click="isRegister = false"
      >
        重新查询
      </el-button>
      <!-- 左侧部分 -->
      <div class="left-wp">
        <div class="title">月租车登记</div>
        <div class="empty" v-if="!typeList || typeList.length == 0">
          暂无数据！
        </div>
        <el-scrollbar style="height: calc(100% - 4.5rem);" v-else>
          <ul class="type-list">
            <li
              :class="['type-item', item.active ? 'active' : '']"
              v-for="(item, index) in typeList"
              :key="index"
              @click="typeClick(item)"
            >
              <i class="el-icon-caret-right" v-show="item.active"></i>
              <div class="name">{{ item.resourcestype.name }}</div>
              <span class="num-wp">
                <div class="num">{{ item.num }}</div>
                <div class="text">总计车位(个)</div>
              </span>
              <span class="num-wp">
                <div class="num">{{ item.surplus_num }}</div>
                <div class="text">剩余车位(个)</div>
              </span>
            </li>
            <!-- <li>
              <div class="number-wp">
                <div class="num-item">
                  <div class="num">{{ typeList.num }}</div>
                  <div class="explain">总计车位(个)</div>
                </div>
              </div>
            </li>
            <li>
              <div class="number-wp">
                <div class="num-item">
                  <div class="num">
                    {{ typeList.num - typeList.carmonth_num }}
                  </div>
                  <div class="explain">剩余车位(个)</div>
                </div>
              </div>
            </li> -->
          </ul>
        </el-scrollbar>
      </div>
      <!-- 右边部分 -->
      <div class="right-wp">
        <el-scrollbar style="height: 100%;">
          <div v-if="typeList.length === 0" class="empty">
            请在左侧选择月租车位类型
          </div>
          <div v-else>
            <user-bind :vid="vid" @userSelected="userSelected"></user-bind>
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
              <el-form-item label="收费科目" prop="subject">
                <el-select
                  v-model="ruleForm.subject"
                  clearable
                  multiple
                  collapse-tags
                  placeholder="请选择收费科目"
                >
                  <el-option
                    v-for="itm in subOptions"
                    :key="itm.id"
                    :label="itm.name"
                    :value="itm.id"
                  ></el-option>
                </el-select>
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
              <div class="title">绑定车牌</div>
              <ul class="info-wp">
                <li v-for="(item, index) in ruleForm.plateInfo" :key="index">
                  <i
                    class="del el-icon-circle-close"
                    v-if="ruleForm.plateInfo.length > 1"
                    @click="delPlate(index)"
                  ></i>
                  <el-form-item
                    :label="'车牌号' + (index + 1)"
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
                </li>
                <li class="ico-wp">
                  <div class="info-item">
                    <i class="iconfont iconxinzeng" @click="addPlate"></i>
                  </div>
                </li>
              </ul>
              <el-form-item class="remark" label="备注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="ruleForm.remark"
                  resize="none"
                  :rows="3"
                  placeholder="请输入备注信息"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="btn-wp">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-JXSZOSKbENpn0gaVbwxS0mfW')"
                :loading="isCommit"
                type="primary"
                round
                @click="registerConfirm"
              >
                确认登记
              </el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script src="@/assets/means/js/rentcar.js"></script>

<style lang="less">
@import url('~@/assets/means/css/rentcar.less');
</style>
