<script setup lang="ts">
/*
 *@description: header
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 17:41:39
 */
import { RouterLink } from 'vue-router';
const menu = [
  { title: '首页', route: '/' },
  { title: '关于我们', route: '/about' },
];
</script>
<template>
  <div class="bg-gray-900 header">
    <span class="logo">
      <img class="logo-img" src="@/assets/imgs/logo_zh.png" alt="logo" />
      <span class="logo-title">智海三乐</span>
    </span>
    <RouterLink
      class="menu-item"
      v-for="{ title, route } in menu"
      :to="route"
      >{{ title }}</RouterLink
    >
  </div>
</template>

<style scoped lang="scss">
.header {
  height: 60px;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  z-index: 999;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0px 24px;
}
.logo {
  display: flex;
  align-items: center;
  margin-right: 24px;
  &-img {
    height: 38px;
    width: unset;
    margin-right: 24px;
  }
  &-title {
    font-size: 20px;
    font-weight: 600;
  }
}
.menu-item {
  font-size: 16px;
}
.menu-item + .menu-item {
  margin-left: 24px;
}
</style>
