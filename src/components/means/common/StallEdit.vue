<template>
  <div id="stall-edit">
    <el-scrollbar style="height: 100%;">
      <div class="title" v-if="type == 'car'">
        <i class="iconfont iconcheku"></i>
        <span>固定车位</span>
      </div>
      <div class="title" v-if="type == 'carmonth'">
        <i class="iconfont iconcheku"></i>
        <span>{{ infoObj.resourcestype.name }}</span>
      </div>
      <div class="title" v-if="type == 'car_nonmotor'">
        <i class="iconfont iconfeijidongche"></i>
        <span>非机动车</span>
      </div>
      <div class="input-content">
        <div class="input-item" v-for="(item, index) in editList" :key="index">
          <div class="name">{{ item.name }}</div>
          <el-select
            v-model="item.value"
            clearable
            multiple
            collapse-tags
            :placeholder="`请选择${item.name}`"
            v-if="item.type == 'subject'"
          >
            <el-option
              v-for="itm in subjectOptions"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="item.value"
            clearable
            :placeholder="`请选择${item.name}`"
            v-else-if="item.type == 'carType'"
            @change="typeChange"
          >
            <el-option
              v-for="itm in carTypes"
              :key="itm.id"
              :label="itm.name"
              :value="itm.id"
            ></el-option>
          </el-select>
          <el-date-picker
            v-else-if="item.type == 'date'"
            v-model="item.value"
            :disabled="item.readonly"
            type="date"
            placeholder="请选择日期"
            value-format="timestamp"
          ></el-date-picker>
          <el-input
            v-else
            v-model="item.value"
            :type="item.type"
            :readonly="item.readonly"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div
          class="input-item"
          style="width: 16.5rem;"
          v-if="type == 'lastvirtual'"
        >
          <div class="name">客户姓名</div>
          <!-- 搜索部分 -->
          <el-autocomplete
            ref="searchInput"
            class="stall-search"
            popper-class="my-autocomplete"
            v-model="autoValue"
            :debounce="0"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入姓名或电话号码搜索"
            @select="handleSelect"
            @blur="autoBlur"
          >
            <i class="iconfont iconzu3664 el-input__icon" slot="suffix"></i>
            <template slot-scope="{ item }">
              <div class="tr-item">
                <span class="td-item">{{ item.realname }}</span>
                <span class="td-item">{{ item.sex ? item.sex : '未知' }}</span>
                <span class="td-item">{{ item.tel }}</span>
              </div>
              <div
                class="load-more"
                @click.stop="loadMore"
                v-if="
                  allUserList.length > 1 &&
                    item.id == allUserList[allUserList.length - 1].id
                "
              >
                {{ nomore ? '没有更多了' : '点击加载更多' }}
              </div>
              <div
                class="load-more"
                @click.stop="loadMore"
                v-if="allUserList.length <= 1"
              >
                暂无数据！
              </div>
            </template>
          </el-autocomplete>
        </div>
      </div>

      <div class="file-upload" v-if="type == 'car'">
        <div class="title">上传合同文件</div>
        <el-upload
          ref="upload"
          :action="qiniuDatas.domain ? qiniuDatas.domain : ''"
          list-type="picture-card"
          :http-request="customUpload"
          :limit="1"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" top="5vh">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
      <!-- 固定车位绑定车牌 -->
      <div class="bind-plate" v-if="type == 'car'">
        <div class="title">绑定车牌</div>
        <ul class="info-wp">
          <li v-for="(item, index) in plateInfo" :key="index">
            <div class="info-item">
              <div class="name">
                <span style="color: #f56c6c;">*</span>
                车牌号
              </div>
              <el-input
                v-model="item.plates"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <div class="info-item">
              <div class="name">
                <span style="color: #f56c6c;">*</span>
                车主姓名
              </div>
              <el-input v-model="item.name" placeholder="请输入内容"></el-input>
            </div>
            <div class="info-item">
              <div class="name">
                <span style="color: #f56c6c;">*</span>
                联系电话
              </div>
              <el-input
                v-model="item.tel"
                type="number"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <div class="info-item" v-if="plateInfo.length > 1">
              <div class="name"></div>
              <i class="el-icon-delete-solid" @click="deletePlate(index)"></i>
            </div>
          </li>
          <li class="ico-wp">
            <div class="info-item">
              <i class="iconfont iconxinzeng" @click="addPlate"></i>
            </div>
          </li>
        </ul>
      </div>
      <!-- 月租车位绑定车牌 -->
      <div class="plate-bind" v-if="type == 'carmonth' || type == 'insideitem'">
        <div class="title">绑定车牌</div>
        <ul>
          <li v-for="(item, index) in plateList" :key="index">
            <div class="name">车牌号{{ index + 1 }}</div>
            <i
              class="del el-icon-circle-close"
              v-if="plateList.length > 1"
              @click="delMonthPlate(index)"
            ></i>
            <el-input
              v-model="item.plates"
              placeholder="请输入车牌号"
            ></el-input>
          </li>
          <li class="icon">
            <div class="name"></div>
            <i class="iconfont iconxinzeng" @click="addMonthPlate"></i>
          </li>
        </ul>
      </div>

      <!-- IC卡绑定部分 -->
      <div class="ic-wp" v-if="hasPark">
        <!-- IC卡绑定部分 -->
        <div class="title">IC卡绑定</div>
        <div class="ic-item">
          <div class="name">IC卡卡号</div>
          <el-input v-model="iccode" placeholder="请输入IC卡卡号"></el-input>
        </div>
      </div>
      <!-- 备注部分 -->
      <div :class="['remark-wp', type == 'car_nonmotor' ? 'novehicle' : '']">
        <div class="title">备注</div>
        <el-input
          type="textarea"
          :rows="3"
          resize="none"
          v-model="remarkVal"
          placeholder="请输入备注信息"
        ></el-input>
      </div>
      <div class="btn-wp">
        <el-button :loading="isCommit" type="primary" round @click="editSave">
          保存修改
        </el-button>
        <el-button :loading="isCommit" type="info" round @click="editCancel">
          取消
        </el-button>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
