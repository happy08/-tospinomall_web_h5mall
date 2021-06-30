/**
 * api接口统一出口
 */
import qs from 'qs';
import { url } from './config'; // 导入配置域名
import { encrypt } from './cryptoAES'; // 加密

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
    getProductSearch(params) { // 搜索获取商品列表
      return app.$axios({
        url: `${url}/search/productsearch/query`,
        method: 'post',
        data: params,
        headers: {
          'Authorization': 'Basic YnV5ZXI6YnV5ZXI=',
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
    }
  };

  // 将api注入程序
  inject('api', api);
};
