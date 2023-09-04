export interface IAdminList {
  id: number;
  label: string;
  children?: IAdminList;
}

export type IRole = 'super_admin' | 'admin' | 'normal';
