/**
 * api接口统一出口
 */
import qs from 'qs';
import { url } from './config'; // 导入配置域名
import { encrypt } from './cryptoAES'; // 加密

export default ({ app }, inject) => {
  const api = {
    // getPhoneCode(params) { // 获取手机验证码
    //   return app.$axios.get(
    //     `${url}/admin/ums/checkcode/getPhoneCode?${params}`
    //   ); //单个/批量启用禁用
    // },
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
