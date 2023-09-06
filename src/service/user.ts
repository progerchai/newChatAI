import { post } from '@/utils';
/**
 * 登录
 */
export const login = (params: { account: string; password: string }) => {
  return post('/api/user/login.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 发送验证码
 */
export const sendEmailCode = (params: { email: string }) => {
  return post('/api/user/send_email.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 注册
 */
export const register = (params: {
  email: string;
  phone: string;
  username: string;
  code: string;
  password: string;
  rePassword: string;
  inviteCode?: string;
}) => {
  return post('/api/user/register.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 重置密码
 */
export const resetPassword = (params: {
  oldPassword: string;
  password: string;
  rePassword: string;
}) => {
  return post('/api/user/resetPassword.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};
