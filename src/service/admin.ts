import { post, get } from '@/utils';
import type { IUser, IAdminList, IRole } from '@/types';
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
export function updateUser(params: IUser) {
  return post('/api/role/updateStatus.json', params) as Promise<{
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
export const listUser = (params: { uid: number }) => {
  return new Promise((resolve) => {
    resolve({
      rows: [
        {
          uid: 1,
          userName: '测试用户',
          deptName: '浙江大学',
          phone: '1586872xxxx',
          status: 0,
          token: 20000,
          usedToken: 355,
          createTime: '2023-08-20 15:40:23',
        },
        {
          uid: 2,
          userName: '测试用户',
          deptName: '浙江大学',
          phone: '1586872xxxx',
          status: 0,
          token: 20000,
          usedToken: 355,
          createTime: '2023-08-20 15:40:23',
        },
      ],
      total: 0,
    });
  });
  return get('/api/role/getUserList.json') as Promise<{
    data: IAdminList;
    code: string;
  }>;
};

// 查询用户列表
export const getUserInfo = () => {
  return new Promise((resolve) => {
    resolve({
      data: {
        uid: 2,
        userName: '测试名称',
        deptName: '浙江大学',
        phone: '1586872xxxx',
        status: 0,
        token: 20000,
        usedToken: 355,
        createTime: '2023-08-20 15:40:23',
      },
      code: 'SUCCESS',
    });
  });
  return get('/api/role/getUserInfo.json') as Promise<{
    data: IUser;
    code: string;
  }>;
};

// 用户密码重置
export function resetUserPwd(params: { uid: number; password: string }) {
  return updateUser(params).then((res) => {
    if (res.code === 'SUCCESS') {
    }
  });
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
  return new Promise((resolve) => {
    resolve({
      data: 'super_admin',
      code: 'SUCCESS',
    });
  });
  return get('/api/role/getRole.json') as Promise<{
    data: IRole;
    code: string;
  }>;
};
