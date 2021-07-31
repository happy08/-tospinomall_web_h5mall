import { vantLocales } from '@/plugins/vue-i18n';

export const state = () => ({
  locales: ['en', 'zh-CN', 'zh-TW', 'fr', 'es', 'ms', 'vi'],
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
  async nuxtServerInit ({ commit }, { $cookies, $api }) {
    const lang = $cookies.get('lang'); // 语言
    commit('SET_LANG', lang);
    const authToken = $cookies.get('authToken'); // 用户token
    console.log('持久化')
    // 如果有token获取用户信息
    if (authToken) {
      commit('user/SET_TOKEN', authToken);
      const userInfoData = await $api.getUserInfo(authToken);
      commit('user/SET_USERINFO', userInfoData.data);
    }
    const searchList = $cookies.get('searchList'); // 搜索历史
    console.log(searchList)
    commit('user/SET_SEARCHLIST', searchList);

    // 获取当前语言货币汇率
    const rateData = await $api.getCurrentRate();
    commit('SET_RATE', rateData.data);
  },
}