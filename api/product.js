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