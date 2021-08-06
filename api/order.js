import request from './request';
import qs from 'qs';

/**
 * 买家-确定订单
 */
export function submitOrder(data) {
  return request({
    url: '/api/order/omsorder/submitOrder',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取订单详情
 */
export function getOrderDetail(orderId) {
  return request({
    url: `/api/order/omsorder/buyer/detail/${orderId}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 删除订单
 */
export function deleteOrder(id) {
  return request({
    url: `/api/order/omsorder/buyer/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 取消订单
 */
export function cancelOrder(data) {
  return request({
    url: '/api/order/omsorder/buyer/cancel',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 按条件查询售后订单原因列表
 */
export function getOrderReasonList(params) {
  return request({
    url: '/api/basics/base/trade/orderReason/findByConditions',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}