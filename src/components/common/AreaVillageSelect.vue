<template>
  <div
    id="area-village-select"
    v-loading="isLoading"
    element-loading-text="数据加载中，请稍等"
  >
    <div class="select-content">
      <div class="title">{{ title }}</div>
      <div class="select-item">
        <div class="name">选择大区</div>
        <el-select
          v-model="areaValue"
          clearable
          placeholder="请选择大区"
          @change="areaChange"
        >
          <el-option
            v-for="item in areaOptions"
            :key="item.deptid"
            :label="item.deptname"
            :value="item.deptid"
          ></el-option>
        </el-select>
      </div>
      <div class="select-item">
        <div class="name">选择项目</div>
        <el-select
          v-model="villageValue"
          clearable
          :multiple="multiple"
          placeholder="请选择项目"
          :no-data-text="villageLoading ? '加载中...' : '无数据'"
        >
          <el-option
            v-for="item in villageOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="btn-wp">
        <el-button type="primary" round @click="registerStart">
          {{ btnName }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AreaVillageSelect',
  props: {
    title: {
      type: String,
      default: ''
    },
    btnName: {
      type: String,
      default: '开始登记'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 接口数据对象
      urlObj: {
        bigarea: this.$api.state.Public.bigarea.url,
        village: this.$api.state.Public.village.url
      },
      isRegister: false,
      // 大区绑定值
      areaValue: '',
      // 大区选择项
      areaOptions: [],
      // 是否正在加载项目
      villageLoading: false,
      // 项目绑定值
      villageValue: this.multiple ? [] : '',
      // 项目选择项
      villageOptions: [],
      // 是否正在加载数据
      isLoading: false
    }
  },

  /**
   * 生命周期
   */
  created() {
    this.isLoading = true
    // 获取大区数据
    this.getAreaData()
  },

  /**
   * 方法
   */
  methods: {
    // 获取大区数据
    getAreaData() {
      this.$axios
        .post(this.urlObj.bigarea, { vill_limit: true })
        .then(res => {
          if (res.Code === 200) {
            let bid = sessionStorage.getItem('bid')
            if (bid) {
              this.areaValue = Number(bid)
              this.getVillageData(true)
            } else {
              this.isLoading = false
            }
            this.areaOptions = res.Data
          } else {
            this.$message({
              type: 'error',
              message: '大区数据获取失败！'
            })
            this.isLoading = false
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '大区数据获取失败！'
          })
          this.isLoading = false
        })
    },

    // 大区选择改变处理
    areaChange() {
      this.villageOptions = []
      this.villageValue = this.multiple ? [] : ''
      if (this.areaValue) {
        this.getVillageData()
      }
    },

    // 项目下拉框获得焦点处理
    getVillageData(flag) {
      this.villageLoading = true
      this.$axios
        .post(this.urlObj.village, { id: this.areaValue })
        .then(res => {
          if (res.Code === 200) {
            if (flag) {
              let vid = sessionStorage.getItem('vid')
              if (vid) {
                this.villageValue = this.multiple ? [Number(vid)] : Number(vid)
              }
            }
            this.villageOptions = res.Data
          } else {
            this.$message({
              type: 'error',
              message: '项目数据获取失败！'
            })
          }
          this.villageLoading = false
          this.isLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '项目数据获取失败！'
          })
          this.villageLoading = false
          this.isLoading = false
        })
    },

    // 点击开始登记按钮处理
    registerStart() {
      let msg = ''
      let flag = this.multiple
        ? this.villageValue.length > 0
        : this.villageValue
      if (!this.areaValue && !flag) {
        msg = '请选择大区和项目！'
      } else if (!this.areaValue) {
        msg = '请选择大区！'
      } else if (!flag) {
        msg = '请选择项目！'
      } else {
        let data = {
          aid: this.areaValue,
          vid: this.villageValue
        }
        this.$emit('registerPass', data)
        return
      }
      this.$message({
        type: 'warning',
        message: msg
      })
    }
  }
}
</script>

<style lang="less">
#area-village-select {
  width: 100%;
  height: 100%;
  position: relative;
  .select-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    padding: 50px;
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    .title {
      font-size: 18px;
      line-height: 30px;
      font-weight: 700;
      margin-bottom: 50px;
    }
    .select-item {
      margin-bottom: 50px;
      padding: 0 50px;
      .name {
        font-size: 15px;
        line-height: 24px;
        margin-bottom: 10px;
        color: #666;
      }
      .el-select {
        width: 320px;
      }
    }
    .btn-wp {
      text-align: center;
    }
  }
}
</style>
