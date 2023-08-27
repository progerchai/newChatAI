import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const perfix = '';
import.meta.env.MODE === 'development' ? 'http://119.23.229.128' : '';
const queryString = (params: any) => {
  let str = '';
  for (var key in params) {
    str += key + '=' + params[key] + '&';
  }
  return '?' + str.substr(0, str.length - 1);
};
const errorHandler = (data: { code: string; message: string }) => {
  if (data?.code === 'ERROR') {
    ElMessage.error(data?.message);
  } else if (data?.code === 'UNLOGIN') {
    ElMessage.error('请前往登录');
    setTimeout(() => {
      location.href = '/login';
    }, 1500);
  }
};
export const get = async (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const _url = perfix + url + queryString(data);
  const response = await axios.get(_url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  console.log(22222, response);
  errorHandler(response.data);
  return response.data;
};

export const post = async (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const response = await axios.post(perfix + url, data || {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  errorHandler(response.data);
  return response.data;
};
