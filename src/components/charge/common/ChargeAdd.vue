<template>
  <div id="charge-add" v-loading="isCommit" element-loading-text="费用生成中">
    <div class="left-wp">
      <div class="title">选择科目</div>
      <div class="content">
        <el-scrollbar style="height: 100%;" v-loading="treeLoading">
          <!-- 树形结构部分 -->
          <div class="tree-wrap">
            <el-tree
              ref="subTree"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              node-key="nodeid"
              show-checkbox
              check-strictly
              :default-expand-all="defaultAll"
              :default-checked-keys="checkeds"
              @node-click="nodeClick"
              @check="nodeCheck"
            ></el-tree>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="right-wp" v-loading="isLoading">
      <el-scrollbar
        style="height: 100%"
        v-if="selectedSub && selectedSub.id && selectedSub.is_end == 1"
      >
        <div class="top-wp">
          <div class="title">
            <img
              src="@/assets/setting/image/subname.png"
              alt=""
              style="width: 1rem;height: 1rem;vertical-align:bottom;margin-right: 0.5rem;"
            />
            {{ selectedSub.name }}
          </div>
          <div class="table-wp">
            <cus-table
              :datas="tableData"
              :cusColums="columns"
              :cusConf="conf"
              @openChange="openChange"
            ></cus-table>
          </div>
        </div>
        <div class="bottom-wp">
          <div class="title">
            {{
              selectedSub.subject_type === 'cycle'
                ? '周期性'
                : selectedSub.subject_type === 'temp'
                ? '临时性'
                : selectedSub.subject_type === 'water'
                ? '三表（水）'
                : selectedSub.subject_type === 'ele'
                ? '三表（电）'
                : selectedSub.subject_type === 'gas'
                ? '三表（气）'
                : '其他'
            }}收费
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            :hide-required-asterisk="true"
            ref="ruleForm"
          >
            <el-form-item label="实际计费描述" prop="formula">
              <el-input
                v-model="ruleForm.formula_text"
                readonly
                placeholder="请输入实际计费描述"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="上次度数"
              prop="lastDeg"
              v-if="
                selectedSub.subject_type === 'water' ||
                  selectedSub.subject_type === 'ele' ||
                  selectedSub.subject_type === 'gas'
              "
            >
              <el-input
                v-model="ruleForm.lastDeg"
                readonly
                placeholder="上次度数"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="本次度数"
              prop="degrees"
              v-if="
                selectedSub.subject_type === 'water' ||
                  selectedSub.subject_type === 'ele' ||
                  selectedSub.subject_type === 'gas'
              "
            >
              <el-input
                v-model="ruleForm.degrees"
                placeholder="请输入本次度数"
                type="number"
                @change="degChange"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="开始日期"
              prop="stime"
              v-if="selectedSub.subject_type === 'cycle'"
            >
              <el-date-picker
                v-model="ruleForm.stime"
                type="date"
                :disabled="isStartDisabled"
                placeholder="开始日期"
                :picker-options="spickerOptions"
                value-format="timestamp"
                :default-value="timeMin"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item
              label="开始日期"
              prop="stime"
              v-else-if="
                selectedSub.subject_type === 'cycle' &&
                  selectedSub.is_carmonth != 1
              "
            >
              <el-date-picker
                v-model="ruleForm.stime"
                type="date"
                :disabled="
                  selectedSub.is_choice_before != 1 && edit_starttime != 1
                "
                placeholder="开始日期"
                :picker-options="spickerOptions"
                value-format="timestamp"
                :default-value="timeMin"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item
              v-if="selectedSub.subject_type === 'cycle'"
              label="预缴月份数"
              prop="monthNum"
            >
              <el-input
                v-model="ruleForm.monthNum"
                type="number"
                placeholder="请输入月份数"
                @change="
                  ruleForm.monthNum < 1
                    ? (ruleForm.monthNum = 1)
                    : (ruleForm.monthNum = parseInt(ruleForm.monthNum))
                "
              ></el-input>
            </el-form-item>
            <el-form-item
              label="应收日期"
              prop="ytime"
              value-format="timestamp"
              v-if="
                selectedSub.subject_type != 'cycle' &&
                  selectedSub.subject_type != 'temp'
              "
            >
              <el-date-picker
                v-model="ruleForm.ytime"
                type="datetime"
                placeholder="选择应收日期"
              ></el-date-picker>
            </el-form-item>
            <br />
            <el-form-item
              v-if="subFormula.formula == 3"
              label="费用计算"
              prop="day"
            >
              <el-input
                v-model="ruleForm.day"
                type="number"
                placeholder="请输入时间(天)"
              ></el-input>
              <span class="ico">x</span>
            </el-form-item>
            <el-form-item
              v-if="subFormula.formula == 3 || subFormula.formula == 1"
              :label="subFormula.formula == 1 ? '费用计算' : ' '"
              prop="area"
            >
              <el-input
                v-model="ruleForm.area"
                type="number"
                :disabled="subFormula.is_edit_template == 1 ? false : true"
                :placeholder="
                  selectedSub.subject_type == 'water' ||
                  selectedSub.subject_type == 'ele' ||
                  selectedSub.subject_type == 'gas'
                    ? '请输入度数'
                    : '请输入面积(m²)'
                "
              ></el-input>
              <span class="ico">x</span>
            </el-form-item>
            <el-form-item
              v-if="
                subFormula.formula == 3 ||
                  subFormula.formula == 2 ||
                  subFormula.formula == 1
              "
              :label="subFormula.formula == 2 ? '费用计算' : ' '"
              prop="price"
            >
              <el-input
                v-model="ruleForm.price"
                type="number"
                :disabled="subFormula.is_edit_template == 1 ? false : true"
                placeholder="请输入单价(元)"
              ></el-input>
            </el-form-item>
            <el-form-item class="remark" label="备注说明" prop="remark">
              <el-input
                type="textarea"
                v-model="ruleForm.remark"
                resize="none"
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="btn-wp">
            <el-button type="primary" round @click="verifyExtract(1)">
              生成费用
            </el-button>
            <el-button type="primary empty" round @click="verifyExtract(2)">
              预览明细
            </el-button>
          </div>
        </div>
      </el-scrollbar>
      <div class="tip" v-else>请选择末级科目！</div>
    </div>

    <!-- 预览明细弹框 -->
    <el-dialog
      :visible.sync="showDetailPop"
      title="费用明细预览"
      width="75%"
      :close-on-click-modal="true"
    >
      <el-scrollbar style="height: 100%;">
        <div class="table-wp">
          <cus-table
            :datas="popTableData"
            :cusColums="popColumns"
            :cusConf="popConf"
          ></cus-table>
          <div class="total">
            费用合计：
            <span>{{ totalMoney }}元</span>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
