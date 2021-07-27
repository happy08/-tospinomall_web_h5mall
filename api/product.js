import request from './request';
// import qs from 'qs';
// import { encrypt } from './cryptoAES'; // 加密解密

/**
 * 根据skuid获取库存数量
 */
export function getSkuStock(skuId) {
  return request({
    url: `/api/product/goods/get/stock/${skuId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 关注商品
 */
export function attentionProduct(params) {
  return request({
    url: `/api/admin/buyerAttention/attention/good`,
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}