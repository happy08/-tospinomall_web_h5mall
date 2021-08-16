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
    method: 'get'
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
    // url: '/api/basics/base/trade/orderReason/findByConditions',
    url: '/api/basics/base/trade/orderReason/findReasonByApplyTypeAndGoodsStatus',
    method: 'get',
    params
  })
}

/**
 * 评价中心的统计
 */
export function getOrderRateCount() {
  return request({
    url: '/api/order/omsorder/buyer/orderItem/commentCount',
    method: 'get'
  })
}

/**
 * 售后列表的统计
 */
export function getOrderAfterSalesCount() {
  return request({
    url: '/api/order/orderReturn/buyer/findAfterSalesCount',
    method: 'get'
  })
}

/**
 * 获取订单项详情
 */
export function getOrderItem(itemId) {
  return request({
    url: `/api/order/omsorder/buyer/getItemById/${itemId}`,
    method: 'get'
  })
}

/**
 * 申请售后
 */
export function applyAfterSale(data) {
  return request({
    url: '/api/order/orderReturn/buyer/applyAfterSale',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 申请售后-修改申请
 */
export function updateApply(data) {
  return request({
    url: '/api/order/orderReturn/buyer/updateApply',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取退款详情
 */
export function getReturnDetail(returnId) {
  return request({
    url: `/api/order/orderReturn/buyer/returnDetail/${returnId}`,
    method: 'get'
  })
}

/**
 * 修改申请-获取退款详情
 */
export function getUpdateReturnDetail(returnId) {
  return request({
    url: `/api/order/orderReturn/buyer/returnDetail/update/${returnId}`,
    method: 'get'
  })
}

/**
 * 获取协商历史
 */
export function getNegotiationHistory(orderReturnId) {
  return request({
    url: `/api/order/orderReturn/buyer/findNegotiationHistory/${orderReturnId}`,
    method: 'get'
  })
}

/**
 * 买家撤销申请
 */
export function revokeApply(orderReturnId) {
  return request({
    url: '/api/order/orderReturn/buyer/revokeApply',
    method: 'post',
    data: qs.stringify({ orderReturnId })
  })
}

/**
 * 获取个人订单统计
 */
export function getOrderCount() {
  return request({
    url: '/api/order/omsorder/buyer/get/count',
    method: 'get'
  })
}

/**
 * 买家确定收货
 */
export function confirmReceiptOrder(orderId) {
  return request({
    url: `/api/order/omsorder/buyer/take/${orderId}`,
    method: 'get'
  })
}

/**
 * 查看物流信息
 */
export function getLogisticsInfo(no) {
  return request({
    url: `/api/order/omsorder/buyer/getLogisticsInfo/${no}`,
    method: 'get'
  })
}

/**
 * 买家-删除订单
 */
export function removeOrder(id) {
  return request({
    url: '/api/order/orderReturn/buyer/removeOrder',
    method: 'post',
    data: qs.stringify({ id })
  })
}