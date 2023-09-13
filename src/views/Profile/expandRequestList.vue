<script setup lang="ts">
/*
 *@description: 邀请码扩容列表[超管]
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-09-12 23:44:22
 */
import { getCurrentInstance, reactive, watch, toRefs } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
import {
  handleInviteExpandRequest,
  getInviteExpandRequestList,
} from '@/service/profile';

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
  getInviteExpandRequestList({
    page: queryParams.value.pageNum,
    pageSize: queryParams.value.pageSize,
  }).then((res) => {
    if (res.code === 'SUCCESS') {
      console.log(res);
    }
    loading.value = false;
  });
};
// 0:驳回，1:待审核，2:通过
const handleAction = (id: number, status: 0 | 2) => {
  if (status === 0) {
    proxy
      .$prompt('请输入驳回理由（非必填）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
      })
      .then(({ value }: { value: string }) => {
        handleSubmit(id, status, value);
      })
      .catch(() => {});
  } else {
    handleSubmit(id, status, '');
  }
};
/**
 * 提交 执行驳回/通过申请
 */
const handleSubmit = (id: number, status: 0 | 2, response: string) => {
  handleInviteExpandRequest({ id, status, response }).then((res) => {
    if (res.code === 'SUCCESS') {
      getList();
    }
  });
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
        <span>邀请码扩容申请列表</span>
      </div>
    </template>
    <el-table v-loading="loading" :data="history">
      <el-table-column
        label="申请人id"
        align="center"
        key="id"
        prop="id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
      >
        <template #default="scope">
          <span>{{
            dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm')
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
        label="申请人名称"
        align="center"
        key="userName"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="申请人学校"
        align="center"
        key="deptName"
        prop="deptName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="申请人id"
        align="center"
        key="teacherId"
        prop="teacherId"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" width="80">
        <template #default="scope">
          <span v-if="scope.row.status === 1">
            <a @click="handleAction(scope.row.id, 2)" style="marginright: 8px"
              >通过</a
            >
            <a @click="handleAction(scope.row.id, 0)">驳回</a>
          </span>
          <span v-if="scope.row.status === 2" style="color: #67c23a"
            >已通过</span
          >
          <span v-if="scope.row.status === 0" style="color: #909399"
            >已驳回</span
          >
        </template>
      </el-table-column>
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

<style scoped></style>
