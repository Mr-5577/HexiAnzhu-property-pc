<template>
  <div
    id="stall-detail"
    :class="[currentData.type == 'car_nonmotor' ? 'novehicle' : '']"
    v-if="!isLoading"
  >
    <div style="height: 100%;position:relative;" v-if="!isEdit">
      <el-scrollbar style="height: 100%;">
        <div class="info-content">
          <div class="top-wp">
            <div
              class="title"
              v-if="
                currentData.type == 'car' && currentData.car_type == 'issale'
              "
            >
              <i class="iconfont iconcheku"></i>
              <span>已售车位</span>
            </div>
            <div
              class="title"
              v-if="
                currentData.type == 'car' && currentData.car_type == 'notsale'
              "
            >
              <i class="iconfont iconcheku"></i>
              <span>未售车位</span>
            </div>
            <div class="title" v-if="currentData.type == 'carmonth'">
              <i class="iconfont iconcheku"></i>
              <span>
                {{ infoObj.resourcestype ? infoObj.resourcestype.name : '' }}
              </span>
            </div>
            <div class="title" v-if="currentData.type == 'car_nonmotor'">
              <i class="iconfont iconfeijidongche"></i>
              <span>非机动车</span>
            </div>
            <div class="title" v-if="currentData.type == 'lastvirtual'">
              <i class="iconfont iconqitaziyuan"></i>
              <span>其他资源</span>
            </div>
            <div
              class="info-ct"
              :style="{
                height: currentData.type == 'lastvirtual' ? '5.2rem' : '7.3rem'
              }"
            >
              <el-scrollbar style="width: 100%;height: 100%">
                <div class="info-wp">
                  <ul>
                    <li v-for="(item, index) in ul1" :key="index">
                      <span class="name">{{ item.name }}</span>
                      <span class="value">{{ item.value }}</span>
                    </li>
                  </ul>
                  <ul>
                    <li v-for="(item, index) in ul2" :key="index">
                      <span class="name">{{ item.name }}</span>
                      <span class="value">{{ item.value }}</span>
                    </li>
                  </ul>
                  <ul>
                    <li v-for="(item, index) in ul3" :key="index">
                      <span class="name">{{ item.name }}</span>
                      <span class="value">{{ item.value }}</span>
                    </li>
                  </ul>
                  <ul v-if="ul4.length > 0">
                    <li v-for="(item, index) in ul4" :key="index">
                      <span class="name">{{ item.name }}</span>
                      <span class="value">{{ item.value }}</span>
                    </li>
                  </ul>
                </div>
              </el-scrollbar>
            </div>
            <div class="title">备注</div>
            <el-input
              type="textarea"
              :rows="3"
              readonly
              resize="none"
              v-model="infoObj.remark"
            ></el-input>
            <div class="btn-wp" v-if="currentData.type != 'lastvirtual'">
              <el-button
                type="warning"
                round
                plain
                icon="iconfont iconzu3637"
                v-if="
                  currentData.type == 'car' &&
                    $menu.getters.judgeRole('Btn-GGG0Ipv3y9cUR5x2s5fW39cL')
                "
                @click="showCarMove"
              >
                车位过户
              </el-button>
              <el-button
                type="warning"
                round
                plain
                icon="iconfont iconzu3637"
                v-if="
                  currentData.type == 'carmonth' &&
                    $menu.getters.judgeRole('Btn-PHnm3zcs7KkPwUekZmDfPkTJ')
                "
                @click="unbind"
              >
                解绑月租车
              </el-button>
              <el-button
                v-if="
                  currentData.type != 'car_nonmotor' &&
                    currentData.type != 'insideitem'
                "
                type="primary"
                round
                plain
                icon="iconfont iconzu3638"
                @click="showRecord"
              >
                操作记录
              </el-button>
              <el-button
                type="success"
                round
                plain
                v-if="
                  (currentData.type == 'car' ||
                    currentData.type == 'carmonth' ||
                    currentData.type == 'insideitem') &&
                    $menu.getters.judgeRole('Btn-50xLJ9phlfxiKCegES9iKHRb')
                "
                @click="adminIssue"
              >
                管理员下发
              </el-button>

              <el-button
                type="danger"
                round
                plain
                v-if="
                  currentData.type == 'car' &&
                    $menu.getters.judgeRole('Btn-w9SmvzXiRtwGOF64nQLEQxp0')
                "
                @click="deleteCar"
              >
                删除固定车
              </el-button>

              <el-button
                v-if="currentData.type == 'carmonth'"
                type="primary"
                round
                plain
                icon="iconfont iconzu3638"
                @click="stopRecord"
              >
                停用记录
              </el-button>
              <el-button
                type="warning"
                round
                plain
                icon="iconfont iconzu3637"
                v-if="
                  currentData.type == 'carmonth' &&
                    $menu.getters.judgeRole('Btn-QBA5XdLYHnccJNxVS4TslTXZ')
                "
                @click="changeOwner"
              >
                变更业主
              </el-button>
              <el-button
                type="danger"
                round
                plain
                v-if="
                  currentData.type == 'carmonth' &&
                    $menu.getters.judgeRole('Btn-ol9TqGP6Ddhd5ZjVIG9HjthW')
                "
                @click="delMonthCar"
              >
                删除月租车
              </el-button>
              <el-button
                type="danger"
                round
                plain
                v-if="
                  currentData.type == 'car_nonmotor' &&
                    $menu.getters.judgeRole('Btn-RTuWHOTnaoFyq7sJQ31P4pzp')
                "
                @click="delNonMotor"
              >
                删除非机动车
              </el-button>
            </div>
          </div>
          <div
            class="bottom-wp"
            v-if="
              currentData.type != 'car_nonmotor' &&
                currentData.type != 'insideitem' &&
                currentData.type != 'lastvirtual'
            "
          >
            <div class="table-wp">
              <div class="title">绑定车牌信息</div>
              <div class="table-content">
                <cus-table
                  ref="cusTable"
                  title="绑定车牌信息"
                  :datas="tableData"
                  :cusColums="columns"
                  :cusConf="conf"
                  @delete="delPlate"
                ></cus-table>
              </div>
            </div>
            <div class="table-wp">
              <div class="title">绑定非机动车信息</div>
              <div class="table-content">
                <cus-table
                  ref="cusTable"
                  title="绑定非机动车信息"
                  :datas="notableData"
                  :cusColums="nocolumns"
                  :cusConf="noconf"
                  @delete="delNomotor"
                ></cus-table>
              </div>
            </div>
            <div class="btn-content">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-0yTQybOWHPn9b7n4kPeIa4aI')"
                type="primary"
                round
                @click="isEdit = true"
              >
                修改车位信息
              </el-button>
              <el-button
                v-if="
                  currentData.type == 'car' &&
                    $menu.getters.judgeRole('Btn-ODyFGKPf5AKHuL78g2AEDvPF')
                "
                type="warning"
                round
                @click="editSubResource"
              >
                修改科目资源
              </el-button>
              <el-button
                v-if="
                  currentData.type == 'carmonth' &&
                    $menu.getters.judgeRole('Btn-R80nDiy3j1VHikVsYzVbaZlf')
                "
                type="warning"
                round
                @click="editSubResource"
              >
                修改科目资源
              </el-button>
              <el-button
                v-if="
                  currentData.type == 'carmonth' &&
                    $menu.getters.judgeRole('Btn-dz6jdQIVSXEUvOs0dyHXPV0M')
                "
                plain
                round
                @click="startStopHandle"
              >
                {{ infoObj.status == 1 ? '报停' : '启用' }}
              </el-button>
            </div>
          </div>
          <div class="btn-content" v-else>
            <el-button
              v-if="$menu.getters.judgeRole('Btn-0yTQybOWHPn9b7n4kPeIa4aI')"
              type="primary"
              round
              @click="isEdit = true"
            >
              {{
                currentData.type == 'lastvirtual'
                  ? '修改资源信息'
                  : '修改车位信息'
              }}
            </el-button>
            <el-button
              v-if="
                currentData.type == 'insideitem' &&
                  $menu.getters.judgeRole('Btn-rLPl0XiVsPUc2V7hWGc3C4lX')
              "
              type="primary"
              class="empty"
              round
              @click="insideDel"
            >
              删除车辆信息
            </el-button>
            <el-button
              v-if="
                currentData.type == 'lastvirtual' &&
                  $menu.getters.judgeRole('Btn-5rCqnL4uVu9ydxn54KFFvqtM')
              "
              type="primary"
              class="empty"
              round
              @click="virtualEditHandle"
            >
              修改资源类型
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 车位信息编辑组件 -->
    <stall-edit
      :type="currentData.type"
      :infoObj="infoObj"
      @cancel="isEdit = false"
      @editSuccess="editSuccess"
      v-else
    ></stall-edit>

    <!-- 车位过户弹框组件 -->
    <car-move ref="carMove" @moveSuccess="moveSuccess"></car-move>

    <!-- 固定车位操作记录组件 -->
    <operatingRecord
      ref="operatingRecord"
      @carTransfer="showCarMove"
    ></operatingRecord>

    <!-- 报停弹框 -->
    <el-dialog
      class="stopStall"
      :visible="showStopDialog"
      :title="infoObj.status == 1 ? '停用月租车' : '启用月租车'"
      width="30%"
      @close="showStopDialog = false"
    >
      <!-- 房产过户部分 -->
      <div class="body-content">
        <div class="title">
          {{ infoObj.status == 1 ? '停用日期' : '启用日期' }}
        </div>
        <el-date-picker
          v-model="startStopDate"
          type="date"
          placeholder="请选择日期"
          value-format="timestamp"
        ></el-date-picker>
        <div class="title">备注说明</div>
        <el-input
          type="textarea"
          :rows="3"
          resize="none"
          v-model="remarkVal"
        ></el-input>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button type="primary" round @click="monthStop">
          {{ infoObj.status == 1 ? '确定停用' : '确认启用' }}
        </el-button>
        <el-button type="info" round @click="showStopDialog = false">
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 月租车变更业主弹框 -->
    <el-dialog
      class="stopStall"
      :visible="showChangeDialog"
      title="变更业主"
      width="30%"
      @close="showChangeDialog = false"
    >
      <div class="body-content">
        <div class="title">
          搜索并选择业主
        </div>
        <el-select
          v-model="ownerVal"
          filterable
          remote
          reserve-keyword
          placeholder="请输入姓名/电话号"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="ownerChange"
        >
          <el-option
            v-for="itm in userOptions"
            :key="itm.id"
            :label="itm.realname"
            :value="itm.id"
          >
            <div style="display: flex;justify-content: space-between;">
              <span style="flex: 2;">{{ itm.realname }}</span>
              <span style="flex: 1;text-align: center;">{{ itm.sex }}</span>
              <span style="flex: 3;text-align: right;">{{ itm.tel }}</span>
            </div>
          </el-option>
        </el-select>
        <div class="title">
          联系电话
        </div>
        <el-input v-model="ownerTel" placeholder="请输入联系电话"></el-input>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="changeSubmit"
        >
          确认变更
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showChangeDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改科目资源弹框 -->
    <el-dialog
      class="editDialog"
      :visible="showEditDialog"
      title="科目、资源修改"
      width="35%"
      @close="showEditDialog = false"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="资源类型" prop="typeVal">
          <el-select
            v-model="editForm.typeVal"
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
        <el-form-item label="收费科目" prop="subVal">
          <el-select
            v-model="editForm.subVal"
            multiple
            collapse-tags
            clearable
            placeholder="请选择缴费科目"
          >
            <el-option
              v-for="itm in subOptions"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button :loading="editing" type="primary" round @click="editCommit">
          确认提交
        </el-button>
        <el-button
          :loading="editing"
          type="info"
          round
          @click="showEditDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改虚拟资源类型弹框 -->
    <el-dialog
      class="virtualDialog"
      :visible="showVirtualDialog"
      title="虚拟资源类型修改"
      width="30%"
      @close="showVirtualDialog = false"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        :hide-required-asterisk="true"
      >
        <el-form-item label="资源类型" prop="typeVal" v-if="rtype == 'select'">
          <el-select
            v-model="editForm.typeVal"
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
        <el-form-item label="资源类型" prop="rtype" v-else>
          <el-cascader
            v-model="editForm.rtype"
            :options="typeOptions"
            :show-all-levels="false"
            :props="{ checkStrictly: true, value: 'id' }"
            clearable
            placeholder="请选择资源类型"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button :loading="editing" type="primary" round @click="virtualEdit">
          确认提交
        </el-button>
        <el-button
          :loading="editing"
          type="info"
          round
          @click="showVirtualDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 解绑关联非机动车弹框 -->
    <el-dialog
      class="unbidDialog"
      :visible="showUnbindDialog"
      title="非机动车解绑"
      width="20%"
      @close="showUnbindDialog = false"
    >
      <div class="body-content">
        <div class="title">是否清除非机动车周期</div>
        <el-select v-model="clearCycle" placeholder="请选择是否清除周期">
          <el-option label="否" :value="1"></el-option>
          <el-option label="是" :value="2"></el-option>
        </el-select>
      </div>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="unbinding"
          type="primary"
          round
          @click="nocarUnbind"
        >
          确认移除
        </el-button>
        <el-button
          :loading="unbinding"
          type="info"
          round
          @click="showUnbindDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 停用记录 弹框部分 -->
    <el-dialog
      class="stopRecord"
      :visible.sync="showStopRecord"
      title="停用记录"
      width="50%"
      :close-on-click-modal="true"
    >
      <div class="table-wp">
        <cus-table
          :datas="srTableData"
          :cusColums="srcolumns"
          :cusConf="srconf"
        ></cus-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 导入表格json 文件
