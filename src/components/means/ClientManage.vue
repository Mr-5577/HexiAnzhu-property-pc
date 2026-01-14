<template>
  <div id="client-manage">
    <!-- 左侧部分 -->
    <div class="left-wp">
      <div class="tree-wp">
        <!-- 搜索框部分 -->
        <div class="search-wrap">
          <el-input
            placeholder="请输入项目名或编码"
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
              lazy
              ref="tree"
              class="filter-tree"
              :data="treeData"
              node-key="nodeid"
              show-checkbox
              check-strictly
              accordion
              :props="defaultProps"
              :load="loadNode"
              @node-click="nodeClick"
              @check="nodeCheck"
              @node-expand="nodeExpand"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <i
                  class="iconfont icondaqu"
                  v-if="node.data.type == 'city'"
                ></i>
                <i
                  class="iconfont iconxiangmu"
                  v-if="node.data.type == 'village'"
                ></i>
                <span class="label">{{ node.label }}</span>
                <span v-if="node.loading">
                  <i
                    class="el-icon-loading"
                    style="color: #ccc;margin-right: 0.25rem;vertical-align: middle;font-size: 0.7rem;position: relative; z-index: 100;"
                  ></i>
                  <span style="font-size: 0.6rem;color: #ccc;">正在加载</span>
                </span>
              </span>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="btn-wp">
        <el-button
          v-if="$menu.getters.judgeRole('Btn-ElcHtFMJmqIyaYGeY0USR3Fz')"
          type="primary"
          round
          @click="openDialog"
        >
          新增客户
        </el-button>
      </div>
    </div>

    <!-- 右边部分 -->
    <div :class="['right-wp', !currentUser ? 'emp' : '']" v-loading="isLoading">
      <div class="empty" v-if="!currentUser || isLoading">
        请在左侧选择客户！
      </div>
      <el-scrollbar style="height: 100%;" v-else>
        <!-- 用户信息部分 -->
        <div class="user-info">
          <div class="title">
            <img src="@/assets/means/image/user.png" alt="" />
            <span>客户信息</span>
          </div>
          <el-button type="primary" round @click="logHandle">
            变更日志
          </el-button>
          <div class="info-wp">
            <div class="info-left">
              <el-avatar :size="80" shape="square" src="">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <div class="infos">
                <div class="info-item">
                  <span class="u_name">{{ userDetail.realname }}</span>
                  <span class="sex">{{ userDetail.sex }}</span>
                </div>
                <div class="info-item">
                  <span class="name">联系电话</span>
                  <span class="value">{{ userDetail.tel }}</span>
                </div>
                <div class="info-item">
                  <span class="name">身份证号</span>
                  <span class="value">{{ userDetail.idcard }}</span>
                </div>
              </div>
              <el-button
                v-if="$menu.getters.judgeRole('Btn-PXw2uDRRjak9Xe0EZB0Ta9FF')"
                icon="el-icon-edit-outline"
                class="empty"
                type="primary"
                round
                @click="editHandle"
              >
                编辑
              </el-button>
            </div>
            <div class="info-right">
              <div class="total-wp">
                <div class="total">
                  <div class="num">{{ userDetail.buy_rooms.length }}</div>
                  <div class="info">绑定房产(套)</div>
                </div>
              </div>
              <div class="rooms-wp">
                <el-scrollbar style="height: 100%;">
                  <ul :class="[userDetail.buy_rooms.length < 4 ? 'noscroll' : '']">
                    <li v-for="(item, index) in userDetail.buy_rooms" :key="index">
                      {{
                        (item.rooms.unit.building
                          ? item.rooms.unit.building.block
                          : '') +
                          ' - ' +
                          (item.rooms.unit.unit ? item.rooms.unit.unit : '') +
                          ' - ' +
                          item.rooms.roomnum
                      }}
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
            </div>
          </div>
          <div class="info-content">
            <div
              :class="['info-itm', houseActive ? 'active' : '']"
              @click="houseActive = !houseActive"
            >
              <div class="icon-wp">
                <i class="iconfont iconzuyongfang"></i>
              </div>
              <div class="msg-wp">
                <div class="num">{{ userDetail.rent_rooms.length }}</div>
                <div class="msg">
                  租用房产(套)
                  <i class="el-icon-caret-bottom" v-if="!houseActive"></i>
                  <i class="el-icon-caret-top" v-else></i>
                </div>
              </div>
              <ul v-show="houseActive">
                <div
                  style="color: #3ebb75;font-size: 0.7rem;text-align:center;"
                  v-if="userDetail.rent_rooms.length == 0"
                >
                  暂无数据！
                </div>
                <li v-for="(item, index) in userDetail.rent_rooms" :key="index">
                  {{
                    (item.rooms.unit.building
                      ? item.rooms.unit.building.block
                      : '') +
                      ' - ' +
                      (item.rooms.unit ? item.rooms.unit.unit : '') +
                      ' - ' +
                      item.rooms.roomnum
                  }}
                </li>
              </ul>
            </div>
            <div
              :class="['info-itm', fixcarActive ? 'active' : '']"
              @click="fixcarActive = !fixcarActive"
            >
              <div class="icon-wp">
                <i class="iconfont iconcheche"></i>
              </div>
              <div class="msg-wp">
                <div class="num">{{ userDetail.car.length }}</div>
                <div class="msg">
                  绑定车位(个)
                  <i class="el-icon-caret-bottom" v-if="!fixcarActive"></i>
                  <i class="el-icon-caret-top" v-else></i>
                </div>
              </div>
              <ul v-show="fixcarActive">
                <div
                  style="color: #3ebb75;font-size: 0.7rem;text-align:center;"
                  v-if="userDetail.car.length == 0"
                >
                  暂无数据！
                </div>
                <li v-for="(item, index) in userDetail.car" :key="index">
                  {{ item.carmotor.map(i => i.plates).join('、') }}
                </li>
              </ul>
            </div>
            <div
              :class="['info-itm', monthcarActive ? 'active' : '']"
              @click="monthcarActive = !monthcarActive"
            >
              <div class="icon-wp">
                <i class="iconfont iconcheche"></i>
              </div>
              <div class="msg-wp">
                <div class="num">{{ userDetail.carmonth.length }}</div>
                <div class="msg">
                  绑定月租车(辆)
                  <i class="el-icon-caret-bottom" v-if="!monthcarActive"></i>
                  <i class="el-icon-caret-top" v-else></i>
                </div>
              </div>
              <ul v-show="monthcarActive">
                <div
                  style="color: #3ebb75;font-size: 0.7rem;text-align:center;"
                  v-if="userDetail.carmonth.length == 0"
                >
                  暂无数据！
                </div>
                <li v-for="(item, index) in userDetail.carmonth" :key="index">
                  {{ item.carmotor.map(i => i.plates).join('、') }}
                </li>
              </ul>
            </div>
            <div
              :class="['info-itm', novehicleActive ? 'active' : '']"
              @click="novehicleActive = !novehicleActive"
            >
              <div class="icon-wp">
                <i class="iconfont iconfeijidongche1"></i>
              </div>
              <div class="msg-wp">
                <div class="num">{{ userDetail.carnonmotor.length }}</div>
                <div class="msg">
                  绑定非机动车(辆)
                  <i class="el-icon-caret-bottom" v-if="!novehicleActive"></i>
                  <i class="el-icon-caret-top" v-else></i>
                </div>
              </div>
              <ul v-show="novehicleActive">
                <div
                  style="color: #3ebb75;font-size: 0.7rem;text-align:center;"
                  v-if="userDetail.carnonmotor.length == 0"
                >
                  暂无数据！
                </div>
                <li
                  v-for="(item, index) in userDetail.carnonmotor"
                  :key="index"
                >
                  {{ item.plates }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 亲属关系表格部分 -->
        <div class="table-wp">
          <div class="title">亲属关系</div>
          <cus-table
            ref="cusTable"
            title="客户信息"
            :datas="tableData"
            :cusColums="columns"
            :cusConf="conf"
            :ispaging="false"
          ></cus-table>
        </div>
      </el-scrollbar>
    </div>

    <!-- 新增客户弹框部分 -->
    <el-dialog
      :visible.sync="isShow"
      title="新增客户"
      width="45%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="客户姓名" prop="uname">
            <el-input
              v-model="addForm.uname"
              placeholder="请输入客户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户性别" prop="sex">
            <el-select
              v-model="addForm.sex"
              clearable
              placeholder="请选择客户性别"
            >
              <el-option :key="1" label="男" :value="1"></el-option>
              <el-option :key="2" label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input
              v-model="addForm.tel"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idcard">
            <el-input
              v-model="addForm.idcard"
              placeholder="请输入身份证号"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属大区" prop="barea">
            <el-select
              v-model="addForm.barea"
              clearable
              placeholder="请选择所属大区"
              @change="bareaChange"
            >
              <el-option
                v-for="itm in areaOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目" prop="village">
            <el-select
              v-model="addForm.village"
              clearable
              placeholder="请选择所属项目"
              @change="villageChange"
            >
              <el-option
                v-for="itm in villageOptions"
                :key="itm.id"
                :label="itm.label"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户类型" prop="otype">
            <el-select
              v-model="addForm.otype"
              clearable
              placeholder="请选择客户类型"
              @change="otypeChange"
            >
              <el-option
                v-for="itm in typeOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否计费"
            prop="charge"
            v-if="addForm.otype != 4"
          >
            <el-select
              v-model="addForm.charge"
              clearable
              placeholder="请选择是否计费"
            >
              <el-option :key="0" label="否" :value="0"></el-option>
              <el-option :key="1" label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="与业主关系"
            prop="relation"
            v-if="addForm.otype === 4"
          >
            <el-select
              v-model="addForm.relation"
              clearable
              placeholder="请选择关系"
            >
              <el-option
                v-for="itm in relationOptions"
                :key="itm.id"
                :label="itm.label"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="line"></div>

          <el-form-item label="选择楼栋" prop="build" v-if="addForm.otype != 4">
            <el-select
              v-model="addForm.build"
              clearable
              filterable
              placeholder="请选择楼栋"
              @change="buildChange"
            >
              <el-option
                v-for="itm in buildOptions"
                :key="itm.id"
                :label="itm.block"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择单元" prop="unit" v-if="addForm.otype != 4">
            <el-select
              v-model="addForm.unit"
              clearable
              filterable
              placeholder="请选择单元"
              @change="unitChange"
            >
              <el-option
                v-for="itm in unitOptions"
                :key="itm.id"
                :label="itm.unit"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择房号" prop="room" v-if="addForm.otype != 4">
            <el-select
              v-model="addForm.room"
              clearable
              filterable
              placeholder="请选择房号"
            >
              <el-option
                v-for="itm in roomOptions"
                :key="itm.id"
                :label="itm.roomnum"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="user-search" v-if="addForm.otype === 4">
          <el-input
            placeholder="请输入业主姓名或手机号"
            suffix-icon="iconfont iconzu3664"
            v-model="userSearch"
            class="search"
            @change="getUserRooms(false)"
          ></el-input>
          <ul v-loading="userLoading">
            <li
              :class="[item.active ? 'active' : '']"
              v-for="(item, index) in allUserList"
              :key="index"
              @click="liClick(index)"
            >
              <span>{{ item.realname + ' - ' + item.type }}</span>
              <span>{{ item.tel }}</span>
              <span>{{ item.village }}</span>
              <span>{{ item.buildname + ' - ' + item.unit }}</span>
              <span>{{ item.roomnum }}</span>
            </li>
            <div
              class="loadmore"
              v-if="allUserList.length > 0 && !loadMore && !nomore"
            >
              <span @click="getUserRooms(true)">点击加载更多</span>
            </div>
            <div class="nomore" v-if="allUserList.length > 0 && nomore">
              没有更多啦！
            </div>
            <div class="status" v-if="allUserList.length > 0 && loadMore">
              <span class="el-icon-loading"></span>
              加载中...
            </div>
            <div class="empty" v-if="allUserList.length == 0">暂无数据！</div>
          </ul>
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

    <!-- 编辑客户信息弹框 -->
    <el-dialog
      class="editDialog"
      :visible.sync="showEditDialog"
      title="编辑客户信息"
      width="35%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="客户姓名" prop="uname">
          <el-input
            v-model="ruleForm.uname"
            :readonly="!$menu.getters.judgeRole('Btn-b884fRdAyqhSEuFfQG1257Sr')"
            placeholder="请输入客户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户性别" prop="sex">
          <el-select
            v-model="ruleForm.sex"
            clearable
            placeholder="请选择客户性别"
          >
            <el-option :key="1" label="男" :value="1"></el-option>
            <el-option :key="2" label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input
            v-model="ruleForm.tel"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input
            v-model="ruleForm.idcard"
            placeholder="请输入身份证号"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="editSubmit">
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showEditDialog = false"
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

<script src="@/assets/means/js/clientManage.js"></script>

<style lang="less">
@import url('~@/assets/means/css/clientManage.less');
</style>
