<template>
  <div id="editVillage">
    <el-dialog
      class="dialog-editvillage"
      :title="baseInfo.villagename + '-人员设置'"
      :visible.sync="conf.show"
      :close-on-click-modal="false"
      width="30%"
      @close="closeDialog"
    >
      <el-scrollbar style="height: 100%;">
        <el-form :model="form" :rules="rules" ref="editForm">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="pro_uid">
                <span class="form-title">项目负责人</span>
                <el-select
                  v-model="form.pro_uid"
                  placeholder="请输入姓名、手机号"
                  filterable
                  remote
                  :remote-method="inputProUser"
                  :loading="proUser.isLoading"
                >
                  <el-option
                    :label="v.uname"
                    :value="v.uid"
                    v-for="(v, i) in proUser.datas"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item prop="cus_uid">
                <span class="form-title">客服负责人</span>
                <el-select
                  v-model="form.cus_uid"
                  placeholder="请输入姓名、手机号"
                  filterable
                  remote
                  :remote-method="inputCusUser"
                  :loading="cusUser.isLoading"
                >
                  <el-option
                    :label="v.uname"
                    :value="v.uid"
                    v-for="(v, i) in cusUser.datas"
                    :key="i"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="use_receipt_type">
                <span class="form-title">开票类型</span>
                <el-select
                  v-model="form.use_receipt_type"
                  placeholder="请选择开票类型"
                >
                  <el-option label="电子收据" :value="1"></el-option>
                  <el-option label="纸质收据" :value="2"></el-option>
                  <el-option label="同时使用" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="file-upload">
            <el-form-item prop="fileInfo">
              <div class="title">上传收据印章</div>
              <el-upload
                ref="upload"
                :action="qiniuDatas.domain"
                :limit="1"
                :file-list="fileList"
                list-type="picture-card"
                :http-request="customUpload"
                :on-preview="handlePictureCardPreview"
                :before-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </div>
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

    <!-- 图片预览部分 -->
    <el-image
      ref="preview"
      :src="imgSrc"
      :preview-src-list="imgList"
      :z-index="10000"
      style="height: 0;width:0;"
    ></el-image>
  </div>
</template>

