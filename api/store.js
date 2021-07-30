import request from './request';
// import qs from 'qs';

/**
 * 关注店铺
 */
export function storeFollow(params) {
  return request({
    url: '/api/admin/attention/store/follow',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 取消关注店铺
 */
export function storeCancelFollow(data) {
  return request({
    url: '/api/admin/attention/store/cancel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}