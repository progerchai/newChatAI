<script setup lang="ts">
/*
 *@description: 邀请码扩容申请记录列表[老师]
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-09-12 23:44:22
 */
import { useStore } from 'vuex';
import { getCurrentInstance, ref } from 'vue';
import { submitInviteExpandRequest, getRequestList } from '@/service/profile';
const store = useStore('global');
const role = store.state?.role;
const isAdmin = ['admin', 'super_admin'].includes(role);
const { proxy } = getCurrentInstance() as any;
const page = ref(1);
const pageSize = ref(10);

const getList = () => {
  getRequestList({ page: page.value, pageSize: pageSize.value }).then((res) => {
    if (res.code === 'SUCCESS') {
      console.log(res);
    }
  });
};

const newRequest = () => {
  proxy
    .$prompt('请输入申请额度', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^\d{1,}$/,
      inputErrorMessage: '额度需要数字',
    })
    .then(({ value }: { value: string }) => {
      submitInviteExpandRequest({ count: Number(value) }).then((res) => {
        if (res.code === 'SUCCESS') {
          page.value = 1;
          getList();
        }
      });
    })
    .catch(() => {});
};
</script>

<template>
  <el-card v-if="isAdmin" style="margin-bottom: 24px">
    <template v-slot:header>
      <div class="clearfix">
        <span>邀请码扩容申请记录</span>
        <a class="btn" @click="newRequest">申请子账号扩容额度</a>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.clearfix {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn {
    cursor: pointer;
  }
}
</style>
