import request from './request';

/**
 * 查询搜索下拉提示
 */
export function getSearchPull(data) {
  return request({
    url: '/api/search/productsearch/getSuggestionResult',
    method: 'post',
    data
  })
}