import request from './request';
// import qs from 'qs';

/**
 * 关注店铺
 */
export function storeFollow(params) {
  return request({
    url: '/admin/attention/store/follow',
    method: 'get',
    params
  })
}

/**
 * 取消关注店铺
 */
export function storeCancelFollow(data) {
  return request({
    url: '/admin/attention/store/cancel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 置顶关注店铺
 */
export function attentionStoreTop(params) {
  return request({
    url: '/admin/attention/store/top',
    method: 'get',
    params
  })
}