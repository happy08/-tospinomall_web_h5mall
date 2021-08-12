import { getUserInfo } from '@/api/user';
import { refreshToken, logout } from '/api/login';
import { setCookie } from '/api/utils';

export const state = () => ({
  authToken: null,
  userInfo: null,
  searchList: [], // 商品搜索历史
  orderSearchList: [], // 订单搜索历史
});

export const mutations = {
  SET_USERINFO(state, userInfo) { // 提交用户信息
    state.userInfo = userInfo;
    // setCookie('userInfo', userInfo);
  },
  SET_TOKEN(state, token) { // 提交token
    state.authToken = token;
    if (token == null) { // 退出登录 清除数据
      // state.userInfo = null;
      // setCookie('userInfo', null);
    }
    setCookie('authToken', token);
  },
  SET_SEARCHLIST(state, searchItem) {
    if (searchItem == null) {
      state.searchList = [];
    } else {
      if (Array.isArray(searchItem)) { // 主要是刷新页面时从cookie中获取数据
        state.searchList = state.searchList.concat(searchItem);
      } else {
        state.searchList.unshift(searchItem);
      }
      state.searchList = [...new Set(state.searchList)]; // 去重
    }
    setCookie('searchList', state.searchList);
  },
  SET_ORDERSEARCHLIST(state, searchItem) {
    if (searchItem == null) {
      state.orderSearchList = [];
    } else {
      if (Array.isArray(searchItem)) { // 主要是刷新页面时从cookie中获取数据
        state.orderSearchList = state.orderSearchList.concat(searchItem);
      } else {
        state.orderSearchList.unshift(searchItem);
      }
      state.orderSearchList = [...new Set(state.orderSearchList)]; // 去重
    }
    setCookie('orderSearchList', state.orderSearchList);
  }
};

export const actions = {
  GetUserInfo({ commit, state }, authToken) {
    return new Promise((resolve, reject) => {
      if (state.userInfo) resolve();
      else
        getUserInfo(authToken).then(res => {
          if (res.code != 0) return false;

          commit('SET_USERINFO', res.data);
 
          resolve(res);
        }).catch(error => {
          reject(error);
        })
    })
  },
  GetRefreshToken({ commit, dispatch }) { // 刷新token
    return new Promise((resolve, reject) => {
      refreshToken().then(res => {
        commit('SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        resolve(res);
      }).catch(error => {
        // console.log(error)
        // console.log('=============www')
        // commit('SET_TOKEN', null);
        // setTimeout(() => {
        //   // console.log(window)
        //   // console.log(this)
        //   this.$router.push({
        //     name: 'login'
        //   })
        // }, 100)
        dispatch('Logout');
        reject(error);
      })
    })
  },
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        commit('SET_TOKEN', null);
        location.href = '/login';
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
  }
}