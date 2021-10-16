import { vantLocales } from '@/plugins/vue-i18n';

export const state = () => ({
  locales: ['en', 'zh-CN', /*'zh-TW', 'fr', 'es', 'ms', */'vi', 'pt'],
  locale: 'zh-CN',
  rate: {
    currency: ''
  },
  searchProductList: [], // 商品搜索历史
  searchType: 0, // 搜索类型
  supplyCountry: {} // 国家
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
    // this.$cookies.set('rate', rate);
  },
  SET_SEARCHPRODUCTLIST(state, searchItem) {
    if (searchItem == null) {
      state.searchProductList = [];
    } else {
      if (Array.isArray(searchItem)) { // 主要是刷新页面时从cookie中获取数据
        state.searchProductList = state.searchProductList.concat(searchItem);
      } else {
        state.searchProductList.unshift(searchItem);
      }
      state.searchProductList = [...new Set(state.searchProductList)]; // 去重
    }
    this.$cookies.set('searchProductList', encodeURI(state.searchProductList));
  },
  SET_SEARCHTYPE(state, searchType) {
    state.searchType = searchType;
  },
  SET_SUPPLYCOUNTRY(state, supplyCountry) {
    state.supplyCountry = supplyCountry;
  }
};

export const actions = {
  // 数据持久化
  async nuxtServerInit ({ commit }, { $cookies, $api }) {
    const authToken = $cookies.get('authToken'); // 用户token
    console.log('持久化')
    console.log(authToken)
    // 如果有token获取用户信息
    if (authToken) { // 如果已经登录，每次刷新页面时先重新获取token
      console.log('已登录')
      const authTokenData = await $api.refreshToken();
      if (authTokenData.code != 0) {
        commit('user/SET_TOKEN', null);
        return false;
      }
      commit('user/SET_TOKEN', authTokenData.data.token_type + ' ' + authTokenData.data.access_token);
      commit('user/SET_REFRESHTOKEN', authTokenData.data.refresh_token);
      commit('user/SET_SCOPE', authTokenData.data.scope);
      // 获取用户信息
      const userInfo = await $api.getUserInfo();
      commit('user/SET_USERINFO', userInfo.data);
      commit('user/SET_NOWTIME', userInfo.data.nowTime);

      // 消息信息
      commit('user/SET_WEBSOCKET', $cookies.get('websocketMsg'));
      // 当前账户名
      commit('user/SET_ACCOUNT', { email: authTokenData.data.user_info.email, phone: authTokenData.data.user_info.phone });
    }
    
    // 获取初始化信息
    const initData = await $api.getInitData();
    // 获取当前语言货币汇率
    commit('SET_RATE', initData.data.baseRate);
    // 获取搜索类型
    commit('SET_SEARCHTYPE', initData.data.searchType);

    // 获取当前语言
    const lang = $cookies.get('lang');
    commit('SET_LANG', lang);

    // 获取国家名称和国家图片
    // const countryData = await $api.getSupplyCountry();
    // commit('SET_SUPPLYCOUNTRY', countryData.data);
    
    // 是否有未读消息
    commit('user/SET_ISNEWMESSAGE', Boolean($cookies.get('isNewWebsocketMsg')));

    const searchProductList = decodeURI($cookies.get('searchProductList')); // 商品搜索历史
    if (searchProductList != 'undefined' && searchProductList != '') {
      commit('SET_SEARCHPRODUCTLIST', searchProductList.split(','));
    }

    const searchOrderList = decodeURI($cookies.get('searchOrderList')); // 订单搜索历史
    if (searchOrderList != 'undefined' && searchOrderList != '') {
      commit('user/SET_SEARCHORDERLIST', searchOrderList.split(','));
    }
  }
}