import qs from 'qs';
import request from './request';

/**
 * 我的优惠券列表
 */
export function getCouponList(params) {
  return request({
    url: '/discount/coupon/myCoupons',
    method: 'get',
    params
  })
}

/**
 * 优惠券使用历史列表
 */
export function getUseCouponList(params) {
  return request({
    url: `/discount/coupon/queryCouponUseList`,
    method: 'get',
    params
  })
}

/**
 * 领券中心列表查询
 */
export function getCouponCenterList(params) {
  return request({
    url: `/discount/match/coupon/center/page`,
    method: 'get',
    params
  })
}