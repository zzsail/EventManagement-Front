import request from '@/utils/request'

// 删除
export function delelteParticipant(participantId) {
  return request({
    url: 'participant/delete',
    method: 'post',
    params: { participantId }
  })
}
// 分页查询
export function page(tableQuery) {
  const { pageNum, pageSize, participantName } = tableQuery
  return request({
    url: 'participant/page',
    method: 'get',
    params: { pageNum, pageSize, participantName }
  })
}

// 更新
export function update(data) {
  return request({
    url: 'participant/update',
    method: 'put',
    data
  })
}

// 添加
export function create(data) {
  return request({
    url: 'participant/create',
    method: 'post',
    data
  })
}
