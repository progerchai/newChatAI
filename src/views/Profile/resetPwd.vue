<script setup>
import { resetPassword } from '@/service/user';
import { ref, reactive, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const user = reactive({
  oldPassword: undefined,
  password: undefined,
  rePassword: undefined,
});
console.log(222);
const equalToPassword = (rule, value, callback) => {
  if (user.password !== value) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};
const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  rePassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
});

/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate((valid) => {
    if (valid) {
      resetPassword({
        oldPassword: user.oldPassword,
        password: user.password,
        rePassword: user.rePassword,
      }).then((res) => {
        if (res.code === 'SUCCESS') {
          proxy.$modal.msgSuccess('修改成功');
        }
      });
    }
  });
}
</script>

<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input
        v-model="user.password"
        placeholder="请输入新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="rePassword">
      <el-input
        v-model="user.rePassword"
        placeholder="请确认新密码"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>
