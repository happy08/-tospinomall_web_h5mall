import request from './request';
import qs from 'qs';
import { encrypt } from './cryptoAES'; // 加密解密
import _i18n from '@/plugins/vue-i18n';
import { getCookie } from './utils';

// 前端做了api前缀处理代理，所以所有的接口都需要加上前缀/api才可以和设置匹配, post请求需要将参数转化为字符串

/**
 * 获取手机号前缀
 */
export function getPhonePrefix() {
  return request({
    url: '/basics/base/phonePrefix/find/0',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取手机验证码
 */
export function getPhoneCode(params) {
  return request({
    url: '/admin/ums/checkcode/getPhoneCode',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 校验用户手机
 */
 export function checkPhoneCode(data) { // 校验用户手机号码
  return request({
    url: '/admin/ums/checkcode/checkPhone',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 获取邮箱验证码
 */
 export function getEmailCode(params) { // 获取邮箱验证码
  return request({
    url: '/admin/ums/checkcode/getEmailCode',
    method: 'get',
    params
  })
}

/**
 * 校验邮箱验证码
 */
export function checkEmailCode(params) { // 校验用户邮箱验证码
  return request({
    url: '/admin/ums/checkcode/checkEmailCode',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * 买家用户注册
 */
export function buyerRegister(params) { // 买家用户注册
  return request({
    url: '/admin/ums/buyer/register',
    method: 'post',
    data: qs.stringify({ ...params, password: encrypt(params.password), repeatPassword: encrypt(params.repeatPassword) })
  })
}

/**
 * 账号登录
 */
export function authLogin(params) { // 账号登录
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    data: qs.stringify({ ...params, password: encrypt(params.password) }),
    headers: {
      clientType: 'h5',
      version: '1.0.0',
      language: getCookie('lang'),
      Authorization: 'Basic YnV5ZXI6YnV5ZXI='
    }
  })
}

/**
 * 手机/邮箱 验证码登录
 */
export function authCodeLogin(params) {
  return request({
    url: '/auth/mobile/token/sms',
    method: 'post',
    data: qs.stringify({ grant_type: 'mobile', ...params }),
    headers: {
      clientType: 'h5',
      version: '1.0.0',
      language: getCookie('lang')
    }
  })
}

/**
 * 忘记密码-修改密码
 */
export function forgetPwd(params) {
  return request({
    url: '/admin/ums/buyer/forgetPassword',
    method: 'post',
    data: qs.stringify({ ...params, password: encrypt(params.password), repeatPassword: encrypt(params.repeatPassword) })
  })
}

/**
 * 退出
 */
export function logout() {
  return request({
    url: '/auth/token/logout',
    method: 'delete',
    headers: {
      Authorization: getCookie('authToken')
    }
  })
}

/**
 * 谷歌登录
 */
export function googleLogin(data) {
  return request({
    url: '/auth/mobile/token/social',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      clientType: 'h5',
      version: '1.0.0',
      language: getCookie('lang')
    }
  })
}

/**
 * facebook登录
 */
export function facebookLogin(data) {
  return request({
    url: '/auth/mobile/token/social',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      clientType: 'h5',
      version: '1.0.0',
      language: getCookie('lang')
    }
  })
}