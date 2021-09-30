import qs from 'qs';
import request from './request';

/**
 * 买家-消息列表查询
 */
export function getMsgList(params) {
  return request({
    url: '/sock/message/buyer/findMsgPage',
    method: 'get',
    params
  })
}

/**
 * 买家-消息分类查询
 */
export function getMsgCategory() {
  return request({
    url: '/sock/message/buyer/msgCategory',
    method: 'get'
  })
}

/**
 * 标记消息为已读
 */
export function markedAsReadAll() {
  return request({
    url: '/sock/message/buyer/markedAsReadAll',
    method: 'post'
  })
}

/**
 * 单个消息标记为已读
 */
export function markedSingleAsRead(categoryId) {
  return request({
    url: '/sock/message/buyer/markedAsRead',
    method: 'post',
    data: {
      categoryId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}