/**
 * api接口统一出口
 */
import qs from 'qs';
import { url } from './config'; // 导入配置域名

export default ({ app }, inject) => {
  const api = {
    getHomeData() { // 获取首页的展示数据
      return app.$axios.get(
        `${url}/basics/app/api/index/findIndexData`
      );
    },
    getCurrentRate() { // 获取当前站点货币信息
      return app.$axios.get(
        `${url}/basics/base/rate/findSiteCurrency`
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
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getHomeSeo() { // 获取首页SEO信息
      return app.$axios({
        url: `${url}/basics/base/mall/seo/findIndex`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getCategorySeo() { // 获取分类页面SEO信息
      return app.$axios({
        url: `${url}/basics/base/mall/seo/findGoodsCategory`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getProductDetail(goodId, params) { // 获取商品详情
      return app.$axios({
        url: `${url}/product/goods/client/detail/${goodId}`,
        method: 'get',
        params: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getSearchHot(hit = 10) { // 获取搜索热搜词,默认10调数据
      return app.$axios({
        url: `${url}/search/productsearch/getHotResult/${hit}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getHintResult(hit = 1) { // 获得底纹词,默认1条数据
      return app.$axios({
        url: `${url}/search/productsearch/getHintResult/${hit}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getCartList(params) { // 获取购物车列表
      return app.$axios({
        url: `${url}/carts/shoppingCart/findListPage`,
        method: 'get',
        params: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getLikeStoreList(params) { // 获取关注店铺列表
      return app.$axios({
        url: `${url}/admin/attention/store/query/page`,
        method: 'get',
        params: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    getLikeProduct(params) { // 获取关注商品列表
      return app.$axios({
        url: `${url}/admin/buyerAttention/query/page`,
        method: 'get',
        params: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
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
    }
  };

  // 将api注入程序
  inject('api', api);
};
