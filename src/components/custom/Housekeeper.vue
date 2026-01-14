<template>
  <div id="housekeeper">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
          </span>
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="tableLoad"
          >
            查询
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="table-wp">
        <el-table
          :data="tableData"
          ref="tableRef"
          highlight-current-row
          element-loading-text="数据获取中..."
          v-loading="conf.loadStatus"
          :empty-text="conf.emptyText"
          size="small"
          row-key="nodeid"
          height="100%"
          :indent="30"
          :cell-class-name="cellClass"
          @selection-change="selectionChange"
          @select="rowSelect"
          @select-all="selectAll"
        >
          >
          <el-table-column type="selection" width="100"></el-table-column>
          <el-table-column prop="name" label="楼栋单元"></el-table-column>
          <el-table-column prop="steward" label="楼栋管家"></el-table-column>
          <el-table-column prop="phone" label="管家电话"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  !scope.row.block &&
                    $menu.getters.judgeRole('Btn-HxWV81S6U0XFN9JahSOWoEdF')
                "
                type="primary"
                plain
                round
                size="small"
                @click="stewardChange(scope.row)"
              >
                更换管家
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn-wp">
        <el-button
          v-if="$menu.getters.judgeRole('Btn-t0zTob0ivtfsqFycKJ7AUJt8')"
          :disabled="tableSelected.length === 0"
          type="primary"
          round
          @click="setBatch"
        >
          批量设置管家
        </el-button>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showDialog"
      title="楼栋管家设置"
      width="36%"
      :close-on-click-modal="false"
    >
      <!-- 搜索部分 -->
      <el-autocomplete
        ref="searchInput"
        class="house-search"
        popper-class="my-autocomplete"
        v-model="autoValue"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入管家姓名/手机号"
        @select="handleSelect"
      >
        <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div class="tr-item">
            <span class="td-item">{{ item.realname }}</span>
            <span class="td-item">{{ item.mobile }}</span>
            <span class="td-item">{{ item.idcard }}</span>
          </div>
          <div class="load-more" v-if="allUserList.length <= 1">
            暂无数据！
          </div>
        </template>
      </el-autocomplete>
      <div class="input-wp">
        <div class="input-item">
          <div class="name">管家姓名</div>
          <el-input
            v-model="currentUser.realname"
            readonly
            placeholder="用户姓名"
          ></el-input>
        </div>
        <div class="input-item">
          <div class="name">联系电话</div>
          <el-input
            v-model="currentUser.mobile"
            placeholder="联系电话"
          ></el-input>
        </div>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          提交保存
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
  </div>
</template>

<script src="@/assets/custom/js/housekeeper.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/housekeeper.less');
</style>
