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

export default function({ $axios, app, redirect, store }) {
  $axios.defaults.timeout = 30000; // 超时

  $axios.onRequest(config => {
    // 调用登录接口的时候需要固定值 Basic YnV5ZXI6YnV5ZXI= , 登录之后需要在headers中传用户token
    // console.log(config)
    config.headers['clientType'] = 'h5';
    // config.headers['Authorization'] = 'Basic YnV5ZXI6YnV5ZXI=';
    if (config.method === 'post' || config.method === 'get') {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded';
    } else {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    }
    console.log(22222222222222222)
    // 登录之后要重新复值token
    // if (store.state.user.authToken && config.url != '/auth/oauth/token?grant_type=refresh_token') {
    //   config.headers['Authorization'] = `${store.state.user.authToken}`;
    // }
    if (config.headers.Authorization) {
      config.headers['Authorization'] = config.headers.Authorization;
    } else if (store.state.user.authToken && config.url != '/auth/oauth/token?grant_type=refresh_token') {
      config.headers['Authorization'] = `${store.state.user.authToken}`;
    } else {
      config.headers['Authorization'] = 'Basic YnV5ZXI6YnV5ZXI=';
    }
    config.headers.language = store.state.locale;
    console.log(config)
    // const _local = JSON.parse(localStorage.getItem('b2c-store'));
    // console.log(localStorage.getItem('b2c-store'))
    // if (_local.user.authToken) { // 已登录需要改变头部token
    //   config.headers['Authorization'] = _local.user.authToken;
    // }
    // //获取cookie
    // const token = app.$cookies.get('authToken');
    // if (store.state.user.authToken) {
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
        return res.data; //Promise.resolve(res.data);
      } else if (res.data.code === 10401) { // 用户凭证过期跳转到登录页面
        store.commit('user/SET_TOKEN', null);
      } else {
        if (res.data.msg) {
          console.log(res.data.msg)
          tip(res.data.msg);
        }
      }
      return Promise.resolve(res.data);
    } else {
      //无响应
      return Promise.reject(res);
    }
  });

  $axios.onError(error => {
    if (error.code > 0) {
      if (error.code === 10401) { // 用户凭证过期跳转到登录页面
        store.commit('user/SET_TOKEN', null);
        // redirect({
        //   name: 'login'
        // })
      }
      tip(error.msg);
      
      return Promise.reject(error);
    }
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, redirect, store);
      // 可以新建一个错误页面来展示错误
      // console.log(response.status)
      // redirect({
      //   name: 'error',
      //   query: {
      //     status: response.status
      //   }
      // })
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // redirect({
      //   name: 'error',
      //   query: {
      //     status: 100000000
      //   }
      // })
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
      redirect('/login');
      break;
    case 10401:
      tip('登录过期，请重新登录');
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
