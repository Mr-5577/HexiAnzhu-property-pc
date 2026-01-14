<template>
  <div id="subject-tree">
    <!-- 搜索框部分 -->
    <div class="search-wrap">
      <div class="title" v-if="!showSearch">
        <span>科目列表</span>
        <el-select v-model="typeVal" @change="typeChange">
          <el-option
            v-for="itm in typeOptions"
            :key="itm.value"
            :label="itm.label"
            :value="itm.value"
          ></el-option>
        </el-select>
      </div>
      <el-input
        placeholder="请输入关键字搜索"
        suffix-icon="iconfont iconzu3664"
        v-model="filterText"
        class="search"
        v-else
      ></el-input>
    </div>
    <el-scrollbar style="height: calc(100% - 4.05rem);" v-loading="treeLoading">
      <!-- 树形结构部分 -->
      <div class="tree-wrap">
        <el-tree
          ref="subTree"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          :node-key="treeType ? 'nodeid' : 'id'"
          accordion
          :filter-node-method="filterNode"
          show-checkbox
          check-strictly
          :default-expanded-keys="defaultShowNodes"
          :default-checked-keys="defaultChecked"
          @node-expand="handleNodeExpand"
          @node-collapse="handleNodeCollapse"
          @node-click="nodeClick"
          @check="nodeCheck"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span
              class="status"
              style="color: #3ebb75;"
              v-if="
                treeType == 'charge' &&
                  !showSearch &&
                  data.is_setting &&
                  data.is_setting == 1
              "
            >
              已设置
            </span>
            <span
              class="status"
              style="color: #ccc;"
              v-if="treeType == 'charge' && !showSearch && data.is_setting == 0"
            >
              未设置
            </span>
          </span>
        </el-tree>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'SubjectTree',
  props: {
    showSearch: {
      type: Boolean,
      default: false
    },
    treeType: {
      type: String,
      default: ''
    },
    vid: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      // 接口对象
      urlObj: {
        treeData: this.$api.state.Setting.treeData.url,
        chargeTree: this.$api.state.Setting.chargeTree.url
      },
      // 是否正在加载数据
      treeLoading: false,
      // 搜索框绑定值
      filterText: '',
      // 树控件绑定值
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      // 类型列表
      typeVal: 0,
      typeOptions: [
        {
          label: '全部科目',
          value: 0
        },
        {
          label: '已设置',
          value: 1
        },
        {
          label: '未设置',
          value: 2
        }
      ],
      // 存放要默认展开的节点 id
      defaultShowNodes: [],
      // 默认选中的节点
      defaultChecked: []
    }
  },

  // 属性监听
  watch: {
    filterText(val) {
      this.$refs.subTree.filter(val)
    }
  },

  /**
   * 生命周期
   */
  created() {
    this.getTreeData()
  },

  /**
   * 方法
   */
  methods: {
    // 获取树形结构数据
    getTreeData() {
      this.treeLoading = true
      let url = this.urlObj.treeData
      let data = {}
      if (this.treeType == 'charge') {
        url = this.urlObj.chargeTree
        data.vid = this.vid
      } else if (this.treeType == 'relevance') {
        url = this.urlObj.chargeTree
        data.vid = this.vid
        data.charging_correlation = true
      }
      this.$axios
        .post(url, data)
        .then(res => {
          if (res.Code === 200) {
            this.treeData = res.Data
            this.$emit('setData', res.Data)
          } else {
            let msg = res.Message ? res.Message : '数据获取失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.treeLoading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '执行失败！'
          })
          this.treeLoading = false
        })
    },

    filterNode(value, data) {
      if (!value) return true
      if (this.treeType == 'charge' && !this.showSearch) {
        // 已设置
        if (value == 1) {
          return data.is_setting == 1
        } else if (value == 2) {
          // 未设置
          return data.is_setting == 0
        } else {
          return true
        }
      } else {
        return data.name.indexOf(value) !== -1
      }
    },

    // 节点点击事件
    nodeClick(data) {
      this.$nextTick(() => {
        if (!data.disabled) {
          this.$refs.subTree.setCheckedNodes([data])
          this.$emit('checkChange', data)
        }
      })
    },

    // 节点复选框点击事件
    nodeCheck(data) {
      if (!data.disabled) {
        this.$refs.subTree.setCheckedNodes([data])
        this.$emit('checkChange', data)
      }
    },

    // 选择更改处理
    typeChange(value) {
      this.$refs.subTree.filter(value)
    },

    // 树节点展开
    handleNodeExpand(data) {
      // 保存当前展开的节点
      let key = ''
      if (this.treeType) {
        key = data.nodeid
      } else {
        key = data.id
      }
      let i = this.defaultShowNodes.findIndex(item => item == key)
      if (i === -1) {
        // 不存在则存到数组里
        this.defaultShowNodes.push(key)
      }
    },

    // 树节点关闭
    handleNodeCollapse(data) {
      let key = ''
      if (this.treeType) {
        key = data.nodeid
      } else {
        key = data.id
      }
      let i = this.defaultShowNodes.findIndex(item => item == key)
      this.defaultShowNodes.splice(i, 1)
    },

    // 设置默认选中的节点
    setDefaultChecked(id) {
      this.defaultChecked = [id]
    }
  }
}
</script>
<style lang="less">
#subject-tree {
  font-family: Source Han Sans CN;
  width: 100%;
  height: 100%;
  .search-wrap {
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
    .title {
      overflow: hidden;
      > span {
        display: inline-block;
        font-size: 16px;
        line-height: 40px;
        color: #333;
        font-weight: 700;
      }
      .el-select {
        float: right;
        width: 150px;
        input {
          background-color: #e1f8df !important;
          color: #3ebb75 !important;
        }
        .el-select__caret {
          color: #3ebb75;
        }
      }
    }
    .search {
      width: 100%;
    }
  }
  .tree-wrap {
    height: calc(100% - 101px);
    padding: 20px 0;
    box-sizing: border-box;
    .el-tree {
      background-color: transparent;
      .el-tree-node {
        .el-tree-node__content {
          position: relative;
          height: 46px;
          .el-tree-node__loading-icon.el-icon-loading {
            display: none;
          }
          .el-checkbox {
            position: absolute;
            top: 12px;
            right: 16px;
            margin-right: 0;
            .el-checkbox__input {
              .el-checkbox__inner {
                background-color: transparent;
                border: none;
              }
              .el-checkbox__inner::after {
                top: 0 !important;
                left: 4px !important;
              }
            }
          }
          .el-checkbox.is-disabled {
            display: none;
          }
          .el-checkbox.is-checked {
            .el-checkbox__input {
              .el-checkbox__inner {
                background-color: transparent;
                border: none;
              }
              .el-checkbox__inner:after {
                border-color: #3ebb75;
                height: 9px;
                width: 4px;
                left: 8px;
                top: 4px;
                transition: none;
              }
            }
          }
          .el-checkbox.is-disabled.is-checked {
            display: inline-block;
          }
          .el-tree-node__expand-icon {
            position: absolute;
            top: 11px;
            right: 12px;
            font-size: 14px;
            z-index: 1000;
          }
          .el-tree-node__expand-icon.is-leaf {
            display: none;
          }
          .custom-tree-node {
            font-size: 14px;
            .status {
              font-size: 12px;
              position: absolute;
              right: 40px;
            }
            img {
              width: 15px;
              height: 15px;
              vertical-align: middle;
              margin-right: 5px;
            }
            .iconfont {
              font-size: 15px;
              color: #3ebb75;
              vertical-align: middle;
              margin-right: 5px;
            }
            .label {
              margin-right: 10px;
              font-size: 14px;
              vertical-align: middle;
            }
          }
        }
        .el-tree-node__content::before {
          content: '';
          margin: 0 5px 0 20px;
        }
        .el-tree-node__content:hover {
          color: #3ebb75;
          background-color: #e1f8df;
        }
      }
      .el-tree-node.is-checked {
        > .el-tree-node__content {
          background-color: #e1f8df !important;
          color: #3ebb75;
          .el-tree-node__expand-icon {
            display: none;
          }
        }
      }
      .el-tree-node:focus > .el-tree-node__content {
        background-color: #fff;
      }
    }
  }
}
</style>
