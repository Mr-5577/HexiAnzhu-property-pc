<template>
  <div id="FilterVillage">
    <el-dialog
      title="选择项目"
      :visible.sync="conf.show"
      top="130px"
      width="1100px"
    >
      <el-tabs @tab-click="cutBgTabs" stretch>
        <el-tab-pane
          :label="bv.deptname"
          v-for="(bv, bi) in bgDatas"
          :key="bi"
        ></el-tab-pane>
      </el-tabs>
      <div class="city-list" v-loading="isLoading">
        <el-scrollbar style="height: 100%;">
          <div v-for="(cv, ci) in cvDatas" :key="ci">
            <div class="title">{{ cv.city }}</div>
            <ul class="village-list">
              <li
                :class="[
                  'village-list-li',
                  parseInt(vid) === parseInt(vv.id)
                    ? 'village-list-li-active'
                    : ''
                ]"
                v-for="(vv, vi) in cv.village"
                :key="vi"
                @click="choseVid(ci, vi)"
              >
                {{ vv.villagename }}
              </li>
            </ul>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FilterVillage',
  data() {
    return {
      bgDatas: [],
      cvDatas: [],
      conf: {
        show: false,
        bg_id: 0,
        bg_name: '',
        isSubmitLoading: false
      },
      isLoading: false
    }
  },
  props: ['vid'],
  methods: {
    showDialog() {
      /* 是否打开弹出层 */

      // 打开弹出层
      this.conf.show = true

      // 获取大区信息
      this.getBgDatas()
    },
    getBgDatas() {
      /* 获取大区信息 */

      let _this = this

      if (_this.bgDatas.length <= 0) {
        // 获取数据
        _this
          .$axios({
            url: _this.$api.state.Public.bigarea.url,
            method: 'post',
            responseType: 'json',
            data: {
              vill_limit: true
            }
          })
          .then(res => {
            if (res.Code === 200) {
              // 获取数据成功
              _this.bgDatas = res.Data

              // 设置默认切换
              _this.conf.bg_id =
                _this.bgDatas.length > 0 ? _this.bgDatas[0].deptid : 0

              _this.conf.bg_name =
                _this.bgDatas.length > 0 ? _this.bgDatas[0].deptname : ''

              // 获取城市、项目信息
              _this.getCityAndVillDatas()
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
            }
          })
          .catch(() => {
            _this.$message({
              message: '服务器连接失败',
              type: 'error',
              offset: 150
            })
          })
      }
    },
    cutBgTabs(tab, event) {
      /* 切换大区信息 */

      if (
        parseInt(this.conf.bg_id) != parseInt(this.bgDatas[tab.index].deptid)
      ) {
        this.conf.bg_id = this.bgDatas[tab.index].deptid
        this.conf.bg_name = this.bgDatas[tab.index].deptname

        // 清空项目信息
        this.cvDatas = []

        this.getCityAndVillDatas()
      }
    },
    getCityAndVillDatas() {
      /* 获取城市、项目信息 */

      let _this = this

      if (_this.cvDatas.length <= 0) {
        _this.isLoading = true
        // 获取数据
        _this
          .$axios({
            url: _this.$api.state.Public.city_vill.url,
            method: 'post',
            responseType: 'json',
            data: {
              bgid: _this.conf.bg_id
            }
          })
          .then(res => {
            if (res.Code === 200) {
              // 获取数据成功
              _this.cvDatas = res.Data
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
            }
            _this.isLoading = false
          })
          .catch(() => {
            _this.$message({
              message: '服务器连接失败',
              type: 'error',
              offset: 150
            })
            _this.isLoading = false
          })
      }
    },
    choseVid(cindex, vindex) {
      //整理抛出信息
      let choseInfo = {
        name:
          this.conf.bg_name +
          '-' +
          this.cvDatas[cindex].city +
          '-' +
          this.cvDatas[cindex].village[vindex].villagename,
        bg_id: this.conf.bg_id,
        city_id: this.cvDatas[cindex].id,
        vid: this.cvDatas[cindex].village[vindex].id
      }

      this.$emit('choseInfo', choseInfo)
      this.conf.show = false
    }
  }
}
</script>
<style lang="less">
#FilterVillage {
  .el-dialog__body {
    padding: 0;

    .el-tabs {
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
      }
    }

    .city-list {
      padding: 10px 3px 10px 15px;
      height: 500px;
      box-sizing: border-box;

      .title {
        padding: 15px 15px 10px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }

      .village-list {
        list-style: none;
        display: flex;
        flex-wrap: wrap;

        .village-list-li {
          display: inline-block;
          margin: 10px 15px;
          width: 140px;
          height: 40px;
          line-height: 40px;
          background-color: #e1f8df;
          border-radius: 20px;
          text-align: center;
          color: rgba(62, 187, 117, 0.6);
          font-size: 14px;
          cursor: pointer;
        }

        .village-list-li-active {
          background-color: #3ebb75 !important;
          color: #ffffff !important;
          filter: drop-shadow(0 5px 5px rgba(62, 187, 117, 0.3));
          -webkit-filter: drop-shadow(0 5px 5px rgba(62, 187, 117, 0.3));
        }

        .village-list-li:hover {
          background-color: rgba(105, 218, 97, 0.4);
        }
      }
    }
  }
}
</style>
