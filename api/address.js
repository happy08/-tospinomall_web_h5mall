import request from './request';
import qs from 'qs';

/**
 * 查询当前买家的收货地址
 */
 export function getAddressList() {
  return request({
    url: '/api/admin/ums/buyer/deliveryAddress/findCurrent',
    method: 'post'
  })
}

/**
 * 新增收货地址
 */
export function addAddress(data) {
  return request({
    url: '/api/admin/ums/buyer/deliveryAddress/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查询地区树
 */
export function getAreasTree() {
  return request({
    url: '/api/basics/base/area/findAreasTree',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}