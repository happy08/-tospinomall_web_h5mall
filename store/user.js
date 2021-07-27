import { getUserInfo } from '@/api/user';

export const state = () => ({
  authToken: null,
  userInfo: null,
  searchList: []
});

export const mutations = {
  SET_USERINFO(state, userInfo) { // 提交用户信息
    state.userInfo = userInfo;
    this.$cookies.set('userInfo', userInfo);
  },
  SET_TOKEN(state, token) { // 提交token
    state.authToken = token;
    this.$cookies.set('authToken', token);
    if (state.authToken === null) { // 退出登录 清除数据
      state.userInfo = null;
      this.$cookies.set('authToken', null);
      this.$cookies.set('userInfo', null);
    }
  },
  SET_SEARCHLIST(state, searchItem) {
    if (searchItem === null) {
      state.searchList = [];
    } else {
      state.searchList.unshift(searchItem);
      state.searchList = [...new Set(state.searchList)]; // 去重
    }
    this.$cookies.set('searchList', state.searchList);
  }
};

export const actions = {
  GetUserInfo({ commit, state }, authToken) {
    return new Promise((resolve, reject) => {
      if (state.userInfo) resolve();
      else 
        getUserInfo(authToken).then(res => {
          if (res.code != 0) return false;
          console.log(66666666666)
          console.log(authToken)

          commit('SET_USERINFO', res.data);

          resolve(res);
        }).catch(error => {
          reject(error);
        })
    })
  }
}