<script setup lang="ts">
/*
 *@description: login page
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-24 22:14:17
 */
</script>
<template>
  <div class="content">
    <img
      class="content-logo"
      src="https://s1.imagehub.cc/images/2023/08/21/logo_cover.png"
    />
    登录
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-between: center;
  display: flex;
  flex-direction: column;
  padding: 0px 20%;
}
@media (max-width: 640px) {
  .content {
    padding: 12px;
    &-logo {
      width: 80%;
      object-fit: contain;
    }
  }
}
</style>
