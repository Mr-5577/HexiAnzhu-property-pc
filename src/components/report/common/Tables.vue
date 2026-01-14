<template>
  <div id="tables">
    <!-- 重新查询按钮部分 -->
    <el-button
      type="primary empty"
      :disabled="
        tableArrys[this.currentIndex ? this.currentIndex : 0].isLoading
      "
      @click="queryStart(1)"
    >
      再次查询
    </el-button>
    <el-button
      type="primary empty"
      :disabled="
        tableArrys[this.currentIndex ? this.currentIndex : 0].isLoading
      "
      @click="filterAgain"
    >
      重新查询条件
    </el-button>

    <!-- 查询条件部分 -->
    <div class="filter-wp">
      <div class="content">
        条件:
        {{
          conditions.village.join('、') +
            (conditions.subject.length > 0
              ? `;${conditions.subject.join('、')}`
              : '') +
            (conditions.stime ? `;${conditions.stime}` : '') +
            (conditions.etime ? `;${conditions.etime}` : '')
        }}
      </div>
      <span class="btn" @click="showCondition = !showCondition">
        {{ showCondition ? '点击收起' : '点击展开' }}
      </span>
      <div class="condition" v-show="showCondition">
        <div class="condition-item">
          <div class="name">查询项目</div>
          <div class="value">{{ conditions.village.join('、') }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'receivablestatistics' ||
              tableType == 'arrearsstatistics' ||
              tableType == 'advancecollectstatistics' ||
              tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics'
          "
        >
          <div class="name">查询楼栋</div>
          <div class="value">{{ conditions.build.join('、') }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'receivablestatistics' ||
              tableType == 'arrearsstatistics' ||
              tableType == 'advancecollectstatistics' ||
              tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics'
          "
        >
          <div class="name">查询单元</div>
          <div class="value">{{ conditions.unit.join('、') }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'receivablestatistics' ||
              tableType == 'arrearsstatistics' ||
              tableType == 'advancecollectstatistics'
          "
        >
          <div class="name">查询房号</div>
          <div class="value">{{ conditions.room.join('、') }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'receivablestatistics' ||
              tableType == 'arrearsstatistics' ||
              tableType == 'refundstatistics' ||
              tableType == 'financemonthstatistics' ||
              tableType == 'combinationstatistics' ||
              tableType == 'wegcoststatistics' ||
              tableType == 'sharestatistics' ||
              tableType == 'taxescomputestatistics' ||
              tableType == 'depositstatistics' ||
              tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics' ||
              tableType == 'housekeepercostcountstatistics'
          "
        >
          <div class="name">查询科目</div>
          <div class="value">{{ conditions.subject.join('、') }}</div>
        </div>
        <div
          class="condition-item"
          v-if="tableType == 'advancecollectstatistics'"
        >
          <div class="name">预收科目</div>
          <div class="value">{{ conditions.subject.join('、') }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'financemonthstatistics' ||
              tableType == 'combinationstatistics' ||
              tableType == 'budgetstatistics' ||
              tableType == 'advancecollectstatistics' ||
              tableType == 'sharestatistics' ||
              tableType == 'carrecordstatistics'
          "
        >
          <div class="name">收费方式</div>
          <div class="value">{{ conditions.payment.join('、') }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'reportstatistics'">
          <div class="name">开具发票</div>
          <div class="value">{{ conditions.invoice.join('、') }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'combinationstatistics' || tableType == 'housekeepercostcountstatistics'">
          <div class="name">交房状态</div>
          <div class="value">{{ conditions.check }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'combinationstatistics' || tableType == 'housekeepercostcountstatistics'">
          <div class="name">查询模式</div>
          <div class="value">{{ conditions.pattern }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'budgetstatistics'">
          <div class="name">年限范围</div>
          <div class="value">{{ conditions.year }}</div>
        </div>

        <div
          class="condition-item"
          v-if="
            tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics'
          "
        >
          <div class="name">分析年份数量</div>
          <div class="value">{{ conditions.yearNum }}</div>
        </div>

        <div
          class="condition-item"
          v-if="
            tableType == 'receivablestatistics' ||
              tableType == 'arrearsstatistics' ||
              tableType == 'combinationstatistics' ||
              tableType == 'wegcoststatistics' ||
              tableType == 'housekeepercostcountstatistics'
          "
        >
          <div class="name">应收开始时间</div>
          <div class="value">{{ conditions.stime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'receivablestatistics' ||
              tableType == 'arrearsstatistics' ||
              tableType == 'combinationstatistics' ||
              tableType == 'wegcoststatistics' ||
              tableType == 'housekeepercostcountstatistics'
          "
        >
          <div class="name">应收结束时间</div>
          <div class="value">{{ conditions.etime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'cashaccountstatistics' ||
              tableType == 'combinationstatistics' ||
              tableType == 'housekeepercostcountstatistics'
          "
        >
          <div class="name">实收开始时间</div>
          <div class="value">
            {{
              tableType == 'combinationstatistics' || tableType == 'housekeepercostcountstatistics'
                ? conditions.sstime
                : conditions.stime
            }}
          </div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'reportstatistics' ||
              tableType == 'cashaccountstatistics' ||
              tableType == 'combinationstatistics' ||
              tableType == 'housekeepercostcountstatistics'
          "
        >
          <div class="name">实收结束时间</div>
          <div class="value">
            {{
              tableType == 'combinationstatistics' || tableType == 'housekeepercostcountstatistics'
                ? conditions.setime
                : conditions.etime
            }}
          </div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'arrearsstatistics' || tableType == 'budgetstatistics'
          "
        >
          <div class="name">实收截止时间</div>
          <div class="value">{{ conditions.endTime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="tableType == 'advancecollectstatistics'"
        >
          <div class="name">预收开始时间</div>
          <div class="value">{{ conditions.stime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="tableType == 'advancecollectstatistics'"
        >
          <div class="name">预收结束时间</div>
          <div class="value">{{ conditions.etime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="tableType == 'advancecollectstatistics'"
        >
          <div class="name">预收截止时间</div>
          <div class="value">{{ conditions.endTime }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'refundstatistics'">
          <div class="name">退款开始时间</div>
          <div class="value">{{ conditions.stime }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'refundstatistics'">
          <div class="name">退款结束时间</div>
          <div class="value">{{ conditions.etime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'financemonthstatistics' ||
              tableType == 'taxescomputestatistics' ||
              tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics'
          "
        >
          <div class="name">开始时间</div>
          <div class="value">{{ conditions.stime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'financemonthstatistics' ||
              tableType == 'taxescomputestatistics' ||
              tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics'
          "
        >
          <div class="name">结束时间</div>
          <div class="value">{{ conditions.etime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics'
          "
        >
          <div class="name">收款开始时间</div>
          <div class="value">
            {{
              tableType == 'arrearsrecoverstatistics'
                ? conditions.sstime
                : conditions.stime
            }}
          </div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics'
          "
        >
          <div class="name">收款结束时间</div>
          <div class="value">
            {{
              tableType == 'arrearsrecoverstatistics'
                ? conditions.setime
                : conditions.etime
            }}
          </div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'arrearsanalysisstatistics' ||
              tableType == 'arrearsrecoverstatistics' ||
              tableType == 'arrearsdurationstatistics'
          "
        >
          <div class="name">截止时间</div>
          <div class="value">{{ conditions.endTime }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'sharestatistics'">
          <div class="name">月份开始时间</div>
          <div class="value">{{ conditions.stime }}</div>
        </div>
        <div class="condition-item" v-if="tableType == 'sharestatistics'">
          <div class="name">月份结束时间</div>
          <div class="value">{{ conditions.etime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'carrecordstatistics' ||
              tableType == 'depositstatistics' ||
              tableType == 'advancedepositstatistics'
          "
        >
          <div class="name">缴费开始时间</div>
          <div class="value">{{ conditions.stime }}</div>
        </div>
        <div
          class="condition-item"
          v-if="
            tableType == 'carrecordstatistics' ||
              tableType == 'depositstatistics' ||
              tableType == 'advancedepositstatistics'
          "
        >
          <div class="name">缴费结束时间</div>
          <div class="value">{{ conditions.etime }}</div>
        </div>
      </div>
    </div>

    <span class="export" @click="exportExcel">
      <workIcon name="export" class="common-right-icon" title="导出"></workIcon>
    </span>

    <el-tabs
      :class="[
        tableArrys.length == 2
          ? 'two'
          : tableArrys.length == 3
          ? 'three'
          : tableArrys.length == 4
          ? 'four'
          : ''
      ]"
      stretch
      type="border-card"
      v-model="activeName"
      @tab-click="tabClick"
    >
      <el-tab-pane
        :label="item.label"
        :name="item.name"
        v-for="(item, index) in tableArrys"
        :key="index"
      >
        <!-- 财务月报表表格（多级表头） -->
        <el-table
          v-if="tableType === 'financemonthstatistics'"
          class="finance"
          ref="financeTable"
          :data="item.tableData"
          stripe
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
          height="100%"
          :cell-class-name="cellClassName"
          @cell-click="cellClick"
        >
          <el-table-column
            prop="village"
            label="项目"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="科目名称"
            min-width="150"
          ></el-table-column>
          <el-table-column label="期初余额">
            <el-table-column
              prop="wnqf"
              label="往年欠费"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="wyqf"
              label="往月欠费"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="wyys"
              label="往月预收"
              min-width="120"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="本月应收">
            <el-table-column
              prop="jzwn"
              label="结转往年"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="jzwy"
              label="结转往月"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="byxz"
              label="本月新增"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="yszj"
              label="应收总计"
              min-width="120"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="本月实收">
            <el-table-column
              prop="sswn"
              label="实收往年"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="sswy"
              label="实收往月"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="ssby"
              label="实收本月"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="byys"
              label="本月预收"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="sszj"
              label="实收总计"
              min-width="120"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="期末余额" min-width="420">
            <el-table-column
              prop="qm_wnqf"
              label="往年欠费"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="qm_wyqf"
              label="往月欠费"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="qm_byqf"
              label="本月欠费"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="qm_byzys"
              label="本月止预收"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="qm_byft"
              label="本月分摊"
              min-width="120"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="收缴率">
            <el-table-column
              prop="slsl"
              label="收历史率"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="sbyl"
              label="收本月率"
              min-width="120"
            ></el-table-column>
          </el-table-column>
          <el-table-column label="优惠统计">
            <el-table-column
              prop="byyh"
              label="本月优惠"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="jzwyyh"
              label="结转往月优惠"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="jzwnyh"
              label="结转往年优惠"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="yhwy"
              label="优惠往月"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="yhwn"
              label="优惠往年"
              min-width="120"
            ></el-table-column>
          </el-table-column>
        </el-table>

        <!-- 当期纳税计算表表格（多级表头） -->
        <el-table
          v-if="tableType === 'taxescomputestatistics'"
          class="finance"
          ref="taxTable"
          :data="item.tableData"
          stripe
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
          height="100%"
        >
          <el-table-column
            min-width="120"
            prop="villagename"
            label="项目"
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="subject_name"
            label="科目名称"
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="yqys"
            label="以前预收"
          ></el-table-column>
          <el-table-column label="当月应收">
            <el-table-column
              min-width="120"
              prop="dyysws"
              label="当月应收未收"
            ></el-table-column>
            <el-table-column
              min-width="120"
              prop="dyysss"
              label="当月应收实收"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            min-width="120"
            prop="dyys"
            label="当月预收"
          ></el-table-column>
          <el-table-column
            min-width="150"
            prop="yqysdyys"
            label="以前预收当月应收"
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="ysye"
            label="预收余额"
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="nshj"
            label="纳税合计"
          ></el-table-column>
        </el-table>

        <!-- 三表抄表统计（多级表头） -->
        <el-table
          v-if="tableType === 'wegcoststatistics' && activeName === 'count'"
          :data="item.tableData"
          stripe
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
          height="100%"
        >
          <el-table-column
            v-if="item.tableTitles.length > 0"
            prop="villagename"
            label="项目名称"
            :width="130"
          ></el-table-column>
          <el-table-column
            :label="item.label"
            v-for="(item, index) in item.tableTitles"
            :key="index"
          >
            <el-table-column
              :prop="`no_pay${item.prop}`"
              label="未收"
            ></el-table-column>
            <el-table-column
              :prop="`has_pay${item.prop}`"
              label="已收"
            ></el-table-column>
          </el-table-column>
        </el-table>
        <div
          v-if="
            tableType === 'wegcoststatistics' &&
              activeName === 'count' &&
              item.tableTitles.length === 0
          "
          style="position: absolute; top: 40%;left: 50%;transform: translate(-50%, -50%);font-size: 0.7rem;color: #ccc;"
        >
          暂无数据！
        </div>

        <!-- 欠费报表 （多级表头） -->
        <div
          style="height: 100%;"
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
          v-if="
            (tableType === 'arrearsanalysisstatistics' &&
              activeName === 'count') ||
              (tableType === 'arrearsanalysisstatistics' &&
                activeName === 'analysis') ||
              (tableType === 'arrearsrecoverstatistics' &&
                activeName === 'analysis') ||
              (tableType === 'arrearsdurationstatistics' &&
                activeName === 'count') ||
              (tableType === 'arrearsdurationstatistics' &&
                activeName === 'info')
          "
        >
          <!-- 欠费原因统计表 （多级表头） -->
          <vxe-table
            v-if="
              tableType === 'arrearsanalysisstatistics' &&
                activeName === 'count' &&
                item.header
            "
            stripe
            border
            auto-resize
            height="auto"
            show-overflow
            highlight-hover-row
            :data="item.tableData"
            align="center"
            :scroll-x="{ enabled: false }"
          >
            <vxe-column
              title="项目名称"
              field="villagename"
              min-width="120"
            ></vxe-column>
            <vxe-column
              title="欠费总计金额"
              field="all_money"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="户数"
              field="resources_count"
              min-width="100"
            ></vxe-column>
            <vxe-colgroup title="欠费原因">
              <vxe-column
                :field="itm.prop"
                :title="itm.title"
                min-width="100"
                sortable
                v-for="(itm, i) in item.header"
                :key="i"
              ></vxe-column>
            </vxe-colgroup>
          </vxe-table>

          <!-- 欠费原因分析表 （多级表头） -->
          <vxe-table
            v-if="
              tableType === 'arrearsanalysisstatistics' &&
                activeName === 'analysis' &&
                item.header
            "
            stripe
            border
            auto-resize
            height="auto"
            show-overflow
            highlight-hover-row
            :data="item.tableData"
            align="center"
            :scroll-x="{ enabled: false }"
          >
            <vxe-column
              title="项目名称"
              field="villagename"
              min-width="120"
            ></vxe-column>
            <vxe-column
              title="欠费总计金额"
              field="all_money"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="户数"
              field="rooms_num"
              min-width="100"
            ></vxe-column>
            <vxe-colgroup
              :title="itm.title"
              v-for="(itm, i) in item.header"
              :key="i"
            >
              <vxe-column
                :field="itm.prop"
                :title="itm.cycle"
                min-width="100"
                sortable
              ></vxe-column>
            </vxe-colgroup>
          </vxe-table>

          <!-- 欠费收回分析表 （多级表头） -->
          <vxe-table
            v-if="
              tableType === 'arrearsrecoverstatistics' &&
                activeName === 'analysis' &&
                item.header
            "
            stripe
            border
            auto-resize
            height="auto"
            show-overflow
            highlight-hover-row
            :data="item.tableData"
            align="center"
            :scroll-x="{ enabled: false }"
          >
            <vxe-column
              title="项目名称"
              field="villagename"
              min-width="120"
            ></vxe-column>
            <vxe-column
              title="欠费总计金额"
              field="all_money"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="户数"
              field="rooms_num"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="欠费收回金额"
              field="pay_money"
              min-width="100"
            ></vxe-column>
            <vxe-colgroup
              :title="itm.title"
              v-for="(itm, i) in item.header"
              :key="i"
            >
              <vxe-column
                :field="itm.prop"
                :title="itm.cycle"
                min-width="100"
                sortable
              ></vxe-column>
            </vxe-colgroup>
          </vxe-table>

          <!-- 欠费时长统计表 （多级表头） -->
          <vxe-table
            v-if="
              tableType === 'arrearsdurationstatistics' &&
                activeName === 'count' &&
                item.cost_pay_num_header_year
            "
            stripe
            border
            auto-resize
            height="auto"
            show-overflow
            highlight-hover-row
            :data="item.tableData"
            align="center"
            :scroll-x="{ enabled: false }"
          >
            <vxe-column
              title="项目名称"
              field="villagename"
              min-width="120"
            ></vxe-column>
            <vxe-colgroup title="欠费金额">
              <vxe-column
                field="all_cost_money"
                title="欠费总额"
                min-width="100"
                sortable
              ></vxe-column>
              <vxe-colgroup
                :title="itm.title"
                v-for="(itm, i) in item.all_cost_header"
                :key="i"
              >
                <vxe-column
                  :field="itm.prop"
                  :title="itm.cycle"
                  min-width="120"
                  sortable
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
            <vxe-colgroup title="欠费金额收回情况">
              <vxe-column
                field="pay_cost_money"
                title="累计回收欠费金额"
                min-width="130"
                sortable
              ></vxe-column>
              <vxe-colgroup title="月份收回展示">
                <vxe-column
                  :field="itm.prop"
                  :title="itm.title"
                  min-width="120"
                  sortable
                  v-for="(itm, i) in item.pay_cost_header_month"
                  :key="i"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup
                :title="itm.title"
                v-for="(itm, i) in item.pay_cost_header_year"
                :key="i"
              >
                <vxe-column
                  :field="itm.prop"
                  :title="itm.cycle"
                  min-width="120"
                  sortable
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
            <vxe-colgroup title="欠费户数">
              <vxe-column
                field="cost_num_num"
                title="欠费总户数"
                min-width="100"
                sortable
              ></vxe-column>
              <vxe-colgroup
                :title="itm.title"
                v-for="(itm, i) in item.cost_num_header_year"
                :key="i"
              >
                <vxe-column
                  :field="itm.prop"
                  :title="itm.cycle"
                  min-width="120"
                  sortable
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
            <vxe-colgroup title="欠费户数收回情况">
              <vxe-column
                field="cost_pay_num_num"
                title="累计回收欠费户数"
                min-width="130"
                sortable
              ></vxe-column>
              <vxe-colgroup title="月份收回展示">
                <vxe-column
                  :field="itm.prop"
                  :title="itm.title"
                  min-width="120"
                  sortable
                  v-for="(itm, i) in item.cost_pay_num_header_month"
                  :key="i"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup
                :title="itm.title"
                v-for="(itm, i) in item.cost_pay_num_header_year"
                :key="i"
              >
                <vxe-column
                  :field="item.prop"
                  :title="itm.cycle"
                  min-width="120"
                  sortable
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-table>

          <!-- 欠费时长明细表 （多级表头）-->
          <vxe-table
            v-if="
              tableType === 'arrearsdurationstatistics' &&
                activeName === 'info' &&
                item.header
            "
            stripe
            border
            auto-resize
            height="auto"
            show-overflow
            highlight-hover-row
            :data="item.tableData"
            align="center"
            :scroll-x="{ enabled: false }"
          >
            <vxe-column
              title="项目名称"
              field="villagename"
              min-width="120"
            ></vxe-column>
            <vxe-column
              title="房号"
              field="resources_name"
              min-width="100"
            ></vxe-column>
            <vxe-column title="楼栋" field="block" min-width="100"></vxe-column>
            <vxe-column title="单元" field="unit" min-width="100"></vxe-column>
            <vxe-column
              title="业主姓名"
              field="owner_name"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="业主电话"
              field="owner_tel"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="欠费周期"
              field="cycle"
              min-width="100"
            ></vxe-column>
            <vxe-colgroup
              :title="itm.title"
              v-for="(itm, i) in item.header"
              :key="i"
            >
              <vxe-column
                :field="itm.prop"
                :title="itm.cycle"
                min-width="100"
                sortable
              ></vxe-column>
            </vxe-colgroup>
            <vxe-column
              title="欠费金额"
              field="cost_money"
              width="100"
            ></vxe-column>
            <vxe-column
              title="收回金额"
              field="pay_cost_money"
              min-width="100"
            ></vxe-column>
            <vxe-column
              title="收回占比"
              field="pay_proportion"
              min-width="100"
            ></vxe-column>
          </vxe-table>
        </div>

        <!-- 动态表头表格（自定义） -->
        <vxe-table
          v-if="
            tableType != 'financemonthstatistics' &&
              tableType != 'wegcoststatistics' &&
              tableType != 'arrearsanalysisstatistics' &&
              tableType != 'arrearsrecoverstatistics' &&
              tableType != 'arrearsdurationstatistics' &&
              tableType !== 'roomssubjectinfostatistics' &&
              tableType !== 'housekeepercostcountstatistics' &&
              !item.static
          "
          stripe
          border
          auto-resize
          height="auto"
          show-overflow
          highlight-hover-row
          :ref="`xeTable${index}`"
          align="center"
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
        >
          <vxe-table-column
            :field="itm.prop"
            :title="itm.label"
            :min-width="itm.width ? itm.width : 120"
            show-overflow
            v-for="(itm, index) in item.tableTitles"
            :key="index"
          ></vxe-table-column>
        </vxe-table>

        <!-- 房源收费一览表 -->
        <vxe-table
          v-if="tableType === 'roomssubjectinfostatistics'"
          stripe
          border
          auto-resize
          height="auto"
          show-overflow
          highlight-hover-row
          :ref="`xeTable${index}`"
          align="center"
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
        >
          <vxe-column
            :field="itm.prop"
            :title="itm.label"
            :min-width="itm.width ? itm.width : 120"
            show-overflow
            v-for="(itm, index) in item.tableTitles"
            :key="index"
          ></vxe-column>

          <vxe-colgroup
            :title="it.label"
            v-for="(it, i) in item.dynamicTableTitles"
            :key="it.pay_money"
          >
            <vxe-column
              :field="it.pay_money"
              title="收费金额"
              min-width="100"
              sortable
            ></vxe-column>
            <vxe-column
              :field="it.refund_money"
              title="退款金额"
              min-width="100"
              sortable
            ></vxe-column>
          </vxe-colgroup>
        </vxe-table>
        
        <!-- 楼栋管家统计表 -->
        <el-table
          v-if="tableType === 'housekeepercostcountstatistics' && activeName == 'count'"
          class="finance"
          ref="taxTable"
          :data="item.tableData"
          stripe
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
          height="100%"
        >
          <el-table-column min-width="120" prop="villagename" label="项目名称"></el-table-column>
          <el-table-column min-width="120" prop="realname" label="管家"></el-table-column>
          <el-table-column min-width="120" prop="unit_name" label="楼栋"></el-table-column>
          <el-table-column min-width="120" prop="byysje" label="本月应收金额"></el-table-column>
          <el-table-column label="应收本月">
            <el-table-column min-width="120" prop="yswn" label="应收往年"></el-table-column>
            <el-table-column min-width="120" prop="yswy" label="应收往月"></el-table-column>
            <el-table-column min-width="120" prop="ysby" label="应收本月"></el-table-column>
          </el-table-column>
          <el-table-column label="本月实收">
            <el-table-column min-width="120" prop="sswn" label="实收往年"></el-table-column>
            <el-table-column min-width="120" prop="sswy" label="实收往月"></el-table-column>
            <el-table-column min-width="120" prop="ssby" label="实收本月"></el-table-column>
            <el-table-column min-width="120" prop="byys" label="本月预收"></el-table-column>
            <el-table-column min-width="120" prop="sszj" label="实收总计"></el-table-column>
          </el-table-column>
          <el-table-column min-width="120" prop="sjl" label="收缴率"></el-table-column>
        </el-table>

        <!-- 静态表格部分 -->
        <!-- 明细表格 -->
        <vxe-table
          v-if="
            tableType != 'financemonthstatistics' &&
              tableType != 'taxescomputestatistics' &&
              tableType != 'arrearsdurationstatistics' &&
              item.static
          "
          stripe
          border
          auto-resize
          height="auto"
          show-overflow
          highlight-hover-row
          :ref="`xeTable${index}`"
          align="center"
          v-loading="item.isLoading"
          element-loading-text="数据获取中..."
        >
          <vxe-table-column
            :field="itm.prop"
            :title="itm.label"
            :min-width="itm.width ? itm.width : 120"
            show-overflow
            v-for="(itm, index) in item.columns"
            :key="index"
          ></vxe-table-column>
        </vxe-table>

        <div class="create-info" v-if="tableType === 'carrecordstatistics'">
          <span class="name">制表人：</span>
          <span class="value">{{ creater }}</span>
          <span class="name">制表日期：</span>
          <span class="value">{{ createTime }}</span>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 来源弹框 -->
    <el-dialog
      class="sourceDialog"
      :visible.sync="showSourceDialog"
      title="明细来源"
      width="60%"
      :close-on-click-modal="false"
    >
      <vxe-table
        stripe
        border
        auto-resize
        height="auto"
        show-overflow
        highlight-hover-row
        ref="sourceTable"
        align="center"
        v-loading="sourceLoading"
        element-loading-text="数据获取中..."
      >
        <vxe-table-column
          field="resources_name"
          title="资源名称"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="buildareas"
          title="资源面积"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="owner_name"
          title="客户名称"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="jzwy"
          title="结转往月"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="jzwn"
          title="结转往年"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="sswn"
          title="实收往年"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="sswy"
          title="实收往月"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="ssby"
          title="实收本月"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          field="count"
          title="小计"
          :min-width="120"
          show-overflow
        ></vxe-table-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script>
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'tables',
  props: ['tableType', 'filter', 'conditions', 'tableList'],
  components: {
    workIcon
  },
  data() {
    return {
      urlObj: {
        financemonthinfo: this.$api.state.Report.financemonthinfo.url
      },
      // 当前表格的请求接口
      url: '',
      tableArrys: this.tableList,
      // 当前 tabs 名
      activeName: '',
      // 表格基本配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 是否是复杂表头导出
      ismultiple: false,
      // 复杂表头1（第一行）
      multiHeader: [],
      // 复杂表头2（第二行）
      multiHeader2: [],
      // 复杂表头3（第三行）
      multiHeader3: [],
      // 合并配置
      merges: [],
      // 制表人
      creater: '',
      // 制表日期
      createTime: '',
      // 当前操作表格 index
      currentIndex: '',
      uid: '',
      uuid: '',
      // socket 对象
      socket: null,
      // 是否展示查询条件
      showCondition: false,
      // 是否显示明细来源弹框
      showSourceDialog: false,
      // 明细来源表格是否正在加载数据
      sourceLoading: false
    }
  },

  /**
   * 计算属性
   */
  computed: {
    // 正在查询 id
    queryId() {
      return this.$store.state.queryId
    }
  },

  watch: {
    $route() {
      let arr = JSON.parse(JSON.stringify(this.tableArrys))
      arr.forEach(item => {
        item.isLoading = false
      })
      this.tableArrys = arr
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    this.uid = sessionStorage.getItem('uid')
    this.uuid = sessionStorage.getItem('uuid')
    this.activeName = 'count'
    this.tableArrys.forEach(item => {
      item.isLoading = false // 是否正在加载
      item.tableTitles = [] // 动态表格表头列表数据
      item.headers = [] // 表格表头数据列表
      item.datas = [] // 表格数据
      item.tableName = '' // 表格标题
    })
    switch (this.tableType) {
      case 'budgetstatistics':
        this.activeName = 'net_receipts'
        break
      case 'sharestatistics':
        this.activeName = 'normal'
        break
      case 'carrecordstatistics':
        this.activeName = 'carport'
        break
    }
    if (this.tableType === 'financemonthstatistics' || this.tableType === 'housekeepercostcountstatistics') {
      this.currentIndex = 0
      this.getTableData()
    } else {
      this.tabClick({
        index: 0
      })
    }
    // 监听websoket 返回数据
    window.$socket2.onmessage = this.messageHandle
  },

  /**
   * 方法
   */
  methods: {
    // 使用es6的padStart()方法来补0
    getYMDHMS(timestamp) {
      let time = new Date(timestamp)
      let year = time.getFullYear()
      const month = (time.getMonth() + 1).toString().padStart(2, '0')
      const date = time
        .getDate()
        .toString()
        .padStart(2, '0')
      const hours = time
        .getHours()
        .toString()
        .padStart(2, '0')
      const minute = time
        .getMinutes()
        .toString()
        .padStart(2, '0')
      const second = time
        .getSeconds()
        .toString()
        .padStart(2, '0')

      return (
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hours +
        ':' +
        minute +
        ':' +
        second
      )
    },

    // tab 切换处理
    tabClick(obj) {
      if (this.currentIndex == '' || this.currentIndex != obj.index) {
        if (this.tableType != 'financemonthstatistics') {
          let index = this.currentIndex ? this.currentIndex : 0
          let table = JSON.parse(JSON.stringify(this.tableArrys[index]))
          table.isLoading = false
          this.$set(this.tableArrys, index, table)
          if (this.queryId) {
            // 清空查询队列
            this.$axios
              .post(this.$api.state.Report.delselectlist.url, {
                id: this.queryId
              })
              .then(res => {
                // 清除 查询 id
                this.$store.commit('setQueryid', '')
                this.tableInit(obj)
              })
          } else {
            this.tableInit(obj)
          }
        } else {
          this.tableInit(obj)
        }
      }
    },

    // 表格初始处理
    tableInit(obj) {
      this.currentIndex = obj.index
      if (
        this.tableType != 'ownerHouse' &&
        this.tableType != 'financemonthstatistics' &&
        this.tableType != 'carrecordstatistics'
      ) {
        this.filter.type = this.activeName
      }
      if (this.tableArrys[obj.index].tableData.length === 0) {
        this.conf = {
          loadStatus: false,
          emptyText: '',
          curPage: 1,
          limit: 20,
          dataTotal: 0
        }
        if (this.tableType == 'financemonthstatistics') {
          if (this.activeName === 'count') {
            this.tableArrys[0].tableName = '财务含税月报表'
            this.tableArrys[0].datas = this.tableArrys[0].tableData.map(
              item => {
                return [
                  item.village,
                  item.name,
                  Number(item.wnqf) ? Number(item.wnqf) : 0,
                  Number(item.wyqf) ? Number(item.wyqf) : 0,
                  Number(item.wyys) ? Number(item.wyys) : 0,
                  Number(item.jzwn) ? Number(item.jzwn) : 0,
                  Number(item.jzwy) ? Number(item.jzwy) : 0,
                  Number(item.byxz) ? Number(item.byxz) : 0,
                  Number(item.yszj) ? Number(item.yszj) : 0,
                  Number(item.sswn) ? Number(item.sswn) : 0,
                  Number(item.sswy) ? Number(item.sswy) : 0,
                  Number(item.ssby) ? Number(item.ssby) : 0,
                  Number(item.byys) ? Number(item.byys) : 0,
                  Number(item.sszj) ? Number(item.sszj) : 0,
                  Number(item.qm_wnqf) ? Number(item.qm_wnqf) : 0,
                  Number(item.qm_wyqf) ? Number(item.qm_wyqf) : 0,
                  Number(item.qm_byqf) ? Number(item.qm_byqf) : 0,
                  Number(item.qm_byzys) ? Number(item.qm_byzys) : 0,
                  Number(item.qm_byft) ? Number(item.qm_byft) : 0,
                  item.slsl,
                  item.sbyl
                ]
              }
            )
          } else {
            this.tableArrys[1].tableName = '财务不含税月报表'
            this.tableArrys[1].datas = this.tableArrys[1].tableData.map(
              item => {
                return [
                  item.village,
                  item.name,
                  Number(item.wnqf) ? Number(item.wnqf) : 0,
                  Number(item.wyqf) ? Number(item.wyqf) : 0,
                  Number(item.wyys) ? Number(item.wyys) : 0,
                  Number(item.jzwn) ? Number(item.jzwn) : 0,
                  Number(item.jzwy) ? Number(item.jzwy) : 0,
                  Number(item.byxz) ? Number(item.byxz) : 0,
                  Number(item.yszj) ? Number(item.yszj) : 0,
                  Number(item.sswn) ? Number(item.sswn) : 0,
                  Number(item.sswy) ? Number(item.sswy) : 0,
                  Number(item.ssby) ? Number(item.ssby) : 0,
                  Number(item.byys) ? Number(item.byys) : 0,
                  Number(item.sszj) ? Number(item.sszj) : 0,
                  Number(item.qm_wnqf) ? Number(item.qm_wnqf) : 0,
                  Number(item.qm_wyqf) ? Number(item.qm_wyqf) : 0,
                  Number(item.qm_byqf) ? Number(item.qm_byqf) : 0,
                  Number(item.qm_byzys) ? Number(item.qm_byzys) : 0,
                  Number(item.qm_byft) ? Number(item.qm_byft) : 0,
                  item.slsl,
                  item.sbyl
                ]
              }
            )
          }
        } else {
          this.getTableData()
        }
      }
    },

    // 明细/科目汇总数据处理
    detailCollectHandle(result, type, i) {
      if (type === 'subject') {
        let arr = [
          {
            label: '项目名称',
            prop: 'vname',
            width: '150'
          }
        ]
        if (result && result.length > 0) {
          result.forEach((item, index) => {
            let obj = {
              label: item.name,
              prop: String(index + 1),
              width: '120'
            }
            arr.push(obj)
          })
        }
        this.tableArrys[i].tableTitles = arr
        let arr1 = []
        if (result && result.length > 0) {
          result[0].village.forEach(item => {
            let obj = {
              vname: item.name
            }
            arr1.push(obj)
          })
          result.forEach((item, index) => {
            item.village.forEach((itm, i) => {
              arr1[i][String(index + 1)] = itm.money
            })
          })
        }
        result = arr1
      } else if (
        type === 'count' &&
        this.tableType === 'advancecollectstatistics'
      ) {
        let arr = [
          {
            label: '项目名称',
            prop: 'vname',
            width: '150'
          }
        ]
        if (result && result.length > 0) {
          result.forEach((item, index) => {
            let obj = {
              label: item.name,
              prop: String(index + 1),
              width: '120'
            }
            arr.push(obj)
          })
        }
        this.tableArrys[i].tableTitles = arr
        let arr1 = []
        if (result && result.length > 0) {
          result[0].village.forEach(item => {
            let obj = {
              vname: item.name
            }
            arr1.push(obj)
          })
          result.forEach((item, index) => {
            item.village.forEach((itm, i) => {
              arr1[i][String(index + 1)] = itm.money
            })
          })
        }
        result = arr1
      }
      return result
    },

    // 表格返回数据处理
    tableDataHandle(result, type) {
      let index = 0
      switch (this.tableType) {
        case 'reportstatistics':
          if (type === 'info') {
            index = 1
            result = result.return_data
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '实收明细表'
            this.tableArrys[index].headers = [
              '小区名称',
              '资源名称',
              '面积',
              '资源类型',
              '业主姓名',
              '总金额',
              '优惠金额',
              '科目名称',
              '备注',
              '支付时间',
              '订单号'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.name,
                Number(item.area) ? Number(item.area) : 0,
                item.type,
                item.owner_name,
                Number(item.money) ? Number(item.money) : 0,
                Number(item.discount_money) ? Number(item.discount_money) : 0,
                item.subject_text,
                item.bz,
                item.pay_time,
                item.sn
              ]
            })
          } else if (type === 'subject') {
            index = 2
            result = this.detailCollectHandle(result, type, index)
            this.$refs['xeTable2'][0].loadData(result)
            this.tableArrys[index].tableName = '实收科目汇总表'
            this.tableArrys[index].headers = this.tableArrys[
              index
            ].tableTitles.map(item => item.label)
            this.tableArrys[index].datas = result.map(item =>
              this.tableArrys[index].tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          } else {
            index = 0
            const xetable = this.$refs['xeTable0']
            xetable[0].loadData(result)

            this.tableArrys[index].tableName = '实收统计表'
            this.tableArrys[index].headers = [
              '管理区名称',
              '实收总计',
              '税前总计',
              '税额总计'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.real_money) ? Number(item.real_money) : 0,
                Number(item.pre_tax_money) ? Number(item.pre_tax_money) : 0,
                Number(item.tex_money) ? Number(item.tex_money) : 0
              ]
            })
          }
          break
        case 'receivablestatistics':
          if (type === 'info') {
            index = 1
            result = result.return_data
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '应收明细表'
            this.tableArrys[index].headers = [
              '小区名称',
              '资源名称',
              '面积',
              '资源类型',
              '业主姓名',
              '总金额',
              '科目名称',
              '费用归属期间'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.name,
                Number(item.area) ? Number(item.area) : 0,
                item.type,
                item.owner_name,
                Number(item.money) ? Number(item.money) : 0,
                item.subject_text,
                item.ymonth
              ]
            })
          } else if (type === 'subject') {
            index = 2
            result = this.detailCollectHandle(result, type, index)
            this.$refs['xeTable2'][0].loadData(result)

            this.tableArrys[index].tableName = '应收科目汇总表'
            this.tableArrys[index].headers = this.tableArrys[
              index
            ].tableTitles.map(item => item.label)
            this.tableArrys[index].datas = result.map(item =>
              this.tableArrys[index].tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          } else {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '应收统计表'
            this.tableArrys[index].headers = [
              '管理区名称',
              '应收总计',
              '税前总计',
              '税额总计'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.real_money) ? Number(item.real_money) : 0,
                Number(item.pre_tax_money) ? Number(item.pre_tax_money) : 0,
                Number(item.tex_money) ? Number(item.tex_money) : 0
              ]
            })
          }
          break
        case 'arrearsstatistics':
          if (type === 'info') {
            index = 1
            result = result.return_data
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '欠费明细表'
            this.tableArrys[index].headers = [
              '小区名称',
              '楼栋',
              '单元',
              '资源名称',
              '面积',
              '资源类型',
              '销售状态',
              '业主姓名',
              '联系电话',
              '总金额',
              '往年欠费金额',
              '当年欠费金额',
              '科目名称',
              '欠费年月',
              '装修状态',
              '交房状态',
              '交房时间',
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.block,
                item.unit,
                item.name,
                Number(item.area) ? Number(item.area) : 0,
                item.type,
                item.isvacancy,
                item.owner_name,
                item.tel,
                Number(item.money) ? Number(item.money) : 0,
                Number(item.pre_arrears_money) ? Number(item.pre_arrears_money) : 0,
                Number(item.now_arrears_money) ? Number(item.now_arrears_money) :
                item.subject_text,
                item.ymonth,
                item.isdecorate,
                item.check,
                item.delivery_date,
              ]
            })
          } else if (type === 'subject') {
            index = 2
            result = this.detailCollectHandle(result, type, index)
            this.$refs['xeTable2'][0].loadData(result)

            this.tableArrys[index].tableName = '欠费科目汇总表'
            this.tableArrys[index].headers = this.tableArrys[
              index
            ].tableTitles.map(item => item.label)
            this.tableArrys[index].datas = result.map(item =>
              this.tableArrys[index].tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          } else if (type === 'wg_count') {
            index = 3
            this.$refs['xeTable3'][0].loadData(result)

            this.tableArrys[index].tableName = '物业欠费统计表'
            this.tableArrys[index].headers = [
              '项目名称',
              '欠费金额',
              '已交房欠费',
              '未交房欠费',
              '欠费户数',
              '已交房户数',
              '未交房户数',
              '已装修户数',
              '未装修户数'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.money) ? Number(item.money) : 0,
                Number(item.delivery_money) ? Number(item.delivery_money) : 0,
                Number(item.not_delivery_money)
                  ? Number(item.not_delivery_money)
                  : 0,
                Number(item.rooms_num) ? Number(item.rooms_num) : 0,
                Number(item.delivery_num) ? Number(item.delivery_num) : 0,
                Number(item.not_delivery_num)
                  ? Number(item.not_delivery_num)
                  : 0,
                Number(item.isdecorate_num) ? Number(item.isdecorate_num) : 0,
                Number(item.not_isdecorate_num)
                  ? Number(item.not_isdecorate_num)
                  : 0
              ]
            })
          } else {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)

            this.tableArrys[index].tableName = '欠费统计表'
            this.tableArrys[index].headers = ['项目名称', '欠费金额']
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.money) ? Number(item.money) : 0
              ]
            })
          }
          break
        case 'advancecollectstatistics':
          if (type === 'info') {
            index = 1
            result = result.return_data
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '预收明细表'
            this.tableArrys[index].headers = [
              '小区名称',
              '资源名称',
              '面积',
              '资源类型',
              '业主姓名',
              '支付方式',
              '总金额',
              '科目名称'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.name,
                Number(item.area) ? Number(item.area) : 0,
                item.type,
                item.owner_name,
                item.payment_type,
                Number(item.money) ? Number(item.money) : 0,
                item.subject_text
              ]
            })
          } else {
            index = 0
            result = this.detailCollectHandle(result, type, index)
            this.$refs['xeTable0'][0].loadData(result)

            this.tableArrys[index].tableName = '预收统计表'
            this.tableArrys[index].headers = this.tableArrys[
              index
            ].tableTitles.map(item => item.label)
            this.tableArrys[index].datas = result.map(item =>
              this.tableArrys[index].tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          }
          break
        case 'refundstatistics':
          if (result && result.length > 0) {
            result.forEach(item => {
              item.vname = item.village ? item.village.villagename : '--'
              item.oname = item.realname ? item.realname : '--'
              item.sname = item.subject_text ? item.subject_text : '--'
            })
          }
          if (type === 'info') {
            index = 1
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '退款明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '资源名称',
              '资源类型',
              '业主姓名',
              '科目名称',
              '欠费金额',
              '缴费金额',
              '未退款金额',
              '已退金额',
              '付款时间'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.vname,
                item.model_text,
                item.resources_type_name,
                item.oname,
                item.sname,
                Number(item.money) ? Number(item.money) : 0,
                Number(item.refund_cost_money)
                  ? Number(item.refund_cost_money)
                  : '',
                Number(item.refund_cost_notrefundmoney)
                  ? Number(item.refund_cost_notrefundmoney)
                  : '',
                Number(item.refund_cost_refundmoney)
                  ? Number(item.refund_cost_refundmoney)
                  : '',
                item.pay_time_text
              ]
            })
          } else {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '退款统计表'
            this.tableArrys[index].headers = ['项目名称', '欠费金额']
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.money) ? Number(item.money) : 0
              ]
            })
          }
          break
        case 'ownerHouse':
          break
        case 'resources':
          break
        case 'financemonthstatistics':
          break
        case 'cashaccountstatistics':
          if (type === 'info') {
            index = 1
            let arr = []
            result.forEach(item => {
              let obj = {
                resources_type_name: item.resources_type_name
                  ? item.resources_type_name
                  : '--',
                resources_name: item.model_text ? item.model_text : '--',
                oname: item.realname ? item.realname : '--',
                snnum: item.fphm
                  ? item.fphm
                  : item.receipt
                  ? item.receipt
                  : '--',
                pjlx: item.fphm ? '发票' : item.receipt ? '收据' : '--',
                paytime: item.pay_time ? item.pay_time : '--',
                pname: item.u_realname ? item.u_realname : '--',
                payname: item.pay_type_name ? item.pay_type_name : '--',
                tax_rate: item.tax_rate,
                describe: item.describe ? item.describe : '--',
                money: item.money,
                discount_money: item.discount_money
              }
              arr.push(obj)
            })
            result = arr
            this.$refs['xeTable1'][0].loadData(result)

            this.tableArrys[index].tableName = '现金台账明细表'
            this.tableArrys[index].headers = [
              '资源类型',
              '资源',
              '客户',
              '票据号',
              '票据类型',
              '收费日期',
              '收款人',
              '收款方式',
              '税额',
              '收费备注',
              '总金额',
              '优惠金额'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.resources_type_name,
                item.resources_name,
                item.oname,
                item.snnum,
                item.pjlx,
                item.paytime,
                item.pname,
                item.payname,
                Number(item.tax_rate) ? Number(item.tax_rate) : 0,
                item.describe,
                Number(item.money) ? Number(item.money) : 0,
                Number(item.discount_money) ? Number(item.discount_money) : 0
              ]
            })
          } else if (type === 'subject_pay') {
            index = 2
            let arr = []
            if (result && result.length > 0) {
              result.forEach(item => {
                let obj = {
                  code: item.code ? item.code : '--',
                  village_name: item.village_name ? item.village_name : '--',
                  village_code: item.village_code ? item.village_code : '--',
                  content: item.village_name + item.name + '收入',
                  pay_money: item.pay_money ? item.pay_money : '--',
                  subject_money: item.subject_money ? item.subject_money : '--'
                }
                arr.push(obj)
              })
            }
            result = arr
            this.$refs['xeTable2'][0].loadData(result)

            this.tableArrys[index].tableName = '收费科目组合表'
            this.tableArrys[index].headers = [
              '编码',
              '项目名称',
              '项目编码',
              '摘要',
              '支付金额',
              '科目费用'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.code,
                item.village_name,
                item.village_code,
                item.content,
                Number(item.pay_money) ? Number(item.pay_money) : 0,
                Number(item.subject_money) ? Number(item.subject_money) : 0
              ]
            })
          } else if (type === 'count') {
            index = 0
            let arr = [
              {
                label: '科目名称',
                prop: 'sname',
                with: 150
              },
              {
                label: '科目总金额',
                prop: 'allmoney',
                with: 120
              },
              {
                label: '不含税金额',
                prop: 'taxmoeny',
                with: 120
              },
              {
                label: '优惠金额',
                prop: 'discountmoney',
                with: 120
              }
            ]
            if (result.pay_data && result.pay_data.length > 0) {
              result.pay_data.forEach(item => {
                let obj = {
                  label: item.name,
                  prop: item.key,
                  with: 120
                }
                arr.push(obj)
              })
            }
            this.tableArrys[index].tableTitles = arr
            let arr1 = []
            if (result.return_data && result.return_data.length > 0) {
              result.return_data.forEach(item => {
                let obj = {
                  sname: item.name,
                  allmoney: item.subject_all_moeny,
                  taxmoeny: item.subject_tax_moeny,
                  discountmoney: item.subject_discount_moeny,
                  ...item.pay_type_money
                }
                arr1.push(obj)
              })
            }
            result = arr1
            this.$refs['xeTable0'][0].loadData(result)

            this.tableArrys[index].tableName = '现金台账统计表'
            this.tableArrys[index].headers = this.tableArrys[
              index
            ].tableTitles.map(item => item.label)
            this.tableArrys[index].datas = result.map(item =>
              this.tableArrys[index].tableTitles.map(itm =>
                item[itm.prop] == 0 || Number(item[itm.prop])
                  ? Number(item[itm.prop])
                  : item[itm.prop]
              )
            )
          }
          break
        case 'combinationstatistics':
          if (type === 'info') {
            index = 1
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '组合资源明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '楼栋',
              '业主姓名',
              '资源名称',
              '资源类型',
              '应收金额',
              '实收金额',
              "优惠金额",
              '收缴率',
              '费用归属区间'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.block,
                item.owner_name,
                item.name,
                item.type,
                Number(item.ys_money) ? Number(item.ys_money) : 0,
                Number(item.ss_money) ? Number(item.ss_money) : 0,
                Number(item.discount_money) ? Number(item.discount_money) : 0,
                item.proportion,
                item.ymonth
              ]
            })
          } else if (type === 'subject') {
            index = 2
            this.$refs['xeTable2'][0].loadData(result)

            this.tableArrys[index].tableName = '组合科目汇总表'
            this.tableArrys[index].headers = [
              '科目名称',
              '应收金额',
              '实收金额',
              '收缴率'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.name,
                Number(item.ys_money) ? Number(item.ys_money) : 0,
                Number(item.ss_money) ? Number(item.ss_money) : 0,
                item.proportion
              ]
            })
          } else {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)

            this.tableArrys[index].tableName = '组合统计表'
            this.tableArrys[index].headers = [
              '项目名称',
              '应收金额',
              '实收金额',
              '收缴率'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.ys_money) ? Number(item.ys_money) : 0,
                Number(item.ss_money) ? Number(item.ss_money) : 0,
                item.proportion
              ]
            })
          }
          break
        case 'wegcoststatistics':
          if (type === 'info') {
            index = 1
            result.forEach(item => {
              item.vname = item.village ? item.village.villagename : '--'
              item.oname = item.owner ? item.owner.realname : '--'
              item.status_text = item.status == 1 ? '已交' : '未交'
              item.etime = this.getYMDHMS(item.etime * 1000)
            })
            this.$refs['xeTable1'][0].loadData(result)

            this.tableArrys[index].tableName = '三表抄表明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '业主姓名',
              '资源名称',
              '资源类型',
              '状态',
              '上次读数',
              '本次读数',
              '使用度数',
              '单价',
              '抄表时间',
              '备注'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.vname,
                item.oname,
                item.resources_name,
                item.resources_type,
                item.status_text,
                Number(item.last) ? Number(item.last) : 0,
                Number(item.this) ? Number(item.this) : 0,
                Number(item.use) ? Number(item.use) : 0,
                Number(item.price) ? Number(item.price) : 0,
                item.etime,
                item.describe
              ]
            })
          } else if (type === 'count') {
            index = 0
            let arr = []
            let header1 = ['项目名称']
            let header2 = ['']
            if (
              result.return_subject_data &&
              result.return_subject_data.length > 0
            ) {
              result.return_subject_data.forEach(item => {
                let obj = {
                  label: item.name,
                  prop: String(item.id),
                  width: 120
                }
                arr.push(obj)
                header1.push(item.name)
                header1.push('')
                header2.push('未收')
                header2.push('已收')
              })
            }
            this.tableArrys[index].tableTitles = arr
            let arr1 = []
            if (result.return_data && result.return_data.length > 0) {
              result.return_data.forEach(item => {
                let obj = {
                  villagename: item.villagename
                }
                Object.keys(item.subject).forEach(itm => {
                  obj[`no_pay${itm}`] = item.subject[itm].no_pay
                  obj[`has_pay${itm}`] = item.subject[itm].has_pay
                })
                arr1.push(obj)
              })
            }
            result = arr1

            const CELL_CODE = [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z'
            ]
            this.tableArrys[index].tableName = '三表抄表统计表'
            this.tableArrys[index].ismultiple = true
            this.tableArrys[index].multiHeader = header1
            this.tableArrys[index].multiHeader2 = header2
            this.tableArrys[index].merges = ['A1:A2']
            let all = ['项目名称']
            this.tableArrys[index].datas = result.map(item => {
              let props = [item.villagename]
              this.tableArrys[index].tableTitles.forEach(itm => {
                props.push(item[`no_pay${itm.prop}`])
                props.push(item[`has_pay${itm.prop}`])
              })
              return props
            })
            this.tableArrys[index].tableTitles.forEach(itm => {
              all.push(`no_pay${itm.prop}`)
              all.push(`has_pay${itm.prop}`)
            })
            all.forEach((item, index) => {
              if (index > 0 && index % 2 !== 0) {
                this.tableArrys[index].merges.push(
                  `${CELL_CODE[index]}1:${CELL_CODE[index + 1]}1`
                )
              }
            })
          }
          break
        case 'budgetstatistics':
          let budgetArr = [
            {
              label: '月份',
              prop: 'month'
            }
          ]
          if (
            result.return_subject_data &&
            result.return_subject_data.length > 0
          ) {
            result.return_subject_data.forEach(item => {
              let obj = {
                label: item.name,
                prop: String(item.id),
                width: '120'
              }
              budgetArr.push(obj)
            })
          }
          let budgetArr1 = []
          if (result.return_data && result.return_data.length > 0) {
            result.return_data.forEach(item => {
              let obj = {
                month: item.month + '月',
                ...item.subject_data
              }
              budgetArr1.push(obj)
            })
          }
          result = budgetArr1

          if (type === 'share') {
            index = 1
            this.tableArrys[index].tableTitles = budgetArr
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '预算分摊统计表'
          } else {
            index = 0
            this.tableArrys[index].tableTitles = budgetArr
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '预算实收统计表'
          }
          this.tableArrys[index].headers = this.tableArrys[
            index
          ].tableTitles.map(item => item.label)
          this.tableArrys[index].datas = result.map(item =>
            this.tableArrys[index].tableTitles.map(itm =>
              Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
            )
          )
          break
        case 'sharestatistics':
          let apparr = [
            {
              label: '收款月份',
              prop: 'month'
            }
          ]
          if (result.header && result.header.length > 0) {
            result.header.forEach(item => {
              let obj = {
                label: item.name,
                prop: String(item.time),
                width: '120'
              }
              apparr.push(obj)
            })
          }

          let apparr1 = []
          if (result.return_data && result.return_data.length > 0) {
            result.return_data.forEach(item => {
              let obj = {
                month: item.month,
                ...item.time_money
              }
              apparr1.push(obj)
            })
          }
          result = apparr1
          if (type === 'ex_tax') {
            index = 1
            this.tableArrys[index].tableTitles = apparr
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '分摊不含税统计表'
          } else {
            index = 0
            this.tableArrys[index].tableTitles = apparr
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '分摊含税统计表'
          }
          this.tableArrys[index].headers = this.tableArrys[
            index
          ].tableTitles.map(item => item.label)
          this.tableArrys[index].datas = result.map(item =>
            this.tableArrys[index].tableTitles.map(itm =>
              item[itm.prop] == 0 || Number(item[itm.prop])
                ? Number(item[itm.prop])
                : item[itm.prop]
            )
          )
          break
        case 'carrecordstatistics':
          index = 0
          this.creater = result.tablemaker ? result.tablemaker.user : ''
          this.createTime = result.tablemaker ? result.tablemaker.time : ''
          result = result.data
          this.$refs['xeTable0'][0].loadData(result)

          this.tableArrys[index].tableName = '停车场收费统计报表'
          this.tableArrys[index].headers = [
            '项目名称',
            '应收',
            '实收',
            '减免',
            '减免占比率'
          ]
          if (result && result.length > 0) {
            result.forEach(item => {
              let arr = [
                item.name,
                Number(item.need_pay) ? Number(item.need_pay) : 0,
                Number(item.pay_money) ? Number(item.pay_money) : 0,
                Number(item.reduction_money) ? Number(item.reduction_money) : 0,
                item.reduction_proportion
              ]
              this.tableArrys[index].datas.push(arr)
            })
          }
          break
        case 'depositstatistics':
          if (type === 'count') {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '押金汇总表'
            this.tableArrys[index].headers = [
              '项目名称',
              '科目名称',
              '期初金额',
              '本期增加',
              '本期减少',
              '期末余额'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.subject_name,
                Number(item.begin_time_money)
                  ? Number(item.begin_time_money)
                  : 0,
                Number(item.this_time_add_money)
                  ? Number(item.this_time_add_money)
                  : 0,
                Number(item.this_time_del_money)
                  ? Number(item.this_time_del_money)
                  : 0,
                Number(item.end_time_money) ? Number(item.end_time_money) : 0
              ]
            })
          } else if (type === 'owner_info') {
            index = 1
            this.$refs['xeTable1'][0].loadData(result)

            this.tableArrys[index].tableName = '押金客户明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '科目名称',
              '客户名称',
              '期初金额',
              '本期增加',
              '本期减少',
              '期末余额'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.subject_name,
                item.owner_name,
                Number(item.begin_time_money)
                  ? Number(item.begin_time_money)
                  : 0,
                Number(item.this_time_add_money)
                  ? Number(item.this_time_add_money)
                  : 0,
                Number(item.this_time_del_money)
                  ? Number(item.this_time_del_money)
                  : 0,
                Number(item.end_time_money) ? Number(item.end_time_money) : 0
              ]
            })
          } else if (type === 'order_info') {
            index = 2
            this.$refs['xeTable2'][0].loadData(result)

            this.tableArrys[index].tableName = '预存款订单明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '科目名称',
              '客户名称',
              '资源名称',
              '订单号',
              '金额',
              '收款方式',
              '对方科目'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.village_name,
                item.subject_name,
                item.realname,
                item.model_text,
                item.sn,
                Number(item.money) ? Number(item.money) : 0,
                item.payment_type_name,
                item.other_subject
              ]
            })
          }
          break
        case 'advancedepositstatistics':
          if (type === 'count') {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '预存款汇总表'
            this.tableArrys[index].headers = [
              '项目名称',
              '期初金额',
              '本期增加',
              '本期减少',
              '期末余额'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                Number(item.begin_time_money)
                  ? Number(item.begin_time_money)
                  : 0,
                Number(item.this_time_add_money)
                  ? Number(item.this_time_add_money)
                  : 0,
                Number(item.this_time_del_money)
                  ? Number(item.this_time_del_money)
                  : 0,
                Number(item.end_time_money) ? Number(item.end_time_money) : 0
              ]
            })
          } else if (type === 'owner_info') {
            index = 1
            this.$refs['xeTable1'][0].loadData(result)

            this.tableArrys[index].tableName = '预存款客户明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '客户名称',
              '期初金额',
              '本期增加',
              '本期减少',
              '期末余额'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.village_name,
                item.owner_name,
                Number(item.begin_time_money)
                  ? Number(item.begin_time_money)
                  : 0,
                Number(item.this_time_add_money)
                  ? Number(item.this_time_add_money)
                  : 0,
                Number(item.this_time_del_money)
                  ? Number(item.this_time_del_money)
                  : 0,
                Number(item.end_time_money) ? Number(item.end_time_money) : 0
              ]
            })
          } else if (type === 'order_info') {
            index = 2
            this.$refs['xeTable2'][0].loadData(result)

            this.tableArrys[index].tableName = '预存款订单明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '客户名称',
              '订单号',
              '金额',
              '收款方式',
              '对方科目'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.village_name,
                item.realname,
                item.sn,
                Number(item.money) ? Number(item.money) : 0,
                item.payment_type_name,
                item.other_subject
              ]
            })
          }
          break
        case 'arrearsanalysisstatistics':
          if (type === 'info') {
            index = 1
            this.$refs['xeTable1'][0].loadData(result)
            this.tableArrys[index].tableName = '欠费原因明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '楼栋',
              '单元',
              '房号',
              '面积',
              '欠费金额',
              '交房状态',
              '装修状态',
              '业主名称',
              '联系方式',
              '欠费周期',
              '欠费原因',
              '欠费原因备注'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.block,
                item.unit,
                item.resources_name,
                item.buildareas,
                item.money,
                item.rooms_check,
                item.rooms_renovation,
                item.owner_name,
                item.owner_tel,
                item.cycle,
                item.arrears_reson_name,
                item.reason
              ]
            })
          }
          break
        case 'arrearsrecoverstatistics':
          if (type === 'count') {
            index = 0
            this.$refs['xeTable0'][0].loadData(result)
            this.tableArrys[index].tableName = '欠费收回统计表'
            this.tableArrys[index].headers = [
              '项目名称',
              '欠费总计金额',
              '欠费总计户数',
              '欠费收回金额',
              '欠费收回金额占比',
              '欠费收回户数',
              '欠费收回户数占比',
              '欠费收回100%户数',
              '欠费收回100%户数占比'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.villagename,
                item.all_money,
                item.rooms_num,
                item.pay_money,
                item.pay_proportion,
                item.pay_rooms_num,
                item.pay_rooms_num_proportion,
                item.pay_all_num,
                item.pay_all_num_proportion
              ]
            })
          } else if (type === 'info') {
            index = 1
            this.$refs['xeTable1'][0].loadData(result)

            this.tableArrys[index].tableName = '欠费收回明细表'
            this.tableArrys[index].headers = [
              '项目名称',
              '楼栋',
              '单元',
              '房号',
              '面积',
              '交房状态',
              '装修状态',
              '业主名称',
              '联系方式',
              '费用周期',
              '金额'
            ]
            this.tableArrys[index].datas = result.map(item => {
              return [
                item.village_name,
                item.block,
                item.unit,
                item.resources_name,
                item.buildareas,
                item.rooms_check,
                item.rooms_renovation,
                item.owner_name,
                item.owner_tel,
                item.cycle,
                item.money
              ]
            })
          }
          break;
          case 'housekeepercostcountstatistics':  // 楼栋管家导出
          break;
      }
      this.tableArrys[index].tableData = result
    },

    // 获取表格数据
    getTableData() {
      if (
        (this.activeName === 'info' &&
          (this.tableType == 'reportstatistics' ||
            this.tableType == 'receivablestatistics' ||
            this.tableType == 'arrearsstatistics' ||
            this.tableType == 'advancecollectstatistics' ||
            this.tableType == 'refundstatistics' ||
            this.tableType == 'cashaccountstatistics' ||
            this.tableType == 'combinationstatistics' ||
            this.tableType == 'wegcoststatistics' ||
            this.tableType == 'arrearsanalysisstatistics' ||
            this.tableType == 'arrearsrecoverstatistics' ||
            this.tableType == 'arrearsdurationstatistics')) ||
        (this.tableType == 'depositstatistics' &&
          (this.activeName === 'owner_info' ||
            this.activeName === 'order_info')) ||
        (this.tableType == 'advancedepositstatistics' &&
          (this.activeName === 'owner_info' ||
            this.activeName === 'order_info'))
      ) {
        this.$confirm(`明细报表数据可能过多，请选择一个操作`, '提示', {
          confirmButtonText: '下载报表',
          cancelButtonText: '查询报表'
        })
          .then(res => {
            this.queryStart(2)
          })
          .catch(() => {
            this.queryStart(1)
          })
      } else {
        this.queryStart(1)
      }
    },

    // 发起报表查询
    queryStart(isExcel) {
      if (this.tableType == '') {
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[0].isLoading = true
        arr[1].isLoading = true
        this.tableArrys = arr
      } else {
        let obj = JSON.parse(JSON.stringify(this.tableArrys[this.currentIndex]))
        obj.isLoading = isExcel === 2 ? false : true
        this.$set(this.tableArrys, this.currentIndex, obj)
      }
      let data = {
        select: this.tableType,
        type: this.activeName,
        uuid: this.uuid,
        uid: this.uid,
        data: this.filter,
        info_select_type: isExcel
      }
      this.$axios
        .post(this.$api.state.Report.addreportquery.url, data)
        .then(res => {
          if (res.Code === 200) {
            if (isExcel == 1) {
              this.$store.commit('setQueryid', res.Data.id)
            } else {
              this.$store.commit('setMsgStatus', true)
              this.$notify({
                type: 'success',
                title: '温馨提示',
                message:
                  '下载已添加到查询队列，查询完毕后可到消息中心查看或下载！',
                duration: 1500
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: res.Message ? res.Message : '报表数据查询失败！'
            })
            let obj = JSON.parse(
              JSON.stringify(this.tableArrys[this.currentIndex])
            )
            obj.isLoading = false
            this.$set(this.tableArrys, this.currentIndex, obj)
          }
        })
    },

    // 监听数据返回处理
    messageHandle(res) {
      if (res.data && res.data.startsWith('{')) {
        let result = JSON.parse(res.data)
        if (this.tableType == result.select) {
          if (result.is_excel != 1) {
            let index = this.tableArrys.findIndex(
              item => item.name === result.type
            )
            if (result.code == 200) {
              // 清除 查询 id
              this.$store.commit('setQueryid', '')
              if (result.data) {
                this.returnTypeJudg(result)
              } else {
                this.tableDataHandle([], result.type)
              }
              let obj = JSON.parse(JSON.stringify(this.tableArrys[index]))
              obj.isLoading = false
              this.$set(this.tableArrys, index, obj)
            } else if (result.code == 300) {
              let msg = result.msg ? result.msg : '表格数据查询队列中！'
              this.$message({
                type: 'warning',
                message: msg
              })
            } else {
              if (result.code == 500) {
                // 清除 查询 id
                this.$store.commit('setQueryid', '')
              }
              let obj = JSON.parse(JSON.stringify(this.tableArrys[index]))
              let msg = result.msg ? result.msg : '表格数据获取失败！'
              this.$message({
                type: 'error',
                message: msg
              })
              obj.isLoading = false
              this.$set(this.tableArrys, index, obj)
            }
          }
        } else {
          if (result.code && result.code != 200) {
            let msg = result.msg ? result.msg : '表格数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        }
      }
    },

    // 返回数据类型判断处理
    returnTypeJudg(result) {
      let na = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
      if (this.tableType === 'financemonthstatistics') {
        let arr1 = []
        let arr2 = []
        result.data.data.forEach(item => {
          item.return_data.forEach(itm => {
            itm.village = item.villagename
            arr1.push(itm)
          })
          item.return_data_no_tex.forEach(itm => {
            itm.village = item.villagename
            arr2.push(itm)
          })
        })
        this.tableArrys[0].tableData = arr1
        this.tableArrys[1].tableData = arr2

        this.tableArrys[0].ismultiple = true
        this.tableArrys[1].ismultiple = true
        this.tableArrys[0].multiHeader = [
          '项目',
          '科目名称',
          '期初余额',
          '',
          '',
          '本月应收',
          '',
          '',
          '',
          '本月实收',
          '',
          '',
          '',
          '',
          '期末余额',
          '',
          '',
          '',
          '',
          '收缴率',
          ''
        ]
        this.tableArrys[1].multiHeader = [
          '项目',
          '科目名称',
          '期初余额',
          '',
          '',
          '本月应收',
          '',
          '',
          '',
          '本月实收',
          '',
          '',
          '',
          '',
          '期末余额',
          '',
          '',
          '',
          '',
          '收缴率',
          ''
        ]
        this.tableArrys[0].multiHeader2 = [
          '',
          '',
          '往年欠费',
          '往月欠费',
          '往月预收',
          '结转往年',
          '结转往月',
          '本月新增',
          '应收总计',
          '实收往年',
          '实收往月',
          '实收本月',
          '本月预收',
          '实收总计',
          '往年欠费',
          '往月欠费',
          '本月欠费',
          '本月止预收',
          '本月分摊',
          '收历史率',
          '收本月率'
        ]
        this.tableArrys[1].multiHeader2 = [
          '',
          '',
          '往年欠费',
          '往月欠费',
          '往月预收',
          '结转往年',
          '结转往月',
          '本月新增',
          '应收总计',
          '实收往年',
          '实收往月',
          '实收本月',
          '本月预收',
          '实收总计',
          '往年欠费',
          '往月欠费',
          '本月欠费',
          '本月止预收',
          '本月分摊',
          '收历史率',
          '收本月率'
        ]
        this.tableArrys[0].merges = [
          'A1:A2',
          'B1:B2',
          'C1:E1',
          'F1:I1',
          'J1:N1',
          'O1:S1',
          'T1:U1'
        ]
        this.tableArrys[1].merges = [
          'A1:A2',
          'B1:B2',
          'C1:E1',
          'F1:I1',
          'J1:N1',
          'O1:S1',
          'T1:U1'
        ]
        this.tableArrys[0].tableName = '财务含税月报表'
        this.tableArrys[0].datas = this.tableArrys[0].tableData.map(item => {
          return [
            item.village,
            item.name,
            Number(item.wnqf) ? Number(item.wnqf) : 0,
            Number(item.wyqf) ? Number(item.wyqf) : 0,
            Number(item.wyys) ? Number(item.wyys) : 0,
            Number(item.jzwn) ? Number(item.jzwn) : 0,
            Number(item.jzwy) ? Number(item.jzwy) : 0,
            Number(item.byxz) ? Number(item.byxz) : 0,
            Number(item.yszj) ? Number(item.yszj) : 0,
            Number(item.sswn) ? Number(item.sswn) : 0,
            Number(item.sswy) ? Number(item.sswy) : 0,
            Number(item.ssby) ? Number(item.ssby) : 0,
            Number(item.byys) ? Number(item.byys) : 0,
            Number(item.sszj) ? Number(item.sszj) : 0,
            Number(item.qm_wnqf) ? Number(item.qm_wnqf) : 0,
            Number(item.qm_wyqf) ? Number(item.qm_wyqf) : 0,
            Number(item.qm_byqf) ? Number(item.qm_byqf) : 0,
            Number(item.qm_byzys) ? Number(item.qm_byzys) : 0,
            Number(item.qm_byft) ? Number(item.qm_byft) : 0,
            item.slsl,
            item.sbyl
          ]
        })
        this.tableArrys[1].tableName = '财务不含税月报表'
        this.tableArrys[1].datas = this.tableArrys[1].tableData.map(item => {
          return [
            item.village,
            item.name,
            Number(item.wnqf) ? Number(item.wnqf) : 0,
            Number(item.wyqf) ? Number(item.wyqf) : 0,
            Number(item.wyys) ? Number(item.wyys) : 0,
            Number(item.jzwn) ? Number(item.jzwn) : 0,
            Number(item.jzwy) ? Number(item.jzwy) : 0,
            Number(item.byxz) ? Number(item.byxz) : 0,
            Number(item.yszj) ? Number(item.yszj) : 0,
            Number(item.sswn) ? Number(item.sswn) : 0,
            Number(item.sswy) ? Number(item.sswy) : 0,
            Number(item.ssby) ? Number(item.ssby) : 0,
            Number(item.byys) ? Number(item.byys) : 0,
            Number(item.sszj) ? Number(item.sszj) : 0,
            Number(item.qm_wnqf) ? Number(item.qm_wnqf) : 0,
            Number(item.qm_wyqf) ? Number(item.qm_wyqf) : 0,
            Number(item.qm_byqf) ? Number(item.qm_byqf) : 0,
            Number(item.qm_byzys) ? Number(item.qm_byzys) : 0,
            Number(item.qm_byft) ? Number(item.qm_byft) : 0,
            item.slsl,
            item.sbyl
          ]
        })
        this.$nextTick(() => {
          this.$refs.financeTable[0].doLayout()
        })
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[0].isLoading = false
        arr[1].isLoading = false
        this.tableArrys = arr
      } else if (this.tableType === 'taxescomputestatistics') {
        this.tableArrys[0].tableData = result.data ? result.data : []
        this.tableArrys[0].ismultiple = true
        this.tableArrys[0].multiHeader = [
          '项目',
          '科目名称',
          '以前预收',
          '当月应收',
          '',
          '当月预收',
          '以前预收当月应收',
          '预收余额',
          '纳税合计'
        ]
        this.tableArrys[0].multiHeader2 = [
          '',
          '',
          '',
          '当月应收未收',
          '当月应收实收',
          '',
          '',
          '',
          ''
        ]
        this.tableArrys[0].merges = [
          'A1:A2',
          'B1:B2',
          'C1:C2',
          'D1:E1',
          'F1:F2',
          'G1:G2',
          'H1:H2',
          'I1:I2'
        ]
        this.tableArrys[0].tableName = '当期纳税计算表'
        this.tableArrys[0].datas = this.tableArrys[0].tableData.map(item => {
          return [
            item.villagename,
            item.subject_name,
            Number(item.yqys) ? Number(item.yqys) : 0,
            Number(item.dyysws) ? Number(item.dyysws) : 0,
            Number(item.dyysss) ? Number(item.dyysss) : 0,
            Number(item.dyys) ? Number(item.dyys) : 0,
            Number(item.yqysdyys) ? Number(item.yqysdyys) : 0,
            Number(item.ysye) ? Number(item.ysye) : 0,
            Number(item.nshj) ? Number(item.nshj) : 0
          ]
        })
        this.$nextTick(() => {
          this.$refs.taxTable[0].doLayout()
        })
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[0].isLoading = false
        this.tableArrys = arr
      } else if (
        this.tableType === 'arrearsanalysisstatistics' &&
        result.type === 'count'
      ) {
        this.tableArrys[0].tableData =
          result.data && result.data.data ? result.data.data : []
        this.tableArrys[0].header =
          result.data && result.data.header ? result.data.header : []
        this.tableArrys[0].ismultiple = true
        this.tableArrys[0].multiHeader = [
          '项目名称',
          '欠费总计金额',
          '户数',
          '欠费原因'
        ]
        this.tableArrys[0].multiHeader2 = ['', '', '']
        result.data.header.forEach((item, index) => {
          if (index !== 0) {
            this.tableArrys[0].multiHeader.push('')
          }
          this.tableArrys[0].multiHeader2.push(item.title)
        })
        let cna = ''
        if (result.data.header.length + 3 > 26) {
          cna = 'A' + na[result.data.header.length - 24]
        } else {
          cna = na[result.data.header.length + 2]
        }
        this.tableArrys[0].merges = [
          'A1:A2',
          'B1:B2',
          'C1:C2',
          `D1:${cna === 'D' ? 'D2' : cna + '1'}`
        ]
        this.tableArrys[0].tableName = '欠费原因统计表'
        this.tableArrys[0].datas = this.tableArrys[0].tableData.map(item => {
          let obj = [item.villagename, item.all_money, item.resources_count]
          result.data.header.forEach(itm => {
            obj.push(item[itm.prop])
          })
          return obj
        })
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[0].isLoading = false
        this.tableArrys = arr
      } else if (
        this.tableType === 'arrearsanalysisstatistics' &&
        result.type === 'analysis'
      ) {
        this.tableArrys[2].tableData =
          result.data && result.data.data ? result.data.data : []
        this.tableArrys[2].header =
          result.data && result.data.header ? result.data.header : []
        this.tableArrys[2].ismultiple = true
        this.tableArrys[2].multiHeader = ['项目名称', '欠费总计金额', '户数']
        this.tableArrys[2].multiHeader2 = ['', '', '']
        result.data.header.forEach((item, index) => {
          this.tableArrys[2].multiHeader.push(`${item.title}（${item.cycle}）`)
          this.tableArrys[2].multiHeader2.push(item.cycle)
        })
        let cna = ''
        if (result.data.header.length + 3 > 26) {
          cna = 'A' + na[result.data.header.length - 24]
        } else {
          cna = na[result.data.header.length + 2]
        }
        this.tableArrys[2].merges = [
          'A1:A2',
          'B1:B2',
          'C1:C2',
          `D1:${cna === 'D' ? 'D2' : cna + '1'}`
        ]
        this.tableArrys[2].tableName = '欠费原因分析表'
        this.tableArrys[2].datas = this.tableArrys[2].tableData.map(item => {
          let obj = [item.villagename, item.all_money, item.rooms_num]
          result.data.header.forEach(itm => {
            obj.push(item[itm.prop])
          })
          return obj
        })
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[2].isLoading = false
        this.tableArrys = arr
      } else if (
        this.tableType === 'arrearsrecoverstatistics' &&
        result.type === 'analysis'
      ) {
        this.tableArrys[2].tableData =
          result.data && result.data.data ? result.data.data : []
        this.tableArrys[2].header =
          result.data && result.data.header ? result.data.header : []
        this.tableArrys[2].ismultiple = true
        this.tableArrys[2].multiHeader = [
          '项目名称',
          '欠费总计金额',
          '户数',
          '欠费收回金额'
        ]
        this.tableArrys[2].multiHeader2 = ['', '', '', '']
        result.data.header.forEach((item, index) => {
          this.tableArrys[2].multiHeader.push(`${item.title}（${item.cycle}）`)
          this.tableArrys[2].multiHeader2.push(item.cycle)
        })
        let cna = ''
        if (result.data.header.length + 4 > 26) {
          cna = 'A' + na[result.data.header.length - 23]
        } else {
          cna = na[result.data.header.length + 3]
        }
        this.tableArrys[2].merges = [
          'A1:A2',
          'B1:B2',
          'C1:C2',
          'D1:D2',
          `E1:${cna === 'E' ? 'E2' : cna + '1'}`
        ]
        this.tableArrys[2].tableName = '欠费收回分析表'
        this.tableArrys[2].datas = this.tableArrys[2].tableData.map(item => {
          let obj = [
            item.villagename,
            item.all_money,
            item.rooms_num,
            item.pay_money
          ]
          result.data.header.forEach(itm => {
            obj.push(item[itm.prop])
          })
          return obj
        })
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[2].isLoading = false
        this.tableArrys = arr
      } else if (
        this.tableType === 'arrearsdurationstatistics' &&
        result.type === 'count'
      ) {
        this.tableArrys[0].tableData =
          result.data && result.data.data ? result.data.data : []
        this.tableArrys[0].all_cost_header = result.data.all_cost_header
        this.tableArrys[0].pay_cost_header_year =
          result.data.pay_cost_header_year
        this.tableArrys[0].pay_cost_header_month =
          result.data.pay_cost_header_month
        this.tableArrys[0].cost_num_header_year =
          result.data.cost_num_header_year
        this.tableArrys[0].cost_pay_num_header_year =
          result.data.cost_pay_num_header_year
        this.tableArrys[0].cost_pay_num_header_month =
          result.data.cost_pay_num_header_month
        this.tableArrys[0].ismultiple = true
        this.tableArrys[0].multiHeader = ['项目名称']
        this.tableArrys[0].multiHeader2 = ['']
        this.tableArrys[0].multiHeader3 = ['']
        result.data.all_cost_header.forEach((item, index) => {
          if (index === 0) {
            this.tableArrys[0].multiHeader.push('欠费金额')
            this.tableArrys[0].multiHeader2.push('欠费总额')
            this.tableArrys[0].multiHeader3.push('')
          }
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader2.push(item.title)
          this.tableArrys[0].multiHeader3.push(item.cycle)
        })
        result.data.pay_cost_header_month.forEach((item, index) => {
          if (index === 0) {
            this.tableArrys[0].multiHeader.push('欠费金额收回情况')
            this.tableArrys[0].multiHeader2.push('累计收回欠费金额')
            this.tableArrys[0].multiHeader2.push('月份收回展示')
            this.tableArrys[0].multiHeader3.push('')
          } else {
            this.tableArrys[0].multiHeader2.push('')
          }
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader3.push(item.title)
        })
        result.data.pay_cost_header_year.forEach((item, index) => {
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader2.push(item.title)
          this.tableArrys[0].multiHeader3.push(item.cycle)
        })
        result.data.cost_num_header_year.forEach((item, index) => {
          if (index === 0) {
            this.tableArrys[0].multiHeader.push('欠费户数')
            this.tableArrys[0].multiHeader2.push('欠费总户数')
            this.tableArrys[0].multiHeader3.push('')
          }
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader2.push(item.title)
          this.tableArrys[0].multiHeader3.push(item.cycle)
        })
        result.data.cost_pay_num_header_month.forEach((item, index) => {
          if (index === 0) {
            this.tableArrys[0].multiHeader.push('欠费户数收回情况')
            this.tableArrys[0].multiHeader2.push('累计收回欠费户数')
            this.tableArrys[0].multiHeader2.push('月份收回展示')
            this.tableArrys[0].multiHeader3.push('')
          } else {
            this.tableArrys[0].multiHeader2.push('')
          }
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader3.push(item.title)
        })
        result.data.cost_pay_num_header_year.forEach((item, index) => {
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader2.push(item.title)
          this.tableArrys[0].multiHeader3.push(item.cycle)
        })
        let len1 = result.data.all_cost_header.length + 1
        let len2 =
          result.data.pay_cost_header_month.length +
          result.data.pay_cost_header_year.length +
          1
        let len3 = result.data.cost_num_header_year.length + 1
        let len4 =
          result.data.cost_pay_num_header_month.length +
          result.data.cost_pay_num_header_year.length +
          1
        let cna1 = ''
        let cna11 = ''
        let cna2 = ''
        let cna22 = ''
        let cna3 = ''
        let cna33 = ''
        let cna4 = ''
        if (len1 + 1 > 26) {
          cna1 = 'A' + na[len1 - 26]
          cna11 = 'A' + na[len1 - 25]
        } else {
          cna1 = na[len1]
          cna11 = na[len1 + 1]
        }
        if (len1 + len2 + 1 > 26) {
          cna2 = 'A' + na[len1 + len2 - 26]
          cna22 = 'A' + na[len1 + len2 - 25]
        } else {
          cna2 = na[len1 + len2]
          cna22 = na[len1 + len2 + 1]
        }
        if (len1 + len2 + len3 + 1 > 26) {
          cna3 = 'A' + na[len1 + len2 + len3 - 26]
          cna33 = 'A' + na[len1 + len2 + len3 - 25]
        } else {
          cna3 = na[len1 + len2 + len3]
          cna33 = na[len1 + len2 + len3 + 1]
        }
        if (len1 + len2 + len3 + len4 + 1 > 26) {
          cna4 = 'A' + na[len1 + len2 + len3 + len4 - 26]
        } else {
          cna4 = na[len1 + len2 + len3 + len4]
        }
        this.tableArrys[0].merges = [
          'A1:A3',
          `B1:${cna1 + '1'}`,
          `${cna11 + '1'}:${cna2 + '1'}`,
          `${cna22 + '1'}:${cna3 + '1'}`,
          `${cna33 + '1'}:${cna4 + '1'}`
        ]
        this.tableArrys[0].tableName = '欠费时长统计表'
        this.tableArrys[0].datas = this.tableArrys[0].tableData.map(item => {
          let obj = [item.villagename, item.all_cost_money]
          result.data.all_cost_header.forEach(itm => {
            obj.push(item[itm.prop])
          })
          obj.push(item.pay_cost_money)
          result.data.pay_cost_header_month.forEach(itm => {
            obj.push(item[itm.prop])
          })
          result.data.pay_cost_header_year.forEach(itm => {
            obj.push(item[itm.prop])
          })
          obj.push(item.cost_num_num)
          result.data.cost_num_header_year.forEach(itm => {
            obj.push(item[itm.prop])
          })
          obj.push(item.cost_pay_num_num)
          result.data.cost_pay_num_header_month.forEach(itm => {
            obj.push(item[itm.prop])
          })
          result.data.cost_pay_num_header_year.forEach(itm => {
            obj.push(item[itm.prop])
          })
          return obj
        })
        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[0].isLoading = false
        this.tableArrys = arr
      } else if (
        this.tableType === 'roomssubjectinfostatistics' &&
        result.type === 'count'
      ) {
        this.tableArrys[0].tableData =
          result.data && result.data.data ? result.data.data : []
        this.$refs['xeTable0'][0].loadData(result.data.data)

        /***动态表头 **/
        let dynamicTableTitles = []
        result.data.subject.forEach((item, index) => {
          dynamicTableTitles.push({
            label: item.name,
            pay_money: 'pay' + item.id,
            refund_money: 'refund' + item.id
          })
        })
        this.tableArrys[0].dynamicTableTitles = dynamicTableTitles

        /****************导出需要数据*******************/
        this.tableArrys[0].header =
          result.data && result.data.header ? result.data.header : []
        this.tableArrys[0].ismultiple = true
        this.tableArrys[0].multiHeader = [
          '项目',
          '房号',
          '资源类型',
          '房屋面积',
          '现业主名字',
          '交房状态',
          '装修状态',
          '入住状态'
        ]
        this.tableArrys[0].multiHeader2 = ['', '', '', '', '', '', '', '']
        this.tableArrys[0].merges = [
          'A1:A2',
          'B1:B2',
          'C1:C2',
          'D1:D2',
          'E1:E2',
          'F1:F2',
          'G1:G2',
          'H1:H2'
        ]

        result.data.subject.forEach((item, index) => {
          this.tableArrys[0].multiHeader.push(`${item.name}`)
          this.tableArrys[0].multiHeader.push('')
          this.tableArrys[0].multiHeader2.push('收费金额')
          this.tableArrys[0].multiHeader2.push('退费金额')
          let a = parseInt((index * 2 + 9) / 26)
          let b = (index * 2 + 9) % 26
          if (index * 2 + 9 < 26) {
            this.tableArrys[0].merges.push(
              `${na[8 + index * 2]}1:${na[9 + index * 2]}1`
            )
          } else if (b === 0) {
            this.tableArrys[0].merges.push(`${na[a]}Z1:${na[a + 1]}${na[0]}1`)
          } else {
            this.tableArrys[0].merges.push(
              `${na[a]}${na[b - 1]}1:${na[a]}${na[b]}1`
            )
          }
        })
        this.tableArrys[0].tableName = '房源欠费一览表'

        this.tableArrys[0].datas = this.tableArrys[0].tableData.map(item => {
          let arr = [
            item.villagename,
            item.roomnum,
            item.resources_type_name,
            item.buildareas,
            item.realname,
            item.check,
            item.isdecorate,
            item.into_house
          ]
          result.data.subject.forEach((itm, index) => {
            arr.push(item[`pay${itm.id}`])
            arr.push(item[`refund${itm.id}`])
          })
          return arr
        })
        /****************导出需要数据结束*******************/

        /****************页面表格需要数据*******************/
        this.tableArrys[0].tableTitles = [
          {
            prop: 'villagename',
            label: '项目'
          },
          {
            prop: 'roomnum',
            label: '房号'
          },
          {
            prop: 'resources_type_name',
            label: '资源类型'
          },
          {
            prop: 'buildareas',
            label: '房屋面积'
          },
          {
            prop: 'realname',
            label: '现业主名字'
          },
          {
            prop: 'check',
            label: '交房状态'
          },
          {
            prop: 'isdecorate',
            label: '装修状态'
          },
          {
            prop: 'into_house',
            label: '入住状态'
          }
        ]

        let arr = JSON.parse(JSON.stringify(this.tableArrys))
        arr[0].isLoading = false
        // this.tableArrys[index].tableTitles = arr
        this.tableArrys = arr
      } else if(this.tableType === 'housekeepercostcountstatistics' && result.type === 'count') {
        this.tableArrys[0].tableData = [];
        // 楼栋管家表格数据
        if (result.data && result.data.length > 0) {
          result.data.forEach(item => {
            let arr = {
              villagename: item.name,
              ...item.stewards[0],
            };
            this.tableArrys[0].tableData.push(arr);
          });
        }

        // 导出数据
        this.tableArrys[0].tableName = '楼栋管家统计表';
        this.tableArrys[0].ismultiple = true;
        this.tableArrys[0].multiHeader = ['项目名称', '管家', '楼栋', '本月应收金额', '应收本月', '', '', '本月实收', '', '', '', '', '收缴率'];
        this.tableArrys[0].multiHeader2 = ['', '', '', '', '应收往年', '应收往月', '应收本月', '实收往年', '实收往月', '实收本月', '本月预收', '实收总计', ''];
        this.tableArrys[0].merges = ['A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:G1', 'H1:L1', 'M1:M2'];
        this.tableArrys[0].datas = this.tableArrys[0].tableData.map(item => {
          return [
            item.villagename,
            item.realname,
            item.unit_name,
            item.byysje,
            item.yswn,
            item.yswy,
            item.ysby,
            item.sswn,
            item.sswy,
            item.ssby,
            item.byys,
            item.sszj,
            item.sjl,
          ];
        });
        this.$nextTick(() => {
          this.$refs.taxTable[0].doLayout();
        });
        let arr = JSON.parse(JSON.stringify(this.tableArrys));
        arr[0].isLoading = false;
        this.tableArrys = arr;
      } else {
        this.tableDataHandle(result.data, result.type)
      }
    },

    // 重新查询处理
    filterAgain() {
      this.tableArrys.forEach(item => {
        item.tableData = []
      })
      this.$emit('queryAgain')
    },

    /* 导出EXCEL */
    exportExcel() {
      if (
        !this.tableArrys[this.currentIndex ? this.currentIndex : 0].isLoading
      ) {
        try {
          // 多级表头表格导出
          if (this.tableArrys[this.currentIndex].ismultiple) {
            import('@/assets/common/excel/ComplexHeaderExcel.js').then(
              excel => {
                let data = {
                  multiHeader: this.tableArrys[this.currentIndex].multiHeader,
                  multiHeader2: this.tableArrys[this.currentIndex].multiHeader2,
                  data: this.tableArrys[this.currentIndex].datas,
                  merges: this.tableArrys[this.currentIndex].merges,
                  filename: this.tableArrys[this.currentIndex].tableName
                }
                if (
                  this.tableArrys[this.currentIndex].multiHeader3 &&
                  this.tableArrys[this.currentIndex].multiHeader3.length > 0
                ) {
                  data.multiHeader3 = this.tableArrys[
                    this.currentIndex
                  ].multiHeader3
                }
                console.log(data)
                excel.export_json_to_excel(data)
              }
            )
          } else {
            require.ensure([], () => {
              // 引入excel.js
              let {
                export_json_to_excel
              } = require('@/assets/common/excel/Export2Excel')

              // 执行导出操作
              export_json_to_excel(
                this.tableArrys[this.currentIndex].headers,
                this.tableArrys[this.currentIndex].datas,
                this.tableArrys[this.currentIndex].tableName
              )
            })
          }

          this.$notify({
            type: 'success',
            title: '温馨提示',
            message: '导出报表成功',
            duration: 1500
          })
        } catch (e) {
          this.$notify({
            type: 'error',
            title: '温馨提示',
            message: '导出报表失败',
            duration: 1500
          })
        }
      }
    },

    // 表格合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 减免占比率合计
        if (this.tableType === 'carrecordstatistics' && index === 4) {
          let all1 = 0
          let all2 = 0
          data.forEach(item => {
            all1 = _.add(Number(all1), Number(item.need_pay))
            all2 = _.add(Number(all2), Number(item.reduction_money))
          })
          sums[index] =
            _.round(_.divide(Number(all2), Number(all1)) * 100, 2).toFixed(2) +
            '%'
        } else {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return _.round(_.add(Number(prev), Number(curr)), 2).toFixed(2)
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = 0
          }
        }
      })

      return sums
    },

    // 财务报表 单元格类名
    cellClassName({ row, column }) {
      if (
        row.is_info == 1 &&
        (column.label === '结转往月' ||
          column.label === '实收往月' ||
          column.label === '本月分摊')
      ) {
        return 'click-text'
      } else {
        return ''
      }
    },

    // 财务月报表单元格点击处理
    cellClick(row, column) {
      if (
        row.is_info == 1 &&
        (column.label === '结转往月' ||
          column.label === '实收往月' ||
          column.label === '本月分摊')
      ) {
        this.showSourceDialog = true
        this.getResourceData(row)
      }
    },

    // 获取明细来源数据
    getResourceData(row) {
      this.sourceLoading = true
      let data = {
        vid: row.vid,
        subject_id: row.subject_id,
        starttime: this.filter.starttime,
        endtime: this.filter.endtime,
        pay_type: this.filter.pay_type,
        is_tax: this.activeName === 'count' ? 1 : 2
      }
      this.$axios
        .post(this.urlObj.financemonthinfo, data)
        .then(res => {
          if (res.Code === 200) {
            this.$refs.sourceTable.loadData(res.Data)
          } else {
            let msg = res.Message ? res.Message : '获取明细来源数据失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
          this.sourceLoading = false
        })
        .catch(() => {
          this.sourceLoading = false
        })
    }
  }
}
</script>

