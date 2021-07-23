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

/**
 * 查看收货地址
 */
export function getAddressDetail(id) {
  return request({
    url: `/api/admin/ums/buyer/deliveryAddress/findByIdInner/${id}`,
    method: 'post',
  })
}

/**
 * 通过父级查询下一级地区
 */
export function getNextArea(params) {
  return request({
    url: '/api/basics/base/area/findByParentId',
    method: 'get',
    params
  })
}

/**
 * 修改收货地址
 */
export function updateAddress(data) {
  return request({
    url: '/api/admin/ums/buyer/deliveryAddress/updateById',
    method: 'put',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 删除地址
 */
export function deleteAddress(id) {
  return request({
    url: `/api/admin/ums/buyer/deliveryAddress/deleteById/${id}`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 修改指定地址为默认地址
 */
export function updateDefaultAddress(id) {
  return request({
    url: `/api/admin/ums/buyer/deliveryAddress/updateIsDefault/${id}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 查询当前买家的默认收货地址
 */
export function getCurrentDefaultAddress() {
  return request({
    url: '/api/admin/ums/buyer/deliveryAddress/findCurrentDefault',
    method: 'post'
  })
}