<script setup lang="ts">
/*
 *@description: 邀请码扩容申请记录列表[老师]
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-09-12 23:44:22
 */
import { getRequestList, submitInviteExpandRequest } from '@/service/profile';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getCurrentInstance, reactive, toRefs, watch } from 'vue';
const { proxy } = getCurrentInstance() as any;
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  total: 0,
  history: [],
  loading: false,
});
const { queryParams, total, loading, history } = toRefs(data);
const statusDict = {
  0: '被驳回',
  1: '审核中',
  2: '已通过',
};
watch(
  () => data.queryParams.pageSize,
  () => {
    getList();
  }
);
watch(
  () => data.queryParams.pageNum,
  () => {
    getList();
  }
);
const getList = () => {
  loading.value = true;
  getRequestList({
    page: queryParams.value.pageNum,
    pageSize: queryParams.value.pageSize,
  }).then((res) => {
    if (res.code === 'SUCCESS') {
      history.value = res?.data?.list as any;
    }
    loading.value = false;
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
          queryParams.value.pageNum = 1;
          getList();
        }
      });
    })
    .catch(() => {});
};
const handleSizeChange = (size: number) => {
  const params = _.cloneDeep(queryParams.value);
  queryParams.value = { ...params, pageSize: size };
};

const handleCurrentChange = (page: number) => {
  const params = _.cloneDeep(queryParams.value);
  queryParams.value = { ...params, pageNum: page };
};
getList();
</script>

<template>
  <el-card style="margin-bottom: 24px">
    <template v-slot:header>
      <div class="clearfix">
        <span>邀请码扩容申请记录</span>
        <a class="btn" @click="newRequest">申请子账号扩容额度</a>
      </div>
    </template>
    <el-table v-loading="loading" :data="history">
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.createTime)
              .add(-8, 'hour')
              .format('YYYY-MM-DD HH:mm')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="申请扩容数量"
        align="center"
        key="count"
        prop="count"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="请求状态"
        align="center"
        key="status"
        prop="status"
        width="80"
      >
        <template #default="scope">
          <span>{{ statusDict[scope.row.status as 0 | 1 | 2] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        key="token"
        prop="response"
        width="response"
      />
    </el-table>
    <el-pagination
      class="pagination"
      v-show="total > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryParams.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryParams.pageSize"
      layout="sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
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
