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
    url: `/discount/match/coupon/my/coupon/center/page`,
    method: 'get',
    params
  })
}

/**
 * 我的优惠券优惠券数量查询
 */
export function getCouponCount() {
  return request({
    url: `/discount/coupon/myCouponBarCount`,
    method: 'get'
  })
}

/**
 * 领券中心优惠券数量统计
 */
export function getCouponCenterCount() {
  return request({
    url: `/discount/match/coupon/count`,
    method: 'get'
  })
}