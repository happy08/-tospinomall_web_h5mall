import request from './request';

/**
 * 查询搜索下拉提示
 */
export function getSearchPull(data) {
  return request({
    url: '/search/productsearch/getSuggestionResult',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}