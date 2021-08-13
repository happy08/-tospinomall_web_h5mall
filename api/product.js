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
    params
  })
}

/**
 * 商品评价点赞
 */
export function addGive(id) {
  return request({
    url: `/api/product/evaluate/give`,
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 商品评价详情
 */
export function getRateDetail(id, userId) {
  return request({
    url: `/api/product/evaluate/info/app`,
    method: 'get',
    params: {
      id,
      userId
    }
  })
}

/**
 * 获取商品属性
 */
export function getGoodAttr(goodId) {
  return request({
    url: `/api/product/goods/get/attrGroup/${goodId}`,
    method: 'get'
  })
}

/**
 * 置顶关注商品
 */
export function attentionGoodTop(params) {
  return request({
    url: '/api/admin/buyerAttention/top/good',
    method: 'get',
    params
  })
}

/**
 * 提交商品评论投诉
 */
export function reportEvaluate(data) {
  return request({
    url: '/api/product/evaluate/reports',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 新增商品评价
 */
 export function addEvaluate(data) {
  return request({
    url: '/api/product/evaluate/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 商品评论回复
 */
export function replyEvaluate(data) {
  return request({
    url: '/api/product/evaluate/reply',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}