// 引入七牛云上传文件
import qiniuUpload from '@/assets/common/js/qiniuUpload.js'

export default {
  name: 'StallEdit',
  props: {
    // 当前编辑类型（项目、楼栋、业主）
    type: String,
    infoObj: Object
  },
  data() {
    return {
      // 接口对象
      urlObj: {
        uploadToken: this.$api.state.Public.uploadToken.url,
        saveUploadInfo: this.$api.state.Public.saveUploadInfo.url,
        parkingEdit: this.$api.state.Means.parkingEdit.url,
        monthParkingEdit: this.$api.state.Means.monthParkingEdit.url,
        novehicleEdit: this.$api.state.Means.novehicleEdit.url,
        carType: this.$api.state.Means.carType.url,
        insideEdit: this.$api.state.Means.insideEdit.url,
        subjectList: this.$api.state.Public.subjectList.url,
        virtualEdit: this.$api.state.Means.virtualEdit.url,
        userSearch: this.$api.state.Means.userSearch.url,
        delFile: this.$api.state.Public.delFile.url,
        subjectbytype: this.$api.state.Public.subjectbytype.url
      },
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
      // 固定车位 车牌信息
      plateInfo: [],
      // 月租车位 车牌信息
      plateList: [],
      // 图片/文件上传参数
      qiniuDatas: '',
      // 当前要上传文件的信息
      fileInfo: {},
      // 预览文件的 url
      dialogImageUrl: '',
      // 是否打开预览弹框
      dialogVisible: false,
      // 备注绑定值
      remarkVal: '',
      // 车辆类型列表
      carTypes: [],
      // 缴费科目列表
      subjectOptions: [],
      // 用户搜索框绑定值
      autoValue: '',
      // 当前用户信息数据
      currentUser: {},
      // 用户列表
      allUserList: [],
      // 没有更多数据
      nomore: false,
      // 是否正在提交数据
      isCommit: false,
      // IC卡卡号
      iccode: '',
      // 是否有车场
      hasPark: false
    }
  },

  /**
   * 生命周期
   */
  created() {
    switch (this.type) {
      case 'car':
        let y,
          m,
          d = ''
        if (this.infoObj.starttime) {
          y = this.infoObj.starttime.slice(0, 4)
          m = this.infoObj.starttime.slice(4, 6)
          d = this.infoObj.starttime.slice(6, 8)
        }
        this.editList = [
          {
            name: '车主姓名',
            value: this.infoObj.non_owner_name,
            type: 'text',
            readonly: false
          },
          {
            name: '联系电话',
            value: this.infoObj.non_owner_tel,
            type: 'number',
            readonly: false
          },
          {
            name: '身份证号',
            value: this.infoObj.non_owner_id,
            type: 'text',
            readonly: false
          },
          {
            name: '车位名称',
            value: this.infoObj.sort,
            type: 'text',
            readonly: true
          },
          {
            name: '资源类型',
            value: this.infoObj.resourcestype.name,
            type: 'text',
            readonly: true
          },
          {
            name: '使用类型',
            value: '购买',
            type: 'text',
            readonly: true
          },
          {
            name: '使用周期',
            value:
              this.infoObj.starttime && this.infoObj.endtime
                ? this.infoObj.starttime + ' - ' + this.infoObj.endtime
                : '',
            type: 'text',
            readonly: true
          },
          {
            name: '启用日期',
            value: this.infoObj.starttime
              ? new Date(y + '-' + m + '-' + d).getTime()
              : '',
            type: 'date',
            readonly: this.infoObj.starttime ? true : false
          }
        ]
        if (this.infoObj.carmotor && this.infoObj.carmotor.length > 0) {
          let arr = []
          this.infoObj.carmotor.forEach(item => {
            let obj = {
              id: item.id,
              name: item.name,
              tel: item.tel,
              plates: item.plates
            }
            arr.push(obj)
          })
          this.plateInfo = arr
        } else {
          this.plateInfo = [
            {
              name: '',
              tel: '',
              plates: ''
            }
          ]
        }
        this.getUploadToken()
        break
      case 'carmonth':
        let y1,
          m1,
          d1 = ''
        if (this.infoObj.starttime) {
          y1 = this.infoObj.starttime.slice(0, 4)
          m1 = this.infoObj.starttime.slice(4, 6)
          d1 = this.infoObj.starttime.slice(6, 8)
        }
        this.editList = [
          {
            name: '车主姓名',
            value: this.infoObj.non_owner_name,
            type: 'text',
            readonly: false
          },
          {
            name: '联系电话',
            value: this.infoObj.non_owner_tel,
            type: 'text',
            readonly: false
          },
          {
            name: '身份证号',
            value: this.infoObj.non_owner_id,
            type: 'text',
            readonly: false
          },
          {
            name: '客户类型',
            value:
              this.infoObj.owner && this.infoObj.owner.ownerType.name
                ? this.infoObj.owner.ownerType.name
                : '',
            type: 'text',
            readonly: true
          },
          {
            name: '车位面积()',
            value: this.infoObj.area,
            type: 'text',
            readonly: false
          },
          {
            name: '资源类型',
            value: this.infoObj.resourcestype.name,
            type: 'text',
            readonly: true
          },
          {
            name: '使用方式',
            value: '租用',
            type: 'text',
            readonly: true
          },
          {
            name: '启用日期',
            value: this.infoObj.starttime
              ? new Date(y1 + '-' + m1 + '-' + d1).getTime()
              : '',
            type: 'date',
            readonly: this.infoObj.starttime ? true : false
          }
        ]
        if (this.infoObj.carmotor && this.infoObj.carmotor.length > 0) {
          let arr = []
          this.infoObj.carmotor.forEach(item => {
            let obj = {
              id: item.id,
              plates: item.plates
            }
            arr.push(obj)
          })
          this.plateList = arr
        } else {
          this.plateList = [{ plates: '' }]
        }
        break
      case 'car_nonmotor':
        let arr = []
        if (this.infoObj.subject_arr && this.infoObj.subject_arr.length > 0) {
          this.infoObj.subject_arr.forEach(item => {
            if (item.id) {
              arr.push(item.id)
            }
          })
        }
        this.editList = [
          {
            name: '车主姓名',
            value: this.infoObj.non_owner_name,
            type: 'text',
            readonly: false
          },
          {
            name: '联系电话',
            value: this.infoObj.non_owner_tel,
            type: 'text',
            readonly: false
          },
          {
            name: '身份证号',
            value: this.infoObj.non_owner_id,
            type: 'text',
            readonly: false
          },
          {
            name: '车牌号',
            value: this.infoObj.plates,
            type: 'text',
            readonly: false
          },
          {
            name: '车辆类型',
            value: this.infoObj.resources_type_id,
            type: 'carType',
            readonly: false
          },
          {
            name: '收费科目',
            value: arr,
            type: 'subject',
            readonly: false
          },
          {
            name: '使用周期',
            value:
              this.infoObj.starttime && this.infoObj.endtime
                ? this.infoObj.starttime + ' - ' + this.infoObj.endtime
                : '',
            type: 'text',
            readonly: true
          }
        ]
        this.iccode =
          this.infoObj.iccard_data && this.infoObj.iccard_data.code
            ? this.infoObj.iccard_data.code
            : ''
        this.remarkVal = this.infoObj.remark
        // 获取车辆类型
        this.getCarType()
        if (this.infoObj.resources_type_id) {
          // 获取科目列表
          this.getSubjects()
        }
        this.getTemporary()
        break
      case 'insideitem':
        this.editList = [
          {
            name: '员工姓名',
            value: this.infoObj.non_owner_name,
            type: 'text',
            readonly: false
          },
          {
            name: '联系电话',
            value: this.infoObj.non_owner_tel,
            type: 'text',
            readonly: false
          },
          {
            name: '开始日期',
            value: this.dateToTimestamp(this.infoObj.starttime),
            type: 'date',
            readonly: false
          },
          {
            name: '截止日期',
            value: this.dateToTimestamp(this.infoObj.endtime),
            type: 'date',
            readonly: false
          }
        ]
        if (this.infoObj.carmotor && this.infoObj.carmotor.length > 0) {
          let arr = []
          this.infoObj.carmotor.forEach(item => {
            let obj = {
              id: item.id,
              plates: item.plates
            }
            arr.push(obj)
          })
          this.plateList = arr
        } else {
          this.plateList = [{ plates: '' }]
        }
        this.remarkVal = this.infoObj.remark
        break
      case 'lastvirtual':
        let sid = []
        if (this.infoObj.subject_arr && this.infoObj.subject_arr.length > 0) {
          sid = this.infoObj.subject_arr.map(item => item.id)
        }
        this.editList = [
          {
            name: '资源名称',
            value: this.infoObj.name ? this.infoObj.name : '',
            type: 'text',
            readonly: false
          },
          {
            name: '资源面积',
            value: this.infoObj.area ? this.infoObj.area : '',
            type: 'text',
            readonly: false
          },
          {
            name: '首次缴费时间',
            value: this.infoObj.turned_time
              ? this.infoObj.turned_time * 1000
              : '',
            type: 'date',
            readonly: false
          },
          {
            name: '缴费科目',
            value: sid,
            type: 'subject',
            readonly: false
          }
        ]
        if (this.infoObj.owner) {
          this.autoValue = this.infoObj.owner.realname
          this.currentUser = {
            id: this.infoObj.oid,
            realname: this.infoObj.owner.realname
          }
        }
        this.remarkVal = this.infoObj.bz
        this.getSubjects()
        break
    }
  },

  /**
   * 方法
   */
  methods: {
    // 年月日转时间戳
    dateToTimestamp(dateStr) {
      if (!dateStr) {
        return ''
      }
      let newDataStr = dateStr.replace(/\.|\-/g, '/')
      let date = new Date(newDataStr)
      let timestamp = date.getTime()
      return timestamp
    },

    // 获取文件上传 token
    getUploadToken() {
      this.$axios.post(this.urlObj.uploadToken).then(res => {
        if (res.Code === 200) {
          this.qiniuDatas = res.Data
        }
      })
    },

    // 获取车辆类型
    getCarType() {
      this.$axios
        .post(this.urlObj.carType, {
          vid: this.infoObj.vid,
          type: 'car_nonmotor'
        })
        .then(res => {
          if (res.Code === 200) {
            this.carTypes = res.Data
          } else {
            let msg = res.Message ? res.Message : '车辆类型数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '车辆类型数据获取失败！'
          })
        })
    },

    // 获取缴费科目
    getSubjects() {
      let url = ''
      let data = {
        vid: this.infoObj.vid
      }
      if (this.type == 'car_nonmotor') {
        data.resource_type_id = this.editList[4].value
        url = this.urlObj.subjectbytype
      } else if (this.type == 'lastvirtual') {
        url = this.urlObj.subjectList
      }
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            this.subjectOptions = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '缴费科目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '缴费科目数据获取失败！'
          })
        })
    },

    // 车辆类型改变处理
    typeChange(value) {
      if (this.type == 'car_nonmotor') {
        this.editList[5].value = ''
        this.subjectOptions = []
        this.getSubjects()
      }
    },

    // 获取项目下是否存在非机动车临停车场
    getTemporary() {
      this.$axios
        .post(this.$api.state.Means.gettemporary.url, { vid: this.infoObj.vid })
        .then(res => {
          if (res.Code === 200) {
            this.hasPark = res.Data.has_temporary == 1 ? true : false
          } else {
            let msg = res.Message
              ? res.Message
              : '非机动车临停车场数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
        })
        .catch(() => {})
    },

    // 搜索获取过户业主数据
    async querySearchAsync(queryStr, cb) {
      let value = {
        keywords: queryStr,
        page: 1,
        limit: 20,
        vid: this.infoObj.vid
      }
      let res = await this.$axios.post(this.urlObj.userSearch, value)
      if (res.Code === 200) {
        let first = {
          id: 0,
          realname: '姓名',
          sex: '性别',
          tel: '电话号码'
        }
        res.Data.data.unshift(first)
        this.allUserList = res.Data.data
        this.nomore = false
        cb(res.Data.data)
      } else {
        this.$refs.searchInput.$children[0].blur()
      }
    },

    // 加载更多用户数据
    async loadMore() {
      if (!this.nomore) {
        let value = {
          keywords: this.autoValue,
          page: Math.ceil(this.allUserList.length / 20) + 1,
          limit: 20,
          vid: this.infoObj.vid
        }
        let res = await this.$axios.post(
          this.$api.state.Means.userSearch.url,
          value
        )
        if (res.Code === 200) {
          if (res.Data.data.length > 0) {
            this.allUserList = this.allUserList.concat(res.Data.data)
            this.$refs.searchInput.suggestions = this.allUserList
          } else {
            this.nomore = true
          }
        }
      }
    },

    // 选择用户处理
    handleSelect(user) {
      this.currentUser = user
      this.autoValue = user.realname
    },

    // 搜索框失去焦点处理
    autoBlur() {
      this.autoValue = this.currentUser.realname
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

    // 文件保存到数据库
    saveFile(data, uid) {
      this.$axios.post(this.urlObj.saveUploadInfo, data).then(res => {
        if (res.Code === 200) {
          this.fileInfo = {
            id: res.Data.id,
            uid: uid
          }
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
      // 删除数据库和七牛云文件
      this.$axios
        .post(this.urlObj.delFile, { id: this.fileInfo.id })
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
      this.fileInfo = {}
    },

    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 点击车牌添加图标处理（固定车位）
    addPlate() {
      let data = {
        name: '',
        tel: '',
        plates: ''
      }
      this.plateInfo.push(data)
    },

    // 点击车牌删除图标处理（固定车位）
    deletePlate(index) {
      this.plateInfo.splice(index, 1)
    },

    // 点击添加图标处理（月租车位）
    addMonthPlate() {
      let data = {
        plates: ''
      }
      this.plateList.push(data)
    },

    // 点击绑定车牌删除图标处理（月租车位）
    delMonthPlate(index) {
      this.plateList.splice(index, 1)
    },

    // 点击保存修改处理
    editSave() {
      // 验证必填项是否未填
      let msg = ''
      let url = ''
      let data = {
        id: this.infoObj.id,
        non_owner_name: this.editList[0].value,
        non_owner_tel: this.editList[1].value,
        non_owner_id: this.editList[2].value,
        remark: this.remarkVal,
        plates: []
      }
      let arr = [
        {
          name: '车主姓名',
          value: data.non_owner_name
        },
        {
          name: '联系电话',
          value: data.non_owner_tel
        },
        {
          name: '身份证号',
          value: data.non_owner_id
        }
      ]
      switch (this.type) {
        case 'car':
          url = this.urlObj.parkingEdit
          data.starttime = this.editList[7].value
          let arr1 = [
            {
              name: '启用日期',
              value: data.starttime
            },
            {
              name: '车牌信息',
              value: true
            }
          ]
          this.plateInfo.forEach(item => {
            if (item.name && item.tel && item.plates) {
              data.plates.push(item)
            } else if (!item.name && !item.tel && !item.plates) {
            } else {
              arr1[0].value = false
            }
          })
          if (data.plates.length == 0) {
            arr1[0].value = false
          }
          if (this.fileInfo.id) {
            data.ht_file_id = this.fileInfo.id
          }
          arr = arr.concat(arr1)
          break
        case 'carmonth':
          url = this.urlObj.monthParkingEdit
          data.area = this.editList[4].value
          data.starttime = this.editList[7].value
          this.plateList.forEach(item => {
            if (item.plates) {
              data.plates.push(item)
            }
          })
          let arr2 = [
            {
              name: '车位面积',
              value: data.area
            },
            {
              name: '启用日期',
              value: data.starttime
            },
            {
              name: '车牌号',
              value: data.plates.length > 0 ? true : false
            }
          ]
          arr = arr.concat(arr2)
          break
        case 'car_nonmotor':
          url = this.urlObj.novehicleEdit
          data.oid = this.infoObj.oid
          data.plates = this.editList[3].value
          data.resources_type_id = this.editList[4].value
          data.subject_village_arr = this.editList[5].value
          let arr3 = [
            {
              name: '车牌号',
              value: data.plates
            },
            {
              name: '车辆类型',
              value: data.resources_type_id
            },
            {
              name: '收费科目',
              value: data.subject_village_arr.length > 0 ? true : false
            }
          ]
          if (this.hasPark) {
            data.ic_card_code = this.iccode
            arr3.push({ name: 'IC卡卡号', value: data.ic_card_code })
          }
          arr = arr.concat(arr3)
          break
        case 'insideitem':
          url = this.urlObj.insideEdit
          delete data.non_owner_id
          arr.pop()
          data.id = this.infoObj.id
          data.starttime = this.editList[2].value / 1000
          data.endtime = this.editList[3].value / 1000
          data.remark = this.remarkVal
          this.plateList.forEach(item => {
            if (item.plates) {
              data.plates.push(item)
            }
          })
          let arr4 = [
            {
              name: '开始日期',
              value: data.starttime
            },
            {
              name: '截止日期',
              value: data.endtime
            },
            {
              name: '车牌号',
              value: data.plates.length > 0 ? true : false
            }
          ]
          arr = arr.concat(arr4)
          break
        case 'lastvirtual':
          url = this.urlObj.virtualEdit
          data = {
            id: this.infoObj.id,
            name: this.editList[0].value,
            area: this.editList[1].value,
            turned: this.editList[2].value / 1000,
            subject_village_arr: this.editList[3].value,
            bz: this.remarkVal,
            oid: this.currentUser.id
          }
          arr = [
            {
              name: '资源名称',
              value: data.name
            },
            {
              name: '资源面积',
              value: data.area
            },
            {
              name: '首次缴费时间',
              value: data.turned
            },
            {
              name: '缴费科目',
              value: data.subject_village_arr.length > 0 ? true : false
            },
            {
              name: '客户姓名',
              value: data.oid
            }
          ]
          break
      }
      arr.forEach(item => {
        if (!item.value) {
          if (!msg) {
            msg = '请填写' + item.name
          } else {
            msg = msg + '、' + item.name
          }
        }
      })
      if (!msg) {
        this.editComit(url, data)
      } else {
        this.$message({
          type: 'warning',
          message: msg
        })
      }
    },

    // 修改请求提交
    async editComit(url, data) {
      this.isCommit = true
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '信息修改成功！'
            })
            // 重新获取车位详情数据
            this.$emit('editSuccess')
          } else {
            let msg = res.Message ? res.Message : '数据提交失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isCommit = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '数据提交失败！'
          })
          this.isCommit = false
        })
    },

    // 点击取消按钮处理
    editCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
