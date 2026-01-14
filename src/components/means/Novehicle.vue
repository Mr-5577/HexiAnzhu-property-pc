<template>
  <div id="novehicle">
    <!-- 预选择页面 -->
    <div class="pre-selection" v-show="!isRegister">
      <area-village-select
        title="非机动车登记"
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
        <div class="title">非机动车登记</div>
        <el-scrollbar style="height: calc(100% - 4.5rem);">
          <ul class="type-list">
            <li>
              <div class="number-wp">
                <div class="num-item">
                  <div class="num">{{ nomotorNum }}</div>
                  <div class="explain">已登记非机动车(辆)</div>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <!-- 右边部分 -->
      <div class="right-wp">
        <el-scrollbar style="height: 100%;">
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
            <el-form-item label="联系电话" prop="utel">
              <el-input
                v-model="ruleForm.utel"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
            <el-form-item label="车牌号" prop="plate">
              <el-input
                v-model="ruleForm.plate"
                placeholder="请输入车牌号"
              ></el-input>
            </el-form-item>
            <el-form-item label="车辆类型" prop="ctype">
              <el-select
                v-model="ruleForm.ctype"
                clearable
                placeholder="请选择车辆类型"
                @change="getSubjectData"
              >
                <el-option
                  v-for="itm in typeOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
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

            <div class="ic-wp" v-if="hasPark">
              <div class="line"></div>

              <!-- IC卡绑定部分 -->
              <div class="title">IC卡绑定</div>
              <!-- <el-form-item label="IC卡名称" prop="icname">
                <el-input
                  v-model="ruleForm.icname"
                  placeholder="请输入IC卡名称"
                ></el-input>
              </el-form-item> -->
              <el-form-item label="IC卡卡号" prop="iccode">
                <el-input
                  v-model="ruleForm.iccode"
                  placeholder="请输入IC卡卡号"
                ></el-input>
              </el-form-item>

              <div class="tip">
                提示：请用鼠标点击IC卡ID输入框或IC卡卡号输入框后读卡绑定
              </div>
            </div>
          </el-form>
          <div
            class="stall-title"
            v-if="$menu.getters.judgeRole('Btn-rui2opy5OYH4zbotd7HEd95KHs')"
          >
            已购车位绑定
          </div>
          <el-radio-group
            v-model="radioVal"
            v-if="$menu.getters.judgeRole('Btn-rui2opy5OYH4zbotd7HEd95KHs')"
          >
            <el-table :data="stallData" stripe style="width: 100%">
              <el-table-column prop="sort" label="车位名称"></el-table-column>
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="tel" label="电话"></el-table-column>
              <el-table-column prop="cycle" label="使用周期"></el-table-column>
              <el-table-column prop="" label="同步周期">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id">
                    {{ '' }}
                  </el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-radio-group>
        </el-scrollbar>
        <div class="btn-wp">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-yLplxkcdFlPWbJycXZOoF8Ad')"
            :loading="isCommit"
            type="primary"
            round
            @click="registerConfirm"
          >
            确认登记
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="@/assets/means/js/novehicle.js"></script>

<style lang="less">
@import url('~@/assets/means/css/novehicle.less');
</style>
