import { post } from '@/utils';
import type { IUser } from '@/types';
/**
 * 获取列表树
 */
export const deptTreeSelect = () => {
  //   return post('/api/user/login.json', params) as Promise<{
  //     data: number;
  //     code: string;
  //   }>;
  return [
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
export function changeUserStatus(userId: number, status: string) {
  const data = {
    userId,
    status,
  };
  //   return request({
  //     url: '/system/user/changeStatus',
  //     method: 'put',
  //     data: data,
  //   });
}

// 查询用户列表
export function listUser(query: string) {
  return new Promise((resolve) => {
    resolve({
      rows: [],
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
export function delUser(userId: number) {
  //   return request({
  //     url: '/system/user/' + userId,
  //     method: 'delete',
  //   });
}

// 查询用户详细
export function getUser(userId: number) {
  //   return request({
  //     url: '/system/user/' + parseStrEmpty(userId),
  //     method: 'get'
  //   })
}