<script>
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'
export default {
  name: 'editVillage',
  props: ['qiniuDatas'],
  data() {
    return {
      baseInfo: [],
      form: {
        vid: '',
        pro_uid: '',
        cus_uid: '',
        fileInfo: '',
        sign: 'more',
        token: this.$api.state.System.village.edit.token,
        use_receipt_type: 1
      },
      rules: {
        pro_uid: [
          {
            required: false,
            message: '请选择项目负责人',
            trigger: 'blur'
          }
        ],
        cus_uid: [
          {
            required: false,
            message: '请选择客服负责人',
            trigger: 'blur'
          }
        ],
        use_receipt_type: [
          {
            required: true,
            message: '请选择开票类型',
            trigger: 'change'
          }
        ],
        fileInfo: [
          { required: false, message: '请上传收据印章', trigger: 'change' }
        ]
      },
      proUser: {
        datas: [],
        isLoading: false
      },
      cusUser: {
        datas: [],
        isLoading: false
      },
      conf: {
        show: false,
        isSubmitLoading: false
      },
      // 预览图片的 src
      imgSrc: '',
      // 预览图片列表
      imgList: [],
      fileList: []
    }
  },

  methods: {
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

    // 文件保存到数据库
    saveFile(data, uid) {
      this.$axios
        .post(this.$api.state.Public.saveUploadInfo.url, data)
        .then(res => {
          if (res.Code === 200) {
            this.form.fileInfo = {
              id: res.Data.id,
              uid: uid
            }
            this.$refs.editForm.validateField('fileInfo')
          } else {
            let msg = res.Message ? res.Message : '文件信息保存失败！'
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
    },

    // 文件、图片删除处理
    handleRemove() {
      this.$confirm(
        '此操作会删除印章，将导致打印票据印章丢失，确定继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 删除数据库和七牛云文件
          this.$axios
            .post(this.$api.state.Public.delFile.url, {
              id: this.form.fileInfo.id
            })
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
          this.$refs.upload.clearFiles()
          this.form.fileInfo = ''
          this.$refs.editForm.validateField('fileInfo')
        })
        .catch(() => {})
      return false
    },

    // 图片预览
    handlePictureCardPreview(file) {
      this.imgSrc = file.url
      this.imgList = [file.url]
      this.$nextTick(() => {
        this.$refs.preview.clickHandler()
      })
    },

    // 点击表格图片处理
    imgPreview(obj) {
      this.handlePictureCardPreview({ url: obj.image_host })
    },

    /* 是否打开弹出层 */
    showDialog(info) {
      // 表单验证重置
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      if (info.file && info.file.id) {
        this.form.fileInfo = {
          id: info.file.id
        }
        this.fileList = [
          {
            name: info.file.filename,
            url: info.file.file_url
          }
        ]
      }
      this.form.use_receipt_type = info.use_receipt_type

      // 编辑行数据
      this.baseInfo = info

      // 设置操作的项目ID
      this.form.vid = this.baseInfo.vid

      // 设置项目负责人默认选中
      this.form.pro_uid = ''
      this.proUser.datas = []
      this.proUser.isLoading = false
      if (parseInt(this.baseInfo.project_uid) > 0) {
        this.form.pro_uid = this.baseInfo.project_uid
        setTimeout(() => {
          this.proUser.datas = [
            {
              uid: this.baseInfo.project_uid,
              uname: this.baseInfo.project_manager
            }
          ]
        }, 100)
      }

      // 设置客户负责人默认选中
      this.form.cus_uid = ''
      this.cusUser.datas = []
      this.cusUser.isLoading = false
      if (parseInt(this.baseInfo.customer_uid) > 0) {
        this.form.cus_uid = this.baseInfo.customer_uid
        setTimeout(() => {
          this.cusUser.datas = [
            {
              uid: this.baseInfo.customer_uid,
              uname: this.baseInfo.customer_manager
            }
          ]
        }, 100)
      }

      // 打开弹出层
      this.conf.show = true
    },

    /* 项目负责人搜索 */
    inputProUser(keywords) {
      let _this = this

      if (keywords) {
        setTimeout(() => {
          // 开启加载状态
          _this.proUser.isLoading = true

          // 发送数据
          _this
            .$axios({
              url: _this.$api.state.Public.user.url,
              method: 'post',
              responseType: 'json',
              data: { keywords: keywords }
            })
            .then(res => {
              if (res.Code === 200) {
                // 数据赋值
                _this.proUser.datas = res.Data.datas

                // 关闭加载状态
                _this.proUser.isLoading = false
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
                // 关闭加载状态
                _this.proUser.isLoading = false

                _this.$message({
                  message: res.Message,
                  type: 'error',
                  offset: 150
                })
              }
            })
            .catch(() => {
              // 关闭加载状态
              _this.proUser.isLoading = false

              _this.$message({
                message: '服务器连接失败',
                type: 'error',
                offset: 150
              })
            })
        }, 200)
      } else {
        // 关闭加载状态
        _this.proUser.isLoading = false
      }
    },

    /* 客服负责人搜索 */
    inputCusUser(keywords) {
      let _this = this
      if (keywords) {
        setTimeout(() => {
          // 开启加载状态
          _this.cusUser.isLoading = true

          // 发送数据
          _this
            .$axios({
              url: _this.$api.state.Public.user.url,
              method: 'post',
              responseType: 'json',
              data: { keywords: keywords }
            })
            .then(res => {
              if (res.Code === 200) {
                // 数据赋值
                _this.cusUser.datas = res.Data.datas

                // 关闭加载状态
                _this.cusUser.isLoading = false
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
                // 关闭加载状态
                _this.cusUser.isLoading = false

                _this.$message({
                  message: res.Message,
                  type: 'error',
                  offset: 150
                })
              }
            })
            .catch(() => {
              // 关闭加载状态
              _this.cusUser.isLoading = false

              _this.$message({
                message: '服务器连接失败',
                type: 'error',
                offset: 150
              })
            })
        }, 200)
      } else {
        // 关闭加载状态
        _this.cusUser.isLoading = false
      }
    },

    /* 项目人员设置 */
    onSubmit() {
      let _this = this

      _this.$refs.editForm.validate(valid => {
        if (valid === false) {
          // 验证不通过
          return false
        }

        // 提交按钮更改为加载中
        _this.conf.isSubmitLoading = true

        // 设置提交数据
        _this.form.input = [
          {
            field: 'seal_image_file_id',
            val: _this.form.fileInfo.id
          },
          {
            field: 'use_receipt_type',
            val: _this.form.use_receipt_type
          }
        ]
        if (_this.form.pro_uid) {
          _this.form.input.push({
            field: 'v_manager',
            val: _this.form.pro_uid
          })
        }
        if (_this.form.cus_uid) {
          _this.form.input.push({
            field: 'customer_manager',
            val: _this.form.cus_uid
          })
        }

        // 发送数据
        _this
          .$axios({
            url: _this.$api.state.System.village.edit.url,
            method: 'post',
            responseType: 'json',
            data: _this.form
          })
          .then(res => {
            if (res.Code === 200) {
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
              _this.$emit('editSuc', true)
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
    },

    closeDialog() {
      this.fileList = []
    }
  }
}
</script>
