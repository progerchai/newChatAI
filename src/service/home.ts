import type { IConversation, ISuitable } from '@/types';
import { get, post } from '@/utils';
/**
 * 获取历史会话
 * @param params
 * @returns
 */
export const getHistory = () => {
  return get('/api/getHistory.json') as Promise<{
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
export const getSessionDetail = (params: { sessionId: number }) => {
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
export const generateConv = (params: { title?: string }) => {
  return post('/api/generate.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 删除会话
 */
export const deleteSession = (params: { sessionId: number }) => {
  return post('/api/deleteSession.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};
/**
 * 编辑会话标题
 */
export const changeSessionTitle = (params: {
  sessionId: number;
  title: string;
}) => {
  return post('/api/changeSessionTitle.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 编辑会话标题
 */
export const clearSession = () => {
  return post('/api/clearSession.json') as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 会话点踩
 */
export const comment = (params: {
  sessionId: number;
  suitable: ISuitable;
  id: number;
}) => {
  return post('/api/action/comment.json', params) as Promise<{
    data: number;
    code: string;
  }>;
};

/**
 * 用户反馈
 */
export const sendFeed = (params: { content: string }) => {
  return post('/api/action/feed.json', params) as Promise<{
    data: number;
    code: string;
    message: string;
  }>;
};
