import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import _ from 'lodash';
const queryString = (params: any) => {
  let str = '';
  for (var key in params) {
    str += key + '=' + params[key] + '&';
  }
  return '?' + str.substr(0, str.length - 1);
};
export const get = async (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const _url = url + queryString(data);
  const response = await axios.get(_url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  return response.data;
};

export const post = async (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const response = await axios.post(url, data || {}, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
  return response.data;
};
