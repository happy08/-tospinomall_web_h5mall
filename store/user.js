import { getUserInfo } from '@/api/user';

export const state = () => ({
  token: null,
  token_type: null,
  userInfo: {
    headPictureUrl: ''
  },
  searchList: []
});

export const mutations = {
  SET_USERINFO(state, userInfo) { // 提交用户信息
    state.userInfo = userInfo;
  },
  SET_TOKENTYPE(state, token_type) { // token类型
    state.token_type = token_type;
  },
  SET_TOKEN(state, token) { // 提交token
    state.token = token;
    if (state.token === null) { // 退出登录 清除数据
      state.userInfo = null;
      state.token_type = null;
    }
  },
  SET_SEARCHLIST(state, searchItem) {
    if (searchItem === null) {
      state.searchList = [];
      return false;
    }
    state.searchList.unshift(searchItem);
    state.searchList = [...new Set(state.searchList)]; // 去重
  }
};

export const actions = {
  GetUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.userInfo) resolve();
      else
        getUserInfo(state.token_type + ' ' + state.token).then(res => {
          if (res.code != 0) return false;

          commit('SET_USERINFO', res.data);

          resolve(res);
        }).catch(error => {
          reject(error);
        })
    })
  }
}