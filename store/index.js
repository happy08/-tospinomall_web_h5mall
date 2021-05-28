import { vantLocales } from "@/plugins/vue-i18n";

export const state = () => ({
  locales: ["en", "zh-CN"],
  locale: "zh-CN"
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
      vantLocales(locale);
      this.$cookies.set("lang", locale);
    }
  }
};
