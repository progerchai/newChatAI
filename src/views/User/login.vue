<script setup lang="ts">
/*
 *@description: login page
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-24 22:14:17
 */
import { ref, unref } from 'vue';
import type { ILoginData, IRegisterData } from '@/types';
import { login } from '@/service/user';

const loading = ref(false);
const formRef = ref();
const registerFormRef = ref();
const loginFormData = ref<ILoginData>({} as any);
const registerFormData = ref<IRegisterData>({} as any);
const isLogin = ref(true);
const rules = {
  account: [{ required: true, message: '此项为必填', trigger: 'blur' }],
  password: [{ required: true, message: '此项为必填', trigger: 'blur' }],
  code: [{ required: true, message: '此项为必填', trigger: 'blur' }],
  rePassword: [{ required: true, message: '此项为必填', trigger: 'blur' }],
};
const handleActions = () => {
  isLogin.value = isLogin.value !== true;
};
/**
 * 登录
 */
const handleLogin = async () => {
  loading.value = true;
  const form = unref(formRef);

  await form.validate((valid: any, fields: any) => {
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
};
</script>
<template>
  <div class="content">
    <div class="login-box">
      <img
        class="content-logo"
        src="https://s1.imagehub.cc/images/2023/08/21/logo_cover.png"
      />
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
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：">
            <el-input
              v-model.trim="loginFormData.password"
              placeholder="请输入密码"
              type="password"
              autocomplete="off"
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
          <el-form-item prop="account" label="账号：">
            <el-input
              v-model.trim="registerFormData.account"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code" label="验证码：">
            <el-input
              v-model.trim="registerFormData.code"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码：">
            <el-input
              v-model.trim="registerFormData.password"
              placeholder="请输入密码"
              type="password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="rePassword" label="确认密码：">
            <el-input
              v-model.trim="registerFormData.rePassword"
              placeholder="请确认密码"
              type="rePassword"
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
        <a class="action-btn" @click="handleActions">{{
          isLogin ? '去注册' : '去登录'
        }}</a>
      </div>
    </div>
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
    }
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
      .action-btn {
        position: absolute;
        right: 24px;
        bottom: 20px;
        cursor: pointer;
        color: var(--main-color);
      }
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
}
.form {
  width: 80%;
  margin-bottom: 40px;
  .el-form-item {
    margin-right: 0px;
    width: 100%;
  }

  .el-input__inner {
    font-size: 12px;
  }
}
.registerForm {
  .el-form-item__label {
    width: 100px;
  }
}
</style>
