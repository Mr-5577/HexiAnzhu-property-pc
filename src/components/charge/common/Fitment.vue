<template>
  <div id="fitment">
    <!-- 未装修 弹框部分 -->
    <el-dialog
      class="unfurnished"
      :visible.sync="showUnfurnished"
      :title="isCharge ? '添加收费' : '录入装修资料'"
      width="50%"
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-scrollbar style="height: 100%;">
        <!-- 基本信息部分 -->
        <div class="basic-info">
          <div class="info-item">
            <div class="name">业主姓名</div>
            <div class="value black">{{ fitmentInfo.owner_name }}</div>
          </div>
          <div class="info-item">
            <div class="name">房间编号</div>
            <div class="value black">{{ fitmentInfo.name }}</div>
          </div>
          <div class="info-item">
            <div class="name">联系电话</div>
            <div class="value">{{ fitmentInfo.tel }}</div>
          </div>
          <div class="info-item">
            <div class="name">身份证号</div>
            <div class="value">{{ fitmentInfo.idcard }}</div>
          </div>
          <div class="info-item">
            <div class="name">建筑面积</div>
            <div class="value green">{{ fitmentInfo.area }}</div>
          </div>
        </div>

        <!-- 装修信息录入部分 -->
        <div class="entry-info">
          <div class="title">装修信息录入</div>
          <el-form
            :model="entryForm"
            :rules="entryRules"
            ref="entryForm"
            :hide-required-asterisk="true"
          >
            <el-form-item label="装修日期" prop="ftime">
              <el-date-picker
                v-model="entryForm.ftime"
                type="date"
                align="center"
                value-format="timestamp"
                placeholder="请选择装修日期"
                :disabled="isCharge"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="订单时间" prop="otime">
              <!-- :picker-options="pickerOptions" -->
              <el-date-picker
                v-model="entryForm.otime"
                type="datetime"
                align="center"
                value-format="timestamp"
                placeholder="请选择订单时间"
                :disabled="
                  !$menu.getters.judgeRole('Btn-AW0xMrF2Y8BbUJHMIzt0iOCL')
                "
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="零钱包费用">
              <el-input
                v-model="entryForm.lmoney"
                placeholder="请输入收费总金额"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="`是否使用预存(余额:￥${balance})`"
              prop="balance"
              v-if="!entryForm.lmoney && Number(balance) >= Number(allMoney)"
            >
              <el-select
                v-model="entryForm.balance"
                placeholder="请选择是否使用预存"
              >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否生成发票" prop="isreceipt">
              <el-select
                v-model="entryForm.isreceipt"
                placeholder="请选择是否生成发票"
                clearable
              >
                <el-option
                  v-for="item in receiptOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收费方式" prop="method">
              <el-select
                v-model="entryForm.method"
                placeholder="请选择收费方式"
                clearable
              >
                <el-option
                  v-for="item in methodOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="收据类型"
              prop="receiptType"
              v-if="receiptType == 3"
            >
              <el-select
                v-model="entryForm.receiptType"
                placeholder="请选择收据类型"
                clearable
              >
                <el-option label="电子收据" :value="1"></el-option>
                <el-option label="纸质收据" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="是否生成纸质收据"
              prop="isPaper"
              v-if="
                receiptType == 2 ||
                  (receiptType == 3 && entryForm.receiptType == 2)
              "
            >
              <el-select
                v-model="entryForm.isPaper"
                placeholder="请选择是否生成纸质收据"
                clearable
              >
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>

            <div class="tip">注意：不设找零，零头自动转入零钱包！</div>

            <!-- 选择科目部分 -->
            <el-form-item class="subjects" label="选择收费科目" prop="subjects">
              <div class="empty" v-if="subList.length === 0">暂无收费科目</div>
              <el-checkbox-group
                v-else
                v-model="entryForm.subjects"
                @change="subChange"
              >
                <div
                  class="check-item"
                  v-for="(item, index) in subList"
                  :key="index"
                >
                  <el-checkbox
                    :label="item.id"
                    name="subjects"
                    :disabled="!isCharge"
                  >
                    {{ item.name + ' ' + item.price + '/' + item.formula_text }}
                  </el-checkbox>
                  <div class="input-wp">
                    <span v-if="item.formula === 3">
                      <el-input
                        type="number"
                        v-model="item.day"
                        :disabled="item.is_edit_template == 0"
                        placeholder="请输入时间"
                        @input="dayChange(item)"
                      ></el-input>
                      <span style="font-size: 0.6rem;">(天)</span>
                      <span class="text">x</span>
                    </span>
                    <span v-if="item.formula === 1 || item.formula === 3">
                      <el-input
                        v-model="item.area"
                        type="number"
                        :disabled="item.is_edit_template == 0"
                        placeholder="请输入面积"
                        @input="areaChange(item)"
                      ></el-input>
                      <span style="font-size: 0.6rem;">(m²)</span>
                      <span class="text">x</span>
                    </span>
                    <span
                      v-if="
                        item.formula === 1 ||
                          item.formula === 2 ||
                          item.formula === 3
                      "
                    >
                      <el-input
                        v-model="item.price"
                        type="number"
                        :disabled="item.is_edit_template == 0"
                        placeholder="请输入单价"
                        @input="priceChange(item)"
                      ></el-input>
                      <span style="font-size: 0.6rem;">(元)</span>
                    </span>
                  </div>
                  <div class="sub-total">
                    共计
                    <span
                      style="color: #333;font-size: 0.75rem;font-weight: 700;"
                    >
                      {{ item.total }}
                    </span>
                  </div>
                </div>
              </el-checkbox-group>
            </el-form-item>
            <div class="total">
              合计
              <span class="money">{{ allMoney }}元</span>
            </div>

            <!-- 上传附件部分 -->
            <el-form-item class="upload" label="上传附件" prop="fileInfo">
              <el-upload
                ref="upload"
                :action="qiniuDatas.domain"
                :http-request="customUpload"
                :on-remove="handleRemove"
                v-if="qiniuDatas.domain"
              >
                <el-button
                  type="primary"
                  style="width: 5rem;position: absolute;top: 0;left: 6rem;"
                >
                  点击上传
                </el-button>
              </el-upload>
            </el-form-item>

            <el-form-item class="remark-wp" label="费用说明" prop="remark">
              <el-input
                type="textarea"
                v-model="entryForm.remark"
                resize="none"
                :rows="3"
                placeholder="请输入费用说明"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
          {{ isCharge ? '确认添加' : '提交保存' }}
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showUnfurnished = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 装修中、已装修 弹框部分 -->
    <el-dialog
      class="decorated"
      :visible.sync="showDecorated"
      :title="type == 1 ? '装修信息' : '装修结算'"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;" v-loading="isLoading">
        <!-- 基本信息部分 -->
        <div class="basic-info">
          <div class="info-item">
            <div class="name">业主姓名</div>
            <div class="value black">{{ fitmentInfo.owner_name }}</div>
          </div>
          <div class="info-item">
            <div class="name">房间编号</div>
            <div class="value black">{{ fitmentInfo.name }}</div>
          </div>
          <div class="info-item">
            <div class="name">联系电话</div>
            <div class="value">{{ fitmentInfo.tel }}</div>
          </div>
          <div class="info-item">
            <div class="name">身份证号</div>
            <div class="value">{{ fitmentInfo.idcard }}</div>
          </div>
          <div class="info-item">
            <div class="name">建筑面积</div>
            <div class="value green">{{ fitmentInfo.area }}</div>
          </div>
        </div>
        <!-- 装修记录部分 -->
        <div class="table-wp">
          <div class="title">
            装修记录
            <span
              :class="['label', item.active ? 'active' : '']"
              v-for="(item, index) in fitmentList"
              :key="index"
              @click="labelCheck(item, index)"
            >
              第{{ item.num }}次
            </span>

            <span
              v-if="
                $menu.getters.judgeRole('Btn-QNE5wLtedtksnUjiYq9Mzby4') &&
                  type == 2 &&
                  this.cIndex == this.fitmentList.length - 1
              "
              class="label active"
              @click="addCharge"
            >
              添加收费
            </span>
          </div>
          <el-scrollbar style="width: 100%;">
            <div class="table-content">
              <div
                class="content"
                v-if="
                  fitmentRecord.subject_pay &&
                    fitmentRecord.subject_pay.length > 0
                "
              >
                <div class="td-wp">
                  <span class="name">装修时间</span>
                  <span class="value black">
                    <span>{{ fitmentRecord.startime }}</span>
                  </span>
                </div>
                <div
                  class="td-wp"
                  v-for="(item, index) in fitmentRecord.subject_pay"
                  :key="index"
                >
                  <span class="name">{{ item.subject_name }}</span>
                  <span class="value">
                    <span>{{ item.money }}</span>
                  </span>
                </div>
                <div class="td-wp desc">
                  <span class="name">费用说明</span>
                  <span class="value">
                    <span>{{ fitmentRecord.remark }}</span>
                  </span>
                </div>
                <div class="td-wp total">
                  <span class="name">收费总额</span>
                  <span class="value yellow">
                    <span>{{ fitmentRecord.money }}</span>
                  </span>
                </div>
              </div>
              <div class="content" v-else>
                <div class="tip">暂无装修数据！</div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 相关附件部分 -->
        <div class="table-wp file">
          <div class="title">相关附件</div>
          <div class="table-content">
            <div
              class="content file"
              v-if="fitmentRecord.file && fitmentRecord.file.length > 0"
            >
              <div class="td-wp">
                <span class="name">文件名称</span>
                <span class="value">
                  <span
                    v-for="(itm, index) in fitmentRecord.file"
                    :key="index"
                    style="display: block;"
                  >
                    {{ itm.filename }}
                  </span>
                </span>
              </div>
              <div class="td-wp">
                <span class="name">文件大小</span>
                <span class="value">
                  <span
                    v-for="(itm, index) in fitmentRecord.file"
                    :key="index"
                    style="display: block;"
                  >
                    {{ (itm.size / 1024).toFixed(2) }}Kb
                  </span>
                </span>
              </div>
              <div class="td-wp">
                <span class="name">操作</span>
                <span
                  class="value"
                  style="display: block;"
                  v-for="(itm, index) in fitmentRecord.file"
                  :key="index"
                >
                  <a
                    :href="itm.file_url"
                    target="_blank"
                    style="display: block;"
                  >
                    <el-button size="small" type="primary" round plain>
                      下载文件
                    </el-button>
                  </a>
                </span>
              </div>
            </div>
            <div class="content" v-else>
              <div class="tip">暂无附件！</div>
            </div>
          </div>
        </div>

        <!-- 退款记录部分 -->
        <div
          class="table-wp"
          v-if="type == 1 || this.cIndex != this.fitmentList.length - 1"
        >
          <div class="title">退款记录</div>
          <div class="table-content">
            <div
              class="content"
              v-if="
                fitmentRecord.subject_refund &&
                  fitmentRecord.subject_refund.length > 0
              "
            >
              <div class="td-wp">
                <span class="name">退款时间</span>
                <span class="value black">
                  <span>{{ fitmentRecord.endtime }}</span>
                </span>
              </div>
              <div
                class="td-wp"
                v-for="(item, index) in fitmentRecord.subject_refund"
                :key="index"
              >
                <span class="name">{{ item.subject_name }}</span>
                <span class="value">
                  <span>{{ item.money }}</span>
                </span>
              </div>
              <div class="td-wp" style="width: 10rem;">
                <span class="name">退款说明</span>
                <span class="value">
                  <span>{{ fitmentRecord.refund_remarks }}</span>
                </span>
              </div>
              <div class="td-wp">
                <span class="name">退款金额</span>
                <span class="value yellow">
                  <span>{{ fitmentRecord.refundMoney }}</span>
                </span>
              </div>
            </div>
            <div class="content" v-else>
              <div class="tip">暂无退款记录！</div>
            </div>
          </div>
        </div>

        <!-- 收费标准部分 -->
        <div class="standard-wp" v-if="type == 1">
          <div class="title">收费标准</div>
          <div class="content">
            <div
              class="info-item"
              v-for="(item, index) in subList"
              :key="index"
            >
              <span class="name">{{ item.name }}</span>
              <span class="value">{{ item.price }}</span>
            </div>
          </div>
        </div>

        <!-- 装修完成退款部分 -->
        <div
          class="form-wp"
          v-if="type == 2 && this.cIndex === this.fitmentList.length - 1"
        >
          <div class="title">装修完成</div>
          <div class="input-item">
            <div class="name">完成时间</div>
            <el-date-picker
              v-model="finishTime"
              type="date"
              align="center"
              value-format="timestamp"
              placeholder="请选择完成日期"
            ></el-date-picker>
          </div>
          <div class="input-item">
            <div class="name">备注说明</div>
            <el-input
              type="textarea"
              v-model="desc"
              resize="none"
              :rows="3"
              placeholder="请输入备注说明"
            ></el-input>
          </div>
        </div>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          v-if="type == 1"
          :disabled="!$menu.getters.judgeRole('Btn-78oi6mDGaHh4xE000ywAbS3A')"
          :loading="isCommit"
          type="primary"
          round
          @click="fitmentAgain"
        >
          再次装修
        </el-button>

        <el-button
          v-else
          :loading="isCommit"
          type="primary"
          :disabled="this.cIndex != this.fitmentList.length - 1"
          round
          @click="fitmentFinish"
        >
          完成装修
        </el-button>

        <el-button type="info" round @click="showDecorated = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'fitment',
  props: ['vid', 'balance'],
  data() {
    return {
      urlObj: {
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        fitmentInfo: this.$api.state.Charge.fitmentInfo.url,
        fitmentSub: this.$api.state.Charge.fitmentSub.url,
        fitmentStart: this.$api.state.Charge.fitmentStart.url,
        appendren: this.$api.state.Charge.appendren.url,
        fitmentResource: this.$api.state.Charge.fitmentResource.url,
        fitmentEnd: this.$api.state.Charge.fitmentEnd.url,
        uploadToken: this.$api.state.Public.uploadToken.url,
        saveUploadInfo: this.$api.state.Public.saveUploadInfo.url,
        delFile: this.$api.state.Public.delFile.url,
        getpaymenttype: this.$api.state.Charge.getpaymenttype.url,
        getreceipttype: this.$api.state.Charge.getreceipttype.url
      },
      // 当前弹框类型(0:未装修 1: 已装修 2: 装修中)
      type: 0,
      // 当前用户资源数据
      currentUser: {},
      // 是否正在加载数据
      isLoading: false,
      // 是否显示未装修弹框
      showUnfurnished: false,
      // 是否显示已装修、装修中弹框
      showDecorated: false,
      // 基本信息数据
      fitmentInfo: {},
      // 装修记录、退款记录列表数据
      fitmentList: [],
      // 当前选择的装修index
      cIndex: 0,
      // 当前装修、退款批次信息
      fitmentRecord: {},
      // 表单数据对象
      entryForm: {
        ftime: '',
        otime: '',
        lmoney: '',
        balance: 0,
        isreceipt: 0,
        method: '',
        receiptType: 1,
        isPaper: '',
        subjects: [],
        fileInfo: [],
        remark: ''
      },
      // 表单验证对象
      entryRules: {
        ftime: [
          { required: true, message: '请选择装修日期', trigger: 'change' }
        ],
        otime: [
          { required: true, message: '请选择订单时间', trigger: 'change' }
        ],
        balance: [
          { required: true, message: '请选择是否使用预存', trigger: 'change' }
        ],
        isreceipt: [
          { required: true, message: '请选择是否生成发票', trigger: 'change' }
        ],
        method: [
          { required: true, message: '请选择收费方式', trigger: 'change' }
        ],
        receiptType: [
          { required: true, message: '请选择收据类型', trigger: 'change' }
        ],
        isPaper: [
          {
            required: true,
            message: '请选择是否生成纸质收据',
            trigger: 'change'
          }
        ],
        subjects: [
          {
            type: 'array',
            required: true,
            message: '请选择科目！',
            trigger: 'change'
          }
        ],
        fileInfo: [
          {
            type: 'array',
            required: false,
            message: '请上传附件！',
            trigger: 'change'
          }
        ],
        remark: [{ required: true, message: '请填写费用说明', trigger: 'blur' }]
      },
      // 是否生成收据
      receiptOptions: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ],
      // 收费方式列表
      methodOptions: [],
      // 科目列表
      subList: [],
      // 当前选择的科目 id 列表
      subjectIds: [],
      // 科目合计金额
      total: '0.0',
      // 是否正在提交数据
      isCommit: false,
      // 完成时间
      finishTime: '',
      // 退款说明
      desc: '',
      // 图片/文件上传参数
      qiniuDatas: {},
      // 当前项目支持的收据类型
      receiptType: '',
      // 是否是添加收费
      isCharge: false
    }
  },

  computed: {
    allMoney() {
      return _.round(
        _.add(Number(this.total), Number(this.entryForm.lmoney)),
        1
      ).toFixed(1)
    }
  },

  /**
   * 方法
   */
  methods: {
    // 组件初始化方法
    init(type, obj) {
      this.currentUser = obj
      this.type = type
      this.subjectIds = []
      this.subList = []
      this.fitmentInfo = {}
      // 获取装修信息
      this.getFitmentInfo()
      if (type == 0) {
        // 表单验证重置
        if (this.$refs.entryForm) {
          this.$refs.entryForm.resetFields()
        }
        if (!this.$menu.getters.judgeRole('Btn-AW0xMrF2Y8BbUJHMIzt0iOCL')) {
          this.entryForm.otime = new Date()
        }
        this.entryForm.lmoney = ''
        this.total = '0.0'
        this.isCharge = false
        // 获取项目支持的收据类型
        this.getReceiptType()
        // 获取支付方式
        this.getPaymentType()
        // 获取文件上传 token
        this.getUploadToken()
        this.showUnfurnished = true
      } else {
        this.finishTime = ''
        this.desc = ''
        // 获取装修记录数据
        this.getFitmentRecord()
        this.showDecorated = true
      }
    },

    // 弹框关闭
    dialogClose() {
      this.$refs.upload.clearFiles()
      this.isCharge = false
    },

    // 获取当前项目支持的收据类型
    getReceiptType() {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getreceipttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.receiptType = res.Data ? res.Data.use_receipt_type : ''
          } else {
            let msg = res.Message ? res.Message : '获取收据类型失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 获取支付方式
    getPaymentType() {
      let data = {
        vid: this.vid
      }
      this.$axios
        .post(this.urlObj.getpaymenttype, data)
        .then(res => {
          if (res.Code === 200) {
            this.methodOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取支付方式失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 获取装修信息
    getFitmentInfo() {
      let data = {
        type: this.currentUser.type,
        id: this.currentUser.id,
        oid: this.currentUser.oid
      }
      this.$axios
        .post(this.urlObj.fitmentInfo, data)
        .then(res => {
          if (res.Code === 200) {
            this.fitmentInfo = res.Data
            if (this.subList.length > 0) {
              this.subList.forEach(item => {
                if (item.formula == 3) {
                  item.day = 1
                  item.area = this.fitmentInfo.area ? this.fitmentInfo.area : 0
                  item.total = _.round(
                    this.accMul(
                      Number(item.day),
                      this.accMul(Number(item.area), Number(item.price))
                    ),
                    1
                  ).toFixed(1)
                } else if (item.formula == 1) {
                  item.area = this.fitmentInfo.area ? this.fitmentInfo.area : 0
                  item.total = _.round(
                    this.accMul(Number(item.area), Number(item.price)),
                    1
                  ).toFixed(1)
                } else if (item.formula == 2) {
                  item.total = _.round(Number(item.price), 1).toFixed(1)
                }
              })
            }
            if (
              this.type == 1 ||
              this.type == 0 ||
              (this.type == 2 && this.isCharge)
            ) {
              // 获取收费科目
              this.getSubjects()
            }
          } else {
            let msg = res.Message ? res.Message : '获取装修信息失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 获取装修记录、退款记录数据
    getFitmentRecord() {
      this.isLoading = true
      let data = {
        resources_id: this.currentUser.id,
        resources_type: this.currentUser.type
      }
      // 获取项目列表数据
      this.$axios
        .post(this.urlObj.fitmentResource, data)
        .then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach((item, index) => {
                if (index === res.Data.length - 1) {
                  item.active = true
                  this.cIndex = index
                } else {
                  item.active = false
                }
                if (item.subject_refund && item.subject_refund.length > 0) {
                  let total = 0
                  item.subject_refund.forEach(itm => {
                    itm.money = Math.abs(itm.money)
                    total = _.round(
                      _.add(Number(total), Number(itm.money)),
                      2
                    ).toFixed(2)
                  })
                  item.refundMoney = total
                }
              })
            }
            this.fitmentList = res.Data ? res.Data : []
            this.fitmentRecord =
              res.Data && res.Data.length > 0 ? res.Data[this.cIndex] : {}
          } else {
            let msg = res.Message
              ? res.Message
              : '装修记录、退款记录数据获取失败！'
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

    // 获取收费标准（科目）
    getSubjects() {
      let data = {
        vid: this.vid,
        roomid: this.currentUser.id
      }
      this.$axios
        .post(this.urlObj.fitmentSub, data)
        .then(res => {
          if (res.Code === 200) {
            let ids = []
            let total = 0
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.check = true
                ids.push(item.id)
                if (this.fitmentInfo.area) {
                  if (item.formula == 3) {
                    item.day = 1
                    item.area = this.fitmentInfo.area
                      ? this.fitmentInfo.area
                      : 0
                    item.total = _.round(
                      this.accMul(
                        Number(item.day),
                        this.accMul(Number(item.area), Number(item.price))
                      ),
                      1
                    ).toFixed(1)
                  } else if (item.formula == 1) {
                    item.area = this.fitmentInfo.area
                      ? this.fitmentInfo.area
                      : 0
                    item.total = _.round(
                      this.accMul(Number(item.area), Number(item.price)),
                      1
                    ).toFixed(1)
                  } else if (item.formula == 2) {
                    item.total = _.round(Number(item.price), 1).toFixed(1)
                  }
                }
                total = _.round(_.add(Number(total), Number(item.total)), 1)
              })
            }
            this.subList = res.Data
            this.entryForm.subjects = ids
            this.subjectIds = ids
            this.total = total
          } else {
            let msg = res.Message ? res.Message : '获取科目信息失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
        .catch(() => {})
    },

    // 天数改变
    dayChange(item) {
      if (item.day == '' || item.day <= 0) {
        this.$message({
          type: 'warning',
          message: '天数不能为空或小于等于0'
        })
        item.day = ''
      } else {
        this.totalCount(item)
      }
    },

    // 面积改变
    areaChange(item) {
      if (item.area == '' || item.area <= 0) {
        this.$message({
          type: 'warning',
          message: '面积不能为空或小于等于0'
        })
        item.area = ''
      } else {
        this.totalCount(item)
      }
    },

    // 价格改变
    priceChange(item) {
      if (
        item.price === '' ||
        item.price === undefined ||
        item.price === null
      ) {
        this.$message({
          type: 'warning',
          message: '单价不能为空'
        })
        item.price = 0
        item.total = '0.0'
        this.totalCount(item)
      } else {
        this.totalCount(item)
      }
    },

    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return (
        (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
        Math.pow(10, m)
      )
    },

    // 时间、面积、单价修改处理
    totalCount(item) {
      if (item.formula == 3) {
        item.total = _.round(
          this.accMul(
            Number(item.day),
            this.accMul(Number(item.area), Number(item.price))
          ),
          1
        ).toFixed(1)
      } else if (item.formula == 1) {
        item.total = _.round(
          this.accMul(Number(item.area), Number(item.price)),
          1
        ).toFixed(1)
      } else if (item.formula == 2) {
        item.total = _.round(Number(item.price), 1).toFixed(1)
      }
      // 重新计算合计值
      if (this.subjectIds.includes(item.id)) {
        let total = 0
        this.subList.forEach(item => {
          if (this.subjectIds.includes(item.id)) {
            total = _.round(_.add(Number(total), Number(item.total)), 1)
          }
        })
        this.total = total
      }
    },

    // 科目选择更改处理
    subChange(value) {
      this.subjectIds = value
      if (value.length > 0) {
        let total = 0
        this.subList.forEach(item => {
          if (this.subjectIds.includes(item.id)) {
            total = _.round(_.add(Number(total), Number(item.total)), 1)
          }
        })
        this.total = total
      } else {
        this.total = '0.0'
      }
    },

    // 获取文件上传 token
    getUploadToken() {
      this.$axios.post(this.urlObj.uploadToken).then(res => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    // 自定义上传
    customUpload(params) {
      params.url = this.$refs.upload.uploadFiles[0].url
      let uploadInfo = qiniuUpload(params, this.qiniuDatas)
      var subscription = uploadInfo.observable.subscribe({
        // 上传开始
        // 接收上传进度信息，result是带有total字段的 Object
        // loaded: 已上传大小; size: 上传总信息; percent: 当前上传进度
        next: result => {},
        // 上传错误后失败报错
        error: errResult => {},
        complete: result => {
          this.saveFile(uploadInfo.fileInfo, params.file.uid)
        }
      })
    },

    // 文件、图片删除处理
    handleRemove(file) {
      let index = this.entryForm.fileInfo.findIndex(
        item => item.uid === file.uid
      )
      if (index != -1) {
        // 删除数据库和七牛云文件
        this.$axios
          .post(this.urlObj.delFile, { id: this.entryForm.fileInfo[index].id })
          .then(res => {
            if (res.Code != 200) {
              let msg = res.Message ? res.Message : '文件删除失败！'
              this.$message({
                message: msg,
                type: 'error'
              })
            }
          })
          .catch(() => {})
        this.entryForm.fileInfo.splice(index, 1)
        this.$refs.entryForm.validateField('fileInfo')
      }
    },

    // 文件保存到数据库
    saveFile(data, uid) {
      this.$axios.post(this.urlObj.saveUploadInfo, data).then(res => {
        if (res.Code === 200) {
          this.entryForm.fileInfo.push({
            id: res.Data.id,
            uid: uid
          })
        } else {
          let msg = res.Message ? res.Message : '文件信息保存失败！'
          this.$message({
            message: msg,
            type: 'error'
          })
        }
        this.$refs.entryForm.validateField('fileInfo')
      })
    },

    // 表单提交验证
    formSubmit() {
      this.$refs.entryForm.validate(valid => {
        let subjectDatas = []
        this.subList.forEach(item => {
          if (this.entryForm.subjects.includes(item.id)) {
            let obj = {
              id: item.id,
              price: item.price,
              area: item.area ? item.area : '',
              day_num: item.day ? item.day : ''
            }
            subjectDatas.push(obj)
          }
        })
        if (valid) {
          this.isCommit = true
          let data = {
            vid: this.vid,
            oid: this.currentUser.oid,
            resources_id: this.currentUser.id,
            resources_type: this.currentUser.type,
            desc: this.entryForm.remark,
            subject_data: subjectDatas,
            pay_time: this.entryForm.otime / 1000,
            pay_type: this.entryForm.method,
            balance: this.entryForm.lmoney ? 1 : 0,
            balance_money: this.entryForm.lmoney,
            is_bill: this.entryForm.isreceipt
          }
          if (this.entryForm.fileInfo.length > 0) {
            data.file_ids = this.entryForm.fileInfo.map(item => item.id)
          }
          if (this.receiptType == 3) {
            data.receipt_type = this.entryForm.receiptType
            if (this.entryForm.receiptType == 2) {
              data.is_open_receiptpaper = this.entryForm.isPaper
            }
          } else if (this.receiptType == 2) {
            data.is_open_receiptpaper = this.entryForm.isPaper
          }
          if (!this.entryForm.lmoney && Number(this.balance) >= Number(this.allMoney)) {
            data.use_balance = this.entryForm.balance
          } else {
            data.use_balance = 0
          }
          let url = ''
          let text = ''
          // 装修录入
          if (!this.isCharge) {
            data.startime = this.entryForm.ftime / 1000
            url = this.urlObj.fitmentStart
            text = '装修信息录入'
          } else {
            url = this.urlObj.appendren
            text = '添加收费'
          }
          this.$axios
            .post(url, data)
            .then(res => {
              if (res.Code === 200) {
                this.$message({
                  type: 'success',
                  message: `${text}成功！`
                })
                // 关闭弹框
                this.showUnfurnished = false
                if (this.isCharge) {
                  this.init(this.type, this.currentUser)
                } else {
                  // 重新获取信息
                  this.$emit('getBasicInfo')
                }
              } else {
                let msg = res.Message ? res.Message : `${text}失败！`
                this.$message({
                  type: 'error',
                  message: msg
                })
              }
              this.isCommit = false
            })
            .catch(err => {
              this.isCommit = false
            })
        }
      })
    },

    // label 点击处理
    labelCheck(label, index) {
      this.cIndex = index
      if (!label.active) {
        this.fitmentList.forEach(item => {
          item.active = false
        })
        label.active = true
        this.fitmentRecord = label
      }
    },

    // 点击再次装修按钮处理
    fitmentAgain() {
      this.showDecorated = false
      this.init(0, this.currentUser)
    },

    // 点击完成装修按钮处理
    fitmentFinish() {
      if (!this.finishTime && !this.desc.trim()) {
        this.$message({
          type: 'warning',
          message: '完成时间和备注说明不能为空'
        })
      } else if (!this.finishTime) {
        this.$message({
          type: 'warning',
          message: '完成时间不能为空'
        })
      } else if (!this.desc.trim()) {
        this.$message({
          type: 'warning',
          message: '备注说明不能为空'
        })
      } else {
        this.isCommit = true
        let data = {
          oid: this.currentUser.oid,
          resources_id: this.currentUser.id,
          resources_type: this.currentUser.type,
          endtime: this.finishTime / 1000,
          desc: this.desc.trim()
        }
        this.$axios
          .post(this.urlObj.fitmentEnd, data)
          .then(res => {
            if (res.Code === 200) {
              this.$message({
                type: 'success',
                message: '装修已完成！'
              })
              // 关闭弹框
              this.showDecorated = false
              // 重新获取信息
              this.$emit('getBasicInfo')
            } else {
              let msg = res.Message ? res.Message : '装修完成失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.isCommit = false
          })
          .catch(err => {
            this.isCommit = false
          })
      }
    },

    // 点击添加收费按钮处理
    addCharge() {
      this.subjectIds = []
      this.subList = []
      this.fitmentInfo = {}
      // 获取装修信息
      this.getFitmentInfo()
      // 表单验证重置
      if (this.$refs.entryForm) {
        this.$refs.entryForm.resetFields()
      }
      if (!this.$menu.getters.judgeRole('Btn-AW0xMrF2Y8BbUJHMIzt0iOCL')) {
        this.entryForm.otime = new Date()
      }
      this.entryForm.ftime = new Date(
        this.fitmentList[this.cIndex].startime
      ).getTime()
      this.entryForm.lmoney = ''
      this.isCharge = true
      this.total = '0.0'
      // 获取项目支持的收据类型
      this.getReceiptType()
      // 获取支付方式
      this.getPaymentType()
      // 获取文件上传 token
      this.getUploadToken()
      this.showUnfurnished = true
    }
  }
}
</script>

<style lang="less">
.el-upload-list__item {
  line-height: 40px;
}
.el-upload-list__item:hover .el-icon-close {
  line-height: 32px;
}
#fitment {
  font-family: 'Source Han Sans CN';
  position: relative;

  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
    .el-dialog__body {
      height: calc(100% - 158px);
      padding: 0 15px !important;
      box-sizing: border-box;
    }
  }

  .unfurnished {
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        .basic-info {
          margin: 25px 15px 0;
          padding: 20px;
          border-radius: 6px;
          background-color: #f7f7f7;
          display: flex;
          justify-content: space-between;
          .info-item {
            padding: 0 10px;
            box-sizing: border-box;
            .name {
              margin-bottom: 15px;
              font-size: 15px;
              line-height: 24px;
              color: #333;
              text-align: center;
            }
            .value {
              font-size: 14px;
              line-height: 22px;
              color: #999;
              text-align: center;
            }
            .value.green {
              color: #69da61;
            }
            .value.black {
              color: #333;
            }
          }
        }
        .entry-info {
          > .title {
            color: #333;
            font-size: 16px;
            font-weight: 700;
            margin: 30px 15px 0;
          }
          .el-form {
            .el-form-item {
              display: inline-block;
              width: 33.3%;
              padding: 15px 15px 5px;
              box-sizing: border-box;
              margin-bottom: 0 !important;
              .el-cascader,
              .el-select,
              .el-date-editor {
                width: 100%;
              }
              .el-date-editor {
                background-color: #f2f2f2;
                border: none;
              }
            }
            .el-form-item.subjects {
              display: block;
              width: 100%;
              .empty {
                margin-top: 40px;
                border-radius: 6px;
                padding: 15px;
                text-align: center;
                color: #ccc;
                background-color: #f7f7f7;
              }
              .el-form-item__label {
                display: block;
                width: 100%;
                text-align: left;
                color: #333;
                font-size: 16px;
                font-weight: 700;
              }
              .el-checkbox-group {
                margin-top: 45px;
                background-color: #fff;
                border-radius: 6px;
                line-height: 35px;
                .check-item {
                  display: block;
                  padding: 10px 15px;
                  background-color: #f2f2f2;
                  margin: 0 0 15px;
                  border-radius: 6px;
                  display: flex;
                  flex-wrap: wrap;
                  .el-checkbox {
                    flex: 1;
                  }
                  .input-wp {
                    font-size: 14px;
                    margin: 0 15px;
                    min-width: 300px;
                    text-align: right;
                    .el-input {
                      border-bottom: 1px solid #3ebb75;
                      width: 80px;
                      vertical-align: bottom;
                      input {
                        text-align: center;
                        height: 35px;
                        padding: 0;
                      }
                      input::-webkit-input-placeholder {
                        font-size: 12px;
                      }
                    }
                    .text {
                      display: inline-block;
                      width: 30px;
                      text-align: center;
                      line-height: 20px;
                      vertical-align: bottom;
                    }
                  }
                  .sub-total {
                    vertical-align: middle;
                    font-size: 14px;
                    line-height: 35px;
                  }
                }
                .check-item:last-child {
                  margin-bottom: 0;
                }
              }
            }
            .el-form-item.upload {
              display: block;
              width: 100%;
              padding: 30px 15px 10px;
              .el-form-item__label {
                display: block;
                width: 100%;
                text-align: left;
                color: #333;
                font-size: 16px;
                font-weight: 700;
              }
            }
            .total {
              padding: 0 15px;
              font-size: 15px;
              color: #333;
              font-weight: 700;
              margin-top: 15px;
              .money {
                font-size: 16px;
                color: #ffc21a;
                font-weight: 700;
                margin-left: 5px;
              }
            }
            .el-form-item.remark-wp {
              display: block;
              width: 100%;
              padding: 0 15px;
              margin-top: 10px;
              .name {
                font-size: 14px;
                color: #666;
                line-height: 20px;
                margin-bottom: 10px;
              }
              .el-textarea {
                textarea {
                  border: none;
                  background-color: #f7f7f7;
                  border-radius: 6px;
                }
              }
            }
          }
          .tip {
            margin-top: 15px;
            font-size: 12px;
            color: #3ebb75;
            padding: 0 15px;
          }
        }
      }
    }
  }

  .decorated {
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        .basic-info {
          margin: 25px 15px 0;
          padding: 20px;
          border-radius: 6px;
          background-color: #f7f7f7;
          display: flex;
          justify-content: space-between;
          .info-item {
            padding: 0 10px;
            box-sizing: border-box;
            .name {
              margin-bottom: 15px;
              font-size: 15px;
              line-height: 24px;
              color: #333;
              text-align: center;
            }
            .value {
              font-size: 14px;
              line-height: 22px;
              color: #999;
              text-align: center;
            }
            .value.green {
              color: #69da61;
            }
            .value.black {
              color: #333;
            }
          }
        }
        .table-wp {
          padding: 0 15px;
          > .title {
            color: #333;
            font-size: 15px;
            font-weight: 700;
            margin: 30px 0 0;
            .label {
              display: inline-block;
              padding: 5px 10px;
              background-color: #d7eed5;
              color: #3ebb75;
              border-radius: 3px;
              font-size: 14px;
              font-weight: 400;
              line-height: 18px;
              cursor: pointer;
              margin-left: 15px;
            }
            .label.active {
              background-color: #3ebb75;
              color: #fff;
            }
          }
          .table-content {
            margin-top: 15px;
            border-radius: 6px;

            .content {
              display: flex;
              justify-content: space-between;
              flex-wrap: nowrap;
              min-height: 50px;
              padding-bottom: 15px;
              .tip {
                text-align: center;
                line-height: 50px;
                width: 100%;
                color: #ccc;
              }
              .td-wp {
                display: flex;
                flex-direction: column;
                padding: 25px 10px;
                min-width: 100px;
                background-color: #f7f7f7;
                box-sizing: border-box;
                .name {
                  font-size: 15px;
                  color: #333;
                  line-height: 20px;
                  height: 40px;
                  margin-bottom: 15px;
                  text-align: center;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  -ms-text-overflow: ellipsis;
                  text-overflow: ellipsis;
                }
                .value {
                  flex: 1;
                  font-size: 14px;
                  color: #999;
                  line-height: 20px;
                  text-align: center;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .value.black {
                  color: #333;
                }
                .value.yellow {
                  color: #ffcb3c;
                }
              }
              .td-wp.desc {
                min-width: 200px;
              }
            }

            .content.file {
              background: #f7f7f7;
              padding-bottom: 0;
              .td-wp {
                .name {
                  height: 22px;
                }
              }
            }
          }
        }
        .table-wp.file {
          .td-wp {
            .value {
              display: block !important;
              > span {
                height: 40px;
                line-height: 40px;
              }
              a {
                line-height: 40px;
              }
            }
          }
        }
        .form-wp {
          padding: 0 15px;
          > .title {
            color: #333;
            font-size: 15px;
            font-weight: 700;
            margin: 30px 0 0;
          }
          .input-item {
            padding: 15px 0 10px;
            .name {
              font-size: 14px;
              color: #666;
              line-height: 20px;
              margin-bottom: 10px;
            }
            .el-textarea {
              textarea {
                border: none;
                background-color: #f7f7f7;
                border-radius: 6px;
              }
            }
          }
        }
        .standard-wp {
          padding: 0 15px;
          > .title {
            color: #333;
            font-size: 15px;
            font-weight: 700;
            margin: 30px 0 0;
          }
          .content {
            margin-top: 15px;
            padding: 15px;
            border-radius: 6px;
            background-color: #f7f7f7;
            display: flex;
            flex-wrap: wrap;
            .info-item {
              min-width: 20%;
              padding: 15px 15px 10px;
              box-sizing: border-box;
              display: flex;
              .name {
                color: #999;
                font-size: 14px;
                line-height: 20px;
                margin-right: 15px;
              }
              .value {
                flex: 1;
                color: #333;
                font-size: 14px;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        .upload {
          display: inline-block;
          margin-right: 100px;
        }
      }
    }
  }
}
</style>
