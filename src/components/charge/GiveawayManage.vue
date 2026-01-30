<template>
  <div id="giveaway-manage">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <workIcon name="build"></workIcon>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="
                choseVillageInfo = {
                  name: '全部项目',
                  vid: '',
                }
                keySearch()
              "
            ></i>
          </span>
          <input
            type="text"
            class="common-input"
            placeholder="请输入房号"
            v-model="roomnum"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch()"
          >
            查询
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="status"
          placeholder="请选择领取状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in statusOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>

        <input
          type="text"
          class="tel-input"
          placeholder="请输入业主姓名"
          v-model="realname"
        />
        <input
          type="text"
          class="tel-input"
          placeholder="请输入手机号"
          v-model="tel"
        />

        <el-button type="primary empty" round @click="exportDetailExcel">
          导出Excel
        </el-button>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @imgPreview="imgPreview"
          @signFor="signForDetail"
          @detail="viewDetail"
        ></cus-table>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 缴费详情弹框 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showPaymentDetailDialog"
      title="缴费详情"
      width="60%"
      :close-on-click-modal="false"
    >
      <div class="detailInfo">
        <div class="infoItem">
          <div class="itemTitle">基本信息</div>
          <div class="infoContent">
            <div class="flexItem">
              <div class="item">
                <span class="name">项目</span>
                <span class="value">{{ paymentDetailData.name }}</span>
              </div>
              <div class="item">
                <span class="name">房号</span>
                <span class="value">{{ paymentDetailData.roomnum }}</span>
              </div>
              <div class="item">
                <span class="name">业主姓名</span>
                <span class="value">{{ paymentDetailData.realname }}</span>
              </div>
            </div>
            <div class="flexItem">
              <div class="item">
                <span class="name">手机号</span>
                <span class="value">{{ paymentDetailData.tel }}</span>
              </div>
              <div class="item">
                <span class="name">产品类型</span>
                <span class="value">{{ paymentDetailData.product_type }}</span>
              </div>
              <div class="item">
                <span class="name">面积</span>
                <span class="value">{{ paymentDetailData.buildareas }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="infoItem">
          <div class="itemTitle">优惠方案及来源</div>
          <div class="infoContent">
            <div class="flexItem">
              <div class="item">
                <span class="name">优惠方案</span>
                <!-- <span class="value">2026年住宅预存方案</span> -->
                <span class="value">暂无方案</span>
              </div>
              <div class="item">
                <span class="name">来源类型</span>
                <span class="value">手工登记</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="paymentInfo">
        <div class="paymentTitle">缴费情况</div>
        <div class="table-wp">
          <cus-table
            :datas="paymentTableData"
            :cusColums="paymentColumns"
            :ispaging="true"
            :cusConf="paymentConf"
            @sizeChange="paymentSizeChange"
            @currentChange="paymentCurrentChange"
          ></cus-table>
        </div>
      </div>
    </el-dialog>

    <!-- 领取登记弹窗 -->
    <el-dialog
      class="signForDialog"
      :visible.sync="showSignForDetailDialog"
      title="领取登记"
      width="40%"
      :close-on-click-modal="false"
    >
      <div class="signForContent">
        <div class="signForTitle">领取信息</div>
        <div class="signForInfo">
          <div class="signForItem">
            <div class="flex">
              <span class="name">礼品名称及规格</span>
              <span class="value">{{ signForData.gift_name_unit }}</span>
            </div>
            <div class="flex">
              <span class="name">总赠品数量</span>
              <span class="value">{{ signForData.gift_num }}</span>
            </div>
          </div>
          <div class="signForItem">
            <div class="flex">
              <span class="name">已领取数量</span>
              <span class="value">{{ signForData.gift_num_receive }}</span>
            </div>
            <div class="flex">
              <span class="name">待领取</span>
              <span class="value">{{ signForData.gift_num_notReceive }}</span>
            </div>
          </div>
          <div class="signForItem">
            <div class="flex">
              <span class="name">领取状态</span>
              <span class="value">{{ signForData.status_name }}</span>
            </div>
            <div class="flex">
              <span class="name">领取人</span>
              <span class="value">{{ signForData.realname }}</span>
            </div>
          </div>
          <div class="signForItem">
            <div class="flex">
              <span class="name">领取日期</span>
              <span class="value">{{ signForData.time }}</span>
            </div>
            <div class="flex">
              <span class="name">本次领取</span>
              <!-- 不能为0，不能超过待领取数量 -->
              <input
                type="text"
                class="signFor-input"
                placeholder="请输入数字"
                v-model="signForData.gift_num_receive_this"
              />
            </div>
          </div>
          <div class="signForItem">
            <div class="flex">
              <span class="name">发放人</span>
              <span class="value">{{ issuerName }}</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="handleSubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showSignForDetailDialog = false"
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

<script src="@/assets/charge/js/giveawayManage.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/giveawayManage.less');
</style>
