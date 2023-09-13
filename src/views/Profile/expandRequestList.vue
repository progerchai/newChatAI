<script setup lang="ts">
/*
 *@description: 邀请码扩容列表[超管]
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-09-12 23:44:22
 */
import { useStore } from "vuex";
import { getCurrentInstance, reactive, watch, toRefs } from "vue";
import _ from "lodash";
import dayjs from "dayjs";
import { submitInviteExpandRequest, getRequestList } from "@/service/profile";
const store = useStore("global");
const role = store.state?.role;
const isAdmin = ["admin", "super_admin"].includes(role);
const isSuperAdmin = ["super_admin"].includes(role);

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
  getRequestList({
    page: queryParams.value.pageNum,
    pageSize: queryParams.value.pageSize,
  }).then((res) => {
    if (res.code === "SUCCESS") {
      console.log(res);
    }
    loading.value = false;
  });
};

const newRequest = () => {
  proxy
    .$prompt("请输入申请额度", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      inputPattern: /^\d{1,}$/,
      inputErrorMessage: "额度需要数字",
    })
    .then(({ value }: { value: string }) => {
      submitInviteExpandRequest({ count: Number(value) }).then((res) => {
        if (res.code === "SUCCESS") {
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
</script>

<template>
  <el-card v-if="isSuperAdmin" style="margin-bottom: 24px">
    <template v-slot:header>
      <div class="clearfix">
        <span>申请列表</span>
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
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}</span>
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
          <a>通过</a>
          <a>驳回</a>
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
