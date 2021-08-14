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