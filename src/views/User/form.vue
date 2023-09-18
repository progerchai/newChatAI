<script setup lang="ts">
import { login, register, sendEmailCode, reset } from '@/service/user';
import type { ILoginData, IRegisterData } from '@/types';
import { ElMessage } from 'element-plus';
import { getCurrentInstance, ref, unref } from 'vue';
const { proxy } = getCurrentInstance() as any;
const isDev = import.meta.env.MODE === 'development';
const loading = ref(false);
const formRef = ref();
const countDown = ref(-1);
const registerFormRef = ref();
const loginFormData = ref<ILoginData>({} as any);
const registerFormData = ref<IRegisterData>({} as any);
const isLogin = ref(true);
/**
 * 验证邮箱
 */
const validateEmail = (rule: any, value: string, callback: any) => {
  if (
    !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
      value
    )
  ) {
    callback(new Error('邮箱格式错误'));
  } else {
    callback();
  }
};
/**
 * 验证手机号
 */
const validatePhone = (rule: any, value: string, callback: any) => {
  if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
    callback(new Error('手机格式错误'));
  } else {
    callback();
  }
};

const rules = {
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' },
  ],
  account: [{ required: true, message: '此项为必填', trigger: 'blur' }],
  phone: [
    { required: true, message: '手机号为必填', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  username: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
  code: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
  rePassword: [{ required: true, message: '请验证密码', trigger: 'blur' }],
  inviteCode: [{ required: true, message: '请填写邀请码', trigger: 'blur' }],
};
const handleActions = () => {
  isLogin.value = isLogin.value !== true;
};
/**
 * 忘记密码
 */
const handleForget = () => {
  proxy
    .$prompt('请输入邮箱账号', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern:
        /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
      inputErrorMessage: '请输入正确的邮箱',
    })
    .then(({ value }: { value: string }) => {
      reset({ email: value }).then((res) => {
        if (res.code === 'SUCCESS') {
          proxy.$modal.msgSuccess('重置邮件已发送，请查收～');
        }
      });
    })
    .catch(() => {});
};
const countDownFunc = () => {
  countDown.value = 59;
  const interval = setInterval(() => {
    countDown.value = countDown.value - 1;
    if (countDown.value <= 0) {
      clearInterval(interval);
      countDown.value = -1;
    }
  }, 1000);
};
/**
 * 登录
 */
const handleLogin = async () => {
  loading.value = true;
  const form = unref(formRef);

  await form.validate((valid: boolean, fields: any) => {
    if (valid) {
      login({
        account: loginFormData.value.account,
        password: loginFormData.value.password,
      }).then((res) => {
        if (res.code === 'SUCCESS') {
          location.href = '/';
        }
        loading.value = false;
      });
    } else {
      loading.value = false;
    }
  });
};
const handleRegister = async () => {
  // 注册
  const form = unref(registerFormRef);
  form.validate((valid: boolean, fields: any) => {
    if (valid) {
      // 注册
      const { email, phone, username, code, password, rePassword, inviteCode } =
        registerFormData.value;
      if (password !== rePassword) {
        ElMessage.error('密码校验失败');
        return;
      }
      register({
        email,
        phone,
        username,
        code,
        password,
        rePassword,
        inviteCode,
      }).then((res) => {
        if (res.code === 'SUCCESS') {
          ElMessage.success('注册成功');
          setTimeout(() => {
            if (!isDev) {
              location.href = '/';
            }
          }, 1500);
        }
      });
    }
  });
};
/**
 * 发送验证码
 */
