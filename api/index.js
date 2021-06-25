/**
 * api接口统一出口
 */
// import qs from 'qs';
import { url } from './config'; // 导入配置域名

export default ({ app }, inject) => {
  const api = {
    phonePrefix() { // 获取手机号前缀
      return app.$axios.get(
        `${url}/basics/base/phonePrefix/find/0` // 0 可用 1不可用
      ); //单个/批量启用禁用
    },
    getPhoneCode(params) { // 获取手机验证码
      return app.$axios.get(
        `${url}/admin/ums/checkcode/getPhoneCode?${params}`
      ); //单个/批量启用禁用
    },
    checkPhoneCode(params) { // 校验用户手机号码
      return app.$axios.post(
        `${url}/admin/ums/checkcode/checkPhone`,
        params
      )
    },
    buyerRegister(params) { // 买家用户注册
      return app.$axios.post(
        `${url}/ums/buyer/register`,
        params
      )
    }
  };

  // 将api注入程序
  inject('api', api);
};
