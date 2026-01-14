<template>
  <div id="address-book">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <input
            type="text"
            class="common-input"
            placeholder="请输入关键字查询"
            v-model="searchVal"
            @change="keySearch"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch"
          >
            查询
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
          @setAuth="setAuth"
          @personAuth="personAuth"
          @groupAuth="groupAuth"
          @resetPass="resetPass"
        ></cus-table>
      </div>
    </div>

    <!-- 弹框部分 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showDialog"
      :title="
        optype == 'range'
          ? '权限范围设置'
          : optype == 'person'
          ? '个人权限设置'
          : optype == 'group'
          ? '分组权限设置'
          : ''
      "
      width="60%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;" v-loading="isloading">
        <div class="empty" v-if="currentList.length === 0">暂无数据！</div>
        <!-- 权限范围设置 -->
        <div class="tab-wp" v-else-if="optype == 'range'">
          <div class="tab-tr">
            <div class="th">一级分类</div>
            <div class="th">二级分类</div>
          </div>
          <div class="all-check">
            <el-checkbox
              v-model="checkAll"
              @change="val => allChange(val, 'r_id')"
            >
              全选/反选
            </el-checkbox>
          </div>
          <div class="tab-tr" v-for="(item, index) in currentList" :key="index">
            <div class="tab-td">
              <el-checkbox
                v-model="item.is_check"
                @change="val => handleCheckAll(val, item, 'r_id')"
              >
                {{ item.r_name }}
              </el-checkbox>
            </div>
            <div class="tab-td">
              <el-checkbox-group
                v-model="item.checkids"
                @change="val => handleChecked(val, item)"
              >
                <el-checkbox
                  :label="itm.r_id"
                  :key="itm.r_id"
                  v-for="itm in item.child"
                >
                  {{ itm.r_name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <!-- 个人权限设置 -->
        <div class="tab-wp" v-else-if="optype == 'person'">
          <div class="tab-tr">
            <div class="th">权限菜单</div>
            <div class="th">权限节点</div>
          </div>
          <div class="all-check">
            <el-checkbox
              v-model="checkAll"
              @change="val => allChange(val, 'nid')"
            >
              全选/反选
            </el-checkbox>
          </div>
          <div class="tab-tr" v-for="(item, index) in currentList" :key="index">
            <div class="tab-td">
              <el-checkbox
                v-model="item.is_check"
                @change="val => handleCheckAll(val, item, 'nid')"
              >
                {{ item.node_name }}
              </el-checkbox>
            </div>
            <div class="tab-td">
              <el-checkbox-group
                v-model="item.checkids"
                @change="val => handleChecked(val, item)"
              >
                <el-checkbox
                  :label="itm.nid"
                  :key="itm.nid"
                  v-for="itm in item.child"
                >
                  {{ itm.node_name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <!-- 分组权限设置 -->
        <div class="tab-wp" v-else-if="optype == 'group'">
          <div class="tab-tr">
            <div class="th">分组名称</div>
            <div class="th">权限信息</div>
          </div>
          <div class="tab-tr" v-for="(item, index) in currentList" :key="index">
            <div class="tab-td">
              <el-checkbox v-model="item.is_check">
                {{ item.group_name }}
              </el-checkbox>
            </div>
            <div class="tab-td">
              <p v-for="(itm, i) in item.node_arr" :key="i">
                {{
                  (itm.node_name ? itm.node_name : '') +
                    (itm.node_info ? '【' + itm.node_info + '】' : '')
                }}
              </p>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="editSave">
          保存修改
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

<script src="@/assets/addressbook/js/index.js"></script>

<style lang="less">
@import url('~@/assets/addressbook/css/index.less');
</style>
