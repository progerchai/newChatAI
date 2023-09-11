<script setup>
/*
 *@description: 管理-部门组建
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-30 22:08:20
 */
import { ref, watch } from 'vue';
import { deptTreeSelect } from '@/service/admin';
import _ from 'lodash';
const deptOptions = ref(undefined);
const deptName = ref('');
const treeRef = ref(null);
const props = defineProps({
  onChange: {
    type: Function,
    default: () => {},
  },
});
function getDeptTree() {
  deptTreeSelect().then((res) => {
    deptOptions.value = res.data;
  });
}
/** 节点单击事件 */
function handleNodeClick(data) {
  props.onChange({ teacherId: data.id });
}
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.includes(value);
};
/** 根据名称筛选学校树 */
watch(deptName, (val) => {
  const _deptOptions = _.cloneDeep(deptOptions);
  treeRef.value.filter(val);
});

getDeptTree();
</script>
<template>
  <div class="head-container">
    <el-input
      v-model="deptName"
      placeholder="请输入老师名称"
      clearable
      prefix-icon="Search"
      style="margin-bottom: 20px"
    />
  </div>
  <div class="head-container">
    <el-tree
      :data="deptOptions"
      :props="{ label: 'label', children: 'children' }"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="treeRef"
      node-key="id"
      highlight-current
      default-expand-all
      @node-click="handleNodeClick"
    />
  </div>
</template>

<style scoped></style>
