<template>
  <div id="file-manage">
    <div class="top">
      <div class="main">
        <div class="common-left">
          <span
            class="common-chose-info"
            @click="$refs.showFilterVillage.showDialog()"
          >
            <i class="iconfont icondaqu"></i>
            {{ choseVillageInfo.name }}
          </span>
          <input
            type="text"
            class="common-input"
            placeholder="输入资源或客户查询"
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
      </div>
    </div>

    <div class="main-wp">
      <div class="select-wp">
        <el-select
          v-model="typeVal"
          clearable
          placeholder="请选择操作类型"
          @change="tableLoad"
        >
          <el-option
            v-for="itm in typeOptions"
            :key="itm.id"
            :label="itm.name"
            :value="itm.id"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="startTime"
          type="date"
          :picker-options="spickerOptions"
          placeholder="请选择开始日期"
          @change="tableLoad"
        ></el-date-picker>
        ~
        <el-date-picker
          v-model="endTime"
          type="date"
          :picker-options="epickerOptions"
          placeholder="请选择结束日期"
          @change="tableLoad"
        ></el-date-picker>
      </div>
      <div class="table-wp">
        <cus-table
          :datas="tableData"
          :cusColums="columns"
          :cusConf="conf"
          :ispaging="true"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
          @preview="filePreview"
          @detail="fileDetail"
        ></cus-table>
      </div>
    </div>

    <!-- 文件下载 -->
    <a ref="adom" :href="furl" v-show="false" target="_blank"></a>

    <!-- 图片预览 -->
    <el-image
      ref="preview"
      v-show="false"
      style="width: 100px; height: 100px"
      :src="furl"
      :preview-src-list="imgList"
    ></el-image>

    <!-- 详情弹框 -->
    <el-dialog
      class="detailDialog"
      :visible.sync="showDetailDialog"
      :title="title"
      width="60%"
      :close-on-click-modal="false"
    >
      <div
        class="dialog-wp"
        style="height: 100%;"
        v-loading="isLoading"
        element-loading-text="数据加载中"
      >
        <!-- 欠费详情 -->
        <div
          class="charge-record"
          v-if="
            currentObj.type == 'op_transfer' || currentObj.type == 'op_delete'
          "
        >
          <div class="table-wp">
            <cus-table
              :datas="arreTableData"
              :cusColums="arreColumns"
              :cusConf="arreConf"
            ></cus-table>
          </div>
        </div>

        <!-- 订单详情 -->
        <el-scrollbar
          style="height: 100%;"
          v-else-if="
            currentObj.type == 'free_order' || currentObj.type == 'renovation'
          "
        >
          <div class="order-table">
            <cus-table
              :datas="fitmentTableData"
              :cusColums="fitmentColumns"
              :cusConf="fitmentConf"
              v-if="currentObj.type == 'renovation'"
            ></cus-table>
            <cus-table
              :datas="orderTableData"
              :cusColums="orderColumns"
              :cusConf="orderConf"
              v-else
            ></cus-table>
          </div>
          <div class="bt-wp" v-if="currentObj.type == 'free_order'">
            <div class="total">
              费用合计：
              <span class="name">实收</span>
              <span class="value">{{ realityMoney }}元</span>
              <span class="name">应收</span>
              <span class="value ys">{{ receivableMoney }}元</span>
            </div>
            <div class="remark">
              <div class="content">
                <span class="name">订单备注：</span>
                <p>
                  {{ orderRemark }}
                </p>
              </div>
            </div>
          </div>

          <div class="order-table table2">
            <div class="title">缴费明细</div>
            <cus-table
              :datas="infoTableData"
              :cusColums="infoColumns"
              :cusConf="infoConf"
            ></cus-table>
          </div>
        </el-scrollbar>

        <!-- 车位启用详情 -->
        <div
          class="stall-detail"
          v-else-if="currentObj.type == 'car' && stallObj.id"
        >
          <div style="height: 100%;position:relative;">
            <el-scrollbar style="height: 100%;">
              <div class="info-content">
                <div class="top-wp">
                  <div class="title">
                    <i class="iconfont iconcheku"></i>
                    <span>车位信息</span>
                  </div>
                  <div class="info-ct" style="height: '7.3rem'">
                    <el-scrollbar style="width: 100%;height: 100%">
                      <div class="info-wp">
                        <ul>
                          <li>
                            <span class="name">车主姓名</span>
                            <span class="value">
                              {{
                                stallObj.owner && stallObj.owner.realname
                                  ? stallObj.owner.realname
                                  : '--'
                              }}
                            </span>
                          </li>
                          <li>
                            <span class="name">车位名称</span>
                            <span class="value">
                              {{ stallObj.sort ? stallObj.sort : '--' }}
                            </span>
                          </li>
                          <li>
                            <span class="name">截止日期</span>
                            <span class="value">
                              {{ stallObj.endtime ? stallObj.endtime : '--' }}
                            </span>
                          </li>
                          <li>
                            <span class="name">启用日期</span>
                            <span class="value">
                              {{
                                stallObj.starttime ? stallObj.starttime : '--'
                              }}
                            </span>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <span class="name">联系电话</span>
                            <span class="value">
                              {{
                                stallObj.owner && stallObj.owner.tel
                                  ? stallObj.owner.tel
                                  : '--'
                              }}
                            </span>
                          </li>
                          <li>
                            <span class="name">资源类型</span>
                            <span class="value">
                              {{
                                stallObj.resourcestype.name
                                  ? stallObj.resourcestype.name
                                  : '--'
                              }}
                            </span>
                          </li>
                          <li>
                            <span class="name">使用周期</span>
                            <span class="value">
                              {{
                                stallObj.starttime && stallObj.endtime
                                  ? stallObj.starttime + '-' + stallObj.endtime
                                  : '--'
                              }}
                            </span>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <span class="name">使用类型</span>
                            <span class="value">购买</span>
                          </li>
                          <li>
                            <span class="name">车位面积</span>
                            <span class="value">
                              {{ stallObj.area ? stallObj.area : '--' }}
                            </span>
                          </li>
                          <li>
                            <span class="name">下发电话</span>
                            <span class="value">
                              {{
                                stallObj.cartel
                                  ? stallObj.cartel.tel +
                                    (stallObj.cartel.num > 0
                                      ? `(${stallObj.cartel.num})`
                                      : '')
                                  : '--'
                              }}
                            </span>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <span class="name">收费科目</span>
                            <span class="value">
                              {{
                                stallObj.subject_arr.length > 0
                                  ? stallObj.subject_arr
                                      .map(item => item.name)
                                      .join('/')
                                  : ''
                              }}
                            </span>
                          </li>
                          <li>
                            <span class="name">每月费用</span>
                            <span class="value">
                              {{
                                stallObj.subject_arr.length > 0
                                  ? stallObj.subject_arr
                                      .map(item => item.money + '元')
                                      .join('/')
                                  : ''
                              }}
                            </span>
                          </li>
                          <li>
                            <span class="name">所属车场</span>
                            <span class="value">
                              {{
                                stallObj.subject_arr.length > 0
                                  ? stallObj.subject_arr
                                      .map(item => item.carpark_name)
                                      .join('/')
                                  : ''
                              }}
                            </span>
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
                    v-model="stallObj.remark"
                  ></el-input>
                </div>
                <div class="bottom-wp">
                  <div class="table-wp">
                    <div class="title">绑定车牌信息</div>
                    <div class="table-content">
                      <cus-table
                        ref="cusTable"
                        title="绑定车牌信息"
                        :datas="stallTableData"
                        :cusColums="stallColumns"
                        :cusConf="stallConf"
                      ></cus-table>
                    </div>
                  </div>
                  <div class="table-wp">
                    <div class="title">绑定非机动车信息</div>
                    <div class="table-content">
                      <cus-table
                        ref="cusTable"
                        title="绑定非机动车信息"
                        :datas="nocarTableData"
                        :cusColums="nocarColumns"
                        :cusConf="nocarConf"
                      ></cus-table>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 附件详情弹框 -->
    <el-dialog
      class="fileDialog"
      :visible.sync="showFileDialog"
      title="附件详情"
      width="45%"
      :close-on-click-modal="false"
    >
      <div class="table-wp">
        <cus-table
          :datas="fileTableData"
          :cusColums="fileColumns"
          :cusConf="fileConf"
          @preview="fpreview"
          @download="fdownload"
        ></cus-table>
      </div>
    </el-dialog>

    <!-- 选择项目组件部分 -->
    <filter-village
      ref="showFilterVillage"
      :vid="choseVillageInfo.vid"
      @choseInfo="filterVillage"
    ></filter-village>
  </div>
</template>

<script src="@/assets/charge/js/fileManage.js"></script>

<style lang="less">
@import url('~@/assets/charge/css/fileManage.less');
</style>