// 添加费用表格列数据
import chargeAddCloumns from '@/assets/charge/json/charge-add-cloumns.json'
// 添加费用弹框表格列数据
import addDialogCloumns from '@/assets/charge/json/add-dialog-cloumns.json'

export default {
  name: 'chargeAdd',
  props: {
    vid: [String, Number],
    currentUser: Object,
    checkeds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 接口对象
      urlObj: {
        treeData: this.$api.state.Charge.getsubject.url,
        subjectlist: this.$api.state.Charge.subjectlist.url,
        createarrears: this.$api.state.Charge.createarrears.url,
        paytimetype: this.$api.state.Charge.paytimetype.url,
        chargepreview: this.$api.state.Charge.chargepreview.url,
        getwegnumber: this.$api.state.Charge.getwegnumber.url,
        getMonthDay: this.$api.state.Charge.getMonthDay.url,
        getformula: this.$api.state.Charge.getformula.url,
        createarrearstemp: this.$api.state.Charge.createarrearstemp.url
      },
      // 是否正在加载数据
      treeLoading: false,
      // 搜索框绑定值
      filterText: '',
      // 是否默认展开所有节点
      defaultAll: true,
      // 树控件绑定值
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      // 当前选择的科目数据
      selectedSub: null,
      // 是否正在加载表格数据
      isLoading: false,
      // 表格数据
      tableData: [],
      // 表格列数据配置
      columns: chargeAddCloumns.list,
      // 表格配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 10,
        dataTotal: 0
      },
      ruleForm: {
        lastDeg: '',
        degrees: '',
        formula_text: '',
        stime: '',
        monthNum: 1,
        ytime: '',
        day: '',
        area: '',
        price: '',
        remark: ''
      },
      rules: {
        lastDeg: [
          { required: false, message: '请输入上次度数', trigger: 'change' }
        ],
        degrees: [
          { required: true, message: '请输入本次度数', trigger: 'blur' }
        ],
        formula_text: [
          {
            required: false,
            message: '请输入实际计费描述',
            trigger: 'change'
          }
        ],
        stime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        monthNum: [
          {
            required: true,
            message: '请输入月份数',
            trigger: 'blur'
          }
        ],
        ytime: [
          {
            required: true,
            message: '请选择应收时间',
            trigger: 'change'
          }
        ],
        day: [
          {
            required: true,
            message: '请输入天数',
            trigger: 'blur'
          }
        ],
        area: [
          {
            required: true,
            message: '请输入面积',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请输入单价',
            trigger: 'blur'
          }
        ]
      },
      // 当前选择的资源类型
      currentType: null,
      // 日期框类型
      timeType: 'date',
      // 开始日期范围配置
      spickerOptions: {},
      // 限制的最小时间
      timeMin: '',
      // 是否禁用开始日期
      isStartDisabled: true,
      // 是否正在生成费用
      isCommit: false,
      // 是否显示明细弹框
      showDetailPop: false,
      // 表格数据
      popTableData: [],
      // 表格列数据配置
      popColumns: addDialogCloumns.list,
      // 表格配置
      popConf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 合计金额
      totalMoney: '0.00',
      // 月租日期类型限制类型
      monthType: '',
      // 当前科目计费公式
      subFormula: {}
    }
  },

  // 属性监听
  watch: {
    filterText(val) {
      this.$refs.subTree.filter(val)
    }
  },

  /**
   * 生命周期
   */
  created() {
    this.getMonthType()
    this.getTreeData()
    // if (this.checkeds.length > 0) {
    //   this.defaultAll = true
    // } else {
    //   this.defaultAll = false
    // }
  },

  /**
   * 方法
   */
  methods: {
    // 获取月租车结束日期类型
    getMonthType() {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getMonthDay, data)
        .then(res => {
          if (res.Code === 200) {
            this.monthType = res.Data ? res.Data.pay_car_by_day : ''
          } else {
            let msg = res.Message ? res.Message : '日期类型获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {})
    },

    // 获取树形结构数据
    getTreeData() {
      this.treeLoading = true
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.treeData, data)
        .then(res => {
          if (res.Code === 200) {
            this.treeData = res.Data
            this.$nextTick(() => {
              if (this.checkeds.length > 0) {
                let cnode = this.$refs.subTree.getNode(this.checkeds[0])
                this.selectedSub = cnode ? cnode.data : null
                this.tableLoad()
                // 获取科目收费公式
                this.getSubjectFormula(this.selectedSub.id)
              }
            })
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.treeLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
          this.treeLoading = false
        })
    },

    // 节点点击事件
    nodeClick(data, node) {
      this.$nextTick(() => {
        if (!data.disabled) {
          if (!this.selectedSub || this.selectedSub.id != data.id) {
            this.$refs.subTree.setCheckedNodes([data])
            this.selectedSub = data
            this.tableLoad()
            // 获取科目收费公式
            this.getSubjectFormula(data.id)
          }
        }
      })
    },

    // 节点复选框点击事件
    nodeCheck(data, node) {
      if (!data.disabled) {
        if (!this.selectedSub || this.selectedSub.id != data.id) {
          this.$refs.subTree.setCheckedNodes([data])
          this.selectedSub = data
          this.tableLoad()
          // 获取科目收费公式
          this.getSubjectFormula(data.id)
        }
      }
    },

    // 获取科目收费公式
    getSubjectFormula(sid) {
      this.$axios
        .post(this.urlObj.getformula, { id: sid })
        .then(res => {
          if (res.Code === 200) {
            this.subFormula = res.Data
            this.ruleForm.formula_text = res.Data.formula_text
          } else {
            let msg = res.Message ? res.Message : '科目收费公式获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {})
    },

    // 日期框初始化
    timeInit() {
      // 周期性科目
      if (this.selectedSub.subject_type == 'cycle') {
        if (this.currentType) {
          let data = {
            id: this.currentType.id,
            type: this.currentType.type,
            subject_id: this.selectedSub.id
          }
          // 获取时间限制条件
          this.$axios
            .post(this.urlObj.paytimetype, data)
            .then(res => {
              if (res.Code === 200) {
                this.ruleForm.stime = res.Data.this_start_time * 1000
                this.timeMin = res.Data.this_start_time * 1000
                // 第一次缴费
                if (res.Data.is_first == 1) {
                  if (
                    this.selectedSub.is_custom_time == 1 &&
                    this.selectedSub.is_choice_before == 1
                  ) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: false
                    }
                  } else if (this.selectedSub.is_custom_time == 1) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: time => {
                        if (time) {
                          return time.getTime() < this.timeMin
                        }
                      }
                    }
                  } else if (this.selectedSub.is_choice_before == 1) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: time => {
                        if (time) {
                          return time.getTime() > this.timeMin
                        }
                      }
                    }
                  } else {
                    this.isStartDisabled = true
                    this.spickerOptions = {
                      disabledDate: true
                    }
                  }
                } else if (res.Data.is_expire == 1) {
                  // 已过期
                  if (
                    this.selectedSub.expire_chose_starttime == 1 &&
                    this.selectedSub.is_choice_before == 1
                  ) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: time => {
                        if (time) {
                          return (
                            time.getTime() >
                              res.Data.this_start_before_time * 1000 &&
                            time.getTime() < this.timeMin
                          )
                        }
                      }
                    }
                  } else if (this.selectedSub.expire_chose_starttime == 1) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: time => {
                        if (time) {
                          return time.getTime() < this.timeMin
                        }
                      }
                    }
                  } else if (this.selectedSub.is_choice_before == 1) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: time => {
                        if (time) {
                          return (
                            time.getTime() >
                              res.Data.this_start_before_time * 1000 &&
                            time.getTime() != this.timeMin
                          )
                        }
                      }
                    }
                  } else {
                    this.isStartDisabled = true
                    this.spickerOptions = {
                      disabledDate: true
                    }
                  }
                } else if (res.Data.is_first == 0 && res.Data.is_expire == 0) {
                  if (this.selectedSub.is_choice_before == 1) {
                    this.isStartDisabled = false
                    this.spickerOptions = {
                      disabledDate: time => {
                        if (time) {
                          return (
                            time.getTime() >
                            res.Data.this_start_before_time * 1000
                          )
                        }
                      }
                    }
                  } else {
                    this.isStartDisabled = true
                    this.spickerOptions = {
                      disabledDate: true
                    }
                  }
                }
              } else {
                let msg = res.Message ? res.Message : '数据获取失败！'
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
        } else {
          this.timeType = 'date'
          this.spickerOptions = {
            disabledDate: () => {
              return false
            }
          }
        }
      } else if (
        this.selectedSub.subject_type == 'water' ||
        this.selectedSub.subject_type == 'ele' ||
        this.selectedSub.subject_type == 'gas'
      ) {
        this.getLastNum()
      }
    },

    // 获取上次度数
    getLastNum() {
      let data = {
        type: this.selectedSub.subject_type,
        id: this.currentType.id
      }
      this.$axios
        .post(this.urlObj.getwegnumber, data)
        .then(res => {
          if (res.Code === 200) {
            this.ruleForm.lastDeg = res.Data ? res.Data.number : ''
          } else {
            let msg = res.Message ? res.Message : '上次度数获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {})
    },

    // 获取表格数据
    tableLoad() {
      this.isLoading = true
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.area = ''

      // 清空当前资源数据
      this.currentType = null
      this.timeType = 'date'

      this.spickerOptions = {
        disabledDate: () => {
          return false
        }
      }
      let data = {
        subject_id: this.selectedSub.id,
        oid: this.currentUser.oid,
        resources_id: this.currentUser.id,
        resources_type: this.currentUser.type
      }
      // 获取表格数据
      this.$axios
        .post(this.urlObj.subjectlist, data)
        .then(res => {
          if (res.Code === 200) {
            // 存放查询数据
            this.tableData = res.Data ? res.Data : []
            // 清空空数据提示
            this.conf.emptyText = ''
            if (res.Data && res.Data.length > 0) {
              let index = res.Data.findIndex(item => item.open == 1)
              if (index != -1) {
                this.currentType = res.Data[index]
                // 表单验证重置
                if (this.$refs.ruleForm) {
                  this.$refs.ruleForm.resetFields()
                }
                // 设置价格
                if (Number(this.currentType.price > 0)) {
                  this.ruleForm.price = Number(this.currentType.price)
                } else {
                  this.ruleForm.price = Number(this.selectedSub.price)
                }

                if (
                  this.selectedSub.subject_type != 'water' &&
                  this.selectedSub.subject_type != 'ele' &&
                  this.selectedSub.subject_type != 'gas'
                ) {
                  this.ruleForm.area =
                    this.currentType && this.currentType.unit
                      ? Number(this.currentType.unit)
                      : ''
                } else {
                  if (this.ruleForm.degrees) {
                    this.ruleForm.area = _.subtract(
                      Number(this.ruleForm.degrees),
                      Number(this.ruleForm.lastDeg)
                    )
                  } else {
                    this.ruleForm.area = ''
                  }
                }
                this.timeInit()
                // if (this.currentType && this.currentType.type == 'carmonth') {
                //   this.ruleForm.stime = this.currentType.start_time * 1000
                //   this.spickerOptions = {
                //     disabledDate: time => {
                //       if (time) {
                //         return (
                //           time.getTime() < this.currentType.start_time * 1000
                //         )
                //       }
                //     }
                //   }
                // } else {
                //   this.timeInit()
                // }
              }
            }
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
            this.tableData = []
            this.conf.emptyText = res.Message
            this.conf.dataTotal = 0
          }
          this.isLoading = false
        })
        .catch(() => {
          // 服务器连接失败
          this.tableData = []
          this.conf.emptyText = '服务器连接失败...'
          this.conf.dataTotal = 0
          this.isLoading = false
        })
    },

    // 水电气本次度数修改
    degChange() {
      if (this.ruleForm.degrees) {
        this.ruleForm.area = _.subtract(
          Number(this.ruleForm.degrees),
          Number(this.ruleForm.lastDeg)
        )
      } else {
        this.ruleForm.area = ''
      }
    },

    // 表格 switch 开关改变
    openChange(obj) {
      this.tableData.forEach(item => {
        item.open = 0
      })
      this.tableData[obj.index][obj.col_name] = obj.value
      this.currentType = obj.value ? this.tableData[obj.index] : null
      // 表单验证重置
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      // 设置价格
      if (Number(this.currentType.price > 0)) {
        this.ruleForm.price = Number(this.currentType.price)
      } else {
        this.ruleForm.price = Number(this.selectedSub.price)
      }
      // if (this.currentType && this.currentType.type == 'carmonth') {
      //   this.ruleForm.stime = this.currentType.start_time * 1000
      //   this.spickerOptions = {
      //     disabledDate: time => {
      //       if (time) {
      //         return time.getTime() < this.currentType.start_time * 1000
      //       }
      //     }
      //   }
      // } else
      if (this.currentType) {
        if (
          this.selectedSub.subject_type != 'water' &&
          this.selectedSub.subject_type != 'ele' &&
          this.selectedSub.subject_type != 'gas'
        ) {
          this.ruleForm.area =
            this.currentType && this.currentType.unit
              ? Number(this.currentType.unit)
              : ''
        } else {
          if (this.ruleForm.degrees) {
            this.ruleForm.area = _.subtract(
              Number(this.ruleForm.degrees),
              Number(this.ruleForm.lastDeg)
            )
          } else {
            this.ruleForm.area = ''
          }
        }
        this.timeInit()
      }
    },

    // 点击生成欠费按钮处理
    verifyExtract(type) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.currentType) {
            this.$message({
              type: 'warning',
              message: '请选择资源类型！'
            })
          } else {
            let arr = []
            if (this.subFormula.formula == 3) {
              if (this.ruleForm.day <= 0) {
                arr.push('天数')
              }
              if (this.ruleForm.area <= 0) {
                arr.push('面积')
              }
              if (this.ruleForm.price <= 0) {
                arr.push('单价')
              }
            } else if (this.subFormula.formula == 2) {
              if (this.ruleForm.price <= 0) {
                arr.push('单价')
              }
            } else if (this.subFormula.formula == 1) {
              if (this.ruleForm.area <= 0) {
                arr.push('面积')
              }
              if (this.ruleForm.price <= 0) {
                arr.push('单价')
              }
            }
            if (arr.length > 0) {
              this.$message({
                type: 'warning',
                message: `${arr.join('、')}不能小于等于0！`
              })
            } else {
              let data = {
                oid: this.currentUser.oid,
                subject_village_id: this.selectedSub.id,
                resources_id: this.currentType ? this.currentType.id : '',
                resources_type: this.currentType ? this.currentType.type : '',
                remarks: this.ruleForm.remark
              }

              if (this.selectedSub.subject_type == 'temp') {
                data.receivable_time = Date.parse(new Date()) / 1000
              } else if (this.selectedSub.subject_type == 'cycle') {
                // if (
                //   this.selectedSub.is_carmonth == 1 &&
                //   this.currentType.type === 'carmonth'
                // ) {
                //   data.start_time = this.ruleForm.stime / 1000
                //   data.unit = this.ruleForm.monthNum
                // } else {
                //   data.start_time = this.ruleForm.stime / 1000
                //   data.month_num = this.ruleForm.monthNum
                // }
                data.start_time = this.ruleForm.stime / 1000
                data.month_num = this.ruleForm.monthNum
              } else {
                data.this_number = this.ruleForm.degrees
                data.receivable_time = this.ruleForm.ytime / 1000
              }

              if (this.subFormula.formula == 3) {
                data.day_num = this.ruleForm.day
                if (this.subFormula.is_edit_template == 1) {
                  data.unit = this.ruleForm.area
                  data.price = this.ruleForm.price
                }
              } else if (
                this.subFormula.formula == 2 &&
                this.subFormula.is_edit_template == 1
              ) {
                data.price = this.ruleForm.price
              } else if (
                this.subFormula.formula == 1 &&
                this.subFormula.is_edit_template == 1
              ) {
                data.unit = this.ruleForm.area
                data.price = this.ruleForm.price
              }

              if (type === 1) {
                this.isCommit = true
                this.createRequest(data, this.selectedSub)
              } else {
                this.getDialogTable(data)
              }
            }
          }
        }
      })
    },

    // 生成欠费请求
    createRequest(data, obj) {
      let url = ''
      if (
        obj.subject_type === 'temp' ||
        (obj.subject_type === 'cycle' &&
          (this.currentType.type == 'carmonth' ||
            this.currentType.type == 'car_nonmotor'))
      ) {
        delete data.receivable_time
        url = this.urlObj.createarrearstemp
      } else {
        url = this.urlObj.createarrears
      }
      this.$axios.post(url, data).then(res => {
        if (res.Code === 200) {
          // 临时性收费保存到本地
          if (
            obj.subject_type === 'temp' ||
            (obj.subject_type === 'cycle' &&
              (this.currentType.type == 'carmonth' ||
                this.currentType.type == 'car_nonmotor'))
          ) {
            if (
              obj.subject_type === 'cycle' &&
              (data.resources_type === 'carmonth' ||
                data.resources_type === 'car_nonmotor')
            ) {
              let arr1 = []
              let arr2 = []
              if (sessionStorage.getItem('tempArr')) {
                arr1 = JSON.parse(sessionStorage.getItem('tempArr'))
              }
              arr1 = res.Data.data.concat(arr1)
              sessionStorage.setItem('tempArr', JSON.stringify(arr1))
              if (sessionStorage.getItem('preArr')) {
                arr2 = JSON.parse(sessionStorage.getItem('preArr'))
              }
              arr2 = [res.Data.pre_data].concat(arr2)
              sessionStorage.setItem('preArr', JSON.stringify(arr2))
            } else {
              let arr = []
              if (sessionStorage.getItem('tempArr')) {
                arr = JSON.parse(sessionStorage.getItem('tempArr'))
              }
              arr = res.Data.concat(arr)
              sessionStorage.setItem('tempArr', JSON.stringify(arr))
            }
          }
          this.$message({
            type: 'success',
            message: '生成费用成功！'
          })
          // 重新获取一次数据
          this.tableLoad()
        } else {
          let msg = res.Message ? res.Message : '生成费用失败！'
          this.$message({
            type: 'error',
            message: msg
          })
        }
        this.isCommit = false
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: '生成费用失败！'
        })
        this.isCommit = false
      })
    },

    // 获取弹框表格数据
    getDialogTable(data) {
      this.showDetailPop = true
      // 表格处于加载状态
      this.popConf.loadStatus = true
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.chargepreview, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              let total = 0
              res.Data.forEach(item => {
                total = total + item.money
              })
              this.totalMoney = _.round(total, 2)
            }
            // 存放查询数据
            this.popTableData = res.Data
            // 关闭加载状态
            this.popConf.loadStatus = false
            // 清空空数据提示
            this.popConf.emptyText = ''
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
            this.popTableData = []
            this.popConf.emptyText = res.Message
            this.popConf.dataTotal = 0
            this.popConf.loadStatus = false
          }
        })
        .catch(() => {
          // 服务器连接失败
          this.popTableData = []
          this.popConf.emptyText = '服务器连接失败...'
          this.popConf.dataTotal = 0
          this.popConf.loadStatus = false
        })
    }
  }
}
</script>
<style lang="less">
#charge-add {
  font-family: Source Han Sans CN;
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  .left-wp {
    width: 25% !important;
    background-color: #fff;
    .title {
      padding: 15px 20px;
      font-size: 16px;
      color: #333;
      font-weight: 700;
      border-bottom: 1px solid #ebebeb;
    }
    .content {
      height: calc(100% - 52px);
      .tree-wrap {
        padding: 15px 0;
        box-sizing: border-box;
        .el-tree {
          background-color: transparent;
          .el-tree-node {
            .el-tree-node__content {
              position: relative;
              height: 46px;
              .el-tree-node__loading-icon.el-icon-loading {
                display: none;
              }
              .el-checkbox {
                position: absolute;
                top: 12px;
                right: 16px;
                margin-right: 0;
                .el-checkbox__input {
                  .el-checkbox__inner {
                    background-color: transparent;
                    border: none;
                  }
                  .el-checkbox__inner::after {
                    top: 0 !important;
                    left: 4px !important;
                  }
                }
              }
              .el-checkbox.is-disabled {
                display: none;
              }
              .el-checkbox.is-checked {
                .el-checkbox__input {
                  .el-checkbox__inner {
                    background-color: transparent;
                    border: none;
                  }
                  .el-checkbox__inner:after {
                    border-color: #3ebb75;
                    height: 9px;
                    width: 4px;
                    left: 8px;
                    top: 4px;
                    transition: none;
                  }
                }
              }
              .el-checkbox.is-disabled.is-checked {
                display: inline-block;
              }
              .el-tree-node__expand-icon {
                position: absolute;
                top: 11px;
                right: 12px;
                font-size: 14px;
                z-index: 1000;
              }
              .el-tree-node__expand-icon.is-leaf {
                display: none;
              }
              .custom-tree-node {
                img {
                  width: 15px;
                  height: 15px;
                  vertical-align: middle;
                  margin-right: 5px;
                }
                .iconfont {
                  font-size: 15px;
                  color: #3ebb75;
                  vertical-align: middle;
                  margin-right: 5px;
                }
                .label {
                  margin-right: 10px;
                  font-size: 14px;
                  vertical-align: middle;
                }
              }
            }
            .el-tree-node__content::before {
              content: '';
              margin: 0 5px 0 20px;
            }
            .el-tree-node__content:hover {
              color: #3ebb75;
              background-color: #e1f8df;
            }
          }
          .el-tree-node.is-checked {
            > .el-tree-node__content {
              background-color: #e1f8df !important;
              color: #3ebb75;
              .el-tree-node__expand-icon {
                display: none;
              }
            }
          }
          .el-tree-node:focus > .el-tree-node__content {
            background-color: #fff;
          }
        }
      }
    }
  }
  .right-wp {
    width: 68.5% !important;
    > .tip {
      width: 100%;
      height: calc(100% - 30px);
      background-color: #fff;
      color: #ccc;
      padding-top: 30px;
      text-align: center;
      font-size: 14px;
    }
    > .el-scrollbar {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
    }
    .top-wp {
      flex: 1;
      background-color: #fff;
      min-height: 200px;
      border-bottom: 15px solid #f2f2f2;
      .title {
        padding: 15px 20px;
        font-size: 16px;
        color: #333;
        font-weight: 700;
        i {
          font-weight: 20px;
          color: #3ebb75;
          margin-right: 6px;
        }
      }
      .table-wp {
        height: calc(100% - 61px);
        .el-table th {
          background-color: #f7f7f7;
        }
      }
    }
    .bottom-wp {
      background-color: #fff;
      .title {
        margin-top: 15px;
        padding: 0 20px;
        font-size: 16px;
        color: #333;
        font-weight: 700;
      }
      .el-form {
        padding: 0 5px;
        .el-form-item {
          display: inline-block;
          width: 33.3%;
          padding: 10px 15px;
          box-sizing: border-box;
          margin-bottom: 0 !important;
          position: relative;
          .el-date-editor {
            width: 100%;
          }
          .balance {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 12px;
            color: #999;
          }
          .ico {
            position: absolute;
            bottom: 0;
            right: -18px;
            color: #666;
          }
        }
        .el-form-item.remark {
          display: block;
          width: 100%;
          .el-textarea {
            width: 100%;
            textarea {
              border: none;
              background-color: #f2f2f2;
            }
          }
        }
      }
      .btn-wp {
        padding: 30px;
        text-align: center;
        .el-button {
          width: 130px;
        }
        .el-button + .el-button {
          margin-left: 80px !important;
        }
      }
    }
  }

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    height: 85%;
    .el-dialog__body {
      height: calc(100% - 68px) !important;
      padding: 0 !important;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 10px;
      .table-wp {
        width: 100%;
        position: relative;
        .total {
          padding: 20px 30px;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          color: #333;
          span {
            color: #333;
            font-size: 16px;
            font-weight: 700;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
