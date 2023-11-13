import request from '@/utils/request'
export function infoById(id) {
  return request({
    url: 'event/info/' + id,
    method: 'get'
  })
}
export function load(pageNum, pageSize) {
  return request({
    url: 'event/load',
    method: 'get',
    params: { pageNum, pageSize }
  })
}

export function deleteEvent(eventId) {
  return new Promise((resolve, reject) => {
    return request({
      url: '/event/delete',
      method: 'post',
      params: { eventId }
    }).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}
export function uploadImage(data) {
  return new Promise((resolve, reject) => {
    return request({
      url: '/event/upload',
      method: 'post',
      data
    }).then((response) => {
      resolve(response.data.image)
    }).catch(error => {
      reject(error)
    })
  })
}
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
