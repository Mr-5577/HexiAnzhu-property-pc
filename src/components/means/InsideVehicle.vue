<template>
  <div
    id="inside-vehicle"
    v-loading="isLoading || isCommit"
    :element-loading-text="loadText"
  >
    <div class="main-wp">
      <el-scrollbar style="height: 100%;" v-if="!isLoading">
        <div class="main-ctn">
          <div class="title">内部车管理</div>
          <div class="input-wp">
            <div class="input-item">
              <div class="name">所属模块</div>
              <el-select
                v-model="smodule"
                clearable
                placeholder="请选择所属模块"
              >
                <el-option :key="1" label="物业" :value="1"></el-option>
                <el-option :key="2" label="置业" :value="2"></el-option>
              </el-select>
            </div>
            <div class="input-item">
              <div class="name">员工姓名</div>
              <el-input v-model="uname" placeholder="请输入员工姓名"></el-input>
            </div>
            <div class="input-item">
              <div class="name">联系电话</div>
              <el-input
                type="number"
                v-model="telVal"
                placeholder="请输入联系电话"
              ></el-input>
            </div>
            <div class="input-item">
              <div class="name">起止日期</div>
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                align="center"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
            <div
              class="input-item"
              v-for="(item, index) in plateList"
              :key="index"
            >
              <div class="name">
                车牌号码
                <i
                  class="del el-icon-circle-close"
                  v-if="plateList.length > 1"
                  @click="delPlate(index)"
                ></i>
              </div>
              <el-input
                v-model="item.value"
                placeholder="请输入车牌号码"
              ></el-input>
            </div>
            <div class="input-item">
              <div class="name"></div>
              <div class="add-plate" @click="addPlate">
                <i class="iconfont iconxinzeng"></i>
                <span>添加车牌号码</span>
              </div>
            </div>
          </div>
          <div class="remark-wp">
            <div class="name">备注信息</div>
            <el-input
              type="textarea"
              :rows="4"
              resize="none"
              v-model="remarkVal"
              placeholder="请输入备注"
            ></el-input>
          </div>
          <!-- 选择项目部分 -->
          <div class="title">
            选择项目
            <el-checkbox v-model="allCheck" @change="allCheckChange">
              ( 已选{{ checkedVillages.length }} )
            </el-checkbox>
          </div>
          <div class="village-select">
            <ul class="city-wp">
              <li
                class="city-item"
                v-for="(item, index) in cityList"
                :key="index"
              >
                <div class="city-name">
                  {{ item.label }}
                  <el-checkbox
                    v-model="item.check"
                    @change="cityCheckChange($event, index)"
                  >
                    ( 已选{{ item.checkedVillages.length }} )
                  </el-checkbox>
                </div>
                <ul class="label-wp">
                  <li
                    class="label-item"
                    v-for="(itm, i) in item.children"
                    :key="i"
                  >
                    <div class="label">
                      <el-checkbox
                        v-model="itm.check"
                        @change="villageCheckChange($event, index)"
                      ></el-checkbox>
                      <span>{{ itm.label }}</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- 按钮部分 -->
          <div class="btn-wp">
            <el-button type="primary" round @click="dataCommit">
              提交保存
            </el-button>
            <el-button type="info" round @click="dataReset">数据重置</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script src="@/assets/means/js/insideVehicle.js"></script>

<style lang="less">
@import url('~@/assets/means/css/insideVehicle.less');
</style>
