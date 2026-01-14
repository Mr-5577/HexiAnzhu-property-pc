export default {
  name: 'insideVehicle',
  data () {
    return {
      urlObj: {
        treeData: this.$api.state.Means.treeData.url,
        addInsideCar: this.$api.state.Means.addInsideCar.url
      },
      // 是否正在加载数据
      isLoading: false,
      // 是否正在提交数据
      isCommit: false,
      // 加载文字
      loadText: '正在加载',
      // 所属模块
      smodule: 1,
      // 员工姓名
      uname: '',
      // 联系电话
      telVal: '',
      // 起止日期
      dateValue: '',
      // 车牌号码列表
      plateList: [{ value: '' }],
      // 备注
      remarkVal: '',
      // 全选框绑定值
      allCheck: false,
      // 当前选择的项目列表
      checkedVillage: [],
      // 城市数据列表
      cityList: []
    }
  },

  /** 计算属性 */
  computed: {
    checkedVillages () {
      let arr = []
      this.cityList.forEach(item => {
        arr = arr.concat(item.checkedVillages)
      })
      return arr
    }
  },

  /**
   * 生命周期
   */
  created () {
    // 获取项目数据
    this.getVillages()
  },

  methods: {
    // 获取当前用户权限下所有项目
    getVillages () {
      this.loadText = '正在加载'
      this.isLoading = true
      this.$axios
        .post(this.urlObj.treeData, { secondData: 0 })
        .then(res => {
          if (res.Code == 200) {
            res.Data.forEach(item => {
              item.check = false
              item.checkedVillages = []
              if (item.children.length > 0) {
                item.children.forEach(itm => {
                  itm.check = false
                })
              }
            })
            this.cityList = res.Data
          } else {
            let msg = res.Message ? res.Message : '项目数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
        })
        .catch(err => {
          this.isLoading = false
        })
    },

    // 点击添加车牌处理
    addPlate () {
      this.plateList.push({ value: '' })
    },

    // 删除车牌
    delPlate (index) {
      if (this.plateList.length > 1) {
        this.plateList.splice(index, 1)
      }
    },

    // 全选处理
    allCheckChange (val) {
      this.cityList.forEach(item => {
        item.check = val
        item.checkedVillages = val ? item.children : []
        item.children.forEach(ite => {
          ite.check = val
        })
      })
    },

    // 城市选择处理
    cityCheckChange (val, index) {
      this.cityList[index].checkedVillages = val
        ? this.cityList[index].children
        : []
      this.cityList[index].children.forEach(item => {
        item.check = val
      })
      let checked = []
      this.cityList.forEach(itm => {
        if (itm.check) {
          checked.push(itm)
        }
      })
      this.allCheck = checked.length === this.cityList.length
    },

    // 项目选择改变处理
    villageCheckChange (val, index) {
      let arr = []
      this.cityList[index].children.forEach(item => {
        if (item.check) {
          arr.push(item)
        }
      })
      this.cityList[index].checkedVillages = arr
      if (val) {
        if (this.cityList[index].children.length === arr.length) {
          this.cityList[index].check = true
        }
        let arr1 = []
        this.cityList.forEach(itm => {
          if (itm.check) {
            arr1.push(itm)
          }
        })
        if (arr1.length === this.cityList.length) {
          this.allCheck = true
        }
      } else {
        this.allCheck = false
        this.cityList[index].check = false
      }
    },

    // 提交数据处理
    dataCommit () {
      let data = {
        userplate: this.smodule,
        non_owner_name: this.uname.trim(),
        non_owner_tel: this.telVal,
        starttime: this.dateValue[0] ? this.dateValue[0] / 1000 : '',
        endtime: this.dateValue[1] ? this.dateValue[1] / 1000 : '',
        remark: this.remarkVal.trim(),
        plates: [],
        vids: []
      }
      this.plateList.forEach(item => {
        if (item.value.trim()) {
          data.plates.push(item.value.trim())
        }
      })
      this.cityList.forEach(item => {
        if (item.children.length > 0) {
          item.children.forEach(itm => {
            if (itm.check) {
              data.vids.push(itm.id)
            }
          })
        }
      })
      let arr = [
        {
          name: '所属模块',
          value: data.userplate
        },
        {
          name: '员工姓名',
          value: data.non_owner_name
        },
        {
          name: '联系电话',
          value: data.non_owner_tel
        },
        {
          name: '起止日期',
          value: this.dateValue.length > 0 ? true : false
        },
        {
          name: '车牌号码',
          value: data.plates.length > 0 ? true : false
        },
        {
          name: '所属项目',
          value: data.vids.length > 0 ? true : false
        }
      ]
      // 判断必填项是否已填写
      let msg = ''
      arr.forEach(item => {
        if (!item.value) {
          if (msg.length > 0) {
            msg = msg + '、' + item.name
          } else {
            msg = msg + item.name
          }
        }
      })
      if (msg.length > 0) {
        msg = msg + '不能为空！'
        this.$message({
          type: 'warning',
          message: msg
        })
        return
      }
      this.loadText = '数据提交中'
      this.isCommit = true
      this.$axios
        .post(this.urlObj.addInsideCar, data)
        .then(res => {
          if (res.Code === 200) {
            this.$message({
              type: 'success',
              message: '内部车辆添加成功！'
            })
            this.dataReset()
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

    // 数据重置
    dataReset () {
      this.uname = ''
      this.telVal = ''
      this.dateValue = []
      this.remarkVal = ''
      this.plateList = [{ value: '' }]
      this.cityList.forEach(item => {
        item.check = false
        item.checkedVillages = []
        item.children.forEach(itm => {
          itm.check = false
        })
      })
      this.allCheck = false
    }
  }
}
