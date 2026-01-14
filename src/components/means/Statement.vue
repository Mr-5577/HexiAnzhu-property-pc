<template>
  <div id="statement">
    <!-- 预选择页面 -->
    <div class="pre-selection" v-show="!isRegister">
      <area-village-select
        title="选择查询条件"
        btnName="开始查询"
        :multiple="true"
        :collapse-tags="false"
        @registerPass="registerPass"
      ></area-village-select>
    </div>
    <div
      class="main-wp"
      v-if="isRegister"
      v-loading="isLoading || isExport"
      :element-loading-text="isExport ? '数据导出中...' : '数据获取中...'"
    >
      <div class="op-wp">
        <span
          v-if="$menu.getters.judgeRole('Btn-09PybPlVOKiwTItZAPNfaNr1')"
          :class="['export', isExport || isLoading ? 'disable' : '']"
          @click="getTableData(true)"
        >
          <workIcon
            name="export"
            class="common-right-icon"
            title="导出"
          ></workIcon>
        </span>
        <!-- 重新查询按钮部分 -->
        <el-button
          icon="el-icon-search"
          class="empty"
          type="primary"
          round
          @click="isRegister = false"
        >
          重新查询
        </el-button>
      </div>

      <el-tabs stretch v-model="activeName">
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="(item, index) in tableList"
          :key="index"
        >
          <div class="filter-wp">
            <el-select
              v-if="activeName == 'third' || activeName == 'seven'"
              v-model="buildVal"
              clearable
              placeholder="请选择楼栋"
              @change="buildChange"
            >
              <el-option
                v-for="itm in buildOptions"
                :key="itm.id"
                :label="itm.villagename + '-' + itm.block"
                :value="itm.id"
              ></el-option>
            </el-select>
            <el-select
              v-if="activeName == 'seven'"
              v-model="unitVal"
              clearable
              placeholder="请选择单元"
              @change="getTableData(false)"
            >
              <el-option
                v-for="itm in unitOptions"
                :key="itm.id"
                :label="itm.unit"
                :value="itm.id"
              ></el-option>
            </el-select>
            <el-select
              v-if="
                activeName == 'third' ||
                  activeName == 'fourth' ||
                  activeName == 'five' ||
                  activeName == 'eight'
              "
              v-model="resourceVal"
              clearable
              placeholder="请选择资源类型"
              @change="getTableData(false)"
            >
              <el-option
                v-for="itm in resourceOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
            <el-select
              v-if="
                activeName == 'fourth' ||
                  activeName == 'five' ||
                  activeName == 'eight' ||
                  activeName == 'nine'
              "
              v-model="statusVal"
              clearable
              placeholder="请选择状态"
              @change="getTableData(false)"
            >
              <el-option label="正常" :value="1"></el-option>
              <el-option label="即将超期" :value="2"></el-option>
              <el-option label="已超期" :value="3"></el-option>
            </el-select>
            <el-select
              v-if="activeName == 'seven'"
              v-model="relationVal"
              clearable
              placeholder="请选择使用关系"
              @change="getTableData(false)"
            >
              <el-option
                v-for="itm in relationOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-if="activeName == 'third'"
              v-model="sdtime"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始装修开始日期"
              end-placeholder="开始装修结束日期"
              @change="getTableData(false)"
            ></el-date-picker>
            <el-date-picker
              v-if="activeName == 'third'"
              v-model="edtime"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="结束装修开始日期"
              end-placeholder="结束装修结束日期"
              @change="getTableData(false)"
            ></el-date-picker>
            <el-date-picker
              v-if="activeName == 'third'"
              v-model="enterTime"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="进场开始日期"
              end-placeholder="进场结束日期"
              @change="getTableData(false)"
            ></el-date-picker>
            <el-input
              v-if="
                activeName == 'third' ||
                  activeName == 'fourth' ||
                  activeName == 'five' ||
                  activeName == 'six' ||
                  activeName == 'seven' ||
                  activeName == 'nine'
              "
              placeholder="输入关键字查询"
              prefix-icon="el-icon-search"
              v-model="searchVal"
              @change="getTableData(false)"
            ></el-input>
          </div>
          <cus-table
            :class="[
              ispaging ? '' : 'nopaging',
              activeName == 'first' || activeName == 'second' ? '' : 'search'
            ]"
            :datas="item.tableData"
            :cusColums="item.columns"
            :cusConf="conf"
            :ispaging="ispaging"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></cus-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script src="@/assets/means/js/statement.js"></script>

<style lang="less">
@import url('~@/assets/means/css/statement.less');
</style>
