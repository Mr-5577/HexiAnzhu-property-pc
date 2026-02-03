<template>
  <div id="CusTable">
    <!-- 不分页表格 -->
    <el-table
      ref="nopageTab"
      v-if="!ispaging"
      :data="datas"
      stripe
      :show-summary="issummary"
      v-loading="cusConf.loadStatus"
      element-loading-text="数据获取中..."
      :row-class-name="rowClassName"
      :empty-text="cusConf.emptyText ? cusConf.emptyText : tableConf.emptyText"
      v-scroll-event="listenScroll"
      v-scroll-end="endScroll"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="check"
        type="selection"
        width="75"
      ></el-table-column>
      <el-table-column
        :label="v.label"
        :width="v.width"
        :show-overflow-tooltip="!v.type || v.type === 'text'"
        v-for="(v, i) in tableShowColums"
        :key="i"
        v-show="v.show"
        :fixed="v.fixed"
      >
        <template slot-scope="scope">
          <!-- checkbox开启/关闭 -->
          <div v-if="v.type === 'checkbox'">
            <div v-if="!scope['row'][v.hide]">
              <el-switch
                :value="String(scope['row'][v.prop])"
                active-value="1"
                inactive-value="0"
                @change="setCheckbox(scope, v.prop, v.action)"
                :disabled="
                  scope['row'][v.disabled] ||
                    (!$menu.getters.judgeRole(v.token) && v.token != 'empty')
                "
                v-if="scope['row'][v.prop] != null"
              ></el-switch>
              <el-tooltip
                class="item"
                effect="dark"
                content="无法设置,请联系信息技术部"
                placement="top"
                :open-delay="150"
                v-else
              >
                <el-switch :value="false" disabled></el-switch>
              </el-tooltip>
            </div>
          </div>

          <!-- 按钮操作 -->
          <div v-else-if="v.type === 'button'" style="min-height: 1.9rem;">
            <span class="btn" v-for="(bv, bi) in v.btns" :key="bi">
              <el-button
                v-if="
                  !scope['row'][bv.hide] &&
                    ($menu.getters.judgeRole(bv.token) || bv.token == 'empty')
                "
                :type="bv.type"
                :size="bv.size ? bv.size : 'mini'"
                :round="bv.round"
                :class="bv.class"
                :disabled="scope['row'][bv.disabled]"
                plain
                @click="clickBtn(scope, bv.action)"
                :style="{ width: bv.name.length > 2 ? '4rem' : '3rem' }"
              >
                {{ bv.name }}
              </el-button>
            </span>
          </div>

          <!-- 图标 操作 -->
          <div v-else-if="v.type === 'icon'">
            <div class="icon-wp" v-if="!scope['row'][v.hide]">
              <img
                v-if="v.icon === 'detail' && v.token"
                src="@/assets/common/img/detail.png"
                @click="clickBtn(scope, v.action)"
              />
              <img
                v-else-if="v.icon === 'account' && v.token"
                src="@/assets/common/img/account.png"
                @click="clickBtn(scope, v.action)"
              />
              <img
                v-else-if="v.icon === 'print' && v.token"
                src="@/assets/common/img/print.png"
                @click="clickBtn(scope, v.action)"
              />
              <img
                v-else-if="v.icon === 'car' && v.token"
                src="@/assets/common/img/car.png"
                @click="clickBtn(scope, v.action)"
              />
              <a
                :href="
                  scope['row'][v.prop]
                    ? scope['row'][v.prop]
                    : 'javascript:void(0);'
                "
                :class="[scope['row'][v.prop] ? 'active' : '']"
                :target="scope['row'][v.prop] ? '_blank' : '_self'"
                v-else-if="v.icon === 'eye' && v.token"
              >
                <i class="icon iconfont icona-lujing434"></i>
              </a>
              <i
                v-else-if="v.token"
                :class="['icon iconfont', v.icon]"
                @click="clickBtn(scope, v.action)"
              ></i>
            </div>
          </div>

          <!-- 文本/数字修改 操作 -->
          <div class="edit" v-else-if="v.type === 'input'">
            <el-input
              :type="v.inputType ? v.inputType : 'text'"
              :disabled="
                v.token != 'empty' && !$menu.getters.judgeRole(v.token)
              "
              v-model="scope['row'][v.prop]"
              @change="textChange($event, scope, v.action)"
            ></el-input>
          </div>

          <!-- 选择日期操作 -->
          <div class="date-wp" v-else-if="v.type === 'date'">
            <el-date-picker
              v-if="v.old_time"
              v-model="scope['row'][v.prop]"
              :type="v.dateType"
              :clearable="false"
              placeholder="选择日期"
              value-format="timestamp"
              prefix-icon=""
              :pickerOptions="pickerOptions(scope['row'][v.old_time])"
            ></el-date-picker>
            <el-date-picker
              v-else
              v-model="scope['row'][v.prop]"
              :type="v.dateType"
              :clearable="false"
              placeholder="选择日期"
              prefix-icon=""
            ></el-date-picker>
          </div>

          <!-- 下拉菜单部分 -->
          <div class="dropdown-wp" v-else-if="v.type === 'dropdown'">
            <el-dropdown
              trigger="click"
              placement="bottom"
              @command="dropClick($event, v.items, scope.row)"
              v-if="!scope['row'][v.hide]"
            >
              <span class="el-dropdown-link">
                <img
                  src="@/assets/common/img/more.png"
                  alt=""
                  style="cursor: pointer;height: 1.4rem;vertical-align: middle;"
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="item.id"
                  v-for="item in v.items"
                  :key="item.id"
                >
                  <div
                    v-if="
                      (item.token == 'empty' ||
                        $menu.getters.judgeRole(item.token)) &&
                        !scope['row'][item.hide]
                    "
                  >
                    {{ item.name }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <!-- 表格图片 -->
          <div class="img" v-else-if="v.type === 'img'">
            <!-- <img
              v-if="scope['row'][v.prop]"
              :src="scope['row'][v.prop]"
              @click="imgPreview(scope['row'])"
            />
            <i
              v-else
              class="el-icon-picture-outline"
              style="font-size: 1.1rem;color: #ccc!important;vertical-align: middle!important;"
            ></i> -->
            <!-- 单张图片的情况（向后兼容） -->
            <template v-if="!Array.isArray(scope['row'][v.prop])">
              <img
                v-if="scope['row'][v.prop]"
                :src="scope['row'][v.prop]"
                @click="imgPreview(scope['row'])"
              />
              <i
                v-else
                class="el-icon-picture-outline"
                style="font-size: 1.1rem;color: #ccc!important;vertical-align: middle!important;"
              ></i>
            </template>
            
            <!-- 多张图片的情况（新增） -->
            <template v-else>
              <div class="multi-img-wrapper">
                <img
                  v-for="(imgUrl, imgIndex) in scope['row'][v.prop]"
                  :key="imgIndex"
                  :src="imgUrl"
                  @click="imgPreview(scope['row'], imgIndex)"
                  style="width: 30px;height: 30px;margin-right: 5px;cursor: pointer;"
                />
              </div>
            </template>
          </div>

          <div class="num-select" v-else-if="v.type === 'numSelect'">
            <span @click="villageSelect(scope, v.action)">
              {{ scope['row'][v.prop] }}
            </span>
          </div>

          <!-- 可点击跳转文本 -->
          <div class="skip-text" v-else-if="v.type === 'skip'">
            <span
              :style="{
                color:
                  v.cstcolor && scope['row'][v.cstcolor]
                    ? scope['row'][v.cstcolor]
                    : v.color
                    ? v.color
                    : '#333'
              }"
              @click="textSkip(scope['row'], v.action)"
            >
              {{ scope['row'][v.prop] ? scope['row'][v.prop] : '' }}
            </span>
          </div>

          <!-- 普通文本编辑 -->
          <div v-else-if="v.type">
            <span class="set-text" v-if="scope['row'][v.prop] != null">
              <span
                v-if="v.disabled === true"
                :style="{
                  color:
                    v.cstcolor && scope['row'][v.cstcolor]
                      ? scope['row'][v.cstcolor]
                      : v.color
                      ? v.color
                      : '#333'
                }"
              >
                {{ scope['row'][v.prop] }}
              </span>
              <span
                @click="setText(scope, v.prop, v.label, v.type, v.action)"
                v-else
                :style="{
                  color: v.color ? v.color : '#333'
                }"
              >
                {{ scope['row'][v.prop] }}
              </span>
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              content="无法设置,请联系信息技术部"
              placement="top"
              :open-delay="150"
              v-else
            >
              <span class="error-text">无</span>
            </el-tooltip>
          </div>

          <!-- 普通文本显示 -->
          <div v-else>
            <span
              v-if="scope['row'][v.prop] != null"
              :style="{
                color:
                  v.cstcolor && scope['row'][v.cstcolor]
                    ? scope['row'][v.cstcolor]
                    : v.color
                    ? v.color
                    : '#333'
              }"
            >
              {{ scope['row'][v.prop] }}
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              content="未设置,请联系信息技术部"
              placement="top"
              :open-delay="150"
              v-else
            >
              <span class="error-text">无</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页表格 -->
    <el-table
      v-else
      ref="pageTab"
      :data="datas"
      stripe
      :show-summary="issummary"
      v-loading="cusConf.loadStatus"
      element-loading-text="数据获取中..."
      height="calc(100% - 2.9rem)"
      :row-class-name="rowClassName"
      :empty-text="cusConf.emptyText ? cusConf.emptyText : tableConf.emptyText"
      v-scroll-event="listenScroll"
      v-scroll-end="endScroll"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="check"
        type="selection"
        width="75"
      ></el-table-column>
      <el-table-column
        :label="v.label"
        :width="v.width"
        :show-overflow-tooltip="!v.type || v.type === 'text'"
        v-for="(v, i) in tableShowColums"
        :key="i"
        v-show="v.show"
        :fixed="v.fixed"
      >
        <template slot-scope="scope">
          <!-- checkbox开启/关闭 -->
          <div v-if="v.type === 'checkbox'">
            <div v-if="!scope['row'][v.hide]">
              <el-switch
                :value="String(scope['row'][v.prop])"
                active-value="1"
                inactive-value="0"
                @change="setCheckbox(scope, v.prop, v.action)"
                :disabled="
                  scope['row'][v.disabled] ||
                    (!$menu.getters.judgeRole(v.token) && v.token != 'empty')
                "
                v-if="scope['row'][v.prop] != null"
              ></el-switch>
              <el-tooltip
                class="item"
                effect="dark"
                content="无法设置,请联系信息技术部"
                placement="top"
                :open-delay="150"
                v-else
              >
                <el-switch :value="false" disabled></el-switch>
              </el-tooltip>
            </div>
          </div>

          <!-- 按钮操作 -->
          <div v-else-if="v.type === 'button'" style="min-height: 1.9rem;">
            <span class="btn" v-for="(bv, bi) in v.btns" :key="bi">
              <el-button
                v-if="
                  !scope['row'][bv.hide] &&
                    ($menu.getters.judgeRole(bv.token) || bv.token == 'empty')
                "
                :type="bv.type"
                :size="bv.size ? bv.size : 'mini'"
                :round="bv.round"
                :class="bv.class"
                :disabled="scope['row'][bv.disabled]"
                plain
                @click="clickBtn(scope, bv.action)"
                :style="{ width: bv.name.length > 2 ? '4rem' : '3rem' }"
              >
                {{ bv.name }}
              </el-button>
            </span>
          </div>

          <div v-else-if="v.type === 'select'">
            <el-select
              v-model="scope['row'][v.prop]"
              :placeholder="v.placeholder"
              @change="selectChange(scope, v.action)"
            >
              <el-option
                v-for="itm in scope['row'][v.options]"
                :key="itm.id"
                :label="itm.name"
                :value="itm.id"
              ></el-option>
            </el-select>
          </div>

          <!-- 图标 操作 -->
          <div v-else-if="v.type === 'icon'">
            <div class="icon-wp" v-if="!scope['row'][v.hide]">
              <img
                v-if="v.icon === 'detail' && v.token"
                src="@/assets/common/img/detail.png"
                @click="clickBtn(scope, v.action)"
              />
              <img
                v-else-if="v.icon === 'account' && v.token"
                src="@/assets/common/img/account.png"
                @click="clickBtn(scope, v.action)"
              />
              <img
                v-else-if="v.icon === 'print' && v.token"
                src="@/assets/common/img/print.png"
                @click="clickBtn(scope, v.action)"
              />
              <img
                v-else-if="v.icon === 'car' && v.token"
                src="@/assets/common/img/car.png"
                @click="clickBtn(scope, v.action)"
              />
              <a
                :href="
                  scope['row'][v.prop]
                    ? scope['row'][v.prop]
                    : 'javascript:void(0);'
                "
                :class="[scope['row'][v.prop] ? 'active' : '']"
                :target="scope['row'][v.prop] ? '_blank' : '_self'"
                v-else-if="v.icon === 'eye' && v.token"
              >
                <i class="icon iconfont icona-lujing434"></i>
              </a>
              <i
                v-else-if="v.token"
                :class="['icon iconfont', v.icon]"
                @click="clickBtn(scope, v.action)"
              ></i>
            </div>
          </div>

          <!-- 文本/数字修改 操作 -->
          <div class="edit" v-else-if="v.type === 'input'">
            <el-input
              :type="v.inputType ? v.inputType : 'text'"
              :disabled="
                v.token != 'empty' && !$menu.getters.judgeRole(v.token)
              "
              v-model="scope['row'][v.prop]"
              @change="textChange($event, scope, v.action)"
            ></el-input>
          </div>

          <!-- 选择日期操作 -->
          <div class="date-wp" v-else-if="v.type === 'date'">
            <el-date-picker
              v-if="v.old_time"
              v-model="scope['row'][v.prop]"
              :type="v.dateType"
              :clearable="false"
              placeholder="选择日期"
              value-format="timestamp"
              prefix-icon=""
              :pickerOptions="pickerOptions(scope['row'][v.old_time])"
            ></el-date-picker>
            <el-date-picker
              v-else
              v-model="scope['row'][v.prop]"
              :type="v.dateType"
              :clearable="false"
              placeholder="选择日期"
              prefix-icon=""
            ></el-date-picker>
          </div>

          <!-- 下拉菜单部分 -->
          <div class="dropdown-wp" v-else-if="v.type === 'dropdown'">
            <el-dropdown
              trigger="click"
              placement="bottom"
              @command="dropClick($event, v.items, scope.row)"
              v-if="!scope['row'][v.hide]"
            >
              <span class="el-dropdown-link">
                <img
                  src="@/assets/common/img/more.png"
                  alt=""
                  style="cursor: pointer;height: 1.4rem;vertical-align: middle;"
                />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="item.id"
                  v-for="item in v.items"
                  :key="item.id"
                >
                  <div
                    v-if="
                      (item.token == 'empty' ||
                        $menu.getters.judgeRole(item.token)) &&
                        !scope['row'][item.hide]
                    "
                  >
                    {{ item.name }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <!-- 表格图片 -->
          <div class="img" v-else-if="v.type === 'img'">
            <!-- <img
              v-if="scope['row'][v.prop]"
              :src="scope['row'][v.prop]"
              @click="imgPreview(scope['row'])"
            />
            <i
              v-else
              class="el-icon-picture-outline"
              style="font-size: 1.1rem;color: #ccc!important;vertical-align: middle!important;"
            ></i> -->
            <!-- 单张图片的情况（向后兼容） -->
            <template v-if="!Array.isArray(scope['row'][v.prop])">
              <img
                v-if="scope['row'][v.prop]"
                :src="scope['row'][v.prop]"
                @click="imgPreview(scope['row'])"
              />
              <i
                v-else
                class="el-icon-picture-outline"
                style="font-size: 1.1rem;color: #ccc!important;vertical-align: middle!important;"
              ></i>
            </template>
            
            <!-- 多张图片的情况（新增） -->
            <template v-else>
              <div class="multi-img-wrapper">
                <img
                  v-for="(imgUrl, imgIndex) in scope['row'][v.prop]"
                  :key="imgIndex"
                  :src="imgUrl"
                  @click="imgPreview(scope['row'], imgIndex)"
                  style="width: 30px;height: 30px;margin-right: 5px;cursor: pointer;"
                />
              </div>
            </template>
          </div>

          <div class="num-select" v-else-if="v.type === 'numSelect'">
            <span @click="villageSelect(scope, v.action)">
              {{ scope['row'][v.prop] }}
            </span>
          </div>

          <!-- 可点击跳转文本 -->
          <div class="skip-text" v-else-if="v.type === 'skip'">
            <span
              :style="{
                color:
                  v.cstcolor && scope['row'][v.cstcolor]
                    ? scope['row'][v.cstcolor]
                    : v.color
                    ? v.color
                    : '#333'
              }"
              @click="textSkip(scope['row'], v.action)"
            >
              {{ scope['row'][v.prop] ? scope['row'][v.prop] : '' }}
            </span>
          </div>

          <!-- 普通文本编辑 -->
          <div v-else-if="v.type">
            <span class="set-text" v-if="scope['row'][v.prop] != null">
              <span
                v-if="v.disabled === true"
                :style="{
                  color:
                    v.cstcolor && scope['row'][v.cstcolor]
                      ? scope['row'][v.cstcolor]
                      : v.color
                      ? v.color
                      : '#333'
                }"
              >
                {{ scope['row'][v.prop] }}
              </span>
              <span
                @click="setText(scope, v.prop, v.label, v.type, v.action)"
                v-else
                :style="{
                  color: v.color ? v.color : '#333'
                }"
              >
                {{ scope['row'][v.prop] }}
              </span>
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              content="无法设置,请联系信息技术部"
              placement="top"
              :open-delay="150"
              v-else
            >
              <span class="error-text">无</span>
            </el-tooltip>
          </div>

          <!-- 普通文本显示 -->
          <div v-else>
            <span
              v-if="scope['row'][v.prop] != null"
              :style="{
                color:
                  v.cstcolor && scope['row'][v.cstcolor]
                    ? scope['row'][v.cstcolor]
                    : v.color
                    ? v.color
                    : '#333'
              }"
            >
              {{ scope['row'][v.prop] }}
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              content="未设置,请联系信息技术部"
              placement="top"
              :open-delay="150"
              v-else
            >
              <span class="error-text">无</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页部分 -->
    <el-pagination
      v-if="ispaging"
      class="pagination"
      background
      :current-page="cusConf.curPage"
      :page-size="cusConf.limit"
      :page-sizes="
        cusConf.pageLimits ? cusConf.pageLimits : pageConf.pageLimits
      "
      :layout="cusConf.layout ? cusConf.layout : pageConf.layout"
      :total="cusConf.dataTotal"
      :disabled="cusConf.pageStatus"
      :hide-on-single-page="cusConf.sigleHide"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
