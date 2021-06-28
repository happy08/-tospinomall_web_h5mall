//import qs from 'qs';
import { Toast } from 'vant';

// 全局提示
const tip = msg => {
  Toast.clear();
  Toast({
    message: msg,
    type: 'fail'
  });
};

export default function({ $axios, app, redirect, store, route }) {
  $axios.defaults.timeout = 8000; // 超时
  
  // $axios.defaults.headers['Content-Type'] = 'application/json'; //'application/x-www-form-urlencoded';
  $axios.onRequest(config => {
    // 登录之后需要在headers中设置token
    // config.headers['Authorization'] = 'Basic YnV5ZXI6YnV5ZXI=';
    if (config.method === 'post') {
      config.headers['Content-Type'] ='application/x-www-form-urlencoded'
    }
    // //获取cookie
    // const token = app.$cookies.get('auth');
    // if (token) {
    //   config.headers.Authorization = token;
    // }

    //注意坑：asyncData中调接口qs.stringify没作用
    // config.data = qs.stringify(config.data, {
    //   allowDots: true //Option allowDots can be used to enable dot notation
    // });
    return config;
  });

  $axios.onResponse(res => {
    //响应成功
    if (res) {
      if (res.data.code === 0) {
        //0 数据成功
        return res.data; //Promise.resolve(res.data);
      }
      // else if (res.data.code === 99) {
      //   //token失效
      //   store.commit('setToken', ''); // 清除token并跳转登录页
      //   if (route.name !== 'login') {
      //     redirect('/login?path=' + route.fullPath);
      //     setTimeout(() => {
      //       tip('请重新登入！');
      //     }, 500);
      //   }
      // }
      else {
        if (res.data.msg) {
          console.log(res.data.msg)
          tip(res.data.msg);
        }
      }
      return Promise.reject(res.data);
    } else {
      //无响应
      console.log('----')
      console.log(res.data.data)
      return Promise.reject(res);
    }
  });

  $axios.onError(error => {
    if (error.code > 0) {
      console.log(error)
      return;
    }
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, redirect, store);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      tip('网络异常');
      return Promise.reject();
    }
  });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, redirect, store) => {
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      redirect('/login/login');
      break;
    case 403:
      tip('登录过期，请重新登录');
      store.commit('setToken', ''); // 清除token并跳转登录页
      setTimeout(() => {
        redirect('/login/login');
      }, 1000);
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
