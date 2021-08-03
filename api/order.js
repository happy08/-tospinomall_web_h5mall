import request from './request';
import qs from 'qs';

/**
 * 买家-确定订单
 */
export function submitOrder(data) {
  return request({
    url: '/api/order/omsorder/submitOrder',
    method: 'post',
    data: qs.stringify(data),
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