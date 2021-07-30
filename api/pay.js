import request from './request';
import qs from 'qs';
import { encrypt } from './cryptoAES'; // 加密解密

/**
 * 首次设置支付密码
 */
export function firstSetPayPwd(data) {
  return request({
    url: '/api/admin/ums/buyer/firstSetPayPassword',
    method: 'post',
    data: qs.stringify({ 
      ...data,
      payPassword: encrypt(data.payPassword),
      repeatPayPassword: encrypt(data.repeatPayPassword)
    })
  })
}

/**
 * 修改支付密码
 */
export function updatePayPwd(data) {
  let _data = {
    ...data,
    newPayPassword: encrypt(data.newPayPassword),
  };
  if (data.oldPayPassword) _data.oldPayPassword = encrypt(data.oldPayPassword);
  return request({
    url: '/api/admin/ums/buyer/updatePayPassword',
    method: 'post',
    data: qs.stringify(_data)
  })
}

/**
 * 校验支付密码
 */
export function checkPayPwd(payPassword) {
  return request({
    url: '/api/admin/ums/buyer/checkPayPassword',
    method: 'post',
    data: qs.stringify({
      payPassword: encrypt(payPassword)
    })
  })
}