<template>
  <div id="tree-search">
    <!-- 搜索框部分 -->
    <div class="search-wrap">
      <el-input
        placeholder="请输入项目名或编码"
        suffix-icon="iconfont iconzu3664"
        v-model="filterText"
        class="search"
        @change="searchHandle"
      ></el-input>
    </div>
    <el-scrollbar style="height: calc(100% - 4.05rem);" v-loading="isLoading">
      <!-- 树形结构部分 -->
      <div class="tree-wrap" v-show="!showSearch">
        <el-tree
          ref="tree"
          class="filter-tree"
          lazy
          node-key="nodeid"
          accordion
          show-checkbox
          check-strictly
          :props="defaultProps"
          :load="loadNode"
          :indent="12"
          @node-click="nodeClick"
          @check="nodeCheck"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <i class="iconfont icondaqu" v-if="node.data.type == 'city'"></i>
            <i
              class="iconfont iconxiangmu"
              v-if="node.data.type == 'village'"
            ></i>
            <i
              class="iconfont iconloudong"
              v-if="
                node.data.type == 'building' ||
                  node.data.type == 'resources_type'
              "
            ></i>
            <i class="iconfont icondanyuan" v-if="node.data.type == 'unit'"></i>
            <i
              class="iconfont iconcheku"
              v-if="
                node.data.type == 'parking' ||
                  node.data.type == 'monthpark' ||
                  node.data.type == 'inside'
              "
            ></i>
            <i
              class="iconfont iconfeijidongche"
              v-if="node.data.type == 'novehicle'"
            ></i>
            <i
              class="iconfont iconqitaziyuan"
              v-if="node.data.type == 'other'"
            ></i>
            <i class="iconfont iconzu3663" v-if="node.data.type == 'house'"></i>

            <span class="label" v-if="node.data.type == 'insideitem'">
              {{ node.data.non_owner_name }}
            </span>
            <span class="label" v-else>{{ node.label }}</span>
            <span v-if="node.loading">
              <i
                class="el-icon-loading"
                style="color: #ccc;margin-right: 0.25rem;vertical-align: middle;font-size: 0.7rem;position: relative; z-index: 100;"
              ></i>
              <span style="font-size: 0.6rem;color: #ccc;">加载中</span>
            </span>
          </span>
        </el-tree>
      </div>

      <!-- 搜索结构列表 -->
      <ul class="search-list" v-show="showSearch">
        <li
          v-if="searchList.length === 0"
          style="color: #ccc;text-align: center;font-size: 0.7rem;"
        >
          暂无数据！
        </li>
        <li
          :class="[item.checked ? 'checked' : '']"
          v-for="(item, index) in searchList"
          :key="index"
          @click="checkHandle(item)"
        >
          <span class="text1">{{ item.title }}</span>
          <span class="text2">{{ item.type_name }}</span>
          <span class="text3">{{ item.username }}</span>
          <i class="el-icon-check"></i>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'TreeSearch',
  props: ['type'],
  data() {
    return {
      // 接口对象
      urlObj: {
        treeData: this.$api.state.Means.treeData.url,
        parking: this.$api.state.Means.parking.url,
        monthParking: this.$api.state.Means.monthParking.url,
        novehicle: this.$api.state.Means.novehicle.url,
        insideVehicle: this.$api.state.Means.insideVehicle.url,
        virtuaList: this.$api.state.Means.virtuaList.url,
        getbasedata: this.$api.state.Means.getbasedata.url,
        searchbasedata: this.$api.state.Means.searchbasedata.url
      },
      // 是否正在加载数据
      isLoading: false,
      // 搜索框绑定值
      filterText: '',
      // 树控件数据
      treeData: [],
      // 树控件配置
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'isLeaf'
      },
      // 是否显示搜索结果
      showSearch: false,
      // 当前选中的项目 id
      checkedVid: null,
      // 当前选中的搜索结果 id
      checkedId: '',
      // 搜索结构列表
      searchList: []
    }
  },

  // 属性监听
  watch: {
    filterText(val) {
      if (!val) {
        this.showSearch = false
      }
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
    // 树形结构搜索处理
    searchHandle() {
      let data = {
        vid: this.checkedVid,
        keywords: this.filterText.trim()
      }
      if (data.vid && data.keywords) {
        this.isLoading = true
        this.searchList = []
        this.$axios.post(this.urlObj.searchbasedata, data).then(res => {
          if (res.Code === 200) {
            if (res.Data && res.Data.length > 0) {
              res.Data.forEach(item => {
                item.vid = this.checkedVid
                if (this.checkedId && this.checkedId == item.id) {
                  item.checked = true
                } else {
                  item.checked = false
                }
              })
            }
            this.searchList = res.Data ? res.Data : []
          } else {
            let msg = res.Message ? res.Message : '搜索失败！'
            this.$message({
              type: 'error',
              message: msg
            })
          }
          this.isLoading = false
          this.showSearch = true
        })
      } else if (!data.vid) {
        this.filterText = ''
        this.$message({
          type: 'warning',
          message: '请选择一个项目后搜索！'
        })
      }
    },

    // 获取树形结构数据
    async getTreeData(data, resolve) {
      // 获取城市、项目数据
      let res = await this.$axios.post(this.urlObj.treeData, data)
      this.isLoading = false
      let arr = []
      if (res.Code == 200) {
        res.Data.forEach(item => {
          if (!data.vid) {
            item.disabled = true
            item.children.forEach(itm => {
              itm.isLeaf = false
              itm.nodeid = itm.type + itm.id
            })
          }
          item.nodeid = item.type + item.id
        })
        arr = res.Data
      } else {
        this.$message({
          message: '获取数据失败！',
          type: 'error'
        })
      }
      resolve(arr)
    },

    // 获取住宅每层数据
    getBaseData(data, resolve) {
      this.$axios.post(this.urlObj.getbasedata, data).then(res => {
        let arr = []
        if (res.Code === 200) {
          if (res.Data && res.Data.length > 0) {
            res.Data.forEach(item => {
              item.vid = data.vid
              if (this.type == 'charge' && data.type != 'owner') {
                item.disabled = true
              }
            })
          }
          arr = res.Data ? res.Data : []
        } else {
          this.$message({
            message: '获取数据失败！',
            type: 'error'
          })
        }
        resolve(arr)
      })
    },

    // 获取已售车位、月租车库、非机动车、其他资源数据
    async getCarportData(node, resolve) {
      let res = null
      let type = ''
      if (node.type === 'parking') {
        type = 'car'
        res = await this.$axios.post(this.urlObj.parking, { vid: node.vid })
      } else if (node.type === 'monthpark') {
        type = 'monthitem'
        let data = {
          vid: node.vid
        }
        if (this.type == 'charge') {
          data.type = 'charge'
        }
        res = await this.$axios.post(this.urlObj.monthParking, data)
      } else if (node.type === 'novehicle') {
        type = 'car_nonmotor'
        res = await this.$axios.post(this.urlObj.novehicle, { vid: node.vid })
      } else if (node.type === 'inside') {
        type = 'insideitem'
        res = await this.$axios.post(this.urlObj.insideVehicle, {
          vid: node.vid
        })
      } else if (node.type === 'other') {
        type = 'virtual_resource'
        res = await this.$axios.post(this.urlObj.virtuaList, {
          vid: node.vid,
          is_page: 0
        })
      }
      if (res.Code === 200) {
        let number = 0
        let result = node.type === 'parking' ? res.Data.data : res.Data
        if (result && result.length > 0) {
          if (node.type === 'parking') {
            result.forEach(item => {
              item.disabled = this.type == 'charge' ? true : false
              item.nodeid = item.type + item.id
              number = number + item.children.length
            })
          } else {
            result.forEach(item => {
              if (this.type == 'charge' && node.type === 'inside') {
                item.disabled = true
              } else if (node.type != 'other') {
                item.disabled = false
              }
              if (node.type != 'other') {
                item.isLeaf =
                  node.type === 'monthpark' && item.children.length > 0
                    ? false
                    : true
              }
              item.type = type
              item.nodeid = type + item.id
            })
          }
          if (node.type === 'monthpark') {
            result.forEach(item => {
              if (this.type == 'charge') {
                item.disabled = true
              }
              number = number + item.children.length
            })
          } else {
            if (node.type != 'parking') {
              number = result.length
            }
          }
        }
        this.$emit('setNumber', number)
        resolve(result)
      } else {
        resolve([])
      }
    },

    // 加载节点数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        let data = {
          secondData: 0
        }
        this.isLoading = true
        this.getTreeData(data, resolve)
      } else if (node.level === 2) {
        let parks = [
          {
            id: 6,
            nodeid: 'house' + node.data.id,
            isLeaf: false,
            label: '房屋',
            type: 'house',
            vid: node.data.id,
            disabled: true,
            children: []
          },
          {
            id: 1,
            nodeid: 'parking' + node.data.id,
            isLeaf: false,
            label: '固定车位',
            type: 'parking',
            vid: node.data.id,
            disabled: this.type == 'charge' ? true : false,
            children: []
          },
          {
            id: 2,
            nodeid: 'monthpark' + node.data.id,
            isLeaf: false,
            label: '月租车位',
            type: 'monthpark',
            vid: node.data.id,
            disabled: this.type == 'charge' ? true : false,
            children: []
          },
          {
            id: 3,
            nodeid: 'inside' + node.data.id,
            isLeaf: false,
            label: '内部车辆',
            type: 'inside',
            vid: node.data.id,
            disabled: this.type == 'charge' ? true : false,
            children: []
          },
          {
            id: 4,
            nodeid: 'novehicle' + node.data.id,
            isLeaf: false,
            label: '非机动车',
            type: 'novehicle',
            vid: node.data.id,
            disabled: this.type == 'charge' ? true : false,
            children: []
          },
          {
            id: 5,
            nodeid: 'other' + node.data.id,
            isLeaf: false,
            label: '其他资源',
            type: 'other',
            vid: node.data.id,
            disabled: this.type == 'charge' ? true : false,
            children: []
          }
        ]
        resolve(parks)
      } else if (node.level === 3) {
        if (node.data.type == 'house') {
          let data = {
            vid: node.data.vid,
            type: 'rooms_type'
          }
          this.getBaseData(data, resolve)
        } else {
          this.getCarportData(node.data, resolve)
        }
      } else if (node.data.type == 'resources_type') {
        let data = {
          vid: node.data.vid,
          type: 'building',
          type_id: node.data.id
        }
        this.getBaseData(data, resolve)
      } else if (node.data.type == 'building') {
        let data = {
          vid: node.data.vid,
          type: 'unit',
          bid: node.data.id
        }
        this.getBaseData(data, resolve)
      } else if (node.data.type == 'unit') {
        let data = {
          vid: node.data.vid,
          type: 'rooms',
          unit: node.data.id
        }
        this.getBaseData(data, resolve)
      } else if (node.data.type == 'rooms') {
        let data = {
          vid: node.data.vid,
          type: 'owner',
          rooms_id: node.data.id
        }
        this.getBaseData(data, resolve)
      } else {
        if (node.data.type.includes('virtual')) {
          node.data.children.forEach(itm => {
            if (itm.isLeaf) {
              itm.type = 'lastvirtual'
              itm.nodeid = 'lastvirtual' + itm.id
            }
          })
        }
        resolve(node.data.children)
      }
    },

    // 节点点击事件
    nodeClick(data, node) {
      this.$nextTick(() => {
        if (!data.disabled) {
          if (data.type === 'village') {
            this.checkedVid = data.id
          }
          this.$refs.tree.setCheckedNodes([data])
          if (
            data.type == 'monthitem' ||
            data.type == 'novehicle' ||
            data.type == 'inside' ||
            data.type == 'other'
          ) {
            data.number = node.childNodes.length
          } else if (data.type == 'monthpark') {
            data.number = 0
            node.childNodes.forEach(item => {
              data.number = data.number + item.data.children.length
            })
          } else if (data.type == 'parking') {
            data.number = 0
            node.childNodes.forEach(item => {
              data.number = data.number + item.data.children.length
            })
          }
          data.loading = node.loading
          this.$emit('checkChange', data)
        }
      })
    },

    // 节点复选框点击事件
    nodeCheck(data) {
      if (!data.disabled) {
        if (data.type === 'village') {
          this.checkedVid = data.id
        }
        this.$refs.tree.setCheckedNodes([data])
        this.$emit('checkChange', data)
      }
    },

    // 删除某个节点
    delNode(data) {
      if (this.showSearch) {
        // 重新获取数据
        this.searchHandle()
      } else {
        this.$refs.tree.remove(data)
      }
    },

    // 节点更新
    nodeUpdate(oldData, newData) {
      if (this.showSearch) {
        // 重新获取数据
        this.searchHandle()
      } else {
        let node = this.$refs.tree.getNode(oldData)
        node.data.label = newData.label
      }
    },

    // 点击搜索结果处理
    checkHandle(obj) {
      this.searchList.forEach(item => {
        item.checked = false
      })
      obj.checked = true
      obj.search = true
      this.checkedId = obj.id
      this.$emit('checkChange', obj)
    }
  }
}
</script>
<style lang="less">
#tree-search {
  font-family: Source Han Sans CN;
  width: 100%;
  height: 100%;
  .search-wrap {
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
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
            top: 16px;
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
  .search-list {
    padding: 20px 0;
    list-style: none;
    > li {
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      padding: 0 20px;
      position: relative;
      overflow: hidden;
      i {
        margin-right: 5px;
        color: #3ebb75;
        font-size: 15px;
      }
      .text1,
      .text2,
      .text3 {
        color: #606266;
        font-size: 14px;
        display: inline-block;
      }
      .text1 {
        min-width: 100px;
      }
      .text2 {
        min-width: 60px;
        margin: 0 10px;
      }
      .text3 {
        min-width: 80px;
      }
      .el-icon-check {
        display: none;
        position: absolute;
        top: 12px;
        right: 20px;
        color: #3ebb75;
        margin-right: 0;
      }
    }
    > li:hover {
      background-color: #e1f8df;
      .text1,
      .text2,
      .text3 {
        color: #3ebb75;
      }
    }
    > li.checked {
      background-color: #e1f8df;
      .text1,
      .text2,
      .text3 {
        color: #3ebb75;
      }
      .el-icon-check {
        display: block;
      }
    }
  }
}
</style>
