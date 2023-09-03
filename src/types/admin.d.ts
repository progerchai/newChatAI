export interface IAdminList {
  id: number;
  label: string;
  children?: IAdminList;
}
