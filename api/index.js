/**
 * api接口统一出口
 */
import qs from "qs";
import { url } from "./config"; // 导入配置域名

export default ({ app, $axios }, inject) => {
  const api = {
    nuxtApi(params) {
      return app.$axios.post(
        `${url}/product/mmsGoodsSpecModel/mall/updateEnableDisableByIds`,
        params
      ); //单个/批量启用禁用
    },
    nuxtApi2(params) {
      return app.$axios.post(
        `${url}/product/mmsGoodsSpecModel/mall/updateEnableDisableByIds`,
        params
      ); //单个/批量启用禁用
    }
  };
  inject("api", api);
};
