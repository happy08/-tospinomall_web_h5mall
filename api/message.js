import request from './request';

/**
 * 买家-消息列表查询
 */
export function getMsgList(params) {
  return request({
    url: '/api/sock/message/buyer/findMsgPage',
    method: 'get',
    params
  })
}

/**
 * 买家-消息分类查询
 */
export function getMsgCategory() {
  return request({
    url: '/api/sock/message/buyer/msgCategory',
    method: 'get'
  })
}