import Vue from 'vue'
import menu_ from '@/store/menu.js'
Vue.prototype.$menu = menu_

export default {
  name: 'CusTable',
  data() {
    return {
      tableConf: {
        emptyText: '暂无数据！',
        export_index: 0
      },
      pageConf: {
        pageLimits: [10, 20, 50, 100, 500, 1000, 5000],
        layout: 'total, sizes, prev, pager, next, jumper'
      }
    }
  },

  props: [
    'title',
    'datas',
    'cusColums',
    'cusConf',
    'check',
    'ispaging',
    'issummary'
  ],

  /**
   * 计算属性
   */
  computed: {
    /* 设置报表导出的表头 */
    excelHeader() {
      let tHeader = []
      this.cusColums.forEach(function(v, i) {
        if (v.show === true && typeof v.btns != 'object') {
          tHeader.push(v.label)
        }
      })
      return tHeader
    },

    /* 设置报表导出的字段匹配头 */
    excelField() {
      let tField = []
      this.cusColums.forEach(function(v, i) {
        if (v.show === true && typeof v.btns != 'object') {
          tField.push(v.prop)
        }
      })
      return tField
    },

    /** 显示的表格项 */
    tableShowColums() {
      return this.cusColums.filter(item => item.show)
    }
  },

  watch: {
    datas() {
      this.$nextTick(() => {
        if (this.ispaging) {
          this.$refs.pageTab.doLayout()
        } else {
          this.$refs.nopageTab.doLayout()
        }
      })
    }
  },

  /**
   * 方法
   */
  methods: {
    rowClassName({ row }) {
      let arr = [
        this.tableShowColums[this.tableShowColums.length - 1].type == 'button'
          ? 'btn'
          : this.tableShowColums[this.tableShowColums.length - 1].type ==
            'dropdown'
          ? 'drop'
          : ''
      ]
      if (row.rowDelete) {
        arr.push('delete')
      }
      return arr
    },

    listenScroll() {
      document.querySelector('html').style['overflow'] = 'hidden'
    },
    endScroll() {
      setTimeout(function() {
        document.querySelector('html').style['overflow'] = 'auto'
      }, 1000)
    },

    /* checkbox状态变更 */
    setCheckbox(list, col_name, action) {
      let data = {
        index: list.$index,
        col_name: col_name,
        value: 1 - parseInt(this.datas[list.$index][col_name])
      }
      this.$emit(action, data)
    },

    /* input输入编辑 */
    setText(list, col_name, label, type, action) {
      this.$prompt(
        '请输入' + label,
        '您正在设置【' + list.row.villagename + '】的' + label,
        {
          confirmButtonText: '保存',
          cancelButtonText: '放弃修改',
          showClose: false,
          closeOnClickModal: false,
          inputPattern: /\S/,
          inputValue: list['row'][col_name],
          inputType: type,
          inputErrorMessage: label + '格式不正确'
        }
      )
        .then(({ value }) => {
          this.$emit(action, list.$index, col_name, value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '您放弃了修改' + label,
            offset: 150
          })
        })
    },

    /* 按钮点击事件 */
    clickBtn(list, action) {
      this.$emit(action, list.$index)
    },

    /** 下拉框选择更改事件 */
    selectChange(list, action) {
      this.$emit(action, list.$index)
    },

    /** 点击图片预览处理 */
    imgPreview(obj, index = 0) {
      this.$emit('imgPreview', obj, index)
    },

    /** 点击文本跳转处理 */
    textSkip(obj, action) {
      this.$emit(action, obj)
    },

    /** 项目选择 */
    villageSelect(list, action) {
      this.$emit(action, list.$index)
    },

    /** 文本/数字修改操作 */
    textChange(value, list, action) {
      if (action) {
        this.$emit(action, { index: list.$index, value: value })
      } else {
        this.$emit('textChange', { index: list.$index, value: value })
      }
    },

    /* 设置分页查询条数 */
    sizeChange(num) {
      this.$emit('sizeChange', num, this.cusConf.curPage)
    },

    /* 获取当前查询页码数 */
    currentChange(page) {
      this.$emit('currentChange', page)
    },

    /** 点击下拉项处理 */
    dropClick(id, arr, obj) {
      let index = arr.findIndex(item => item.id == id)
      this.$emit(arr[index].action, obj)
    },

    /* 导出EXCEL */
    exportExcel() {
      try {
        require.ensure([], () => {
          // 引入excel.js
          let {
            export_json_to_excel
          } = require('../../assets/common/excel/Export2Excel')

          // 整理需要导出的数据
          let datas = this.datas.map(v =>
            this.excelField.map(j => {
              if (this.title == '项目配置信息' && (v[j] === 0 || v[j] === 1)) {
                return v[j] ? '是' : '否'
              } else {
                return v[j]
              }
            })
          )

          // 执行导出操作
          export_json_to_excel(
            this.excelHeader,
            datas,
            (this.title ? this.title : 'table') +
              (this.tableConf.export_index === 0
                ? ''
                : '-' + this.tableConf.export_index)
          )

          // 文件名称索引依次递增
          this.tableConf.export_index++
        })

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
    },

    /** 选择更改 */
    handleSelectionChange(value) {
      this.$emit('selectionChange', value)
    },

    /** 时间选择框限制 */
    pickerOptions(stime) {
      return {
        // 日期限制
        disabledDate: time => {
          if (time) {
            return time.getTime() < stime
          }
        }
      }
    }
  }
}
</script>
<style lang="less">
#CusTable {
  height: 100% !important;

  .el-table {
    width: 100%;
    thead {
      color: #333;
    }
    .cell {
      text-align: center;
    }
    th {
      padding: 13px 0;
    }
    td {
      padding: 10px 0;
      .btn {
        display: inline-block;
        .el-button {
          margin: 5px;
          height: 28px;
          padding: 0;
        }
      }
      .el-button--danger.is-plain {
        border: none;
      }
      .el-button--danger.is-plain.empty {
        border: 1px solid #f56c6c;
        background-color: #fff !important;
      }
      .el-button--danger.is-plain:hover,
      .el-button--danger.is-plain:focus {
        opacity: 0.6;
        color: #f56c6c;
        background-color: #fef0f0;
      }
      .el-button.el-button--primary.empty:hover,
      .el-button.el-button--primary.empty:focus {
        background-color: #fff !important;
      }
      .el-button.el-button--primary.empty.is-disabled {
        background-color: #fff;
      }
      .el-button.el-button--danger.empty:hover,
      .el-button.el-button--danger.empty:focus {
        background-color: #fff !important;
      }
      .el-button.el-button--danger.empty.is-disabled {
        background-color: #fff;
      }
      .icon {
        color: #69da61;
        cursor: pointer;
        font-size: 20px;
        vertical-align: bottom;
      }
      .icon-wp {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
        > a {
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 3px;
          background-color: #e8e8e8;
          text-decoration: none;
          i {
            color: #ccc;
            font-size: 14px;
            line-height: 30px;
          }
        }
        > a.active {
          background: #e9f4e8;
          i {
            color: #3ebb75;
          }
        }
      }
      .edit {
        input {
          background-color: transparent !important;
          border-radius: 0 !important;
          border-bottom: 1px solid #3ebb75 !important;
          text-align: center;
          height: 30px;
          padding: 0;
        }
      }
      .date-wp {
        width: 100%;
        .el-date-editor {
          width: 100%;
          height: 30px;
          .el-input__icon {
            display: none;
          }
          input {
            height: 30px;
            padding: 0;
            border-radius: 0 !important;
            text-align: center;
            background-color: transparent !important;
            border-bottom: 1px solid #3ebb75 !important;
          }
        }
      }
      .img {
        display: inline-block;
        text-align: left;
        > img {
          width: 30px;
          height: 30px;
          vertical-align: middle;
          cursor: pointer;
        }
        > img + img {
          margin-left: 10px;
        }
      }
      .num-select {
        > span {
          display: inline-block;
          width: 30px;
          height: 30px;
          background-color: #fff;
          border: 2px solid #3ebb75;
          border-radius: 3px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          color: #3ebb75;
          font-weight: 700;
        }
      }
      .skip-text:hover {
        > span {
          color: #3ebb75 !important;
          cursor: pointer;
        }
      }
    }
    tr.btn {
      td {
        padding: 3px 0;
      }
    }
    tr.drop {
      td {
        padding: 7px 0;
      }
    }
    tr.el-table__row.delete {
      .cell {
        div,
        span {
          color: #ccc !important;
        }
      }
    }
  }

  .set-text {
    cursor: pointer;
  }

  .error-text {
    color: #c0c4cc;
    cursor: pointer;
  }

  .pagination {
    background: #ffff;
    padding: 15px 30px;
    text-align: right;
    border-radius: 0 0 6px 6px;
    .el-input__inner {
      border-radius: 4px !important;
    }
  }
}
</style>
