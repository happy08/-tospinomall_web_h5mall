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
    config.headers['site'] = 'ghana';
    // config.headers['Authorization'] = 'Basic YnV5ZXI6YnV5ZXI=';
    if (config.method === 'post' || config.method === 'get') {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded';
    } else {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    }
    console.log(2222222222)
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
      } else if (res.data.code == 10401) { // 用户凭证过期跳转到登录页面
        console.log('响应成功')
        store.commit('user/SET_TOKEN', null);
        redirect({
          name: 'login'
        })
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
        console.log('响应失败')
        console.log(error)
        store.commit('user/SET_TOKEN', null);
        redirect({
          name: 'login'
        })
      }
      tip(error.msg);
      
      return Promise.reject(error);
    }
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, redirect, store, app);
      
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
const errorHandle = (status, redirect, store, app) => {
  switch (status) {
    // 401: 未登录状态，跳转登录页
    // case 401:
    //   store.commit('user/SET_TOKEN', null);
    //   break;
    // case 10401:
    //   tip(app.i18n.t('axios_tip_10401'));
    //   // setTimeout(() => {
    //   //   redirect('/login');
    //   // }, 1000);
    //   break;
    case 404:
      tip(app.i18n.t('axios_tip_404'));
      break;
    case 408:
      tip(app.i18n.t('axios_tip_408'));
      break;
    case 500:
      tip(app.i18n.t('axios_tip_500'));
      break;
    case 501:
      tip(app.i18n.t('axios_tip_501'));
      break;
    case 502:
      tip(app.i18n.t('axios_tip_502'));
      break;
    case 503:
      tip(app.i18n.t('axios_tip_503'));
      break;
    case 504:
      tip(app.i18n.t('axios_tip_504'));
      break;
    case 505:
      tip(app.i18n.t('axios_tip_505'));
      break;
    default:
      tip(app.i18n.t('axios_tip_connect'));
  }
};
