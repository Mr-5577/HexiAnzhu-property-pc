<template>
  <div id="category">
    <!-- 左侧部分 -->
    <div class="left-wp">
      <div class="title-wp">
        <h3>资源类型</h3>
      </div>
      <div class="tree-wp" v-loading="treeLoading">
        <el-scrollbar style="height: 100%;">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="typeList"
            node-key="id"
            :props="defaultProps"
            accordion
            show-checkbox
            check-strictly
            @node-click="nodeClick"
            @check="nodeCheck"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i
                class="iconfont iconzu3663"
                v-if="node.level === 1 && data.icon == 'house'"
              ></i>
              <i
                class="iconfont iconcheku"
                v-else-if="node.level === 1 && data.icon == 'carmonth'"
              ></i>
              <i
                class="iconfont icona-lujing443"
                v-else-if="node.level === 1 && data.icon == 'car'"
              ></i>
              <i
                class="iconfont icona-zu4213"
                v-else-if="node.level === 1 && data.icon == 'water_ele_gas'"
              ></i>
              <i
                class="iconfont iconqitaziyuan"
                v-else-if="node.level === 1 && data.icon == 'virtual'"
              ></i>
              <span class="label">
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="btn-wp">
        <el-button
          v-if="$menu.getters.judgeRole('Btn-8xhROHzIohsbvlYaR7mtcXsW')"
          type="primary"
          round
          @click="openDialog"
        >
          新增资源类型
        </el-button>
      </div>
    </div>
    <!-- 右边部分 -->
    <div class="right-wp" v-loading="isLoading">
      <div class="empty" v-if="!currenTypeId">请在左侧选择资源类型！</div>
      <el-scrollbar style="height: 100%;" v-else>
        <!-- 资源详情部分 -->
        <div class="carport-wp">
          <div class="carport-content">
            <div class="title">
              <i class="iconfont iconzu3663"></i>
              <span>资源详情</span>
            </div>
            <el-button type="primary" round @click="logHandle">
              变更日志
            </el-button>
          </div>
          <div class="labels">
            <div class="label">
              <div class="text-wp">
                <div class="number">{{ typeInfo.name }}</div>
                <div class="name">资源名称</div>
              </div>
            </div>
            <div class="label">
              <div class="text-wp">
                <div class="number">{{ typeInfo.p_name }}</div>
                <div class="name">所属类别</div>
              </div>
            </div>
          </div>
          <!-- 备注部分 -->
          <div class="mark-wp">
            <div class="title">备注</div>
            <el-input
              type="textarea"
              :rows="5"
              readonly
              resize="none"
              placeholder=""
              v-model="typeInfo.remarks"
            ></el-input>
          </div>
        </div>
        <div class="btn-wp">
          <div class="btn-group">
            <el-button
              v-if="$menu.getters.judgeRole('Btn-QdqAxCMgVV5SnzX0frGyQP0J')"
              type="primary"
              round
              @click="editHandle"
            >
              修改资源类型
            </el-button>
            <el-button :loading="isStop" type="warning" round @click="typeStop">
              停用
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 新增弹框部分 -->
    <el-dialog
      class="addDialog"
      :visible.sync="isShow"
      title="新增资源类别"
      width="34%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <div class="input-wp">
          <div class="input-item">
            <div class="name">资源名称</div>
            <el-input
              v-model="typeName"
              placeholder="请输入资源名称"
            ></el-input>
          </div>
          <div class="input-item">
            <div class="name">资源类别</div>
            <el-cascader
              v-model="typeValue"
              :options="typeList"
              clearable
              :props="{ checkStrictly: true, value: 'id' }"
              :show-all-levels="false"
              placeholder="请选择资源类别"
            ></el-cascader>
          </div>
        </div>
        <div class="mark-wp">
          <div class="title">
            备注
            <span style="color: #ccc;font-size: 0.6rem;">(选填)</span>
          </div>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入备注"
            v-model="markValue"
            resize="none"
          ></el-input>
        </div>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="confirm">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="isShow = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEdit"
      title="修改资源类型"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="input-wp">
        <div class="input-item">
          <div class="name">资源名称</div>
          <el-input v-model="etypeName" placeholder="请输入资源名称"></el-input>
        </div>
      </div>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="editSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showEdit = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 变更日志弹框部分 -->
    <el-dialog
      class="logDialog"
      :visible="isShowLog"
      title="变更日志"
      width="40%"
      @close="isShowLog = false"
    >
      <!-- 变更日志部分 -->
      <div class="log-wp">
        <cus-table
          ref="cusTable"
          title="客户变更日志"
          :datas="logTableData"
          :cusColums="logColumns"
          :cusConf="logConf"
          :ispaging="true"
          @sizeChange="logSizeChange"
          @currentChange="logCurrentChange"
        ></cus-table>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/assets/means/js/category.js"></script>

<style lang="less">
@import url('~@/assets/means/css/category.less');
</style>
