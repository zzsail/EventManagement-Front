import request from '@/utils/request'

export function createCategory(data) {
  return new Promise((resolve, reject) => {
    return request({
      url: '/eventCategory/create',
      method: 'post',
      data
    }).then((response) => {
      resolve(response.data.eventCategory)
    }).catch(error => {
      reject(error)
    })
  })
}
export function listCategory() {
  return new Promise((resolve, reject) => {
    return request({
      url: '/eventCategory/list',
      method: 'get'
    }).then((response) => {
      resolve(response.data.eventCategoryName)
    }).catch(error => {
      reject(error)
    })
  })
}
