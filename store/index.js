import { vantLocales } from '@/plugins/vue-i18n';

export const state = () => ({
  locales: ['en', 'zh-CN'],
  locale: 'en',
  token: null,
  rate: {
    currency: null
  }
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
      this.app.i18n.locale = locale;
      vantLocales(locale);
      this.$cookies.set('lang', locale);
    }
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_RATE(state, rate) {
    state.rate = rate;
  }
};
