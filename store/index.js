import { vantLocales } from '@/plugins/vue-i18n';
// import { getUserInfo } from '@/api/user';

export const state = () => ({
  locales: ['en', 'zh-CN'],
  locale: 'en',
  rate: null
});

export const mutations = {
  SET_LANG(state, locale) { // 修改当前语言
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
      this.app.i18n.locale = locale;
      vantLocales(locale);
      this.$cookies.set('lang', locale);
    }
  },
  SET_RATE(state, rate) { // 修改当前货币信息
    state.rate = rate;
    this.$cookies.set('rate', rate);
  }
};

export const actions = {
  // 数据持久化
  async nuxtServerInit ({ commit, dispatch }, { $cookies, $store, $api }) {
    
    // 获取当前语言货币汇率
    const rateData = await $api.getCurrentRate();

    commit('SET_RATE', rateData.data);
    // const rate = $cookies.get('rate'); // 单位
    // const lang = $cookies.get('lang'); // 语言
    const authToken = $cookies.get('authToken'); // 用户token
    console.log('333333333333333333333333333')
    console.log(authToken)
    // 如果有token获取用户信息
    if (authToken) {
      commit('user/SET_TOKEN', authToken);
      const userInfoData = await $api.getUserInfo(authToken);
      commit('user/SET_USERINFO', userInfoData.data);
    }
    const userInfo = $cookies.get('userInfo'); // 用户信息
  },
}