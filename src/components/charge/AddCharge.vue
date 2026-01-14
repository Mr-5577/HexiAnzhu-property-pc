<template>
  <div id="add-charge">
    <!-- 左侧树形结构部分 -->
    <div class="tree-wp">
      <tree-search ref="treeSearch" type="charge" @checkChange="checkChange"></tree-search>
    </div>
    <!-- 收费主界面 -->
    <div class="main-wp">
      <div class="empty-tip" v-if="!currentUser.id">
        请在左侧选择具体资源查询！
      </div>
      <!-- 左边部分 -->
      <div class="left-wp" v-if="currentUser.id" v-loading="loading">
        <el-scrollbar style="height: 100%;">
          <!-- 房源信息部分 -->
          <div class="room-info">
            <div class="top-wp">
              <span class="title">房源信息</span>
              <el-select v-model="typeVal" placeholder="请选择用户" v-if="currentUser.type == 'rooms'" @change="pageInit">
                <el-option v-for="item in typeOptions" :key="item.oid" :label="item.name" :value="item.oid"></el-option>
              </el-select>
            </div>
            <div class="bottom-wp">
              <div class="wallet">
                <div class="money">{{ ownerBalance }}</div>
                <div class="name">零钱包(元)</div>
              </div>
              <div class="btn-wp">
                <div class="btn-top">
                  <el-button type="primary" round @click="recharge">
                    预存款
                  </el-button>
                  <el-button type="primary empty" round @click="balanceMove">
                    零钱转移
                  </el-button>
                </div>
                <el-button v-if="$menu.getters.judgeRole('Btn-Swd5D5XQWGmHHLrAbMYgReoU')" type="warning" round
                  class="vip-btn" @click="vipRefund">
                  VIP退款
                </el-button>
              </div>

              <div class="resource-icon">
                <i :class="[
                    'iconfont',
                    'iconzu3663',
                    ownresources.includes('house') ? 'active' : ''
                  ]"></i>
                <i :class="[
                    'iconfont',
                    'icona-lujing443',
                    ownresources.includes('car') ? 'active' : ''
                  ]"></i>
                <i :class="[
                    'iconfont',
                    'iconcheku',
                    ownresources.includes('carmonth') ? 'active' : ''
                  ]"></i>
                <i :class="[
                    'iconfont',
                    'icona-zu4213',
                    ownresources.includes('water_ele_gas') ? 'active' : ''
                  ]"></i>
                <i :class="[
                    'iconfont',
                    'iconqitaziyuan',
                    ownresources.includes('virtual') ? 'active' : ''
                  ]"></i>
              </div>

              <!-- 房号 -->
              <div class="rooms-wp" v-if="currentUser.type == 'rooms' && resourceInfo">
                <div class="title">
                  <i class="iconfont iconzu3663"></i>
                  <span class="value">房号 {{ resourceInfo.name }}</span>
                </div>
                <div class="content">
                  <div class="info-item">
                    <span class="name">产权面积</span>
                    <span class="value">{{ resourceInfo.buildareas }}m²</span>
                  </div>
                  <div class="info-item">
                    <span class="name">联系人</span>
                    <span class="value">{{ resourceInfo.realname }}</span>
                  </div>
                  <div class="info-item">
                    <span class="name">联系电话</span>
                    <el-tooltip effect="dark" :content="resourceInfo.tel" placement="top">
                      <span class="value">{{ resourceInfo.tel }}</span>
                    </el-tooltip>
                  </div>
                  <div class="info-item">
                    <span class="name">居住关系</span>
                    <span class="value">{{ resourceInfo.type_name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="name">交房日期</span>
                    <span class="value">
                      {{
                        resourceInfo.delivery_date
                          ? resourceInfo.delivery_date
                          : '--'
                      }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="name">开始缴费</span>
                    <span class="value">
                      {{ resourceInfo.turned ? resourceInfo.turned : '--' }}
                    </span>
                  </div>
                  <div class="info-item btn">
                    <span class="name">是否装修</span>
                    <span class="value" v-if="resourceInfo.isdecorate == 0" @click="showFitment(0)">
                      未装修
                    </span>
                    <span class="value yet" v-else-if="resourceInfo.isdecorate == 1" @click="showFitment(1)">
                      已装修
                    </span>
                    <span class="value being" v-else-if="resourceInfo.isdecorate == 2" @click="showFitment(2)">
                      装修中
                    </span>
                  </div>

                  <div class="info-item" v-if="resourceInfo.approach_time">
                    <span class="name">入场时间</span>
                    <span class="value">
                      {{ resourceInfo.approach_time }}
                    </span>
                  </div>

                  <div class="info-item btn" v-else>
                    <span class="name">入场时间</span>
                    <el-date-picker v-model="dateVal" type="date" :clearable="false" value-format="timestamp"
                      placeholder="添加入场时间" @change="dateChange"></el-date-picker>
                  </div>

                  <!-- <div class="info-item">
                    <span class="name">是否交房</span>
                    <span class="value">
                      {{ resourceInfo.check == 1 ? '已交房' : '未交房' }}
                    </span>
                  </div> -->
                  <div class="info-item">
                    <span class="name" style="line-height: 29px;">是否交房</span>
                    <span class="status-text bg-green" v-if="resourceInfo.check == 1">
                      已交房
                    </span>
                    <span class="status-text bg-red" v-else @click="onDeliveryHouse('room')">
                      未交房
                    </span>
                  </div>

                  <div class="info-item" v-for="(item, index) in resourceInfo.subject" :key="index">
                    <el-tooltip v-if="item.name.length > 4" class="item" effect="dark" :content="item.name"
                      placement="top">
                      <span class="name">{{ item.name }}</span>
                    </el-tooltip>
                    <span v-else class="name">{{ item.name }}</span>
                    <span class="value">{{ item.money }}元</span>
                  </div>
                  
                  <div class="info-item">
                    <span class="name">销售状态</span>
                    <span class="value">
                      {{ resourceInfo.isvacancy == 0 ? '已售' : '未售' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 车位、车辆 -->
              <div class="stall-wp" v-else-if="currentUser.type != 'owner' && resourceInfo">
                <div class="title">
                  <i class="iconfont iconcheku"></i>
                  <span class="value">
                    {{
                      (currentUser.type == 'car'
                        ? '固定车位'
                        : currentUser.type == 'carmonth'
                        ? '月租车'
                        :currentUser.type =='car_nonmotor'? '非机动车':'其他资源') +
                        ' ' +
                        resourceInfo.name
                    }}
                  </span>
                </div>
                <div class="content">
                  <div class="info-item" v-if="currentUser.type == 'car'">
                    <span class="name">车位面积</span>
                    <span class="value">{{ resourceInfo.area }}m²</span>
                  </div>
                  <div class="info-item">
                    <span class="name">联系人</span>
                    <span class="value">
                      {{ resourceInfo.realname ? resourceInfo.realname : '--' }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="name">联系电话</span>
                    <el-tooltip v-if="resourceInfo.tel" effect="dark" :content="resourceInfo.tel" placement="top">
                      <span class="value">
                        {{ resourceInfo.tel }}
                      </span>
                    </el-tooltip>
                    <span class="value" v-else>
                      --
                    </span>
                  </div>
                  <div class="info-item" v-for="(item, index) in resourceInfo.subject" :key="index">
                    <span class="name">{{ item.name }}</span>
                    <span class="value">{{ item.money }}元</span>
                  </div>

                  <div class="info-item" v-if="currentUser.type == 'car'">
                      <span class="name" style="line-height: 29px;">是否交房</span>
                      <span class="status-text bg-green" v-if="resourceInfo.check == 1">
                        已交房
                      </span>
                      <span class="status-text bg-red" v-else @click="onDeliveryHouse('car')">
                        未交房
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他房源信息部分 -->
          <div class="other-info" v-if="currentUser.type != 'owner'">
            <div class="top-wp">
              <span class="title">查看其它资源</span>
              <el-switch v-model="switchVal" active-color="#3ebb75" inactive-color="#f2f2f2"></el-switch>
            </div>
            <div class="bottom-wp" v-if="switchVal">
              <div class="other-empty" v-if="otherResourceInfo.length === 0">
                暂无其它资源
              </div>
              <div class="rooms-wp" v-for="(item, index) in otherResourceInfo" :key="index">
                <div class="title" @click="toOther(item)">
                  <i class="iconfont iconzu3663" v-if="item.type == 'rooms'"></i>

                  <i class="iconfont iconcheku" v-else-if="
                      item.type == 'car' ||
                        item.type == 'carmonth' ||
                        item.type == 'car_nonmotor'
                    "></i>
                  <i class="iconfont iconqitaziyuan" v-else></i>
                  <span class="value" v-if="item.type == 'carmonth'">
                    月租车 {{ item.name.join('、') }}
                  </span>
                  <span class="value" v-else>
                    {{
                      (item.type == 'car'
                        ? '固定车位'
                        : item.type == 'car_nonmotor'
                        ? '非机动车'
                        : item.type == 'rooms'
                        ? '房号'
                        : '虚拟资源') +
                        ' ' +
                        item.name
                    }}
                  </span>
                </div>
                <div class="content">
                  <div class="info-item">
                    <span class="name">联系人</span>
                    <span class="value">{{ item.realname }}</span>
                  </div>
                  <div class="info-item">
                    <span class="name">联系电话</span>
                    <el-tooltip effect="dark" :content="item.tel" placement="top">
                      <span class="value">{{ item.tel }}</span>
                    </el-tooltip>
                  </div>
                  <div class="info-item" v-if="item.type == 'rooms'">
                    <span class="name">产权面积</span>
                    <span class="value">{{ item.buildareas }}m²</span>
                  </div>
                  <div class="info-item" v-if="item.type == 'rooms'">
                    <span class="name">居住关系</span>
                    <span class="value">{{ item.type_name }}</span>
                  </div>
                  <div class="info-item" v-if="item.type == 'rooms'">
                    <span class="name">交房日期</span>
                    <span class="value">
                      {{ item.delivery_date ? item.delivery_date : '--' }}
                    </span>
                  </div>
                  <div class="info-item" v-if="item.type == 'rooms'">
                    <span class="name">开始缴费</span>
                    <span class="value">
                      {{ item.turned ? item.turned : '--' }}
                    </span>
                  </div>
                  <div class="info-item btn" v-if="item.type == 'rooms'">
                    <span class="name">是否装修</span>
                    <span class="value" v-if="item.isdecorate == 0" @click="showOtherFitment(0, item)">
                      未装修
                    </span>
                    <span class="value yet" v-else-if="item.isdecorate == 1" @click="showOtherFitment(1, item)">
                      已装修
                    </span>
                    <span class="value being" v-else-if="item.isdecorate == 2" @click="showOtherFitment(2, item)">
                      装修中
                    </span>
                  </div>
                  <div class="info-item" v-if="item.type == 'rooms'">
                    <span class="name">是否交房</span>
                    <span class="value">
                      {{ item.check == 1 ? '已交房' : '未交房' }}
                    </span>
                  </div>
                  <div class="info-item" v-if="item.type == 'car'">
                    <span class="name">车位面积</span>
                    <span class="value">{{ item.area }}m²</span>
                  </div>
                  <div class="info-item" v-for="(itm, index) in item.subject" :key="index">
                    <el-tooltip v-if="itm.name.length > 4" effect="dark" :content="itm.name" placement="top">
                      <span class="name">{{ itm.name }}</span>
                    </el-tooltip>
                    <span v-else class="name">{{ itm.name }}</span>
                    <span class="value">{{ itm.money }}元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <!-- 右边部分 -->
      <div class="right-wp" v-if="currentUser.id">
        <!-- 收费界面部分 -->
        <div class="charge-interface">
          <div class="main-content">
            <ul class="option-wp" v-if="currentUser.type != 'owner'">
              <li :class="['option-item', opIndex === 0 ? 'active' : '']" @click="gotoPay">
                <i class="iconfont iconjiaofei"></i>
                进行缴费
              </li>
              <li :class="['option-item', opIndex === 1 ? 'active' : '']"
                v-if="$menu.getters.judgeRole('Btn-U7SVJ7YDbQono4HQoeM7pFgf')" @click="opIndex = 1">
                <i class="iconfont iconxinzeng"></i>
                添加费用
              </li>
              <li :class="['option-item', opIndex === 2 ? 'active' : '']"
                v-if="$menu.getters.judgeRole('Btn-BzocvXddvs7dmwZr6CX8IPzD')" @click="opIndex = 2">
                <i class="iconfont iconjiaofei"></i>
                历史缴费
              </li>
              <li :class="['option-item', opIndex === 3 ? 'active' : '']"
                v-if="$menu.getters.judgeRole('Btn-rgLeclNJYzoPftjBSAyHPr1r')" @click="opIndex = 3">
                <i class="iconfont iconbianji"></i>
                欠费调整
              </li>
              <li :class="['option-item', opIndex === 4 ? 'active' : '']"
                v-if="$menu.getters.judgeRole('Btn-Rry9xPZqclbeo9oXkl3nXcAu')" @click="opIndex = 4">
                <i class="iconfont icontuikuan"></i>
                退款管理
              </li>
              <el-select v-if="opIndex === 0" v-model="nameVal" clearable filterable placeholder="请选择资源名称"
                @change="recordNameChange">
                <el-option v-for="itm in recordNames" :key="itm.value" :label="itm.label" :value="itm.value">
                </el-option>
              </el-select>
            </ul>
            <!-- 添加费用部分 -->
            <ChargeAdd :vid="currentVid" :currentUser="currentUser" v-if="opIndex == 1"></ChargeAdd>
            <!-- 历史缴费部分 -->
            <PaymentHistory :vid="currentVid" :oid="currentUser.oid" v-else-if="opIndex == 2"></PaymentHistory>
            <!-- 欠费调整部分 -->
            <ChargeAdjust :currentUser="currentUser" v-else-if="opIndex == 3"></ChargeAdjust>
            <!-- 退款管理部分 -->
            <RefundManage ref="refundManage" v-else-if="opIndex == 4" :vid="currentVid" :oid="currentUser.oid">
            </RefundManage>
            <!-- 欠费记录部分 -->
            <div class="charge-record">
              <div class="table-wp">
                <!-- <cus-table
                  :datas="recordTable"
                  :cusColums="recordColumns"
                  :cusConf="recordConf"
                  :check="true"
                  @selectionChange="recordSelectionChange"
                ></cus-table> -->
                <vxe-table stripe auto-resize height="auto" show-overflow highlight-hover-row ref="recordTable"
                  align="center" :data="recordTable" v-loading="recordConf.loadStatus" element-loading-text="数据获取中..."
                  @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent">
                  <vxe-column type="checkbox" width="60"></vxe-column>
                  <vxe-table-column :field="item.prop" :title="item.label" show-overflow
                    v-for="(item, index) in recordColumns" :key="index">
                    <template #default="{ row }">
                      <span :style="{ color: item.color ? item.color : '#333' }">
                        {{ row[item.prop] }}
                      </span>
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </div>
              <div class="total-ct">
                <div class="total-wp">
                  <span class="name">已选总合计</span>
                  <span class="value yellow">{{ inventAmount }}元</span>
                </div>
                <div class="total">欠费总合计： {{ recordTotal }}元</div>
              </div>
            </div>

            <div class="charge-btn">
              <el-button type="warning empty" round @click="tempClear">
                清空临时欠费
              </el-button>
              <el-button :disabled="recordSelected.length === 0" type="primary" round @click="paymentInit">
                确认缴费
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 零钱转移弹框部分 -->
    <el-dialog class="moveDialog" :visible.sync="showMoveDialog" title="零钱转移" width="36%" :close-on-click-modal="false">
      <el-scrollbar style="height: 100%;">
        <!-- 搜索部分 -->
        <el-autocomplete ref="searchInput" class="prestore-search" popper-class="my-autocomplete" v-model="autoValue"
          :fetch-suggestions="querySearchAsync" placeholder="请输入业主姓名、手机号或房号" @select="handleSelect">
          <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
          <template slot-scope="{ item }">
            <div class="tr-item">
              <span class="td-item">{{ item.username }}</span>
              <span class="td-item">{{ item.tel }}</span>
              <span class="td-item">{{ item.title }}</span>
            </div>
            <div class="load-more" v-if="allUserList.length <= 1">
              暂无数据！
            </div>
          </template>
        </el-autocomplete>
        <el-form :model="moveForm" :rules="moveRules" ref="moveForm" :hide-required-asterisk="true">
          <el-form-item label="项目名称" prop="vname">
            <el-input v-model="moveForm.vname" placeholder="请输入项目名称" readonly></el-input>
          </el-form-item>
          <el-form-item label="选择楼栋" prop="build">
            <el-select v-model="moveForm.build" clearable placeholder="请选择楼栋" @change="buildChange">
              <el-option v-for="itm in buildOptions" :key="itm.id" :label="itm.block" :value="itm.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择单元" prop="unit">
            <el-select v-model="moveForm.unit" clearable placeholder="请选择单元" @change="unitChange">
              <el-option v-for="itm in unitOptions" :key="itm.id" :label="itm.unit" :value="itm.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择房号" prop="room">
            <el-select v-model="moveForm.room" clearable placeholder="请选择房号" @change="roomChange">
              <el-option v-for="itm in roomOptions" :key="itm.id" :label="itm.roomnum" :value="itm.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择客户" prop="uid">
            <el-select v-model="moveForm.uid" clearable placeholder="请选择客户">
              <el-option v-for="itm in userOptions" :key="itm.value" :label="itm.label" :value="itm.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转移金额" prop="money">
            <span class="tip">(余额: {{ ownerBalance }})</span>
            <el-input type="number" v-model="moveForm.money" placeholder="请输入转移金额"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="moveSubmit">
          确认转移
        </el-button>
        <el-button :loading="isCommit" type="info" round @click="showMoveDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- vip退款弹框部分 -->
    <el-dialog class="vipDialog" :visible.sync="showVipDialog" title="VIP退款" width="35%" :close-on-click-modal="false">
      <el-form :model="vipForm" :rules="vipRules" ref="vipForm" :hide-required-asterisk="true">
        <el-form-item label="退款科目" prop="subject">
          <el-select v-model="vipForm.subject" placeholder="请选择退款科目" @change="subChange">
            <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="vipForm.name" :readonly="true" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源面积" prop="area">
          <el-input v-model="vipForm.area" :readonly="true" placeholder="请输入资源面积"></el-input>
        </el-form-item>
        <el-form-item label="资源单价" prop="price">
          <el-input v-model="vipForm.price" :readonly="true" placeholder="请输入资源单价"></el-input>
        </el-form-item>
        <el-form-item label="截止日期" prop="etime">
          <el-date-picker v-model="vipForm.etime" :readonly="true" type="date" align="center" value-format="timestamp"
            placeholder="请选择截止日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="退款时间" prop="rtime">
          <el-date-picker v-model="vipForm.rtime" type="date" align="center" :picker-options="pickerOptions"
            value-format="timestamp" placeholder="请选择退款时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="tip">
        注意：VIP退费操作会删除从退款日期开始到VIP截止日之间的交费记录！
      </div>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="vipSubmit">
          确认退款
        </el-button>
        <el-button :loading="isCommit" type="info" round @click="showVipDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 装修信息组件部分 -->
    <Fitment ref="fitment" :vid="currentVid" :balance="ownerBalance" @getBasicInfo="getBasicInfo"></Fitment>

    <!-- 确认缴费弹框部分 -->
    <el-dialog class="paymentDialog" :visible.sync="showPaymentDialog" :title="isRecharge ? '预存款' : '开始缴费'" width="50%"
      :close-on-click-modal="false">
      <el-scrollbar style="height: 100%;">
        <!-- 下载发票 -->
        <a ref="adom" :href="downloadUrl" target="_blank" style="display: none;"></a>
        <el-form :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm">
          <el-form-item :label="item.name" :prop="item.value" v-for="(item, index) in infoList" :key="index">
            <el-select v-model="ruleForm[item.value]" clearable :placeholder="`请选择${item.name}`"
              v-if="item.type == 'select'">
              <el-option v-for="itm in item.options" :key="itm.id" :label="itm.name" :value="itm.id"></el-option>
            </el-select>
            <el-date-picker v-model="ruleForm[item.value]" type="datetime" placeholder="选择收款时间"
              v-else-if="item.type === 'time'" value-format="timestamp" :disabled="item.readonly"></el-date-picker>
            <el-input v-else v-model="ruleForm[item.value]" :type="item.type" :readonly="item.readonly"
              :placeholder="`请输入${item.name}`" @change="moneyChange(item)"></el-input>
            <div class="balance" v-if="!isRecharge && item.useBalance">
              使用预存(余额:￥{{ ownerBalance }})
              <el-checkbox :disabled="Number(ownerBalance) < Number(ruleForm.reality)" v-model="useBalance">
              </el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="收据类型" prop="receiptType" v-if="receiptType == 3">
            <el-select v-model="ruleForm.receiptType" placeholder="请选择收据类型" clearable>
              <el-option label="电子收据" :value="1"></el-option>
              <el-option label="纸质收据" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否生成纸质收据" prop="isPaper" v-if="
              receiptType == 2 ||
                (receiptType == 3 && ruleForm.receiptType == 2)
            ">
            <el-select v-model="ruleForm.isPaper" placeholder="请选择是否生成纸质收据" clearable>
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div class="tips" v-if="!isRecharge">
            1.余额不足时，不能选择划账！
            <br />
            <!-- 2.零头自动存入预存款 -->
          </div>
          <!-- 上传附件部分 -->
          <el-form-item v-if="ruleForm.method == freeId" class="remark" label="上传附件" prop="fileInfo">
            <el-upload ref="upload" :action="qiniuDatas.domain" :http-request="customUpload" :on-remove="handleRemove"
              v-if="qiniuDatas.domain">
              <el-button type="primary">
                点击上传
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item class="remark" label="备注说明" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" resize="none" :rows="3"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="paymentConfirm">
          确认缴费
        </el-button>
        <el-button :loading="isCommit" type="info" round @click="showPaymentDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/charge/js/addCharge.js"></script>

<style lang="less">
  @import url('~@/assets/charge/css/addCharge.less');
</style>
