export interface IAdminList {
  id: number;
  label: string;
  children?: IAdminList;
}

export type IRole = 'super_admin' | 'admin' | 'normal';

export interface IInviteExpandReqHistory {
  createTime: string; // 申请创建时间
  count: number; // 申请扩容数量
  status: 0 | 1 | 2; // 扩容请求通过状态, 0是驳回，1是待审核，2是通过
  response: string;
}
export interface IExpandReq {
  id: number; // 请求记录id
  createTime: string; // 申请创建时间
  count: number; // 申请扩容数量
  userName: string; // 申请人名称
  deptName: string; // 申请人学校
  teacherId: number; // 申请人id
}
