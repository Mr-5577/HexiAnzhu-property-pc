<template>
  <div id="car">
    <el-scrollbar style="height: 2.3rem;width: 100%;">
      <ul class="top-menus-ul">
        <li
          :class="['top-menus-li', activeIndex == item.id ? 'active' : '']"
          @click="labelChange(item)"
          v-for="(item, index) in authLabels"
          :key="index"
        >
          {{ item.name }}
        </li>
      </ul>
    </el-scrollbar>

    <div class="row">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script src="@/assets/parkManage/js/index.js"></script>

<style lang="less">
@import url('~@/assets/parkManage/css/index.less');
</style>