<style lang="less">
.el-table {
  td,
  th {
    padding: 10px 0;

    .cell {
      text-align: center;
      color: #333;
    }
  }

  thead.is-group {
    th {
      background: #fff;
    }
  }
}

.el-tabs--border-card {
  box-shadow: none;
}

#tables {
  width: 100%;
  height: 100%;
  position: relative;

  .vxe-table--render-default .vxe-header--column:not(.col--ellipsis),
  .vxe-table--render-default .vxe-body--column:not(.col--ellipsis),
  .vxe-table--render-default .vxe-footer--column:not(.col--ellipsis) {
    padding: 8px 0;
  }

  .vxe-table--render-default.vxe-editable .vxe-body--column,
  .vxe-table--render-default .vxe-header--column.col--ellipsis,
  .vxe-table--render-default .vxe-body--column.col--ellipsis,
  .vxe-table--render-default .vxe-footer--column.col--ellipsis {
    height: 38px;
  }

  > .el-button {
    position: absolute;
    top: 9px;
    right: 85px;
    z-index: 1000;
    width: 100px;
    padding: 8px;
  }

  > .el-button + .el-button {
    position: absolute;
    top: 9px;
    right: 200px;
    z-index: 1000;
    width: 100px;
    padding: 8px;
  }

  .filter-wp {
    position: absolute;
    top: 9px;
    z-index: 2005;
    right: 320px;
    width: 300px;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    background-color: #ebebeb;
    padding: 0 10px;
    display: flex;

    .content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
      font-size: 14px;
    }

    .btn {
      color: #3ebb75;
      font-size: 12px;
      margin-left: 10px;
      cursor: pointer;
    }

    .condition {
      position: absolute;
      top: 40px;
      left: 0;
      width: 600px;
      padding: 15px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 2px #ccc;

      .condition-item {
        margin-bottom: 15px;
        display: flex;

        .name {
          width: 100px;
          color: #ccc;
          font-size: 14px;
          line-height: 20px;
        }

        .value {
          flex: 1;
          color: #333;
          font-size: 14px;
          line-height: 20px;
          text-align: justify;
        }
      }

      .condition-item:last-child {
        margin-bottom: 0;
      }
    }
  }

  .export {
    position: absolute;
    top: 7px;
    right: 30px;
    z-index: 1000;
    cursor: pointer;

    .common-right-icon {
      svg {
        width: 34px;
        height: 35px;
      }
    }
  }

  .el-tabs {
    height: 100%;

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 60px;
    }

    .el-tabs__item {
      height: 50px;
      padding: 5px 20px;
      font-size: 15px;
      color: #666;
    }

    .el-tabs__item.is-active {
      color: #3ebb75;
    }

    .el-tabs__nav-wrap {
      width: 20%;
    }

    .el-tabs__content {
      height: calc(100% - 80px);

      .el-tab-pane {
        height: 100%;

        .el-table {
          .el-table__body-wrapper {
            height: calc(100% - 71px) !important;
          }
        }

        .el-table.carport {
          height: calc(100% - 70px) !important;

          .el-table__body-wrapper {
            height: calc(100% - 48px) !important;
          }
        }

        .el-table.finance {
          .el-table__body-wrapper {
            height: calc(100% - 68px) !important;
          }

          table th,
          table td {
            padding: 5px 0;
          }

          table td.click-text {
            cursor: pointer;
          }

          table td.click-text:hover .cell {
            color: #3ebb75;
          }
        }

        .create-info {
          padding: 25px 30px;

          .name {
            font-size: 14px;
            color: #333;
          }

          .value {
            font-size: 14px;
            color: #333;
            margin: 0 40px 0 5px;
          }
        }
      }
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }
  }

  .el-tabs.two {
    .el-tabs__nav-wrap {
      width: 30%;
    }
  }

  .el-tabs.three {
    .el-tabs__nav-wrap {
      width: 40%;
    }
  }

  .el-tabs.four {
    .el-tabs__nav-wrap {
      width: 45%;
    }
  }

  .sourceDialog {
    .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: 0 !important;
      height: 80%;

      .el-dialog__body {
        height: calc(100% - 68px);
        padding: 20px 30px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
