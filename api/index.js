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
    }
    // checkPhoneCode(params) { // 校验用户手机号码
    //   return app.$axios.post(
    //     `${url}/admin/ums/checkcode/checkPhone`,
    //     qs.stringify(params)
    //   )
    // }
  };

  // 将api注入程序
  inject('api', api);
};
