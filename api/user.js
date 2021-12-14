import request from './request';
import qs from 'qs';
import { encrypt } from './cryptoAES'; // 加密解密

/**
 * 修改用户信息
 */
export function updateUserInfo(data) {
  return request({
    url: '/admin/ums/buyer/updateUserinfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 上传图片, 获取图片链接
 */
export function getPicUrl(data) {
  return request({
    url: '/admin/oss/create/object/product-pic-bucket/user_pic',
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
    url: '/admin/ums/buyer/updatePassword',
    method: 'post',
    data: qs.stringify({ ...data, newPassword: encrypt(data.newPassword), oldPassword: encrypt(data.oldPassword) })
  })
}

/**
 * 校验登录密码
 */
export function checkPassword(password) {
  return request({
    url: '/admin/ums/buyer/checkPassword',
    method: 'post',
    data: qs.stringify({ password: encrypt(password) })
  })
}

/**
 * 获取当前登录人的手机或邮箱验证码
 */
export function getCurrentCode(type) {
  return request({
    url: '/admin/ums/checkcode/getCurrentPhoneCode',
    method: 'get',
    params: {
      type: type,
      userType: 'buyer'
    }
  })
}

/**
 * 校验当前登录人的手机或邮箱验证码
 */
export function checkCurrentCode(data) {
  return request({
    url: '/admin/ums/checkcode/checkCurrentPhoneOrEmail',
    method: 'post',
    data: qs.stringify({
      ...data,
      userType: 'buyer'
    })
  })
}

/**
 * 查询字典接口
 */
export function getDictList(type) {
  return request({
    // url: `/admin/dict/type/${type}`,
    url: `/basics/dict/type/${type}`,
    method: 'get'
  })
}

/**
 * 获取反馈类型列表
 */
export function getFeedbackTypeList() {
  return request({
    url: '/basics/operateFeedbackCategory/findList',
    method: 'get'
  })
}

/**
 * 买家反馈消息
 */
export function operateFeedback(data) {
  return request({
    url: '/basics/operateFeedbackMsg/buyer/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 商品详情获取分享内容
 */
export function getShareDetail(goodsId) {
  return request({
    url: '/basics/mmsoperateenjoy/findByGoodsId',
    method: 'post',
    data: qs.stringify({
      goodsId: goodsId
    })
  })
}