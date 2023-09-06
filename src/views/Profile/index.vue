<script setup name="Profile">
import userInfo from './userInfo.vue';
import resetPwd from './resetPwd.vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { reactive, ref } from 'vue';
const router = useRouter();
const store = useStore('global');
const user = store.state?.userInfo;
const role = store.state?.role;
if (!user) {
  router.push('/404.html');
}
const activeTab = ref('userinfo');
const state = reactive({
  user: user,
});
const roleDict = {
  super_admin: '超级管理员',
  admin: '教师',
  normal: '学生',
};
const sexDict = {
  0: '女',
  1: '男',
};
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                用户名称
                <div class="pull-right">{{ state.user.userName }}</div>
              </li>
              <li class="list-group-item">
                用户id
                <div class="pull-right">{{ state.user.uid }}</div>
              </li>
              <li class="list-group-item">
                绑定教师id
                <div class="pull-right">{{ state.user.teacherId }}</div>
              </li>
              <li class="list-group-item">
                用户学校
                <div class="pull-right">{{ state.user.deptName }}</div>
              </li>
              <li class="list-group-item">
                手机号码
                <div class="pull-right">{{ state.user.phone }}</div>
              </li>
              <li class="list-group-item">
                用户邮箱
                <div class="pull-right">{{ state.user.email }}</div>
              </li>
              <li class="list-group-item">
                性别
                <div class="pull-right">
                  {{ sexDict[state.user.sex] || '未知' }}
                </div>
              </li>
              <li class="list-group-item">
                所属角色
                <div class="pull-right">{{ roleDict[role] }}</div>
              </li>
              <li class="list-group-item">
                创建日期
                <div class="pull-right">
                  {{
                    state.user.createTime
                      ? dayjs(state.user.createTime).format('YYYY-MM-DD HH:mm')
                      : null
                  }}
                </div>
              </li>
              <li class="list-group-item">
                token额度
                <div class="pull-right">{{ state.user.token }}</div>
              </li>
              <li class="list-group-item">
                已用token
                <div class="pull-right">{{ state.user.usedToken }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="state.user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.app-container {
  padding: 20px;
}
</style>
