import Vue from "vue";
import VueI18n from "vue-i18n";
import { Locale } from "vant";
import enLocale from "vant/lib/locale/lang/en-US";
import zhCNLocale from "vant/lib/locale/lang/zh-CN";
import en from "./locales/en.js";
import zhCN from "./locales/zh-CN.js";

// import { Locale } from 'vant';
// // 引入英文语言包
// import enUS from 'vant/es/locale/lang/en-US';

// Locale.use('en-US', enUS);

Vue.use(VueI18n);

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: store.state.locale || "en",
    messages: {
      "zh-CN": {
        ...zhCNLocale,
        ...zhCN
      },
      en: {
        ...enLocale,
        ...en
      }
    }
  });

  vantLocales(store.state.locale || "en");
};

// 更新vant组件库本身的语言变化，支持国际化
export function vantLocales(lang) {
  if (lang === "en") {
    Locale.use(lang, enLocale);
  } else if (lang === "zh-CN") {
    Locale.use(lang, zhCNLocale);
  }
}
