import request from './request';

/**
 * 买家取消关注商品
 */
export function cancelAttentionGood(data) {
  return request({
    url: '/api/admin/buyerAttention/cancel/attention/good',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 删除浏览商品的记录
 */
export function deleteFootprintRecord(data) {
  return request({
    url: '/api/product/goods/buyer/delete/browse/record',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 商品评价列表
 */
export function getRateList(params) {
  return request({
    url: '/api/product/evaluate/goods/list',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 商品评价点赞
 */
export function addGive(id) {
  return request({
    url: `/api/product/evaluate/give/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 商品评价详情
 */
export function getRateDetail(id) {
  return request({
    url: `/api/product/evaluate/info/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 获取商品属性
 */
export function getGoodAttr(goodId) {
  return request({
    url: `/api/product/goods/get/attrGroup/${goodId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}