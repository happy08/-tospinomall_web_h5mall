/**
 * 该部分请求都必须是在客户端发起，服务端发起的请求在api/axios.js中
 */
import * as axios from 'axios';
import { Toast } from 'vant';
import { url } from './config'; // 导入配置域名
import { getCookie, setCookie } from './utils';

const service = axios.create({
  baseURL: url,
  timeout: 30000 // 请求超时时间
})

// 全局提示
const tip = msg => {
  Toast.clear();
  Toast({
    message: msg,
    type: 'fail'
  });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
 const errorHandle = (status, redirect, store) => {
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      // redirect('/login');
      break;
    case 403:
      tip('登录过期，请重新登录');
      store.commit('setToken', ''); // 清除token并跳转登录页
      // setTimeout(() => {
      //   redirect('/login');
      // }, 1000);
      break;
    case 404:
      tip('请求的资源不存在');
      break;
    case 408:
      tip('请求超时');
      break;
    case 500:
      tip('服务器错误');
      break;
    case 501:
      tip('服务未实现');
      break;
    case 502:
      tip('网络错误');
      break;
    case 503:
      tip('服务不可用');
      break;
    case 504:
      tip('网络超时');
      break;
    case 505:
      tip('HTTP版本不受支持');
      break;
    default:
      tip(`连接出错!`);
  }
};

// request拦截器
service.interceptors.request.use(config => {
  config.headers['clientType'] = 'h5';
  config.headers['Authorization'] = config.headers.Authorization ? config.headers.Authorization: 'Basic YnV5ZXI6YnV5ZXI=';
  console.log('线下请求')
  console.log(getCookie('authToken') != 'null')
  if (getCookie('authToken') && getCookie('authToken') != 'null' && getCookie('authToken').length > 10) { // 已登录需要改变头部token
    config.headers['Authorization'] = getCookie('authToken');
  }
  
  if (config.method === 'post' || config.method === 'get') {
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded';
  } else {
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  }

  config.headers.language = getCookie('lang');

  return config;
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => { // 成功
  if (response) {
    if (response.data.code === 0) {
      //0 数据成功
      return response.data;
    } else if (response.data.code === 10401) { // 用户凭证已过期,跳转到登录页面
      tip(response.data.msg);
      $nuxt.$store.commit('user/SET_TOKEN', null); // 用户凭证已过期，先刷新token
      $nuxt.$router.push({
        name: 'login'
      })
      
      return response.data;
    } else {
      if (response.data.msg) {
        tip(response.data.msg);
      }
    }
    return Promise.reject(response.data);
  } else {
    //无响应
    return Promise.reject(response);
  }
}, error => { // 失败
  if (error.code > 0) {
    if (error.code == 10401) {
      $nuxt.$store.commit('user/SET_TOKEN', null); // 用户凭证已过期，先刷新token
      $nuxt.$router.push({
        name: 'login'
      })
    }
    console.log('error:');
    console.log(error);
    return;
  }

  const { response } = error;
  if (response) {
    // 请求已发出，但是不在2xx的范围
    errorHandle(response.status);
    return Promise.reject(response);
  } else {
    // 处理断网的情况
    tip('网络异常');
    return Promise.reject();
  }
})

export default service