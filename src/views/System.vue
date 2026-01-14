<template>
  <el-container id="system">
    <el-header class="top">
      <div class="title">项目列表</div>
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
                  vid: 0
                }
              "
            ></i>
          </span>
          <input
            type="text"
            class="common-input"
            placeholder="请输入项目名称"
            v-model="searchVal"
          />
          <el-button
            type="primary"
            class="common-button"
            icon="el-icon-search"
            @click="keySearch(true)"
          >
            查询
          </el-button>
        </div>
        <div class="common-right">
          <el-button
            type="primary"
            class="common-button"
            plain
            icon="iconfont iconxinzeng"
            @click="$refs.showAddVillage.showDialog()"
            v-if="$menu.getters.judgeRole('Btn-M8WrMI0dq0qhx72WW6IoPJYT')"
          >
            新增项目
          </el-button>
          <span
            v-if="
              $menu.getters.judgeRole('Btn-HNLr4v3QqsAQnJQJCXoR4wWY') ||
                $menu.getters.judgeRole('Btn-atagY0s83JNSgiQq8Mseujzf')
            "
            @click="importData"
          >
            <workIcon
              name="import"
              class="common-right-icon"
              title="导入数据"
            ></workIcon>
          </span>
          <span
            v-if="$menu.getters.judgeRole('Btn-6Y9LM5wV9Vlje4Swz1e4wcov')"
            @click="tempDownload('house')"
          >
            <workIcon
              name="download"
              class="common-right-icon"
              title="下载房源模板"
            ></workIcon>
          </span>
          <span
            v-if="$menu.getters.judgeRole('Btn-8v8xHXu3bhyXtZ6Yq4Npplfz')"
            @click="tempDownload('car')"
          >
            <workIcon
              name="download"
              class="common-right-icon"
              title="下载车位模板"
            ></workIcon>
          </span>
          <el-dropdown trigger="click" :hide-on-click="false">
            <workIcon
              name="filtr"
              class="common-right-icon"
              title="筛选"
            ></workIcon>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in columns" :key="i">
                <el-checkbox v-model="v.show" @change="checkChange">
                  {{ v.label }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="$refs.cusTable.exportExcel()">
            <workIcon
              name="export"
              class="common-right-icon"
              title="导出"
            ></workIcon>
          </span>
          <span
            class="print"
            @click="printHandle"
            v-print="{ id: '#tablePrint', popTitle: '项目设置列表' }"
          >
            <workIcon
              name="print"
              class="common-right-icon"
              title="打印"
            ></workIcon>
          </span>
        </div>
      </div>
    </el-header>
    <el-main class="body">
      <div class="content">
        <cus-table
          ref="cusTable"
          title="项目配置信息"
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          :check="false"
          @sizeChange="tablePageSize"
          @currentChange="tableChosePage"
          @setVal="tableSetVal"
          @edit="clickEditCol"
          @showQrcode="showQrcode"
        ></cus-table>
      </div>
    </el-main>
    <div class="dialog-page">
      <!-- 选择项目 -->
      <filter-village
        ref="showFilterVillage"
        :vid="choseVillageInfo.vid"
        @choseInfo="filterVillage"
      ></filter-village>
      <!-- 选择项目 -->

      <!-- 新增项目 -->
      <addVillage ref="showAddVillage" @addSuc="tableLoad"></addVillage>
      <!-- 新增项目 -->

      <!-- 项目人员设置 -->
      <editVillage
        :qiniuDatas="qiniuDatas"
        ref="showEditVillage"
        @editSuc="tableLoad"
      ></editVillage>
      <!-- 项目人员设置 -->

      <!-- 二维码弹框 -->
      <el-dialog
        class="qrcodeDialog"
        :visible.sync="showQrcodeDialog"
        title="机动车续费二维码"
        width="30%"
        :close-on-click-modal="true"
      >
        <div v-if="showQrcodeDialog && qrSrc" id="qrcode">
          <img :src="qrSrc" alt="" />
        </div>
        <div v-else style="color: #ccc;margin-top: 2.5rem;">
          正在生成二维码，请稍等
        </div>

        <span slot="footer">
          <el-button
            type="primary"
            round
            @click="saveImage"
          >
            保存图片
          </el-button>
          <el-button
            type="info"
            round
            @click="showQrcodeDialog = false"
          >
            取消
          </el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 打印内容部分 -->
    <div id="tablePrint" v-show="showPrint">
      <table>
        <thead style="display: table-header-group; font-weight: bold">
          <tr>
            <th>小区ID</th>
            <th>大区</th>
            <th>城市</th>
            <th>项目</th>
            <th>税率</th>
            <th>微信缴费</th>
            <th>支付宝缴费</th>
            <th>开具收据</th>
            <th>开具发票</th>
            <th>催费单</th>
            <th>催收短信</th>
            <th>月租车位按自然月</th>
            <th>项目经理</th>
            <th>客户经理</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.vid }}</td>
            <td>{{ item.bigareaname }}</td>
            <td>{{ item.cname }}</td>
            <td>{{ item.villagename }}</td>
            <td>{{ item.sl }}</td>
            <td>{{ item.is_wechat_pay === 1 ? '开' : '关' }}</td>
            <td>{{ item.is_alipay === 1 ? '开' : '关' }}</td>
            <td>{{ item.is_print_receipts === 1 ? '开' : '关' }}</td>
            <td>{{ item.billstatus === 1 ? '开' : '关' }}</td>
            <td>{{ item.is_print_reminder === 1 ? '开' : '关' }}</td>
            <td>{{ item.is_send_msg === 1 ? '开' : '关' }}</td>
            <td>{{ item.pay_car_by_day === 1 ? '开' : '关' }}</td>
            <td>{{ item.project_manager_name }}</td>
            <td>{{ item.customer_manager_name }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!tableData.length" class="table-empty">
        <span>暂无数据!</span>
      </div>
    </div>

    <!-- 导入数据弹框部分 -->
    <el-dialog
      class="importDialog"
      :visible.sync="showImportDialog"
      title="导入数据"
      width="36%"
      :close-on-click-modal="false"
      @close="showImportDialog = false"
    >
      <el-scrollbar style="height: 100%;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :hide-required-asterisk="true"
        >
          <el-form-item label="所属大区" prop="areaVal">
            <el-select
              v-model="ruleForm.areaVal"
              clearable
              placeholder="请选择所属大区"
              @change="getCompanyData"
            >
              <el-option
                v-for="itm in areaOptions"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司" prop="companyVal">
            <el-select
              v-model="ruleForm.companyVal"
              clearable
              placeholder="请选择所属公司"
              @change="getVillageData"
            >
              <el-option
                v-for="itm in companyOptions"
                :key="itm.deptid"
                :label="itm.deptname"
                :value="itm.deptid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目" prop="village">
            <el-select
              v-model="ruleForm.village"
              clearable
              placeholder="请选择所属项目"
            >
              <el-option
                v-for="itm in villOptions"
                :key="itm.vid"
                :label="itm.villagename"
                :value="itm.vid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导入类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择导入类型">
              <el-option
                v-if="$menu.getters.judgeRole('Btn-HNLr4v3QqsAQnJQJCXoR4wWY')"
                label="房源导入"
                :value="1"
              ></el-option>
              <el-option
                v-if="$menu.getters.judgeRole('Btn-atagY0s83JNSgiQq8Mseujzf')"
                label="车位导入"
                :value="2"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="file" label="上传文件" prop="fileInfo">
            <el-upload
              ref="upload"
              :limit="1"
              action="/village/importroomsbyexcel"
              accept=".xlsx"
              :http-request="customUpload"
              :on-remove="handleRemove"
            >
              <el-button type="primary empty">
                点击上传
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="isCommit"
          type="primary"
          round
          @click="importSubmit"
        >
          提交保存
        </el-button>
        <el-button
          :loading="isCommit"
          type="info"
          round
          @click="showImportDialog = false"
        >
          取消
        </el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script src="@/assets/system/js/index.js"></script>

<style lang="less">
@import url('~@/assets/system/css/index.less');
</style>
