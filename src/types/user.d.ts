export interface ILoginData {
  account: string;
  password: string;
}
export interface IRegisterData {
  email: string;
  phone: string;
  password: string;
  rePassword: string;
  code: string;
  username: string;
  inviteCode?: string;
}

export interface IUser {
  /**
   * 用户id
   */
  uid: number;
  /**
   * 用户名称
   */
  userName?: number;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 是否启用 ，1: 启用，0: 停用
   */
  status?: 1 | 0;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * token额度
   */
  quota?: number;
  /**
   * 已用token额度
   */
  usedQuota?: number;
  /**
   * 性别
   */
  sex?: 1 | 0;
  /**
   * 关联的老师id
   */
  teacherId: number;
  /**
   * 邀请码
   */
  inviteCode?: string;
  /**
   * 创建
   */
  createTime?: string;
  /**
   * 用户学校
   */
  deptName?: string;
}
