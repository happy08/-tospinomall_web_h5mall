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