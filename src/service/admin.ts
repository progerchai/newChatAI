import { post, get } from '@/utils';
import type { IUser, IAdminList, IRole } from '@/types';

/**
 * 获取列表树
 */
export const deptTreeSelect = () => {
  return get('/api/role/getAdminList.json') as Promise<{
    data: IAdminList;
    code: string;
  }>;
};

// 新增用户
export const addUser = (params: {
  username: string;
  email: string;
  phone: string;
}) => {
  return post('/api/role/createUser.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

// 修改用户
export function updateUser(params: Omit<IUser, 'uid'>) {
  return post('/api/role/updateUser.json', params) as Promise<{
    data: number;
    code: string;
  }>;
}

// 用户状态修改
export const changeUserStatus = (params: { uid: number; status: 0 | 1 }) => {
  return post('/api/role/updateStatus.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

// 查询用户列表
export const listUser = (params: {
  userName?: string;
  phone?: string;
  status?: 1 | 0;
  range: string;
}) => {
  return get('/api/role/getUserList.json', params) as Promise<{
    data: IAdminList;
    code: string;
  }>;
};

// 查询用户列表
export const getUserInfo = (params: { uid: number }) => {
  return get('/api/role/getUserInfo.json', params) as Promise<{
    data: IUser;
    code: string;
  }>;
};

// 用户密码重置
export function resetUserPwd(params: { uid: number; password: string }) {
  return updateUser(params);
}

// 删除用户
export const delUser = (params: { uids: number[] }) => {
  return post('/api/role/deleteUser.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

// 查询用户详细
export function getUser(userId: number) {}

/**
 * 获取用户角色
 * @returns IRole
 */
export const getRole = () => {
  return get('/api/role/getRole.json') as Promise<{
    data: IRole;
    code: string;
  }>;
};
