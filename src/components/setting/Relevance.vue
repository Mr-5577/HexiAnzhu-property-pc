<template>
  <div id="relevance">
    <!-- 左边部分 -->
    <div class="left-wp">
      <!-- 上边树形结构+搜索部分 -->
      <div class="top">
        <subject-tree
          :vid="vid"
          :showSearch="true"
          treeType="relevance"
          @checkChange="checkChange"
        ></subject-tree>
      </div>
      <!-- 底部新增科目部分 -->
      <div class="bottom">
        <el-button
          v-if="this.$menu.getters.judgeRole('Btn-ISsm5DMfxd0nJ3ZbXtuep9iQ')"
          type="primary"
          round
          @click="batchHandle"
        >
          批量关联设置
        </el-button>
      </div>
    </div>
    <div class="right-wp" v-if="!currentSub.id">
      <div class="tip">请选择科目！</div>
    </div>
    <div class="right-wp" v-else>
      <div class="title">已设置资源列表</div>
      <div class="search-wp">
        <el-select
          v-model="typeVal"
          clearable
          placeholder="请选择资源类型"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in typeOptions"
            :key="itm.model_type"
            :label="itm.text"
            :value="itm.model_type"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入资源名称搜索"
          prefix-icon="el-icon-search"
          v-model="keywords"
          @change="tableLoad"
        ></el-input>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @selectionChange="selectionChange"
          @delete="resourceDel"
        ></cus-table>
      </div>
      <el-button
        v-if="this.$menu.getters.judgeRole('Btn-JX43HgoLRlDnxhq5yvc9i8T2')"
        class="empty"
        type="primary"
        round
        :disabled="tableSelected.length == 0"
        @click="batchDel"
      >
        批量删除
      </el-button>
    </div>

    <!-- 弹框部分 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDialog"
      title="批量设置关联"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="main-wp">
        <div class="left" v-if="showDialog">
          <subject-tree
            :vid="vid"
            :showSearch="true"
            treeType="relevance"
            @checkChange="subChange"
          ></subject-tree>
        </div>
        <div class="right">
          <!-- 搜索框部分 -->
          <div class="search-wrap">
            <el-input
              placeholder="请输入关键字搜索"
              suffix-icon="iconfont iconzu3664"
              v-model="filterText"
              class="search"
            ></el-input>
          </div>
          <el-scrollbar
            style="height: calc(100% - 4.05rem);"
            v-loading="treeLoading"
          >
            <!-- 树形结构部分 -->
            <div class="tree-wrap">
              <el-tree
                ref="resourceTree"
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                node-key="node_id"
                accordion
                :default-checked-keys="checkedKeys"
                :filter-node-method="filterNode"
                show-checkbox
              ></el-tree>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          批量关联
        </el-button>
        <el-button type="info" round @click="showDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="@/assets/setting/js/relevance.js"></script>

<style lang="less">
@import url('~@/assets/setting/css/relevance.less');
</style>
