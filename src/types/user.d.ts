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
  uid: number;
  userName?: number;
  phone?: string;
  status?: 1 | 0;
  email?: string;
  password?: string;
  quota?: number;
}
