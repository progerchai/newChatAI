<script setup lang="ts">
/*
 *@description: header
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 17:41:39
 */
</script>
<template>
  <div class="bg-gray-900 header">
    <span class="logo">
      <img class="logo-img" src="@/assets/imgs/logo_white.png" alt="logo" />
      <span class="logo-title">三乐</span>
    </span>
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
</style>
