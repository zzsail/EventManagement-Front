import request from '@/utils/request'

// 删除
export function deleteAward(awardId) {
  return request({
    url: 'award/delete',
    method: 'post',
    params: { awardId }
  })
}
// 分页查询
export function page(tableQuery) {
  const { pageNum, pageSize, awardName } = tableQuery
  return request({
    url: 'award/page',
    method: 'get',
    params: { pageNum, pageSize, awardName }
  })
}

// 更新
export function update(data) {
  return request({
    url: 'award/update',
    method: 'put',
    data
  })
}

// 添加
export function create(data) {
  return request({
    url: 'award/create',
    method: 'post',
    data
  })
}
