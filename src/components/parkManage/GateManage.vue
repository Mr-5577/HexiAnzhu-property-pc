<template>
  <div id="gate-manage">
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
            v-model="location"
            clearable
            placeholder="请选择闸机位置"
            @change="tableLoad"
          >
            <el-option
              v-for="itm in locationOptions"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
          <input
            type="text"
            class="common-input"
            placeholder="请输入闸机编号或名称查询"
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
                $menu.getters.judgeRole('Btn-EBAF9D80DBD2A22241176E55')
            "
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="addGate"
          >
            新增闸机
          </el-button>
          <el-button
            type="success"
            round
            plain
            icon="iconfont iconzu3638"
            @click="orderRecord"
          >
            指令记录
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
          @setVal="tableSetVal"
          @update="updateStatus"
          @unlocking="unlocking"
          @edit="gateEdit"
          @delete="gateDel"
          @gateOrder="skipRecord"
          @again="again"
          @openLockRecord="openLockRecord"
          @addTestCard="addTestCard"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">{{ totalMoney }}元</span>
        </div>
      </div>
    </div>

    <!-- 新增/编辑闸机弹框部分 -->
    <el-dialog
      class="gateDialog"
      :visible.sync="showGateDialog"
      :title="isEdit ? '编辑闸机' : '新增闸机'"
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
          <el-form-item label="所属车场" prop="park">
            <el-select v-model="gateForm.park" placeholder="请选择所属车场">
              <el-option
                v-for="item in parkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
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
          {{ isEdit ? '确认编辑' : '确认新增' }}
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

    <!-- 开闸弹框部分 -->
    <el-dialog
      class="unlockDialog"
      :visible.sync="showUnlockDialog"
      title="远程开闸"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="title">开闸说明</div>
      <el-input
        type="textarea"
        v-model="description"
        resize="none"
        :rows="5"
        placeholder="请填写开闸说明"
      ></el-input>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="unlockRequest"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showUnlockDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 添加临时卡弹框部分 -->
    <el-dialog
      class="addCardDialog"
      :visible.sync="showAddCardDialog"
      title="添加临时卡"
      width="25%"
      :close-on-click-modal="false"
    >
      <div class="title">临时卡号</div>
      <el-input v-model="cardNumber" placeholder="请输入临时卡号"></el-input>
      <div class="tip">提示：有效期截止到 {{indate}}</div>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="addCardConfirm"
        >
          确认添加
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showAddCardDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 指令记录弹框部分 -->
    <el-dialog
      class="orderDialog"
      :visible.sync="showOrderDialog"
      :title="orderTitle"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="orderTableData"
          :cusColums="orderColumns"
          :cusConf="orderConf"
          :ispaging="true"
          @sizeChange="orderSizeChange"
          @currentChange="orderCurrentChange"
        ></cus-table>
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

<script src="@/assets/parkManage/js/gateManage.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/gateManage.less');
</style>
