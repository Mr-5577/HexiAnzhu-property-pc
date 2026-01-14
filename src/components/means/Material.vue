<template>
  <div id="material">
    <!-- 左边部分 -->
    <div class="left">
      <!-- 上边树形结构+搜索部分 -->
      <div class="top">
        <tree-search
          ref="treeSearch"
          @checkChange="checkChange"
          @setNumber="setNumber"
        ></tree-search>
      </div>
      <!-- 底部简介部分 -->
      <div class="bottom">
        <div class="btm-content">
          <div class="empty" v-if="!currentData.id">暂无数据！</div>
          <el-scrollbar style="height: 100%;width: 100%;" v-else>
            <div class="title">
              {{ villageName }}
            </div>
            <div class="info-content">
              <div
                class="info-item"
                v-for="(item, index) in infoList"
                :key="index"
              >
                <span class="name">{{ item.name }}</span>
                <span class="value">{{ item.value }}</span>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <div
      :class="[
        'right-content',
        currentData.type == 'rooms' ? 'rooms' : '',
        currentData.type == 'car' || currentData.type == 'carmonth'
          ? 'parkInfo'
          : ''
      ]"
      v-loading="isLoading || isCommit"
      :element-loading-text="
        isLoading ? '加载中' : isCommit ? '数据提交中' : ''
      "
    >
      <div class="empty" v-if="!currentData.id">
        请在左侧选择项目、楼栋、车位、房间或者业主！
      </div>

      <!-- 车位/其他资源详情页 -->
      <stall-detail
        ref="stallDetail"
        @closeLoading="isLoading = false"
        @delSuccess="delSuccess"
        v-else-if="
          currentData &&
            (currentData.type == 'car' ||
              currentData.type == 'carmonth' ||
              currentData.type == 'car_nonmotor' ||
              currentData.type == 'insideitem' ||
              currentData.type == 'lastvirtual')
        "
      ></stall-detail>

      <!-- 固定车位、月租车库、非机动车、其他资源信息页面+项目、楼栋、房间信息 + 业主信息 -->
      <el-scrollbar style="height: 100%;width: 100%;" v-else>
        <!-- 业主信息部分 -->
        <div
          class="owner-wp"
          v-if="currentData && currentData.type == 'owner' && !isLoading"
        >
          <div class="title">
            <img src="@/assets/means/image/user.png" alt="" />
            <span>{{ isEditOwner ? '业主信息修改' : '业主信息' }}</span>
          </div>

          <!-- 信息编辑组件部分 -->
          <info-edit
            ref="ownerEdit"
            v-if="isEditOwner"
            type="owner"
            :infoObj="ownerData"
          ></info-edit>

          <div class="owner-content" v-else>
            <div class="user-info">
              <div class="left">
                <span class="user-wp">
                  <el-avatar :size="60" src="">
                    <img
                      src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                    />
                  </el-avatar>
                  <div class="users">
                    <span class="name">{{ ownerData.realname }}</span>
                    <span class="relation">
                      关系 -
                      <span>
                        {{
                          ownerData.owner_type ? ownerData.owner_type.name : ''
                        }}
                      </span>
                    </span>
                  </div>
                </span>
                <span class="card-tel">
                  <div class="info">
                    <span class="type">联系电话</span>
                    <span class="value">{{ ownerData.tel }}</span>
                  </div>
                  <div class="info">
                    <span class="type">身份证号</span>
                    <span class="value">{{ ownerData.idcard }}</span>
                  </div>
                </span>
              </div>
              <div class="right">
                {{ ownerData.remark }}
              </div>
            </div>

            <!-- 业主资产统计部分 -->
            <div class="operation-wp">
              <div class="oper-item">
                <div class="info-content">
                  <div class="number">
                    {{
                      ownerData.owner_rooms ? ownerData.owner_rooms.length : 0
                    }}
                  </div>
                  <div class="name" @click="showHouseInfo = !showHouseInfo">
                    <span>绑定房产(套)</span>
                    <i class="el-icon-caret-bottom" v-if="!showHouseInfo"></i>
                    <i class="el-icon-caret-top" v-else></i>
                  </div>
                </div>
                <div
                  :class="[
                    'detail',
                    ownerData.owner_rooms && ownerData.owner_rooms.length > 6
                      ? 'scroll'
                      : ''
                  ]"
                  v-if="showHouseInfo"
                >
                  <div
                    v-if="
                      ownerData.owner_rooms && ownerData.owner_rooms.length < 7
                    "
                  >
                    <div
                      class="empty"
                      v-if="
                        !ownerData.owner_rooms ||
                          ownerData.owner_rooms.length == 0
                      "
                    >
                      暂无数据！
                    </div>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.owner_rooms"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{
                          item.rooms.unit.building.block +
                            ' - ' +
                            item.rooms.unit.unit +
                            ' - ' +
                            item.rooms.roomnum
                        }}
                      </span>
                    </div>
                  </div>
                  <el-scrollbar style="height: 100%;" v-else>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.owner_rooms"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{
                          item.rooms.unit.building.block +
                            ' - ' +
                            item.rooms.unit.unit +
                            ' - ' +
                            item.rooms.roomnum
                        }}
                      </span>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="oper-item">
                <div class="info-content">
                  <div class="number">{{ ownerData.car.length }}</div>
                  <div class="name" @click="showStallInfo = !showStallInfo">
                    <span>绑定车位(个)</span>
                    <i class="el-icon-caret-bottom" v-if="!showStallInfo"></i>
                    <i class="el-icon-caret-top" v-else></i>
                  </div>
                </div>
                <div
                  :class="['detail', ownerData.car.length > 6 ? 'scroll' : '']"
                  v-if="showStallInfo"
                >
                  <div v-if="ownerData.car.length < 7">
                    <div class="empty" v-if="ownerData.car.length == 0">
                      暂无数据！
                    </div>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.car"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{ item.carmotor.map(i => i.plates).join('、') }}
                      </span>
                    </div>
                  </div>
                  <el-scrollbar style="height: 100%;" v-else>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.car"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{ item.carmotor.map(i => i.plates).join('、') }}
                      </span>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="oper-item">
                <div class="info-content">
                  <div class="number">{{ ownerData.carmonth.length }}</div>
                  <div class="name" @click="showCarInfo = !showCarInfo">
                    <span>绑定月租车(辆)</span>
                    <i class="el-icon-caret-bottom" v-if="!showCarInfo"></i>
                    <i class="el-icon-caret-top" v-else></i>
                  </div>
                </div>
                <div
                  :class="[
                    'detail',
                    ownerData.carmonth.length > 6 ? 'scroll' : ''
                  ]"
                  v-if="showCarInfo"
                >
                  <div v-if="ownerData.carmonth.length < 7">
                    <div class="empty" v-if="ownerData.carmonth.length == 0">
                      暂无数据！
                    </div>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.carmonth"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{ item.carmotor.map(item => item.plates).join('、') }}
                      </span>
                    </div>
                  </div>
                  <el-scrollbar style="height: 100%;" v-else>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.carmonth"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">{{ item.name }}</span>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="oper-item">
                <div class="info-content">
                  <div class="number">{{ ownerData.carnonmotor.length }}</div>
                  <div class="name" @click="showNoCarInfo = !showNoCarInfo">
                    <span>绑定非机动车(辆)</span>
                    <i class="el-icon-caret-bottom" v-if="!showNoCarInfo"></i>
                    <i class="el-icon-caret-top" v-else></i>
                  </div>
                </div>
                <div
                  :class="[
                    'detail',
                    ownerData.carnonmotor.length > 6 ? 'scroll' : ''
                  ]"
                  v-if="showNoCarInfo"
                >
                  <div v-if="ownerData.carnonmotor.length < 7">
                    <div class="empty" v-if="ownerData.carnonmotor.length == 0">
                      暂无数据！
                    </div>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.carnonmotor"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">{{ item.plates }}</span>
                    </div>
                  </div>
                  <el-scrollbar style="height: 100%;" v-else>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.carnonmotor"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">{{ item.plates }}</span>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="oper-item">
                <div class="info-content">
                  <div class="number">{{ ownerData.carnonmotor.length }}</div>
                  <div class="name" @click="showCardInfo = !showCardInfo">
                    <span>绑定门禁卡(张)</span>
                    <i class="el-icon-caret-bottom" v-if="!showCardInfo"></i>
                    <i class="el-icon-caret-top" v-else></i>
                  </div>
                </div>
                <div
                  :class="[
                    'detail',
                    ownerData.iccard.length > 6 ? 'scroll' : ''
                  ]"
                  v-if="showCardInfo"
                >
                  <div v-if="ownerData.iccard.length < 7">
                    <div class="empty" v-if="ownerData.iccard.length == 0">
                      暂无数据！
                    </div>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.iccard"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{ item.code }}
                      </span>
                    </div>
                  </div>
                  <el-scrollbar style="height: 100%;" v-else>
                    <div
                      class="detail-item"
                      v-for="(item, index) in ownerData.iccard"
                      :key="index"
                    >
                      <span class="dot"></span>
                      <span class="name">
                        {{ item.code }}
                      </span>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
            </div>

            <el-button
              type="primary"
              round
              plain
              icon="iconfont iconzu3638"
              @click="showWonerLog"
            >
              变更日志
            </el-button>
          </div>

          <div class="remark_edit" v-if="isEditOwner">
            <div class="name">备注信息</div>
            <el-input
              type="textarea"
              v-model="ownerRemark"
              resize="none"
              :rows="4"
              placeholder="请输入备注信息"
            ></el-input>
          </div>

          <div class="btn-wp">
            <el-button
              type="primary"
              round
              v-if="
                !isEditOwner &&
                  $menu.getters.judgeRole('Btn-8LaTeYhw5bhAxAWwX9KpsQJC')
              "
              @click="ownerEdit"
            >
              修改客户信息
            </el-button>
            <div class="btn-gp" v-else>
              <el-button type="primary" round @click="ownerEditConform">
                保存修改
              </el-button>
              <el-button type="info" round @click="isEditOwner = false">
                取消
              </el-button>
            </div>
          </div>
        </div>

        <!-- 固定车位、月租车库、非机动车、其他资源 -->
        <div
          class="carport-wp"
          v-else-if="
            currentData &&
              !isLoading &&
              (currentData.type == 'parking' ||
                currentData.type == 'type' ||
                currentData.type == 'monthpark' ||
                currentData.type == 'monthitem' ||
                currentData.type == 'inside' ||
                currentData.type == 'novehicle' ||
                currentData.type == 'other')
          "
        >
          <div class="carport-content">
            <div class="title" v-if="currentData.type == 'parking'">
              <i class="iconfont iconcheku"></i>
              <span>固定车位</span>
            </div>
            <div class="title" v-if="currentData.type == 'type'">
              <i class="iconfont iconcheku"></i>
              <span>{{ currentData.label }}</span>
            </div>
            <div class="title" v-if="currentData.type == 'inside'">
              <i class="iconfont iconcheku"></i>
              <span>内部车辆</span>
            </div>
            <div
              class="title"
              v-if="
                currentData.type == 'monthpark' ||
                  currentData.type == 'monthitem'
              "
            >
              <i class="iconfont iconcheku"></i>
              <span>{{ currentData.label }}</span>
            </div>
            <div class="title" v-if="currentData.type == 'novehicle'">
              <i class="iconfont iconfeijidongche"></i>
              <span>非机动车</span>
            </div>
            <div class="title" v-if="currentData.type == 'other'">
              <i class="iconfont iconqitaziyuan"></i>
              <span>其他资源</span>
            </div>
          </div>
          <div class="labels">
            <div
              :class="[
                'label',
                currentData.type == 'novehicle'
                  ? 'novehicle'
                  : currentData.type == 'other'
                  ? 'other'
                  : ''
              ]"
            >
              <div class="text-wp">
                <div class="number">{{ stallNum ? stallNum : 0 }}</div>
                <div class="name">
                  {{
                    currentData.type == 'novehicle'
                      ? '登记数量(个)'
                      : currentData.type == 'other'
                      ? '资源数量(个)'
                      : '车位数量(个)'
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="btn-wp" style="margin-top: 2.5rem">
            <el-button
              type="warning"
              round
              plain
              icon="iconfont iconzu3637"
              v-if="
                currentData.type == 'inside' &&
                  $menu.getters.judgeRole('Btn-RepXnyEpCoSytuqTQRv0OAmn')
              "
              @click="batchEdit"
            >
              批量修改
            </el-button>
            <!-- $menu.getters.judgeRole('Btn-IkBvSR43acRrvBEw7RWCgTWF') -->
            <el-button
              type="success"
              round
              icon="iconfont iconxinzeng"
              plain
              v-if="
                currentData.type == 'parking' &&
                  $menu.getters.judgeRole('Btn-IkBvSR43acRrvBEw7RWCgTWF')
              "
              @click="addParking"
            >
              新增固定车位
            </el-button>

            <el-button
              type="primary"
              round
              icon="iconfont iconzu3638"
              plain
              v-if="
                currentData.type != 'monthitem' &&
                  currentData.type != 'other' &&
                  currentData.type != 'type' &&
                  $menu.getters.judgeRole('Btn-pGSR5KzFB5Q5YIbXYm1kePDb')
              "
              @click="issueRecord"
            >
              下发失败记录
            </el-button>
            <el-button
              type="primary"
              round
              icon="iconfont iconxinzeng"
              plain
              v-if="
                currentData.type == 'other' &&
                  $menu.getters.judgeRole('Btn-6Vi2wjAb0PpiMLmCD46jsuRZ')
              "
              @click="addOther"
            >
              新增其他资源
            </el-button>
          </div>
        </div>

        <!-- 项目、楼栋、房间信息部分 -->
        <div class="right" v-else-if="!isLoading">
          <div
            :class="['content-wp', currentData.type == 'rooms' ? 'rooms' : '']"
          >
            <div class="avatar-wp">
              <el-avatar :size="60" src="">
                <img
                  src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                />
              </el-avatar>
              <div class="text-wp" v-if="currentData.type == 'village'">
                <div class="name">
                  {{
                    villageData.villagename +
                      '(' +
                      villageData.villageaddr +
                      ')'
                  }}
                </div>
                <div class="adress">
                  {{
                    villageData.addr_detail
                      ? villageData.addr_detail
                      : '暂无详细地址数据'
                  }}
                </div>
              </div>
              <div class="text-wp" v-if="currentData.type == 'building'">
                <div class="name">
                  {{ buildData.village.villagename + ' - ' + buildData.block }}
                </div>
                <div class="adress">
                  {{
                    buildData.village.addr_detail
                      ? buildData.village.addr_detail
                      : '暂无详细地址数据'
                  }}
                </div>
              </div>
              <div class="text-wp" v-if="currentData.type == 'rooms'">
                <div class="name">
                  {{
                    roomData.unit.building.village.villagename +
                      ' | ' +
                      roomData.unit.building.block +
                      ' | ' +
                      roomData.unit.unit +
                      ' | ' +
                      roomData.roomnum
                  }}
                </div>
                <div class="adress">
                  {{
                    roomData.unit.building.village.addr_detail
                      ? roomData.unit.building.village.addr_detail
                      : '暂无详细地址数据'
                  }}
                </div>
              </div>
              <el-switch
                v-if="currentData.type == 'rooms'"
                v-model="roomData.into_house"
                active-color="#3ebb75"
                inactive-color="#f2f2f2"
                active-text="已入住"
                inactive-text="未入住"
                @change="checkinChange"
                :disabled="
                  swtDisabled ||
                    !$menu.getters.judgeRole('Btn-X0q2OMIxanrICZJpKihMZ601')
                "
                style="vertical-align: text-bottom;margin-left: 1rem;float:right;margin-top: 0.25rem;"
              ></el-switch>
            </div>

            <!-- 项目基本信息部分 -->
            <div class="basic-info" v-if="currentData.type == 'village'">
              <!-- 信息编辑组件部分 -->
              <info-edit
                ref="villageEdit"
                v-if="isEditVillage"
                type="village"
                :infoObj="villageData"
              ></info-edit>

              <div class="info-content" v-else>
                <div
                  class="info-item"
                  v-for="(item, index) in villageList"
                  :key="index"
                >
                  <div class="content">
                    <img :src="item.icon" alt="" />
                    <div class="info">
                      <div class="num">{{ item.value }}</div>
                      <div class="name">{{ item.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="remark_edit" v-if="isEditVillage">
                <div class="name">备注信息</div>
                <el-input
                  type="textarea"
                  v-model="villageRemark"
                  resize="none"
                  :rows="4"
                  placeholder="请输入备注信息"
                ></el-input>
              </div>
              <div class="remark-wp" v-else>
                <div class="name">备注信息</div>
                <div class="remark">{{ villageData.remarks }}</div>
              </div>
            </div>

            <!-- 楼栋基本信息部分 -->
            <div class="basic-info build" v-if="currentData.type == 'building'">
              <!-- 信息编辑组件部分 -->
              <info-edit
                ref="bulidEdit"
                v-if="isEditBuild"
                type="building"
                :infoObj="buildData"
              ></info-edit>
              <div class="info-content" v-else>
                <div
                  class="info-item"
                  v-for="(item, index) in buildList"
                  :key="index"
                >
                  <div class="content">
                    <img :src="item.icon" alt="" />
                    <div class="info">
                      <div class="num">{{ item.value }}</div>
                      <div class="name">{{ item.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 房间基本信息部分 -->
            <div class="basic-info" v-if="currentData.type == 'rooms'">
              <div class="info-content">
                <div
                  class="info-item"
                  v-for="(item, index) in roomList"
                  :key="index"
                >
                  <div class="content">
                    <img :src="item.icon" alt="" />
                    <div class="info">
                      <!-- <el-input
                        :disabled="
                          !$menu.getters.judgeRole(
                            'Btn-ArcbW2ef2ynYmrmcUe0GBxjs'
                          )
                        "
                        type="number"
                        v-model="item.value"
                        v-if="item.type && item.type == 'input'"
                        @change="roomAreaChange(item)"
                      >
                        {{ item.value ? item.value : '--' }}
                      </el-input> -->

                      <el-tooltip
                        v-if="index === 3"
                        effect="dark"
                        :content="item.content"
                        placement="top"
                      >
                        <div class="num">
                          {{ item.value ? item.value : '--' }}
                        </div>
                      </el-tooltip>

                      <div class="num" v-else>
                        {{ item.value ? item.value : '--' }}
                        <span
                          v-if="index === 6 && item.type"
                          style="color: #ccc;font-size: 0.7rem;font-weight: 400;"
                        >
                          {{ item.type == 2 ? '(精装)' : '(清水)' }}
                        </span>
                      </div>
                      <div class="name">{{ item.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="remark_edit">
                <div class="name" style="margin-top: 1rem;">备注信息</div>
                <el-input
                  type="textarea"
                  disabled
                  v-model="roomData.remark"
                  resize="none"
                  :rows="4"
                  placeholder="请输入备注信息"
                ></el-input>
              </div>
            </div>

            <!-- 房间下的按钮组 -->
            <div class="room-btn" v-if="currentData.type == 'rooms'">
              <el-button
                type="success"
                round
                icon="iconfont iconxinzeng"
                plain
                @click="dialogShow(1)"
                v-if="$menu.getters.judgeRole('Btn-35pTcFlDnMH45BtujH8X7MFu')"
              >
                新增客户
              </el-button>
              <el-button
                type="warning"
                round
                plain
                icon="iconfont iconzu3637"
                @click="dialogShow(2)"
                v-if="$menu.getters.judgeRole('Btn-gL3foIiKJseBCfVGyFCycN0B')"
              >
                房产过户
              </el-button>
              <el-button
                type="primary"
                round
                plain
                icon="iconfont iconzu3638"
                @click="dialogShow(3)"
              >
                变更日志
              </el-button>
              <el-button
                type="success empty"
                round
                plain
                @click="showEditDialog"
                v-if="$menu.getters.judgeRole('Btn-ArcbW2ef2ynYmrmcUe0GBxjs')"
              >
                修改房屋信息
              </el-button>
            </div>
          </div>

          <!-- 修改项目信息按钮部分 -->
          <div class="btn-wp" v-if="currentData.type == 'village'">
            <el-button
              type="primary"
              round
              v-if="
                !isEditVillage &&
                  $menu.getters.judgeRole('Btn-jrl0S2ygDAAmlWEV8oqgcAxa')
              "
              @click="villageEdit"
            >
              修改项目信息
            </el-button>
            <div
              class="btn-gp"
              v-if="
                isEditVillage &&
                  $menu.getters.judgeRole('Btn-jrl0S2ygDAAmlWEV8oqgcAxa')
              "
            >
              <el-button type="primary" round @click="villageEditConfirm">
                保存修改
              </el-button>
              <el-button type="info" round @click="isEditVillage = false">
                取消
              </el-button>
            </div>
          </div>

          <!-- 修改楼栋信息按钮部分 -->
          <div class="btn-wp" v-if="currentData.type == 'building'">
            <el-button
              type="primary"
              round
              v-if="
                !isEditBuild &&
                  $menu.getters.judgeRole('Btn-oWxhQd2rT85NTXpr0RjM8OG8')
              "
              @click="buildEdit"
            >
              修改楼栋信息
            </el-button>
            <div
              class="btn-gp"
              v-if="
                isEditBuild &&
                  $menu.getters.judgeRole('Btn-oWxhQd2rT85NTXpr0RjM8OG8')
              "
            >
              <el-button type="primary" round @click="buildEditConfirm">
                保存修改
              </el-button>
              <el-button type="info" round @click="isEditBuild = false">
                取消
              </el-button>
            </div>
          </div>

          <div class="table-wp" v-if="currentData.type == 'rooms'">
            <div class="title">客户信息</div>
            <div class="table-content">
              <cus-table
                ref="cusTable"
                title="客户信息"
                :datas="tableData"
                :cusColums="columns"
                :cusConf="conf"
                @chargeChange="chargeChange"
                @emigration="emigration"
              ></cus-table>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <!-- 弹框部分 -->
      <all-dialog
        :type="dialogType"
        :roomid="roomData.id"
        :vid="roomData.vvid"
        :showDialog="showDialog"
        @closeDialog="dialogClose"
        @getRoomData="getRoomData"
      ></all-dialog>

      <!-- 下发失败弹框部分 -->
      <el-dialog
        class="issueDialog"
        :visible="showIssueDialog"
        title="下发失败记录"
        width="80%"
        @close="showIssueDialog = false"
      >
        <div class="table-wp">
          <cus-table
            :datas="issueTableData"
            :cusColums="issueColumns"
            :cusConf="issueConf"
            :ispaging="true"
            :check="true"
            @sizeChange="issueSizeChange"
            @currentChange="issueCurrentChange"
            @selectionChange="selectionChange"
          ></cus-table>
          <el-button
            v-if="$menu.getters.judgeRole('Btn-50xLJ9phlfxiKCegES9iKHRb')"
            :disabled="tableSelected.length == 0"
            type="primary"
            round
            @click="batchIssue"
          >
            下发已选({{ tableSelected.length }})辆
          </el-button>
        </div>
      </el-dialog>

      <!-- 批量修改弹框部分 -->
      <el-dialog
        class="batchDialog"
        :visible="showBatchDialog"
        title="批量修改内部车辆"
        width="80%"
        @close="showBatchDialog = false"
      >
        <div class="table-wp">
          <cus-table
            :datas="batchTableData"
            :cusColums="batchColumns"
            :cusConf="batchConf"
            :ispaging="true"
            :check="true"
            @sizeChange="batchSizeChange"
            @currentChange="batchCurrentChange"
            @selectionChange="editSelectionChange"
          ></cus-table>
          <el-button
            :disabled="editSelected.length == 0"
            type="primary"
            round
            @click="batchDelay"
            style="width: 9rem;"
          >
            延长到期时间({{ editSelected.length }})辆
          </el-button>
        </div>
      </el-dialog>

      <!-- 选择日期弹框部分 -->
      <el-dialog
        class="timeDialog"
        :visible="showTimeDialog"
        title="选择到期时间"
        width="30%"
        @close="showTimeDialog = false"
      >
        <el-date-picker
          v-model="dateVal"
          type="date"
          value-format="timestamp"
          placeholder="请选择到期时间"
        ></el-date-picker>

        <span slot="footer">
          <el-button :loading="isCommit" type="primary" round @click="confirm">
            提交保存
          </el-button>
          <el-button
            :loading="isCommit"
            type="info"
            round
            @click="showTimeDialog = false"
          >
            取消
          </el-button>
        </span>
      </el-dialog>

      <!-- 添加固定车位弹框部分 -->
      <el-dialog
        class="addDialog"
        :visible="showAddDialog"
        title="添加固定车位"
        width="32%"
        :close-on-click-modal="false"
        @close="showAddDialog = false"
      >
        <el-scrollbar style="height: 100%;">
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="addForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="车位编号" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入车位编号"
              ></el-input>
            </el-form-item>
            <el-form-item label="车位面积" prop="area">
              <el-input
                type="number"
                v-model="addForm.area"
                placeholder="请输入车位面积"
              ></el-input>
            </el-form-item>
            <el-form-item label="资源类型" prop="type">
              <el-select
                v-model="addForm.type"
                clearable
                placeholder="请选择资源类型"
                @change="typeChange"
              >
                <el-option
                  v-for="itm in typeOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缴费科目" prop="subject">
              <el-select
                v-model="addForm.subject"
                multiple
                collapse-tags
                clearable
                placeholder="请选择缴费科目"
              >
                <el-option
                  v-for="itm in subjectOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <span slot="footer">
          <el-button
            :loading="isCommit"
            type="primary"
            round
            @click="addSubmit"
          >
            提交保存
          </el-button>
          <el-button
            :loading="isCommit"
            type="info"
            round
            @click="showAddDialog = false"
          >
            取消
          </el-button>
        </span>
      </el-dialog>

      <!-- 添加虚拟资源弹框部分 -->
      <el-dialog
        class="otherDialog"
        :visible="showOtherDialog"
        title="添加虚拟资源"
        width="32%"
        :close-on-click-modal="false"
        @close="showOtherDialog = false"
      >
        <el-scrollbar style="height: 100%;">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="资源名称" prop="name">
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入资源名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="资源面积" prop="area">
              <el-input
                v-model="ruleForm.area"
                placeholder="请输入资源面积"
              ></el-input>
            </el-form-item>
            <el-form-item label="资源类型" prop="type" v-if="rtype == 'select'">
              <el-select
                v-model="ruleForm.type"
                clearable
                placeholder="请选择资源类型"
              >
                <el-option
                  v-for="itm in typeOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源类型" prop="rtype" v-else>
              <el-cascader
                v-model="ruleForm.rtype"
                :options="typeOptions"
                :show-all-levels="false"
                :props="{ checkStrictly: true, value: 'id' }"
                clearable
                placeholder="请选择资源类型"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="首次缴费时间" prop="firstTime">
              <!-- <el-input
                v-model="ruleForm.firstTime"
                placeholder="请输入首次缴费时间"
              ></el-input> -->
              <el-date-picker
                v-model="ruleForm.firstTime"
                type="date"
                value-format="timestamp"
                placeholder="请选择首次缴费时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="缴费科目" prop="subject">
              <el-select
                v-model="ruleForm.subject"
                multiple
                collapse-tags
                clearable
                placeholder="请选择缴费科目"
              >
                <el-option
                  v-for="itm in subjectOptions"
                  :key="itm.id"
                  :label="itm.name"
                  :value="itm.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户姓名" prop="uname">
              <!-- 搜索部分 -->
              <el-autocomplete
                ref="searchInput"
                class="other-search"
                popper-class="my-autocomplete"
                v-model="ruleForm.uname"
                :debounce="0"
                :fetch-suggestions="querySearchAsync"
                placeholder="输入姓名/电话号码搜索"
                @select="handleSelect"
                @blur="autoBlur"
              >
                <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
                <template slot-scope="{ item }">
                  <div class="tr-item">
                    <span class="td-item">{{ item.realname }}</span>
                    <span class="td-item">
                      {{ item.sex ? item.sex : '未知' }}
                    </span>
                    <span class="td-item">{{ item.tel }}</span>
                  </div>
                  <div
                    class="load-more"
                    @click.stop="loadMore"
                    v-if="
                      allUserList.length > 1 &&
                        item.id == allUserList[allUserList.length - 1].id
                    "
                  >
                    {{ nomore ? '没有更多了' : '点击加载更多' }}
                  </div>
                  <div
                    class="load-more"
                    @click.stop="loadMore"
                    v-if="allUserList.length <= 1"
                  >
                    暂无数据！
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item class="remark-wp" label="备注信息" prop="remark">
              <el-input
                type="textarea"
                v-model="ruleForm.remark"
                resize="none"
                :rows="4"
                placeholder="请输入备注信息"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <span slot="footer">
          <el-button
            :loading="isCommit"
            type="primary"
            round
            @click="formSubmit"
          >
            提交保存
          </el-button>
          <el-button
            :loading="isCommit"
            type="info"
            round
            @click="showOtherDialog = false"
          >
            取消
          </el-button>
        </span>
      </el-dialog>

      <!-- 业主变更日志弹框部分 -->
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
            title="客户信息"
            :datas="logTableData"
            :cusColums="logColumns"
            :cusConf="logConf"
            :ispaging="true"
            @sizeChange="logSizeChange"
            @currentChange="logCurrentChange"
          ></cus-table>
        </div>
      </el-dialog>

      <!-- 修改房屋信息 弹框部分 -->
      <el-dialog
        class="roomEdit"
        :visible="showRoomEdit"
        title="修改房屋信息"
        width="32%"
        :close-on-click-modal="false"
        @close="showRoomEdit = false"
      >
        <el-scrollbar style="height: 100%;">
          <el-form
            :model="editForm"
            :rules="editRules"
            ref="editForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="建筑面积" prop="buildareas">
              <el-input
                v-model="editForm.buildareas"
                type="number"
                placeholder="请输入建筑面积"
              ></el-input>
            </el-form-item>
            <el-form-item label="交房状态" prop="check">
              <el-select
                v-model="editForm.check"
                clearable
                placeholder="请选择交房状态"
              >
                <el-option label="未交房" :value="0"></el-option>
                <el-option label="已交房" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="remark" label="备注信息" prop="remark">
              <el-input
                type="textarea"
                v-model="editForm.remark"
                resize="none"
                :rows="4"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <span slot="footer">
          <el-button
            :loading="isCommit"
            type="primary"
            round
            @click="editSubmit"
          >
            提交保存
          </el-button>
          <el-button
            :loading="isCommit"
            type="info"
            round
            @click="showRoomEdit = false"
          >
            取消
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script src="@/assets/means/js/material.js"></script>

<style lang="less">
@import url('~@/assets/means/css/material.less');
</style>
