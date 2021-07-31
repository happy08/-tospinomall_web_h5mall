import request from './request';
import qs from 'qs';
import { encrypt } from './cryptoAES'; // 加密解密

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
 * 修改密码
 */
export function updatePassword(data) {
  return request({
    url: '/api/admin/ums/buyer/updatePassword',
    method: 'post',
    data: qs.stringify({ ...data, newPassword: encrypt(data.newPassword), oldPassword: encrypt(data.oldPassword) })
  })
}

/**
 * 校验登录密码
 */
export function checkPassword(password) {
  return request({
    url: '/api/admin/ums/buyer/checkPassword',
    method: 'post',
    data: qs.stringify({ password: encrypt(password) })
  })
}

/**
 * 获取当前登录人的手机或邮箱验证码
 */
export function getCurrentCode(type) {
  return request({
    url: '/api/admin/ums/checkcode/getCurrentPhoneCode',
    method: 'get',
    params: {
      type: type,
      userType: 'buyer'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 校验当前登录人的手机或邮箱验证码
 */
export function checkCurrentCode(data) {
  return request({
    url: '/api/admin/ums/checkcode/checkCurrentPhoneOrEmail',
    method: 'post',
    data: qs.stringify({
      ...data,
      userType: 'buyer'
    })
  })
}

/**
 * 获取语言列表
 */
export function getLangList(type = 'sys_language_type') {
  return request({
    url: `/api/admin/dict/type/${type}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}