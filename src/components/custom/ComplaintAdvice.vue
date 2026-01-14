<template>
  <div id="complaint-advice">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <workIcon name="build"></workIcon>
            {{ choseVillageInfo.name }}
            <i
              v-if="choseVillageInfo.vid"
              class="close el-icon-circle-close"
              @click.stop="
                choseVillageInfo = {
                  name: '全部项目',
                  vid: ''
                }
                keySearch()
              "
            ></i>
          </span>
          <input
            type="text"
            class="common-input"
            placeholder="请输入投诉建议单号"
            v-model="searchVal"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch()"
          >
            查询
          </el-button>
        </div>
        <div class="common-right">
          <el-button
            v-if="$menu.getters.judgeRole('Btn-R7AFa88XmCPvBr9dm7YDvuHa')"
            type="primary"
            round
            plain
            icon="iconfont iconxinzeng"
            @click="newReport"
          >
            新增投诉建议
          </el-button>
        </div>
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="typeVal"
          clearable
          placeholder="请选择投诉类型"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in typeOptions"
            :key="itm.id"
            :label="itm.typename"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="statusVal"
          clearable
          placeholder="请选择业务状态"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in statusOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="startTime"
          type="date"
          :picker-options="spickerOptions"
          placeholder="请选择开始日期"
          value-format="timestamp"
          @change="tableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="epickerOptions"
          placeholder="请选择截止日期"
          value-format="timestamp"
          @change="tableLoad"
        ></el-date-picker>

        <el-button type="primary empty" round @click="exportDetailExcel">
          导出Excel
        </el-button>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @detail="showDetail"
          @orderClose="orderClose"
        ></cus-table>
      </div>
    </div>

    <!-- 选择项目 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>

    <!-- 新增弹框部分 -->
    <el-dialog
      class="addDialog"
      :visible.sync="showAddDialog"
      title="新增投诉建议"
      width="36%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;">
        <!-- 搜索部分 -->
        <div class="search-wp">
          <el-autocomplete
            ref="searchInput"
            class="advice-search"
            popper-class="my-autocomplete"
            v-model="autoValue"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入业主姓名、手机号"
            @select="handleSelect"
          >
            <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="tr-item">
                <span class="td-item">{{ item.realname }}</span>
                <span class="td-item">{{ item.tel }}</span>
                <span class="td-item">{{ item.roomnum }}</span>
              </div>
              <div class="load-more" v-if="allUserList.length <= 1">
                暂无数据！
              </div>
            </template>
          </el-autocomplete>
        </div>

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="投诉类型" prop="type">
            <el-select
              v-model="ruleForm.type"
              clearable
              placeholder="请选择投诉类型"
            >
              <el-option
                v-for="itm in typeOptions"
                :key="itm.id"
                :label="itm.typename"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名" prop="uname">
            <el-input
              v-model="ruleForm.uname"
              placeholder="请输入业主姓名"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="业主电话" prop="tel">
            <el-input
              v-model="ruleForm.tel"
              placeholder="请输入业主电话"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="业主房号" prop="room">
            <el-input
              v-model="ruleForm.room"
              placeholder="请输入业主房号"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item class="remark" label="情况描述" prop="desc">
            <el-input
              type="textarea"
              v-model="ruleForm.desc"
              resize="none"
              :rows="3"
              placeholder="请输入具体情况描述"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button :loading="isCommit" type="primary" round @click="formSubmit">
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

    <!-- 详情弹框部分 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      title="处理详情"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-scrollbar style="height: 100%;" v-loading="isLoading">
        <div class="main-content" v-if="!isLoading">
          <!-- 单号信息部分 -->
          <div class="title">单号：{{ detailObj.id }}</div>
          <div class="order-content">
            <div class="order-item">
              <div class="info">
                <span class="name">业主姓名</span>
                <span class="value">{{ detailObj.name }}</span>
              </div>
              <div class="info">
                <span class="name">业主电话</span>
                <span class="value">{{ detailObj.tel }}</span>
              </div>
              <div class="info">
                <span class="name">业主房号</span>
                <span class="value">{{ detailObj.room }}</span>
              </div>
            </div>
            <div class="order-item">
              <div class="info">
                <span class="name">事件类型</span>
                <span class="value">
                  {{ detailObj.type ? detailObj.type.typename : '' }}
                </span>
              </div>
              <div class="info">
                <span class="name">提交时间</span>
                <span class="value">{{ detailObj.create_time }}</span>
              </div>
              <div class="info">
                <span class="name">业务状态</span>
                <span
                  class="value"
                  v-if="detailObj.status == 0"
                  style="color: #ffc21a;"
                >
                  待接单
                </span>
                <span
                  class="value"
                  v-else-if="detailObj.status == 1"
                  style="color: #3ebb75;"
                >
                  已处理
                </span>
                <span
                  class="value"
                  v-else-if="detailObj.status == 2"
                  style="color: #ffc21a;"
                >
                  处理中
                </span>
                <span
                  class="value"
                  v-else-if="detailObj.status == 3"
                  style="color: #ffc21a;"
                >
                  已接单
                </span>
                <span
                  class="value"
                  v-else-if="detailObj.status == 4"
                  style="color: #3ebb75;"
                >
                  已回访
                </span>
                <span
                  class="value"
                  v-else-if="detailObj.status == 5"
                  style="color: #ff6d6d;"
                >
                  已超期
                </span>
              </div>
            </div>
            <div class="order-item desc">
              <div class="info">
                <span class="name">情况描述</span>
                <span class="value">
                  {{ detailObj.repaircon }}
                </span>
              </div>
            </div>
          </div>

          <!-- 派单情况信息部分 -->
          <div
            class="order-wp"
            v-if="detailObj.handle_info && detailObj.handle_info.creater"
          >
            <div class="title">
              派单情况
            </div>
            <div class="so-content">
              <div class="order-item">
                <div class="info">
                  <span class="name">派单人员</span>
                  <span class="value">
                    {{
                      detailObj.handle_info ? detailObj.handle_info.creater : ''
                    }}
                  </span>
                </div>
                <div class="info">
                  <span class="name">处理人员</span>
                  <span class="value">
                    {{
                      detailObj.handle_info ? detailObj.handle_info.creater : ''
                    }}
                  </span>
                </div>
              </div>
              <div class="order-item so">
                <div class="info">
                  <span class="name">派单要求</span>
                  <span class="value">
                    {{
                      detailObj.handle_info
                        ? detailObj.handle_info.dealrequirement
                        : ''
                    }}
                  </span>
                </div>
                <div class="info">
                  <span class="name">派单时间</span>
                  <span class="value">
                    {{
                      detailObj.handle_info
                        ? detailObj.handle_info.dispatchtime
                        : ''
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 处理跟进记录部分 -->
          <div class="record-wp" v-if="detailObj.hasRecord">
            <div class="title record" @click="showRecord = !showRecord">
              处理跟进记录
              <i class="el-icon-caret-bottom" v-if="!showRecord"></i>
              <i class="el-icon-caret-top" v-else></i>
            </div>
            <div class="records" v-if="showRecord">
              <!-- <div class="tip" v-if="!detailObj.hasRecord">暂无任何记录！</div> -->

              <!-- 处理记录 -->
              <div
                class="record-content"
                v-if="detailObj.list.chuli && detailObj.list.chuli.length > 0"
              >
                <div class="title">处理记录</div>
                <div
                  class="content"
                  v-for="item in detailObj.list.chuli"
                  :key="item.id"
                >
                  <div class="info-left">
                    <div class="info">
                      <span class="name">处理人</span>
                      <span class="value">{{ item.handleUser.realname }}</span>
                    </div>
                    <div class="info">
                      <span class="name">处理时间</span>
                      <span class="value">{{ item.ctime }}</span>
                    </div>
                    <div class="info">
                      <span class="name">相关附件</span>
                      <span
                        class="value"
                        v-if="item.file && item.file.length > 0"
                      >
                        <img
                          :src="itm"
                          alt=""
                          v-for="(itm, index) in item.file"
                          :key="index"
                          @click="imgPreview(itm)"
                        />
                      </span>
                    </div>
                  </div>
                  <div class="info-right">
                    <div class="info">
                      <span class="name">处理结果</span>
                      <span class="value">
                        {{ item.content }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 跟进记录 -->
              <div
                class="record-content"
                v-if="detailObj.list.genjin && detailObj.list.genjin.length > 0"
              >
                <div class="title">跟进记录</div>
                <div
                  class="content"
                  v-for="item in detailObj.list.genjin"
                  :key="item.id"
                >
                  <div class="info-left">
                    <div class="info">
                      <span class="name">跟进人</span>
                      <span class="value">{{ item.handleUser.realname }}</span>
                    </div>
                    <div class="info">
                      <span class="name">跟进时间</span>
                      <span class="value">{{ item.ctime }}</span>
                    </div>
                    <div class="info">
                      <span class="name">相关附件</span>
                      <span
                        class="value"
                        v-if="item.file && item.file.length > 0"
                      >
                        <img
                          :src="itm"
                          alt=""
                          v-for="(itm, index) in item.file"
                          :key="index"
                          @click="imgPreview(itm)"
                        />
                      </span>
                    </div>
                  </div>
                  <div class="info-right">
                    <div class="info">
                      <span class="name">跟进备注</span>
                      <span class="value">
                        {{ item.content }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回访记录 -->
              <div
                class="record-content"
                v-if="
                  detailObj.list.huifang && detailObj.list.huifang.length > 0
                "
              >
                <div class="title">回访记录</div>
                <div
                  class="content"
                  v-for="item in detailObj.list.huifang"
                  :key="item.id"
                >
                  <div class="info-left">
                    <div class="info">
                      <span class="name">回访人</span>
                      <span class="value">{{ item.handleUser.realname }}</span>
                    </div>
                    <div class="info">
                      <span class="name">回访时间</span>
                      <span class="value">{{ item.ctime }}</span>
                    </div>
                    <div class="info">
                      <span class="name">相关附件</span>
                      <span
                        class="value"
                        v-if="item.file && item.file.length > 0"
                      >
                        <img
                          :src="itm"
                          alt=""
                          v-for="(itm, index) in item.file"
                          :key="index"
                          @click="imgPreview(itm)"
                        />
                      </span>
                    </div>
                  </div>
                  <div class="info-right">
                    <div class="info">
                      <span class="name">回访备注</span>
                      <span class="value">
                        {{ item.content }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 业主评价部分 -->
          <div
            class="evaluate-wp"
            v-if="detailObj.score || detailObj.evaluate_content"
          >
            <div class="title">
              业主评价
              <el-rate
                v-model="detailObj.score"
                disabled
                show-score
                text-color="#ff9900"
              ></el-rate>
            </div>
            <el-input
              type="textarea"
              v-model="detailObj.evaluate_content"
              resize="none"
              :rows="3"
              readonly
              placeholder="暂无评价内容"
            ></el-input>
          </div>

          <!-- 进行派单处理部分 -->
          <div
            class="handle-wp"
            v-if="
              detailObj.dispatch_auth == 1 &&
                (detailObj.status == 0 || detailObj.status == 3)
            "
          >
            <div class="head">选择处理人</div>
            <el-select v-model="userVal" filterable placeholder="请选择处理人">
              <el-option
                v-for="item in userOptions"
                :key="item.uid"
                :label="item.posname + '-' + item.realname"
                :value="item.uid"
              ></el-option>
            </el-select>
            <div class="head">派单要求</div>
            <el-input
              class="content"
              type="textarea"
              v-model="content"
              resize="none"
              :rows="3"
              placeholder="请输入派单要求"
            ></el-input>
            <div class="btn-wp">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-8JkLnO6FRvzCkldVmgwdcpdZ')"
                :loading="isCommit"
                type="primary"
                round
                @click="sendOrders"
              >
                去派单
              </el-button>
            </div>
          </div>

          <!-- 进行改派处理部分 -->
          <div
            class="handle-wp"
            v-if="
              detailObj.reassignment_auth == 1 &&
                (detailObj.status == 2 || detailObj.status == 3)
            "
          >
            <div class="head">选择改派人</div>
            <el-select
              v-model="reassign"
              filterable
              remote
              placeholder="输入姓名、电话号搜索"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in reassignOptions"
                :key="item.uid"
                :label="item.deptname + '-' + item.realname"
                :value="item.uid"
              ></el-option>
            </el-select>
            <div class="btn-wp">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-bi50QaMjbVrlBxVUyE1bkEcu')"
                :loading="isCommit"
                type="primary"
                round
                @click="reassignOrder"
              >
                改派订单
              </el-button>
            </div>
          </div>

          <!-- 订单回访处理部分 -->
          <div
            class="handle-wp"
            v-if="detailObj.returnvisit_auth == 1 && detailObj.status == 1"
          >
            <div class="head">是否满意</div>
            <el-select
              v-model="isSatisfa"
              clearable
              placeholder="请选择默认状态"
              @change="tableLoad"
            >
              <el-option
                v-for="itm in satisfaOptions"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
              ></el-option>
            </el-select>
            <div class="head">回访结果</div>
            <el-input
              class="content"
              type="textarea"
              v-model="content"
              resize="none"
              :rows="3"
              placeholder="请输入回访结果"
            ></el-input>
            <div class="btn-wp">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-BOMEs53mDPDPM1Y0bs4HxEkc')"
                :loading="isCommit"
                type="primary"
                round
                @click="returnVisit"
              >
                确认回访
              </el-button>
            </div>
          </div>

          <!-- 订单完成处理 -->
          <div
            class="handle-wp"
            v-if="
              detailObj.handle_auth == 1 &&
                (detailObj.status == 2 || detailObj.status == 3)
            "
          >
            <div class="file-upload">
              <div class="head">上传附件</div>
              <el-upload
                ref="upload"
                :action="qiniuDatas.domain"
                list-type="picture-card"
                :file-list="fileList"
                :http-request="customUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog
                class="imgPreview"
                :visible.sync="dialogVisible"
                :append-to-body="true"
              >
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </div>
            <div class="head">处理结果</div>
            <el-input
              class="content"
              type="textarea"
              v-model="content"
              resize="none"
              :rows="3"
              placeholder="请输入处理结果"
            ></el-input>
            <div class="btn-wp">
              <el-button
                v-if="$menu.getters.judgeRole('Btn-Qwe5Kskc2SRgKobL9dzGuLEk')"
                :loading="isCommit"
                type="primary"
                round
                @click="handleFinish"
              >
                完成处理
              </el-button>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 图片预览部分 -->
    <el-image
      ref="preview"
      :src="imgSrc"
      :preview-src-list="imgList"
      :z-index="10000"
    ></el-image>
  </div>
</template>

<script src="@/assets/custom/js/complaintAdvice.js"></script>

<style lang="less">
@import url('~@/assets/custom/css/complaintAdvice.less');
</style>
