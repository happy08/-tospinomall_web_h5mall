import request from './request';
// import qs from 'qs';
// import { encrypt } from './cryptoAES'; // 加密解密

/**
 * 首页-搜索商品列表
 */
export function getSearchList(params) {
  return request({
    url: '/api/search/productsearch/query',
    method: 'post',
    params: params,
    headers: {
      'Authorization': 'Basic YnV5ZXI6YnV5ZXI=',
      'Content-Type': 'application/json'
    }
  })
}