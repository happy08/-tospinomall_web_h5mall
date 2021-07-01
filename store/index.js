import { vantLocales } from '@/plugins/vue-i18n';

export const state = () => ({
  locales: ['en', 'zh-CN'],
  locale: 'en',
  rate: {
    currency: null
  }
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
  }
};
