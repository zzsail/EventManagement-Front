import request from '@/utils/request'

export function page(data) {
  const { pageNum, pageSize, eventName } = data
  return new Promise((resolve, reject) => {
    return request({
      url: '/event/page',
      method: 'get',
      params: { pageNum, pageSize, eventName }
    }).then((response) => {
      resolve(response.data.items)
    }).catch(error => {
      reject(error)
    })
  })
}
export function update(data) {
  return new Promise((resolve, reject) => {
    return request({
      url: '/event/update',
      method: 'put',
      data
    }).then((response) => {
      resolve(response.data.event)
    }).catch(error => {
      reject(error)
    })
  })
}
export function create(data) {
  return new Promise((resolve, reject) => {
    return request({
      url: '/event/create',
      method: 'post',
      data
    }).then((response) => {
      resolve(response.data.event)
    }).catch(error => {
      reject(error)
    })
  })
}
