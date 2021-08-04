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

/**
 * 充值卡查询
 */
export function getRechargeCard() {
  return request({
    url: '/api/basics/baseRechargeCard/buyer/findMmsBaseRechargeCardList',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 买家充值
 */
export function buyerRecharge(data) {
  return request({
    url: '/api/finance/buyerExpensesDetail/buyer/rechargeBalance',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 买家取消充值
 */
export function buyerCancelRecharge(refNo) {
  return request({
    url: '/api/finance/buyerExpensesDetail/buyer/cancelRecharge',
    method: 'post',
    data: qs.stringify({
      refNo: refNo
    })
  })
}

/**
 * 买家充值是否支付成功
 */
export function checkBuyerRecharge(refNo) {
  return request({
    url: '/api/finance/buyerExpensesDetail/buyer/isSuccess',
    method: 'get',
    params: {
      refNo: refNo
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 买家余额充值回调-仅限测试环境使用
 */
export function callBackRecharge(tradeNo) {
  return request({
    url: '/api/finance/buyerExpensesDetail/buyer/rechargeBalanceCallBack',
    method: 'post',
    data: qs.stringify({
      tradeNo: tradeNo
    })
  })
}

/**
 * 获取可用支付方式
 */
export function getAvailable() {
  return request({
    url: '/api/finance/uniwallet/get/available/networks',
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 买家-收入支出列表
 */
export function getBillList(params) {
  return request({
    url: '/api/finance/buyerExpensesDetail/buyer/findIncomeExpenditurePage',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 收支明细
 */
export function getBillDetail(id) {
  return request({
    url: '/api/finance/buyerExpensesDetail/buyer/findById',
    method: 'get',
    params: {
      id: id
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 支付订单
 */
export function payOrder(data) {
  let _data = data;
  if (_data.pwd) {
    _data = {
      ...data,
      pwd: encrypt(data.pwd)
    }
  }
  return request({
    url: '/api/order/pay/order',
    method: 'post',
    data: _data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 取消支付
 */
export function cancelPayOrder(refNo) {
  return request({
    url: '/api/order/pay/cancelPay',
    method: 'get',
    params: {
      refNo: refNo
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 检查是否支付订单
 */
export function checkPayOrder(refNo) {
  return request({
    url: '/api/order/pay/checkIsPay',
    method: 'get',
    params: {
      refNo: refNo
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}