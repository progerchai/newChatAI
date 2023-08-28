import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const isDev = import.meta.env.MODE === 'development';
// const prefix = isDev ? 'http://119.23.229.128' : '';
const prefix = '';
const queryString = (params: any) => {
  let str = '';
  for (var key in params) {
    str += key + '=' + params[key] + '&';
  }
  return '?' + str.substr(0, str.length - 1);
};
const directLogin = () => {
  setTimeout(() => {
    if (!isDev) {
      location.href = '/login';
    }
  }, 1500);
};
const errorHandler = (data: { code: string; message: string }) => {
  if (data?.code === 'ERROR') {
    ElMessage.error(data?.message);
  } else if (data?.code === 'UNLOGIN') {
    ElMessage.error('请前往登录');
    directLogin();
  } else if (data?.code === 'INVALID_TOKEN') {
    ElMessage.error('登陆已过期，请重新登录');
    directLogin();
  }
};
export const get = async (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const _url = prefix + url + queryString(data);
  const response = await axios.get(_url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  errorHandler(response.data);
  return response.data;
};

export const post = async (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const response = await axios.post(prefix + url, data || {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  errorHandler(response.data);
  return response.data;
};
