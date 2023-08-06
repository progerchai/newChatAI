import { get, post } from '@/utils';

export const fetchTest = (params: { id: number }) => {
  return get('/test', params) as Promise<{
    data: any;
    code: string;
  }>;
};

export const postText = (params: { id: number }) => {
  return post('/post_test', params) as Promise<{
    data: any;
    code: string;
  }>;
};
