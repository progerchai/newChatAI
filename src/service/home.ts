import type { IConversation } from '@/types';
import { get, post } from '@/utils';
/**
 * 获取历史会话
 * @param params
 * @returns
 */
export const getHistory = (params: { accountId: number }) => {
  return get('/api/getHistory.json', params) as Promise<{
    data: {
      list: Array<{ id: number; title: string }>;
    };
    code: string;
  }>;
};
/**
 * 获取会话详情
 * @param params
 * @returns
 */
export const getSessionDetail = (params: {
  accountId: number;
  sessionId: number;
}) => {
  return get('/api/getSessionDetail.json', params) as Promise<{
    data: IConversation[];
    code: string;
  }>;
};
/**
 * 生成会话id
 * @param params 账号id
 * @returns
 */
export const generateConv = (params: { accountId: number }) => {
  return post('/api/generate.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};