const handleCode = () => {
  const form = unref(registerFormRef);
  form.validateField('email', (valid: boolean) => {
    if (valid) {
      // 发送验证码
      sendEmailCode({ email: registerFormData.value.email }).then((res) => {
        if (res.code === 'SUCCESS') {
          ElMessage.success('验证码已发送至邮箱，请注意查收！');
        }
        countDownFunc();
      });
    }
  });
};
const handleLoginFormSelect = (key: string) => {
  const form = unref(formRef);
  form.clearValidate([key]);
};
const handleRegisterFormSelect = (key: string) => {
  const form = unref(registerFormRef);
  form.clearValidate([key]);
};
</script>
<template>
  <div class="form-content">
    <span class="title">{{ isLogin ? '登录' : '注册' }}</span>
    <!-- 登录form  -->
    <el-form
      class="form"
      ref="formRef"
      v-if="isLogin"
      :rules="rules"
      :inline="true"
      :model="loginFormData"
    >
      <el-form-item prop="account" label="账号：">
        <el-input
          v-model.trim="loginFormData.account"
          placeholder="请输入邮箱或账号关联的手机号"
          @input="handleLoginFormSelect('account')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input
          v-model.trim="loginFormData.password"
          placeholder="请输入密码"
          type="password"
          autocomplete="off"
          show-password
          @input="handleLoginFormSelect('password')"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 注册form  -->
    <el-form
      class="form registerForm"
      ref="registerFormRef"
      v-if="!isLogin"
      :rules="rules"
      :inline="true"
      :model="registerFormData"
    >
      <el-form-item prop="email" label="邮箱：">
        <el-input
          v-model.trim="registerFormData.email"
          placeholder="请输入邮箱"
          @input="handleRegisterFormSelect('email')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码：" class="code-item">
        <el-input
          v-model.trim="registerFormData.code"
          placeholder="请输入验证码"
          @input="handleRegisterFormSelect('code')"
        ></el-input>
        <el-button
          type="primary"
          @click="handleCode"
          class="handle-code-btn"
          :disabled="countDown !== -1"
          >{{
            countDown !== -1 ? `${countDown}s 后重试` : '发送验证码'
          }}</el-button
        >
      </el-form-item>
      <el-form-item prop="phone" label="手机号：">
        <el-input
          v-model.trim="registerFormData.phone"
          placeholder="请输入手机号"
          @input="handleRegisterFormSelect('phone')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="username" label="姓名：">
        <el-input
          v-model.trim="registerFormData.username"
          placeholder="请输入姓名"
          @input="handleRegisterFormSelect('username')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input
          v-model.trim="registerFormData.password"
          @input="handleRegisterFormSelect('password')"
          placeholder="请输入密码"
          type="password"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="rePassword" label="确认密码：">
        <el-input
          v-model.trim="registerFormData.rePassword"
          @input="handleRegisterFormSelect('rePassword')"
          placeholder="请确认密码"
          type="password"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="inviteCode" label="邀请码：">
        <el-input
          v-model.trim="registerFormData.inviteCode"
          @input="handleRegisterFormSelect('inviteCode')"
          placeholder="请填写邀请码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button
      v-if="isLogin"
      class="login-btn"
      @click="handleLogin"
      type="primary"
      :loading="loading"
    >
      登录
    </el-button>
    <el-button
      v-if="!isLogin"
      class="login-btn"
      @click="handleRegister"
      type="primary"
      :loading="loading"
    >
      注册
    </el-button>
    <a class="action-forget-btn" @click="handleForget">忘记密码？</a>
    <a class="action-btn" @click="handleActions">{{
      isLogin ? '去注册' : '去登录'
    }}</a>
  </div>
</template>

<style lang="scss">
.form-content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    display: inline-block;
    left: 0px;
    top: 50%;
    width: 1px;
    height: 70%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.2);
  }
  .login-btn {
    width: 120px;
    background: var(--main-color);
  }
  .action-forget-btn {
    position: absolute;
    left: 24px;
    bottom: 20px;
    cursor: pointer;
    color: var(--main-color);
  }
  .action-btn {
    position: absolute;
    right: 24px;
    bottom: 20px;
    cursor: pointer;
    color: var(--main-color);
  }
}
.form {
  width: 90%;
  margin-bottom: 40px;
  .el-form-item {
    margin-right: 0px;
    width: 100%;
  }

  .el-input__inner {
    font-size: 12px;
    padding-left: 0px;
    padding-right: 0px;
  }
  .code-item {
    .el-input {
      flex: 1;
    }
    .handle-code-btn {
      width: 80px;
      font-size: 12px;
    }
  }
}

@media (max-width: 640px) {
  .title {
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 500;
  }
  .form-content {
    padding: 20px 0px;
    background: #ffffff;
    box-shadow: 0px 2px 24px 0px rgba(221, 221, 221, 0.5);
    border-radius: 8px;
    &::after {
      display: none;
    }
  }
}
</style>
<style>
.registerForm {
  .el-form-item__label {
    width: 100px;
  }
}
</style>
