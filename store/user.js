// import { setCookie } from '/api/utils';

export const state = () => ({
  authToken: null,
  userInfo: null,
  searchList: [], // 商品搜索历史
  orderSearchList: [], // 订单搜索历史
  refreshToken: null,
  scope: null,
  websocketMsg: null,
  isNewMessage: false,
  account: null // 登陆账号
});

export const mutations = {
  SET_USERINFO(state, userInfo) { // 提交用户信息
    state.userInfo = userInfo;
  },
  SET_TOKEN(state, token) { // 提交token
    state.authToken = token;
    if (token == null) {
      state.userInfo = null;
    }
    this.$cookies.set('authToken', token);
  },
  SET_REFRESHTOKEN(state, refreshToken) {
    state.refreshToken = refreshToken;
    this.$cookies.set('refreshToken', refreshToken);
  },
  SET_SCOPE(state, scope) {
    state.scope = scope;
    this.$cookies.set('scope', scope);
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
    this.$cookies.set('searchList', encodeURI(state.searchList));
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
    this.$cookies.set('orderSearchList', encodeURI(state.orderSearchList));
  },
  SET_WEBSOCKET(state, websocketMsg) {
    state.websocketMsg = websocketMsg;
    this.$cookies.set('websocketMsg', websocketMsg);
  },
  SET_ISNEWMESSAGE(state, isNewMessage) {
    state.isNewMessage = isNewMessage;
    this.$cookies.set('isNewWebsocketMsg', isNewMessage);
  },
  SET_ACCOUNT(state, account) {
    state.account = account;
    this.$cookies.set('account', account);
  }
};

export const actions = {
  GetUserInfo({ commit, state }, authToken) {
    return new Promise((resolve, reject) => {
      // if (state.userInfo) resolve();
      // else
        this.$api.getUserInfo(authToken).then(res => {
          if (res.code != 0) return false;
          
          commit('SET_USERINFO', res.data);
 
          resolve(res);
        }).catch(error => {
          reject(error);
        })
    })
  },
  GetRefreshToken({ commit }) { // 刷新token
    return new Promise((resolve, reject) => {
      this.$api.refreshToken().then(res => {
        console.log('刷新token===================')
        commit('SET_TOKEN', res.data.token_type + ' ' + res.data.access_token);
        commit('SET_REFRESHTOKEN', res.data.refresh_token);
        commit('SET_SCOPE', res.data.scope);

        resolve(res);
      }).catch(error => {
        console.log('-----------------')
        console.log(error)
        commit('SET_TOKEN', null);
        this.$cookies.set('authToken', null);
        this.$router.push({
          name: 'login'
        })
        reject(error);
      })
    })
  },
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      this.$api.logout().then(res => {
        commit('SET_TOKEN', null);
        commit('SET_USERINFO', null);
        this.$router.push({
          name: 'login'
        })
        resolve(res);
      }).catch(error => {
        commit('SET_TOKEN', null);
        commit('SET_USERINFO', null);
        reject(error);
      })
    })
  }
}