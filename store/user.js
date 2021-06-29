export const state = () => ({
  token: null,
  userInfo: null
});

export const mutations = {
  SET_USERINFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  }
};

export const actions = {
  
}