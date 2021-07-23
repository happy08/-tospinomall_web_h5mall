import request from './request';

/**
 * 获取配送运费模板信息
 */
export function getDeliveryInfo(data) {
  return request({
    url: '/api/product/goods/client/get/delivery/info',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}