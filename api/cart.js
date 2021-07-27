import qs from 'qs';
import request from './request';

/**
 * 获取配送运费模板信息
 */
export function getDeliveryInfo(data) {
  return request({
    url: '/api/product/goods/client/get/delivery/info',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

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

/**
 * 添加购物车
 */
export function addCart(data) {
  return request({
    url: '/api/carts/shoppingCart/addCart',
    method: 'post',
    data: qs.stringify(data)
  })
}