<script setup lang="ts">
/*
 *@description: login page
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-24 22:14:17
 */
import Form from './form.vue';
import { useStore } from 'vuex';
const store = useStore('global');
const { isPc } = store.state;
</script>
<template>
  <div class="content" v-if="isPc">
    <div class="login-box">
      <img
        class="content-logo"
        src="https://s1.imagehub.cc/images/2023/08/21/logo_cover.png"
      />
      <Form />
    </div>
  </div>
  <!-- // mobile 适配 -->
  <div v-else class="m-form-content">
    <Form />
  </div>
</template>

<style lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .login-box {
    width: 50%;
    min-width: 500px;
    max-width: 800px;
    min-height: 360px;
    display: flex;
    background: #ffffff;
    box-shadow: 0px 2px 24px 0px rgba(221, 221, 221, 0.5);
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    position: relative;
    .content-logo {
      width: 50%;
      object-fit: contain;
    }
  }
}
@media (max-width: 640px) {
  .content {
    padding: 12px;
    &-logo {
      width: 80%;
      object-fit: contain;
    }
  }
  .m-form-content {
    padding: 10vh 20px;
  }
}
</style>
