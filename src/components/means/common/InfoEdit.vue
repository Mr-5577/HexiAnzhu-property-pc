<template>
  <div id="info-edit">
    <div class="input-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk="true"
      >
        <el-form-item
          :label="item.name"
          :prop="item.prop"
          v-for="(item, index) in editList"
          :key="index"
        >
          <el-select
            v-model="ruleForm[item.prop]"
            clearable
            :placeholder="`请选择${item.name}`"
            v-if="item.type == 'select1'"
          >
            <el-option
              v-for="itm in sexOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="ruleForm[item.prop]"
            clearable
            :placeholder="`请选择${item.name}`"
            v-else-if="item.type == 'select2'"
          >
            <el-option
              v-for="itm in typeOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="ruleForm[item.prop]"
            clearable
            :placeholder="`请选择${item.name}`"
            v-else-if="item.type == 'select3'"
          >
            <el-option
              v-for="itm in chargeOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="ruleForm[item.prop]"
            clearable
            :placeholder="`请选择${item.name}`"
            v-else-if="item.type == 'select4'"
          >
            <el-option
              v-for="itm in btypeOptions"
              :key="itm.value"
              :label="itm.label"
              :value="itm.value"
            ></el-option>
          </el-select>
          <el-select
            v-else-if="item.type == 'search'"
            v-model="ruleForm[item.prop]"
            filterable
            remote
            placeholder="请输入姓名搜索"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.uid"
              :label="`${item.realname} (${item.mobile})`"
              :value="item.uid"
            ></el-option>
          </el-select>
          <el-input
            v-else
            v-model="ruleForm[item.prop]"
            :type="item.type"
            :readonly="item.readonly"
            :placeholder="`请输入${item.name.split('(')[0]}`"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InfoEdit',
  props: {
    // 当前编辑类型（项目、楼栋、业主）
    type: String,
    infoObj: Object
  },
  data() {
    return {
      // 编辑项列表
      editList: [],
      // 性别
      sexOptions: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      // 客户类型
      typeOptions: [],
      // 是否开启计费
      chargeOptions: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      // 搜索框选择列表
      userOptions: [],
      // 楼宇类型列表
      btypeOptions: [],
      // 是否正在搜索
      loading: false,
      // 表单数据对象
      ruleForm: {},
      // 表单验证对象
      rules: {}
    }
  },

  /**
   * 生命周期
   */
  created() {
    switch (this.type) {
      case 'village':
        this.ruleForm = {
          vname: this.infoObj.villagename ? this.infoObj.villagename : '',
          vaddr: this.infoObj.villageaddr ? this.infoObj.villageaddr : '',
          area: this.infoObj.allacreage ? this.infoObj.allacreage : 0,
          barea: this.infoObj.buildacreage ? this.infoObj.buildacreage : 0,
          pnum: this.infoObj.parkingnum ? this.infoObj.parkingnum : 0,
          uarea: this.infoObj.useacreage ? this.infoObj.useacreage : 0,
          far: this.infoObj.far ? this.infoObj.far : '',
          greenrate: this.infoObj.greenrate ? this.infoObj.greenrate : 0,
          public: this.infoObj.publicareas ? this.infoObj.publicareas : 0,
          mnum: this.infoObj.villagecarsetting[0]
            ? this.infoObj.villagecarsetting[0].num
            : 0,
          hnum: this.infoObj.house_num ? this.infoObj.house_num : 0,
          payArea: this.infoObj.pay_area ? this.infoObj.pay_area : 0
        }
        this.rules = {
          vname: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          vaddr: [
            { required: true, message: '请输入楼盘地址', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '请输入总占地面积', trigger: 'blur' }
          ],
          barea: [
            { required: true, message: '请输入总建筑面积', trigger: 'blur' }
          ],
          pnum: [
            { required: true, message: '请输入车位数量', trigger: 'blur' }
          ],
          uarea: [
            { required: true, message: '请输入总使用面积', trigger: 'blur' }
          ],
          far: [{ required: true, message: '请输入容积率', trigger: 'blur' }],
          greenrate: [
            { required: true, message: '请输入绿化率', trigger: 'blur' }
          ],
          public: [
            { required: true, message: '请输入公共场所面积', trigger: 'blur' }
          ],
          mnum: [
            { required: true, message: '请输入月租车位数', trigger: 'blur' }
          ],
          hnum: [
            { required: true, message: '请输入房屋数量', trigger: 'blur' }
          ],
          payArea: [
            { required: true, message: '请输入交付面积', trigger: 'blur' }
          ]
        }
        this.editList = [
          {
            name: '项目名称',
            type: 'text',
            readonly: false,
            prop: 'vname'
          },
          {
            name: '楼盘地址',
            type: 'text',
            readonly: false,
            prop: 'vaddr'
          },
          {
            name: '总占地面积(m²)',
            type: 'number',
            readonly: false,
            prop: 'area'
          },
          {
            name: '总建筑面积(m²)',
            type: 'number',
            readonly: false,
            prop: 'barea'
          },
          {
            name: '车位数量(个)',
            type: 'number',
            readonly: false,
            prop: 'pnum'
          },
          {
            name: '总使用面积(m²)',
            type: 'number',
            readonly: false,
            prop: 'uarea'
          },
          {
            name: '容积率(%)',
            type: 'number',
            readonly: false,
            prop: 'far'
          },
          {
            name: '绿化率(%)',
            type: 'number',
            readonly: false,
            prop: 'greenrate'
          },
          {
            name: '公共场所面积(m²)',
            type: 'number',
            readonly: false,
            prop: 'public'
          },
          {
            name: '月租车位数量(个)',
            type: 'number',
            readonly: false,
            prop: 'mnum'
          },
          {
            name: '房屋数量(套)',
            type: 'number',
            readonly: false,
            prop: 'hnum'
          },
          {
            name: '交互面积(m²)',
            type: 'number',
            readonly: false,
            prop: 'payArea'
          }
        ]
        break
      case 'building':
        this.ruleForm = {
          vname: this.infoObj.village ? this.infoObj.village.villagename : '',
          bname: this.infoObj.block ? this.infoObj.block : '',
          barea: this.infoObj.buildareas ? this.infoObj.buildareas : '',
          uarea: this.infoObj.useareas ? this.infoObj.useareas : '',
          greenrate: this.infoObj.greenareas ? this.infoObj.greenareas : '',
          type: this.infoObj.buildstructure ? this.infoObj.buildstructure : '',
          rnum: this.infoObj.unitnum ? this.infoObj.unitnum : ''
        }
        this.rules = {
          vname: [
            { required: false, message: '请输入所属项目', trigger: 'blur' }
          ],
          bname: [
            { required: true, message: '请输入楼栋名称', trigger: 'blur' }
          ],
          barea: [
            { required: true, message: '请输入建筑面积', trigger: 'blur' }
          ],
          uarea: [
            { required: true, message: '请输入使用面积', trigger: 'blur' }
          ],
          greenrate: [
            { required: true, message: '请输入绿化面积', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择建筑类型', trigger: 'change' }
          ],
          rnum: [
            { required: false, message: '请输入资源数量', trigger: 'blur' }
          ]
        }
        this.editList = [
          {
            name: '所属项目',
            prop: 'vname',
            type: 'text',
            readonly: true
          },
          {
            name: '楼栋名称',
            prop: 'bname',
            type: 'text',
            readonly: false
          },
          {
            name: '建筑面积(m²)',
            prop: 'barea',
            type: 'number',
            readonly: false
          },
          {
            name: '使用面积(m²)',
            prop: 'uarea',
            type: 'number',
            readonly: false
          },
          {
            name: '绿化面积(m²)',
            prop: 'greenrate',
            type: 'number',
            readonly: false
          },
          {
            name: '建筑类型',
            prop: 'type',
            type: 'select4',
            readonly: false
          },
          {
            name: '资源数量',
            prop: 'rnum',
            type: 'number',
            readonly: true
          }
        ]
        this.getBuildTypes()
        break
      case 'owner':
        this.ruleForm = {
          oname: this.infoObj.realname ? this.infoObj.realname : '',
          sex: this.infoObj.sex == '男' ? 1 : this.infoObj.sex == '女' ? 2 : 0,
          idcard: this.infoObj.idcard ? this.infoObj.idcard : '',
          otype: this.infoObj.owner_type ? this.infoObj.owner_type.id : '',
          tel: this.infoObj.tel ? this.infoObj.tel : '',
          charge:
            this.infoObj.charge_type || this.infoObj.charge_type == 0
              ? this.infoObj.charge_type
              : ''
        }
        this.rules = {
          oname: [
            { required: false, message: '请输入客户姓名', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择客户性别', trigger: 'change' }
          ],
          idcard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
          otype: [
            { required: true, message: '请选择客户类型', trigger: 'change' }
          ],
          tel: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
          charge: [
            { required: true, message: '请选择是否开启计费', trigger: 'change' }
          ]
        }
        this.editList = [
          {
            name: '客户姓名',
            prop: 'oname',
            type: 'text',
            readonly: true
          },
          {
            name: '客户性别',
            prop: 'sex',
            type: 'select1',
            readonly: false
          },
          {
            name: '身份证号',
            prop: 'idcard',
            type: 'text',
            readonly: false
          },
          {
            name: '客户类型',
            prop: 'otype',
            type: 'select2',
            readonly: false
          },
          {
            name: '联系电话',
            prop: 'tel',
            type: 'text',
            readonly: false
          },
          {
            name: '是否开启计费',
            prop: 'charge',
            type: 'select3',
            readonly: false
          }
        ]
        // 获取客户类型
        this.$axios
          .post(this.$api.state.Means.userType.url)
          .then(res => {
            if (res.Code === 200) {
              this.typeOptions = res.Data
              res.Data.forEach(item => {
                if (item.label == this.infoObj.type) {
                  this.editList[3].value = item.value
                  return
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '获取用户类型失败！'
              })
            }
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '获取用户类型失败！'
            })
          })
        break
    }
  },

  /**
   * 方法
   */
  methods: {
    // 搜索框搜索处理
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        // 搜索管家
        this.$axios
          .post(this.$api.state.Public.getUsers.url, { keywords: query })
          .then(res => {
            if (res.Code === 200) {
              this.userOptions = res.Data ? res.Data : []
            } else {
              let msg = res.Message ? res.Message : '获取楼栋管家数据失败！'
              this.$message({
                type: 'error',
                message: msg
              })
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.userOptions = []
      }
    },

    // 获取楼宇类型数据
    getBuildTypes() {
      this.$axios
        .post(this.$api.state.Means.buildType.url)
        .then(res => {
          if (res.Code === 200) {
            this.btypeOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '获取楼宇类型数据失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less">
#info-edit {
  border-top: 1px solid #ebebeb;
  padding: 0 5px;
  .input-content {
    display: flex;
    flex-wrap: wrap;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      padding: 15px;
      .el-form-item {
        width: 25%;
        padding: 0 15px;
        box-sizing: border-box;
        margin-bottom: 30px !important;
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
