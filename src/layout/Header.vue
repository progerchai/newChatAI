<script setup lang="ts">
/*
 *@description: header
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 17:41:39
 */
import type { IUser } from '@/types';
import _ from 'lodash';
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore('global');
const menu = ref([
  { title: '首页', route: '/' },
  { title: '关于我们', route: '/about' },
]);
const userInfo = ref<IUser>({ uid: -1 });

watch(
  () => store.state.role,
  (newValue) => {
    if (['super_admin', 'admin'].includes(newValue)) {
      const _menu = _.cloneDeep(menu.value);
      _menu.push({ title: '管理', route: '/admin' });
      menu.value = _menu;
    }
  }
);

watch(
  () => store.state.userInfo,
  (newValue) => {
    userInfo.value = newValue;
  }
);
</script>
<template>
  <div class="bg-gray-900 header">
    <span class="logo">
      <img
        class="logo-img"
        src="https://s1.imagehub.cc/images/2023/08/21/logo.png"
        alt="logo"
      />
      <!-- <span class="logo-title">智海三乐</span> -->
    </span>
    <RouterLink
      class="menu-item"
      v-for="{ title, route } in menu"
      :to="route"
      >{{ title }}</RouterLink
    >
    <div class="user">
      <span class="user-name" v-if="!!userInfo?.userName">{{
        userInfo.userName
      }}</span>
    </div>
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
    height: 36px;
    width: unset;
    margin-right: 16px;
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
.user {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  &-name {
    cursor: pointer;
    &:hover {
      color: #2861fc;
    }
  }
}
</style>
