<template>
  <div id="preselect">
    <el-scrollbar style="height: calc(100% - 5rem);">
      <div class="main-wp">
        <h3>{{ title }}</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="项目选择" prop="village">
            <el-select
              class="village"
              v-model="ruleForm.village"
              multiple
              collapse-tags
              popper-class="customSelect"
              placeholder="默认全部"
              :popper-append-to-body="true"
            ></el-select>
          </el-form-item>
          <el-form-item v-if="showBuild" label="楼栋选择" prop="build">
            <el-select
              v-model="ruleForm.build"
              clearable
              multiple
              collapse-tags
              placeholder="默认全部"
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
          <el-form-item v-if="showUnit" label="单元选择" prop="unit">
            <el-select
              v-model="ruleForm.unit"
              clearable
              multiple
              collapse-tags
              placeholder="默认全部"
              @change="unitChange"
            >
              <el-option
                v-for="itm in unitOptions"
                :key="itm.id"
                :label="itm.block + ' / ' + itm.unit"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="showRoom" label="房号选择" prop="room">
            <el-select
              v-model="ruleForm.room"
              clearable
              collapse-tags
              multiple
              placeholder="默认全部"
            >
              <el-option
                v-for="itm in roomOptions"
                :key="itm.id"
                :label="itm.roomnum"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="tree-wp"
            v-if="showSubject"
            label="科目选择"
            prop="subject"
          >
            <tree-select
              ref="treeSelect"
              :data="subTreeOptions"
              :defaultProps="{ label: 'name', value: 'id' }"
              multiple
              nodeKey="id"
              @popoverHide="popoverHide"
            ></tree-select>
          </el-form-item>
          <el-form-item
            class="tree-wp"
            v-if="preType === 'advancecollectstatistics'"
            label="预收科目"
            prop="subject"
          >
            <el-select
              v-model="ruleForm.subject"
              clearable
              multiple
              collapse-tags
              placeholder="默认全部"
            >
              <el-option
                v-for="itm in subjectOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="showPayment" label="收费方式" prop="payment">
            <el-select
              v-model="ruleForm.payment"
              clearable
              multiple
              collapse-tags
              placeholder="默认全部"
            >
              <el-option
                v-for="itm in paymentOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="showInvoice" label="开具发票" prop="invoice">
            <el-select
              v-model="ruleForm.invoice"
              multiple
              collapse-tags
              clearable
              placeholder="默认全部"
            >
              <el-option
                v-for="itm in invoiceOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="preType === 'combinationstatistics' || preType === 'housekeepercostcountstatistics'"
            label="交房状态"
            prop="check"
          >
            <el-select
              v-model="ruleForm.check"
              clearable
              placeholder="请选择交房状态"
            >
              <el-option :key="1" label="未交房" :value="1"></el-option>
              <el-option :key="2" label="已交房" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="preType === 'combinationstatistics' || preType === 'housekeepercostcountstatistics'"
            label="选择模式"
            prop="pattern"
          >
            <el-select v-model="ruleForm.pattern" placeholder="请选择模式">
              <el-option :key="1" label="应收模式" :value="1"></el-option>
              <el-option :key="2" label="欠费模式" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              preType === 'arrearsanalysisstatistics' ||
                preType === 'arrearsrecoverstatistics' ||
                preType === 'arrearsdurationstatistics'
            "
            label="分析年份数量"
            prop="yearNum"
          >
            <el-input
              v-model="ruleForm.yearNum"
              type="number"
              placeholder="请输入分析年份数量"
            ></el-input>
          </el-form-item>

          <div v-if="showDate" style="width: 100%;display: flex;">
            <!-- 时间范围选择部分 -->
            <el-form-item :label="timeTitle + '开始时间'" prop="stime">
              <el-date-picker
                v-model="ruleForm.stime"
                :type="timeType"
                align="center"
                :picker-options="spickerOptions"
                :value-format="valueFormat"
                placeholder="请选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <span
              style="color: #999;position:relative;width:0;height:0;bottom:-2.5rem;left:-0.3rem;"
            >
              ~
            </span>
            <el-form-item :label="timeTitle + '结束时间'" prop="etime">
              <el-date-picker
                v-model="ruleForm.etime"
                :type="timeType"
                align="center"
                :picker-options="epickerOptions"
                :value-format="valueFormat"
                placeholder="请选择结束时间"
              ></el-date-picker>
            </el-form-item>
          </div>

          <!-- 时间范围选择部分 -->
          <div
            v-if="
              preType === 'combinationstatistics' ||
              preType === 'arrearsrecoverstatistics' ||
              preType === 'housekeepercostcountstatistics'
            "
            style="width: 100%;display: flex;"
          >
            <el-form-item
              :label="
                preType === 'combinationstatistics' || preType === 'arrearsrecoverstatistics' || preType === 'housekeepercostcountstatistics'
                  ? '实收开始时间'
                  : '收款开始时间'
              "
              prop="sstime"
            >
              <el-date-picker
                v-model="ruleForm.sstime"
                :type="
                  preType === 'arrearsrecoverstatistics' ? 'date' : 'datetime'
                "
                align="center"
                :picker-options="sspickerOptions"
                value-format="timestamp"
                placeholder="请选择开始时间"
              ></el-date-picker>
            </el-form-item>
            <span
              style="color: #999;position:relative;width:0;height:0;bottom:-2.5rem;left:-0.3rem;"
            >
              ~
            </span>
            <el-form-item
              :label="
                preType === 'combinationstatistics' || preType === 'arrearsrecoverstatistics' || preType === 'housekeepercostcountstatistics'
                  ? '实收结束时间'
                  : '收款结束时间'
              "
              prop="setime"
            >
              <el-date-picker
                v-model="ruleForm.setime"
                :type="
                  preType === 'arrearsrecoverstatistics' ? 'date' : 'datetime'
                "
                align="center"
                :picker-options="sepickerOptions"
                value-format="timestamp"
                placeholder="请选择结束时间"
              ></el-date-picker>
            </el-form-item>
          </div>

          <!-- 预算统计年限 -->
          <el-form-item
            v-if="preType === 'budgetstatistics'"
            label="年限范围"
            prop="year"
          >
            <el-date-picker
              v-model="ruleForm.year"
              type="year"
              placeholder="选择年限"
              value-format="yyyy"
            ></el-date-picker>
          </el-form-item>

          <!-- 截止日期选择 -->
          <el-form-item v-if="showEndtime" :label="etimeTitle" prop="endTime">
            <el-date-picker
              v-model="ruleForm.endTime"
              :type="etimeType"
              placeholder="选择截止日期"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    <div class="btn-wp">
      <el-button type="primary" round @click="queryStart">
        开始查询
      </el-button>
      <el-button type="primary" class="empty" round @click="resetForm">
        重置条件
      </el-button>
    </div>
  </div>
