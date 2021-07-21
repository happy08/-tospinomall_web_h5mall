import request from './request';

import qs from 'qs';
// import { encrypt } from './cryptoAES'; // 加密解密

/**
 * 获取用户信息
 */
export function getUserInfo(token) {
  return request({
    url: '/api/admin/ums/buyer/findCurrentUserinfo',
    method: 'get',
    headers: {
      Authorization: token
    }
  })
}

/**
 * 修改用户信息
 */
export function updateUserInfo(data) {
  return request({
    url: '/api/admin/ums/buyer/updateUserinfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 上传图片, 获取图片链接
 */
export function getPicUrl(data) {
  return request({
    url: '/api/admin/oss/create/object/product-pic-bucket/user_pic',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'form-data'
    }
  })
}

/**
 * 获取收货地址列表
 * type 1：收货地址，2：退货地址
 * sendModel 1：直发模式，2：集货仓模式
 */
export function getAddressList(params) {
  return request({
    url: '/api/basics/base/fbt/address/find',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}