<script setup>
import { updateUser } from '@/service/admin';
import { ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
const store = useStore('global');
const isAdmin = store.state.role === 'super_admin';

const props = defineProps({
  user: {
    type: Object,
  },
});

const { proxy } = getCurrentInstance();

const rules = ref({
  userName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  phone: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
});

/** 提交按钮 */
function submit() {
  proxy.$refs.userRef.validate((valid) => {
    if (valid) {
      updateUser(props.user).then((res) => {
        if (res.code === 'SUCCESS') {
          proxy.$modal.msgSuccess('修改成功');
        }
      });
    }
  });
}
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
}
</script>

<template>
  <el-form ref="userRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="userName">
      <el-input v-model="user.userName" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="token额度" prop="token" v-if="isAdmin">
      <el-input v-model="user.token" maxlength="50" />
    </el-form-item>
    <el-form-item label="已用token" prop="usedToken" v-if="isAdmin">
      <el-input v-model="user.usedToken" maxlength="50" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
