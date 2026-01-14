<template>
  <div id="ic-manage">
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
          <el-select
            v-model="statusVal"
            clearable
            placeholder="请筛选状态"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in statusOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <input
            type="text"
            class="common-input"
            placeholder="请输入卡号或姓名查询"
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
            v-if="$menu.getters.judgeRole('Btn-1kV4hlRyThWvJBG6buzEGxNUGN')"
            type="success"
            plain
            class="common-button"
            icon="iconfont icona-zu4462"
            @click="bathCard"
          >
            批量制卡
          </el-button>
          <el-button
            v-if="$menu.getters.judgeRole('Btn-kjAY0H5JDaxjDzLXvDfaGxGw96')"
            type="warning"
            plain
            class="common-button"
            icon="iconfont icona-zu4462"
            @click="singleCard"
          >
            单张制卡
          </el-button>
          <!-- <el-button
            v-if="$menu.getters.judgeRole('Btn-EDA88C42EFA1BEA66B32EBCF')"
            type="primary"
            plain
            class="common-button"
            icon="iconfont icona-lianhe46"
            @click="recycleCard"
          >
            回收IC卡
          </el-button> -->
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @detail="cardDetail"
          @card_again="cardAgain"
          @icDelet="icDelet"
        ></cus-table>
      </div>
    </div>

    <!-- 回收IC卡弹框 -->
    <el-dialog
      class="recycleDialog"
      :visible.sync="showRecycleDialog"
      title="回收IC卡"
      width="30rem"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="IC卡名称" prop="icId">
          <el-input
            v-model="ruleForm.icId"
            placeholder="请输入IC卡名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="IC卡卡号" prop="icCode">
          <el-input
            v-model="ruleForm.icCode"
            placeholder="请将IC卡靠近刷卡位置读取"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          确认回收
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showRecycleDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- IC卡详情弹框 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      title="IC卡详情"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="name">IC卡号：{{ detailData.code }}</div>
        <div class="table-wp">
          <div class="table-header">
            <span>道闸名称</span>
            <span>业主是否计费</span>
            <span>有效期</span>
            <span>状态标识</span>
          </div>
          <ul class="table-body">
            <li
              class="empty"
              v-if="
                !detailData.iccardgate || detailData.iccardgate.length === 0
              "
            >
              <span>暂无数据</span>
            </li>
            <li v-for="(item, index) in detailData.iccardgate" :key="index">
              <span>
                {{ item.gate && item.gate.name ? item.gate.name : '' }}
              </span>
              <span style="color: #999;">
                {{ item.gate ? item.gate.is_free_text : '' }}
              </span>
              <span>{{ item.end_date }}</span>
              <span>{{ item.card_gate_status_text }}</span>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 批量制卡弹框 -->
    <el-dialog
      class="batchDialog"
      :visible.sync="showBatchDialog"
      title="批量制卡"
      width="40%"
      :close-on-click-modal="false"
    >
      <div class="select-wp">
        <el-select
          v-model="villageVal"
          clearable
          placeholder="请选择项目"
          @change="villChange"
        >
          <el-option
            v-for="itm in villageOptions"
            :key="itm.id"
            :label="itm.villagename"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="buildVal"
          clearable
          placeholder="请选择楼栋"
          @change="buildChange"
        >
          <el-option
            v-for="itm in buildOptions"
            :key="itm.id"
            :label="itm.block"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="unitVal"
          clearable
          placeholder="请选择单元"
          @change="unitChange"
        >
          <el-option
            v-for="itm in unitOptions"
            :key="itm.id"
            :label="itm.unit"
            :value="itm.id"
          ></el-option>
        </el-select>
      </div>
      <el-scrollbar
        style="height: calc(100% - 3.75rem);"
        v-loading="userLoading"
      >
        <div class="empty" v-if="!userList || userList.length === 0">
          暂无数据！
        </div>
        <ul class="user-wp" v-else>
          <li v-for="(item, index) in userList" :key="index">
            <div class="name">
              {{ `${item.realname}-${item.type_name}(${item.roomnum})` }}
            </div>
            <div class="cards" v-for="(itm, i) in item.cards" :key="i">
              <el-input
                v-model="itm.card"
                placeholder="请输入IC卡号"
              ></el-input>
              <el-input
                v-model="itm.money"
                type="number"
                placeholder="请输入金额"
              ></el-input>
              <i
                v-if="i === item.cards.length - 1"
                class="el-icon-plus"
                @click="addCard(item)"
              ></i>
              <i v-else class="el-icon-close" @click="delCard(item, i)"></i>
            </div>
            <i
              v-if="userList && userList.length > 1"
              class="userdel el-icon-close"
              @click="delUser(index)"
            ></i>
          </li>
        </ul>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="makeCard">
          确认制卡
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showBatchDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 单张制卡弹框 -->
    <el-dialog
      class="singleDialog"
      :visible.sync="showSingleDialog"
      title="操作制卡"
      width="36%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-autocomplete
          ref="searchInput"
          class="user-search"
          popper-class="my-autocomplete"
          v-model="autoValue"
          :debounce="0"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入业主姓名/手机号或房号"
          @select="handleSelect"
        >
          <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
          <template slot-scope="{ item }">
            <div class="tr-item">
              <span class="td-item">{{ item.realname }}</span>
              <span class="td-item">
                {{ item.sex ? item.sex : '未知' }}
              </span>
              <span class="td-item">{{ item.tel }}</span>
            </div>
            <div
              class="load-more"
              @click.stop="loadMore"
              v-if="
                allUserList.length > 1 &&
                  item.id == allUserList[allUserList.length - 1].id
              "
            >
              {{ nomore ? '没有更多了' : '点击加载更多' }}
            </div>
            <div
              class="load-more"
              @click.stop="loadMore"
              v-if="allUserList.length <= 1"
            >
              暂无数据！
            </div>
          </template>
        </el-autocomplete>

        <ul class="user-wp" v-if="currentUser">
          <li>
            <div class="name">
              {{
                currentUser.realname +
                  '-' +
                  (currentUser.owner_type && currentUser.owner_type.name
                    ? currentUser.owner_type.name
                    : '') +
                  (currentUser &&
                  currentUser.ownerRooms &&
                  currentUser.ownerRooms.length > 0
                    ? '(' +
                      currentUser.ownerRooms
                        .map(i => i.rooms.roomnum)
                        .join('、') +
                      ')'
                    : '')
              }}
            </div>
            <div class="cards" v-for="(itm, i) in currentUser.cards" :key="i">
              <el-input
                v-model="itm.card"
                placeholder="请输入IC卡号"
              ></el-input>
              <el-input
                v-model="itm.money"
                type="number"
                placeholder="请输入金额"
              ></el-input>
              <i
                v-if="i === currentUser.cards.length - 1"
                class="el-icon-plus"
                @click="aloneAddCard"
              ></i>
              <i v-else class="el-icon-close" @click="aloneDelCard(i)"></i>
            </div>
          </li>
        </ul>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="aloneMakeCard"
        >
          确认制卡
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showBatchDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/means/js/icmanage.js"></script>

<style lang="less">
@import url('~@/assets/means/css/icmanage.less');
</style>
