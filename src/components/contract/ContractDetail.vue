<template>
  <div id="contract-detail">
    <a ref="adom" :href="aurl" target="_blank"></a>
    <!-- 合同详情弹框部分 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDialog"
      title="合同详情"
      width="75%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;" v-loading="isLoading">
        <!-- 合同基本情况 -->
        <div class="basic-info">
          <h3>
            合同基本情况
            <span>未结清</span>
          </h3>
          <div class="content">
            <div class="flex-cnt">
              <div class="flex-item">
                <div class="item">
                  <span class="name">合同编号</span>
                  <span class="value">
                    {{ cntDetail.co_sn ? cntDetail.co_sn : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">合同原始编号</span>
                  <span class="value">
                    {{ cntDetail.old_co_sn ? cntDetail.old_co_sn : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">合同标题</span>
                  <span class="value">
                    {{ cntDetail.co_title ? cntDetail.co_title : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">合同开始日期</span>
                  <span class="value">
                    {{
                      cntDetail.exec_start_time
                        ? cntDetail.exec_start_time
                        : '--'
                    }}
                  </span>
                </div>
              </div>
              <div class="flex-item">
                <div class="item">
                  <span class="name">所属大区</span>
                  <span class="value">
                    {{ cntDetail.area ? cntDetail.area.deptname : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">所属公司</span>
                  <span class="value">
                    {{ cntDetail.co_sn ? cntDetail.co_sn : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">所属项目</span>
                  <el-tooltip
                    v-if="
                      cntDetail.village_arr &&
                        cntDetail.village_arr.join('、').length > 17
                    "
                    effect="dark"
                    :content="
                      cntDetail.village_arr
                        ? cntDetail.village_arr.join('、')
                        : ''
                    "
                    placement="top"
                  >
                    <span class="value">
                      {{
                        cntDetail.village_arr
                          ? cntDetail.village_arr.join('、')
                          : ''
                      }}
                    </span>
                  </el-tooltip>
                  <span v-else class="value">
                    {{
                      cntDetail.village_arr
                        ? cntDetail.village_arr.join('、')
                        : ''
                    }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">合同结束日期</span>
                  <span class="value">
                    {{
                      cntDetail.exec_end_time ? cntDetail.exec_end_time : '--'
                    }}
                  </span>
                </div>
              </div>
              <div class="flex-item">
                <div class="item">
                  <span class="name">经办人</span>
                  <span class="value">
                    {{ cntDetail.cuser ? cntDetail.cuser.realname : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">协办人</span>
                  <span class="value">
                    {{ cntDetail.assist ? cntDetail.assist.realname : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">含税金额</span>
                  <span class="value">
                    {{ cntDetail.co_money ? cntDetail.co_money : '0' }}元
                  </span>
                </div>
              </div>
              <div class="flex-item">
                <div class="item">
                  <span class="name">不含税金额</span>
                  <span class="value">
                    {{
                      cntDetail.conottax_money ? cntDetail.conottax_money : '0'
                    }}元
                  </span>
                </div>
                <div class="item">
                  <span class="name">税率</span>
                  <span class="value">
                    {{ cntDetail.con_rate ? cntDetail.con_rate : '--' }}
                  </span>
                </div>
                <div class="item">
                  <span class="name">税额</span>
                  <span class="value">
                    {{
                      cntDetail.con_tax_amount ? cntDetail.con_tax_amount : '0'
                    }}元
                  </span>
                </div>
              </div>
              <div class="flex-item">
                <div class="item">
                  <span class="name">结算金额</span>
                  <span class="value">
                    {{ cntDetail.co_balance ? cntDetail.co_balance : '0' }}元
                  </span>
                </div>
                <div class="item">
                  <span class="name">已收金额</span>
                  <span class="value">
                    {{
                      cntDetail.received_money ? cntDetail.received_money : '0'
                    }}元
                  </span>
                </div>
                <div class="item">
                  <span class="name">未收金额</span>
                  <span class="value">
                    {{
                      cntDetail.uncollected_money
                        ? cntDetail.uncollected_money
                        : '0'
                    }}元
                  </span>
                </div>
              </div>
            </div>
            <div class="explain">
              <div class="name">情况说明</div>
              <div class="value">
                {{ cntDetail.c_intro ? cntDetail.c_intro : '--' }}
              </div>
            </div>
          </div>
        </div>
        <!-- 供应商信息 -->
        <div class="supplier-info">
          <h3>供应商信息</h3>
          <div class="content">
            <div class="info-item">
              <div class="name">供应商名称</div>
              <div class="value">
                {{ cntDetail.supplier ? cntDetail.supplier.sname : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">开户银行</div>
              <div class="value gray">
                {{ cntDetail.supcard ? cntDetail.supcard.bank : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">银行账户</div>
              <div class="value gray">
                {{ cntDetail.supcard ? cntDetail.supcard.cardnumber : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">联系人姓名</div>
              <div class="value gray">
                {{ cntDetail.uname ? cntDetail.uname : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">联系方式</div>
              <div class="value gray">
                {{ cntDetail.tel ? cntDetail.tel : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">信用编码/省份证号码</div>
              <div class="value">
                {{
                  cntDetail.supplier
                    ? cntDetail.supplier.tax_person_number
                    : '--'
                }}
              </div>
            </div>
          </div>
        </div>
        <!-- 合同审核文件 -->
        <div class="check-files">
          <h3>合同审核文件</h3>
          <div class="content" v-if="auditFiles.length == 0">
            <div class="tip">暂无文件！</div>
          </div>
          <div class="content" v-else>
            <div
              class="file-item"
              v-for="(item, index) in auditFiles"
              :key="index"
              @click="fileClick(item)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.cf_name"
                placement="bottom"
                :open-delay="300"
                v-if="item.cf_name.length > 6"
              >
                <div>
                  <div class="img" v-if="item.cf_name.includes('.pdf')">
                    PDF
                  </div>
                  <div
                    class="img"
                    v-else-if="item.cf_name.includes('.doc')"
                    style="background-color: #5a86e8"
                  >
                    DOC
                  </div>
                  <div class="img" v-else>其他</div>
                  <div class="name">{{ item.cf_name }}</div>
                </div>
              </el-tooltip>
              <div v-else>
                <div class="img" v-if="item.cf_name.includes('.pdf')">PDF</div>
                <div
                  class="img"
                  v-else-if="item.cf_name.includes('.doc')"
                  style="background-color: #5a86e8"
                >
                  DOC
                </div>
                <div class="img" v-else>其他</div>
                <div class="name">{{ item.cf_name }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 合同签署文件 -->
        <div class="signed-files">
          <h3>
            合同签署文件
            <span>合同签署文件盖章后由结算中心上传</span>
          </h3>
          <div class="content" v-if="signeFiles.length === 0">
            <div class="tip">暂无文件！</div>
          </div>

          <div class="content" v-else>
            <div class="info-item">
              <div class="name">文件名称</div>
              <div
                class="value"
                v-for="(item, index) in signeFiles"
                :key="index"
              >
                {{ item.cf_name }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">上传人</div>
              <div
                class="value gray"
                v-for="(item, index) in signeFiles"
                :key="index"
              >
                {{ item.adduser.realname }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">上传时间</div>
              <div
                class="value gray"
                v-for="(item, index) in signeFiles"
                :key="index"
              >
                {{ item.cf_createtime }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">操作</div>
              <a
                :href="item.host_url"
                target="_blank"
                v-for="(item, index) in signeFiles"
                :key="index"
              >
                <el-button type="primary" size="small" round plain>
                  下载
                </el-button>
              </a>
            </div>
          </div>
        </div>
        <!-- 收款计划 -->
        <div class="payment-plan">
          <h3>收款列表</h3>
          <el-button class="refresh" type="primary" round @click="refresh">
            刷新
          </el-button>
          <div class="table-wp">
            <cus-table
              :datas="tableData"
              :cusColums="columns"
              :cusConf="conf"
              @pass="planPass"
              @reject="planReject"
              @detail="showDetail"
              @gathering="showGather"
              @refund="refundMoney"
              @delPlan="delPlan"
              @cancelPlan="cancelPlan"
              @shareDetails="shareDetails"
              @signGather="signGather"
            ></cus-table>
            <div
              v-if="$menu.getters.judgeRole('Btn-6SRWQgTJSb6dBldeM4meBsFg')"
              class="add-wp"
              @click="addPlan"
            >
              <i class="iconfont iconxinzeng"></i>
              添加收款
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 添加收款计划弹框 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      title="添加收款计划"
      width="46%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="计划收款项目" prop="vname">
            <el-cascader
              v-model="addForm.village"
              :options="villageOptions"
              :show-all-levels="false"
              placeholder="请选择收款项目"
              @change="villageChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="计划收款科目" prop="subject">
            <el-select
              v-model="addForm.subject"
              clearable
              filterable
              placeholder="请选择收款科目"
            >
              <el-option
                v-for="itm in subOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划收款金额" prop="money">
            <el-input
              v-model="addForm.money"
              placeholder="请输入收款金额"
            ></el-input>
          </el-form-item>
          <el-form-item label="计划收款次数" prop="number">
            <el-input
              type="number"
              v-model="addForm.number"
              placeholder="请输入收款次数"
            ></el-input>
          </el-form-item>
          <el-form-item label="计划收款日期" prop="dateVal">
            <el-date-picker
              type="date"
              placeholder="选择收款日期"
              v-model="addForm.dateVal"
              style="width: 100%;"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="计划收款周期" prop="cycle">
            <el-select
              v-model="addForm.cycle"
              clearable
              placeholder="请选择收款周期"
            >
              <el-option
                v-for="itm in cycleOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="remark" label="备注信息" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              resize="none"
              v-model="addForm.remark"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="addSubmit">
          确认添加
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

    <!-- 计划收款弹框 -->
    <el-dialog
      class="planDialog"
      :visible.sync="showPlanDialog"
      title="计划收款"
      width="46%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="planForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="项目名称" prop="vname">
            <el-input
              v-model="ruleForm.vname"
              placeholder="请输入项目名称"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="uname">
            <el-input
              v-model="ruleForm.uname"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="收款时间" prop="dateVal">
            <el-date-picker
              type="datetime"
              :disabled="dateDisabled"
              placeholder="选择收款时间"
              v-model="ruleForm.dateVal"
              style="width: 100%;"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="应收金额" prop="ymoney">
            <el-input
              v-model="ruleForm.ymoney"
              placeholder="请输入应收金额"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="实收金额" prop="smoney">
            <el-input
              v-model="ruleForm.smoney"
              placeholder="请输入实收金额"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="收款方式" prop="paymentTerm">
            <el-select
              v-model="ruleForm.paymentTerm"
              clearable
              placeholder="请选择收款方式"
            >
              <el-option
                v-for="itm in payOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否开票" prop="bill">
            <el-select
              v-model="ruleForm.bill"
              clearable
              placeholder="请选择是否开票"
            >
              <el-option
                v-for="itm in billOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收据类型"
            prop="receiptType"
            v-if="receiptType == 3"
          >
            <el-select
              v-model="ruleForm.receiptType"
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
                (receiptType == 3 && ruleForm.receiptType == 2)
            "
          >
            <el-select
              v-model="ruleForm.isPaper"
              placeholder="请选择是否生成纸质收据"
              clearable
            >
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="remark" label="备注信息" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              resize="none"
              v-model="ruleForm.remark"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="submitForm">
          确认收款
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showPlanDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>

    <!-- 计划收款详情弹框 -->
    <el-dialog
      class="infoDialog"
      :visible.sync="showInfoDialog"
      title="计划收款详情"
      width="50%"
      :close-on-click-modal="true"
    >
      <el-scrollbar style="height: 100%;" v-loading="detailLoading">
        <!-- 计划信息 -->
        <div class="plan-info" v-if="planInfo.id">
          <h3>计划信息</h3>
          <div class="content">
            <div class="info-item">
              <div class="name">科目</div>
              <div class="value">
                {{ planInfo.subject ? planInfo.subject.name : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">计划收款时间</div>
              <div class="value gray">
                {{ planInfo.plan_date ? planInfo.plan_date : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">计划收款金额</div>
              <div class="value yellow">
                {{ planInfo.plan_money ? planInfo.plan_money : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">创建人</div>
              <div class="value gray">
                {{ planInfo.creater ? planInfo.creater.realname : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">创建时间</div>
              <div class="value gray">
                {{ planInfo.createtime ? planInfo.createtime : '--' }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">当前状态</div>
              <div class="value green">
                {{
                  planInfo.status == 0
                    ? '未收款'
                    : planInfo.status == 1
                    ? '已收款'
                    : planInfo.status == 2
                    ? '已退款'
                    : ''
                }}
              </div>
            </div>
            <div class="info-item">
              <div class="name">备注</div>
              <div class="value gray">{{ planInfo.bz }}</div>
            </div>
          </div>
        </div>
        <!-- 收款信息 -->
        <div class="charge-info">
          <h3>收款信息</h3>
          <div class="content" v-if="planInfo.sn && planInfo.sn.sn">
            <div class="info-item">
              <div class="name">收款时间</div>
              <div class="value gray">{{ planInfo.sn.pay_time }}</div>
            </div>
            <div class="info-item">
              <div class="name">收款金额</div>
              <div class="value yellow">{{ planInfo.sn.money }}</div>
            </div>
            <div class="info-item">
              <div class="name">订单号</div>
              <div class="value gray">{{ planInfo.sn.sn }}</div>
            </div>
            <div class="info-item">
              <div class="name">操作人</div>
              <div class="value gray">{{ planInfo.sn.creater.realname }}</div>
            </div>
          </div>
          <div class="content" v-else>
            <div class="tip">暂无收款信息！</div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 分摊详情弹框部分 -->
    <el-dialog
      class="shareDialog"
      :visible.sync="showShareDialog"
      title="分摊详情"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="shareTableData"
          :cusColums="shareColumns"
          :cusConf="shareConf"
        ></cus-table>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/assets/contract/js/contractDetail.js"></script>

<style lang="less">
@import url('~@/assets/contract/css/contractDetail.less');
</style>
