<template>
  <div id="yard-manage">
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
            placeholder="输入订单金额查询"
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
            v-if="$menu.getters.judgeRole('Btn-5291F13555037F493D3A8820')"
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="addPark"
          >
            新增车场
          </el-button>
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
          @detail="showDetail"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">{{ totalMoney }}元</span>
        </div>
      </div>
    </div>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 新增车场弹框部分 -->
    <el-dialog
      class="temporary"
      :visible.sync="showDialog"
      :title="isAdd ? '新增车场' : '车场详情'"
      width="75%"
      :close-on-click-modal="false"
      v-loading="isloadDetail"
    >
      <el-scrollbar style="height: 100%;">
        <div class="main-wp">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="车场名称" prop="parkName">
              <el-input
                v-model="ruleForm.parkName"
                placeholder="请输入车场名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="关联项目" prop="village">
              <el-select
                v-model="ruleForm.village"
                placeholder="请选择关联项目"
                :disabled="
                  !isAdd &&
                    ((yarnDetail.gates && yarnDetail.gates.length > 0) ||
                      (yarnDetail.chargepiles &&
                        yarnDetail.chargepiles.length > 0))
                "
                clearable
                filterable
              >
                <el-option
                  v-for="item in villageOptions"
                  :key="item.id"
                  :label="item.villagename"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="临停收费方式" prop="method">
              <el-select
                v-model="ruleForm.method"
                placeholder="请选择临停收费方式"
                :disabled="!isAdd && yarnDetail.is_order"
                clearable
                @change="methodChange"
              >
                <el-option
                  v-for="item in methodOptions"
                  :key="item.mode"
                  :label="item.mode_text"
                  :value="item.mode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收费标准" prop="standard">
              <el-select
                v-model="ruleForm.standard"
                multiple
                collapse-tags
                placeholder="请选择收费标准"
                clearable
              >
                <el-option
                  v-for="item in standardOptions"
                  :key="item.id"
                  :label="item.standard_text"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="呼叫中心" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                placeholder="请输入呼叫中心电话号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="驴充充小区" prop="lccPlot">
              <el-select
                v-model="ruleForm.lccPlot"
                placeholder="请选择驴充充小区"
                clearable
              >
                <el-option
                  v-for="item in plotOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 道闸管理 -->
          <div class="table-wp">
            <div class="title">
              道闸管理
              <el-button
                v-if="
                  isAdd ||
                    $menu.getters.judgeRole('Btn-EBAF9D80DBD2A22241176E55')
                "
                type="primary empty"
                size="small"
                round
                @click="addGate"
              >
                新增闸机
              </el-button>
            </div>

            <cus-table
              :datas="gateTableData"
              :cusColums="gateColumns"
              :cusConf="gateConf"
              @delete="gateDelete"
              @edit="gateEdit"
            ></cus-table>
          </div>

          <!-- 电桩管理 -->
          <div class="table-wp">
            <div class="title">
              电桩管理
              <el-button
                v-if="
                  isAdd ||
                    $menu.getters.judgeRole('Btn-D033341B7991E537B6B0C4E1')
                "
                type="primary empty"
                size="small"
                round
                @click="addPile"
              >
                新增电桩
              </el-button>
            </div>
            <cus-table
              :datas="pileTableData"
              :cusColums="pileColumns"
              :cusConf="pileConf"
              @delete="pileDelete"
              @edit="pileEdit"
            ></cus-table>
          </div>
        </div>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="parkSubmit">
          {{ isAdd ? '确认新增' : '确认修改' }}
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 新增闸机弹框部分 -->
    <el-dialog
      class="gateDialog"
      :visible.sync="showGateDialog"
      :title="isEditGate ? '编辑闸机' : '新增闸机'"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="gateForm"
          :rules="gateRules"
          ref="gateForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="闸机名称" prop="name">
            <el-input
              v-model="gateForm.name"
              placeholder="请输入闸机名称"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="闸机名称" prop="nameId">
            <el-select
              v-model="gateForm.nameId"
              placeholder="输入闸机编号选择"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethod"
              :loading="loading"
              @change="nameChange"
            >
              <el-option
                v-for="item in deviceOptions"
                :key="item.id"
                :label="item.sn"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="资源类型" prop="resource">
            <el-select v-model="gateForm.resource" placeholder="请选择资源类型">
              <el-option
                v-for="item in resourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="控制机序号" prop="sort">
            <el-input
              v-model="gateForm.sort"
              placeholder="请输入控制机序号"
            ></el-input>
          </el-form-item>
          <el-form-item label="视频摄像头" prop="camera">
            <el-input
              v-model="gateForm.camera"
              placeholder="请输入视频摄像头地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-select v-model="gateForm.status" placeholder="请选择启用状态">
              <el-option label="禁用" :value="-1"></el-option>
              <el-option label="启用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否计费" prop="charge">
            <el-select v-model="gateForm.charge" placeholder="请选择是否计费">
              <el-option label="否" :value="2"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置" prop="location">
            <el-select v-model="gateForm.location" placeholder="请选择位置">
              <el-option
                v-for="item in locationOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="闸机类别" prop="classify">
            <el-select v-model="gateForm.classify" placeholder="请选择闸机类别">
              <el-option label="入口" :value="1"></el-option>
              <el-option label="出口" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="gateSubmit">
          {{ isEditGate ? '确认修改' : '确认新增' }}
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showGateDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 新增充电桩弹框部分 -->
    <el-dialog
      class="pileDialog"
      :visible.sync="showPileDialog"
      :title="isEditPile ? '编辑充电桩' : '新增充电桩'"
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
          <el-form-item label="资源类型" prop="type">
            <el-select
              v-model="pileForm.type"
              clearable
              placeholder="请选择资源类型"
            >
              <el-option
                v-for="item in resourceOptions"
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
              filterable
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
          {{ isEditPile ? '确认修改' : '确认新增' }}
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
  </div>
</template>

<script src="@/assets/parkManage/js/yardManage.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/yardManage.less');
</style>
