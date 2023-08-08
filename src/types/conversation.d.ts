export interface IConversation {
  idx?: number; // 对话下标
  title?: string;
  speaker?: 'human' | 'ai';
  speech?: string; // 对话内容
  speeches?: string[]; // ai 多段对话
  suitable?: (-1 | 0 | 1)[]; //对话评价 -1 bad，0 未选，1 good
  loading?: boolean;
  selected?: boolean;
  delete?: boolean;
  editable?: boolean;
}
