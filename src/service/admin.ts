import { post } from '@/utils';
import type { IUser } from '@/types';
/**
 * 获取列表树
 */
export const deptTreeSelect = () => {
  const value = [
    {
      id: 100,
      label: '浙江大学',
      children: [
        {
          id: 101,
          label: '李老师',
        },
        {
          id: 103,
          label: '陈老师',
        },
        {
          id: 104,
          label: '周老师',
        },
        {
          id: 105,
          label: '欧阳老师',
        },
      ],
    },
    {
      id: 102,
      label: '北京大学',
      children: [
        {
          id: 108,
          label: '李老师',
        },
        {
          id: 109,
          label: '刘老师',
        },
      ],
    },
  ];
  return new Promise((resolve) => {
    resolve({ data: value });
  });
};

// 新增用户
export function addUser() {
  // return request({
  //   url: '/system/user',
  //   method: 'post',
  //   data: data
  // })
}

// 修改用户
export function updateUser(data: IUser) {
  // return request({
  //   url: '/system/user',
  //   method: 'put',
  //   data: data
  // })
}

// 用户状态修改
export const changeUserStatus = (params: { uid: number; status: 0 | 1 }) => {
  return post('/api/role/updateStatus.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

// 查询用户列表
export function listUser(query: string) {
  return new Promise((resolve) => {
    resolve({
      rows: [
        {
          uid: 1,
          userName: 'xxx1',
          deptName: '浙江大学',
          phone: '1586872xxxx',
          status: 0,
        },
      ],
      total: 0,
    });
  });
  //   return request({
  //     url: '/system/user/list',
  //     method: 'get',
  //     params: query,
  //   });
}

// 用户密码重置
export function resetUserPwd(userId: number, password: string) {
  const data = {
    userId,
    password,
  };
  //   return request({
  //     url: '/system/user/resetPwd',
  //     method: 'put',
  //     data: data,
  //   });
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
