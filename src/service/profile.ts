import type { IExpandReq, IInviteExpandReqHistory } from '@/types';
import { get, post } from '@/utils';

// 提交邀请码扩容请求[管理员-老师]
export const submitInviteExpandRequest = (params: { count: number }) => {
  return post('/api/role/submitInviteExpandRequest.json', params) as Promise<{
    data: string;
    code: string;
  }>;
};

/**
 * 获取邀请码扩容请求列表[管理员-老师]
 */
export const getRequestList = (params: { page: number; pageSize: number }) => {
  return get('/api/role/getRequestList.json', params) as Promise<{
    data: {
      list: IInviteExpandReqHistory[];
      total: number;
    };
    code: string;
  }>;
};

// 同意/驳回邀请码扩容请求[超管]
export const handleInviteExpandRequest = (params: {
  id: number;
  status: 0 | 1 | 2;
  response: string;
}) => {
  return post('/api/role/handleInviteExpandRequest.json', params) as Promise<{
    data: string;
    code: string;
  }>;
};

/**
 * 获取邀请码扩容请求列表[超管]
 */
export const getInviteExpandRequestList = (params: {
  page: number;
  pageSize: number;
}) => {
  return get('/api/role/getInviteExpandRequestList.json', params) as Promise<{
    data: {
      list: IExpandReq[];
      total: number;
    };
    code: string;
  }>;
};
