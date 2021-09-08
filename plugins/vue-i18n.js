import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Locale } from 'vant';
import enLocale from 'vant/lib/locale/lang/en-US';
import zhCNLocale from 'vant/lib/locale/lang/zh-CN';
import zhTWLocale from 'vant/lib/locale/lang/zh-TW'; // 中文繁体
// import frLocale from 'vant/lib/locale/lang/fr-FR'; // 法语
import esLocale from 'vant/lib/locale/lang/es-ES'; // 西班牙语
import en from './locales/en.js';
import zhCN from './locales/zh-CN.js';
import zhTW from './locales/zh-TW.js';
import fr from './locales/fr.js';
import es from './locales/es.js';
import ms from './locales/ms.js';
import vi from './locales/vi.js';

Vue.use(VueI18n);


// 更新vant组件库本身的语言变化，支持国际化
export function vantLocales(lang) {
  if (lang === 'en') {
    Locale.use(lang, enLocale);
  } else if (lang === 'zh-CN') {
    Locale.use(lang, zhCNLocale);
  } else if (lang === 'zh-TW') {
    Locale.use(lang, zhTWLocale);
  } else if (lang === 'fr') {
    Locale.use(lang, esLocale);
  } else if (lang === 'es') {
    Locale.use(lang, esLocale);
  } else if (lang === 'ms') {
    Locale.use(lang, esLocale);
  } else if (lang === 'vi') {
    Locale.use(lang, esLocale);
  }
}

// 导出语言数据
export default async ({ app, store }) => {
  // 获取默认站点语言
  const defaultLocale = function () {
    return new Promise(resolve => {
      app.$api.getLangs().then(res => {
        resolve(res.data.defaultLocale);
      });
    })
  }
  
  app.i18n = new VueI18n({
    locale: store.state.locale || await defaultLocale(),
    // fallbackLocale: store.state.locale || 'en',
    fallbackLocale: await defaultLocale(),
    messages: {
      'zh-CN': {
        ...zhCNLocale,
        ...zhCN
      },
      'en': {
        ...enLocale,
        ...en
      },
      'zh-TW': {
        ...zhTWLocale,
        ...zhTW
      },
      'fr': {
        ...esLocale,
        ...fr
      },
      'es': {
        ...esLocale,
        ...es
      },
      'ms': {
        ...esLocale,
        ...ms
      },
      'vi': {
        ...esLocale,
        ...vi
      }
    }
  });
  
  vantLocales(store.state.locale || await defaultLocale());
};
