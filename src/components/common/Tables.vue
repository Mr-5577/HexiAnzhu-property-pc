<template>
  <div id="tables">
    <div class="filter-wp">
      <div class="filter">
        <div class="text">条件：阳光英伦城邦、科目名称、2021/09/30</div>
        <span>点击展开</span>
      </div>
      <el-button type="primary empty" @click="queryAgain">
        重选查询条件
      </el-button>
      <el-button type="primary empty" @click="queryAgain">
        再次查询
      </el-button>
      <span class="export" @click="exportExcel">
        <workIcon
          name="export"
          class="common-right-icon"
          title="导出"
        ></workIcon>
      </span>
    </div>

    <div class="table-wp">
      <!-- 自定义表格（多级表头） -->
      <el-table
        v-if="tableType === 'financemonthstatistics'"
        class="finance"
        ref="financeTable"
        :data="tableData"
        stripe
        v-loading="isLoading"
        element-loading-text="数据获取中..."
        height="100%"
      >
        <el-table-column prop="name" label="科目名称"></el-table-column>
        <el-table-column label="期初余额">
          <el-table-column prop="wnqf" label="往年欠费"></el-table-column>
          <el-table-column prop="wyqf" label="往月欠费"></el-table-column>
          <el-table-column prop="wyys" label="往月预收"></el-table-column>
        </el-table-column>
        <el-table-column label="本月应收">
          <el-table-column prop="jzwn" label="结转往年"></el-table-column>
          <el-table-column prop="jzwy" label="结转往月"></el-table-column>
          <el-table-column prop="byxz" label="本月新增"></el-table-column>
          <el-table-column prop="yszj" label="应收总计"></el-table-column>
        </el-table-column>
        <el-table-column label="本月实收">
          <el-table-column prop="sswn" label="实收往年"></el-table-column>
          <el-table-column prop="sswy" label="实收往月"></el-table-column>
          <el-table-column prop="ssby" label="实收本月"></el-table-column>
          <el-table-column prop="byys" label="本月预收"></el-table-column>
          <el-table-column prop="sszj" label="实收总计"></el-table-column>
        </el-table-column>
        <el-table-column label="期末余额">
          <el-table-column prop="qm_wnqf" label="往年欠费"></el-table-column>
          <el-table-column prop="qm_wyqf" label="往月欠费"></el-table-column>
          <el-table-column prop="qm_byqf" label="本月欠费"></el-table-column>
          <el-table-column prop="qm_byzys" label="本月止预收"></el-table-column>
          <el-table-column prop="qm_byft" label="本月分摊"></el-table-column>
        </el-table-column>
        <el-table-column label="收缴率">
          <el-table-column prop="slsl" label="收历史率"></el-table-column>
          <el-table-column prop="sbyl" label="收本月率"></el-table-column>
        </el-table-column>
      </el-table>

      <!-- 三表抄表统计（多级表头） -->
      <el-table
        v-if="tableType === 'wegcoststatistics' && activeName === 'count'"
        :data="tableData"
        stripe
        v-loading="isLoading"
        element-loading-text="数据获取中..."
        height="100%"
      >
        <el-table-column
          v-if="tableTitles.length > 0"
          prop="villagename"
          label="项目名称"
          :width="130"
        ></el-table-column>
        <el-table-column
          :label="item.label"
          v-for="(item, index) in tableTitles"
          :key="index"
        >
          <el-table-column
            :prop="`no_pay${item.prop}`"
            label="未收"
          ></el-table-column>
          <el-table-column
            :prop="`has_pay${item.prop}`"
            label="已收"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <div
        v-if="
          tableType === 'wegcoststatistics' &&
            activeName === 'count' &&
            tableTitles.length === 0
        "
        style="position: absolute; top: 40%;left: 50%;transform: translate(-50%, -50%);font-size: 0.7rem;color: #ccc;"
      >
        暂无数据！
      </div>

      <!-- 动态表头表格（自定义） -->
      <vxe-table
        v-if="
          tableType != 'financemonthstatistics' &&
            tableType != 'wegcoststatistics' &&
            !isStatic
        "
        stripe
        border
        auto-resize
        height="auto"
        show-overflow
        highlight-hover-row
        ref="xeTable"
        align="center"
        v-loading="isLoading"
        element-loading-text="数据获取中..."
      >
        <vxe-table-column
          :field="itm.prop"
          :title="itm.label"
          :min-width="itm.width ? itm.width : 120"
          show-overflow
          v-for="(itm, index) in tableTitles"
          :key="index"
        ></vxe-table-column>
      </vxe-table>

      <!-- 静态表格部分 -->
      <!-- 明细表格 -->
      <vxe-table
        v-if="tableType != 'financemonthstatistics' && isStatic"
        stripe
        border
        auto-resize
        height="auto"
        show-overflow
        highlight-hover-row
        ref="staticTable"
        align="center"
        v-loading="isLoading"
        element-loading-text="数据获取中..."
      >
        <vxe-table-column
          :field="itm.prop"
          :title="itm.label"
          :min-width="itm.width ? itm.width : 120"
          show-overflow
          v-for="(itm, index) in columns"
          :key="index"
        ></vxe-table-column>
      </vxe-table>

      <div class="create-info" v-if="tableType === 'carrecordstatistics'">
        <span class="name">制表人：</span>
        <span class="value">{{ creater }}</span>
        <span class="name">制表日期：</span>
        <span class="value">{{ createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import workIcon from '@/components/common/workIcon.vue'

export default {
  name: 'tables',
  props: ['tableId'],
  components: {
    workIcon
  },
  data() {
    return {
      // 是否正在加载表格数据
      isLoading: false,
      // 报表类型
      tableType: '',
      // 是否是静态表格
      isStatic: false,
      // 表格数据
      tableData: [],
      // 当前 tabs 名
      activeName: '',
      // 表格基本配置
      conf: {
        loadStatus: false,
        emptyText: '',
        curPage: 1,
        limit: 20,
        dataTotal: 0
      },
      // 表格title
      tableTitles: [],
      // 导出表名
      tableName: '',
      // 导出表头
      headers: [],
      // 导出数据
      datas: [],
      // 是否是复杂表头导出
      ismultiple: false,
      // 复杂表头1
      multiHeader: [],
      // 复杂表头2
      multiHeader2: [],
      // 合并配置
      merges: [],
      // 制表人
      creater: '',
      // 制表日期
      createTime: ''
    }
  },

  /**
   * 生命周期
   */
  mounted() {
    // 获取表格数据
    this.tableLoad()
  },

  /**
   * 方法
   */
  methods: {
    // 获取表格数据
    tableLoad() {
      this.isLoading = true
      this.$axios
        .post(this.$api.state.Report.reportquerydetail.url, {
          id: this.tableId
        })
        .then(res => {
          if (res.Code === 200) {
            let result = res.Data
            this.ismultiple = false
            if (result.data) {
              if (this.tableType === 'financemonthstatistics') {
                // 含税表
                if (this.activeName === 'count') {
                  this.tableData = result.data.return_data
                    ? result.data.return_data
                    : []
                  this.tableName = '财务含税月报表'
                } else {
                  // 不含税表
                  this.tableData = result.data.return_data_no_tex
                    ? result.data.return_data_no_tex
                    : []
                  this.tableName = '财务不含税月报表'
                }

                this.ismultiple = true
                this.multiHeader = [
                  '科目名称',
                  '期初余额',
                  '',
                  '',
                  '本月应收',
                  '',
                  '',
                  '',
                  '本月实收',
                  '',
                  '',
                  '',
                  '',
                  '期末余额',
                  '',
                  '',
                  '',
                  '',
                  '收缴率',
                  ''
                ]
                this.multiHeader2 = [
                  '',
                  '往年欠费',
                  '往月欠费',
                  '往月预收',
                  '结转往年',
                  '结转往月',
                  '本月新增',
                  '应收总计',
                  '实收往年',
                  '实收往月',
                  '实收本月',
                  '本月预收',
                  '实收总计',
                  '往年欠费',
                  '往月欠费',
                  '本月欠费',
                  '本月止预收',
                  '本月分摊',
                  '收历史率',
                  '收本月率'
                ]
                this.merges = [
                  'A1:A2',
                  'B1:D1',
                  'E1:H1',
                  'I1:M1',
                  'N1:R1',
                  'S1:T1'
                ]
                this.datas = this.tableData.map(item => {
                  return [
                    item.name,
                    Number(item.wnqf) ? Number(item.wnqf) : 0,
                    Number(item.wyqf) ? Number(item.wyqf) : 0,
                    Number(item.wyys) ? Number(item.wyys) : 0,
                    Number(item.jzwn) ? Number(item.jzwn) : 0,
                    Number(item.jzwy) ? Number(item.jzwy) : 0,
                    Number(item.byxz) ? Number(item.byxz) : 0,
                    Number(item.yszj) ? Number(item.yszj) : 0,
                    Number(item.sswn) ? Number(item.sswn) : 0,
                    Number(item.sswy) ? Number(item.sswy) : 0,
                    Number(item.ssby) ? Number(item.ssby) : 0,
                    Number(item.byys) ? Number(item.byys) : 0,
                    Number(item.sszj) ? Number(item.sszj) : 0,
                    Number(item.qm_wnqf) ? Number(item.qm_wnqf) : 0,
                    Number(item.qm_wyqf) ? Number(item.qm_wyqf) : 0,
                    Number(item.qm_byqf) ? Number(item.qm_byqf) : 0,
                    Number(item.qm_byzys) ? Number(item.qm_byzys) : 0,
                    Number(item.qm_byft) ? Number(item.qm_byft) : 0,
                    item.slsl,
                    item.sbyl
                  ]
                })
                this.$nextTick(() => {
                  this.$refs.financeTable[0].doLayout()
                })
              } else {
                this.tableDataHandle(result.data)
              }
            } else {
              this.tableDataHandle([])
            }
          } else {
            let msg = res.Message ? res.Message : '表格数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    // 明细/科目汇总数据处理
    detailCollectHandle(result) {
      if (this.activeName === 'subject') {
        let arr = [
          {
            label: '项目名称',
            prop: 'vname',
            width: '150'
          }
        ]
        if (result && result.length > 0) {
          result.forEach((item, index) => {
            let obj = {
              label: item.name,
              prop: String(index + 1),
              width: '120'
            }
            arr.push(obj)
          })
        }
        this.tableTitles = arr
        let arr1 = []
        if (result && result.length > 0) {
          result[0].village.forEach(item => {
            let obj = {
              vname: item.name
            }
            arr1.push(obj)
          })
          result.forEach((item, index) => {
            item.village.forEach((itm, i) => {
              arr1[i][String(index + 1)] = itm.money
            })
          })
        }
        result = arr1
      } else if (
        this.activeName === 'count' &&
        this.tableType === 'advancecollectstatistics'
      ) {
        let arr = [
          {
            label: '项目名称',
            prop: 'vname',
            width: '150'
          }
        ]
        if (result && result.length > 0) {
          result.forEach((item, index) => {
            let obj = {
              label: item.name,
              prop: String(index + 1),
              width: '120'
            }
            arr.push(obj)
          })
        }
        this.tableTitles = arr
        let arr1 = []
        if (result && result.length > 0) {
          result[0].village.forEach(item => {
            let obj = {
              vname: item.name
            }
            arr1.push(obj)
          })
          result.forEach((item, index) => {
            item.village.forEach((itm, i) => {
              arr1[i][String(index + 1)] = itm.money
            })
          })
        }
        result = arr1
      }
      return result
    },

    // 表格返回数据处理
    tableDataHandle(result) {
      switch (this.tableType) {
        case 'reportstatistics':
          if (this.activeName === 'subject') {
            this.isStatic = false
            result = this.detailCollectHandle(result)
            this.$refs.xeTable.loadData(result)
            this.tableName = '实收科目汇总表'
            this.headers = this.tableTitles.map(item => item.label)
            this.datas = result.map(item =>
              this.tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          } else {
            this.isStatic = true
            const xetable = this.$refs.staticTable
            xetable.loadData(result)
            this.tableName = '实收统计表'
            this.headers = ['管理区名称', '实收总计', '税前总计', '税额总计']
            this.datas = result.map(item => {
              return [
                item.villagename,
                Number(item.real_money) ? Number(item.real_money) : 0,
                Number(item.pre_tax_money) ? Number(item.pre_tax_money) : 0,
                Number(item.tex_money) ? Number(item.tex_money) : 0
              ]
            })
          }
          break
        case 'receivablestatistics':
          if (this.activeName === 'subject') {
            this.isStatic = false
            result = this.detailCollectHandle(result)
            this.$refs.xeTable.loadData(result)
            this.tableName = '应收科目汇总表'
            this.headers = this.tableTitles.map(item => item.label)
            this.datas = result.map(item =>
              this.tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          } else {
            this.isStatic = true
            this.$refs.staticTable.loadData(result)
            this.tableName = '应收统计表'
            this.headers = ['管理区名称', '应收总计', '税前总计', '税额总计']
            this.datas = result.map(item => {
              return [
                item.villagename,
                Number(item.real_money) ? Number(item.real_money) : 0,
                Number(item.pre_tax_money) ? Number(item.pre_tax_money) : 0,
                Number(item.tex_money) ? Number(item.tex_money) : 0
              ]
            })
          }
          break
        case 'arrearsstatistics':
          if (this.activeName === 'subject') {
            this.isStatic = false
            result = this.detailCollectHandle(result)
            this.$refs.xeTable.loadData(result)
            this.tableName = '欠费科目汇总表'
            this.headers = this.tableTitles.map(item => item.label)
            this.datas = result.map(item =>
              this.tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          } else if (this.activeName === 'wg_count') {
            this.isStatic = true
            this.$refs.staticTable.loadData(result)
            this.tableName = '物业欠费统计表'
            this.headers = [
              '项目名称',
              '欠费金额',
              '已交房欠费',
              '未交房欠费',
              '欠费户数',
              '已交房户数',
              '未交房户数',
              '已装修户数',
              '未装修户数'
            ]
            this.datas = result.map(item => {
              return [
                item.villagename,
                Number(item.money) ? Number(item.money) : 0,
                Number(item.delivery_money) ? Number(item.delivery_money) : 0,
                Number(item.not_delivery_money)
                  ? Number(item.not_delivery_money)
                  : 0,
                Number(item.rooms_num) ? Number(item.rooms_num) : 0,
                Number(item.delivery_num) ? Number(item.delivery_num) : 0,
                Number(item.not_delivery_num)
                  ? Number(item.not_delivery_num)
                  : 0,
                Number(item.isdecorate_num) ? Number(item.isdecorate_num) : 0,
                Number(item.not_isdecorate_num)
                  ? Number(item.not_isdecorate_num)
                  : 0
              ]
            })
          } else {
            this.isStatic = true
            this.$refs.staticTable.loadData(result)
            this.tableName = '欠费统计表'
            this.headers = ['项目名称', '欠费金额']
            this.datas = result.map(item => {
              return [
                item.villagename,
                Number(item.money) ? Number(item.money) : 0
              ]
            })
          }
          break
        case 'advancecollectstatistics':
          if (this.activeName != 'info') {
            this.isStatic = false
            result = this.detailCollectHandle(result)
            this.$refs.xeTable.loadData(result)
            this.tableName = '预收统计表'
            this.headers = this.tableTitles.map(item => item.label)
            this.datas = result.map(item =>
              this.tableTitles.map(itm =>
                Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
              )
            )
          }
          break
        case 'refundstatistics':
          if (result && result.length > 0) {
            result.forEach(item => {
              item.vname = item.village ? item.village.villagename : '--'
              item.oname = item.realname ? item.realname : '--'
              item.sname = item.subject_text ? item.subject_text : '--'
            })
          }
          if (this.activeName != 'info') {
            this.isStatic = true
            this.$refs.staticTable.loadData(result)
            this.tableName = '退款统计表'
            this.headers = ['项目名称', '欠费金额']
            this.datas = result.map(item => {
              return [
                item.villagename,
                Number(item.money) ? Number(item.money) : 0
              ]
            })
          }
          break
        case 'ownerHouse':
          break
        case 'resources':
          break
        case 'financemonthstatistics':
          break
        case 'cashaccountstatistics':
          if (this.activeName === 'subject_pay') {
            this.isStatic = true
            let arr = []
            if (result && result.length > 0) {
              result.forEach(item => {
                let obj = {
                  code: item.code ? item.code : '--',
                  village_name: item.village_name ? item.village_name : '--',
                  village_code: item.village_code ? item.village_code : '--',
                  content: item.village_name + item.name + '收入',
                  pay_money: item.pay_money ? item.pay_money : '--',
                  subject_money: item.subject_money ? item.subject_money : '--'
                }
                arr.push(obj)
              })
            }
            result = arr
            this.$refs.staticTable.loadData(result)
            this.tableName = '收费科目组合表'
            this.headers = [
              '编码',
              '项目名称',
              '项目编码',
              '摘要',
              '支付金额',
              '科目费用'
            ]
            this.datas = result.map(item => {
              return [
                item.code,
                item.village_name,
                item.village_code,
                item.content,
                Number(item.pay_money) ? Number(item.pay_money) : 0,
                Number(item.subject_money) ? Number(item.subject_money) : 0
              ]
            })
          } else if (this.activeName === 'count') {
            this.isStatic = false
            let arr = [
              {
                label: '科目名称',
                prop: 'sname',
                with: 150
              },
              {
                label: '科目总金额',
                prop: 'allmoney',
                with: 120
              },
              {
                label: '不含税金额',
                prop: 'taxmoeny',
                with: 120
              },
              {
                label: '优惠金额',
                prop: 'discountmoney',
                with: 120
              }
            ]
            if (result.pay_data && result.pay_data.length > 0) {
              result.pay_data.forEach(item => {
                let obj = {
                  label: item.name,
                  prop: item.key,
                  with: 120
                }
                arr.push(obj)
              })
            }
            this.tableTitles = arr
            let arr1 = []
            if (result.return_data && result.return_data.length > 0) {
              result.return_data.forEach(item => {
                let obj = {
                  sname: item.name,
                  allmoney: item.subject_all_moeny,
                  taxmoeny: item.subject_tax_moeny,
                  discountmoney: item.subject_discount_moeny,
                  ...item.pay_type_money
                }
                arr1.push(obj)
              })
            }
            result = arr1
            this.$refs.xeTable.loadData(result)
            this.tableName = '现金台账统计表'
            this.headers = this.tableTitles.map(item => item.label)
            this.datas = result.map(item =>
              this.tableTitles.map(itm =>
                item[itm.prop] == 0 || Number(item[itm.prop])
                  ? Number(item[itm.prop])
                  : item[itm.prop]
              )
            )
          }
          break
        case 'combinationstatistics':
          if (this.activeName === 'subject') {
            this.isStatic = true
            this.$refs.staticTable.loadData(result)
            this.tableName = '组合科目汇总表'
            this.headers = ['科目名称', '应收金额', '实收金额', '收缴率']
            this.datas = result.map(item => {
              return [
                item.name,
                Number(item.ys_money) ? Number(item.ys_money) : 0,
                Number(item.ss_money) ? Number(item.ss_money) : 0,
                item.proportion
              ]
            })
          } else {
            this.isStatic = true
            this.$refs.staticTable.loadData(result)
            this.tableName = '组合统计表'
            this.headers = ['项目名称', '应收金额', '实收金额', '收缴率']
            this.datas = result.map(item => {
              return [
                item.villagename,
                Number(item.ys_money) ? Number(item.ys_money) : 0,
                Number(item.ss_money) ? Number(item.ss_money) : 0,
                item.proportion
              ]
            })
          }
          break
        case 'wegcoststatistics':
          if (this.activeName === 'count') {
            this.isStatic = false
            let arr = []
            let header1 = ['项目名称']
            let header2 = ['']
            if (
              result.return_subject_data &&
              result.return_subject_data.length > 0
            ) {
              result.return_subject_data.forEach(item => {
                let obj = {
                  label: item.name,
                  prop: String(item.id),
                  width: 120
                }
                arr.push(obj)
                header1.push(item.name)
                header1.push('')
                header2.push('未收')
                header2.push('已收')
              })
            }
            this.tableTitles = arr
            let arr1 = []
            if (result.return_data && result.return_data.length > 0) {
              result.return_data.forEach(item => {
                let obj = {
                  villagename: item.villagename
                }
                Object.keys(item.subject).forEach(itm => {
                  obj[`no_pay${itm}`] = item.subject[itm].no_pay
                  obj[`has_pay${itm}`] = item.subject[itm].has_pay
                })
                arr1.push(obj)
              })
            }
            result = arr1

            const CELL_CODE = [
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z'
            ]
            this.tableName = '三表抄表统计表'
            this.ismultiple = true
            this.multiHeader = header1
            this.multiHeader2 = header2
            this.merges = ['A1:A2']
            let all = ['项目名称']
            this.datas = result.map(item => {
              let props = [item.villagename]
              this.tableTitles.forEach(itm => {
                props.push(item[`no_pay${itm.prop}`])
                props.push(item[`has_pay${itm.prop}`])
              })
              return props
            })
            this.tableTitles.forEach(itm => {
              all.push(`no_pay${itm.prop}`)
              all.push(`has_pay${itm.prop}`)
            })
            all.forEach((item, index) => {
              if (index > 0 && index % 2 !== 0) {
                this.merges.push(
                  `${CELL_CODE[index]}1:${CELL_CODE[index + 1]}1`
                )
              }
            })
          }
          break
        case 'budgetstatistics':
          this.isStatic = false
          let budgetArr = [
            {
              label: '月份',
              prop: 'month'
            }
          ]
          if (
            result.return_subject_data &&
            result.return_subject_data.length > 0
          ) {
            result.return_subject_data.forEach(item => {
              let obj = {
                label: item.name,
                prop: String(item.id),
                width: '120'
              }
              budgetArr.push(obj)
            })
          }
          let budgetArr1 = []
          if (result.return_data && result.return_data.length > 0) {
            result.return_data.forEach(item => {
              let obj = {
                month: item.month + '月',
                ...item.subject_data
              }
              budgetArr1.push(obj)
            })
          }
          result = budgetArr1

          if (this.activeName === 'share') {
            this.tableTitles = budgetArr
            this.$refs.xeTable.loadData(result)
            this.tableName = '预算分摊统计表'
          } else {
            this.tableTitles = budgetArr
            this.$refs.xeTable.loadData(result)
            this.tableName = '预算实收统计表'
          }
          this.headers = this.tableTitles.map(item => item.label)
          this.datas = result.map(item =>
            this.tableTitles.map(itm =>
              Number(item[itm.prop]) ? Number(item[itm.prop]) : item[itm.prop]
            )
          )
          break
        case 'sharestatistics':
          this.isStatic = false
          let apparr = [
            {
              label: '收款月份',
              prop: 'month'
            }
          ]
          if (result.header && result.header.length > 0) {
            result.header.forEach(item => {
              let obj = {
                label: item.name,
                prop: String(item.time),
                width: '120'
              }
              apparr.push(obj)
            })
          }

          let apparr1 = []
          if (result.return_data && result.return_data.length > 0) {
            result.return_data.forEach(item => {
              let obj = {
                month: item.month,
                ...item.time_money
              }
              apparr1.push(obj)
            })
          }
          result = apparr1
          if (this.activeName === 'ex_tax') {
            this.tableTitles = apparr
            this.$refs.xeTable.loadData(result)
            this.tableName = '分摊不含税统计表'
          } else {
            this.tableTitles = apparr
            this.$refs.xeTable.loadData(result)
            this.tableName = '分摊含税统计表'
          }
          this.headers = this.tableTitles.map(item => item.label)
          this.datas = result.map(item =>
            this.tableTitles.map(itm =>
              item[itm.prop] == 0 || Number(item[itm.prop])
                ? Number(item[itm.prop])
                : item[itm.prop]
            )
          )
          break
        case 'carrecordstatistics':
          this.isStatic = true
          this.creater = result.tablemaker ? result.tablemaker.user : ''
          this.createTime = result.tablemaker ? result.tablemaker.time : ''
          result = result.data
          this.$refs.staticTable.loadData(result)
          this.tableName = '停车场收费统计报表'
          this.headers = ['项目名称', '应收', '实收', '减免', '减免占比率']
          if (result && result.length > 0) {
            result.forEach(item => {
              let arr = [
                item.name,
                Number(item.need_pay) ? Number(item.need_pay) : 0,
                Number(item.pay_money) ? Number(item.pay_money) : 0,
                Number(item.reduction_money) ? Number(item.reduction_money) : 0,
                item.reduction_proportion
              ]
              this.datas.push(arr)
            })
          }
          break
      }
      this.tableData = result
    },

    // 重新查询处理
    queryAgain() {
      this.tableList.forEach(item => {
        item.tableData = []
      })
      this.$emit('queryAgain')
    },

    /* 导出EXCEL */
    exportExcel() {
      try {
        // 多级表头表格导出
        if (this.ismultiple) {
          import('@/assets/common/excel/ComplexHeaderExcel.js').then(excel => {
            excel.export_json_to_excel({
              multiHeader: this.multiHeader2,
              multiHeader2: this.multiHeader,
              data: this.datas,
              merges: this.merges,
              filename: this.tableName
            })
          })
        } else {
          require.ensure([], () => {
            // 引入excel.js
            let {
              export_json_to_excel
            } = require('@/assets/common/excel/Export2Excel')

            // 执行导出操作
            export_json_to_excel(this.headers, this.datas, this.tableName)
          })
        }

        this.$notify({
          type: 'success',
          title: '温馨提示',
          message: '导出报表成功',
          duration: 1500
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          title: '温馨提示',
          message: '导出报表失败',
          duration: 1500
        })
      }
    }
  }
}
</script>

<style lang="less">
.el-table {
  td,
  th {
    padding: 10px 0;
    .cell {
      text-align: center;
      color: #333;
    }
  }
  thead.is-group {
    th {
      background: #fff;
    }
  }
}
.el-tabs--border-card {
  box-shadow: none;
}
#tables {
  width: 100%;
  height: 100%;
  position: relative;
  .vxe-table--render-default .vxe-header--column:not(.col--ellipsis),
  .vxe-table--render-default .vxe-body--column:not(.col--ellipsis),
  .vxe-table--render-default .vxe-footer--column:not(.col--ellipsis) {
    padding: 8px 0;
  }
  .vxe-table--render-default.vxe-editable .vxe-body--column,
  .vxe-table--render-default .vxe-header--column.col--ellipsis,
  .vxe-table--render-default .vxe-body--column.col--ellipsis,
  .vxe-table--render-default .vxe-footer--column.col--ellipsis {
    height: 38px;
  }
  .filter-wp {
    position: relative;
    display: flex;
    padding: 20px 0 15px;
    .filter {
      width: 400px;
      height: 36px;
      line-height: 36px;
      background-color: #f7f7f7;
      border-radius: 3px;
      padding: 0 15px;
      display: flex;
      font-size: 14px;
      margin-right: 20px;
      .text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      > span {
        margin-left: 10px;
        color: #ccc;
        font-size: 13px;
        cursor: pointer;
      }
    }
    .el-button {
      height: 36px;
      padding: 10px 15px;
      width: 120px;
    }
    .el-button + .el-button {
      margin-left: 15px !important;
    }
    .export {
      position: absolute;
      top: 21px;
      right: 0;
      z-index: 1000;
      cursor: pointer;
      .common-right-icon {
        svg {
          width: 34px;
          height: 35px;
        }
      }
    }
  }
  .table-wp {
    height: calc(100% - 71px);
    .el-table {
      .el-table__body-wrapper {
        height: calc(100% - 71px) !important;
      }
    }
    .el-table.carport {
      height: calc(100% - 70px) !important;
      .el-table__body-wrapper {
        height: calc(100% - 48px) !important;
      }
    }
    .el-table.finance {
      .el-table__body-wrapper {
        height: calc(100% - 111px) !important;
      }
    }
    .create-info {
      padding: 25px 30px;
      .name {
        font-size: 14px;
        color: #333;
      }
      .value {
        font-size: 14px;
        color: #333;
        margin: 0 40px 0 5px;
      }
    }
  }
}
</style>
