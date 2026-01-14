<template>
  <div id="accounts">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <workIcon name="build"></workIcon>
            {{ choseVillageInfo.name }}
          </span>
          <el-date-picker
            v-model="dateVal"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
            type="primary"
            class="common-button"
            plain
            icon="el-icon-plus"
            @click="$refs.showAddVillage.showDialog()"
            v-if="
              $global.btnRoleAuth(
                $api.state.System.village.add.token,
                $menu.state.childRoleList
              )
            "
          >
            新增项目
          </el-button>
          <el-dropdown trigger="click" :hide-on-click="false">
            <workIcon
              name="filtr"
              class="common-right-icon"
              title="筛选"
            ></workIcon>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in columns" :key="i">
                <el-checkbox v-model="v.show" @change="checkChange">
                  {{ v.label }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="$refs.cusTable.exportExcel()">
            <workIcon
              name="export"
              class="common-right-icon"
              title="导出"
            ></workIcon>
          </span>
          <span
            class="last-ico"
            @click="printHandle"
            v-print="{
              id: '#tablePrint',
              popTitle: '交账列表'
            }"
          >
            <workIcon
              name="print"
              class="common-right-icon"
              title="打印"
            ></workIcon>
          </span>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="table-wp">
        <cus-table
          ref="cusTable"
          title="交账数据表"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @pass="accountPass"
          @reject="accountReject"
          @orderDetail="orderDetail"
          @billDetail="billDetail"
          @selectionChange="selectionChange"
        ></cus-table>
        <el-button
          v-if="
            this.$menu.getters.judgeRole('Btn-p5EpzeVjdFb57MYDxHmlLra7') ||
              this.$menu.getters.judgeRole('Btn-7SEpzeVju7fftMYDxHmlLrab')
          "
          class="empty"
          type="primary"
          :disabled="tableSelected.length == 0"
          round
          @click="batchAudit"
        >
          批量审核({{ tableSelected.length }})
        </el-button>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
    <!-- 选择项目 -->

    <!-- 交账订单明细弹框部分 -->
    <el-dialog
      class="orderDialog"
      :visible.sync="showOrderDialog"
      title="交账订单明细"
      width="80%"
      :close-on-click-modal="true"
    >
      <div class="table-wp">
        <cus-table
          :datas="orderTableData"
          :cusColums="orderColumns"
          :cusConf="orderConf"
        ></cus-table>
        <div class="total">
          费用合计：
          <span class="money">{{ totalMoney }}元</span>
          <span class="num">
            共
            <span>{{ orderTableData.length }}</span>
            条记录
          </span>
        </div>
        <el-button
          type="primary"
          round
          plain
          icon="iconfont iconzu3638"
          @click="showAuditDialog = true"
        >
          审批记录
        </el-button>
      </div>
    </el-dialog>

    <!-- 审批记录弹框部分 -->
    <el-dialog
      class="auditDialog"
      :visible.sync="showAuditDialog"
      title="审批记录"
      width="40%"
      :close-on-click-modal="true"
    >
      <div class="audit-wp">
        <div class="line-wp">
          <span class="triangle"></span>
          <span class="line"></span>
        </div>
        <el-scrollbar style="height: 100%;">
          <ul v-if="auditList.data && auditList.data.length > 0">
            <li v-for="(item, index) in auditList.data" :key="index">
              <span
                :class="[
                  'status',
                  item.status == 0
                    ? 'sta1'
                    : item.status == 1
                    ? 'sta3'
                    : item.status == 2
                    ? 'sta2'
                    : ''
                ]"
              >
                {{ item.status_text }}
              </span>
              <span class="name">
                {{ item.user.realname }}
                <span>({{ item.user.position.posname }})</span>
              </span>
              <span class="time">{{ item.update_time }}</span>
            </li>
            <li>
              <span class="status">发起审批</span>
              <span class="name">
                {{ auditList.creator.realname }}
                <span>({{ auditList.creator.position.posname }})</span>
              </span>
              <span class="time">{{ auditList.creator.create_time }}</span>
            </li>
          </ul>
          <div v-else style="text-align: center;margin-top: 1.5rem;">
            暂无审批记录
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>

    <!-- 账单详情弹框部分 -->
    <el-dialog
      class="billDialog"
      :visible.sync="showBillDialog"
      title="账单详情"
      width="80%"
      :close-on-click-modal="true"
    >
      <div class="table-wp" v-loading="billConf.loadStatus">
        <el-table
          class="searchTable"
          v-if="billTableData.data"
          :data="billTableData.data"
          height="100%"
          stripe
          show-summary
          :summary-method="getSummaries"
          v-loading="billConf.loadStatus"
          element-loading-text="数据获取中..."
          :empty-text="
            billConf.emptyText ? billConf.emptyText : billConf.emptyText
          "
        >
          <el-table-column
            v-for="(item, index) in billTableData.title"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 打印内容部分 -->
    <div id="tablePrint" v-show="showPrint">
      <table>
        <thead style="display: table-header-group; font-weight: bold">
          <tr>
            <th>项目</th>
            <th>交款人</th>
            <th>金额</th>
            <th>交账时间</th>
            <th>状态</th>
            <th>开始时间</th>
            <th>结束时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.vname }}</td>
            <td>{{ item.uname }}</td>
            <td>{{ item.money }}</td>
            <td>{{ item.ctime }}</td>
            <td>{{ item.status_text }}</td>
            <td>{{ item.stime }}</td>
            <td>{{ item.etime }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!tableData.length" class="table-empty">
        <span>暂无数据!</span>
      </div>
    </div>
  </div>
</template>

<script src="@/assets/charge/js/accounts.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/accounts.less');
</style>
