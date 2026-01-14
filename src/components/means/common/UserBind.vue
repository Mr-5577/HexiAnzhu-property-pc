<template>
  <div id="user-bind">
    <!-- 搜索部分 -->
    <el-autocomplete
      ref="searchInput"
      class="us-search"
      popper-class="my-autocomplete"
      v-model="autoValue"
      :debounce="0"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入姓名或电话号码搜索"
      @select="handleSelect"
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
</template>
<script>
export default {
  name: 'UserBind',
  props: {
    vid: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 用户搜索框绑定值
      autoValue: '',
      // 当前用户信息数据
      currentUser: {},
      // 用户列表
      allUserList: [],
      // 没有更多数据
      nomore: false
    }
  },

  /**
   * 生命周期
   */
  mounted() {},

  /**
   * 方法
   */
  methods: {
    // 搜索获取过户业主数据
    async querySearchAsync(queryStr, cb) {
      let value = {
        keywords: queryStr,
        page: 1,
        limit: 20,
        vid: this.vid
      }
      let res = await this.$axios.post(
        this.$api.state.Means.userSearch.url,
        value
      )
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
          vid: this.vid
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
      this.$emit('userSelected', user)
    }
  }
}
</script>

<style lang="less">
.my-autocomplete {
  li {
    padding: 0;
    line-height: 40px;
    .tr-item {
      display: flex;
      justify-content: space-between;
      .td-item {
        flex: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .tr-item:hover {
      background-color: #e1f8df;
    }
    .load-more {
      text-align: center;
      color: #ccc;
      background: #fff;
    }
  }
  li:first-child {
    color: #999;
    cursor: default;
    pointer-events: none;
  }
  li:hover {
    background-color: #fff;
  }
}
#user-bind {
  padding: 30px 30px 0;
  .el-autocomplete.us-search {
    width: 40%;
    margin: 0;
  }
  .info-wp {
    display: flex;
    flex-wrap: wrap;
    margin: 20px -15px 0;
    position: relative;

    .info-item {
      margin-bottom: 20px;
      padding: 0 15px;
      width: 25%;
      box-sizing: border-box;
      .name {
        color: #666;
        font-size: 15px;
        line-height: 26px;
        margin-bottom: 10px;
      }
      .el-date-editor {
        width: 100% !important;
      }
    }
    .line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: calc(100% - 30px);
      height: 1px;
      background-color: #f7f7f7;
      margin-left: 15px;
    }
  }
}
</style>