</template>
<script>
// 导入树形选择组件
import TreeSelect from './TreeSelect.vue'
export default {
  name: 'preselect',
  components: {
    TreeSelect
  },
  props: {
    preType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 接口数据对象
      urlObj: {
        treeData: this.$api.state.Means.treeData.url,
        subTreeData: this.$api.state.Setting.treeData.url,
        paymentList: this.$api.state.Setting.paymentList.url,
        allsubject: this.$api.state.Public.allsubject.url,
        buildOfVillage: this.$api.state.Public.buildOfVillage.url,
        unitOfBuild: this.$api.state.Public.unitOfBuild.url,
        searchUnit: this.$api.state.Public.searchUnit.url,
        roomOfUnit: this.$api.state.Public.roomOfUnit.url,
        getadvancesub: this.$api.state.Report.getadvancesub.url,
        depositsubject: this.$api.state.Report.depositsubject.url
      },
      // 是否显示树状选择器
      isShowSelect: false,
      // 表单数据对象
      ruleForm: {
        village: [],
        build: [],
        unit: [],
        room: [],
        subject: [],
        payment: [],
        invoice: [],
        stime: '',
        etime: '',
        sstime: '',
        setime: '',
        year: '',
        endTime: '',
        pattern: 1,
        check: '',
        yearNum: ''
      },
      // 表单验证规则
      rules: {
        village: [
          { required: false, message: '请选择项目', trigger: 'change' }
        ],
        build: [{ required: false, message: '请选择楼栋', trigger: 'change' }],
        unit: [{ required: false, message: '请选择单元', trigger: 'change' }],
        room: [{ required: false, message: '请选择房号', trigger: 'change' }],
        subject: [{ required: false, message: '请选择科目', trigger: 'blur' }],
        payment: [
          { required: false, message: '请选择收费方式', trigger: 'change' }
        ],
        invoice: [
          { required: false, message: '请选择是否开具发票', trigger: 'change' }
        ],
        stime: [
          { required: false, message: '请选择开始时间', trigger: 'change' }
        ],
        etime: [
          { required: false, message: '请选择结束时间', trigger: 'change' }
        ],
        sstime: [
          { required: false, message: '请选择实收开始时间', trigger: 'change' }
        ],
        setime: [
          { required: false, message: '请选择实收结束时间', trigger: 'change' }
        ],
        year: [{ required: true, message: '请选择年限', trigger: 'change' }],
        endTime: [
          { required: false, message: '请选择截止日期', trigger: 'change' }
        ],
        pattern: [{ required: true, message: '请选择模式', trigger: 'change' }],
        check: [
          { required: false, message: '请选择交房状态', trigger: 'change' }
        ],
        yearNum: [
          { required: true, message: '请输入分析年份数量', trigger: 'blur' }
        ]
      },
      // 当前模块名称
      title: '',
      // 时间选择框标题
      timeTitle: '',
      // 时间选择框的类型
      timeType: '',
      // 时间选择框的数据格式
      valueFormat: 'timestamp',
      // 截止时间框标题
      etimeTitle: '',
      // 截止时间框的类型
      etimeType: '',
      // 当前选择的项目数据
      villageSelected: [],
      // 楼栋列表
      buildOptions: [],
      // 单元列表
      unitOptions: [],
      // 房间列表
      roomOptions: [],
      // 科目列表
      subTreeOptions: [],
      subjectOptions: [],
      // 科目名称列表
      subNames: [],
      // 收款方式列表
      paymentOptions: [],
      // 开具发票列表
      invoiceOptions: [
        {
          value: 1,
          label: '发票'
        },
        {
          value: 2,
          label: '收据'
        }
      ],
      // 是否显示楼栋
      showBuild: true,
      // 是否显示单元
      showUnit: true,
      // 是否显示房间
      showRoom: true,
      // 是否显示科目
      showSubject: true,
      // 是否显示收费方式
      showPayment: true,
      // 是否显示开具发票
      showInvoice: true,
      // 是否显示时间范围选择框
      showDate: true,
      // 是否显示实收截止时间
      showEndtime: true
    }
  },

  computed: {
    vid() {
      return this.$store.state.vid
    },

    // 开始时间限制
    spickerOptions() {
      return {
        disabledDate: time => {
          if (time) {
            let etime = this.ruleForm.etime
            if (this.preType === 'sharestatistics') {
              etime = etime ? new Date(etime).getTime() : ''
            }
            return etime ? time.getTime() > etime : false
          }
        }
      }
    },

    // 结束时间限制
    epickerOptions() {
      return {
        disabledDate: time => {
          if (time) {
            let stime = this.ruleForm.stime
            if (this.preType === 'sharestatistics') {
              stime = stime ? new Date(stime).getTime() : ''
            }
            return stime ? time.getTime() < stime : false
          }
        }
      }
    },

    // 实收开始时间限制（组合报表）
    sspickerOptions() {
      return {
        disabledDate: time => {
          if (time) {
            return this.ruleForm.setime
              ? time.getTime() > this.ruleForm.setime
              : false
          }
        }
      }
    },

    // 实收结束时间限制（组合报表）
    sepickerOptions() {
      return {
        disabledDate: time => {
          if (time) {
            return this.ruleForm.sstime
              ? time.getTime() < this.ruleForm.sstime
              : false
          }
        }
      }
    }
  },

  watch: {
    isShowSelect() {
      // 隐藏select自带的下拉框
      this.$refs.select.blur()
    }
  },

  /**
   * 生命周期
   */
  created() {
    this.init()
  },

  /**
   * 方法
   */
  methods: {
    // 日期格式化
    dateFormat(time, type) {
      if (time) {
        time = new Date(Number(time) * 1000)
        let y = time.getFullYear()
        let m =
          time.getMonth() + 1 < 10
            ? '0' + (time.getMonth() + 1)
            : time.getMonth() + 1
        let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
        let hh = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
        let mm =
          time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
        let ss =
          time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
        if (type == 'datetime') {
          return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        } else if (type == 'month') {
          return y + '-' + m
        } else {
          return y + '-' + m + '-' + d
        }
      } else {
        return ''
      }
    },

    popoverHide(checkedIds, checkedData, selectTexts) {
      this.subNames = selectTexts
      let arr = []
      checkedData.forEach(item => {
        if (item.is_end === 1) {
          arr.push(item.id)
        }
      })
      this.ruleForm.subject = arr
      if (
        this.preType === 'financemonthstatistics' ||
        this.preType === 'sharestatistics'
      ) {
        this.$refs.ruleForm.validateField('subject')
      }
    },

    // 组件初始化
    init() {
      switch (this.preType) {
        case 'reportstatistics':
          this.title = '实收统计报表'
          this.timeTitle = '实收'
          this.timeType = 'datetime'
          this.showEndtime = false
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'receivablestatistics':
          this.title = '应收统计报表'
          this.timeTitle = '应收'
          this.timeType = 'month'
          this.showPayment = false
          this.showInvoice = false
          this.showEndtime = false
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'arrearsstatistics':
          this.title = '欠费统计报表'
          this.timeTitle = '应收'
          this.timeType = 'month'
          this.etimeTitle = '实收截止时间'
          this.etimeType = 'datetime'
          this.showPayment = false
          this.showInvoice = false
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'advancecollectstatistics':
          this.title = '资源预收统计报表'
          this.showSubject = false
          this.timeTitle = '预收'
          this.timeType = 'date'
          this.etimeTitle = '预收截止时间'
          this.etimeType = 'date'
          this.showInvoice = false
          // 获取项目数据
          this.getVillageData()
          // 获取预收科目数据
          this.getPreSubject()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'refundstatistics':
          this.title = '退款统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showPayment = false
          this.showInvoice = false
          this.showEndtime = false
          this.timeTitle = '退款'
          this.timeType = 'date'
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'ownerHouse':
          this.title = '业主及房产统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showSubject = false
          this.showPayment = false
          this.showInvoice = false
          this.showDate = false
          this.showEndtime = false
          this.rules.village = [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
          // 获取项目数据
          this.getVillageData()
          break
        case 'resources':
          this.title = '资源明细报表'
          break
        case 'financemonthstatistics':
          this.title = '财务月报表报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showEndtime = false
          this.showInvoice = false
          this.timeTitle = ''
          this.timeType = 'month'
          this.rules.village = [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
          this.rules.subject = [
            { required: true, message: '请选择科目', trigger: 'blur' }
          ]
          this.rules.stime = [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ]
          this.rules.etime = [
            { required: true, message: '请选择结束时间', trigger: 'blur' }
          ]
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'cashaccountstatistics':
          this.title = '现金台账报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showEndtime = false
          this.showInvoice = false
          this.showSubject = false
          this.showPayment = false
          this.timeTitle = '实收'
          this.timeType = 'datetime'
          this.rules.village = [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
          // 获取项目数据
          this.getVillageData()
          break
        case 'combinationstatistics':
          this.title = '组合报表报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.timeTitle = '应收'
          this.timeType = 'month'
          this.showEndtime = false
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'wegcoststatistics':
          this.title = '三表抄表统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.showEndtime = false
          this.timeTitle = '应收'
          this.timeType = 'datetime'
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'budgetstatistics':
          this.title = '预算统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.showSubject = false
          this.showDate = false
          this.etimeTitle = '实收截止时间'
          this.etimeType = 'datetime'
          // 获取项目数据
          this.getVillageData()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'sharestatistics':
          this.title = '分摊统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.showEndtime = false
          this.timeTitle = '月份'
          this.timeType = 'month'
          this.valueFormat = 'yyyy-MM'
          this.rules.village = [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
          this.rules.subject = [
            { required: true, message: '请选择科目', trigger: 'blur' }
          ]
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'carrecordstatistics':
          this.title = '停车场收费统计表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showSubject = false
          this.showInvoice = false
          this.showEndtime = false
          this.timeTitle = '缴费'
          this.timeType = 'datetime'
          // 获取项目数据
          this.getVillageData()
          // 获取收费方式
          this.getPaymentData()
          break
        case 'taxescomputestatistics':
          this.title = '当期纳税计算表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.showEndtime = false
          this.timeTitle = '归属月'
          this.timeType = 'month'
          this.rules.subject = [
            { required: true, message: '请选择科目', trigger: 'blur' }
          ]
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'depositstatistics':
          this.title = '押金统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.showEndtime = false
          this.timeTitle = '缴费'
          this.timeType = 'date'
          this.rules.subject = [
            { required: true, message: '请选择科目', trigger: 'blur' }
          ]
          // 获取项目数据
          this.getVillageData()
          // 获取押金科目数据
          this.getDepositSubject()
          break
        case 'advancedepositstatistics':
          this.title = '预存款统计报表'
          this.showBuild = false
          this.showUnit = false
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.showEndtime = false
          this.showSubject = false
          this.timeTitle = '缴费'
          this.timeType = 'date'
          // 获取项目数据
          this.getVillageData()
          break
        case 'arrearsanalysisstatistics':
          this.title = '欠费原因分析表'
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.timeTitle = '应收'
          this.timeType = 'month'
          this.etimeTitle = '截止时间'
          this.etimeType = 'date'
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'arrearsrecoverstatistics':
          this.title = '收回情况统计表'
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.timeTitle = '应收'
          this.timeType = 'month'
          this.etimeTitle = '截止时间'
          this.etimeType = 'date'
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break
        case 'arrearsdurationstatistics':
          this.title = '欠费时长分析表'
          this.showRoom = false
          this.showInvoice = false
          this.showPayment = false
          this.timeTitle = '应收'
          this.timeType = 'date'
          this.etimeTitle = '截止时间'
          this.etimeType = 'date'
          // 获取项目数据
          this.getVillageData()
          // 获取科目数据
          this.getSubjectTreeData()
          break

          case 'roomssubjectinfostatistics':
            this.title = '房源收费一览表'
            this.showRoom = false
            this.showInvoice = false
            this.showPayment = false
            this.showSubject = false
            this.showBuild = false
            this.showEndtime = false
            this.showUnit = false
            this.timeTitle = '收款'
            this.timeType = 'date'
            this.etimeTitle = '截止时间'
            this.etimeType = 'date'
            // 获取项目数据
            this.getVillageData()
            // 获取科目数据
            // this.getSubjectTreeData()
            break

            case 'housekeepercostcountstatistics':
              this.title = '楼栋管家统计表';
              this.showRoom = false;
              this.showInvoice = false;
              this.showBuild = false;
              this.showEndtime = false;
              this.showPayment = false;
              this.showUnit = false;
              this.showCard = false;
              this.timeTitle = '应收';
              this.timeType = 'date';
              this.etimeTitle = '截止时间';
              this.etimeType = 'date';
              this.rules.subject = [
                { required: true, message: '请选择科目', trigger: 'blur' },
              ];
              this.rules.sstime = [
                { required: true, message: '请选择实收开始时间', trigger: 'change' }
              ];
              this.rules.setime = [
                { required: true, message: '请选择实收结束时间', trigger: 'change' }
              ];
              // 获取项目数据
              this.getVillageData();
              // 获取科目数据
              this.getSubjectTreeData();
            break
      }

    },

    // 获取城市-项目数据
    getVillageData() {
      this.$axios
        .post(this.urlObj.treeData)
        .then(res => {
          if (res.Code === 200) {
            let content = ''
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                let village = ''
                if (item.children && item.children.length > 0) {
                  item.children.forEach(itm => {
                    if (itm.id == this.vid) {
                      village =
                        village +
                        `<li id="${itm.id}" pid="${item.id}" class="active">${itm.label}</li>`
                      this.villageSelected = [{ id: itm.id, name: itm.label }]
                      this.ruleForm.village = [itm.label]
                      this.villageChange()
                    } else {
                      village =
                        village +
                        `<li id="${itm.id}" pid="${item.id}">${itm.label}</li>`
                    }
                  })
                }
                let city = ''
                if (
                  item.children.length === 1 &&
                  item.children[0].id == this.vid
                ) {
                  city = `
                  <div class="city">
                    <div class="title">${item.label}</div>
                    <ul>
                      <li id="0" pid="${item.id}" class="active">全选</li>
                      ${village}
                    </ul>
                  </div>
                `
                } else {
                  city = `
                  <div class="city">
                    <div class="title">${item.label}</div>
                    <ul>
                      <li id="0" pid="${item.id}">全选</li>
                      ${village}
                    </ul>
                  </div>
                `
                }
                content = content + city
              })
            }
            // 设置下拉框样式、滚动
            let drop = document.querySelector(
              '.el-select-dropdown.customSelect'
            )
            drop.style.width = '45%'
            drop.style.height = '45%'
            let scro = document.querySelector(
              '.el-select-dropdown.customSelect .el-scrollbar'
            )
            scro.style.display = 'block'
            scro.style.height = '100%'
            let wrap = document.querySelector(
              '.el-select-dropdown.customSelect .el-scrollbar .el-select-dropdown__wrap'
            )
            wrap.style.height = '100%'
            wrap.style.maxHeight = '500px'
            wrap.style.overflowX = 'auto'
            let empty = document.querySelector(
              '.el-select-dropdown.customSelect .el-select-dropdown__empty'
            )
            empty.style.display = 'none'

            // 数据渲染（追加元素）
            let scontent = document.querySelector(
              '.el-select-dropdown.customSelect .el-scrollbar__view'
            )
            if (
              res.Data &&
              res.Data.length === 1 &&
              res.Data[0].children.length === 1 &&
              res.Data[0].children[0].id == this.vid
            ) {
              scontent.innerHTML = `<div class="select-content active">
              <div class="select-all">选择全部</div>
              ${content}</div>`
            } else {
              scontent.innerHTML = `<div class="select-content">
              <div class="select-all">选择全部</div>
              ${content}</div>`
            }

            // 绑定按钮事件
            this.bindIncident()
          } else {
            this.$message({
              type: 'error',
              message: '项目数据获取失败！'
            })
          }
        })
        .catch(() => {})
    },

    // 项目下拉框按钮绑定事件
    bindIncident() {
      this.$nextTick(() => {
        // 全选按钮事件绑定
        let content = document.querySelector('.select-content .select-all')
        content.addEventListener(
          'click',
          () => {
            if (content.classList.contains('active')) {
              content.classList.remove('active')
              lis.forEach(item => {
                item.classList.remove('active')
              })
            } else {
              content.classList.add('active')
              lis.forEach(item => {
                item.classList.add('active')
              })
            }
            this.setVillage()
          },
          false
        )

        // 项目按钮事件绑定
        let lis = document.querySelectorAll('.select-content ul li')
        lis.forEach(item => {
          item.onclick = e => {
            let el = e.target
            let pid = el.getAttribute('pid')
            if (el.getAttribute('id') == '0') {
              let cli = document.querySelectorAll(
                `.select-content ul li[pid='${pid}']`
              )
              if (el.classList.contains('active')) {
                cli.forEach(item => {
                  item.classList.remove('active')
                })
                el.classList.remove('active')
                content.classList.remove('active')
              } else {
                cli.forEach(item => {
                  item.classList.add('active')
                })
                el.classList.add('active')
                let lidoms = document.querySelectorAll('.select-content ul li')
                let flag = true
                for (let i = 0; i < lidoms.length; i++) {
                  if (!lidoms[i].classList.contains('active')) {
                    flag = false
                    break
                  }
                }
                if (flag) {
                  content.classList.add('active')
                }
              }
            } else {
              let all = document.querySelector(
                `.select-content ul li[id='0'][pid='${pid}']`
              )
              if (el.classList.contains('active')) {
                el.classList.remove('active')
                all.classList.remove('active')
                content.classList.remove('active')
              } else {
                el.classList.add('active')
                let alis = document.querySelectorAll(
                  `.select-content ul li[pid='${pid}']`
                )
                let flag = true
                for (let i = 1; i < alis.length; i++) {
                  if (!alis[i].classList.contains('active')) {
                    flag = false
                    break
                  }
                }
                if (flag) {
                  all.classList.add('active')
                }
                let lidoms = document.querySelectorAll('.select-content ul li')
                let flag1 = true
                for (let i = 0; i < lidoms.length; i++) {
                  if (!lidoms[i].classList.contains('active')) {
                    flag1 = false
                    break
                  }
                }
                if (flag1) {
                  content.classList.add('active')
                }
              }
            }
            this.setVillage()
          }
        })
      })
    },

    // 设置项目数据
    setVillage() {
      let lidoms = document.querySelectorAll('.select-content ul li')
      let arr = []
      lidoms.forEach(item => {
        if (
          item.classList.contains('active') &&
          item.getAttribute('id') != '0'
        ) {
          arr.push({
            id: item.getAttribute('id'),
            name: item.innerText
          })
        }
      })
      this.villageSelected = arr
      this.ruleForm.village = arr.map(item => item.name)
      this.villageChange()
    },

    // 获取楼栋数据
    getBuildData() {
      let data = {
        vid: this.villageSelected[0].id
      }
      this.$axios
        .post(this.urlObj.buildOfVillage, data)
        .then(res => {
          if (res.Code === 200) {
            this.buildOptions = res.Data ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '楼栋数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '楼栋数据获取失败！'
          })
        })
    },

    // 获取单元数据
    getUnitData() {
      this.$axios
        .post(this.urlObj.searchUnit, { bids: this.ruleForm.build })
        .then(res => {
          if (res.Code === 200) {
            this.unitOptions = res.Data ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '单元数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '单元数据获取失败！'
          })
        })
    },

    // 获取房间数据
    getRoomData() {
      this.$axios
        .post(this.urlObj.roomOfUnit, { unit_ids: this.ruleForm.unit })
        .then(res => {
          if (res.Code === 200) {
            this.roomOptions = res.Data ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '房号数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '房号数据获取失败！'
          })
        })
    },

    // 获取科目数据(末级)
    getSubjectData() {
      this.$axios
        .post(this.urlObj.allsubject)
        .then(res => {
          if (res.Code === 200) {
            this.subjectOptions = res.Data ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '科目数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '科目数据获取失败！'
          })
        })
    },

    // 获取科目数据（树形）
    getSubjectTreeData() {
      this.$axios
        .post(this.urlObj.subTreeData)
        .then(res => {
          if (res.Code === 200) {
            this.subTreeOptions =
              res.Data && res.Data.length > 0 ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '科目数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '科目数据获取失败！'
          })
        })
    },

    // 获取押金类科目数据
    getDepositSubject() {
      this.$axios
        .post(this.urlObj.depositsubject)
        .then(res => {
          if (res.Code === 200) {
            this.subTreeOptions =
              res.Data && res.Data.length > 0 ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '科目数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '科目数据获取失败！'
          })
        })
    },

    // 获取预收科目
    getPreSubject() {
      this.$axios
        .post(this.urlObj.getadvancesub)
        .then(res => {
          if (res.Code === 200) {
            this.subjectOptions = res.Data ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '科目数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '科目数据获取失败！'
          })
        })
    },

    // 获取收费方式数据
    getPaymentData() {
      this.$axios
        .post(this.urlObj.paymentList)
        .then(res => {
          if (res.Code === 200) {
            this.paymentOptions = res.Data ? res.Data : []
          } else {
            this.$message({
              type: 'error',
              message: '收费方式数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '收费方式数据获取失败！'
          })
        })
    },

    // 项目选择更改处理
    villageChange() {
      this.ruleForm.build = []
      this.ruleForm.unit = []
      this.ruleForm.room = []
      this.buildOptions = []
      this.unitOptions = []
      this.roomOptions = []
      if (this.ruleForm.village.length == 1 && this.showBuild) {
        // 获取楼栋数据
        this.getBuildData()
      }
    },

    // 楼栋选择更改处理
    buildChange() {
      this.ruleForm.unit = []
      this.ruleForm.room = []
      this.unitOptions = []
      this.roomOptions = []
      if (this.ruleForm.build.length > 0) {
        // 获取单元数据
        this.getUnitData()
      }
    },

    // 单元选择更改
    unitChange() {
      this.ruleForm.room = []
      this.roomOptions = []
      if (this.ruleForm.unit) {
        // 获取房屋数据
        this.getRoomData()
      }
    },

    // 重置条件
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.villageSelected = []
      let content = document.querySelector('.select-content .select-all')
      let lidoms = document.querySelectorAll('.select-content ul li')
      content.classList.remove('active')
      lidoms.forEach(item => {
        item.classList.remove('active')
      })
      // 清空科目数据
      this.$refs.treeSelect.clearData()
    },

    // 开始查询
    queryStart() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm))
          data.village = this.villageSelected.map(item => item.id)
          if (this.valueFormat === 'timestamp') {
            data.stime = data.stime ? data.stime / 1000 : ''
            data.etime = data.etime ? data.etime / 1000 : ''
          }
          if (
            this.preType === 'combinationstatistics' ||
            this.preType === 'arrearsrecoverstatistics' ||
            this.preType === 'housekeepercostcountstatistics'
          ) {
            data.sstime = data.sstime ? data.sstime / 1000 : ''
            data.setime = data.setime ? data.setime / 1000 : ''
          }
          data.endTime = data.endTime ? data.endTime / 1000 : ''
          let builds = []
          this.buildOptions.forEach(item => {
            if (data.build.includes(item.id)) {
              builds.push(item.block)
            }
          })
          let units = []
          this.unitOptions.forEach(item => {
            if (data.unit.includes(item.id)) {
              units.push(item.block + ' / ' + item.unit)
            }
          })
          let rooms = []
          this.roomOptions.forEach(item => {
            if (data.room.includes(item.id)) {
              rooms.push(item.roomnum)
            }
          })
          let payments = []
          this.paymentOptions.forEach(item => {
            if (data.payment.includes(item.id)) {
              payments.push(item.name)
            }
          })
          let invoices = []
          this.invoiceOptions.forEach(item => {
            if (data.invoice.includes(item.value)) {
              invoices.push(item.label)
            }
          })
          let subjects = []
          this.subjectOptions.forEach(item => {
            if (data.subject.includes(item.id)) {
              subjects.push(item.name)
            }
          })

          data.filterText = {
            village: this.villageSelected.map(item => item.name),
            build: builds,
            unit: units,
            room: rooms,
            subject:
              this.preType === 'advancecollectstatistics'
                ? subjects
                : this.subNames,
            payment: payments,
            invoice: invoices,
            stime:
              this.preType === 'sharestatistics'
                ? data.stime
                : this.dateFormat(data.stime, this.timeType),
            etime:
              this.preType === 'sharestatistics'
                ? data.etime
                : this.dateFormat(data.etime, this.timeType),
            sstime: this.dateFormat(
              data.sstime,
              this.preType === 'arrearsrecoverstatistics' ? 'date' : 'datetime'
            ),
            setime: this.dateFormat(
              data.setime,
              this.preType === 'arrearsrecoverstatistics' ? 'date' : 'datetime'
            ),
            year: data.year,
            endTime: this.dateFormat(data.endTime, this.etimeType),
            pattern: data.pattern == 1 ? '应收模式' : '欠费模式',
            check: data.check == 1 ? '未交房' : '已交房',
            yearNum: data.yearNum
          }
          this.$emit('verifySuccess', data)
        }
      })
    }
  }
}
</script>

