<template>
  <div id="addVillage">
    <el-dialog
      class="dialog-addvillage"
      title="新增项目"
      :visible.sync="conf.show"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-scrollbar style="height: 100%;">
        <el-form :model="form" :rules="rules" ref="addForm">
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item prop="area">
                <span class="form-title">所属大区</span>
                <el-select
                  v-model="form.area"
                  placeholder="请选择所属大区"
                  :filterable="true"
                  :loading="bigarea.isLoading"
                  @visible-change="getBgDatas"
                  @change="chBgSelect"
                >
                  <el-option
                    :label="v.deptname"
                    :value="v.deptid"
                    v-for="(v, i) in bigarea.datas"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="did">
                <span class="form-title">所属公司</span>
                <el-select
                  v-model="form.did"
                  placeholder="请选择所属公司"
                  :filterable="true"
                  :loading="company.isLoading"
                  @visible-change="getComDatas"
                >
                  <el-option
                    :label="v.deptname"
                    :value="v.deptid"
                    v-for="(v, i) in company.datas"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="villagename">
                <span class="form-title">项目名称</span>
                <el-input
                  v-model="form.villagename"
                  placeholder="请输入项目名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item prop="villageaddr">
                <span class="form-title">楼盘地址</span>
                <el-input
                  v-model="form.villageaddr"
                  placeholder="请输入楼盘地址"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="allacreage">
                <span class="form-title">占地总面积(m²)</span>
                <el-input
                  v-model="form.allacreage"
                  placeholder="请输入占地总面积"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="buildacreage">
                <span class="form-title">总建筑面积(m²)</span>
                <el-input
                  v-model="form.buildacreage"
                  placeholder="请输入总建筑面积"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item prop="parkingnum">
                <span class="form-title">车位数量</span>
                <el-input
                  v-model="form.parkingnum"
                  placeholder="请输入车位数量"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="useacreage">
                <span class="form-title">总使用面积(m²)</span>
                <el-input
                  v-model="form.useacreage"
                  placeholder="请输入总使用面积"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="far">
                <span class="form-title">容积率(%)</span>
                <el-input
                  v-model="form.far"
                  placeholder="请输入容积率"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item prop="greenrate">
                <span class="form-title">绿化率(%)</span>
                <el-input
                  v-model="form.greenrate"
                  placeholder="请输入绿化率"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="publicareas">
                <span class="form-title">公共场所面积(m²)</span>
                <el-input
                  v-model="form.publicareas"
                  placeholder="请输入公共场所面积"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item prop="house_num">
                <span class="form-title">房屋数量(套)</span>
                <el-input
                  v-model="form.house_num"
                  placeholder="请输入房屋数量"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="font-size: 14px;font-weight: 700;">
            <el-col :span="6" :offset="1">
              月租车类型设置
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in form.car_num" :key="index">
            <el-col :span="6" :offset="1">
              <el-form-item
                :prop="'car_num.' + index + '.resources_type_id'"
                :rules="rules.resources_type_id"
              >
                <span class="form-title">车位类型</span>
                <el-select
                  v-model="item.resources_type_id"
                  placeholder="请选择车位类型"
                  clearable
                >
                  <el-option
                    :label="v.name"
                    :value="v.id"
                    v-for="(v, i) in rtypeOptions"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item
                :prop="'car_num.' + index + '.num'"
                :rules="rules.num"
              >
                <span class="form-title">月租车位数</span>
                <el-input
                  type="number"
                  v-model="item.num"
                  placeholder="请输入月租车位数"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="2">
              <el-form-item>
                <span
                  class="form-title"
                  style="display:inline-block;width:100%;height: 0.8rem;"
                ></span>
                <el-button
                  v-if="index == form.car_num.length - 1"
                  type="primary empty"
                  plain
                  style="width: 100%;"
                  @click="addCar"
                >
                  继续添加
                </el-button>
                <el-button
                  v-else
                  type="warning empty"
                  plain
                  style="width: 100%;"
                  @click="delCar(index)"
                >
                  删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>

      <!-- dialog footer 部分 -->
      <span slot="footer">
        <el-button
          :loading="conf.isSubmitLoading"
          type="primary"
          round
          @click="onSubmit"
        >
          {{ conf.isSubmitLoading === true ? '保存中，请稍等...' : '提交保存' }}
        </el-button>
        <el-button type="info" round @click="conf.show = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addVillage',
  data() {
    return {
      form: {
        area: '',
        did: '',
        villagename: '',
        villageaddr: '',
        allacreage: '',
        buildacreage: '',
        parkingnum: '',
        useacreage: '',
        far: '',
        greenrate: '',
        publicareas: '',
        house_num: '',
        token: this.$api.state.System.village.add.token,
        car_num: [
          {
            resources_type_id: '',
            num: ''
          }
        ]
      },
      bigarea: {
        datas: [],
        isLoading: false
      },
      company: {
        datas: [],
        isLoading: false
      },
      rules: {
        area: [
          {
            required: true,
            message: '请选择所属大区',
            trigger: 'blur'
          }
        ],
        did: [
          {
            required: true,
            message: '请选择所属公司',
            trigger: 'blur'
          }
        ],
        villagename: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }
        ],
        villageaddr: [
          {
            required: true,
            message: '请输入楼盘地址',
            trigger: 'blur'
          }
        ],
        allacreage: [
          {
            required: true,
            message: '请输入占地总面积',
            trigger: 'blur'
          }
        ],
        buildacreage: [
          {
            required: true,
            message: '请输入总建筑面积',
            trigger: 'blur'
          }
        ],
        parkingnum: [
          {
            required: true,
            message: '请输入车位数量',
            trigger: 'blur'
          }
        ],
        useacreage: [
          {
            required: true,
            message: '请输入总使用面积',
            trigger: 'blur'
          }
        ],
        far: [
          {
            required: true,
            message: '请输入容积率',
            trigger: 'blur'
          }
        ],
        greenrate: [
          {
            required: true,
            message: '请输入绿化率',
            trigger: 'blur'
          }
        ],
        publicareas: [
          {
            required: true,
            message: '请输入公共场所面积',
            trigger: 'blur'
          }
        ],
        house_num: [
          {
            required: true,
            message: '请输入房屋数量',
            trigger: 'blur'
          }
        ],
        resources_type_id: [
          { required: false, message: '请选择车位类型', trigger: 'change' }
        ],
        num: [
          { required: false, message: '请输入月租车位数量', trigger: 'blur' }
        ]
      },
      conf: {
        show: false,
        isSubmitLoading: false
      },
      // 月租车位类型列表
      rtypeOptions: []
    }
  },
  methods: {
    /* 是否打开弹出层 */
    showDialog() {
      // 表单验证重置
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.conf.show = true
      // 获取月租车位类型
      this.getResourceTypes()
    },

    /* 获取大区信息 */
    getBgDatas(isOpen) {
      let _this = this
      if (
        isOpen === true &&
        _this.bigarea.datas.length <= 0 &&
        _this.bigarea.isLoading === false
      ) {
        // 使选项处于加载中
        _this.bigarea.isLoading = true

        // 获取数据
        _this
          .$axios({
            url: _this.$api.state.Public.bigarea.url,
            method: 'post',
            responseType: 'json'
          })
          .then(res => {
            if (res.Code === 200) {
              // 获取数据成功
              _this.bigarea.datas = res.Data
              _this.bigarea.isLoading = false
            } else if (res.Code === 204) {
              // 登录信息过期
              _this.$message({
                message: res.Message,
                type: 'error',
                offset: 150
              })

              // 跳转至登录
              _this.$router.push({
                path: _this.$common.state.loginPath
              })
            } else {
              _this.$message({
                message: res.Message,
                type: 'error',
                offset: 150
              })

              _this.bigarea.isLoading = false
            }
          })
          .catch(() => {
            _this.$message({
              message: '服务器连接失败',
              type: 'error',
              offset: 150
            })

            _this.bigarea.isLoading = false
          })
      }
    },

    /* 选择大区信息 */
    chBgSelect(v) {
      // 清空关联选择信息
      this.form.did = ''

      // 清空所属公司
      this.company.datas = []
      this.company.isLoading = false
    },

    /* 获取公司信息 */
    getComDatas(isOpen) {
      let _this = this

      if (
        isOpen === true &&
        parseInt(_this.form.area) > 0 &&
        _this.company.datas.length <= 0 &&
        _this.company.isLoading === false
      ) {
        // 使选项处于加载中
        _this.company.isLoading = true

        // 获取数据
        _this
          .$axios({
            url: _this.$api.state.Public.company.url,
            method: 'post',
            responseType: 'json',
            data: {
              bgid: _this.form.area
            }
          })
          .then(res => {
            if (res.Code === 200) {
              // 获取数据成功
              _this.company.datas = res.Data
              _this.company.isLoading = false
            } else if (res.Code === 204) {
              // 登录信息过期
              _this.$message({
                message: res.Message,
                type: 'error',
                offset: 150
              })

              // 跳转至登录
              _this.$router.push({
                path: _this.$common.state.loginPath
              })
            } else {
              _this.$message({
                message: res.Message,
                type: 'error',
                offset: 150
              })

              _this.company.isLoading = false
            }
          })
          .catch(() => {
            _this.$message({
              message: '服务器连接失败',
              type: 'error',
              offset: 150
            })

            _this.company.isLoading = false
          })
      }
    },

    /** 获取月租车位类型 */
    getResourceTypes() {
      this.$axios
        .post(this.$api.state.Means.carType.url, { type: 'carmonth' })
        .then(res => {
          if (res.Code === 200) {
            this.rtypeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取月租车位类型数据失败！'
            this.$message({
              type: 'error',
              massage: msg
            })
          }
        })
        .catch(() => {})
    },

    /** 添加车位 */
    addCar() {
      this.form.car_num.push({
        resources_type_id: '',
        num: ''
      })
    },

    /** 删除车位 */
    delCar(index) {
      this.form.car_num.splice(index, 1)
    },

    /* 新增项目 提交数据 */
    onSubmit() {
      let _this = this

      _this.$refs.addForm.validate(valid => {
        if (valid === false) {
          // 验证不通过
          return false
        }

        // 提交按钮更改为加载中
        _this.conf.isSubmitLoading = true

        // 发送数据
        _this
          .$axios({
            url: _this.$api.state.System.village.add.url,
            method: 'post',
            responseType: 'json',
            data: _this.form
          })
          .then(res => {
            if (res.Code === 200) {
              // 重置表单
              _this.$refs['addForm'].resetFields()
              _this.company.datas = []

              // 提交按钮更改为正常
              _this.conf.isSubmitLoading = false

              // 关闭弹出层
              _this.conf.show = false

              _this.$message({
                message: res.Message,
                type: 'success',
                offset: 150
              })

              // 触发父级方法
              _this.$emit('addSuc', true)
            } else if (res.Code === 204) {
              // 登录信息过期
              _this.$message({
                message: res.Message,
                type: 'error',
                offset: 150
              })

              // 跳转至登录
              _this.$router.push({
                path: _this.$common.state.loginPath
              })
            } else {
              // 提交按钮更改为正常
              _this.conf.isSubmitLoading = false
              _this.$message({
                message: res.Message,
                type: 'error',
                offset: 150
              })
            }
          })
          .catch(() => {
            _this.conf.isSubmitLoading = false
            _this.$message({
              message: '服务器连接失败',
              type: 'error',
              offset: 150
            })
          })
      })
    }
  }
}
</script>