import stallInfo from '@/assets/means/json/stall-info.json'
import monthInfo from '@/assets/means/json/month-info.json'
import nocarInfo from '@/assets/means/json/nocar-info.json'
import stopRecord from '@/assets/means/json/stop-record.json'
// 导入车位过户弹框组件
import carMove from '@/components/means/common/CarMove.vue'
// 导入固定车位操作记录弹框组件
import operatingRecord from '@/components/means/common/OperatingRecord.vue'
// 导入车位编辑组件
import stallEdit from '@/components/means/common/StallEdit.vue'

export default {
  name: 'StallDetail',
  components: {
    carMove,
    operatingRecord,
    stallEdit
  },
  data() {
    return {
      // 接口数据对象
      urlObj: {
        parkingInfo: this.$api.state.Means.parkingInfo.url,
        monthParkingInfo: this.$api.state.Means.monthParkingInfo.url,
        novehicleInfo: this.$api.state.Means.novehicleInfo.url,
        delPlate: this.$api.state.Means.delPlate.url,
        monthStartStop: this.$api.state.Means.monthStartStop.url,
        insideDetail: this.$api.state.Means.insideDetail.url,
        virtualDetail: this.$api.state.Means.virtualDetail.url,
        monthUnbind: this.$api.state.Means.monthUnbind.url,
        delmonthcar: this.$api.state.Means.delmonthcar.url,
        delcarnomotor: this.$api.state.Means.delcarnomotor.url,
        carinsidedel: this.$api.state.Means.carinsidedel.url,
        issueCar: this.$api.state.Means.issueCar.url,
        carType: this.$api.state.Means.carType.url,
        editcarsub: this.$api.state.Means.editcarsub.url,
        monthresourcesedit: this.$api.state.Means.monthresourcesedit.url,
        changeOwner: this.$api.state.Means.changeOwner.url,
        subjectbytype: this.$api.state.Public.subjectbytype.url,
        carbyfixcar: this.$api.state.Means.carbyfixcar.url,
        unbindnomotor: this.$api.state.Means.unbindnomotor.url,
        carmonthstoplog: this.$api.state.Means.carmonthstoplog.url,
        delfixcarUrl: this.$api.state.Means.delfixcar.url,
        editvirtualtype: this.$api.state.Means.editvirtualtype.url,
        virtualtypetree: this.$api.state.Means.virtualtypetree.url
      },
      // 是否正在加载
      isLoading: false,
      // 当前选择数据
      currentData: '',
      // 信息第一列数据
      ul1: [],
      // 信息第二列数据
      ul2: [],
      // 信息第三列数据
      ul3: [],
      // 信息第四列数据
      ul4: [],
      // 当前信息对象数据
      infoObj: '',
      // 备注文本域绑定值
      textarea: '',
      // 车牌信息表格数据
      tableData: [],
      // 表格配置项
      columns: stallInfo.list,
      // 表格基本配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 非机动车表格数据
      notableData: [],
      // 非机动车表格配置项
      nocolumns: nocarInfo.list,
      // 非机动车表格基本配置
      noconf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否编辑车位信息
      isEdit: false,
      // 是否显示报停、启用弹框
      showStopDialog: false,
      // 车位停用或者启用日期绑定值
      startStopDate: '',
      // 备注绑定值
      remarkVal: '',
      // 是否显示资源、科目修改弹框
      showEditDialog: false,
      // 资源、科目修改表单
      editForm: {
        subVal: [],
        typeVal: '',
        rtype: []
      },
      editRules: {
        subVal: [
          { required: true, message: '请选择收费科目', trigger: 'change' }
        ],
        typeVal: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ],
        rtype: [
          { required: true, message: '请选择资源类型', trigger: 'change' }
        ]
      },
      // 收费科目列表
      subOptions: [],
      // 资源类型列表
      typeOptions: [],
      // 是否显示变更业主弹框
      showChangeDialog: false,
      loading: false,
      userOptions: [],
      ownerVal: '',
      ownerTel: '',
      // 是否正在提交数据
      isCommit: false,
      editing: false,
      // 是否显示清除非机动车弹框
      showUnbindDialog: false,
      // 是否正在解绑
      unbinding: false,
      // 是否清除非机动车周期
      clearCycle: false,
      cindex: '',
      // 是否显示停用记录弹框
      showStopRecord: false,
      // 停用记录表格数据
      srTableData: [],
      // 停用记录表格配置项
      srcolumns: stopRecord.list,
      // 停用记录表格基本配置
      srconf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      // 是否显示虚拟资源编辑弹框
      showVirtualDialog: false,
      // 资源数据是否是树形结构
      rtype: 'select'
    }
  },

  /**
   * 生命周期
   */
  created() {},

  /**
   * 方法
   */
  methods: {
    // 初始化处理
    init(obj) {
      this.isEdit = false
      this.currentData = obj
      this.getParkDetail(obj)
    },

    // 获取固定车位、月租车位、非机动车详情
    getParkDetail(obj) {
      this.isLoading = true
      let url = ''
      let data = {
        id: obj.id
      }
      switch (obj.type) {
        case 'car':
          this.columns = stallInfo.list
          url = this.urlObj.parkingInfo
          this.getNocarByFixcar()
          break
        case 'carmonth':
          this.columns = monthInfo.list
          url = this.urlObj.monthParkingInfo
          break
        case 'car_nonmotor':
          url = this.urlObj.novehicleInfo
          break
        case 'insideitem':
          url = this.urlObj.insideDetail
          break
        case 'lastvirtual':
          url = this.urlObj.virtualDetail
          break
      }
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            let arr = []
            let names = []
            let charges = []
            let carpark = []
            let subArr = res.Data.subject_arr ? res.Data.subject_arr : []
            if (subArr.length > 0) {
              subArr.forEach(item => {
                if (item.name) {
                  names.push(item.name)
                }
                if (item.money) {
                  charges.push(item.money + '元')
                }
                if (item.carpark_name) {
                  carpark.push(item.carpark_name)
                }
              })
            }
            switch (obj.type) {
              case 'car':
                this.ul1 = [
                  {
                    name: '车主姓名',
                    value:
                      res.Data.owner && res.Data.owner.realname
                        ? res.Data.owner.realname
                        : '--'
                  },
                  {
                    name: '车位名称',
                    value: res.Data.sort ? res.Data.sort : '--'
                  },
                  {
                    name: '截止日期',
                    value: res.Data.endtime ? res.Data.endtime : '--'
                  },
                  {
                    name: '启用日期',
                    value: res.Data.starttime ? res.Data.starttime : '--'
                  }
                ]
                this.ul2 = [
                  {
                    name: '联系电话',
                    value:
                      res.Data.owner && res.Data.owner.tel
                        ? res.Data.owner.tel
                        : '--'
                  },
                  {
                    name: '资源类型',
                    value: res.Data.resourcestype.name
                      ? res.Data.resourcestype.name
                      : '--'
                  },
                  {
                    name: '使用周期',
                    value:
                      res.Data.starttime && res.Data.endtime
                        ? res.Data.starttime + '-' + res.Data.endtime
                        : '--'
                  }
                ]
                this.ul3 = [
                  {
                    name: '使用类型',
                    value: '购买'
                  },
                  {
                    name: '车位面积',
                    value: res.Data.area ? res.Data.area : '--'
                  },
                  {
                    name: '下发电话',
                    value: res.Data.cartel
                      ? res.Data.cartel.tel +
                        (res.Data.cartel.num > 0
                          ? `(${res.Data.cartel.num})`
                          : '')
                      : '--'
                  }
                ]
                this.ul4 = [
                  {
                    name: '收费科目',
                    value: names.length > 0 ? names.join('/') : '--'
                  },
                  {
                    name: '每月费用',
                    value: charges.length > 0 ? charges.join('/') : '--'
                  },
                  {
                    name: '所属车场',
                    value: carpark.length > 0 ? carpark.join('/') : '--'
                  }
                ]
                this.infoObj = res.Data
                res.Data.carmotor.forEach(item => {
                  let obj = {
                    id: item.id,
                    plate: item.plates ? item.plates : '--',
                    owner: item.name ? item.name : '--',
                    phone: item.tel ? item.tel : '--',
                    time: item.create_time ? item.create_time : '--',
                    operator: item.creater ? item.creater.realname : '--'
                  }
                  arr.push(obj)
                })
                this.tableData = arr
                break
              case 'carmonth':
                let rooms = res.Data.rooms.map(item => item.roomnum)
                this.ul1 = [
                  {
                    name: '车主姓名',
                    value:
                      res.Data.owner && res.Data.owner.realname
                        ? res.Data.owner.realname
                        : '--'
                  },
                  {
                    name: '月租类型',
                    value:
                      res.Data.resourcestype && res.Data.resourcestype.name
                        ? res.Data.resourcestype.name
                        : '--'
                  },
                  {
                    name: '所属资源',
                    value: rooms.length > 0 ? rooms.join('、') : '--'
                  },
                  {
                    name: '合同文件',
                    value: res.Data.file ? res.Data.file : '--'
                  }
                ]
                this.ul2 = [
                  {
                    name: '联系电话',
                    value:
                      res.Data.owner && res.Data.owner.tel
                        ? res.Data.owner.tel
                        : '--'
                  },
                  {
                    name: '身份证号',
                    value:
                      res.Data.owner && res.Data.owner.idcard
                        ? res.Data.owner.idcard
                        : '--'
                  },
                  {
                    name: '下发电话',
                    value: res.Data.cartel
                      ? res.Data.cartel.tel +
                        (res.Data.cartel.num > 0
                          ? `(${res.Data.cartel.num})`
                          : '')
                      : '--'
                  },
                  {
                    name: '所属车场',
                    value: carpark.length > 0 ? carpark.join('/') : '--'
                  }
                ]
                this.ul3 = [
                  {
                    name: '客户类型',
                    value:
                      res.Data.owner && res.Data.owner.ownerType
                        ? res.Data.owner.ownerType.name
                        : ''
                  },
                  {
                    name: '使用类型',
                    value: '租用'
                  },
                  {
                    name: '启用日期',
                    value: res.Data.starttime
                  }
                ]
                this.ul4 = [
                  {
                    name: '收费科目',
                    value: names.length > 0 ? names.join('/') : '--'
                  },

                  {
                    name: '每月费用',
                    value: charges.length > 0 ? charges.join('/') : '--'
                  },
                  {
                    name: '周期',
                    value:
                      (res.Data.starttime ? res.Data.starttime : '""') +
                      '~' +
                      (res.Data.endtime ? res.Data.endtime : '""')
                  }
                ]
                this.infoObj = res.Data
                res.Data.carmotor.forEach(item => {
                  let obj = {
                    id: item.id,
                    plate: item.plates ? item.plates : '--',
                    owner: item.name ? item.name : '--',
                    phone: item.tel ? item.tel : '--',
                    time: item.create_time ? item.create_time : '--',
                    operator: item.creater ? item.creater.realname : '--'
                  }
                  arr.push(obj)
                })
                this.tableData = arr
                break
              case 'car_nonmotor':
                this.ul1 = [
                  {
                    name: '车主姓名',
                    value:
                      res.Data.owner && res.Data.owner.realname
                        ? res.Data.owner.realname
                        : '--'
                  },
                  {
                    name: '联系电话',
                    value: res.Data.non_owner_tel
                      ? res.Data.non_owner_tel
                      : '--'
                  },
                  {
                    name: '截止日期',
                    value: res.Data.endtime ? res.Data.endtime : '--'
                  }
                ]
                this.ul2 = [
                  {
                    name: '车位编号',
                    value: res.Data.sort ? res.Data.sort : '--'
                  },
                  {
                    name: '车牌号',
                    value: res.Data.plates ? res.Data.plates : '--'
                  },
                  {
                    name: 'IC卡名称',
                    value:
                      res.Data.iccard_data && res.Data.iccard_data.name
                        ? res.Data.iccard_data.name
                        : '--'
                  }
                ]
                this.ul3 = [
                  {
                    name: '使用周期',
                    value:
                      res.Data.starttime && res.Data.endtime
                        ? res.Data.starttime + ' - ' + res.Data.endtime
                        : '--'
                  },
                  {
                    name: '车辆类别',
                    value: res.Data.resourcestype
                      ? res.Data.resourcestype.name
                      : '--'
                  },
                  {
                    name: 'IC卡卡号',
                    value:
                      res.Data.iccard_data && res.Data.iccard_data.code
                        ? res.Data.iccard_data.code
                        : '--'
                  }
                ]
                this.ul4 = [
                  {
                    name: '收费科目',
                    value: names.length > 0 ? names.join('/') : '--'
                  },
                  {
                    name: '每月费用',
                    value: charges.length > 0 ? charges.join('/') : '--'
                  }
                ]
                this.infoObj = res.Data
                break
              case 'insideitem':
                this.ul1 = [
                  {
                    name: '员工姓名',
                    value: res.Data.non_owner_name
                      ? res.Data.non_owner_name
                      : '--'
                  },
                  {
                    name: '其它车牌',
                    value: '--'
                  },
                  {
                    name: '下发电话',
                    value: res.Data.cartel
                      ? res.Data.cartel.tel +
                        (res.Data.cartel.num > 0
                          ? `(${res.Data.cartel.num})`
                          : '')
                      : '--'
                  }
                ]
                let car = ''
                res.Data.carmotor.forEach(item => {
                  car = car ? car + '、' + item.plates : car + item.plates
                })
                this.ul2 = [
                  {
                    name: '车牌号码',
                    value: car ? car : '--'
                  },
                  {
                    name: '停放位置',
                    value: '--'
                  }
                ]
                this.ul3 = [
                  {
                    name: '联系电话',
                    value: res.Data.non_owner_tel
                      ? res.Data.non_owner_tel
                      : '--'
                  },
                  {
                    name: '起始时间',
                    value: res.Data.starttime ? res.Data.starttime : '--'
                  }
                ]
                this.ul4 = [
                  {
                    name: '身份证号',
                    value: '--'
                  },
                  {
                    name: '截止时间',
                    value: res.Data.endtime ? res.Data.endtime : '--'
                  }
                ]
                this.infoObj = res.Data
                break
              case 'lastvirtual':
                this.ul1 = [
                  {
                    name: '资源名称',
                    value: res.Data.name ? res.Data.name : '--'
                  },
                  {
                    name: '建筑面积',
                    value: res.Data.area ? res.Data.area + 'm²' : '--'
                  }
                ]
                this.ul2 = [
                  {
                    name: '资源类别',
                    value: res.Data.resourcestype
                      ? res.Data.resourcestype.name
                      : '--'
                  },
                  {
                    name: '缴费科目',
                    value: names.length > 0 ? names.join('、') : '--'
                  }
                ]
                this.ul3 = [
                  {
                    name: '客户名称',
                    value:
                      res.Data.owner && res.Data.owner.realname
                        ? res.Data.owner.realname
                        : '--'
                  },
                  {
                    name: '首次缴费',
                    value: res.Data.turned ? res.Data.turned : '--'
                  }
                ]
                res.Data.remark = res.Data.bz ? res.Data.bz : ''
                this.infoObj = res.Data
                break
            }
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.$emit('closeLoading')
          this.isLoading = false
        })
        .catch(() => {
          this.$emit('closeLoading')
          this.isLoading = false
        })
    },

    // 获取固定车关联的非机动车列表
    getNocarByFixcar() {
      // 表格处于加载状态
      this.noconf.loadStatus = true
      let data = {
        car_id: this.currentData.id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carbyfixcar, data)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.resource = item.resourcestype.name
              item.icname = item.iccard.map(itm => itm.code).join('、')
              item.cname = item.creater.realname
            })
            // 设置查询总数
            this.noconf.dataTotal = 0
            // 存放查询数据
            this.notableData = res.Data
            // 关闭加载状态
            this.noconf.loadStatus = false
            // 清空空数据提示
            this.noconf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.notableData = []
            this.noconf.emptyText = res.Message
            this.noconf.dataTotal = 0
            this.noconf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.notableData = []
          this.noconf.emptyText = '服务器连接失败...'
          this.noconf.dataTotal = 0
          this.noconf.loadStatus = false
        })
    },

    // 显示车位过户弹框
    showCarMove() {
      let carMove = this.$refs.carMove
      carMove.init(this.infoObj)
    },

    // 显示操作记录弹框
    showRecord() {
      let record = this.$refs.operatingRecord
      record.init(this.infoObj, this.currentData.type)
    },

    // 车位信息编辑成功处理
    editSuccess() {
      // 获取一次车位详情数据
      this.getParkDetail(this.currentData)
      this.isEdit = false
    },

    // 车位信息编辑成功处理
    moveSuccess() {
      // 获取一次车位详情数据
      this.getParkDetail(this.currentData)
    },

    // 车牌删除处理
    delPlate(index) {
      this.$confirm('确定要删除当前车牌信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.tableData[index].id
        }
        this.$axios
          .post(this.urlObj.delPlate, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '车牌信息删除成功！'
              })
              // 重新获取一次数据
              this.getParkDetail(this.currentData)
            } else {
              let msg = res.Message ? res.Message : '车牌信息删除失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },

    // 车牌删除处理
    delNomotor(index) {
      this.cindex = index
      this.clearCycle = ''
      this.showUnbindDialog = true
    },

    // 非机动车解绑确认
    nocarUnbind() {
      if (this.clearCycle) {
        this.unbinding = true
        let data = {
          id: this.notableData[this.cindex].id,
          is_clear: this.clearCycle
        }
        this.$axios
          .post(this.urlObj.unbindnomotor, data)
          .then(res => {
            this.unbinding = false
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '非机动车解绑成功！'
              })
              this.showUnbindDialog = false
              this.getNocarByFixcar()
            } else {
              let msg = res.Message ? res.Message : '非机动车解绑失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.unbinding = false
          })
      } else {
        this.$message({
          type: 'waring',
          message: '请选择是否清除非机动车周期！'
        })
      }
    },

    // 月租车解绑
    unbind() {
      this.$confirm('确定要解绑月租车吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.infoObj.id
        }
        this.$axios
          .post(this.urlObj.monthUnbind, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '月租车解绑成功！'
              })
              // 重新获取一次数据
              this.getParkDetail(this.currentData)
            } else {
              let msg = res.Message ? res.Message : '月租车解绑失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => {})
      })
    },

    // 月租车点击启用/停用按钮处理
    startStopHandle() {
      this.startStopDate = ''
      this.remarkVal = ''
      this.showStopDialog = true
    },

    // 月租车报停确认处理
    monthStop() {
      if (!this.startStopDate && !this.remarkVal.trim()) {
        this.$message({
          type: 'warning',
          message: '请填写日期和备注！'
        })
      } else if (!this.startStopDate) {
        this.$message({
          type: 'warning',
          message: '请选择日期！'
        })
      } else if (!this.remarkVal.trim()) {
        this.$message({
          type: 'warning',
          message: '请填写备注！'
        })
      } else {
        let data = {
          id: this.currentData.id,
          time: this.startStopDate / 1000,
          desc: this.remarkVal.trim()
        }
        this.$axios
          .post(this.urlObj.monthStartStop, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message:
                  this.infoObj.status == 1
                    ? '月租车位报停成功！'
                    : '月租车位启用成功！'
              })
              // 重新获取一次数据
              this.getParkDetail(this.currentData)
            } else {
              let msg = res.Message
                ? res.Message
                : this.infoObj.status == 1
                ? '月租车位报停失败！'
                : '月租车位启用失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.showStopDialog = false
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
            this.showStopDialog = false
          })
      }
    },

    // 点击变更业主按钮处理
    changeOwner() {
      this.userOptions = []
      this.ownerVal = ''
      this.showChangeDialog = true
    },

    // 搜索业主
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        let data = {
          keywords: query,
          page: 1,
          limit: 10000,
          vid: this.infoObj.vid
        }
        this.$axios
          .post(this.$api.state.Means.userSearch.url, data)
          .then(res => {
            if (res.Code === 200) {
              this.userOptions = res.Data ? res.Data.data : []
            } else {
              let msg = res.Message ? res.Message : '搜索业主失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.loading = false
          })
      } else {
        this.userOptions = []
      }
    },

    // 点击确认变更处理
    changeSubmit() {
      if (this.ownerVal && this.ownerTel) {
        this.isCommit = true
        let data = {
          id: this.infoObj.id,
          oid: this.ownerVal,
          non_owner_tel: this.ownerTel
        }
        this.$axios
          .post(this.urlObj.changeOwner, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '变更业主成功！'
              })
              this.showChangeDialog = false
              // 重新获取一次数据
              this.getParkDetail(this.currentData)
            } else {
              let msg = res.Message ? res.Message : '变更业主失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isCommit = false
          })
          .catch(() => {
            this.isCommit = false
          })
      } else if (!this.ownerVal) {
        this.$message({
          type: 'warning',
          message: '请选择业主！'
        })
      } else if (!this.ownerTel) {
        this.$message({
          type: 'warning',
          message: '请输入联系电话！'
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择业主并输入联系电话！'
        })
      }
    },

    // 删除内部车
    insideDel() {
      this.$confirm('确定要删除当前内部车辆吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.infoObj.id
        }
        this.$axios
          .post(this.urlObj.carinsidedel, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '内部车辆删除成功！'
              })
              this.$emit('delSuccess')
            } else {
              let msg = res.Message ? res.Message : '内部车辆删除失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },

    // 管理员下发
    adminIssue() {
      this.$confirm('确定要下发当前车辆吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let tid = ''
        switch (this.currentData.type) {
          case 'car':
            tid = 'car'
            break
          case 'carmonth':
            tid = 'carmonth'
            break
          case 'insideitem':
            tid = 'carinside'
            break
        }
        let data = {
          id: this.infoObj.id,
          type: tid
        }
        this.$axios
          .post(this.urlObj.issueCar, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '车辆下发成功！'
              })
            } else {
              let msg = res.Message ? res.Message : '车辆下发失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(() => {})
      })
    },

    // 点击修改科目资源按钮处理
    editSubResource() {
      // 表单验证重置
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      this.getResourceType()
      if (this.infoObj.resources_type_id) {
        this.editForm.typeVal = this.infoObj.resources_type_id
        this.editForm.subVal = this.infoObj.subject_arr.map(item => item.id)
        this.getSubjectofType()
      }
      this.showEditDialog = true
    },

    // 获取资源类型列表
    getResourceType() {
      let data = {}
      switch (this.currentData.type) {
        case 'car':
          data.type = 'carfixed'
          break
        case 'carmonth':
          data.type = 'carmonth'
          break
        case 'lastvirtual':
          data.type = 'virtual'
          break
      }
      this.$axios
        .post(this.urlObj.carType, data)
        .then(res => {
          if (res.Code === 200) {
            this.typeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '资源类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '资源类型数据获取失败！'
          })
        })
    },

    // 获取资源类型 树形数据
    getResourceTypeTree() {
      this.$axios
        .post(this.urlObj.virtualtypetree)
        .then(res => {
          if (res.Code === 200) {
            this.rtype = res.Data.type
            this.typeOptions = res.Data && res.Data.data ? res.Data.data : []
          } else {
            let msg = res.Message ? res.Message : '资源类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '资源类型数据获取失败！'
          })
        })
    },

    // 资源类型选择更改处理
    typeChange(val) {
      this.subOptions = []
      this.editForm.subVal = []
      if (val) {
        this.getSubjectofType()
      }
    },

    // 获取车位类型下的缴费科目
    getSubjectofType() {
      let data = {
        vid: this.infoObj.vid,
        resource_type_id: this.editForm.typeVal
      }
      this.$axios
        .post(this.urlObj.subjectbytype, data)
        .then(res => {
          if (res.Code === 200) {
            this.subOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '缴费科目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '缴费科目数据获取失败！'
          })
        })
    },

    // 科目、资源编辑提交
    editCommit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editing = true
          let data = {
            id: this.infoObj.id,
            resources_type_id: this.editForm.typeVal,
            subject_village_arr: this.editForm.subVal
          }
          let url =
            this.currentData.type == 'car'
              ? this.urlObj.editcarsub
              : this.urlObj.monthresourcesedit
          this.$axios
            .post(url, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '资源、科目修改成功！'
                })
                this.showEditDialog = false
                // 重新获取一次详情数据
                this.getParkDetail(this.currentData)
              } else {
                let msg = res.Message ? res.Message : '资源、科目修改失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.editing = false
            })
            .catch(() => {
              this.editing = false
            })
        }
      })
    },

    // 点击修改资源类型（虚拟资源）
    virtualEditHandle() {
      // 表单验证重置
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      this.getResourceTypeTree()
      if (this.infoObj.resources_type_id) {
        this.editForm.typeVal = this.infoObj.resources_type_id
        this.editForm.rtype = this.infoObj.resources_type_id_arr
      }
      this.showVirtualDialog = true
    },

    // 虚拟资源类型编辑提交
    virtualEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editing = true
          let data = {
            id: this.infoObj.id
          }
          if (this.rtype == 'select') {
            data.resources_type_id = this.editForm.typeVal
          } else {
            data.resources_type_id = this.editForm.rtype[
              this.editForm.rtype.length - 1
            ]
          }
          this.$axios
            .post(this.urlObj.editvirtualtype, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: '资源类型修改成功！'
                })
                this.showVirtualDialog = false
                // 重新获取一次详情数据
                this.getParkDetail(this.currentData)
              } else {
                let msg = res.Message ? res.Message : '资源类型修改失败！'
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.editing = false
            })
            .catch(() => {
              this.editing = false
            })
        }
      })
    },

    // 业主选择更改处理
    ownerChange(value) {
      if (value) {
        let obj = this.userOptions.find(item => item.id == value)
        this.ownerTel = obj.tel
      } else {
        this.ownerTel = ''
      }
    },

    // 删除月租车
    delMonthCar() {
      this.$confirm('确定要删除当前月租车吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.infoObj.id
        }
        this.$axios
          .post(this.urlObj.delmonthcar, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '月租车删除成功！'
              })
              this.$emit('delSuccess')
            } else {
              let msg = res.Message ? res.Message : '月租车删除失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },

    // 删除非机动车
    delNonMotor() {
      this.$confirm('确定要删除当前非机动车吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.infoObj.id
        }
        this.$axios
          .post(this.urlObj.delcarnomotor, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '非机动车删除成功！'
              })
              this.$emit('delSuccess')
            } else {
              let msg = res.Message ? res.Message : '非机动车删除失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },
    //删除固定车
    deleteCar() {
      this.$confirm('确定要删除当前固定车吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: this.infoObj.id
        }
        this.$axios
          .post(this.urlObj.delfixcarUrl, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '固定车删除成功！'
              })
              this.$emit('delSuccess')
            } else {
              let msg = res.Message ? res.Message : '固定车删除失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败！'
            })
          })
      })
    },

    // 点击停用记录按钮处理
    stopRecord() {
      this.srTableData = []
      this.showStopRecord = true
      this.stopTableLoad()
    },

    // 获取停用记录数据
    stopTableLoad() {
      // 表格处于加载状态
      this.srconf.loadStatus = true
      let data = {
        id: this.currentData.id
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.carmonthstoplog, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.srTableData = res.Data
            // 关闭加载状态
            this.srconf.loadStatus = false
            // 清空空数据提示
            this.srconf.emptyText = ''
          } else if (res.Code === 204) {
            // 登录信息过期
            this.$message({
              message: res.Message,
              type: 'error'
            })
            // 跳转至登录
            this.$router.push({
              path: this.$common.state.loginPath
            })
          } else {
            this.srTableData = []
            this.srconf.emptyText = res.Message
            this.srconf.dataTotal = 0
            this.srconf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.srTableData = []
          this.srconf.emptyText = '服务器连接失败...'
          this.srconf.dataTotal = 0
          this.srconf.loadStatus = false
        })
    }
  }
}
</script>

