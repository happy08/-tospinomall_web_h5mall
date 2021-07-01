export const state = () => ({
  token: null,
  userInfo: null
});

export const mutations = {
  SET_USERINFO(state, userInfo) { // 提交用户信息
    state.userInfo = userInfo;
  },
  SET_TOKEN(state, token) { // 提交token
    state.token = token;
    if (state.token === null) { // 退出登录 清除数据
      state.userInfo = null;
      localStorage.caler();
    }
  }
};

export const actions = {
}