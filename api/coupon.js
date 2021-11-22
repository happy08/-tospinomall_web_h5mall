import qs from 'qs';
import request from './request';

/**
 * 我的优惠券
 */
export function getDeliveryInfo(params) {
  return request({
    url: '/discount/coupon/myCoupons',
    method: 'get',
    params
  })
}