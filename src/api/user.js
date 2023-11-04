import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
// 登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 注册 用user接收
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
// 完善信息 提供性别 年龄 用户名
export function improveInfo(data) {
  return request({
    url: 'user/improveInfo',
    method: 'post',
    data
  })
}
// 分页查询
export function page(pageNum, pageSize, username) {
  return request({
    url: 'user/page',
    method: 'get',
    params: { pageNum, pageSize, username }
  })
}
