<template>
  <div id="piles-manage">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="filterVillage({ name: '全部项目', vid: '' })"
            ></i>
          </span>
          <input
            type="text"
            class="common-input"
            placeholder="输入关键字查询"
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
        <div class="common-right">
          <el-button
            v-if="
              choseVillageInfo.vid &&
                $menu.getters.judgeRole('Btn-D033341B7991E537B6B0C4E1')
            "
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="addPile"
          >
            新增电桩
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="typeVal"
          clearable
          placeholder="请选择支付类型"
          @change="tableLoad"
        >
          <el-option label="月卡支付" :value="5"></el-option>
          <el-option label="微信支付" :value="6"></el-option>
          <el-option label="支付宝支付" :value="7"></el-option>
          <el-option label="翼支付支付" :value="16"></el-option>
        </el-select>
        <el-date-picker
          v-model="startTime"
          type="date"
          :picker-options="spickerOptions"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          @change="tableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="epickerOptions"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="tableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @setVal="tableSetVal"
          @detail="pilesDetail"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">{{ totalMoney }}元</span>
        </div>
      </div>
    </div>

    <!-- 新增充电桩弹框部分 -->
    <el-dialog
      class="pileDialog"
      :visible.sync="showPileDialog"
      title="新增充电桩"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="pileForm"
          :rules="pileRules"
          ref="pileForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="充电桩名称" prop="name">
            <el-input
              v-model="pileForm.name"
              placeholder="请输入充电桩名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属车场" prop="park">
            <el-select v-model="pileForm.park" placeholder="请选择所属车场">
              <el-option
                v-for="item in parkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select
              v-model="pileForm.type"
              clearable
              placeholder="请选择资源类型"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备编号" prop="code">
            <el-input
              v-model="pileForm.code"
              placeholder="请输入设备编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="视频摄像头" prop="camera">
            <el-input
              v-model="pileForm.camera"
              placeholder="请输入视频摄像头地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-select
              v-model="pileForm.status"
              clearable
              placeholder="请选择启用状态"
            >
              <el-option label="禁用" :value="-1"></el-option>
              <el-option label="启用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联设备" prop="lccDevice">
            <el-select
              v-model="pileForm.lccDevice"
              clearable
              placeholder="请选择关联设备"
            >
              <el-option
                v-for="item in lccDevices"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="pileSubmit">
          确认新增
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showPileDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 充电桩详情弹框 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      title="订单详情"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="select-wp">
        <el-select
          v-model="detailType"
          clearable
          placeholder="请选择支付类型"
          @change="detailTableLoad"
        >
          <el-option label="月卡支付" :value="5"></el-option>
          <el-option label="微信支付" :value="6"></el-option>
          <el-option label="支付宝支付" :value="7"></el-option>
          <el-option label="翼支付支付" :value="16"></el-option>
        </el-select>
        <el-date-picker
          v-model="detailStime"
          type="date"
          :picker-options="dspickerOptions"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          @change="detailTableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="detailEtime"
          type="date"
          :picker-options="depickerOptions"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="detailTableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="detailTableData"
          :cusColums="detailColumns"
          :cusConf="detailConf"
          :ispaging="true"
          @sizeChange="detailSizeChange"
          @currentChange="detailCurrentChange"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">{{ allmoney }}元</span>
        </div>
      </div>
    </el-dialog>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/parkManage/js/pilesManage.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/pilesManage.less');
</style>
