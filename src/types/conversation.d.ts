export interface IConversation {
  id: number; // 小会话id
  idx?: number; // 大会话下标
  title?: string;
  speaker?: 'human' | 'ai';
  speech?: string; // 对话内容
  speeches?: string[] | string; // ai 多段对话
  suitable?: ISuitable; //对话评价 -1 bad，0 未选，1 good
  loading?: boolean;
  selected?: boolean;
  delete?: boolean;
  editable?: boolean;
}
export type ISuitable = -1 | 0 | 1;
