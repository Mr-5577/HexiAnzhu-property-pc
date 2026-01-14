import Vue from 'vue'
import Vuex from 'vuex'
import api_ from '@/store/api.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 全局项目
    vid: '',
    // 全局大区id
    bid: '',
    // 资源类别
    resource: [],
    // 计费优先级
    prioritys: [],
    // 计量单位
    units: [],
    // 计算公式
    formulas: [],
    // 科目类型
    subjects: [],
    // 当前正在查询报表 id
    queryId: '',
    // 是否有新消息
    hasNewMsg: false,
  },
  mutations: {
    // 设置全局项目
    setVillageId (state, id) {
      state.vid = id
    },
    setBigAreaId (state, id) {
      state.bid = id
    },
    // 设置资源类别
    setResource (state, arr) {
      state.resource = arr
    },
    // 设置计费优先级
    setPrioritys (state, arr) {
      state.prioritys = arr
    },
    // 设置计量单位
    setUnits (state, arr) {
      state.units = arr
    },
    // 设置计算公式
    setFormulas (state, arr) {
      state.formulas = arr
    },
    // 设置科目类型
    setSubjects (state, arr) {
      state.subjects = arr
    },
    // 设置查询id
    setQueryid (state, id) {
      state.queryId = id
    },
    // 改变新消息状态
    setMsgStatus (state, value) {
      state.hasNewMsg = value
    },
  },
  actions: {
    // 获取资源类型
    getResource ({ commit, state }) {
      axios
        .post(state.api.Means.resourceType.url)
        .then(res => {
          if (res.Code === 200) {
            res.Data.forEach(item => {
              item.value = item.id
            })
            commit('setResource', res.Data)
          } else {
            this.$message({
              type: 'error',
              message: '获取资源类别数据失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取资源类别数据失败！'
          })
        })
    },

    // 获取计费优先级
    getPrioritys ({ commit, state }) {
      axios
        .post(state.api.Setting.billPriority.url)
        .then(res => {
          if (res.Code === 200) {
            commit('setPrioritys', res.Data)
          } else {
            this.$message({
              type: 'error',
              message: '获取计费优先级数据失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取计费优先级数据失败！'
          })
        })
    },

    // 获取计量单位
    getUnits ({ commit, state }) {
      axios
        .post(state.api.Setting.getUnit.url)
        .then(res => {
          if (res.Code === 200) {
            commit('setUnits', res.Data)
          } else {
            this.$message({
              type: 'error',
              message: '计量单位数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '计量单位数据获取失败！'
          })
        })
    },

    // 获取计算公式
    getFormulas ({ commit, state }) {
      axios
        .post(state.api.Setting.formulas.url)
        .then(res => {
          if (res.Code === 200) {
            commit('setFormulas', res.Data)
          } else {
            this.$message({
              type: 'error',
              message: '计算公式数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '计算公式数据获取失败！'
          })
        })
    },

    // 获取科目类型
    getSubjects ({ commit, state }) {
      axios
        .post(state.api.Setting.subjectType.url)
        .then(res => {
          if (res.Code === 200) {
            commit('setSubjects', res.Data)
          } else {
            this.$message({
              type: 'error',
              message: '科目类型数据获取失败！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '科目类型数据获取失败！'
          })
        })
    },
  },
  modules: {
    api: api_
  }
})
