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
