import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import _ from 'lodash';
const queryString = (params: any) => {
  let str = '';
  if (_.isObject(params)) {
    return '';
  }
  for (var key in params) {
    str += key + '=' + params[key] + '&';
  }
  return '?' + str.substr(0, str.length - 1);
};
export const get = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  const _url = url + queryString(data);
  return axios.get(_url, config || {}) as unknown;
};

export const post = (url: string, data?: object, config?: AxiosRequestConfig) =>
  axios.post(url, data || {}, config || {}) as unknown;
