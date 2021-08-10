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
    method: 'get'
  })
}

/**
 * 关注商品
 */
export function attentionProduct(params) {
  return request({
    url: `/api/admin/buyerAttention/attention/good`,
    method: 'get',
    params
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

/**
 * 删除购物车 skuIds多个用下划线_分割
 */
export function removeCart(data) {
  return request({
    url: '/api/carts/shoppingCart/removeCart',
    method: 'delete',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 设置经常购买
 */
export function setOftenBuy(data) {
  return request({
    url: '/api/carts/shoppingCart/setOftenBuy',
    method: 'put',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 购物车总数查询
 */
export function getCartCount() {
  return request({
    url: '/api/carts/shoppingCart/findCount',
    method: 'get'
  })
}

/**
 * 添加收藏
 */
export function moveToFavorite(data) {
  return request({
    url: '/api/carts/shoppingCart/moveToFavorites',
    method: 'delete',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 计算商品价格
 */
export function getCalculatePrice(data) {
  return request({
    url: '/api/carts/shoppingCart/calculatePrice',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 购物车修改商品数量
 */
export function updateCartNum(data) {
  return request({
    url: '/api/carts/shoppingCart/updateCartNumById',
    method: 'put',
    data
  })
}

/**
 * 获取销售信息
 */
export function getSaleInfo(data) {
  return request({
    url: '/api/product/goods/get/saleInfo',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}