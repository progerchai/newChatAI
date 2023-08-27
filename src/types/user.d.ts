export interface ILoginData {
  account: string;
  password: string;
}
export interface IRegisterData {
  email: string;
  phone: string;
  password: string;
  rePassword: string;
  code: number;
}

export interface IUser {
  accountId: number;
  name: number;
}