.el-autocomplete.stall-search {
  width: 100%;
  margin: 0;
}
#stall-edit {
  height: 100%;
  background-color: #fff;
  .el-scrollbar__view {
    > .title {
      font-size: 16px;
      line-height: 30px;
      font-weight: 700;
      padding: 15px 25px;
      border-bottom: 1px solid #ebebeb;
      > i {
        display: inline-block;
        color: #3ebb75;
        margin-right: 5px;
        font-size: 20px;
        font-weight: normal;
        line-height: 30px;
        vertical-align: middle;
      }
      > span {
        display: inline-block;
        line-height: 30px;
        vertical-align: middle;
      }
    }
  }

  .input-content {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    border-bottom: 1px solid #ebebeb;
    .input-item {
      width: 25%;
      min-width: 175px;
      padding: 30px 25px 0;
      box-sizing: border-box;
      .name {
        font-size: 15px;
        line-height: 26px;
        color: #666;
        margin-bottom: 10px;
      }
      .el-date-editor {
        width: 100%;
      }
    }
  }

  .file-upload {
    padding: 30px 30px 0;
    .title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .el-dialog .el-dialog__header {
      background-color: #fff;
    }
    .el-upload-list {
      .el-upload-list__item {
        width: 80px;
        height: 80px;
        margin: 0 15px 0 0;
      }
    }
    .el-upload {
      width: 80px;
      height: 80px;
      line-height: 80px;
      background-color: #fff;
      .el-icon-plus {
        line-height: 80px;
      }
    }
  }
  .bind-plate {
    padding: 30px;
    .title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .info-wp {
      margin: 0 -15px;
      li {
        margin-bottom: 20px;
        display: flex;
        .info-item {
          box-sizing: border-box;
          width: 25%;
          padding: 0 15px;
          .name {
            height: 24px;
            font-size: 15px;
            color: #666;
            line-height: 24px;
            margin-bottom: 10px;
          }
          i {
            line-height: 40px;
            font-size: 16px;
            cursor: pointer;
            color: #ccc;
          }
          i:hover {
            color: #ffcb3c;
          }
        }
      }
      li.ico-wp {
        margin-top: 30px;
        margin-bottom: 0;
        .info-item {
          i {
            display: inline-block;
            width: 100%;
            height: 40px;
            border: 1px dashed #d2d2d2;
            border-radius: 5px;
            box-sizing: border-box;
            text-align: center;
            line-height: 40px;
            color: #afafaf;
            cursor: pointer;
          }
        }
      }
    }
  }
  .plate-bind {
    .title {
      font-size: 16px;
      line-height: 30px;
      font-weight: 700;
      color: #333;
      padding: 20px 30px;
    }
    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding: 0 15px;
      li {
        width: 25%;
        padding: 0 15px;
        box-sizing: border-box;
        margin-bottom: 20px;
        position: relative;
        .name {
          height: 24px;
          font-size: 15px;
          line-height: 24px;
          color: #666;
          margin-bottom: 10px;
        }
        .del {
          display: none;
          position: absolute;
          top: 5px;
          right: 15px;
          color: #ccc;
          cursor: pointer;
        }
      }
      li:hover {
        .del {
          display: block;
        }
      }
      li.icon {
        i {
          display: inline-block;
          width: 100%;
          height: 40px;
          border: 1px dashed #cccccc;
          border-radius: 6px;
          box-sizing: border-box;
          line-height: 40px;
          text-align: center;
          color: #999;
          cursor: pointer;
        }
      }
    }
  }
  .ic-wp {
    .title {
      padding: 20px 25px 15px;
      font-weight: 700;
      font-size: 15px;
      color: #333;
    }
    .ic-item {
      display: inline-block;
      width: 25%;
      padding: 0 25px;
      box-sizing: border-box;
      .name {
        font-size: 15px;
        color: #666;
        margin-bottom: 10px;
      }
    }
  }
  .remark-wp {
    padding: 10px 30px 20px;
    .title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .el-textarea {
      textarea {
        border: none;
        background-color: #f7f7f7;
        border-radius: 6px;
      }
    }
  }
  .remark-wp.novehicle {
    padding: 30px;
  }
  .btn-wp {
    text-align: center;
    padding: 20px 0 30px;
  }
}
</style>
