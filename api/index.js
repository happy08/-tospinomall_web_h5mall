/**
 * api接口统一出口
 */
import qs from 'qs';
import { url, urlLogin } from './config'; // 导入配置域名
import { encrypt } from './cryptoAES'; // 加密解密

export default ({ app }, inject) => {
  const api = {
    getHomeData() { // 获取首页的展示数据
      return app.$axios.get(
        `${url}/basics/app/api/index/findIndexData`
      );
    },
    getInitData() { // 初始化信息查询
      return app.$axios.get(
        `${url}/basics/app/api/index/queryInitData`
      )
    },
    getProductSearch(data) { // 搜索获取商品列表
      return app.$axios({
        url: `${url}/search/productsearch/query`,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getCategoryList() { // 获取分类列表
      return app.$axios({
        url: `${url}/product/nav/category/list/tree/1`,
        method: 'get'
      })
    },
    getHomeSeo() { // 获取首页SEO信息
      return app.$axios({
        url: `${url}/basics/base/mall/seo/findIndex`,
        method: 'get'
      })
    },
    getCategorySeo() { // 获取分类页面SEO信息
      return app.$axios({
        url: `${url}/basics/base/mall/seo/findGoodsCategory`,
        method: 'get'
      })
    },
    getProductDetail(goodId, params) { // 获取商品详情
      return app.$axios({
        url: `${url}/product/goods/client/detail/${goodId}`,
        method: 'get',
        params
      })
    },
    getSearchHot(hit = 10) { // 获取搜索热搜词,默认10调数据
      return app.$axios({
        url: `${url}/search/productsearch/getHotResult/${hit}`,
        method: 'get'
      })
    },
    getHintResult(hit = 1) { // 获得底纹词,默认1条数据
      return app.$axios({
        url: `${url}/search/productsearch/getHintResult/${hit}`,
        method: 'get'
      })
    },
    getCartList(params) { // 获取购物车列表
      return app.$axios({
        url: `${url}/carts/shoppingCart/findListPage`,
        method: 'get',
        params
      })
    },
    getLikeStoreList(params) { // 获取关注店铺列表
      return app.$axios({
        url: `${url}/admin/attention/store/query/page`,
        method: 'get',
        params
      })
    },
    getLikeProduct(params) { // 获取关注商品列表
      return app.$axios({
        url: `${url}/admin/buyerAttention/query/page`,
        method: 'get',
        params
      })
    },
    getUserInfo(token) { // 获取用户信息
      return app.$axios({
        url: `${url}/admin/ums/buyer/findCurrentUserinfo`,
        method: 'get',
        headers: {
          Authorization: token
        }
      })
    },
    getStoreInfo(params) { // 获取店铺详情
      return app.$axios({
        url: `${url}/admin/ums/seller/store/buyer/findByIdAndSellerId`,
        method: 'get',
        params
      })
    },
    getStoreIndex(params) { // 获取店铺首页数据
      return app.$axios({
        url: `${url}/basics/app/api/index/findShopIndex`,
        method: 'get',
        params
      })
    },
    getFootprintList(params) { // 获取用户浏览商品列表
      return app.$axios({
        url: `${url}/product/goods/buyer/browse/record`,
        method: 'get',
        params
      })
    },
    getRecommendList(params) { // 商品详情-商品推荐列表
      return app.$axios({
        url: `${url}/search/productsearch/goodDetail/store/recommended`,
        method: 'get',
        params: params
      })
    },
    getOrderList(params) { // 订单列表
      return app.$axios({
        url: `${url}/order/omsorder/buyer/list/page`,
        method: 'get',
        params
      })
    },
    getHomeRecommendWord() { // 查询首页推荐词
      return app.$axios({
        url: `${url}/basics/base/operator/indexRecommendWords/findAll`,
        method: 'get'
      })
    },
    getRateList(params) { // 评价列表的查询
      return app.$axios({
        url: `${url}/order/omsorder/buyer/orderItem/commentCenter`,
        method: 'get',
        params
      })
    },
    getAfterSaleStatusList(params) { // 售后列表分页查询-处理中/售后记录
      return app.$axios({
        url: `${url}/order/orderReturn/buyer/findAfterSalesPage`,
        method: 'get',
        params
      })
    },
    getAfterSaleList(params) { // 售后申请列表
      return app.$axios({
        url: `${url}/order/omsorder/buyer/findAfterSalesPage`,
        method: 'get',
        params
      })
    },
    getSimilarGood(params) { // 查找相似商品
      return app.$axios({
        url: `${url}/search/productsearch/similar/good`,
        method: 'get',
        params
      })
    },
    getRecommend(data) { // 商品推荐列表
      return app.$axios({
        url: `${url}/search/productsearch/recommend`,
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    refreshToken() { // 刷新token
      return app.$axios({
        url: `${urlLogin}/auth/oauth/token?grant_type=refresh_token`,
        method: 'post',
        data: qs.stringify({
          scope: app.$cookies.get('scope'),
          refresh_token: app.$cookies.get('refreshToken')
        }),
        headers: {
          'Authorization': 'Basic YnV5ZXI6YnV5ZXI='
        }
      })
    },
    logout() { // 退出
      return app.$axios({
        // url: `${url}/auth/token/logout`,
        url: `${urlLogin}/auth/token/logout`,
        method: 'delete',
        headers: {
          Authorization: app.$cookies.get('authToken')
        }
      })
    },
    getLangs() { // 查询当前站点语言及语言列表
      return app.$axios({
        url: `${url}/basics/dict/locale`,
        method: 'get',
        headers: {
          Authorization: app.$cookies.get('authToken')
        }
      })
    },
    getProductDetailSEO() { // 获取商品详情seo信息
      return app.$axios({
        url: `${url}/basics/base/mall/seo/findGoodsDetail`,
        method: 'get'
      })
    },
    getSearchListSEO() { // 获取商品搜索页seo信息
      return app.$axios({
        url: `${url}/basics/base/mall/seo/findGoodsSearch`,
        method: 'get'
      })
    },
    getCategoryLinkMap(navIds) { // 根据前端分类id获取后端分类Id
      return app.$axios({
        url: `${url}/product/nav/category/getCategoryLinkMap`,
        method: 'post',
        data: navIds,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getSupplyCountry() { // 获取当前国家名称和国家图片
      return app.$axios({
        url: `${url}/search/productsearch/getSupplyCountry`,
        method: 'get'
      })
    },
    authLogin(params) { // 账号密码登录
      return app.$axios({
        url: `${urlLogin}/auth/oauth/token`,
        method: 'post',
        data: qs.stringify({ ...params, password: encrypt(params.password) }),
        headers: {
          clientType: 'h5',
          version: '1.0.0',
          language: app.$cookies.get('lang'),
          Authorization: 'Basic YnV5ZXI6YnV5ZXI='
        }
      })
    },
    authCodeLogin(params) { // 手机/邮箱 验证码登录
      return app.$axios({
        url: `${urlLogin}/auth/mobile/token/sms?grant_type=mobile&${qs.stringify(params)}`,
        method: 'post',
        // data: qs.stringify({ ...params }),
        headers: {
          clientType: 'h5',
          version: '1.0.0',
          language: app.$cookies.get('lang')
        }
      })
    },
    thirdPartyLogin(data, headers = {}) { // 第三方登录
      const _data = qs.stringify({...data, mobile: `${JSON.stringify(data.mobile)}`});
      return app.$axios({
        url: `${urlLogin}/auth/mobile/token/social?${_data}`,
        method: 'post',
        // data: qs.stringify(data),
        headers: {
          clientType: 'h5',
          version: '1.0.0',
          language: app.$cookies.get('lang'),
          ...headers
        }
      })
    },
    checkPayOrder(refNo) {
      return app.$axios({
        url: `${url}/order/pay/checkIsPay`,
        method: 'get',
        params: {
          refNo: refNo,
        },
        headers: {
          Authorization: app.$cookies.get('authToken')
        }
      })
    }
  };

  // 测试环境登录、退出登录、刷新token、第三方登录接口地址单独处理：https://auth.fyynet.com/

  // 将api注入程序
  inject('api', api);
};
