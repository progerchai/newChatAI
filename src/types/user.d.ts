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
}

export interface IUser {
  uid: number;
  name: number;
}