<style lang="less">
.el-select-dropdown {
  .select-content {
    .select-all {
      width: 120px;
      height: 32px;
      line-height: 32px;
      border-radius: 3px;
      background-color: #f0fbef;
      color: rgba(62, 187, 117, 0.8);
      text-align: center;
      cursor: pointer;
      user-select: none;
      font-size: 12px;
      margin: 20px 0 0 20px;
    }
    .select-all.active {
      background-color: #3ebb75;
      color: #fff;
    }
    .city {
      margin-top: 15px;
      .title {
        font-size: 15px;
        color: #333;
        font-weight: 700;
        text-align: left;
        padding: 0 20px;
        margin-bottom: 10px;
      }
      ul {
        list-style: none;
        text-align: left;
        padding: 0 20px;
        display: flex;
        flex-wrap: wrap;
        li {
          display: inline-block;
          width: 120px;
          height: 32px;
          line-height: 32px;
          border-radius: 3px;
          background-color: #f0fbef;
          color: rgba(62, 187, 117, 0.8);
          text-align: center;
          cursor: pointer;
          user-select: none;
          font-size: 12px;
          padding: 0 5px;
          margin: 0 12px 12px 0;
        }
        li.active {
          background-color: #3ebb75;
          color: #fff;
        }
      }
    }
  }
}
#preselect {
  font-family: 'Source Han Sans CN';
  width: 65%;
  min-width: 640px;
  max-width: 1050px;
  height: 80%;
  border: 1px solid #ccc;
  border-radius: 6px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  .main-wp {
    padding: 25px 25px 0;
    h3 {
      font-size: 16px;
      margin-bottom: 20px;
      padding: 0 15px;
    }
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33.33%;
        padding: 0 2%;
        box-sizing: border-box;
        margin-bottom: 25px !important;
        position: relative;
        .el-select {
          width: 100%;
        }
        .el-select.village {
          .el-tag__close {
            display: none;
          }
          .el-select__tags {
            flex-wrap: nowrap;
            overflow: hidden;
          }
        }
        .el-date-editor {
          width: 100%;
          background-color: #f2f2f2;
          border: none;
          border-radius: 5px;
        }
      }
      .el-form-item.tree-wp {
        .el-form-item__content {
          > div {
            > span {
              display: inline-block;
              width: 100%;
              > span {
                display: inline-block;
                width: 100%;
                > .el-select {
                  width: 100% !important;
                }
              }
            }
          }
        }
      }
    }
  }
  .btn-wp {
    text-align: center;
    padding: 0 15px;
    margin-top: 30px;
  }
}
</style>