<style lang="less">
#stall-detail {
  height: 100%;
  position: relative;
  background-color: #fff;
  .el-scrollbar__wrap {
    border-radius: 0 !important;
  }
  .info-content {
    background-color: #f2f2f2;
    .top-wp {
      padding: 30px 30px 15px;
      border-radius: 6px;
      background-color: #fff;
      .title {
        font-size: 16px;
        line-height: 30px;
        font-weight: 700;
        margin-bottom: 15px;
        > i {
          display: inline-block;
          color: #3ebb75;
          margin-right: 5px;
          font-size: 20px;
          font-weight: normal;
          line-height: 30px;
          vertical-align: middle;
        }
        > span {
          display: inline-block;
          line-height: 30px;
          vertical-align: middle;
        }
      }
      .info-ct {
        background-color: #f7f7f7;
        border-radius: 6px;
        margin-bottom: 20px;
        > .el-scrollbar {
          > .el-scrollbar__wrap {
            > .el-scrollbar__view {
              white-space: nowrap;
            }
          }
        }
      }
      .info-wp {
        padding: 10px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        ul {
          list-style: none;
          padding: 0 15px;
          box-sizing: border-box;
          li {
            padding: 10px 0;
            box-sizing: border-box;
            white-space: nowrap;
            box-sizing: border-box;
            .name {
              font-size: 15px;
              line-height: 22px;
              color: #999;
              margin-right: 10px;
            }
            .value {
              font-size: 15px;
              line-height: 22px;
              color: #333;
            }
          }
        }
      }
      .el-textarea {
        textarea {
          border: none;
          background-color: #f7f7f7;
          border-radius: 6px;
        }
      }
      .btn-wp {
        margin-top: 20px;
        .el-button {
          margin-bottom: 15px;
          margin-right: 20px !important;
        }
        .el-button + .el-button {
          margin-left: 0 !important;
        }
      }
    }
    .bottom-wp {
      margin-top: 20px;
      background-color: #fff;
      border-radius: 6px 6px 0 0;
      .table-wp {
        background-color: #fff;
        border-radius: 6px;
        box-sizing: border-box;
        min-height: 185px;
        .table-content {
          #CusTable {
            .el-table {
              height: auto !important;
              .el-table__body-wrapper {
                height: auto !important;
              }
            }
          }
        }
        .title {
          box-sizing: border-box;
          color: #333;
          font-size: 16px;
          font-weight: 700;
          line-height: 30px;
          padding: 10px 30px;
        }
        .el-table th {
          background-color: #f7f7f7;
        }
        .el-table .cell {
          text-align: center;
        }
      }
      .btn-content {
        width: 100%;
        padding: 28px 30px 30px;
        border-radius: 0 0 6px 6px;
        text-align: center;
        box-sizing: border-box;
        background-color: #fff;
      }
    }
    .btn-content {
      width: 100%;
      padding: 50px 30px 30px;
      border-radius: 0 0 6px 6px;
      text-align: center;
      box-sizing: border-box;
      background-color: #fff;
    }
  }

  .stopStall,
  .editDialog,
  .virtualDialog,
  .unbidDialog {
    .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: 0 !important;
      height: 50%;
      .el-dialog__body {
        height: calc(100% - 186px);
        padding: 0 30px;
        box-sizing: border-box;
        .body-content {
          .title {
            font-size: 15px;
            line-height: 24px;
            padding-top: 30px;
            padding-bottom: 15px;
            color: #666;
          }
          .el-date-editor {
            width: 100%;
            border-radius: 8px;
          }
          .el-textarea {
            textarea {
              background-color: #f2f2f2;
              border: none;
              border-radius: 8px;
            }
          }
          .el-select {
            width: 100%;
          }
        }
      }
      .el-dialog__footer {
        padding: 40px 30px;
        .el-button + .el-button {
          margin-left: 50px !important;
        }
      }
    }
  }
  .editDialog {
    .el-dialog {
      height: 45%;
      .el-dialog__body {
        padding: 0;
        height: calc(100% - 190px);
        .el-form {
          display: flex;
          flex-wrap: wrap;
          padding: 15px 15px 0;
          .el-form-item {
            width: 50%;
            padding: 0 15px;
            box-sizing: border-box;
            margin-bottom: 30px !important;
            .el-date-editor,
            .el-select {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .unbidDialog {
    .el-dialog {
      height: 42%;
    }
  }
  .stopRecord {
    .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: 0 !important;
      height: 80%;
      .el-dialog__body {
        height: calc(100% - 83px);
        padding: 0;
        box-sizing: border-box;
        .table-wp {
          height: 100%;
          #CusTable {
            height: 100%;
            .el-table {
              height: 100%;
              .el-table__body-wrapper {
                overflow-y: auto;
                height: calc(100% - 52px);
              }
            }
          }
        }
      }
    }
  }
  .virtualDialog {
    .el-dialog {
      .el-dialog__body {
        .el-cascader {
          width: 100%;
        }
      }
    }
  }
}
#stall-detail.novehicle {
  padding-bottom: 150px;
}
</style>
