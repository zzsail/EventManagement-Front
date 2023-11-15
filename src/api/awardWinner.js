import request from '@/utils/request'

// 颁奖
export function awards(awardId, username) {
  return request({
    url: 'awardWinner/awards',
    method: 'post',
    params: { awardId, username }
  })
}

// 颁奖
export function page(tableQuery) {
  const { pageNum, pageSize } = tableQuery
  return request({
    url: 'awardWinner/page',
    method: 'get',
    params: { pageNum, pageSize }
  })
}
