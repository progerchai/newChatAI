<script setup lang="ts">
/*
 *@description: 邀请码扩容列表[超管]
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-09-12 23:44:22
 */
import { useStore } from 'vuex';
const store = useStore('global');
const role = store.state?.role;
const isSuperAdmin = ['super_admin'].includes(role);
</script>

<template>
  <el-card v-if="isSuperAdmin" style="margin-bottom: 24px">
    <template v-slot:header>
      <div class="clearfix">
        <span>申请列表</span>
      </div>
    </template>
  </el-card>
</template>

<style scoped></style>
